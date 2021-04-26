---
title: "Release Notes for 3.1.0"
keywords: "Kubernetes, KubeSphere, release-notes"
description: "KubeSphere Release Notes for 3.1.0"
linkTitle: "Release Notes - 3.1.0"
weight: 18100
---

## How to Install v3.1.0

- [Install KubeSphere v3.1.0 on Linux](https://github.com/kubesphere/kubekey)
- [Install KubeSphere v3.1.0 on existing Kubernetes](https://github.com/kubesphere/ks-installer)

## New Features and Enhancements

### Cluster management

- Simplified the steps to import Member Clusters with configuration validation (e.g. `jwtSecret`) added. ([#3232](https://github.com/kubesphere/kubesphere/issues/3232))
- Refactored the cluster controller and optimized the logic. ([#3234](https://github.com/kubesphere/kubesphere/issues/3234))
- Upgraded the built-in web Kubectl, the version of which is now consistent with your Kubernetes cluster version. ([#3103](https://github.com/kubesphere/kubesphere/issues/3103))
- Support customized resynchronization period of cluster controller. ([#3213](https://github.com/kubesphere/kubesphere/issues/3213))
- Support lightweight installation of Member Clusters without components such as Redis and OpenLDAP. ([#3056](https://github.com/kubesphere/kubesphere/issues/3056))
- Support high availability of Tower agent and server. ([#31](https://github.com/kubesphere/tower/issues/31))

### KubeEdge integration

You can now enable KubeEdge in your cluster and manage edge nodes on the KubeSphere console. ([#3070](https://github.com/kubesphere/kubesphere/issues/3070))

- Support the installation of both cloud and edge modules of KubeEdge.
- Support adding KubeEdge through the KubeSphere console.
- The logs and monitoring data of edge nodes can be collected.
- The network of edge nodes can be configured automatically as they join or leave a cluster.
- Taints can be added automatically as an edge node joins your cluster.
- You can use `nodeAffinity` to prevent cloud workloads (for example, DaemonSets) from being deployed to edge nodes. ([#1295](https://github.com/kubesphere/ks-installer/pull/1295), [#1297](https://github.com/kubesphere/ks-installer/pull/1297) and [#1300](https://github.com/kubesphere/ks-installer/pull/1300))
- Support the deployment of workloads on edge nodes.

### Authorization and authentication management 
- New users now see a prompt to change the old password when first logging in to KubeSphere.
- New users now need to confirm account information when logging in to KubeSphere through a third party.
- Added ServiceAccount management. ([#3211](https://github.com/kubesphere/kubesphere/issues/3211))
- Improved the LDAP authentication plugin and added support for LDAPS and search filtering. ([#2970](https://github.com/kubesphere/kubesphere/issues/2970) and [#3766](https://github.com/kubesphere/kubesphere/issues/3766))
- Improved the identify provider plugin and simplified the configuration of identify providers. ([#2970](https://github.com/kubesphere/kubesphere/issues/2970))
- Support [CAS](https://apereo.github.io/cas/5.0.x/protocol/CAS-Protocol-Specification.html) as an available identity provider. ([#3047](https://github.com/kubesphere/kubesphere/issues/3047))
- Support [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) as an available identity provider. ([#2941](https://github.com/kubesphere/kubesphere/issues/2941))
- Support IDaaS (Alibaba Cloud Identity as a Service) as an available identity provider. ([#2997](https://github.com/kubesphere/kubesphere/pull/2997))


### Multi-tenant management
- Users now can configure departments in a workspace and assign users to the department. All users in the department can have the same role in a project or DevOps project. ([#2940](https://github.com/kubesphere/kubesphere/issues/2940))
- Support workspace quotas which are used to manage resource usage of a workspace. ([#2939](https://github.com/kubesphere/kubesphere/issues/2939))

### Network

- Added Kube-OVN.
- Support Calico IP pool management. ([#3057](https://github.com/kubesphere/kubesphere/issues/3057))
- Support visual network topology. ([#3061](https://github.com/kubesphere/kubesphere/issues/3061) and [#583](https://github.com/kubesphere/kubesphere/issues/583))
- A static IP address can be assigned to a Deployment now. ([#3058](https://github.com/kubesphere/kubesphere/issues/3058))

### Observability

- Improved the current method of Prometheus integration. ([#3068](https://github.com/kubesphere/kubesphere/issues/3068) and [#1164](https://github.com/kubesphere/ks-installer/pull/1164); [guide](/docs/faq/observability/byop/))
- Added Thanos Ruler (Thanos v0.18.0) for the new alerting function.
- Upgraded Prometheus to v2.26.0.
- Upgraded Prometheus Operator to v0.42.1.
- Upgraded kube-state-metrics to v1.9.7.
- Upgraded metrics-server to v0.4.2.
- Upgraded Notification Manager to v1.0.0. ([Releases](https://github.com/kubesphere/notification-manager/releases))
- Upgraded FluentBit Operator to v0.5.0. ([Releases](https://github.com/kubesphere/fluentbit-operator/releases))
- Upgraded FluentBit to v1.6.9.
- Upgraded KubeEvents to v0.2.0.

#### Monitoring

- Support configurations of ServiceMonitor on the KubeSphere console. ([#1031](https://github.com/kubesphere/console/pull/1301))
- Support PromQL auto-completion and syntax highlighting. ([#1307](https://github.com/kubesphere/console/pull/1307))
- Support customized monitoring at the cluster level. ([#3193](https://github.com/kubesphere/kubesphere/pull/3193))
- kube-scheduler 与 kube-controller-manager 数据抓取由 http 端口 10251/10252 改为 https 端口 10259/10257[#1367](https://github.com/kubesphere/ks-installer/pull/1367)

#### 告警

- 支持 Prometheus 风格的告警规则配置管理 [#3181](https://github.com/kubesphere/kubesphere/pull/3181)
- 支持平台及项目层级的告警规则 [#3181](https://github.com/kubesphere/kubesphere/pull/3181)
- 支持显示告警规则的实时告警状态 [#3181](https://github.com/kubesphere/kubesphere/pull/3181)

#### 通知管理 

- 新增 钉钉、 企业微信、Slack、Webhook 通知方式，其提供图形化管理[#3066](https://github.com/kubesphere/kubesphere/issues/3066)

#### 日志

- 支持将日志输出到 [Loki](https://github.com/kubesphere/fluentbit-operator/blob/master/docs/plugins/output/loki.md) [#39](https://github.com/kubesphere/fluentbit-operator/pull/39)
- 支持收集 kubelet/docker/containerd 的日志 [#38](https://github.com/kubesphere/fluentbit-operator/pull/38)
- 支持收集 [auditd](https://github.com/kubesphere/fluentbit-operator#auditd)的日志 [#45](https://github.com/kubesphere/fluentbit-operator/pull/45)

### DevOps

- 支持 Gitlab 多分支流水线 [#3100](https://github.com/kubesphere/kubesphere/issues/3100)
- 可同时启动并运行多条流水线 [#1811](https://github.com/kubesphere/kubesphere/issues/1811)
- 支持流水线复制 [#3053](https://github.com/kubesphere/kubesphere/issues/3053)
- 新增权限可控的流水线审核机制 [#2483](https://github.com/kubesphere/kubesphere/issues/2483) [#3006](https://github.com/kubesphere/kubesphere/issues/3006)
- 访问 DevOps 工程首页可查看流水线运行状态 [#3007](https://github.com/kubesphere/kubesphere/issues/3007)
- 支持通过流水线 Tag 触发流水线运行 [#3051](https://github.com/kubesphere/kubesphere/issues/3051)
- 支持 S2I Webhook [#6](https://github.com/kubesphere/s2ioperator/issues/6)
- 优化在输入错误的流水线定时参数时的提示信息 [#2919](https://github.com/kubesphere/kubesphere/issues/2919)
- 优化创建流水线的交互体验 [#1283](https://github.com/kubesphere/console/issues/1283)
- 优化 S2I 错误提示信息 [#140](https://github.com/kubesphere/s2ioperator/issues/140)
- 升级 Jenkins 至 2.249.1 [#2618](https://github.com/kubesphere/kubesphere/issues/2618)
- 调整 Jenkins 部署方式为 Jenkins distribution [#2182](https://github.com/kubesphere/kubesphere/issues/2182)

### 应用商店及应用

- 新增 MySQL 高可用集群应用：[XenonDB](https://github.com/radondb/xenondb)
- 支持修改已部署的应用模板
- 支持查看应用模板部署失败的原因 [#3036](https://github.com/kubesphere/kubesphere/issues/3036) [#3001](https://github.com/kubesphere/kubesphere/issues/3001) [#2951](https://github.com/kubesphere/kubesphere/issues/2951) 
- 支持批量删除应用模板

### 微服务治理

- 支持图形化流量方向检测，图像化方式显示应用（composed application）流量的流入/流出 [#3153](https://github.com/kubesphere/kubesphere/issues/3153)
- 支持 Kiali 附加组件，用户可以通过 Kiali直接管理 istio [#3106](https://github.com/kubesphere/kubesphere/issues/3106)
- 支持 Nginx Ingress Gateway 的监控，新增 nginx ingress controller 的监控指标 [#1205](https://github.com/kubesphere/ks-installer/pull/1205)
- 支持在创建应用时添加应用路由 [#1426](https://github.com/kubesphere/console/issues/1426) 
- 升级 istio 至 1.6.10 [#3326](https://github.com/kubesphere/kubesphere/issues/3236)

### 计量计费

- 支持集群、企业空间和应用级别的应用消耗量统计 [#3062](https://github.com/kubesphere/kubesphere/issues/3062)
- 通过 ConfigMap 方式可为计量资源配置计费单价

## 重要的技术调整

- 升级 Kubernetes 版本依赖，从 v1.17 调整至 v1.18 [#3274](https://github.com/kubesphere/kubesphere/issues/3274)
- 升级 Prometheus client_golang 版本依赖至 v1.5.1，升级 Prometheus 版本依赖至 v1.8.2 [3097](https://github.com/kubesphere/kubesphere/pull/3097)
- 基于 CRD 重构应用管理框架 OpenPitrix 并修复原有架构导致的问题 [#3036](https://github.com/kubesphere/kubesphere/issues/3036) [#3001](https://github.com/kubesphere/kubesphere/issues/3001) [#2995](https://github.com/kubesphere/kubesphere/issues/2995) [#2981](https://github.com/kubesphere/kubesphere/issues/2981) [#2954](https://github.com/kubesphere/kubesphere/issues/2954) [#2951](https://github.com/kubesphere/kubesphere/issues/2951) [#2783](https://github.com/kubesphere/kubesphere/issues/2783) [#2713](https://github.com/kubesphere/kubesphere/issues/2713) [#2700](https://github.com/kubesphere/kubesphere/issues/2700) [#1903](https://github.com/kubesphere/kubesphere/issues/1903) 
- 告警架构调整，不再使用 MySQL, Redis, Etcd 等组件以及旧版告警规则格式。改为使用 Thanos Ruler 配合 Prometheus 内置告警规则进行告警管理，新版告警兼容 Prometheus 告警规则。KubeSphere v3.0.0 中旧版告警规则会在升级到 v3.1.0 后自动迁移为新版告警规则。
- 通知架构调整，不再使用 MySQL, Redis, Etcd 等组件。 改为使用 [Notification Manager](https://github.com/kubesphere/notification-manager/) 以 CRD 的方式配置通知渠道。通知渠道设置由告警规则级别调整为集群级别，且多集群仅需设置一次通知渠道。

## 废弃或移除的功能

- 依赖 MySQL, Redis, Etcd 等组件的旧版告警与通知被新版告警与通知替代。
- 容器终端 WebSocket API 发生变更。[#3041](https://github.com/kubesphere/kubesphere/issues/3041)

## 问题修复
- 修复账户无法登录的问题 [#3132](https://github.com/kubesphere/kubesphere/issues/3132) [3357](https://github.com/kubesphere/kubesphere/issues/3357)
- 修复容器日志不支持ANSI Color的问题 [#1322](https://github.com/kubesphere/kubesphere/issues/3044)
- 修复以“kube”起始命名的项目（namespace）下的微服务应用无法获取istio 相关的监控数据的问题 [#3126](https://github.com/kubesphere/kubesphere/issues/3162) 
- 修复 viewer 可进入容器终端的安全隐患 [#3041](https://github.com/kubesphere/kubesphere/issues/3041)
- 修复级联资源无法被删除的问题 [#2912](https://github.com/kubesphere/kubesphere/issues/2912)
- 修复 Kubernetes 1.19 及以上版本无法正常使用的问题 [#2928](https://github.com/kubesphere/kubesphere/issues/2928) [#2928](https://github.com/kubesphere/kubesphere/issues/2928)
- 修复微服务应用“监控”按钮无效的问题 [#1394](https://github.com/kubesphere/console/issues/1394)
- 修复灰度发布的服务名不能与微服务应用的标签名相同的问题 [#3128](https://github.com/kubesphere/kubesphere/issues/3128)
- 修复微服务应用状态无法更新的问题 [#3241](https://github.com/kubesphere/kubesphere/issues/3241)
- 修复 host 和 member 集群在有同名企业空间的情况下，member 集群下的企业空间被删除的问题 [#3169](https://github.com/kubesphere/kubesphere/issues/3169)
- 修复通过 proxy 方式下联邦多集群连接断开的问题 [#3202](https://github.com/kubesphere/kubesphere/pull/3203)
- 修正多集群状态显示问题 [#3135](https://github.com/kubesphere/kubesphere/issues/3135)
- 修复 DevOps 流水线中无法部署工作负载的问题 [#3112](https://github.com/kubesphere/kubesphere/issues/3112)
- 修复 DevOps 工程管理员无法下载 artifacts 的问题 [#3088](https://github.com/kubesphere/kubesphere/issues/3083)
- 修复 DevOps 无法创建流水线的问题 [#3105](https://github.com/kubesphere/kubesphere/issues/3105)
- 修复多集群下流水线触发的问题 [#2626](https://kubesphere.com.cn/forum/d/2626-webhook-jenkins)
- 修复某些情况下编辑流水线时导致的数据丢失问题 [#1270](https://github.com/kubesphere/console/issues/1270)
- 修复点击 "Docker Container Registry Credentials"时的报错问题 [#1269](https://github.com/kubesphere/console/issues/1269)
- 修复英文控制台显示中文代码质量检查结果的问题 [#1278](https://github.com/kubesphere/console/issues/1278)
- 修复 Jenkinsfile 中包含布尔值时的显示报错问题 [#3043](https://github.com/kubesphere/kubesphere/issues/3043)
- 修复当 PVC 不含有 StorageClassName 时存储管理页面无法显示的问题 [#1109](https://github.com/kubesphere/ks-installer/issues/1109)
