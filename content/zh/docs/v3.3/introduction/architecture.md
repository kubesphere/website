---
title: "架构说明"
keywords: "kubesphere, kubernetes, docker, helm, jenkins, istio, prometheus, devops, service mesh，架构说明，架构"
description: "KubeSphere 架构说明"

linkTitle: "架构说明"
weight: 1500
---

## 前后端分离

KubeSphere 将 [前端](https://github.com/kubesphere/console) 与 [后端](https://github.com/kubesphere/kubesphere) 分开，实现了面向云原生的设计，后端的各个功能组件可通过 REST API 对接外部系统。 可参考 [API文档](../../reference/api-docs/)。下图是系统架构图。 KubeSphere 无底层的基础设施依赖，可以运行在任何 Kubernetes、私有云、公有云、VM 或物理环境（BM）之上。 此外，它可以部署在任何 Kubernetes 发行版上。

![Architecture](https://pek3b.qingstor.com/kubesphere-docs/png/20190810073322.png)

## 组件列表

| 后端组件 | 功能说明 |
|---|---|
| ks-apiserver | 整个集群管理的 API 接口和集群内部各个模块之间通信的枢纽，以及集群安全控制。|
| ks-console | 提供 KubeSphere 的控制台服务。|
| ks-controller-manager | 实现业务逻辑的，例如创建企业空间时，为其创建对应的权限；或创建服务策略时，生成对应的 Istio 配置等。|
| metrics-server | Kubernetes 的监控组件，从每个节点的 Kubelet 采集指标信息。|
| Prometheus | 提供集群，节点，工作负载，API对象的监视指标和服务。|
| Elasticsearch | 提供集群的日志索引、查询、数据管理等服务，在安装时也可对接您已有的 ES 减少资源消耗。|
| Fluent Bit | 提供日志接收与转发，可将采集到的⽇志信息发送到 ElasticSearch、Kafka。 |
| Jenkins | 提供 CI/CD 流水线服务。|
| Source-to-Image | 将源代码自动将编译并打包成 Docker 镜像，方便快速构建镜像。|
| Istio | 提供微服务治理与流量管控，如灰度发布、金丝雀发布、熔断、流量镜像等。|
| Jaeger | 收集 Sidecar 数据，提供分布式 Tracing 服务。|
| OpenPitrix | 提供应用程序生命周期管理，例如应用模板、应用部署与管理的服务等。|
| Alert | 提供集群、Workload、Pod、容器级别的自定义告警服务。|
| Notification | 是一项综合通知服务； 它当前支持邮件传递方法。|
| Redis | 将 ks-console 与 ks-account 的数据存储在内存中的存储系统。|
| OpenLDAP | 负责集中存储和管理用户帐户信息与对接外部的 LDAP。|
| Storage | 内置 CSI 插件对接云平台存储服务，可选安装开源的 NFS/Ceph/Gluster 的客户端。|
| Network | 可选安装 Calico/Flannel 等开源的网络插件，支持对接云平台 SDN。|

## 服务组件

以上列表中每个功能组件下还有多个服务组件，关于服务组件的说明，可参考 [服务组件说明](../../pluggable-components/)。
