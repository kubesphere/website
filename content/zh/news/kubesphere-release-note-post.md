---
title: 'KubeSphere 容器平台发布 2.1.1，全面支持 Kubernetes 1.17'
tag: '产品动态'
keywords: 'KubeSphere, Kubernetes'
description: 'KubeSphere 2.1.1 进一步增强了生产可用性，修复了多个组件的 Bug，升级了内置的多个开源组件。'
createTime: '2020-02-24'
author: 'Feynman'
image: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200224093525.png'
---

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200224093525.png)

农历二月二，KubeSphere 开源社区激动地向大家宣布，KubeSphere 容器平台 2.1.1 正式发布！

KubeSphere 作为 **开源的企业级容器平台**，对 2.1.1 版本定义的是 **进一步增强生产可用性**，修复了多个组件的 Bug，升级了内置的多个开源组件。借助 KubeSphere，您可以快速安装与管理原生的 Kubernetes，KubeSphere 2.1.1 已支持至 Kubernetes 1.17，帮助您上手 Kubernetes 新版本中新增的特性。并且，还向前兼容与支持 Kubernetes 1.17 之前的 3 个版本，您可以按需进行安装。

KubeSphere 能够帮助企业快速构建一个功能丰富的容器云平台。让企业在享受 Kubernetes 的弹性伸缩与敏捷部署的同时，还可以在容器平台拥有 IaaS 平台的存储与网络能力，获得与 IaaS 平台一样稳定的用户体验。比如，我们在 KubeSphere 2.1.1 新增了对阿里云与腾讯云块存储插件的集成，支持为 Pod 挂载公有云的存储，为有状态应用提供更稳定的持久化存储的能力。

除此之外，我们还将安装步骤再一次简化。2.1.1 简化了在已有 Kubernetes 上安装的步骤，无需再像 2.1.0 安装一样，配置集群 CA 证书路径。并且，也将 etcd 监控作为了可选安装项。真正实现了一条命令即可在已有的 Kubernetes 集群上快速安装 KubeSphere。

关于 2.1.1 的更新详情，请参考 [Release Note](https://kubesphere.com.cn/docs/v2.1/zh-CN/release/release-v211/)。

下面演示两种最简单的安装方法，解锁如何最快尝鲜 KubeSphere 2.1.1。

## 如何在 Linux 快速安装 2.1.1

1. 本文将演示 All-in-One 安装，请准备一台干净的机器（虚拟机或物理机），安装前关闭防火墙，并确保您的机器符合以下的最小要求：

- 机器配置:

    - CPU: 最小化安装需 2 Cores；完整安装需 8 Cores
    - Memory: 最小化安装需 4 GB；完整安装需 16 GB

- 操作系统:

    - CentOS 7.4 ~ 7.7 (64-bit)
    - Ubuntu 16.04/18.04 LTS (64-bit)
    - RHEL 7.4 (64-bit)
    - Debian Stretch 9.5 (64-bit)

2. 下载 `KubeSphere 2.1.1` 安装包至待安装机器，进入安装目录。

> 提示：Installer 默认仅开启最小化安装，若机器资源充足，请在 `conf/common.yaml` 中开启可选功能组件，将其设置为 true，再进行安装。

```bash
curl -L https://kubesphere.io/download/stable/v2.1.1 > installer.tar.gz \
&& tar -zxf installer.tar.gz && cd kubesphere-all-v2.1.1/scripts
```

3. 建议使用 `root` 用户安装，执行 `install.sh` 脚本，输入 `1` 选择第一种即 all-in-one 模式。

```bash
./install.sh
```

请耐心等待，当看到 `"Successful"` 的日志与登录信息提示，则说明 KubeSphere 安装成功，请使用日志提示的管理员账号登陆控制台。


## 如何在 Kubernetes 安装 2.1.1

请确保您的 Kubernetes 集群满足以下前提条件：

> - `Kubernetes` 版本： `1.15.x ≤ K8s version ≤ 1.17.x`；
> - `Helm`版本： `2.10.0 ≤ Helm Version ＜ 3.0.0`（不支持 helm 2.16.0），且已安装了 Tiller，（v3.0 将支持 Helm v3）；
> - 集群已有默认的存储类型（StorageClass）
> - 集群能够访问外网。

若您的集群可用的资源符合 CPU > 1 Core，可用内存 > 2 G，可以参考以下命令开启 KubeSphere 最小化安装：

```yaml
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

若您的集群可用的资源符合 CPU ≥ 8 Core，可用内存 ≥ 16 G，建议参考以下命令开启 KubeSphere 完整安装，即开启所有功能组件的安装：

```yaml
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-complete-setup.yaml
```

查看滚动刷新的安装日志，请耐心等待安装成功。当看到 `"Successful"` 的日志与登录信息提示，则说明 KubeSphere 安装成功，请使用日志提示的管理员账号登陆控制台。

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

## 如何升级至 2.1.1

升级前需要同步老版本的配置修改，请参考官网文档下的升级指南。
