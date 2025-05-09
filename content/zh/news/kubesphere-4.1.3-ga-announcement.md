---
title: 'KubeSphere 4.1.3 开源版正式发布'
tag: '产品动态'
keyword: '社区, 开源, 贡献, KubeSphere, release, 权限控制'
description: '本次发布的 KubeSphere 4.1.3 包含多项功能优化和缺陷修复，进一步提升安全性与易用性。'
createTime: '2025-03-26'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-4.1.3-ga%20-%20zh.png'
---


KubeSphere 4.1.3 开源版正式发布，本次更新包含多项功能优化和缺陷修复，进一步提升安全性与易用性。

## 功能优化

- **优化企业空间的级联删除逻辑**
   企业空间级联删除策略从被动改为主动，避免误操作。
- **调整部分平台角色、企业空间角色的授权规则**
   进一步细化 RBAC 授权规则，安全性提升。
- **优化 Pod 列表页的数据展示**
   更直观的展示资源状态信息，提升易用性。
- **允许用户关联多个身份提供程序**
   用户可同时绑定多个身份提供程序（IdP），提升灵活性和兼容性。 
- **支持手动触发应用仓库更新**
   用户可以主动刷新应用仓库，确保获取最新的应用版本信息。
- **新增“拒绝访问”页面**
   将非法的页面请求，重定向到“拒绝访问”页面。


## 缺陷修复

- 修复应用实例无法升级的问题
- 修复与预发布 K8s 版本号的兼容性问题
- 修复 LDAP 身份提供程序的配置问题
- 修复无法从 Docker Hub 和 Harbor 搜索镜像的问题
- 修复应用程序版本中处理特殊字符的问题
- 修复未安装网关扩展时无法创建 Ingress 的问题

## 安装升级

**欢迎广大用户下载体验，并提供宝贵反馈。**

### 注意事项

更多更新内容，请参阅 [KubeSphere 4.1.3 发布说明](https://kubesphere.io/zh/docs/v4.1/20-release-notes/release-v413/)。

安装与升级，请参阅 [安装指南](https://kubesphere.io/zh/docs/v4.1/03-installation-and-upgrade/)。

注意：暂不支持从 v3.x 版本直接升级到 v4.x，计划在4月下旬的版本更新中支持。


### 反馈渠道：

提交 Issue：[GitHub Issues](https://github.com/kubesphere/kubesphere/issues/new/choose)

社区讨论：[KubeSphere 论坛](https://ask.kubesphere.com.cn/forum/)

## 未来展望 

在未来的版本更新中，KubeSphere 团队将持续关注开源社区的需求与反馈。我们承诺始终不忘初心，为广大的开源用户提供更稳定、更安全、更高效的产品体验。随着 KubeSphere 的不断演进，我们将不断优化平台的性能和功能，特别是在易用性、安全性以及多云环境支持等方面，确保用户在快速变化的技术环境中保持领先。

感谢每一位 KubeSphere 用户的支持和贡献，我们将继续努力，为大家带来更多惊喜和实用功能。期待您在未来的版本中，依旧能与我们一同成长和进步。
