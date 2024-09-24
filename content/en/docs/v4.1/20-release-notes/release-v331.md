---
title: "3.3.1 版本说明"
keywords: "Kubernetes, KubeSphere, 版本说明"
description: "KubeSphere 3.3.1 版本说明"
linkTitle: "3.3.1 版本说明"
weight: 49
---

## DevOps
### 优化增强

- 支持通过 UI 编辑流水线中 kubeconfig 文件绑定方式。

### 问题修复
- 修复用户查看 CI/CD 模板失败的问题。
- 将 `Deprecated` 标签从 CI/CD 模版中移除，并将部署环节由 `kubernetesDeploy` 修改为 kubeconfig 绑定方式。

## 网络
### 问题修复
- 修复 IPv4/IPv6 双栈模式下用户创建路由规则失败的问题。

## 存储
### 问题修复
- 当用户使用 `hostpath` 作为存储时，必须填写主机路径。


## 验证和授权
### 问题修复
- 删除角色 `users-manager` 和 `workspace-manager`。
- 新增角色 `platform-self-provisioner`。
- 屏蔽用户自定义角色的部分权限。


## 用户体验
- 支持修改每页列表的展示数量。
- 新增对 statefulset 和 deamonset 批量停止的支持

有关 KubeSphere 3.3.1 的 Issue 和贡献者详细信息，请参阅 [GitHub](https://github.com/kubesphere/kubesphere/blob/master/CHANGELOG/CHANGELOG-3.3.1.md)。
