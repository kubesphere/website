---
title: 'KubeSphere 3.3.2 发布'
tag: '产品动态'
keyword: '社区, 开源, 贡献, KubeSphere, release, 权限控制'
description: '本次发布的 KubeSphere v3.3.2 带来了更多的优化增强，主要集中在对 DevOps 和应用商店易用性的提升和问题修复。'
createTime: '2023-02-10'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/KS-3.3.2-GA.png'
---

距离上一个版本 v3.3.1 发布，已经过了 3 个多月，今天我们很高兴宣布 KubeSphere v3.3.2 正式发布！

此版本由 68 位贡献者参与代码提交，感谢各位贡献者对 KubeSphere 项目的支持与贡献！

本次发布的 KubeSphere v3.3.2 带来了更多的优化增强，主要集中在对 DevOps 和应用商店易用性的提升和问题修复。以下是一些重点特性的介绍。

## DevOps

- 将流水线运行的结果从 annotations 挪到 configmap 中，防止复杂场景超过 annotation 大小限制的问题。
- 优化持续部署创建和使用的流程和文案。
- 中止状态的流水线支持链接查看详情。
- 优化 kubectl 命令查看 PipelineRun 时的展示，增加 ID 列。
- 优化流水线运行的生命周期，去掉 Queued 状态。
- 修复用户修改并保存流水线配置后，Webhook 配置丢失的问题。
- 修复下载流水线制品失败的问题。
- 修复因 jenkins 自动清理导致流水线变成“未运行”状态的问题。
- 修复流水线的自动清理策略，使其与 Jenkins 的清理保持一致。


## 应用商店优化

+ 修复上传的应用程序模板上不显示图标的问题。
+ 修复应用商店应用信息处没有显示应用首页的问题。
+ 修复应用商店导入内置应用时导入失败的问题。
+ 修复 IPv6 环境下 UUID 生成错误的问题。


## 更多细节

除了上述提到的新特性和功能增强，该版本中还有很多细节改进，例如：

+ 限制项目的网络隔离范围为当前企业空间。
+ 在多集群环境中显示 system-workspace 所属集群。
+ 增加了动态的 cache 配置项。
+ 修复拥有集群管理权限的平台角色无法管理集群的问题。
+ 修复 ks-apiserver 在 Kubernetes 1.24+ 版本中异常崩溃的问题。

可以访问下方链接来查看完整的 Release Notes：

https://kubesphere.io/zh/docs/v3.3/release/release-v332/