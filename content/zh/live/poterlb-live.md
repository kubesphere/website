---
title: CNCF 网研会：使用 PorterLB 和 KubeSphere 在物理机 K8s 轻松暴露服务
description: PorterLB 允许在裸金属 Kubernetes 集群对外暴露服务，使用户获得与云端暴露服务的一致体验。用户可以使用开源的 KubeSphere 一键安装部署 PorterLB 至 Kubernetes 物理机集群，轻松对外管理和暴露 LoadBalancer 类型的服务。
keywords: PoterLB,KubeSphere,Kubernetes,cluster
css: scss/live-detail.scss

section1:
  snapshot: https://pek3b.qingstor.com/kubesphere-community/images/duan-kubesphere.jpeg
  videoUrl: //player.bilibili.com/player.html?aid=885471683&bvid=BV17K4y177YG&cid=261965895&page=1&high_quality=1
  type: iframe
  time: 2020-12-02 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---

## 分享人介绍

段炯 —— KubeSphere 容器平台容器网络研发工程师

个人简介：段炯是青云 QingCloud 的一名高级容器网络研发工程师，他是开源项目 PorterLB 和 KubeSphere 核心维护者，也是 Kubernetes 和 OpenStack 网络领域的专家，他参与设计了 KubeSphere 开源容器平台的 Network Policy 相关功能。

## 摘要

![porter](https://pek3b.qingstor.com/kubesphere-community/images/porter-1.jpg)

众所周知，公有云 (如 AWS、GCP) 通常提供负载均衡器来分配 IP 在托管 Kubernetes 集群暴露服务。然而，Kubernetes 并没有为物理机环境提供负载均衡器，这使得物理机在生态系统中处于二等公民的地位。

而 PorterLB 允许在裸金属 Kubernetes 集群对外暴露服务，使用户获得与云端暴露服务的一致体验。用户可以使用开源的 KubeSphere 一键安装部署 PorterLB 至 Kubernetes 物理机集群，轻松对外管理和暴露 LoadBalancer 类型的服务。

## 分享大纲

在本次在线研讨会中，你将学到:

- KubeSphere 简介: 一个开源的用于 Kubernetes 混合云的容器平台
- 介绍开源项目 PorterLB，以及它的云原生架构
- 如何在 KubeSphere 上一键部署 PorterLB 至 Kubernetes
- 如何从数据中心 (物理机环境) 暴露 Kubernetes 服务