---
title: "日志系统"
keywords: 'Kubernetes, KubeSphere, API, 日志系统'
description: 'KubeSphere 3.3 中日志系统（服务组件）的 API 变更。'
linkTitle: "日志系统"
weight: 17310
---

KubeSphere 3.3 中**日志系统**（服务组件）的 API 变更。

## 时间格式

查询参数的时间格式必须是 Unix 时间戳（自 Unix Epoch 以来已经过去的秒数）。不再支持使用毫秒。该变更影响 `start_time` 和 `end_time` 参数。

## 已弃用的 API

下列 API 已移除：

- GET  /workspaces/{workspace}
- GET  /namespaces/{namespace}
- GET  /namespaces/{namespace}/workloads/{workload}
- GET  /namespaces/{namespace}/pods/{pod}
- 整个日志设置 API 组

## Fluent Operator

在 KubeSphere 3.3 中，由于 Fluent Operator 项目已重构且不兼容，整个日志设置 API 已从 KubeSphere 内核中移除。有关如何在 KubeSphere 3.3 中配置日志收集，请参考 [Fluent Operator](https://github.com/kubesphere/fluentbit-operator) 文档。