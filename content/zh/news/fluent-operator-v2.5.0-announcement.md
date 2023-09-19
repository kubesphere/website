---
title: 'Fluent Operator v2.5.0 发布'
tag: '产品动态'
keywords: 'Kubernetes, KubeSphere, Fluent Operator'
description: '新增多个插件支持。'
createTime: '2023-09-19'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/Fluent-Operator-v2.5.0-cover.png'
---

日前，Fluent Operator 发布了 v2.5.0。

Fluent Operator v2.5.0 新增 11 个 features， 其中 Fluent Bit 新增支持 7 个插件， Fluentd 新增支持 1 个插件。此外，对 Fluent Operator 也进行了增强，调整了默认参数，以便适应更多场景，并对 helm chart 进行了优化，用户可以更方便的进行安装，并修复了部分 bug。

以下将重点介绍：

## Fluent Bit 增加多个插件

### 1. Prometheus Exporter 插件

Fluent Bit 新增了输出插件 Prometheus Exporter，Prometheus Exporter 输出插件允许您从 Fluent Bit 中获取 metrics 并暴露它们，以便 prometheus 实例可以抓取它们。

相关 PR： https://github.com/fluent/fluent-operator/pull/840。

### 2. Forward 插件

Fluent Bit 新增了输入插件 Forward，Forward 是 Fluent Bit 和 Fluentd 用于在对等设备之间路由消息的协议。使用该插件可以监听 Forward 消息的输入。

相关 PR： https://github.com/fluent/fluent-operator/pull/843。

### 3. GELF 插件

Fluent Bit 新增了输出插件 GELF，GELF 是 Graylog 扩展日志格式。GELF 输出插件允许使用 TLS、TCP 或 UDP 协议将 GELF 格式的日志直接发送到 Graylog 输入端。

相关 PR： https://github.com/fluent/fluent-operator/pull/882。

### 4. OpenTelemetry 插件

Fluent Bit 新增了输入插件 OpenTelemetry，OpenTelemetry 插件可让您按照 OTLP 规范，从各种 OpenTelemetry 输出程序、OpenTelemetry 收集器或 Fluent Bit 的 OpenTelemetry 输出插件获取 OpenTelemetry 格式的数据。

相关 PR： https://github.com/fluent/fluent-operator/pull/890。

### 5. HTTP 插件

Fluent Bit 新增了输入插件 HTTP，HTTP 输入插件允许 Fluent Bit 打开一个 HTTP 端口，然后以动态方式将数据路由到该端口。该插件支持动态标签，允许你通过同一个输入发送带有不同标签的数据。

相关 PR： https://github.com/fluent/fluent-operator/pull/904。

### 6. MQTT 插件

Fluent Bit 新增了输入插件 MQTT，MQTT 输入插件允许通过 TCP 连接从 MQTT 控制包中获取消息/数据。要接收的传入数据必须是 JSON map 格式的数据。

相关 PR： https://github.com/fluent/fluent-operator/pull/911。

### 7. Collectd 插件

Fluent Bit 新增了输入插件 MQTT，Collectd 输入插件允许您从 Collectd 服务端接收数据。

相关 PR： https://github.com/fluent/fluent-operator/pull/914。

## Fluentd 主要变化

### 新增 Grok parser 插件

Fluentd 新增 Grok parser 插件。Grok 是一个第三方的解析器，Grok 是一个简化和重用正则表达式的宏，最初由 Jordan Sissel 开发。如果您熟悉 Grok 模式，那么 Grok parser 插件非常有用。

Grok parser 插件的版本涵盖如下：

| fluent-plugin-grok-parser | fluentd    | ruby   |
| ------------------------- | ---------- | ------ |
| >= 2.0.0                  | >= v0.14.0 | >= 2.1 |
| < 2.0.0                   | >= v0.12.0 | >= 1.9 |

相关 PR： https://github.com/fluent/fluent-operator/pull/861。

### 增加对 Fluentd 作为 DaemonSet 运行的支持

目前，Fluentd 以 StatefulSet 的形式运行，但我们希望将 Fluentd 作为一个完整的日志方面的进程来运行，这就需要在 Fluentd 中包含一些输入插件（tail、systemd）。所以我们需要将 Fluentd 作为 DaemonSet 的方式来运行。

在该 PR 中，我们引入了将 Fluentd 作为 DaemonSet 运行的选项支持。默认情况下，Fluentd 将作为 StatefulSet 运行，但用户也可以通过启用 `agent` 模式，将 Fluend 作为 DaemonSet 运行。如果开始了`agent` 模式，那么在创建 DaemonSet 时会忽略 StatefulSet 特定字段，反之亦然。

此外，Fluend 可以作为 DaemonSet 或 StatefulSet 运行，而不能同时作为 DaemonSet 和 StatefulSet 运行。如果我们启用 DaemonSet，StatefulSet 将被删除，Fluentd 将作为 DaemonSet 运行。

相关 PR： https://github.com/fluent/fluent-operator/pull/839。

## 其他优化

- 在 Fluent-bit config 中删除重复的 Cluster parsers；
- 调整 Fluent Bit 的多项默认参数；
- 为 Fluentd 添加 ImagePullSecret 参数；
- 将 Fluent Bit 升级到 2.1.9 版本；
- 优化 Fluent Operator 的 helm chart 中的各项参数；
- ...

## 致谢贡献者

该版本贡献者共有 16 位，他们分别是：

- gregorycuellar
- Nyefan
- WaywardWizard
- alexandrevilain
- yash97
- husnialhamdani
- L1ghtman2k
- wenchajun
- leonsteinhaeuser
- vincent-vinf
- Rajan-226
- sharkeyl
- ikolesnikovrevizto
- karan56625
- ajax-bychenok-y
- sjliu1

这些贡献者大部分来自海外，这表明 Fluent Operator 是一个全球化的项目，越来越受欢迎和具有影响力，在此感谢各位贡献者！也非常欢迎大家参与这个开源项目和社区！

关于新版本的具体变化，您还可以参考 release note： https://github.com/fluent/fluent-operator/releases/tag/v2.5.0。