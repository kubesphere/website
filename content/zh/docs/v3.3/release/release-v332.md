---
title: "3.3.2 版本说明"
keywords: "Kubernetes, KubeSphere, 版本说明"
description: "KubeSphere 3.3.2 版本说明"
linkTitle: "3.3.2 版本说明"
weight: 18095
version: "v3.3"
---

## DevOps

### 优化增强

- 添加最新的 GitHub Actions。
- 将 PipelineRun 的结果保存到 configmap 中。
- 修改持续部署应用程序状态的中文描述。
- 为持续部署参数添加更丰富的信息。
- 为处于中止状态的 PipelineRun 添加链接。
- 为 PipelineRun 增加 ID 列，用于执行 kubectl 命令时展示。
- PipelineRun 生命周期中去掉 Queued 状态。

### 问题修复

- 修复用户修改并保存流水线配置后 Webhook 配置丢失的问题。
- 修复下载 DevOps 流水线制品失败的问题。
- 修复使用 JAR/WAR 文件创建服务时，镜像地址不匹配的问题。
- 修复 PipelineRun 从“取消”状态变成“未运行”状态的问题。
- 修复 Pipeline 的自动清理策略，使其与 Jenkins 的清理保持一致。


## App Store

### 问题修复

- 修复上传的应用程序模板上不显示图标的问题。
- 修复应用商店应用信息处没有显示应用首页的问题。
- 修复应用商店导入内置应用时导入失败的问题。
- 修复 IPv6 环境下 UUID 生成错误的问题。

## 可观测性

### 问题修复

-  修复 logsidecar-injector 配置文件中的解析问题。

## 微服务

### 问题修复

- 修复未启用 service mesh 时创建的 Bookinfo 项目没有默认关闭应用治理的问题。
- 修复蓝绿部署发布模式下线按钮缺失的问题。

## 网络

### 优化增强

- 限制项目的网络隔离范围为当前企业空间。

## 存储

### 优化增强

- 在多集群环境中显示 system-workspace 所属集群。
- 将“应用路由”的英文词条由 “route” 修改为 “ingress”。

### 问题修复

- 修复编辑联邦项目中的持久卷声明存储类错误的问题。

## 验证和授权

### 优化增强

- 增加了动态的 cache 配置项。
- 移除“告警消息管理”权限。

### 问题修复

- 修复拥有集群管理权限的平台角色无法管理集群的问题。

## 开发 & 测试

### 问题修复

- 修复引入热加载功能后部分数据后处于“不同步”状态的问题。
- 修复 ks-apiserver 多次重载后崩溃的问题。
- 修复缺少必要的 CRD 造成的资源缓存失败问题。
- 修复 ks-apiserver 在 Kubernetes 1.24+ 版本中异常崩溃的问题。
- 修复审计功能中协程泄露的问题。 

## 用户体验

- 限制集群名称长度。
- 修复 pod 副本不能自动刷新的问题。
- 修复删除服务时，相关的 pod 没有删除的问题。
- 修复只有一个节点时，节点数量和角色显示错误的问题。

有关 KubeSphere 3.3.2 的 Issue 和贡献者详细信息，请参阅 [GitHub](https://github.com/kubesphere/kubesphere/blob/master/CHANGELOG/CHANGELOG-3.3.2.md)。
