---
title: 详解 K8s 服务暴露机制与 OpenELB 负载均衡器插件
description: 本次分享将详细解读 K8s 服务暴露的原理，并演示 CNCF 新晋沙箱项目 OpenELB 的使用。
keywords: KubeSphere, Kubernetes, OpenELB, 负载均衡, 服务暴露
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=509458749&bvid=BV1Zu411D7xq&cid=541233807&page=1&high_quality=1
  type: iframe
  time: 2022-03-03 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

Kubernetes 集群对外暴露服务通常有多种方案，比如 Ingress、LoadBalancer、NodePort，还可以结合 Nginx Ingress controller 或其它网关方案来做服务与流量的统一管理。同时，在私有环境中对外暴露服务特别是 LoadBalancer 类型的服务并非易事，本次分享将详细解读 K8s 服务暴露的原理，并演示 CNCF 新晋沙箱项目 OpenELB 的使用。

## 讲师简介

周鹏飞：CNCF & CDF Ambassador，OpenELB Maintainer, KubeSphere Maintainer

蒋兴彦：OpenELB Maintainer, KubeSphere Member

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/k8s0303-live.png)

## 直播时间

2022 年 03 月 03 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220303` 即可下载 PPT。

## Q & A

### Q1：KubeSphere 默认的网关是怎么来的，是 KubeSphere 后端做的吗？在 K8s 资源中未查到，不是很清楚这个默认的网关能解决的问题场景是什么。这个资源怎么查呢？

A：KubeSphere 的网关实际上就是 Nginx Ingress Controller，用户每开启一个新的项目网关，在系统项目（namespace） kubesphere-controls-system 中就可以看到自动生成一个新的 kubesphere-router-xxx 开头的 Deployment 资源，这个 Namespace 包括了集群中所有的网关资源。

提到网关解决的问题，比如一个典型的例子就是作为一个集群或 Namespace 下不同应用、微服务的统一流量入口对外暴露服务以及管理用户请求，用法跟 Nginx Ingress Controller 类似。


### Q2：OpenELB 和 MetalLB 的区别和优缺点各是什么？

A：MetalLB 在近期也加入了 CNCF Sandbox，该项目在 2017 年底发起，经过 4 年的发展已经在社区被广泛采用。OpenELB 作为后起之秀，采用了更加 Kubernetes-native 的实现方式，虽然起步更晚但得益于社区的帮助，已经迭代了 12 个版本并支持了多种路由方式。这篇文章中我们详细介绍了 [OpenELB 和 MetalLB 的对比](https://kubesphere.io/zh/blogs/openelb-joins-cncf-sandbox-project/)：https://kubesphere.io/zh/blogs/openelb-joins-cncf-sandbox-project/

### Q3：能不能简单介绍一下这几种暴露服务的方式在不同业务场景下的使用区分？

A：ClusterIP 用于集群内部的服务暴露与通信，适用于开发测试；NodePort 用在四层网络，Ingress 用在七层，而 LoadBalancer 可以结合网关（Ingress Controller）对外暴露 80/443 端口，适合生产环境。具体可以参考文章 [Understanding Kubernetes LoadBalancer vs NodePort vs Ingress](https://platform9.com/blog/understanding-kubernetes-loadbalancer-vs-nodeport-vs-ingress/)。

### Q4：KubeSphere 网关默认的 Nginx ingress controller 方案可以替换成其它网关方案吗？比如 APISIX、Traefik、Kong。

A：可以替换成其它网关方案，参考文章：[在 Kubernetes 中安装和使用 Apache APISIX Ingress 网关](https://kubesphere.io/zh/blogs/use-apache-apisix-ingress-in-kubesphere/)。

### Q5：通过应用商店部署一个应用，怎么通过 OpenELB 暴露服务？

A：在创建和配置服务时，外网访问勾选 LB 类型，然后参考官网文档配置修改 OpenELB 的 annotations 即可，本次示例有演示，可观看视频回放。


> 其他问题请参考[问题收集文档](https://docs.qq.com/doc/DQ1VMUlhwVVFCY1J0)。

## 相关内容参考的链接：

- 使用 Ingress-Nginx 进行灰度发布： https://v2-1.docs.kubesphere.io/docs/zh-CN/quick-start/ingress-canary/ 
- KubeSphere 应用路由与服务示例入门： https://v2-1.docs.kubesphere.io/docs/zh-CN/quick-start/ingress-demo/
- 深入浅出 Kubernetes 项目网关与应用路由： https://kubesphere.com.cn/blogs/how-to-use-kubesphere-project-gateways-and-routes/
- 在 Kubernetes 中安装和使用 Apache APISIX Ingress 网关： https://kubesphere.io/zh/blogs/use-apache-apisix-ingress-in-kubesphere/
- OpenELB 项目进入 CNCF Sandbox，让私有化环境对外暴露服务更简单： https://kubesphere.io/zh/blogs/openelb-joins-cncf-sandbox-project/
- OpenELB 官网： https://openelb.github.io/