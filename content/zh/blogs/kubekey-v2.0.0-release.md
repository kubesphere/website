---
title: 'KubeKey 2.0.0 发布：让离线部署 K8s 更加便捷'
tag: 'KubeSphere, KubeKey'
keywords: 'Kubernetes, KubeSphere, KubeKey, 离线部署, 新版本发布'
description: 'KubeKey 2.0.0 正式发布，该版本新增了清单（manifest）和制品（artifact）的概念，为用户离线部署 Kubernetes 集群提供了解决方案。'
createTime: '2022-03-12'
author: '李耀宗'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kasten-k10-cover.png'
---

2022 年 3 月 8 日，KubeKey 2.0.0 正式发布，这是 KubeKey 的第 7 个正式版本，也是非常重要的一个版本。该版本新增了清单（manifest）和制品（artifact）的概念，为用户离线部署 Kubernetes 集群提供了解决方案。

## KubeKey 简介

KubeKey 是 KubeSphere 社区开源的一款高效集群部署工具，运行时默认使用 Docker , 也可对接 `Containerd` `CRI-O` `iSula` 等 CRI 运行时，且 ETCD 集群独立运行，支持与 K8s 分离部署，提高环境部署灵活性。它提供了一种灵活、快速、便捷的方式来仅安装 Kubernetes/K3s，或同时安装 Kubernetes/K3s 和 KubeSphere，以及其他云原生插件。除此之外，它也是扩展和升级集群的有效工具。

传统的离线部署方式需要提前准备好部署工具，镜像 tar 包或者本地镜像仓库，以及其他相关的二进制文件，而每一位用户的需要部署的 Kubernetes 版本和需要部署的镜像都是不同的。而 KubeKey 只需要通过配置清单（即 manifest 文件）来定义将要离线部署的集群环境的内容，再通过该 manifest 来导出制品（artifact）即可完成准备工作。后续只需通过 KubeKey 和 artifact 就可以简单快速地在离线环境中部署 Kubernetes 集群和镜像仓库。

## 解读 KubeKey 2.0.0 重大更新

### 全新的任务编排框架

![kubekey](https://raw.githubusercontent.com/kubesphere/kubekey/master/docs/img/KubeKey-Architecture.png)

基于模块化的设计思路，KubeKey v2.0.0 实现了通用且规范化的任务编排框架。其中定义了`host`, `pipeline`,  `module`, `task`和`action`等对象，实现了模块化的任务调度引擎。基于该框架，用户可根据具体需求及业务逻辑，便捷的开发自定义任务流水线执行程序以及扩展 KubeKey 原有的任务流水线。

相关文档可参考：[开发者指南](https://github.com/kubesphere/kubekey/blob/master/docs/developer-guide.md)。

### 更加方便的离线部署流程

KubeKey v2.0.0 中提供了一种全新的自定义离线部署 Kubernetes 集群的解决方案，为此新增了清单 `manifest` 和制品 `artifact` 的概念：
* `manifest`：离线部署安装包自定义配置文件。
* `artifact`：离线部署自定义安装包。

在过去，用户需要准备部署工具，镜像 tar 包以及其他相关的二进制文件，每位用户需要部署的 Kubernetes 版本和涉及到的镜像都可能是不同的。现在使用 KubeKey ，用户仅需使用清单 `manifest` 文件来定义将要离线部署的集群环境需要的内容，再通过该 `manifest` 来导出制品 `artifact` 文件即可完成准备工作。离线部署时只需要 KubeKey 二进制文件 和 `artifact` 就可快速、简单的在环境中部署镜像仓库、 Kubernetes 以及 KubeSphere。

离线部署相关文档可参考：
* [KubeKey 制品和清单](https://github.com/kubesphere/kubekey/blob/master/docs/zh/manifest_and_artifact.md)
* [推送镜像命令](https://github.com/kubesphere/kubekey/pull/1094)
* [使用 KubeKey 快速离线部署 K8s 与 KubeSphere](https://mp.weixin.qq.com/s/hjtNfSRVYH1O2o_dj6ET4A)

### 一键部署私有镜像仓库

KubeKey v2.0.0 可使用自签名证书部署 docker regisgry 或者 harbor，部署过程中会自动将证书分发至集群所有节点。并且该功能也支持离线部署，与 Kubernetes 集群离线部署结合实现闪电交付。

相关文档可参考：[容器镜像仓库](https://github.com/kubesphere/kubekey/blob/master/docs/registry.md)。

### 新增部署配置项

1. [ISSUE #789](https://github.com/kubesphere/kubekey/issues/789)：支持 Multus CNI 。
2. [ISSUE #811](https://github.com/kubesphere/kubekey/issues/811)：支持 Kata 和 Node Feature Discovery 。
3. [PR #902](https://github.com/kubesphere/kubekey/pull/902)：创建集群时默认开启 FeatureGates 。
4. [ISSUE #913](https://github.com/kubesphere/kubekey/issues/913)：创建集群时默认关闭 SELINUX 。
5. [ISSUE #915](https://github.com/kubesphere/kubekey/issues/915)：支持私有镜像仓库授权登陆。
6. [ISSUE #940](https://github.com/kubesphere/kubekey/issues/940)：支持拉取和推送镜像时配置 namespaceOverride 。
7. [ISSUE #950](https://github.com/kubesphere/kubekey/issues/950)：支持自定义 dnsDomain 。
8. [ISSUE #951](https://github.com/kubesphere/kubekey/issues/951)：支持设置 NTPServer 和 timezone 。
9. [PR #992](https://github.com/kubesphere/kubekey/pull/992)：创建集群时添加配置 pod 的 PID Limit 和 PID Available 。

更多更新内容可查看 [GitHub Release](https://github.com/kubesphere/kubekey/releases/tag/v2.0.0) 。


### 安装方式

获取最新正式版 KubeKey 的最快方法是通过命令行脚本：

```
curl -sfL https://get-kk.kubesphere.io | sh -
```

或者也可以前往 GitHub Release 页面，下载获取 KubeKey 2.0.0 的二进制文件。


## 致谢贡献者

以下是参与 KubeKey 2.0.0 代码与文档贡献的贡献者 GitHub ID，若此名单有遗漏请您与我们联系，排名不分先后。
* 24sama
* chaunceyjiang
* haiker2011
* life-
* lvillis
* pixiake
* tanguofu
* vincenthe11
* yj-cloud

感谢以上贡献者在 KubeKey 2.0.0 开发中作出的贡献。KubeKey 是个非常年轻的开源项目，也是一个很有潜力的开源项目，欢迎更多的社区小伙伴加入到贡献者行列。

[KubeKey GitHub 地址](https://github.com/kubesphere/kubekey/)：https://github.com/kubesphere/kubekey/


## KubeKey 相关内容参考

- [使用 KubeKey 快速离线部署 K8s 与 KubeSphere](https://kubesphere.com.cn/blogs/deploying-kubesphere-clusters-offline-with-kubekey/)

- [集群部署神器之 KubeKey——v2.0.0 上手指南（直播回放 + PPT）](https://kubesphere.com.cn/live/kubekey1209-live/)

- [使用 KubeKey 在 AWS 高可用部署 Kubernetes](https://kubesphere.com.cn/blogs/aws-kubernetes/)

- [使用 KubeKey 安装部署 Kubernetes 与 Kube-OVN](https://kubesphere.com.cn/blogs/use-kubekey-to-install-and-deploy-kubernetes-and-kubeovn/)