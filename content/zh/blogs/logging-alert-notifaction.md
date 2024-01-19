---
title: '深入解读云原生可观测性之日志与告警通知'
tag: 'Kubernetes,KubeSphere,可观测性'
keywords: 'Kubernetes, KubeSphere, 可观测性, 日志, 告警通知'
description: '作为可观测性的重要组成部分，告警通知可以帮助我们及时发现问题，日志可以帮助我们快速定位问题。作为一款开源的容器编排平台， KubeSphere 提供了强大的日志收集和查询功能，以及灵活的告警通知能力。本文将为大家介绍 KubeSphere 的日志和通知功能是如何实现的'
createTime: '2021-09-03'
author: '雷万钧'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/nm-cic-cover.png'
---

>本文是 KubeSphere 可观测性研发工程师雷万钧在 CIC 大会上分享内容整理而成。点击观看[视频回放](https://kubesphere.com.cn/live/nm-cic/)。

## 前言

作为可观测性的重要组成部分，告警通知可以帮助我们及时发现问题，日志可以帮助我们快速定位问题。作为一款开源的容器编排平台， KubeSphere 提供了强大的日志收集和查询功能，以及灵活的告警通知能力。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-feature-overview-9.jpg)

本文将为大家介绍 KubeSphere 的日志和通知功能是如何实现的。

## 日志

KubeSphere 的日志收集是通过 Fluent Bit 实现的，Fluent Bit 将 Pod 日志收集到 ElasticSearch 集群，KubeSphere 通过查询 ElasticSearch 集群实现日志检索。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-log-console.png)

### Fluent Bit

Fluent Bit 是一个开源的日志处理器和转发器，它可以从不同来源收集任何数据，如指标和日志，用过滤器处理它们并将它们发送到多个目的地。它是 Kubernetes 等容器化环境的首选。

Fluent Bit 的设计考虑到了性能：高吞吐量、低 CPU 和内存使用率。它是用 C 语言编写的，具有可插拔架构，支持 70 多种输入、过滤器和输出扩展。

