---
title: "词汇表"
keywords: 'Kubernetes, KubeSphere, DevOps, docker, Helm, Jenkins, Istio, Prometheus, 词汇表'
description: 'KubeSphere 中使用的词汇表。'
linkTitle: "词汇表"
weight: 17100
---

本词汇表包含 KubeSphere 中专有的通用术语和技术术语。

## 通用术语

- **企业空间** <br>
    管理租户工作负载项目（即 Kubernetes 中的企业空间）和 DevOps 工程的逻辑单位。不同团队的成员在企业空间中有不同的权限，可对资源执行不同的操作并共享信息。
- **系统企业空间** <br>管理 KubeSphere、Kubernetes 以及可选组件（例如应用商店、服务网格和 DevOps 等）系统项目的特殊企业空间。
- **企业空间成员** <br>邀请至企业空间中工作的用户，拥有特定的权限。
- **项目** <br>
    KubeSphere 中的项目对应 Kubernetes 中的命名空间。
- **多集群项目** <br>
    工作负载部署在多个集群上的项目。
- **项目成员** <br>
    邀请至项目中工作的用户，拥有特定的权限。
- **工作台** <br>
    租户的登录页面，会显示租户拥有访问权限的资源，例如企业空间和项目。
- **存储卷** <br>
    KubeSphere 存储卷指 Kubernetes 中的 PersistentVolumeClaim (PVC)。
- **公开集群** <br>集群管理员可以设置集群可见性，以便企业空间可以使用所授权的集群。将集群设置为公开集群意味着所有的平台成员都可访问该集群，并在该集群中创建和调度资源。
- **KubeKey** <br>
    以 Go 语言编写的全新安装器，可单独安装 Kubernetes 或同时安装 Kubernetes 和 KubeSphere，并支持在创建集群时部署云原生插件（YAML 或 Chart 格式），亦可用于伸缩和升级集群。
- **ks-installer** <br>
    在已有 Kubernetes 集群上部署 KubeSphere 的安装包。

## 应用程序和工作负载

- **OpenPitrix** <br>
    一个用于打包、部署和管理不同类型应用的开源系统。

- **应用模板** <br>
    某个应用程序的模板，租户可使用应用模板部署新的应用程序实例。

