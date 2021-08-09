---
title: 'KubeSphere 3.1.1 发布，支持接入集群已有的 Prometheus'
tag: 'Kubernetes,KubeSphere,release'
keywords: 'Kubernetes, KubeSphere, Prometheus'
description: 'KubeSphere 3.1.1 版本正式发布，支持接入集群已有的 Prometheus。同时在用户体验、可观测性、微服务治理、DevOps、多集群管理、计量计费、应用商店、安全、存储和边缘计算等多个方面进行了增强和优化。KubeSphere 3.1.1 不是大版本更新，只是针对 v3.1.0 的 patch 版本。'
createTime: '2021-07-15'
author: 'KubeSphere'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/3.1.1-GA.png'
---

KubeSphere 作为一款面向应用的开源容器平台，经过 3 年的发展和 10 个版本的迭代，收获了两百多位开源贡献者，超过十万次下载，并有数千名社区用户用 KubeSphere 作为企业容器平台。

7 月 7 日，KubeSphere 3.1.1 版本正式发布，**部署 KubeSphere 3.1.1 时可以指定 Kubernetes 集群中已有的 Prometheus。**

本文将会详细介绍 KubeSphere 3.1.1 比较重要的功能优化增强。

> KubeSphere 3.1.1 不是大版本更新，只是针对 v3.1.0 的 patch 版本作。本文只列出优化增强的功能，问题修复请查看完整的 Release Notes。

## 安装与升级

- [在 Linux 中安装 KubeSphere 3.1.1](https://github.com/kubesphere/kubekey/blob/master/README_zh-CN.md)
- [在 Kubernetes 中安装 KubeSphere 3.1.1](https://github.com/kubesphere/ks-installer/blob/master/README_zh.md#%E9%83%A8%E7%BD%B2-kubesphere)
- [从 KubeSphere 低版本升级到 3.1.1 版本](https://github.com/kubesphere/ks-installer/blob/master/README_zh.md#%E5%8D%87%E7%BA%A7)

## 优化增强的功能

### 用户体验

- 删除工作负载时支持批量删除关联资源 [#1933](https://github.com/kubesphere/console/pull/1933)
- 优化页面弹框 [#2016](https://github.com/kubesphere/console/pull/2016)
- 允许在 system-workspace 下的项目中使用容器终端 [#1921](https://github.com/kubesphere/console/pull/1921)

### 可观测性

- 优化了通知设置中端口号的格式限制 [#1885](https://github.com/kubesphere/console/pull/1885)
- 支持安装时指定使用已有的 Prometheus [#1528](https://github.com/kubesphere/ks-installer/pull/1528)

### 微服务治理

- 优化 trace 页面增加时间选择器 [#2022](https://github.com/kubesphere/console/pull/2022)

### DevOps

- 支持 GitLab 多分支流水线按分支名筛选过滤 [#2077](https://github.com/kubesphere/console/pull/2077)
- 更改了 b2i 页面的“重新执行”按钮为“执行” [#1981](https://github.com/kubesphere/console/pull/1981)

### 多集群管理

- 优化了 member 集群配置错误时的提示信息 [#2084](https://github.com/kubesphere/console/pull/2084) [#1965](https://github.com/kubesphere/console/pull/1965)

### 计量计费

- 计量计费部分的 UI 调整 [#1896](https://github.com/kubesphere/console/pull/1896)
- 修改了计量计费按钮的颜色 [#1934](https://github.com/kubesphere/console/pull/1934)

### 应用商店

- 优化应用模板创建页面提示文案与页面布局 [#2012](https://github.com/kubesphere/console/pull/2012) [#2063](https://github.com/kubesphere/console/pull/2063)
- 优化应用导入功能 [kubesphere/openpitrix-jobs#18](https://github.com/kubesphere/openpitrix-jobs/pull/18)
- 应用商店中新增 RadonDB PostgreSQL 应用 [kubesphere/openpitrix-jobs#17](https://github.com/kubesphere/openpitrix-jobs/pull/17)

### 安全

- 切换 jwt-go 的分支，用于修复 CVE-2020-26160 [#3991](https://github.com/kubesphere/kubesphere/pull/3991)
- 升级 protobuf 版本至 v1.3.2 用于修复 CVE-2021-3121 [#3944](https://github.com/kubesphere/kubesphere/pull/3944)
- 升级 crypto 至最新版用于修复 CVE-2020-29652 [#3997](https://github.com/kubesphere/kubesphere/pull/3997)
- 移除了 yarn.lock 文件以避免一些 CVE 漏洞误报 [#2024](https://github.com/kubesphere/console/pull/2024)

### 存储

- 提升了 s3 uploader 并发性能 [#4011](https://github.com/kubesphere/kubesphere/pull/4011)
- 增加预置的 CSI Provisioner CR 配置 [#1536](https://github.com/kubesphere/ks-installer/pull/1536)

### KubeEdge 集成

- 支持 KubeEdge v1.6.2 [#1527](https://github.com/kubesphere/ks-installer/pull/1527) [#1542](https://github.com/kubesphere/ks-installer/pull/1542)

## 下载与升级

大家可以到 KubeSphere GitHub 主页查看完整的[英文版 KubeSphere 3.1.1 Release Notes](https://github.com/kubesphere/kubesphere/releases/tag/v3.1.1)，了解更多与升级有关的注意事项。国内用户也可以访问下方链接来查看完整的 Release Notes：

- [https://kubesphere.com.cn/docs/release/release-v311/](https://kubesphere.com.cn/docs/release/release-v311/)