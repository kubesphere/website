---
title: 'Kubernetes 多行日志采集方案探索'
tag: 'KubeSphere, Kubernetes, Log'
keywords: 'KubeSphere, Kubernetes, ElasticSearch, Filebeat, Kafka, FluentBit'
description: '本文介绍了如何将 KubeSphere 集群内日志接入到第三方日志服务中'
createTime: '2022-11-22'
author: '大飞哥'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202211281721570.jpg'
---

> 作者：大飞哥，视源电子运维工程师，KubeSphere 用户委员会广州站站长

## 采集落盘日志

日志采集，通常使用 EFK 架构，即 `ElasticSearch`,`Filebeat`,`Kibana`，这是在主机日志采集上非常成熟的方案，但在容器日志采集方面，整体方案就会复杂很多。我们现在面临的需求，就是要采集容器中的落盘日志。

容器日志分为标准输出日志和落盘日志两种。应用将日志打印在容器标准输出 `STDOUT` 中，由容器运行时(Docker 或 Containerd)把标准输出日志写入容器日志文件中，最终由采集器导出。这种日志打印采集是业界推荐方案。但对于不打印标准输出而直接将日志落盘的情况，业界最常用见的方案是，使用 `Sidecar` 采集落盘日志，把落盘日志打印到容器标准输出中，再利用标准输出日志的采集方式输出。

