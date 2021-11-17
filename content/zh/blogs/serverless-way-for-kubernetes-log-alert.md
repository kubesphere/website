---
title: 'OpenFunction 应用系列之一: 以 Serverless 的方式实现 Kubernetes 日志告警'
tag: 'OpenFunction, KubeSphere, Kubernetes'
keywords: 'penFunction, Serverless, KubeSphere, Kubernetes, Kafka, FaaS, 无服务器'
description: '本文提供了一种基于 Serverless 的日志处理思路，可以在降低该任务链路成本的同时提高其灵活性。'
createTime: '2021-08-26'
author: '方阗'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202109031518797.png'
---
## 概述

当我们将容器的日志收集到消息服务器之后，我们该如何处理这些日志？部署一个专用的日志处理工作负载可能会耗费多余的成本，而当日志体量骤增、骤降时亦难以评估日志处理工作负载的待机数量。本文提供了一种基于 Serverless 的日志处理思路，可以在降低该任务链路成本的同时提高其灵活性。

我们的大体设计是使用 Kafka 服务器作为日志的接收器，之后以输入 Kafka 服务器的日志作为事件，驱动 Serverless 工作负载对日志进行处理。据此的大致步骤为：

1. 搭建 Kafka 服务器作为 Kubernetes 集群的日志接收器
2. 部署 OpenFunction 为日志处理工作负载提供 Serverless 能力
3. 编写日志处理函数，抓取特定的日志生成告警消息
4. 配置 [Notification Manager](https://github.com/kubesphere/notification-manager/) 将告警发送至 Slack

![](https://pek3b.qingstor.com/kubesphere-community/images/202108261124546.png)

在这个场景中，我们会利用到 [OpenFunction](https://github.com/OpenFunction/OpenFunction) 带来的 Serverless 能力。

> [OpenFunction](https://github.com/OpenFunction/OpenFunction) 是 KubeSphere 社区开源的一个 FaaS（Serverless）项目，旨在让用户专注于他们的业务逻辑，而不必关心底层运行环境和基础设施。该项目当前具备以下关键能力：
>
> - 支持通过 dockerfile 或 buildpacks 方式构建 OCI 镜像
> - 支持使用 Knative Serving 或  OpenFunctionAsync ( KEDA + Dapr ) 作为 runtime 运行 Serverless 工作负载
> - 自带事件驱动框架

## 使用 Kafka 作为日志接收器

首先，我们为 KubeSphere 平台开启 **logging** 组件（可以参考 [启用可插拔组件](https://kubesphere.io/zh/docs/pluggable-components/) 获取更多信息）。然后我们使用 [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator) 搭建一个最小化的 Kafka 服务器。

1. 在 default 命名空间中安装 [strimzi-kafka-operator](https://github.com/strimzi/strimzi-kafka-operator) ：

   ```shell
   helm repo add strimzi https://strimzi.io/charts/
   helm install kafka-operator -n default strimzi/strimzi-kafka-operator
   ```

2. 运行以下命令在 default 命名空间中创建 Kafka 集群和 Kafka 主题，该命令所创建的 Kafka 和 Zookeeper 集群的存储类型为 **ephemeral**，使用 emptyDir 进行演示。

   > 注意，我们此时创建了一个名为 “logs” 的 topic，后续会用到它

   ```shell
   cat <<EOF | kubectl apply -f -
   apiVersion: kafka.strimzi.io/v1beta2
   kind: Kafka
   metadata:
     name: kafka-logs-receiver
     namespace: default
   spec:
     kafka:
       version: 2.8.0
       replicas: 1
       listeners:
         - name: plain
           port: 9092
           type: internal
           tls: false
         - name: tls
           port: 9093
           type: internal
           tls: true
       config:
         offsets.topic.replication.factor: 1
         transaction.state.log.replication.factor: 1
         transaction.state.log.min.isr: 1
         log.message.format.version: '2.8'
         inter.broker.protocol.version: "2.8"
       storage:
         type: ephemeral
     zookeeper:
       replicas: 1
       storage:
         type: ephemeral
     entityOperator:
       topicOperator: {}
       userOperator: {}
   ---
   apiVersion: kafka.strimzi.io/v1beta1
   kind: KafkaTopic
   metadata:
     name: logs
     namespace: default
     labels:
       strimzi.io/cluster: kafka-logs-receiver
   spec:
     partitions: 10
     replicas: 3
     config:
       retention.ms: 7200000
       segment.bytes: 1073741824
   EOF
   ```

3. 运行以下命令查看 Pod 状态，并等待 Kafka 和 Zookeeper 运行并启动。

   ```shell
   $ kubectl get po
   NAME                                                   READY   STATUS        RESTARTS   AGE
   kafka-logs-receiver-entity-operator-568957ff84-nmtlw   3/3     Running       0          8m42s
   kafka-logs-receiver-kafka-0                            1/1     Running       0          9m13s
   kafka-logs-receiver-zookeeper-0                        1/1     Running       0          9m46s
   strimzi-cluster-operator-687fdd6f77-cwmgm              1/1     Running       0          11m
   ```

   运行以下命令查看 Kafka 集群的元数据：

   ```shell
   # 启动一个工具 pod
   $ kubectl run utils --image=arunvelsriram/utils -i --tty --rm
   # 查看 Kafka 集群的元数据
   $ kafkacat -L -b kafka-logs-receiver-kafka-brokers:9092
   ```

我们将这个 Kafka 服务器添加为日志接收器。

1. 以 **admin** 身份登录 KubeSphere 的 Web 控制台。点击左上角的**平台管理**，然后选择**集群管理**。

   > 如果您启用了[多集群功能](https://kubesphere.io/zh/docs/multicluster-management/)，您可以选择一个集群。

2. 在**集群管理**页面，选择**集群设置**下的**日志收集**。

3. 点击**添加日志接收器**并选择 **Kafka**。输入 Kafka 代理地址和端口信息，然后点击**确定**继续。

![](https://i.imgur.com/RcIcQ3a.png)


4. 运行以下命令验证 Kafka 集群是否能从 Fluent Bit 接收日志：

   ```shell
   # 启动一个工具 pod
   $ kubectl run utils --image=arunvelsriram/utils -i --tty --rm 
   # 检查 logs topic 中的日志情况
   $ kafkacat -C -b kafka-logs-receiver-kafka-0.kafka-logs-receiver-kafka-brokers.default.svc:9092 -t logs
   ```

## 部署 OpenFunction

按照概述中的设计，我们需要先部署 OpenFunction。OpenFunction 项目引用了很多第三方的项目，如 Knative、Tekton、ShipWright、Dapr、KEDA 等，手动安装较为繁琐，推荐使用 [Prerequisites 文档](https://github.com/OpenFunction/OpenFunction#prerequisites) 中的方法，一键部署 OpenFunction 的依赖组件。

> 其中 `--with-shipwright` 表示部署 shipwright 作为函数的构建驱动
> `--with-openFuncAsync` 表示部署 OpenFuncAsync Runtime 作为函数的负载驱动
> 而当你的网络在访问 Github 及 Google 受限时，可以加上 `--poor-network` 参数用于下载相关的组件
```shell
sh hack/deploy.sh --with-shipwright --with-openFuncAsync --poor-network
```

部署 OpenFunction：

> 此处选择安装最新的稳定版本，你也可以使用开发版本，参考 [Install 文档](https://github.com/OpenFunction/OpenFunction#install)
>
> 为了可以正常使用 ShipWright ，我们提供了默认的构建策略，可以使用以下命令设置该策略：
>
> ```shell
> kubectl apply -f https://raw.githubusercontent.com/OpenFunction/OpenFunction/main/config/strategy/openfunction.yaml
> ```
```shell
kubectl apply -f https://github.com/OpenFunction/OpenFunction/releases/download/v0.3.0/bundle.yaml
```

## 编写日志处理函数

我们以 [创建并部署 WordPress](https://kubesphere.io/zh/docs/quick-start/wordpress-deployment/) 为例，搭建一个 WordPress 应用作为日志的生产者。该应用的工作负载所在的命名空间为 “demo-project”，Pod 名称为 “wordpress-v1-f54f697c5-hdn2z”。

当请求结果为 404 时，我们收到的日志内容如下：
```json
{"@timestamp":1629856477.226758,"log":"*.*.*.* - - [25/Aug/2021:01:54:36 +0000] \"GET /notfound HTTP/1.1\" 404 49923 \"-\" \"curl/7.58.0\"\n","time":"2021-08-25T01:54:37.226757612Z","kubernetes":{"pod_name":"wordpress-v1-f54f697c5-hdn2z","namespace_name":"demo-project","container_name":"container-nrdsp1","docker_id":"bb7b48e2883be0c05b22c04b1d1573729dd06223ae0b1676e33a4fac655958a5","container_image":"wordpress:4.8-apache"}}

```

我们的需求是：当一个请求结果为 404 时，发送一个告警通知给接收器（可以根据 [配置 Slack 通知](https://kubesphere.io/zh/docs/cluster-administration/platform-settings/notification-management/configure-slack/) 配置一个 Slack 告警接收器），并记录命名空间、Pod 名称、请求路径、请求方法等信息。按照这个需求，我们编写一个简单的处理函数：
> 你可以从 [OpenFunction Context Spec](https://github.com/OpenFunction/functions-framework/blob/main/docs/OpenFunction-context-specs.md) 处了解 **openfunction-context** 的使用方法，这是 OpenFunction 提供给用户编写函数的工具库
> 你可以通过 [OpenFunction Samples](https://github.com/OpenFunction/samples) 了解更多的 OpenFunction 函数案例 

```go
package logshandler

import (
	"encoding/json"
	"fmt"
	"log"
	"regexp"
	"time"

	ofctx "github.com/OpenFunction/functions-framework-go/openfunction-context"
	alert "github.com/prometheus/alertmanager/template"
)

const (
	HTTPCodeNotFound = "404"
	Namespace        = "demo-project"
	PodName          = "wordpress-v1-[A-Za-z0-9]{9}-[A-Za-z0-9]{5}"
	AlertName        = "404 Request"
	Severity         = "warning"
)

// LogsHandler ctx 参数提供了用户函数在集群语境中的上下文句柄，如 ctx.SendTo 用于将数据发送至指定的目的地
// LogsHandler in 参数用于将输入源中的数据（如有）以 bytes 的方式传递给函数
func LogsHandler(ctx *ofctx.OpenFunctionContext, in []byte) int {
	content := string(in)
	// 这里我们设置了三个正则表达式，分别用于匹配 HTTP 返回码、资源命名空间、资源 Pod 名称
	matchHTTPCode, _ := regexp.MatchString(fmt.Sprintf(" %s ", HTTPCodeNotFound), content)
	matchNamespace, _ := regexp.MatchString(fmt.Sprintf("namespace_name\":\"%s", Namespace), content)
	matchPodName := regexp.MustCompile(fmt.Sprintf(`(%s)`, PodName)).FindStringSubmatch(content)

	if matchHTTPCode && matchNamespace && matchPodName != nil {
		log.Printf("Match log - Content: %s", content)

		// 如果上述三个正则表达式同时命中，那么我们需要提取日志内容中的一些信息，用于填充至告警信息中
		// 这些信息为：404 请求的请求方式（HTTP Method）、请求路径（HTTP Path）以及 Pod 名称
		match := regexp.MustCompile(`([A-Z]+) (/\S*) HTTP`).FindStringSubmatch(content)
		if match == nil {
			return 500
		}
		path := match[len(match)-1]
		method := match[len(match)-2]
		podName := matchPodName[len(matchPodName)-1]

		// 收集到关键信息后，我们使用 altermanager 的 Data 结构体组装告警信息
		notify := &alert.Data{
			Receiver:          "notification_manager",
			Status:            "firing",
			Alerts:            alert.Alerts{},
			GroupLabels:       alert.KV{"alertname": AlertName, "namespace": Namespace},
			CommonLabels:      alert.KV{"alertname": AlertName, "namespace": Namespace, "severity": Severity},
			CommonAnnotations: alert.KV{},
			ExternalURL:       "",
		}
		alt := alert.Alert{
			Status: "firing",
			Labels: alert.KV{
				"alertname": AlertName,
				"namespace": Namespace,
				"severity":  Severity,
				"pod":       podName,
				"path":      path,
				"method":    method,
			},
			Annotations:  alert.KV{},
			StartsAt:     time.Now(),
			EndsAt:       time.Time{},
			GeneratorURL: "",
			Fingerprint:  "",
		}
		notify.Alerts = append(notify.Alerts, alt)
		notifyBytes, _ := json.Marshal(notify)

		// 使用 ctx.SendTo 将内容发送给名为 "notification-manager" 的输出端（你可以在之后的函数配置 logs-handler-function.yaml 中找到它的定义）
		if err := ctx.SendTo(notifyBytes, "notification-manager"); err != nil {
			panic(err)
		}
		log.Printf("Send log to notification manager.")
	}
	return 200
}

```

我们将这个函数上传到代码仓库中，记录**代码仓库的地址**以及**代码在仓库中的目录路径**，在下面的创建函数步骤中我们将使用到这两个值。
> 你可以在 [OpenFunction Samples](https://github.com/OpenFunction/samples/tree/main/functions/OpenFuncAsync/logs-handler-function) 中找到这个案例。

## 创建函数

接下来我们将使用 OpenFunction 构建上述的函数。首先设置一个用于访问镜像仓库的秘钥文件 **push-secret**（在使用代码构建出 OCI 镜像后，OpenFunction 会将该镜像上传到用户的镜像仓库中，用于后续的负载启动）：

```shell
REGISTRY_SERVER=https://index.docker.io/v1/ REGISTRY_USER=<your username> REGISTRY_PASSWORD=<your password>
kubectl create secret docker-registry push-secret \
    --docker-server=$REGISTRY_SERVER \
    --docker-username=$REGISTRY_USER \
    --docker-password=$REGISTRY_PASSWORD
```

应用函数 **logs-handler-function.yaml**：

> 函数定义中包含了对两个关键组件的使用：
>
> [Dapr](https://dapr.io/) 对应用程序屏蔽了复杂的中间件，使得 logs-handler 可以非常容易地处理 Kafka 中的事件
>
> [KEDA](https://keda.sh/) 通过监控消息服务器中的事件流量来驱动 logs-handler 函数的启动，并且根据 Kafka 中消息的消费延时动态扩展 logs-handler 实例

```yaml
apiVersion: core.openfunction.io/v1alpha1
kind: Function
metadata:
  name: logs-handler
spec:
  version: "v1.0.0"
  # 这里定义了构建后的镜像的上传路径
  image: openfunctiondev/logs-async-handler:v1
  imageCredentials:
    name: push-secret
  build:
    builder: openfunctiondev/go115-builder:v0.2.0
    env:
      FUNC_NAME: "LogsHandler"
    # 这里定义了源代码的路径
    # url 为上面提到的代码仓库地址
    # sourceSubPath 为代码在仓库中的目录路径
    srcRepo:
      url: "https://github.com/OpenFunction/samples.git"
      sourceSubPath: "functions/OpenFuncAsync/logs-handler-function/"
  serving:
    # OpenFuncAsync 是 OpenFunction 通过 KEDA+Dapr 实现的一种由事件驱动的异步函数运行时
    runtime: "OpenFuncAsync"
    openFuncAsync:
      # 此处定义了函数的输入（kafka-receiver）和输出（notification-manager），与下面 components 中的定义对应关联
      dapr:
        inputs:
          - name: kafka-receiver
            type: bindings
        outputs:
          - name: notification-manager
            type: bindings
            params:
              operation: "post"
              type: "bindings"
        annotations:
          dapr.io/log-level: "debug"
        # 这里完成了上述输入端和输出端的具体定义（即 Dapr Components）
        components:
          - name: kafka-receiver
            type: bindings.kafka
            version: v1
            metadata:
              - name: brokers
                value: "kafka-logs-receiver-kafka-brokers:9092"
              - name: authRequired
                value: "false"
              - name: publishTopic
                value: "logs"
              - name: topics
                value: "logs"
              - name: consumerGroup
                value: "logs-handler"
          # 此处为 KubeSphere 的 notification-manager 地址
          - name: notification-manager
            type: bindings.http
            version: v1
            metadata:
              - name: url
                value: http://notification-manager-svc.kubesphere-monitoring-system.svc.cluster.local:19093/api/v2/alerts
      keda:
        scaledObject:
          pollingInterval: 15
          minReplicaCount: 0
          maxReplicaCount: 10
          cooldownPeriod: 30
          # 这里定义了函数的触发器，即 Kafka 服务器的 “logs” topic
          # 同时定义了消息堆积阈值（此处为 10），即当消息堆积量超过 10，logs-handler 实例个数就会自动扩展
          triggers:
            - type: kafka
              metadata:
                topic: logs
                bootstrapServers: kafka-logs-receiver-kafka-brokers.default.svc.cluster.local:9092
                consumerGroup: logs-handler
                lagThreshold: "10"
```

## 结果演示

我们先关闭 Kafka 日志接收器：在**日志收集**页面，点击进入 Kafka 日志接收器详情页面，然后点击**更多操作**并选择**更改状态**，将其设置为**关闭**。

停用后一段时间，我们可以观察到 logs-handler 函数实例已经收缩到 0 了。

再将 Kafka 日志接收器**激活**，logs-handler 随之启动。

```shell
~# kubectl get po --watch
NAME                                                     READY   STATUS        RESTARTS   AGE
kafka-logs-receiver-entity-operator-568957ff84-tdrrx     3/3     Running       0          7m27s
kafka-logs-receiver-kafka-0                              1/1     Running       0          7m48s
kafka-logs-receiver-zookeeper-0                          1/1     Running       0          8m12s
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-b9d6f   2/2     Terminating   0          34s
strimzi-cluster-operator-687fdd6f77-kc8cv                1/1     Running       0          10m
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-b9d6f   2/2     Terminating   0          36s
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-b9d6f   0/2     Terminating   0          37s
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-b9d6f   0/2     Terminating   0          38s
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-b9d6f   0/2     Terminating   0          38s
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-9kj2c   0/2     Pending       0          0s
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-9kj2c   0/2     Pending       0          0s
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-9kj2c   0/2     ContainerCreating   0          0s
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-9kj2c   0/2     ContainerCreating   0          2s
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-9kj2c   1/2     Running             0          4s
logs-handler-serving-kpngc-v100-zcj4q-5f46996f8c-9kj2c   2/2     Running             0          11s
```

接着我们向 WordPress 应用一个不存在的路径发起请求：

```shell
curl http://<wp-svc-address>/notfound
```

可以看到 Slack 中已经收到了这条消息（与之对比的是，当我们正常访问该 WordPress 站点时， Slack 中并不会收到告警消息）：

![](https://i.imgur.com/YQc5uOq.png)

### 进一步探索

同步函数的解决方案：

为了可以正常使用 Knative Serving ，我们需要设置其网关的负载均衡器地址。（你可以使用本机地址作为 workaround）

```bash
# 将下面的 "1.2.3.4" 替换为实际场景中的地址。
$ kubectl patch svc -n kourier-system kourier \
-p '{"spec": {"type": "LoadBalancer", "externalIPs": ["1.2.3.4"]}}'

$ kubectl patch configmap/config-domain -n knative-serving \
-type merge --patch '{"data":{"1.2.3.4.sslip.io":""}}'
```

除了直接由 Kafka 服务器驱动函数运作（异步方式），OpenFunction 还支持使用自带的事件框架对接 Kafka 服务器，之后以 Sink 的方式驱动 Knative 函数运作。可以参考 [OpenFunction Samples](https://github.com/OpenFunction/samples/tree/main/functions/Knative/logs-handler-function) 中的案例。
  
在该方案中，同步函数的处理速度较之异步函数有所降低，当然我们同样可以借助 KEDA 来触发 Knative Serving 的 concurrency 机制，但总体而言缺乏异步函数的便捷性。（后续的阶段中我们会优化 OpenFunction 的事件框架来解决同步函数这方面的缺陷）
  
由此可见，不同类型的 Serverless 函数有其擅长的任务场景，如一个有序的控制流函数就需要由同步函数而非异步函数来处理。
  
## 综述

Serverless 带来了我们所期望的对业务场景快速拆解重构的能力。

如本案例所示，OpenFunction 不但以 Serverless 的方式提升了日志处理、告警通知链路的灵活度，还通过函数框架将通常对接 Kafka 时复杂的配置步骤简化为语义明确的代码逻辑。同时，我们也在不断演进 OpenFunction，将在之后版本中实现由自身的 Serverless 能力驱动自身的组件运作。