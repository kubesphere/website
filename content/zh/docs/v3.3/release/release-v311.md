---
title: "Release Notes for 3.1.1"
keywords: "Kubernetes, KubeSphere, release-notes"
description: "KubeSphere Release Notes for 3.1.1"
linkTitle: "Release Notes - 3.1.1"
weight: 18100
version: "v3.3"
---

## 用户体验

### 优化增强

- 删除工作负载时支持批量删除关联资源 [kubesphere/console#1933](https://github.com/kubesphere/console/pull/1933)
- 优化页面弹框 [kubesphere/console#2016](https://github.com/kubesphere/console/pull/2016)
- 允许在 system-workspace 下的项目中使用容器终端 [kubesphere/console#1921](https://github.com/kubesphere/console/pull/1921)

### 问题修复

- 移除服务管理页面中 headless service 编辑外网访问功能 [kubesphere/console#2055](https://github.com/kubesphere/console/issues/2055)
- 修复了创建工作负载时环境变量中占位符无法正确展示的问题 [kubesphere/console#2008](https://github.com/kubesphere/console/pull/2008)
- 修复了在特定页面登出时无法正确重定向至登录页面的问题 [kubesphere/console#2009](https://github.com/kubesphere/console/pull/2009)
- 修复了容器组模板编辑页面中协议下拉框显示不全的问题 [kubesphere/console#1944](https://github.com/kubesphere/console/pull/1944)
- 修复了工作负载创建时探针格式校验的问题 [kubesphere/console#1941](https://github.com/kubesphere/console/pull/1941)
- 修复了企业空间成员详情页面中 DevOps 项目列表展示错误的问题 [#1936](https://github.com/kubesphere/console/pull/1936)
- 修复文案错误、缺失的问题 [kubesphere/console#1879](https://github.com/kubesphere/console/pull/1879) [kubesphere/console#1880](https://github.com/kubesphere/console/pull/1880) [kubesphere/console#1895](https://github.com/kubesphere/console/pull/1895)

## 可观测性

### 优化增强

- 优化了通知设置中端口号的格式限制[#1885](https://github.com/kubesphere/console/pull/1885)
- 支持安装时指定使用已有的 Prometheus. [#1528](https://github.com/kubesphere/ks-installer/pull/1528) 

### 问题修复

- 修复邮件服务器同步错误 [#1969](https://github.com/kubesphere/console/pull/1969)
- 修复重启 installer 后 notification manager 会被重置的问题 [#1564](https://github.com/kubesphere/ks-installer/pull/1564)
- 修复了删除监测对象后不能删除其告警策略的问题 [#2045](https://github.com/kubesphere/console/pull/2045)
- 修复了增加监控资源无默认模板的问题 [#2029](https://github.com/kubesphere/console/pull/2029)
- 修复了容器只显示老日志的问题[#1972](https://github.com/kubesphere/console/issues/1972)
- 修复了告警信息时间显示错误的问题 [#1978](https://github.com/kubesphere/console/pull/1978)
- 完善了一些创建告警规则时的输入规则 [#1958](https://github.com/kubesphere/console/pull/1958)
- 修复了自定义监控因可视区的高度导致级联选择无法完全显示指标的问题 [#1989](https://github.com/kubesphere/console/pull/1989)
- 调整了 node exporter 和 kube-state-metrics 的 limit [#1537](https://github.com/kubesphere/ks-installer/pull/1537)
- 微调了对 etcdHighNumberOfFailedGRPCRequests 规则的选择器，来避免错误的 etcd 告警 [#1540](https://github.com/kubesphere/ks-installer/pull/1540)
- 修复升级时 events ruler 组件未升到新版本的问题 [#1594](https://github.com/kubesphere/ks-installer/pull/1594)
- 修复规则选择器：kube_node_status_allocatable_memory_bytes, kube_resourcequota [#1560](https://github.com/kubesphere/ks-installer/pull/1560)

## 微服务治理

### 优化增强

- 优化 trace 页面增加时间选择器 [#2022](https://github.com/kubesphere/console/pull/2022)

### 问题修复

- 修复 trace 选项卡无法正常展示的问题 [kubesphere/console#1890](https://github.com/kubesphere/console/pull/1890)

## DevOps

### 优化增强

- 支持 GitLab 多分支流水线按分支名筛选过滤 [kubesphere/console#2077](https://github.com/kubesphere/console/pull/2077)
- 更改了 b2i 页面的“重新执行”按钮为“执行”[kubesphere/console#1981](https://github.com/kubesphere/console/pull/1981)

### 问题修复

- 修复凭证状态无法同步的问题 [kubesphere/console#1956](https://github.com/kubesphere/console/pull/1956)
- 修复了 CI 自动推送镜像时 tag 错误的问题 [kubesphere/console#2037](https://github.com/kubesphere/console/pull/2037)
- 修复了在流水线详情页不能返回上一个页面的问题 [kubesphere/console#1996](https://github.com/kubesphere/console/pull/1996)
- 修复了镜像构建器弹窗名称不一致的问题 [kubesphere/console#1922](https://github.com/kubesphere/console/pull/1922)
- 修复了在 DevOps 项目中创建 kubeconfig 类型的证书更新被重置的问题 [kubesphere/console#1990](https://github.com/kubesphere/console/pull/1990)
- 修复了多分支流水线中信任用户错误的问题 [kubesphere/console#1987](https://github.com/kubesphere/console/pull/1987)
- 修复了 DevOps 项目中流水线 stage label 在配置其他项不保存后被重置的问题 [kubesphere/console#1979](https://github.com/kubesphere/console/pull/1979)
- 修复了 shell 和 lable 在流水线中显示不准确的问题 [kubesphere/console#1970](https://github.com/kubesphere/console/pull/1970)
- 修复了流水线基础信息对话框显示信息混乱的问题 [kubesphere/console#1955](https://github.com/kubesphere/console/pull/1955)
- 修复了多分支流水线运行 API 错误的问题 [kubesphere/console#1954](https://github.com/kubesphere/console/pull/1954)
- 修复了流水线中 webhook 推送设置无效的问题 [kubesphere/console#1953](https://github.com/kubesphere/console/pull/1953)
- 修复了流水线编辑器中关于拖拽功能的文案 [kubesphere/console#1949](https://github.com/kubesphere/console/pull/1949)
- 修复了从源码构建服务中构建环境中无默认选项的问题 [kubesphere/console#1993](https://github.com/kubesphere/console/pull/1993)

## 认证与鉴权

### 问题修复

- 修复用户最近登录时间错误的问题 [kubesphere/console#1881](https://github.com/kubesphere/console/pull/1881)
- 修复企业空间 admin 用户无法查看资源配额的问题 [kubesphere/ks-installer#1551](https://github.com/kubesphere/ks-installer/pull/1551) [kubesphere/console#2062](https://github.com/kubesphere/console/pull/2062)
- 修复项目成员无法连接容器终端的问题 [kubesphere/console#2002](https://github.com/kubesphere/console/pull/2002)
- 修复为项目分配企业空间时无法指定管理员的问题 [kubesphere/console#1961](https://github.com/kubesphere/console/pull/1961)
- 修复创建企业空间角色时权限项名称重复的问题 [kubesphere/console#1945](https://github.com/kubesphere/console/pull/1945)

## 多租户管理

### 问题修复

- 修复用户组可以关联已删除角色的问题 [#1899](https://github.com/kubesphere/console/pull/1899) [#3897](https://github.com/kubesphere/kubesphere/pull/3897)
- 修复了删除长用户名用户引起的系统崩溃问题 [kubesphere/ks-installer#1450](https://github.com/kubesphere/ks-installer/pull/1450) [kubesphere/kubesphere#3796](https://github.com/kubesphere/kubesphere/pull/3796)
- 修复用户组绑定项目角色提示出错的问题 [kubesphere/console#1967](https://github.com/kubesphere/console/pull/1967)
- 修复多集群环境企业空间配额展示错误的问题 [kubesphere/console#2013](https://github.com/kubesphere/console/pull/2013)

## 多集群管理

### 优化增强

- 优化了 member 集群配置错误时的提示信息 [kubesphere/console#2084](https://github.com/kubesphere/console/pull/2084) [kubesphere/console#1965](https://github.com/kubesphere/console/pull/1965)

### 问题修复

- 修复了不能获取 member 集群中节点标签的问题 [kubesphere/console#1927](https://github.com/kubesphere/console/pull/1927)
- 修复项目列表页面未正确区分多集群项目的问题 [kubesphere/console#2059](https://github.com/kubesphere/console/pull/2059)
- 修复多集群项目下网关开启状态展示错误的问题 [kubesphere/console#1939](https://github.com/kubesphere/console/pull/1939)

## 计量计费

### 优化增强

- 计量计费部分的 UI 调整 [kubesphere/console#1896](https://github.com/kubesphere/console/pull/1896)
- 修改了计量计费按钮的颜色 [kubesphere/console#1934](https://github.com/kubesphere/console/pull/1934)

### 问题修复

- 修复了计量计费无法涵盖 OpenPitrix 资源的问题 [kubesphere/console#3871](https://github.com/kubesphere/kubesphere/pull/3871)
- 修复了 system-workspace 计量计费中的报错问题 [kubesphere/console#2083](https://github.com/kubesphere/console/pull/2083)
- 修复了多集群计量计费列表中未显示所有项目的问题 [kubesphere/console#2066](https://github.com/kubesphere/console/pull/2066)
- 修复了由于所依赖的集群未加载导致的计费页面报错 [kubesphere/console#2054](https://github.com/kubesphere/console/pull/2054)


## 应用商店

### 优化增强

- 优化应用模板创建页面提示文案与页面布局 [kubesphere/console#2012](https://github.com/kubesphere/console/pull/2012) [kubesphere/console#2063](https://github.com/kubesphere/console/pull/2063)
- 优化应用导入功能 [kubesphere/openpitrix-jobs#18](https://github.com/kubesphere/openpitrix-jobs/pull/18)
- 应用商店中新增 RadonDB PostgreSQL 应用 [kubesphere/openpitrix-jobs#17](https://github.com/kubesphere/openpitrix-jobs/pull/17)



## 安全

### 优化增强

- 切换 jwt-go 的分支，用于修复 CVE-2020-26160 [#3991](https://github.com/kubesphere/kubesphere/pull/3991)
- 升级 protobuf 版本至 v1.3.2 用于修复 CVE-2021-3121 [#3944](https://github.com/kubesphere/kubesphere/pull/3944)
- 升级 crypto 至最新版用于修复 CVE-2020-29652 [#3997](https://github.com/kubesphere/kubesphere/pull/3997)
- 移除了 yarn.lock 文件以避免一些 CVE 漏洞误报 [#2024](https://github.com/kubesphere/console/pull/2024)

### 问题修复

- 修复了容器终端越权访问的问题 [kubesphere/kubesphere#3956](https://github.com/kubesphere/kubesphere/pull/3956)

## 存储

### 优化增强

- 提升了 s3 uploader 并发性能 [#4011](https://github.com/kubesphere/kubesphere/pull/4011)
- 增加预置的 CSI Provisioner CR 配置 [#1536](https://github.com/kubesphere/ks-installer/pull/1536)

### 问题修复

- 移除了无效的自动探测存储类的功能 [#3947](https://github.com/kubesphere/kubesphere/pull/3947)
- 修复关于项目配额存储资源单位错误引导的问题 [#3973](https://github.com/kubesphere/kubesphere/issues/3973)

## KubeEdge 集成

### 优化增强

- 支持 KubeEdge v1.6.2 [#1527](https://github.com/kubesphere/ks-installer/pull/1527) [#1542](https://github.com/kubesphere/ks-installer/pull/1542)

### 问题修复

- 修复了 KubeEdge CloudCore 组件 advertiseAddress 配置错误的问题 [#1561](https://github.com/kubesphere/ks-installer/pull/1561)