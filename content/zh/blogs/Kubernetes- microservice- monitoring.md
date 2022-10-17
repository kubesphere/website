---
title: '在 Kubernetes 中实现微服务应用监控'
tag: 'KubeSphere, Kubernetes'
keywords: 'KubeSphere, Kubernetes, 微服务, Prometheus'
description: 'KubeSphere 平台本身提供了监控功能，包括节点状态、集群资源使用率、Etcd、API Server 等监控，不过缺少了应用级别的监控。本篇文章我们基于 Prometheus 和 Grafana 实现微服务应用监控。'
createTime: '2022-10-15'
author: '张坚'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/k8s-microservice-monitoring-cover.png'
---

> 张坚，科大讯飞开发工程师，云原生爱好者。

本篇文章我们基于 Prometheus 和 Grafana 实现微服务应用监控。

![](https://pek3b.qingstor.com/kubesphere-community/images/20220927141938.png)

> KubeSphere 平台本身提供了监控功能，包括节点状态、集群资源使用率、Etcd、API Server 等监控，不过缺少了应用级别的监控。

## 引入依赖包

在应用中引入监控所需要的 jar 包，包含 Prometheus 和 Actuator。

```xml
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-actuator</artifactId>  
</dependency>  

<dependency>
    <groupId>io.micrometer</groupId>  
    <artifactId>micrometer-registry-prometheus</artifactId>  
</dependency>
```

引入这 2 个包以后就通过 Prometheus 抓取到应用的监控信息。

## 修改应用配置，暴露监控端口

```yaml
management:
  endpoints:  
    web:  
      exposure:  
        include: "*"  
      base-path: /
  metrics:  
    tags:  
      application: ${spring.application.name}
```

- management.server.port：启用独立的端口来提供监控，未配置的情况下共用应用端口；
- management.metrics.tags.xxx：在统计信息中添加自定义的标签；
- management.endpoints.web.exposure.include：用于包含我们要公开的端点列表 , 我们这里设置为* 代表所有。
- management.endpoints.web.base-path：用于设置 Promethues 的监控路径，默认是通过 `/actuator/prometheus` 访问，这样配置以后只需要通过 `/prometheus` 访问

配置完成后重启服务，通过浏览器访问 `localhost:8080/prometheus` 即可抓取到 Prometheus 的监控数据，效果如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/20220928154733.png)

## 修改 Service 配置

```yaml
kind: Service
apiVersion: v1
metadata:
  name: spring-cloud-provider-service
  namespace: cloud-demo
  labels:
    app: spring-cloud-provider-service
    micrometer-prometheus-discovery: 'true'
spec:
  ports:
    - name: metrics
      protocol: TCP
      port: 8080
      targetPort: 8080
  selector:
    app: spring-cloud-provider
```

修改后端服务端的 Service：

* 添加了 `micrometer-prometheus-discovery: 'true'` 这个标签，方便后面 ServiceMonitor 自动抓取
* 修改 Service 端口映射的名称未 metrics

## 创建 ServiceMonitor

安装 KubeSphere 平台时已经安装好了 promethus-operator, ServiceMonitor 是 prometheus-operator 后创建的一种自定义资源，Prometheus 可以通过 ServiceMonitor 自动识别带有某些 label 的 service ，并从这些 Service 获取数据。

现在需要让 Promethus 可以抓取到我们暴露的应用监控，所以需要创建一个如下的 ServiceMonitor。

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: micrometer-demo
  namespace: cloud-demo
spec:
  endpoints:
    - interval: 30s
      path: /prometheus
      port: metrics
  namespaceSelector:
  	matchNames:
  	- cloud-demo
    # any: true
  selector:
    matchLabels:
      micrometer-prometheus-discovery: 'true'
