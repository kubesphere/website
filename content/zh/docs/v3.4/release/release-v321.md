---
title: "3.2.1 版本说明"  
keywords: "Kubernetes, KubeSphere, 版本说明"  
description: "KubeSphere 3.2.1 版本说明"  
linkTitle: "3.2.1 版本说明"  
weight: 18099
---

## 功能优化与问题修复

### 功能优化

- 新增支持按状态过滤容器组。（[#4434](https://github.com/kubesphere/kubesphere/pull/4434)，[@iawia002](https://github.com/iawia002)，[#2620](https://github.com/kubesphere/console/pull/2620)，[@weili520](https://github.com/weili520)）
- 在镜像构建器创建对话框中增加不支持 containerd 的提示。（[#2734](https://github.com/kubesphere/console/pull/2734)，[@weili520](https://github.com/weili520)）
- 在**编辑项目配额**对话框中增加可用配额信息。（[#2619](https://github.com/kubesphere/console/pull/2619)，[@weili520](https://github.com/weili520)）

### 问题修复

- 更改密码校验规则以阻止不包含大写字母的密码。（[#4481](https://github.com/kubesphere/kubesphere/pull/4481)，[@live77](https://github.com/live77)）
- 修复 KubeSphere 上不存在相关用户信息时，无法使用来自 LDAP 的用户登录的问题。（[#4436](https://github.com/kubesphere/kubesphere/pull/4436)，[@RolandMa1986](https://github.com/RolandMa1986)）
- 修复无法获取集群网关指标信息的问题。（[#4457](https://github.com/kubesphere/kubesphere/pull/4457)，[@RolandMa1986](https://github.com/RolandMa1986)）
- 修复存储卷列表访问模式显示不正确的问题。（[#2686](https://github.com/kubesphere/console/pull/2686)，[@weili520](https://github.com/weili520)）
- 移除**网关设置**页面的**更新**按钮。（[#2608](https://github.com/kubesphere/console/pull/2608)，[@weili520](https://github.com/weili520)）
- 修复时间范围选择下拉列表显示错误的问题。（[#2715](https://github.com/kubesphere/console/pull/2715)，[@weili520](https://github.com/weili520)）
- 修复保密字典数据文本过长时文本显示不正确的问题。（[#2600](https://github.com/kubesphere/console/pull/2600)，[@weili520](https://github.com/weili520)）
- 修复挂载存储卷模板时有状态副本集创建失败的问题。（[#2730](https://github.com/kubesphere/console/pull/2730)，[@weili520](https://github.com/weili520)）
- 修复用户没有查看群集信息的权限时系统无法获取集群网关信息的问题。（[#2695](https://github.com/kubesphere/console/pull/2695)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 修复流水线状态和运行记录无法自动更新的问题。（[#2594](https://github.com/kubesphere/console/pull/2594)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 对 kubernetesDeply 流水线步骤增加该步骤将被弃用的提示。（[#2660](https://github.com/kubesphere/console/pull/2660)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 修复镜像仓库保密字典使用 HTTP 仓库地址时无法通过验证的问题。（[#2795](https://github.com/kubesphere/console/pull/2795)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 修复 Harbor 镜像 URL 错误的问题。（[#2784](https://github.com/kubesphere/console/pull/2784)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 修复日志搜索结果显示错误的问题。（[#2598](https://github.com/kubesphere/console/pull/2598)，[@weili520](https://github.com/weili520)）
- 修复存储卷实例 YAML 配置中的错误。（[#2629](https://github.com/kubesphere/console/pull/2629)，[@weili520](https://github.com/weili520)）
- 修复**编辑项目配额**对话框中可用企业空间配额显示不正确的问题。（[#2613](https://github.com/kubesphere/console/pull/2613)，[@weili520](https://github.com/weili520)）
- 修复**监控**对话框中时间范围选择下拉列表功能不正常的问题。（[#2722](https://github.com/kubesphere/console/pull/2722)，[@weili520](https://github.com/weili520)）
- 修复部署创建页面可用配额显示不正确的问题。（[#2668](https://github.com/kubesphere/console/pull/2668)，[@weili520](https://github.com/weili520)）
- 将文档地址更改为 [kubesphere.io](http://kubesphere.io) 和 [kubesphere.com.cn](http://kubesphere.io)。（[#2628](https://github.com/kubesphere/console/pull/2628)，[@weili520](https://github.com/weili520)）
- 修复无法修改部署存储卷设置的问题。（[#2656](https://github.com/kubesphere/console/pull/2656)，[@weili520](https://github.com/weili520)）
- 修复浏览器语言必须为英文、简体中文或繁体中文时才能访问容器终端的问题。（[#2702](https://github.com/kubesphere/console/pull/2702)，[@weili520](https://github.com/weili520)）
- 修复部署编辑对话框中存储卷状态显示不正确的问题。（[#2622](https://github.com/kubesphere/console/pull/2622)，[@weili520](https://github.com/weili520)）
- 移除凭证详情页面显示的标签。（[#2621](https://github.com/kubesphere/console/pull/2621)，[@123liubao](https://github.com/123liubao)）