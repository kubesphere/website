---
title: "名词解释"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus，名词解释'
description: 'KubeSphere中常用的词汇释义'

weight: 1600
---

本文档介绍了KubeSphere中一些常用的词汇表，如下所示：

 
| KubeSphere | Kubernetes 对照释义 |
|------------|--------------|
| 项目 | Namespace， 为 Kubernetes 集群提供虚拟的隔离作用，详见 [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)。 |
| 容器组 | Pod，是 Kubernetes 进行资源调度的最小单位，每个 Pod 中运行着一个或多个密切相关的业务容器，详见 [Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/)。 |
| 部署 | Deployments，表示用户对 Kubernetes 集群的一次更新操作，详见 [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)。 |
| 有状态副本集 | StatefulSet，用于管理有状态的应用程序（例如MySQL），可以保证部署和 scale 的顺序，详见 [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)。 |
| 守护进程集 | DaemonSet 保证在每个 Node 上都运行一个容器副本，常用来部署一些集群的日志、监控或者其他系统管理应用，例如 fluentd 或 logstash，详见 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)。 |
| 任务 | Jobs，在 Kubernetes 中用来控制批处理型任务的资源对象，即仅执行一次的任务，它保证批处理任务的一个或多个 Pod 成功结束。任务管理的 Pod 根据用户的设置将任务成功完成就自动退出了。比如在创建工作负载前，执行任务，将镜像上传至镜像仓库。详见 [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)。 |
| 定时任务 | CronJob，是基于时间的 Job，就类似于 Linux 系统的 crontab，在指定的时间周期运行指定的 Job，在给定时间点只运行一次或周期性地运行。详见 [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)。 | 
| 服务 | Service，一个 Kubernete 服务是一个最小的对象，类似 Pod，和其它的终端对象一样 详见 [Service](https://kubernetes.io/docs/concepts/services-networking/service/)。 |
| 应用路由 | Ingress，是授权入站连接到达集群服务的规则集合。可通过 Ingress 配置提供外部可访问的 URL、负载均衡、SSL、基于名称的虚拟主机等，详见 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)。 |
| 镜像仓库 | Image Registries，镜像仓库用于存放 Docker 镜像，包括公共镜像仓库（如 DockerHub）和私有镜像仓库（如 Harbor），详见 [Image](https://kubernetes.io/docs/concepts/containers/images/)。 |
| 存储卷 | PersistentVolumeClaim（PVC），满足用户对于持久化存储的需求，用户将 Pod 内需要持久化的数据挂载至存储卷，删除 Pod 后，数据仍保留在存储卷内。Kubesphere 推荐使用动态分配存储，当集群管理员配置存储类型后，集群用户可一键式分配和回收存储卷，无需关心存储底层细节。详见 [PVC](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)。 | 
| 存储类型 | StorageClass，为管理员提供了描述存储 “Class（类）” 的方法，包含 Provisioner、 ReclaimPolicy 和 Parameters 。详见 [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/)。 |
| 流水线 | Jenkins Pipeline，简单来说就是一套运行在 Jenkins 上的 CI/CD 工作流框架，将原来独立运行于单个或者多个节点的任务连接起来，实现单个任务难以完成的复杂流程编排和可视化的工作。详见 [Pipeline](https://jenkins.io/doc/book/pipeline/)。 |
| 企业空间 |Workspace，是 KubeSphere 实现多租户模式的基础，是您管理项目、 DevOps 工程和企业成员的基本单位。 |
| 主机 | Node，Kubernetes 集群中的计算能力由 Node 提供，Kubernetes 集群中的 Node 是所有 Pod 运行所在的工作主机，可以是物理机也可以是虚拟机。详见 [Node](https://kubernetes.io/docs/concepts/architecture/nodes/)。 |