![](https://pek3b.qingstor.com/kubesphere-community/images/fluentbit-cic.png)

日志通过数据管道从数据源发送到目的地，一个数据管道通常由 Input、Parser、Filter、Buffer、Routing 和 Output组成。

* Input：用于从数据源抽取数据，一个数据管道中可以包含多个 Input。
* Parser：负责将 Input 抽取的非结构化数据转化为标准的结构化数据，每个 Input 均可以定义自己的 Parser。
* Filter：负责对格式化数据进行过滤和修改。一个数据管道中可以包含多个 Filter，Filter 会顺序执行，其执行顺序与配置文件中的顺序一致。
* Buffer：用户缓存经过 Filter 处理的数据。
* Routing：将 Buffer 中缓存的数据路由到不同的 Output。
* Output：负责将数据发送到不同的目的地，一个数据管道中可以包含多个 Output。

Fluent Bit 支持多种类型的 Input、Parser、Filter、Output 插件，可以应对各种场景。

![](https://pek3b.qingstor.com/kubesphere-community/images/fluentbit-plug-in.png)

Fluent Bit 作为容器平台下首选的日志收集工具，有着高效、轻量的优势，但是其部署方式却不够便捷。

* 首先，使用传统的方式部署 Fluent Bit，需要手动创建一个 DaemonSet，需要对 Fluent Bit 进行修改时，也需要手动修改此 DaemonSet，不够便捷且容易出错。
* 其次，Fluent Bit 的配置文件不是云原生领域常用的 yaml 或 json 格式，配置较为繁琐且容易出错。
* 再次，Fluent Bit 不支持动态加载配置文件，每次更新配置文件需要重启 DaemonSet。

基于以上问题，KubeSphere 可观测性团队开发了 FluentBit Operator 用于部署和管理 Fluent Bit。

### FluentBit Operator

FluentBit Operator 是一款开源的 Fluent Bit 管理工具，可以实现 Fluent Bit 的快速部署，可以实现 Fluent Bit 配置文件的动态修改和加载。

* 管理：自动部署和销毁 Fluent Bit DaemonSet。
* 自定义配置：通过 CRD 定义 Fluent Bit 的配置。
* 动态加载： 无需重新启动 Fluent Bit pod 即可更新配置。

FluentBit Operator 通过 CRD 创建和管理 Fluent Bit Pod，通过监听 CRD 的变化动态更新 Fluent Bit Pod 和 Fluent Bit 配置。

![](https://pek3b.qingstor.com/kubesphere-community/images/fluentbit-operator.png)

**FluentBit Operator CRDS**

FluentBit Operator 定义的 CRD 包括：

* FluentBit：用于创建 Fluent Bit DaemonSet。
* FluentBitConfig：用于选择 FluentBit Operator 需要管理的插件。
* Input：用于定义 Fluent Bit Input 插件。
* Parser：用于定义Fluent Bit Parser 插件。
* Filter：用于定义Fluent Bit Filter 插件。
* Output：用于定义Fluent Bit Output 插件。

![](https://pek3b.qingstor.com/kubesphere-community/images/fluentbit-crd.png)

FluentBit Operator 通过监听 FluentBitConfig、Input、Parser、Filter、Output CRD，生成 Fluent Bit 的配置文件，并将配置文件写入到 Secret 中。当 CRD 发生变更时，配置文件会自动更新。

FluentBit Operator 监听 FluenBit CRD， 当 FluenBit CRD 的实例创建时，FluentBit Operator 会创建 Fluent Bit DaemonSet，并将配置文件挂载到 Fluent Bit DaemonSet 中。当配置文件发生变化时，Fluent Bit Pod 中的配置文件也会同步更新。那么 FluentBit Operator 是如何实现 Fluent Bit 动态加载配置文件的呢？

**Fluent Bit Watcher**

Fluent Bit Pod 中不是直接运行的 Fluent Bit，而是运行了一个名为 fluent-bit-watcher 的进程，fluent-bit-watcher 在启动后会启动 Fluent Bit，同时监听配置文件。当配置文件发生变化时，fluent-bit-watcher 会重启 Fluent Bit 以重新加载配置文件。

### 日志存储

Fluent Bit 会将日志收集到 ElasticSearch 集群中进行持久化，日志会按照每天一个分片进行存储，KubeSphere 支持配置日志的保存周期，超过保存周期的日志会被自动删除。

同时 KubeSphere 支持将日志输出到 Kafka 和 Fluentd。

### 日志检索

Fluent Bit 在收集日志时，会将容器的元数据信息添加到日志，因此 KubeSphere 可以为用户提供了丰富的日志查询方式。

* 多租户日志管理，实现不同租户日志分权分域。每个租户只能查询自己有权限访问的 Namespace 下的 容器的日志。
* 多层次日志查询 按项目、工作负载、容器组、容器和关键字查询日志，从多层次定位问题。

## 通知
KubeSphere 支持多租户通知功能，每个租户都可以定制自己的通知渠道，用于接收租户有权限访问的 Namespace 下的通知消息。同时可以设置全局的通知渠道用于接收全部的通知消息，包括所有租户的通知消息和平台级的通知消息。

KubeSphere 的通知功能是通过 Notification Manager 实现的。

### Notification Manager
Notification Manager 是 KubeSphere 可观测团队开源的一款 Kubernetes 平台上的多租户通知管理系统，其从 Alertmanager 接收告警消息，并根据告警消息的租户标签（如 namespace）将告警消息发送到对应的通知渠道，DingTalk，Email，Slack，WeCom，Webhook，短信平台（阿里、腾讯，华为）等。

![](https://pek3b.qingstor.com/kubesphere-community/images/Notification-Manager.png)

Notification Manager 由 Operator 和 Deployment 两部分组成，Operator 用于创建和管理 Deployment，Deployment 用于接收告警消息，生成通知消息，并根据告警消息的租户标签（如 namespace）将通知消息发送到对应的通知渠道。

Notification Manager 通过 CRD 进行管理和配置，Operator 通过监听 NotificationManager CRD 创建和管理 Deployment，Deployment 会监听 NotificationManager、Config、Receiver CRD，当 CRD 发生变更时，会重载 CRD 以更新配置信息，实现了通知渠道的动态更新。

Notification Manager 定义的 CRD 的作用如下：
* NotificationManager：用于配置 Webhook，包括镜像、副本数、volumes、亲和性、污点、资源配额等。同时定义了发送通知所需的配置，全局接收者和默认配置选择器、租户标签、租户级接收者选择器，以及通知渠道的全局配置。
* Config：用于定义通知渠道的发送方的配置信息，例如邮件发送服务器设置、企业微信用于发送消息的 APP 的信息等。
* Receiver：用于定义通知渠道的接收方的信息，例如邮件接收者、企业微信中的用户或部门，slack 的频道等。

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-crd.png)

Notification Manager 支持多租户通知，那么 Notification Manager 是如何实现多租通知管理的呢？

Notification Manager 采用了发送配置和接收配置分离的模式，即使用 Config 定义发送配置，使用 Receiver 定义接收配置，Receiver 通过标签选择发送通知需要使用的发送配置。Config 和 Receiver 分为全局和租户两种类型，通过以下标签进行区分。

`type: global // 全局 Receiver`

`type: default // 全局 Config`

`type: tenant //租户 Receiver or Config`

全局 Receiver 只能使用全局的 Config，租户 Receiver 通过标签选择器选择租户定义的租户 Config，如果未定义标签选择器，或未找到 Config，则使用全局 Config。

![](https://pek3b.qingstor.com/kubesphere-community/images/config-crds.png)

使用此种模式，用户可以快速实现复杂多租户通知场景的配置。例如对于邮件通知，可以使用统一的发送方，管理员可以设置全局的 Email Config，租户只需要配置接收邮箱即可完成邮件通知配置。

Notification Manager 会根据通知消息的 namespace 标签将通知发送到相应的 Receiver。
* 所有通知消息都会发送到全局 Receiver。
* 若 namespace 为空，则只会发送到全局 Receiver。
* 若 namespace 非空，Notification Manager 会根据 namespace 查找待通知租户列表，然后根据租户列表获取待发送 Receiver。对应原生 Kubernetes 集群，待通知租户即为 namespace。对于其他集群，例如 KubeSphere，Notification Manager 支持通过 API 获取待通知租户列表。用户可以自己实现获取待通知租户列表的逻辑，通过 sidecar 的方式注入到 Notification Manager Deployment 供 Notification Manager 调用。

**自定义通知消息**

Notification Manager 支持自定义通知消息，用户可以通过编写消息模板来自定义通知消息。Notification Manager 的通知模板此采用 Go template 编写。以下是一个简单的消息模板。

```
{{ define "__nm_alert_list" }}{{ range . }}Labels:
{{ range .Labels.SortedPairs }}{{ if ne .Name "runbook_url" }}- {{ .Name }} = {{ .Value }}{{ end }}
{{ end }}Annotations:
{{ range .Annotations.SortedPairs }}{{ if ne .Name "runbook_url"}}- {{ .Name }} = {{ .Value }}{{ end }}
{{ end }}{{ end }}{{ end }}

{{ define "nm.default.text" }}{{ template "nm.default.subject" . }}
{{ if gt (len .Alerts.Firing) 0 -}}
Alerts Firing:
{{ template "__nm_alert_list" .Alerts.Firing }}
{{- end }}
{{ if gt (len .Alerts.Resolved) 0 -}}
Alerts Resolved:
{{ template "__nm_alert_list" .Alerts.Resolved }}
{{- end }}
{{- end }}
```
其输出的通知消息如下。

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-message.png)


Notification Manager 支持多级别的模板设置。
* Notification Manager 为每一种通知渠道设置了默认的消息模板，用户可以直接使用。
* 用户可以设置全局的模板，供所有 Receiver 使用。
* 用户可以为每种通知渠道设置统一的模板。
* 用户可以为每一个 Receiver 设置单独的模板。

**通知消息过滤**

Notification Manager 支持对通知消息进行过滤，用户可以通过设置过滤器来过滤通知消息。Notification Manager 支持对每一个 Receiver 设置单独的过滤器。

一个简单的过滤器，过滤掉 warning 级别的告警。

```
apiVersion: notification.kubesphere.io/v2beta1
kind: Receiver
metadata:
  labels:
    app: notification-manager
    type: global
  name: global-email-receiver
spec:
  email:
    to:
    - receiver1@xyz.com
    - receiver2@xyz.com
    alertSelector:
      matchExpressions:
      - key: severity
        operator: In
        values:
        - error
        - critical
```

### KubeSphere 通知的优势

* 使用 CRD 管理，支持动态更新
* 支持丰富的通知渠道
* 支持通知消息过滤
* 支持自定义通知消息