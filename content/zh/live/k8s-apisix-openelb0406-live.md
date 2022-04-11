---
title: Kubernetes 中的流量管理和服务发现
description: 本次分享将介绍 Kubernetes 中的流量管理和服务发现的原理，并介绍如何将 Apache APISIX Ingress controller 和 OpenELB 结合使用。
keywords: KubeSphere, Kubernetes, APISIX, OpenELB
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=595467251&bvid=BV1iq4y1a78Q&cid=569257329&page=1&high_quality=1
  type: iframe
  time: 2022-04-06 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次分享将介绍 Kubernetes 中的流量管理和服务发现的原理，并介绍如何将 Apache APISIX Ingress controller 和 OpenELB 结合使用。

## 讲师简介

张晋涛，API7.ai 云原生技术专家， Apache APISIX PMC, Kubernetes ingress-nginx reviewer，containerd/Docker/Helm/Kubernetes/KIND 等众多开源项目 contributor， 『K8s 生态周报』的维护者，微软 MVP。对 Docker 和 Kubernetes 等容器化技术有大量实践和深入源码的研究，业内多个知名大会讲师，PyCon China 核心组织者，写有 《Kubernetes 上手实践》、《Docker 核心知识必知必会》和《Kubernetes 安全原理与实践》等专栏。公众号：MoeLove。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/k8s-apisix-openelb0406-live.png)

## 直播时间

2022 年 04 月 06 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220406` 即可下载 PPT。

## Q & A 

### Q1：KubeSphere 目前的网关功能默认开启是 Nginx Ingress，是否把默认的换成 APISIX，目前安装 APISIX controller 后，无法在 KubeSphere console 的网关中看到，并通过 KubeSphere console 来管理应用路由和网关，有计划吗？

A：这里有两篇文章可供参考：
- [使用 Apache APISIX 作为 Kubernetes 的 Ingress Controller](https://kubesphere.io/zh/blogs/kubesphere-apacheapisix/)
- [在 KubeSphere 中安装和使用 Apache APISIX Ingress 网关](https://kubesphere.io/zh/blogs/use-apache-apisix-ingress-in-kubesphere/)

需要注意的是，如果集群中有多个 ingress controller 同时存在，那么需要注意通过 IngressClass 进行区分。

### Q2：Apache APISIX 与 Nginx 相比有什么优势？

A：这里有一篇文章详细的做了介绍：
[有了 NGINX 和 Kong，为什么还需要 Apache APISIX](https://www.apiseven.com/blog/why-we-need-Apache-APISIX)。

### Q3：KubeSphere 应用商店是否包含 APISIX？

A：包含的。

### Q4：OpenELB 在虚拟机上实验，可以分配到 IP,但是无法正常访问，是不是虚拟机环境有要求或什么限制，在同一网段？

A：需要看你具体环境中路由是否通，能分配 IP，那么 OpenELB 的基本任务已经完成了。

### Q5：APISIX 是否可以和 KubeSphere 共用一个 Etcd 呢？后续是否会支持？


A：可以，但是不建议共用。可以避免爆炸半径过大。


### Q6：OpenELB 可以用在生产环境吗？


A：可以，[官网](https://porterlb.io/about/)上已经有一些生产环境的案例。

### Q7：APISIX 是以什么方式对外暴露的？


A：通过 NodePort 或者 LoadBalancer 等方式，也可以共享 Node 的网络堆栈，使用 HostNetwork 的方式暴露。


