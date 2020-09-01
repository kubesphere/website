---
title: "Release Notes for 3.0.0"
keywords: "Kubernetes, KubeSphere, release-notes"
description: "KubeSphere Release Notes for 3.0.0"

linkTitle: "Release Notes - 3.0.0"
weight: 50
---

## 如何获取 v3.0.0

- [Install KubeSphere v3.0.0 on Linux](https://github.com/kubesphere/kubekey)
- [Install KubeSphere v3.0.0 on existing Kubernetes](https://github.com/kubesphere/ks-installer)

# 发行注记

## **安装**

### 功能

- 全新的开箱即用的 installer: [KubeKey](https://github.com/kubesphere/kubekey)，v1.0.0，极大降低对不同操作系统环境的依赖，通过更简单、高效的方式快速部署 Kubernetes + KubeSphere 环境

### 升级和优化

- 新版 [ks-installer](https://github.com/kubesphere/ks-installer)，v3.0.0，兼容 Kubernetes 1.15.x、1.16.x、1.17.x 和 1.18.x
- [KubeKey](https://github.com/kubesphere/kubekey) 官方验证并支持 Kubernetes 1.15.12、1.16.13、1.17.9 和 1.18.6（注意，请避免使用 KubeKey 安装 Kubernetes 1.15~1.15.5 和 1.16~1.16.2, 因为这些版本的 Kubernetes 有 [API 验证失败的问题](https://github.com/kubernetes/kubernetes/issues/83778))
- 增加对开源操作系统 EulerOS, UOS 和 KylinOS 的支持
- 增加对鲲鹏和飞腾 CPU 的支持
- 使用 ClusterConfiguration 替代之前的 ConfigMap 资源对象存储 ks-installer 相关的安装配置信息

## **集群管理**

### 功能

- 支持多集群统一化管理
- 支持跨集群联邦部署

## **可观察性**

### 功能

- 支持在 KubeSphere 控制台添加第三方应用监控指标
- 支持 K8s 及 KubeSphere 操作审计，并支持审计记录的归档、检索和告警
- 支持 K8s 事件管理，并支持基于 [kube-events](https://github.com/kubesphere/kube-events) 的事件的归档、检索和告警
- 支持租户级操作审计和 K8s 事件的检索，授权用户仅能检索自己权限允许范围内的操作审计记录和 K8s 事件
- 支持将审计记录和 K8s 事件归档至 Elasticsearch，Kafka 或者 Fluentd
- 基于 [Notification Manager](https://github.com/kubesphere/notification-manager) 支持多租户通知
- 支持 Alertmanager v0.21.0

### 升级和优化

- 升级 Prometheus Operator 至 v0.38.3（KubeSphere 定制版）
- 升级 Prometheus 至 v2.20.1
- 升级 Node Exporter 至 v0.18.1
- 升级 kube-state-metrics 至 v1.9.6
- 升级 metrics server 至 v0.3.7
- metrics-server 调整为缺省开启
- 升级 Fluent Bit Operator 至 v0.2.0
- 升级 Fluent Bit 至 v1.4.6
- 极大改善日志检索效率
- 允许平台管理员查看已被删除的项目（namespace）下的 pod 的日志
- 优化落盘日志收集配置

### 问题修复

- 修复新创建项目的监控数据图时间轴偏移问题 (#[2868](https://github.com/kubesphere/kubesphere/issues/2868))
- 修复工作负载级别的告警在某些场景下无法正常工作的问题 (#[2834](https://github.com/kubesphere/kubesphere/issues/2834))
- 修复节点在 NotReady 状态下没有监控数据的问题

## **DevOps**

### 功能

- 重构 DevOps 模块的架构，使用 CRDs 方式管理 DevOps 资源

### 升级和优化

- 在安装包中删除 Sonarqube，调整为支持对接外部 Sonarqube

### 问题修复

- 修复 DevOps 权限数据在偶发场景下丢失的问题 

- 修复 DevOps 的 Stage 页面按钮无法正常工作的问题 (#[449](https://github.com/kubesphere/console/issues/449))
- 修复流水线参数无法正常提交保存的问题 (#[2699](https://github.com/kubesphere/kubesphere/issues/2699))

## **应用商店**

### 功能

- 支持 Helm V3
- 支持将应用模板部署到多集群之中
- 支持应用模板升级
- 支持查看应用仓库同步过程中产生的事件

### 升级和优化

- 用户能使用相同的应用仓库名称
- 支持应用模板中的 CRD 资源
- 将 OpenPitrix 下的所有 Service 对象整合到一个 Service 之中
- 在添加应用仓库时，支持 HTTP 验证方式 
- 应用仓库中新增和升级以下应用：
  AWS EBS CSI Driver 0.5.0 - Helm 0.3.0
  AWS EFS CSI Driver 0.3.0 - Helm 0.1.0
  AWS FSX CSI Driver 0.1.0 - Helm 0.1.0
  Elasticsearch Exporter 1.1.0 - Helm 3.3.0
  etcd 3.3.12 - Helm 0.1.1
  Harbor 2.0.0 - Helm 1.4.0
  Memcached 1.5.20 - Helm 3.2.3
  Minio master - Helm 5.0.26
  MongoDB 4.2.1 - Helm 0.3.0
  MySQL 5.7.30 - Helm 1.6.6
  MySQL Exporter 0.11.0 - Helm 0.5.3
  Nginx 1.18.0 - Helm 1.3.2
  Porter 0.3-alpha - Helm 0.1.3
  PostgreSQL 12.0 - Helm 0.3.2
  RabbitMQ 3.8.1 - Helm 0.3.0
  Redis 5.0.5 - Helm 0.3.2
  Redis Exporter 1.3.4 - Helm 3.4.1
  Tomcat 8.5.41 - Helm 0.4.1+1

### 问题修复

- 修复 attachment IDs 字段长度不足的问题

## **网络**

### 功能

- 支持项目级租户网络隔离和网络防火墙策略管理
- 支持企业空间级租户网络隔离
- 支持增删改和查看原生 K8s 网络策略

## 微服务治理

### 功能

- 支持清理 Jaeger ES 索引

### 升级和优化

- 升级 Istio 至 v1.4.8

## **存储**

### 功能

- 支持存储卷快照管理
- 支持存储容量管理
- 支持存储卷监控

## **安全**

### 功能

- 支持 LDAP，OAuth2 认证插件
- 支持自定义企业空间角色
- 支持自定义 DevOps 工程角色
- 支持跨集群安全权限控制
- 支持 pod security context (#[1453](https://github.com/kubesphere/kubesphere/issues/1453))

### 升级和优化

- 简化了角色的自定义方式，将关联紧密的权限项聚合为权限组
- 优化内置角色

### 问题修复

- 修复由于集群节点时间不同步导致的登录失败问题

## **全球化**

### 功能

- Web 控制台增加对西班牙语、繁体中文的支持

## **用户体验**

### 功能

- 工具箱新增支持“访问历史”快捷操作，用户可以查看自己之前访问过的集群、企业空间、项目和 DevOps 工程，并且支持通过键盘快捷键方式快速启动

### 升级和优化

- 重构和优化全局导航栏
- 重构和优化详情页的痕迹导航
- 重构和优化资源列表页的数据自刷新
- 简化项目（namespace）的创建过程
- 重构和优化应用的创建，支持通过 YAML 创建应用
- 支持通过 YAML 方式修正工作负载
- 调整工具箱中日志检索页面的数据展示方式
- 重构和优化应用商店中应用部署的表单页
- 支持 helm chart schema (#[schema-files](https://helm.sh/docs/topics/charts/#schema-files))

### 问题修复

- 修复编辑 ingress annotations 的报错问题 (#[1931](https://github.com/kubesphere/kubesphere/issues/1931))
- 修复编辑工作负载容器探针的报错问题
- 修复 XSS 安全问题