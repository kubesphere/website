---
title: "4.1.3 版本说明"
keywords: "Kubernetes, KubeSphere, 版本说明"
description: "KubeSphere 4.1.3 版本说明"
linkTitle: "4.1.3 版本说明"
weight: 43
---

## KubeSphere

### 优化

- 优化企业空间的级联删除逻辑。
- 调整部分平台角色、企业空间角色的授权规则。
- 优化 Pod 列表页的数据展示。
- 允许用户关联多个身份提供程序。
- 支持手动触发应用仓库更新。
- 新增“拒绝访问”页面。
- 调整 Helm Chart 中集群角色配置方式。

### 缺陷修复

- 修复 web kubectl 中潜在的权限提升漏洞。
- 修复应用实例无法升级的问题。
- 修复与预发布 K8s 版本号的兼容性问题。
- 修复 LDAP 身份提供程序 LDAPS 和 STARTTLS 的配置问题。
- 修复无法从 Docker Hub 和 Harbor 搜索镜像的问题。
- 修复应用程序版本中处理特殊字符的问题。
- 修复未安装网关扩展时无法创建 Ingress 的问题。
