---
title: '基于 KubeSphere 部署 KubeBlocks 实现数据库自由'
tag: 'Kubernetes,KubeSphere,KubeBlocks'
keywords: 'Kubernetes, KubeSphere, KubeBlocks'
description: 'KubeSphere 让 KubeBlocks 更易部署和使用，KubeBlocks 让应用在 KubeSphere 上更灵活弹性。'
createTime: '2023-10-19'
author: '尹珉'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-cover.png'
---

## KubeSphere 是什么？

KubeSphere 是在 Kubernetes 之上构建的面向云原生应用的分布式操作系统，完全开源，支持多云与多集群管理，提供全栈的 IT 自动化运维能力，简化企业的 DevOps 工作流。它的架构可以非常方便地使第三方应用与云原生生态组件进行即插即用 (plug-and-play) 的集成。作为全栈的多租户容器平台，KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。KubeSphere 为用户提供构建企业级 Kubernetes 环境所需的多项功能，例如多云与多集群管理、Kubernetes 资源管理、DevOps、应用生命周期管理、微服务治理（服务网格）、日志查询与收集、服务与网络、多租户管理、监控告警、事件与审计查询、存储管理、访问权限控制、GPU 支持、网络策略、镜像仓库管理以及安全管理等。

![](https://kubesphere.io/images/docs/v3.x/zh-cn/introduction/what-is-kubesphere/kubesphere-feature-overview.jpeg)

## KubeBlocks 是什么？

KubeBlocks 这个名字来源于 Kubernetes 和 LEGO 积木，这表明在 Kubernetes 上构建数据库和分析型工作负载既高效又愉快，就像玩乐高玩具一样。KubeBlocks 将顶级云服务提供商的大规模生产经验与增强的可用性和稳定性改进相结合，帮助用户轻松构建容器化、声明式的关系型、NoSQL、流计算和向量型数据库服务。

官网：https://kubeblocks.io/。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-1.png)

## 为什么需要 KubeBlocks？

Kubernetes 已经成为容器编排的事实标准。它利用 ReplicaSet 提供的可扩展性和可用性以及部署提供的推出和回滚功能来管理数量不断增加的无状态工作负载。然而，管理有状态工作负载给 Kubernetes 带来了巨大的挑战。尽管 StatefulSet 提供了稳定的持久存储和唯一的网络标识符，但这些功能对于复杂的有状态工作负载来说远远不够。

为了应对这些挑战，并解决复杂性问题，KubeBlocks 引入了新的 workload——RSM（Replicated State Machines），具有以下能力：

- 基于角色的更新顺序可减少因升级版本、缩放和重新启动而导致的停机时间。
- 维护数据复制的状态，并自动修复复制错误或延迟。

## 它俩结合会带来什么收益？

KubeSphere 提供了一个成熟的 Kubernetes 容器管理平台，而 KubeBlocks 在其上构建了数据库专业能力。这种创新融合，打通了数据库服务容器化的技术壁垒，实现了“开箱即用”。KubeSphere 让 KubeBlocks 应用享受集群级的资源调度和服务治理。KubeBlocks 使数据库服务在 KubeSphere 中具备自动化运维的专业实力。两者的协同互补，不仅简化了数据库的云化改造，也使数据库应用交付更加快速和可靠。

## 部署开始

### 部署先决条件

- 确保已有可用的 KubeSphere 平台，如还未部署请至官网进行部署即可。官网地址：https://kubesphere.io/zh/docs/v3.4/。

- 确保宿主机网络互通并可以访问互联网。

### 登录 KubeSphere 平台添加 KubeBlocks 官方仓库

仓库地址：https://apecloud.github.io/helm-charts。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-2.png)

### 选择干净的 NameSpace 添加 KubeBlocks 服务

#### 1. 导航并点击右侧【创建】按钮

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-3.png)

#### 2. 选择【应用模板】

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-4.png)

#### 3. 选择刚才创建的【应用仓库】并搜索到 KubeBlocks 服务

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-5.png)

#### 4. 选择目前的稳定版本【0.6.1】

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-6.png)

#### 5. 默认不需要改 Values 的值，额外要注意 StorageClass 的配置

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-7.png)

#### 6. 耐心等待后，确认应用服务启动状态正常

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-8.png)

## 安装 kbcli

目前支持 macOS、Windows、Linux。本教程以 Linux 为例。

### 1. 安装 kbcli

```shell
curl -fsSL https://kubeblocks.io/installer/install_cli.sh | bash
```

### 2. 验证安装

```shell
kbcli version
```

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-9.png)

### 3. 检查刚才部署的 Kubeblocks 相关信息

```shell
kbcli kubeblocks status
```

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-10.png)

## 创建并连接到 MySQL 实例

> 说明：
> KubeBlocks 官方支持 kbcli 和 kubectl 创建集群。本教程使用 kbcli 作为演示。

### 1. 查看可用于创建集群的所有数据库类型和版本

```shell
kbcli clusterdefinition list
```

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-11.png)

```shell
kbcli clusterversion list
```

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-12.png)

### 2. 创建 MySQL 实例

```shell
kbcli cluster create mysql mycluster
```

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-13.png)

### 3. 检查实例状态

```shell
kbcli cluster list
```

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-14.png)

### 4. 连接到 MySQL 实例

```shell
kbcli cluster connect mycluster -n default
```

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeblocks-on-kubesphere-20231019-15.png)

## 总结

KubeSphere 提供了 GUI 和 DevOps 工具，大大降低了 Kubernetes 学习和使用门槛。KubeBlocks 基于 K8s Operator 模式实现了应用解耦和复用，是云原生架构的重要选择。双方深度融合，发挥各自在易用性和敏捷开发上的优势。KubeSphere 让 KubeBlocks 更易部署和使用，KubeBlocks 让应用在 KubeSphere 上更灵活弹性。通过结合两者优势，企业能够更轻松实施以应用为中心的数字化转型，实现业务创新。