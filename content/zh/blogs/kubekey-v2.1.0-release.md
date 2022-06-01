---
title: 'KubeKey 2.1.0 发布，增强 K8s 离线交付体验'
tag: 'KubeSphere, KubeKey'
keywords: 'Kubernetes, KubeSphere, KubeKey, 离线部署, 新版本发布'
description: 'KubeKey 2.1.0 增强了离线部署能力和交付体验，同时支持“一云多芯”，即同一个 K8s 集群中可以同时包含 ARM64 节点和 AMD64 节点。'
createTime: '2022-05-12'
author: '李耀宗'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubekey-v2.1.0-release.png'
---

2022 年 5 月 6 日，KubeKey 2.1.0 正式发布，这是 KubeKey 的第 8 个正式版本。该版本增强了离线部署能力和交付体验，同时支持“一云多芯”，即同一个 K8s 集群中可以同时包含 ARM64 节点和 AMD64 节点。

> Kubekey 2.0.0 于两个月前发布，关于该版本的变化，你可以点击此处了解：
> + [KubeKey 2.0.0 发布：让离线部署 K8s 更加便捷](https://kubesphere.com.cn/blogs/kubekey-v2.0.0-release/)

## KubeKey 简介

![](https://pek3b.qingstor.com/kubesphere-community/images/202205121620270.png)

KubeKey 是 KubeSphere 社区开源的一款高效集群部署工具，运行时默认使用 Docker , 也可对接 Containerd、CRI-O、iSula 等 CRI 运行时，且 ETCD 集群独立运行，支持与 K8s 分离部署，提高环境部署灵活性。它提供了一种灵活、快速、便捷的方式来仅安装 Kubernetes/K3s，或同时安装 Kubernetes/K3s 和 KubeSphere，以及其他云原生插件。除此之外，它也是扩展和升级集群的有效工具。


## 主要更新变化

### Breaking Changes

KubeKey v2.1.0 不兼容 KubeKey v2.0.0 制作的制品，请使用 KubeKey v2.1.0 重新导出 KubeKey 制品。
这是因为 KubeKey v2.1.0 优化了制品的存储结构。目前制品采用 OCI 标准对镜像进行拉取和归档保存，实现了复用基础镜像层，其存储空间占用可降低近一半。

### 更丰富的部署选择

* 支持部署 Kubernetes v1.24.0
* 支持部署 containerd v1.6.4
* 支持部署 KubeSphere v3.3.0 （当前最新版本为 v3.3.0-alpha.2）
* 支持三种使用场景的 ETCD 集群（二进制部署，Kubeadm 部署，连接外置已存在的 ETCD 集群）

### 增强离线部署能力和交付体验

* KubeKey 根据 OCI 标准实现了镜像的拉取、上传和归档保存等功能，使其在制作和使用 KubeKey 制品时不依赖额外的容器运行时，降低了制作和使用制品的难度。
* 支持初始化操作系统命令（kk init os）使用制品进行离线本地源安装操作系统依赖。
* 支持 RHEL、Debian 离线本地源安装操作系统依赖。
* 使用 GitHub Action 自动制作制品中的操作系统软件源文件（centos7-rpms-amd64.iso、ubuntu-20.04-debs-amd64.iso 等），用户可在 Github Release 页面自行选择下载。

### 一云多芯

在多架构 CPU 体系的离线环境中进行交付时，需要提供 AMD64，ARM64 等架构的镜像。KubeKey 支持在制作制品时拉取和保存镜像仓库（DockerHub，私有镜像仓库）中的 multi-arch 镜像，并且在使用制品推送镜像至私有仓库时，支持自动创建和推送 docker multi-arch manifest list。

更多详情见 [GitHub Release](https://github.com/kubesphere/kubekey/releases/tag/v2.1.0)。

## 致谢贡献者
以下是参与 KubeKey v2.1.0 代码与文档贡献的贡献者 GitHub ID，若此名单有遗漏请您与我们联系，排名不分先后。
* 24sama 
* pixiake 
* muzi502 
* yeya24 
* hellocn9 
* tanguofu 
* yinheli 
* yuzhiquan 
* yayuntian 
* tpiperatgod 
* cumirror
* eltociear
* LinuxSuRen
* rockpanda
* vincenthe11

再次感谢您的贡献！

感谢以上贡献者在 KubeKey 2.1.0 开发中作出的贡献。KubeKey 是个非常年轻的开源项目，也是一个很有潜力的开源项目，欢迎更多的社区小伙伴加入到贡献者行列。

[KubeKey GitHub 地址](https://github.com/kubesphere/kubekey/)：https://github.com/kubesphere/kubekey/


## KubeKey 相关内容参考

- [使用 KubeKey 快速离线部署 K8s 与 KubeSphere](https://kubesphere.com.cn/blogs/deploying-kubesphere-clusters-offline-with-kubekey/)

- [集群部署神器之 KubeKey——v2.0.0 上手指南（直播回放 + PPT）](https://kubesphere.com.cn/live/kubekey1209-live/)

- [使用 KubeKey 在 AWS 高可用部署 Kubernetes](https://kubesphere.com.cn/blogs/aws-kubernetes/)

- [使用 KubeKey 安装部署 Kubernetes 与 Kube-OVN](https://kubesphere.com.cn/blogs/use-kubekey-to-install-and-deploy-kubernetes-and-kubeovn/)