```

**这段 YAML 文件的意思是抓取 namespace 为 cloud-demo，并设置了 `micrometer-prometheus-discovery: 'true'` 的 labels 的所有 Service，抓取的端口为 `metrics`，抓取路径为 `/prometheus`。**

详细说明一下各字段的意义：

- `metadata` 下的 `name` 和 `namespace` 将指定 Service Monitor 所需的一些关键元信息。
- `spec` 的 `endpoints` 为服务端点，代表 Prometheus 所需的采集 Metrics 的地址。`endpoints` 为一个数组，同时可以创建多个 `endpoints`。每个 `endpoints` 包含三个字段，每个字段的含义如下：

    -   `interval`：指定 Prometheus 对当前 `endpoints` 采集的周期。单位为秒，在本次示例中设定为 `30s`。
    -   `path`：指定 Prometheus 的采集路径。设置为 `/prometheus`，这个跟应用中暴露的监听端口保持一致。
    -   `port`：指定采集数据需要通过的端口，设置为 `/metrics` 设置的端口为 步骤三 创建 Service 时端口所设置的 `name`。
- `spec` 的 `namespaceSelector` 为需要发现的 Service 的范围。`namespaceSelector` 包含两个互斥字段，字段的含义如下：
    -   `any`：有且仅有一个值 `true`，当该字段被设置时，将监听所有符合 Selector 过滤条件的 Service 的变动。
    -   `matchNames`：数组值，指定需要监听的 `namespace` 的范围。例如，只想监听 `default` 和 `cloud-demo` 两个命名空间中的 Service，那么 `matchNames` 设置如下：

	```yaml
	namespaceSelector:
	  matchNames:
	  - default
	  - cloud-demo
	```

- `spec` 的 `selector` 用于选择 Service。
    在本次示例所使用的 Service 有 `micrometer-prometheus-discovery: 'true'`  Label，所以 `selector` 设置如下：

	```yaml
    selector:
      matchLabels:
        micrometer-prometheus-discovery: 'true'
	```

可以通过 `kubectl apply -f micrometer-demo.yml`  将其部署到集群中。

执行成功后可以在集群的 CRD 下面搜索 ServiceMonitor 并打开可以找到我们部署的 ServiceMonitor 配置。如图所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/20220928161036.png)

## 创建自定义监控

访问 集群-> 监控告警-> 自定义监控进入，如图所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/20220928161419.png)

我们点击创建 可以看到 KubeSphere 已经集成了部分监控面板，这里我们选择 Grafana。

![](https://pek3b.qingstor.com/kubesphere-community/images/20220928161439.png)

在下一步后系统会让我们上传 JSON 模版，我们可以通过 [Grafana 官网](https://grafana.com/grafana/dashboards "Grafana 官网")下载一些通用的模版配置，这里我们使用的是 [Spring Boot 2.1 Statistics]([Spring Boot 2.1 Statistics | Grafana Labs](https://grafana.com/grafana/dashboards/10280-microservices-spring-boot-2-1/ "Spring Boot 2.1 Statistics"))。在右侧可以下载 JSON 文件。

导入 JSON 后我们就可以看到相关监控指标了。

![](https://pek3b.qingstor.com/kubesphere-community/images/20220929100000.png)

使用这种方式有个最大问题就是多个应用无法切换，像我们之前部署了 3 个应用在一张图中显示就很乱，所以需要通过外部 Grafana 展示监控数据。

## 使用外部 Grafana 集成

为了方便，我们直接使用 KubeSphere 提供的应用商店功能安装外部 Grafana。

1. 添加应用仓库

进入企业空间 -> 应用管理 -> 应用仓库，点击添加，加入 bitnami 应用仓库。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20220928165201217.png)

2. 安装 Grafana

- 我们依次打开企业空间-项目-点击要安装到的具体项目-点击应用-点击右侧的创建按钮；

- 弹出对话框中点击从应用模版，从应用仓库列表中选择我们刚刚添加的 bitnami 的仓库，搜索 Grafana 点击后安装即可。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20220928165729220.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20220928170048844.png)

安装完成后我们在服务里给 grafana 的服务开启 NodePort 外部访问，比如我这里的的访问地址为：http://172.30.10.73:28328/

3. 设置 Grafana 数据源

- 我们使用管理员账号 admin 登录进 Grafana，默认密码可以在项目的保密字典中的 `cloud-grafana-admin` 中找到；

- 登录后我们点击左侧的小齿轮-datasource 在打开页面中选择 Add data source 然后选择 Prometheus 在 URL 中填入我们上面说到的 Prometheus 的 URL 地址。如图所示： 

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20220928172247247.png)

  Prometheus 可以通过如下方式找到 `kubectl get svc -n kubesphere-monitoring-system`

 ![](https://pek3b.qingstor.com/kubesphere-community/images/image-20220928173209126.png)

- 填写后拖到最下面，点击 save&test。

4. 导入 Dashbord

- 我们点击页面左侧➕-import；
- 输入我们从 [grafana 官网](https://grafana.com/grafana/dashboards "grafana 官网") 获得的对应的模版的 id 点击 load（我这里使用的是 [Spring Boot 2.1 Statistics | Grafana Labs](https://grafana.com/grafana/dashboards/10280-microservices-spring-boot-2-1/ "Spring Boot 2.1 Statistics | Grafana Labs")）；
- 在下一步中选择 Prometheus 为我们配置的数据源 点击 import 即可。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20220928172711640.png)

之后我们就可以看到配置的应用监控了。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20220928172944578.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20220929143601093.png)

多个应用之间可以通过左上角进行切换，符合预期。

## 附录

+ [grafana 官网](https://grafana.com/grafana/dashboards "grafana 官网")
+ [Spring Boot 2.1 Statistics](https://grafana.com/grafana/dashboards/10280-microservices-spring-boot-2-1 "Spring Boot 2.1 Statistics")
+ [ServiceMonitor](https://prometheus-operator.dev/docs/operator/design/#servicemonitor "ServiceMonitor")