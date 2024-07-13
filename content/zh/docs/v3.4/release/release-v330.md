---
title: "3.3.0 版本说明"
keywords: "Kubernetes, KubeSphere, 版本说明"
description: "KubeSphere 3.3.0 版本说明"
linkTitle: "3.3.0 版本说明"
weight: 18098
version: "v3.4"
---

## DevOps
### 新特性
- 提供了基于 GitOps 的持续部署方案，底层支持 Argo CD，可以实时查看持续部署的状态。
- 支持配置持续部署白名单，限制持续部署的目标代码仓库和部署位置。
- 支持导入并管理代码仓库。
- 新增多款基于 CRD 的内置流水线模板，支持参数自定义。
- 支持查看流水线事件。
## 存储
### 新特性
- 支持租户级存储类权限管理。
- 新增卷快照内容和卷快照类管理。
- 支持 deployment 与 statefulSet 资源调整存储卷声明修改后自动重启。
- 支持存储卷声明设定使用阈值自动扩容。

## 多租户和多集群
### 新特性
- 支持 kubeconfig 证书到期提示。
- 支持 kubesphere-config configmap 以显示当前集群的名称。
- 支持集群层级的成员管理。

## 可观察性
### 新特性
- 增加容器进程/线程监控指标。
- 支持监控节点用量。
- 支持导入 Grafana 模板实现自定义监控看板。
- 支持为容器日志、资源事件和审计日志指定不同的数据保存时间。

### 优化增强
- Alertmanager 从 v0.21.0 升级至 v0.23.0。
- Grafana 从 7.4.3 升级至 8.3.3。
- kube-state-metrics 从 v1.9.7 升级至 v2.3.0。
- node-exporter 从 v0.18.1 升级至 v1.3.1。
- Prometheus 从 v2.26.0 升级至 v2.34.0。
- Prometheus Operator 从 v0.43.2 升级至 v0.55.1。
- kube-rbac-proxy 从 v0.8.0 升级至 v0.11.0。
- configmap-reload 从 v0.3.0 升级至 v0.5.0。
- Thanos 从 v0.18.0 升级至 v0.25.2。
- kube-events 从 v0.3.0 升级至 v0.4.0。
- Fluent Bit Operator 从 v0.11.0 升级至 v0.13.0。
- Fluent Bit 从 v1.8.3 升级至 v1.8.11。

## KubeEdge 集成
### 新特性
- 支持节点终端，可以直接在 UI 上登陆集群节点，包括边缘节点。
### 优化增强
- KubeEdge 版本从v1.7.2 升级到 v1.9.2。
- 移除 EdgeWatcher。

## 网络
### 优化增强
- 负载均衡类型选择新增 OpenELB。
### 问题修复
- 修复了删除项目后项目网关遗留的问题。
## App Store
### 问题修复
- 修复 Helm Controller NPE 错误引起的 ks-controller-manager 崩溃。

## 验证和授权
### 新特性
- 支持手动启用/禁用用户。

## 用户体验
- 新增 Kubernetes 审计日志开启提示。
- 支持容器生命周期管理。
- 支持应用整个配置字典或保密字典文件。
- 支持在**流量监控**页签选择时间段。
- 新增在**审计日志搜索** 对话框提醒用户开启审计日志的功能。
- 支持通过 `ClusterConfiguration` 配置更多 Istio 参数。
- 新增多语言支持，如土耳其语。
- 支持用户密码合规性检查。
- 新增在 webhook 设置页面将**访问令牌**设置为必填项的功能。
- 修复**服务拓扑**页面的服务详情区域数据未自动更新的问题。
- 修复“修改有状态服务时未显示服务名称”问题。
- 修复用户点击按钮过快造成的应用安装失败问题。
- 修复容器组探针删除后仍然显示的问题。
- 修复存储卷挂载到 init 容器时 statefulset 创建失败的问题。
- 优化了服务拓扑图详情展示窗口。
- 优化了 ClusterConfiguration 更新机制，无需重启 ks-apiserver、ks-controller-manager。
- 优化了部分页面文案描述。

有关 KubeSphere 3.3.0 的 Issue 和贡献者详细信息，请参阅 [GitHub](https://github.com/kubesphere/kubesphere/blob/master/CHANGELOG/CHANGELOG-3.3.md)。
