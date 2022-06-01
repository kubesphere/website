---
title: '使用 Notification Manager 构建云原生通知系统'
tag: 'KubeSphere, Notification Manager'
keywords: 'Kubernetes, KubeSphere, Notification Manager, 云原生通知系统'
description: 'KubeKey 2.0.0 正式发布，该版本新增了清单（manifest）和制品（artifact）的概念，为用户离线部署 Kubernetes 集群提供了解决方案。'
createTime: '2022-05-10'
author: '雷万钧'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-system-cover.png'
---

## 云原生下通知系统的特点

众所周知，在云原生领域，K8s 已经成为了事实上的标准。那么狭义上讲，云原生通知系统就可以理解为 K8s 下的通知系统，基于此，云原生下的通知系统拥有以下特点：
- 为 Kubernetes 而生
- 支持对接多种的事件源，告警、事件、审计等
- 多租户设计 
- 高并发，可以同时处理大量的通知

## Notification Manager 是什么

[Notification Manager](https://github.com/kubesphere/notification-manager) 是 KubeSphere 开源的一款云原生多租户通知管理系统，支持从 Kubernetes 接收告警、事件、审计，根据用户设置的模板生成通知消息并推送给用户，支持将通知消息推送到 DingTalk，Email，Feishu，Pushover，Slack，WeCom，Webhook，短信平台（阿里、腾讯、华为）等。

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-101.png)

Notification Manager 会接收来自 Promethus、Alertmanager 发出的警告消息、K8s 产生的审计消息以及 K8s 本身的事件。在规划中我们还会实现接入 Promethus 的告警消息和接入 Cloud Event 。消息在进入缓存之后，会经过静默、抑制、路由、过滤、聚合，最后进行实际的通知，并记录在历史中。

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-architecture.jpeg)

下面是对每个步骤的解析：

### 缓存（Cache）

缓存的作用有两个，一个是应对告警风暴，同时产生大量告警时减少对系统的影响；另一个是对告警事件做聚合处理，飞书、钉钉和企业微信，对访问频次有限制。

目前采用松耦合设计，支持内存、NATS Streamming（后续）。

### 静默（Silence）

我们可以根据设定的规则对告警、事件、审计进行静默处理 ，比如支持设置静默时间，让晚上十点到早上八点不进行通知。同时我们可以支持设置全局静默规则和租户静默规则，全局的规则的会被全部租户启用，而租户规则只对当前租户起作用。

### 抑制（Inhibit）

一个节点宕机之后会发送大量告警，而这些告警不利于我们排查原因，我们可以通过设置抑制规则不再发送这部分告警给用户。

### 路由（Route）

告警、事件、审计都是由一个个标签组成的，路由的本质就是根据标签寻找需要接收标签的接收器。

下图就是一个路由，他定义了一个路由，他有以下几部分组成：
- 标签选择器 alertSelector 
- 接收器 Receiver

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-102.png)

接收器定义了我们的通知往哪里发、如何发，有如下特点：

- 可复用。尽可能复用配置，减少用户运维成本。
- 多租户。支持定义全局接收器用于接收所有的通知，同时用户可以定义自己的通知接收器用于接收租户相关的通知。
- 动态加载。为了实现动态加载，我们采用 CRD 的模式定义了 Config 和 Receiver。

Config CRD 定义了发送通知需要的信息，比如钉钉的 APP secret，它来定义我们如何发送信息，还可以通过标签区分全局 Config 和租户 Config 。

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-103.png)

Receiver CRD 定义了通知发送到哪里，比如钉钉、Email、飞书、Slack、短信平台、webhook、企业微信等。

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-104.png)

我们可以通过下图理解 Receiver 如何选择 Config 的，租户级的 Receiver 只能使用租户级的 Config，全局的 Receiver 只能使用全局的 Config。如果一个租户级的 Receiver 没有找到对应的租户级的 Config 就会使用全局级的 Config，这样就可以通过全局级的 Config 达到降低运维成本的作用。

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-105.png)

那么，我们定义了 Receiver 之后，消息过来之后是如何匹配到对应的 Receiver 呢？有两种模式：
- 路由匹配：根据路由规则匹配 Receiver。
- 自动匹配：根据 namespace 标签自动匹配。

对于这两种模式，有三种协同方式，分别是：
- All：同时使用两种方式匹配。
- 路由优先：优先使用路由规则匹配，未匹配成功的使用自动匹配。
- 只使用路由：使用路由规则未匹配到 Receiver，则不发送通知。

### 过滤（Filter）

Filter 的作用是 Receiver 可以选择接收哪些通知，过滤掉不重要的通知。

实现 Filter 的方式有两种，一种是通过在 Receiver 中设置标签选择器，过滤掉不重要的通知，对于单个通知有效，另一种是定义租户级别的静默规则，对部分通知进行静默。

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-106.png)

### 聚合（Aggregation）

聚合的的作用有两个：一个是在于对于消息的汇总，便于归档，另一个是减少调用频次，避免被钉钉等禁言，节省资源。

### 通知（Notify）

通知发送采用的是并行的模式，支持高性能，支持自定义模板，支持全局模板、接收器模板以及租户模板。下面是一个自定义模板的转换示例。

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-107.png)
![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-108.png)

### 多语言支持

Notification Manager 内置支持中英文，并支持语言包，可以换成任意一种语言。

![](https://pek3b.qingstor.com/kubesphere-community/images/notification-manager-109.png)

## Notification Manager 未来发展方向

在接下来的迭代中我们预计支持 Cloud Event 。为了去除因为中间件导致的数据不安全性，我们支持直接从Promethus 接入告警。同时，也要支持前面提到的通知抑制（Inhibit）功能。

Cache 将支持更多中间件，比如 Redis、Kafka 等。

由于目前我们的模板是基于 Go template ，对新手不是很友好，后续考虑要不要支持 XML 类型的模板。最后支持更多接收器，保证能通过更多渠道发送通知。




