---
title: 'Kubernetes 升级不弃 Docker：KubeKey 的丝滑之道'
tag: 'Kubernetes'
keywords: 'Kubernetes, KubeSphere, KubeKey '
description: '这篇文章介绍了如何使用 KubeKey 工具来快速升级 Kubernetes。'
createTime: '2024-04-09'
author: '尹珉'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubernetes-kubekey-upgrading-cover.png'
---

> 作者：尹珉，KubeSphere Ambaasador&Contributor，KubeSphere 社区用户委员会杭州站站长。

## 引言

随着 Kubernetes 社区的不断发展，即将迎来 Kubernetes 1.30 版本的迭代。在早先的 1.24 版本中，社区作出一个重要决策：不再默认集成 Docker 作为容器运行时，即取消了对 Docker 的默认支持。这就像咱们家厨房换了个新灶头，虽然厨艺的本质没变，但用起来感觉肯定不一样。这篇文章就带你摸透这个变化，直击 Kubernetes 1.24+ 版本抛弃 Docker 后的影响，同时手把手教你如何借助 KubeKey 这个神器，让你在给 Kubernetes “装修升级”的过程中既稳又顺，还能把 Docker 那些贴心好用的功能保留下来。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240409-0.webp)

## Docker 移除带来的潜在风险分析

### 工具链与生态兼容性

1. 对于大量使用 Jenkins 等 CI/CD 工具的企业而言，原先基于 Docker 的镜像构建、推送和拉取流程可能需要重构。Jenkinsfile 中的 Docker 构建步骤需调整为兼容 containerd 的方式进行，否则可能造成流水线中断。 
2. 监控系统和其他依赖于 Docker API 的周边工具需要进行改造或更换，以适应新的容器运行时环境，这涉及到了大量的验证工作和可能的二次开发成本。

### 开发环境一致性

开发者们习惯了在本地使用 Docker 进行快速迭代和测试，移除 Docker 后，需要重新适应 containerd 或寻找兼容 Docker API 的替代方案，以保持开发环境与生产环境的一致性。

### 现有运维脚本失效

许多自动化脚本、运维命令和 Helm Chart 等资源文件可能直接引用了 Docker 命令或依赖于 Docker 的特定行为，这些都需要逐步审查和适配。

## 升集群时手动保留 Docker 特性的成本分析

### 运维复杂度增加

1. 需要在 Kubernetes 集群中手动集成第三方插件或其他兼容方案以模拟 Docker 的运行时环境，这要求运维团队具备更高的技术水平和对 Kubernetes 内部机制的深入了解。 
2. 需要密切关注 Kubernetes 更新与 Docker 兼容性之间的差异，每次升级 Kubernetes 都可能导致与 Docker 集成的部分出现问题，需要额外的时间和精力进行维护和调试。

### 集群规模操作成本剧增

1. 假设面临如 100 个节点的集群时，每个节点上的容器运行时切换都需要单独进行，这意味着至少需要分别在 100 个节点上执行启停容器运行时的操作，耗费巨大的人力和时间成本。 
2. 对于大型集群，这种逐一操作的管理模式极其低效且容易出错，可能需要编写复杂的脚本或者使用批量管理工具，进一步增加实施难度。

### 测试验证与恢复预案

若操作过程中遇到问题，需要有完备的回滚策略和恢复预案，准备应对可能发生的各类异常状况，以防业务长时间受到影响。

**总结：** 因此，在 Kubernetes 1.24 之后，手动保留 Docker 特性并进行大规模节点运行时切换是一项极具挑战的任务，不仅会导致高昂的操作成本，还可能带来较大的业务风险。相比之下，寻求平滑过渡和兼容方案（如 KubeKey）成为更具性价比的选择。

## 什么是 Kubekey

KubeKey 是一个开源的轻量级工具，用于部署 Kubernetes 集群。它提供了一种灵活、快速、方便的方式来安装 Kubernetes/K3s、Kubernetes/K3s 和 KubeSphere，以及相关的云原生附加组件。它也是扩展和升级集群的有效工具。此外，KubeKey 还支持定制离线包（artifact），方便用户在离线环境下快速部署集群。

为什么选择 Kubekey？

KubeKey 由 Go 语言开发，使用便捷、轻量，支持多种主流 Linux 发行版。KubeKey 支持多种集群部署模式，例如 All-in-One、多节点、高可用以及离线集群部署。KubeKey 也支持支持快速构建离线安装包，加速离线交付场景下的集群交付效率。KubeKey 实现多节点并行安装，且利用 Kubeadm 对集群和节点进行初始化，极大地节省了集群部署时间，同时也遵循了 Kubernetes 社区主流集群部署方法。KubeKey 提供内置高可用模式，支持一键部署高可用 Kubernetes 集群。

## 升级实操

### etcd 数据备份

```yaml
ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  snapshot save <backup-file-location>
```

### 下载 Kubekey 工具

版本：v3.1.0-rc.2 （这个版本当前是稳定已测，即将发布 v3.1.0）。

```yaml
export KKZONE=cn
```

支持手动下载：https://github.com/kubesphere/kubekey/releases。

```yaml
curl -sfL https://get-kk.kubesphere.io | sh -
```

### 检查当前集群状态

```yaml
kubectl get node -o wide
```

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240409-1.png)

### 准备集群配置文件

如果创建集群时的配置文件存在，本步骤可跳过。

1. 创建当前集群配置

```yaml
./kk create config [--with-kubernetes version] [(-f | --filename) path]
```

2. 填入真实集群信息

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240409-2.png)

### 修改 configmap

1. 修改 kubeadm-config

注意：确保配置中的 featuregate 在新版本中没有被移除。

```yaml
kubectl -n kube-system edit cm kubeadm-config
```

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240409-3.png)

2. 修改 kubelet-config-1.23

注意：确保配置中的 featuregate 在新版本中没有被移除。

```yaml
kubectl -n kube-system edit cm kubelet-config-1.23
```

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240409-4.png)

### 开始升级

```yaml
./kk upgrade -f sample.yaml --with-kubernetes v1.24.17 --skip-dependency-check
```

### 验证集群版本

```yaml
kubectl get node -A -o wide
```

![](http://pek3b.qingstor.com/kubesphere-community/images/image-20240409-5.png)

### 验证容器运行时

```yaml
kubectl get nodes -o json | jq '.items[].status.nodeInfo.containerRuntimeVersion'
```

![](http://pek3b.qingstor.com/kubesphere-community/images/image-20240409-6.png)

## 结尾彩蛋

正如我们在这篇文章中所揭示的，Kubernetes 1.24 版本及其后续迭代虽逐步摒弃了对 Docker 的直接依赖，但这并不意味着我们必须舍弃熟悉的 Docker 工作流。通过 KubeKey 这样的强大工具，我们可以享受到 Kubernetes 最新版本的种种改进，同时还能优雅地保留 Docker 的某些关键特性，让升级之路变得更为顺畅。勇敢拥抱变化，善用工具的力量，每一次的技术升级都将成为我们打造高效、稳定、可扩展基础设施的宝贵经验。