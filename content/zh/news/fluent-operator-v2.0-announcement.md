---
title: 'Fluent Operator v2.0 发布'
tag: '产品动态'
keywords: 'Kubernetes, KubeSphere, Fluent Operator'
description: 'Fluent Bit 新的部署方式：Fluent Bit Collector。'
createTime: '2023-02-17'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/fluent-operator-v2.0-cover.png'
---

2019 年 1 月 21 日，KubeSphere 社区为了满足以云原生的方式管理 Fluent Bit 的需求开发了 FluentBit Operator。此后产品不断迭代，在 2021 年 8 月 4 日 正式将 FluentBit Operator 捐献给 Fluent 社区，之后重新命名为 Fluent Operator。自此 Fluent Operator 社区吸引了来自世界各地的贡献者参与项目的开发和迭代。

日前，Fluent Operator v2.0（2.0.0 & 2.0.1）发布，该版本新增许多重要功能，并进行了众多优化，以下将重点介绍：

## Fluent Bit 新的部署方式: Fluent Bit Collector

Fluent Operator 降低了 Fluent Bit 以及 Fluentd 的使用门槛，能高效、快捷的处理可观测性相关的各种数据。使用 Fluent Operator 可以灵活且方便地部署、配置及管理 Fluent Bit 以及 Fluentd。同时, 社区还提供支持 Fluentd 以及 Fluent Bit 的海量插件，用户可以根据实际情况进行定制化配置。

Fluent Bit 对于处理的数据一直是中立的，在 v2.0 之前 Fluent Bit 主要被用于处理日志数据。 Fluent Bit v2.0 的发布是 Fluent Bit 全面支持可观测性所有类型数据（Logs, Metrics, Tracing）的一个标志和起点。自 Fluent Bit v2.0 开始，除了继续支持处理日志数据之外，也开始支持 Metrics 和 Tracing 数据的收集和发送，即全面支持 Prometheus 和 OpenTelemetry 生态体系。

自从 Fluent Bit 升级到 v2.0+ 后，添加了很多插件比如 Prometheus Scrape Metrics 插件。如果继续以 DaemonSet 的形式部署 Fluent Bit，会导致 Metrics 数据的重复收集。于是 Fluent Operator 自 v2.0 开始支持[将 Fluent Bit 以 StatefulSet 的形式部署为 Fluent Bit Collector](https://github.com/fluent/fluent-operator/issues/304)，这样可以通过网络接收可观测数据，适应更多的可观测数据收集的场景:

- [OpenTelemetry](https://docs.fluentbit.io/manual/pipeline/inputs/opentelemetry)
- [prometheus-scrape-metrics](https://docs.fluentbit.io/manual/pipeline/inputs/prometheus-scrape-metrics)
- [collectd](https://docs.fluentbit.io/manual/pipeline/inputs/collectd)
- [forward](https://docs.fluentbit.io/manual/pipeline/inputs/forward) 
- [http](https://docs.fluentbit.io/manual/pipeline/inputs/http)
- [mqtt](https://docs.fluentbit.io/manual/pipeline/inputs/mqtt)
- [nginx](https://docs.fluentbit.io/manual/pipeline/inputs/nginx)
- [statsd](https://docs.fluentbit.io/manual/pipeline/inputs/statsd)
- [syslog](https://docs.fluentbit.io/manual/pipeline/inputs/syslog)
- [tcp](https://docs.fluentbit.io/manual/pipeline/inputs/tcp)

其中 `prometheus-scrape-metrics` 插件已由 Fluent Operator 社区提供，其他的输入插件将在未来的迭代中逐步添加。

## 其他变化

### 新功能
- 支持在 fluent-operator 部署添加注释
- 支持为 fluent-operator 和 fluent-bit pods 添加标签
- 新增在 fluent-bit-watcher 中添加外部插件标志
- 支持为 Fluent Bit DaemonSet 添加注释
- 在 fluent-bit-watcher 中增加进程终止超时
- 添加 `dnsPolic` 和其他 Kubernetes 过滤器选项到 Fluent Bit CRD

### 增强功能

- 将 `DockerModeParser` 参数添加到 Fluent Bit tail 插件
- 增加运算器内存限制到 60Mi
- 优化 fluent-operator 图表
- 更新 flushThreadCount 的定义
- 将 Fluent Bit 升级到 v2.0.9
- 将 Fluentd 升级到 v1.15.3
- 优化 e2e 测试脚本
- ...

更多的功能变化请通过 Release note 详细了解：
- [v2.0.0](https://github.com/fluent/fluent-operator/releases/tag/v2.0.0)
- [v2.0.1](https://github.com/fluent/fluent-operator/releases/tag/v2.0.1)

## 致谢贡献者

该版本共有 10 位贡献者参与，在此表示特别感谢。

这些贡献者的 GitHub ID 分别是：
- momoXD007（Michael Wieneke）
- wigust（Oleg Pykhalov）
- antrema（Anthony Treuillier, France）
- Garfield96（Christian Menges, Germany）
- benjaminhuo（Benjamin Huo）
- wenchajun（Elon Cheng）
- samanthacastille（Samantha Castille, Seattle）
- juhis135（Juhi Singh）
- Kristian-ZH（Kristian Zhelyazkov, SAP）
- jjsiv

**值得指出的是，这 10 位贡献者中有 8 位来自国外，如德国、法国、美国西雅图以及保加利亚 SAP 等地。**

也希望各位开源爱好者提交代码，帮助 Fluent Operator 逐渐完善，使其成为云原生日志管理的瑞士军刀。