- **应用仓库** <br>
    基于 Web 包含不同应用模板的仓库，独立于 OpenPitrix 的外部存储而创建，例如 [MinIO](https://min.io/) 对象存储、[QingStor 对象存储](https://github.com/qingstor)以及 [AWS 对象存储](https://aws.amazon.com/cn/what-is-cloud-object-storage/)。

- **应用商店** <br>应用商店包含内置应用，平台租户也可在应用商店中分享不同的应用程序。
  
- **部署** <br>您使用部署描述一个期望状态，Kubernetes 部署控制器会以受控速率将实际状态变更为期望状态。一个部署运行着应用程序的几个副本，它会自动替换宕机或故障的实例。有关更多信息，请参见[部署](https://kubernetes.io/zh/docs/concepts/workloads/controllers/deployment/)。

- **有状态副本集** <br>有状态副本集是用于管理有状态应用程序的工作负载对象，例如 MySQL。有关更多信息，请参见[有状态副本集](https://kubernetes.io/zh/docs/concepts/workloads/controllers/statefulset/)。

- **守护进程集** <br>守护进程集管理多组容器组副本，确保所有（或某些）节点运行一个容器组的副本，例如 Fluentd 和 Logstash。有关更多信息，请参见[守护进程集](https://kubernetes.io/zh/docs/concepts/workloads/controllers/daemonset/)。

- **任务** <br>任务会创建一个或者多个容器组，并确保指定数量的容器组成功结束。有关更多信息，请参见[任务](https://kubernetes.io/zh/docs/concepts/workloads/controllers/job/)。

- **定时任务** <br>定时任务按照特定时间或特定时间间隔运行任务，定时任务对象就像 crontab 文件中的一行。有关更多信息，请参见[定时任务](https://kubernetes.io/zh/docs/concepts/workloads/controllers/cron-jobs/)。

- **服务** <br>Kubernetes 服务是一种抽象对象，定义一组逻辑容器组和访问它们的策略，有时也称为微服务。有关更多信息，请参见[服务](https://kubernetes.io/zh/docs/concepts/services-networking/service/)。

## DevOps

- **DevOps 工程** <br>DevOps 工程用于创建和管理流水线和凭证。
  
- **SCM** <br>源控制管理 (Source Control Management)，例如 GitHub 和 Gitlab。
  
- **In-SCM** <br>
    通过 SCM 工具构建基于 Jenkinsfile 的流水线。

- **Out-of-SCM** <br>
    通过图形编辑面板构建流水线，无需编写 Jenkinsfile。

- **CI 节点** <br>
    流水线、S2I 和 B2I 任务的专用节点。一般来说，应用程序往往需要在构建过程中拉取多个依赖项，这可能会导致如拉取时间过长、网络不稳定等问题，从而使得构建失败。为了确保流水线正常运行并加快构建速度（通过缓存），您可以配置一个或一组 CI 节点以供 CI/CD 流水线和 S2I/B2I 任务专用。

- **B2I** <br>
    B2I (Binary-to-Image) 是一套从二进制可执行文件（例如 Jar 和 War 等）构建可再现容器镜像的工具和工作流。开发者和运维团队在项目打包成 War 和 Jar 这一类的制品后，可快速将制品或二进制的 Package 打包成 Docker 镜像，并发布到 DockerHub 或 Harbor 等镜像仓库中。
    
- **S2I** <br>S2I (Source-to-Image) 是一套从源代码构建可再现容器镜像的工具和工作流。通过将源代码注入容器镜像，自动将编译后的代码打包成镜像。在 KubeSphere 中支持 S2I 构建镜像，也支持以创建服务的形式，一键将源代码生成镜像推送到仓库，并创建其部署和服务最终自动发布到 Kubernetes 中。

## 日志、事件和审计

- **精确匹配** <br>通过完全匹配关键词查找结果的检索方式。
  
- **模糊匹配** <br>通过部分匹配关键词查找结果的检索方式。
  
- **审计策略** <br>审计策略定义事件记录和所含数据的一系列规则。
  
- **审计规则** <br>
    审计规则定义如何处理审计日志。

- **审计 Webhook** <br>
    Kubernetes 审计日志会发送至审计 Webhook。

## 监控、告警和通知

- **集群状态监控** <br>
    监控集群中的相关指标，如节点状态、组件状态、CPU、内存、网络和硬盘等。

- **应用资源监控** <br>
    监控平台上的应用程序资源，例如项目和 DevOps 工程的数量，以及特定类型的工作负载和服务的数量。

- **已分配 CPU** <br>
    该指标根据节点上容器组的总 CPU 请求数计算得出。它表示节点上为工作负载预留的 CPU 资源，工作负载实际正在使用 CPU 资源可能低于该数值。

- **已分配内存** <br>该指标根据节点上容器组的总内存请求计算得出。它表示节点上为工作负载预留的内存资源，工作负载实际正在使用内存资源可能低于该数值。
  
- **落盘日志收集** <br>
    日志收集功能允许系统收集保存在存储卷上的容器日志，并将日志发送到标准输出。

- **通知接收器** <br>接收通知的渠道，如电子邮件、钉钉、企业微信、Slack 和 Webhook。

## 网络

- **应用路由** <br>
    KubeSphere 应用路由对应 Kubernetes 中的 Ingress。

- **网关** <br>
    创建应用路由时，您需要启用外网访问网关，将请求转发至对应的后段服务。

## 服务网格

- **金丝雀发布** <br>
    一种优雅的应用程序发布方式，首先您可将一小部分实际流量发送至服务的新版本进行测试。与此同时，老版本会处理剩余流量。如果一切运行正常，您可以逐渐增加发送至新版本的流量，直到最后新版本彻底接管所有流量。如果发生任何问题，您可以立刻调整流量比例，让老版本接管所有流量。

- **蓝绿部署** <br>此方式提供零宕机部署，即在保留旧版本的同时部署新版本。在任何时候，只有其中一个版本处于活跃状态，接收所有流量，另一个版本保持空闲状态。如果运行出现问题，您可以快速回滚到旧版本。
  
- **流量镜像** <br>
    一种测试应用版本的零风险方式，将实时流量的副本发送给被镜像的服务，也称为流量影子 (Traffic Shadowing)。

- **应用治理** <br>
    开启应用治理以在项目实现微服务的链路追踪。

## 多集群管理

- **主集群（H 集群）** <br>
    主集群管理成员集群，并提供统一的多集群中央控制平面。

- **成员集群（M 集群）** <br>
    成员集群在多集群架构中由主集群统一管理。

- **直接连接** <br>
    当主集群的任意节点均可访问成员集群的 kube-apiserver 地址时可使用此方式直接连接主集群和成员集群。  

- **代理连接** <br>
    当主集群无法直接连接成员集群时可使用代理方式连接主集群和成员集群。

- **jwtSecret** <br>
    主集群和成员集群所需的密钥以便二者通信。

- **Tower** <br>
    使用代理连接时，主集群上会安装 proxy 组件而成员集群上会安装 agent，Tower 包含 proxy 和 agent。

- **代理服务地址** <br>
    使用代理连接时，成员 集群上的 Tower agent 需要获取的主集群的通信服务地址。
