---
title: "3.4.0 版本说明"
keywords: "Kubernetes, KubeSphere, 版本说明"
description: "KubeSphere 3.4.0 版本说明"
linkTitle: "3.4.0 版本说明"
weight: 18094
---

## DevOps

### 优化增强

- 支持用户自定义流水线配置步骤。 
- 优化 DevOps Jenkins JVM 内存配置。

### 问题修复

- 修复级联删除 ArgoCD 资源的问题。
- 修复多分支流水线下载制品失败的问题。
- 修复流水线运行状态与 Jenkins 不一致的问题（增加重试以同步状态）。 
- 修复新建用户运行流水线一直等待中的问题。


## 存储

### 问题修复

- 修复 pvc 无法删除的问题。 


## 网关和微服务

### 新特性

- 网关支持配置 TCP/UDP 流量转发。 

### 优化增强

- 升级 ingress nginx 版本: v1.1.0 -> v1.3.1。
- 升级 servicemesh 组件版本：istio: 1.11.1 -> 1.14.6；kiali: v1.38.1 -> v1.50.1；jaeger: 1.27 -> 1.29。

### 问题修复

- 修复返回集群网关数据重复的问题。 
- 修复网关升级校验错误 。
- 修复更改网关命名空间配置后，集群网关日志和资源状态显示异常的问题。 


## 可观测性

### 新特性

- 新增 RuleGroup, ClusterRuleGroup, GlobalRuleGroup 等 CRDs，用于支持 Alerting v2beta1 APIs。
- 新增 RuleGroup, ClusterRuleGroup, GlobalRuleGroup 等资源的准入控制 webhook。
- 新增 Controllers，将 RuleGroup, ClusterRuleGroup, GlobalRuleGroup 资源同步为 PrometheusRule 资源。
- 添加 Alerting v2beta1 APIs。
- 在 Kubesphere 的 ks-apiserver 中集成了 opensearch 的 v1 和 v2 版本，用户可以使用外置或内置的 opensearch 集群进行日志的存储和查询。（目前 Kubesphere 内置的 opensearch 版本为 v2）
- ks-installer 集成了 opensearch 的 dashboard，需要用户自行开启。 


### 优化增强
- 升级 Prometheus 栈依赖。
- 支持配置最大日志导出数量。
- 监控组件部署支持 Kubernetes PDB Apiversion 变更。 
- 升级 Notification Manager 到 v2.3.0。
- 支持删除集群时删除集群上的通知设置。
- 支持切换通知语言。
- 通知支持路由功能。


### 问题修复

- 修复潜在 Go 协程泄漏的问题。
- 修复 ingress P95 延迟时间 promql 语句。


## 多租户和多集群

### 优化增强

- 更新集群的时候校验集群 ID。

### 问题修复

- 确保在清理通知相关资源时集群状态正常。
- 修复针对新集群的校验问题。
- 修复集群状态信息不正确的问题。
- 限制企业空间授权集群不可重复。


## App Store

### 问题修复

- 修复 IPv6 环境下应用商店模块无法生成 ID 的问题。
- 修复应用模板 Home 字段缺失的问题。
- 修复应用模板图标缺失的问题。
- 修复应用模板缺少 Maintainers 字段的问题。
- 修复应用部署失败后无法重新部署的问题。
- 修复应用 ID 参数错误的问题。
- 修复部分应用无法正确安装的问题。
- 修复应用仓库状态不正确的问题。


## 网络

### 优化增强

- 升级依赖。

## 验证和授权

### 新特性

- 新增 inmemory cache。
- 新增 Resource Getter v1beta1。
- 新增 Resource Manager 写操作。

### 优化增强

- 新增 iam.kubesphere/v1beta1 RoleTemplate。
- 更新密码最小长度为 8 位。
- 修改 Version 的 API。
- 修改 identityProvider 的 API。
- 新增 IAM v1beta1 APIs。

### 问题修复

- 修复 enableMultiLogin 配置不生效的问题。

## API Changes

- 使用 autoscaling/v2 版本 API。
- 使用 batch/v1 版本的 API 。
- 更新 KubeSphere 健康检查 API。
- 修复 K8s 1.25 版本中 ks-apiserver 崩溃的问题。

## 用户体验

### 新特性

- Resource API 支持别名搜索。

### 问题修复

- 修复潜在 Websocket 链接泄漏的问题。

### 优化增强

- 使用 helm action 包代替直接使用 helm 二进制。
- 调整 kubectl terminal 中 bash 和 sh 的优先级。
- 修复由于 DiscoveryAPI 异常导致 ks-apiserver 无法启动的问题。 
- 修复容器组列表页按状态查询时，显示的状态与筛选的结果不一致的问题。
- 查询 Secret 支持 fieldSelector 筛选。

有关 KubeSphere 3.4.0 的 Issue 和贡献者详细信息，请参阅 [GitHub](https://github.com/kubesphere/kubesphere/blob/master/CHANGELOG/CHANGELOG-3.4.0.md)。