![](https://pek3b.qingstor.com/kubesphere-community/images/bb596565862f45f7852421c50d9e88b1~tplv-k3u1fbpfcp-watermark.png)

对于 KubeSphere 用户，只需要两步即可：第一在项目中开启`收集卷上日志`，第二在工作负载中配置落盘文件路径。具体操作见下图所示。

![](https://pek3b.qingstor.com/kubesphere-community/images/e0b20d93902f4545826cacbc4541f054~tplv-k3u1fbpfcp-watermark.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/4d93e799977840628dd45d0a19493d9b~tplv-k3u1fbpfcp-watermark.png)

上述两个步骤，会自动在容器中注入 `Filebeat Sidecar` 作为 logging-agent，将落盘日志打印输出在容器标准输出中。Filebeat 配置可通过 ConfigMap 修改。

```shell
$ kubectl get cm -n kubesphere-logging-system logsidecar-injector-configmap -o yaml
```

```yaml
## Filebeat 配置
filebeat.inputs:
- type: log
  enabled: true
  paths:
  {{range .Paths}}
  - {{.}}
  {{end}}
output.console:
  codec.format:
    string: '%{[log.file.path]} %{[message]}'
logging.level: warning
```

## 接入第三方日志服务

默认 KubeSphere 将日志采集到集群内置 Elasticsearch 中，数据保存周期为 7 天，这对于生产服务动辄 180 天的日志存储需求，显然无法满足。企业运维团队都会建立集中化的日志服务，将集群内日志接入到第三方日志服务中，已是必然选择。我们来看如何操作。

上文说到，容器运行时会将标准输出日志，落盘写入到集群节点的日志文件中，Linux 系统默认在 `/var/log/containers/*.log`。KubeSphere 使用 `FluentBit` 以 `DemonSet` 形式在各集群节点上采集日志，由 FluentBit 输出给 ElasticSearch 服务。具体配置可参考如下两个配置：

```shell
$ kubectl get Input -n kubesphere-logging-system tail -o yaml
$ kubectl get Output -n kubesphere-logging-system es -o yaml
```

我们把日志导出到第三方日志服务，那就需要定制 FluentBit 输入输出。使用 `tail` 插件采集 `/var/log/containers/flux-wms-*.log` 文件中的日志，输出到 `Kafka` 中。可参考如下配置：

![](https://pek3b.qingstor.com/kubesphere-community/images/942da92ef0af483687b08b2994bc5d66~tplv-k3u1fbpfcp-watermark.png)

```yaml
---
apiVersion: logging.kubesphere.io/v1alpha2
kind: Input
metadata:
  labels:
    logging.kubesphere.io/component: logging
    logging.kubesphere.io/enabled: "true"
  name: kafka-flux-wms
  namespace: kubesphere-logging-system
spec:
  tail:
    db: /fluent-bit/tail/pos.db
    dbSync: Normal
    memBufLimit: 5MB
    path: /var/log/containers/flux-wms-*.log
    refreshIntervalSeconds: 10
    tag: fluxwms.*
---
apiVersion: logging.kubesphere.io/v1alpha2
kind: Output
metadata:
  annotations:
    kubesphere.io/creator: admin
  labels:
    logging.kubesphere.io/component: logging
    logging.kubesphere.io/enabled: "true"
  name: kafka-flux-wms
  namespace: kubesphere-logging-system
spec:
  kafka:
    brokers: xxx.xxx.xxx.xxx:9092
    topics: my-topic
  match: fluxwms.*
```

> 值得注意的是，目前 FluentBit 不支持 Kafka 认证。

## 多行日志的尴尬

原本以为至此就可万事大吉，没想到消费 kafka 日志时突然看到，某些日志被拆得七零八碎，不忍入目。为了支持多行日志，直观的想法，就是逐个组件往前排查。

> `前方有坑，请小心阅读。`

### 配置 FluentBit 支持多行日志

FluentBit 对多行日志的支持，需要配置 Parser，并通过 `parserFirstline` 指定日志 Parser，用以解析出多行日志块的第一行。[官方参考文档](https://docs.fluentbit.io/manual/pipeline/inputs/tail)，Parser 正则表达式，根据 Filebeat 日志输出格式而定，可参考上文或直接看这段：`string: '%{[log.file.path]} %{[message]}'`。

```yaml
---
apiVersion: logging.kubesphere.io/v1alpha2
kind: Input
metadata:
  labels:
    logging.kubesphere.io/component: logging
    logging.kubesphere.io/enabled: "true"
  name: kafka-flux-wms
  namespace: kubesphere-logging-system
spec:
  tail:
    db: /fluent-bit/tail/pos.db
    dbSync: Normal
    memBufLimit: 5MB
    path: /var/log/containers/flux-wms-*.log
    multiline: true
    parserFirstline: kafka-flux-wms
    refreshIntervalSeconds: 10
    tag: fluxwms.*
---
apiVersion: logging.kubesphere.io/v1alpha2
kind: Parser
metadata:
  labels:
    logging.kubesphere.io/component: logging
    logging.kubesphere.io/enabled: "true"
  name: kafka-flux-wms
  namespace: kubesphere-logging-system
spec:
  regex:
    regex: '^\/data\/business-logs\/[^\s]*'
```

### 配置 Filebeat 支持多行日志

查看 kakfka 消息，多行日志仍然被拆分。难道 Filebeat 没有支持多行日志吗？整个落盘日志采集链条中，只要有一个环节不支持多行日志，就会导致结果不及预期。查看项目原始日志文件，发现多行日志以时间格式开头，于是 Filebeat 增加如下配置：

```yaml
filebeat.inputs:
- type: log
  enabled: true
  paths:
  {{range .Paths}}
  - {{.}}
  {{end}}
  multiline.pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
  multiline.negate: true
  multiline.match: after
  multiline.max_lines: 100
  multiline.timeout: 10s
output.console:
  codec.format:
    string: '%{[log.file.path]} %{[message]}'
logging.level: warning
```

进入 Sidecar 容器，使用如下命令测试 Filebeat 输出，确认正确分割多行日志。

```shell
$ filebeat -c /etc/logsidecar/filebeat.yaml
```

### 不可忽视的容器运行时

按理说，FluentBit 和 Filebeat 都支持了多行日志，kafka 应该可以正确输出多行日志，但结果令人失望。肯定还有哪个环节被遗漏了，在登录集群节点主机查看容器标准输出日志时，这个被忽视的点被发现啦！

```shell
## 此处直接查看你的项目容器
$ tail -f /var/log/containers/*.log
```

你会发现，日志都是 `JSON` 格式，并且日志是逐行输出的，也就是说，没有支持多行日志块。本地 kubernetes 集群使用 Docker 作为容器运行时，来查看它的配置:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  },
  "max-concurrent-downloads": 10,
  "max-concurrent-uploads": 10,
  "bip": "192.168.100.1/24",
  "storage-driver": "overlay2",
  "storage-opts": ["overlay2.override_kernel_check=true"]
}
```

`log-driver`配置为`json-file`, 这也是官方默认配置，可[参考官方说明](https://docs.docker.com/config/containers/logging/)，除 json 格式外，还支持如下格式：

- local
- gelf
- syslog
- fluentd
- loki

显然其他格式也并不理想，而且对于生产环境，切换容器运行时日志格式，影响还是蛮大的。探索至此，这条路子难度偏大风险过高，暂时先搁置，待到身心惬意时接着玩。

### 去掉中间商，直达 kafka

既然上面的路子走不通，那就换个思路。Filebeat 也是 logging-agent，是支持输出日志到 Kafka 的，为何不省去中间环节，直奔主题呢？

```shell
$ kubectl edit cm -n kubesphere-logging-system logsidecar-injector-configmap
```

```yaml
filebeat.inputs:
- type: log
  enabled: true
  paths:
  {{range .Paths}}
  - {{.}}
  {{end}}
  multiline.pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
  multiline.negate: true
  multiline.match: after
  multiline.max_lines: 100
  multiline.timeout: 10s
output.kafka:
  enabled: true
  hosts:
    - XXX.XXX.XXX.XXX:9092
  topic: sycx-cmes-app
## output.console:
##   codec.format:
##     string: '%{[log.file.path]} %{[message]}'
logging.level: warning
```

当看到 Kafka 消费者输出完美多行日志块时，脑后传来多巴胺的快感！再看一眼架构图，咱们来做总结！

![](https://pek3b.qingstor.com/kubesphere-community/images/248b663dfc354e6d860ebd671dd5b5e3~tplv-k3u1fbpfcp-watermark.png)

## 总结

最初我去 KubeSphere 社区论坛搜索日志采集相关帖子时，有朋友说无法实现。看到他的回复，心底一阵绝望。如今看来，某种角度上说，他的回答没错，他只是说那条路走不通，但他没说那条路能走通。