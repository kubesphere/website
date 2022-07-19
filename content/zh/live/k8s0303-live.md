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

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220303` 即可下载 PPT。

## Q & A

### Q1：KubeSphere默认的网关是怎么来的，是kubesphere后端做的吗？在k8s资源中未查到，不是很清楚这个默认的网关能解决的问题场景是什么。这个资源怎么查呢？

A：KubeSphere 的网关实际上就是 Nginx Ingress Controller，用户每开启一个新的项目网关，在系统项目（namespace） kubesphere-controls-system 中就可以看到自动生成一个新的 kubesphere-router-xxx 开头的 Deployment 资源，这个 Namespace 包括了集群中所有的网关资源。

提到网关解决的问题，比如一个典型的例子就是作为一个集群或 Namespace 下不同应用、微服务的统一流量入口对外暴露服务以及管理用户请求，用法跟 Nginx Ingress Controller 类似。

### Q2：OpenELB 和 MetaLB 区别和优缺点？

A：MetalLB 在近期也加入了 CNCF Sandbox，该项目在 2017 年底发起，经过 4 年的发展已经在社区被广泛采用。OpenELB 作为后起之秀，采用了更加 Kubernetes-native 的实现方式，虽然起步更晚但得益于社区的帮助，已经迭代了 12 个版本并支持了多种路由方式。这篇文章中我们详细介绍了两者对比： https://kubesphere.io/zh/blogs/openelb-joins-cncf-sandbox-project/

### Q3：MetalLB 使用 ConfigMap 来配置 IP 池, OpenELB 使用 eip 来配置 IP 池的目的，我用 MetalLB 可以很明显看到和使用虚拟 IP(VIP) 访问比较简单不用外置硬件路由器，看 OpenELB 演示还是使用了域名或硬件路由，核心路由协议 BGP，在离线环境无硬件路由下怎样考虑架构。哪个协议性能更好？

A: OpenELB 是 K8s LB Service 的实现，它不依赖域名。如果选择 BGP 模式,则需要外部路由器支持 BGP 协议,且需要支持 bgp additional-paths 属性.  如果没有硬件路由的情况，目前只能配置 Layer2 协议。未来 OpenELB 社区会支持更多的协议。

### Q4：能不能简单介绍一下这几种暴露服务的方式在不同业务场景下的使用区分？

A: ClusterIP 用于集群内部的服务暴露与通信，适用于开发测试；NodePort 用在四层网络，Ingress 用在七层，而 LoadBalancer 可以结合网关（Ingress Controller）对外暴露 80/443 端口，适合生产环境。具体可以参考文章 [Understanding Kubernetes LoadBalancer vs NodePort vs Ingress](https://platform9.com/blog/understanding-kubernetes-loadbalancer-vs-nodeport-vs-ingress/)。

### Q5： 路由表在哪里？上层 BGP 路由在哪里，后期会做可视化路由吗？

A: 路由表存在于 BGP Peer 上，也就是你的上级路由器，如果路由器不支持 BGP 的话，建议使用 L2 模式。OpenELB 是通过调用 GoBGP 来实现的 BGP 协议，因此可以用过 [GoBGP CLI](https://github.com/osrg/gobgp/blob/master/docs/sources/cli-command-syntax.md) 查看，后期社区会根据用户需求的规模情况来支持可视化路由，也欢迎大家参与这部分的开发贡献。

### Q6：Layer 2 模式下，K8s 集群节点虚机的网卡名称不一致，网卡项怎么配置？地址池可以枚举吗？

A: 可以考虑将 interface 配置为 can_reach:192.168.1.1，这里的 192.168.1.1配置为你的网关地址。具体可以参考官网 [EIP 配置](https://openelb.github.io/docs/getting-started/configuration/configure-ip-address-pools-using-eip/) ；地址池可以枚举。

### Q7：KubeSphere 网关默认的 Nginx ingress controller 方案可以替换成其它网关方案吗？比如 APISIX、Traefik、Kong？

A：可以替换成其它网关方案，参考[在 Kubernetes 中安装和使用 Apache APISIX Ingress 网关](https://kubesphere.io/zh/blogs/use-apache-apisix-ingress-in-kubesphere/)。

### Q8：开启 service 的 LB 类型，选择 OpenELB，service 的注解是必输入项？

A: 不是必须的，当存在默认的 eip 时，OpenELB 自动处理没有任何主机的 LB 类型的 Service。可以通过给 eip 增加注解 `eip.openelb.kubesphere.io/is-default-eip: true` 将其设置为默认 eip。

### Q9：配置地址池绑定接口是每个节点都需要绑定吗，还是绑定在某个节点？如果绑定到每个节点 L2 模式下节点接口处于某个 vlan 中，但是各个节点的接口可能不处于同一 vlan 同一个网段。

A: 可以参考官网 [EIP 配置](https://openelb.github.io/docs/getting-started/configuration/configure-ip-address-pools-using-eip/)。

### Q10：L2 层不是 mac 地址嘛？和 EIP 有啥关系？

A: 没有关系。Layer2 模式使用了 ARP 协议；EIP 在配置中可以指定使用的协议，默认情况使用 BGP 协议，可以参考官网 [EIP 配置](https://openelb.github.io/docs/getting-started/configuration/configure-ip-address-pools-using-eip/) 。

### Q11：OpenELB 需要安装并且创建地址池才能使用，那其他租户或者其他 Namespace 可以使用吗？后续是否考虑将 OpenELB 作为自带应用融入呢？

A: 其它租户或 Namespace 是可以共用的；在 KubeSphere 3.3.0 中将深度集成 OpenELB，用户在暴露服务时可以直接在界面选择是否使用 OpenELB 来暴露 LB 服务，更加方便易用。

### Q12：通过应用商店部署一个应用，怎么通过 OpenELB 暴露服务？

A: 在创建和配置服务时，外网访问勾选 LB 类型，然后参考官网文档配置修改 OpenELB 的 annotations 即可，本次示例有演示。

### Q13：金丝雀发布和蓝绿发布下，是怎么验证新发布版本的可用性是否有问题的呢？

A：金丝雀发布和蓝绿发布只是灰度发布的几种技术方案，能够按照不同的发布策略让不同的目标用户人群访问不同版本，但最终的测试方案还是需要开发测试团队来评估，可能需要结合一些第三方的测试工具对不同版本的应用进行接口或 Web 测试，不同类型的应用有不同的测试方法。

### Q14：手绘图用什么软件做的？

A：参考 https://excalidraw.com/

### Q15：公司项目是 vue + java 的，前后端分离，然后使用 KubeSphere，而且私有化的项目下，默认配置的比较单一，这方面会有什么好的建议吗？就是只用内网 IP 的方式访问服务即可，看默认的网关好像还走了 Master 节点，主要对集群稳定性会不会不太好呢，不是需要控流吗，还是会消耗节点资源的吧?

A：一个项目网关就是一个 Nginx ingress controller，毕竟是无状态应用，资源消耗几乎可以忽略，它跟 Master 节点没有关系，网关也不会影响集群的稳定性；可以通过 KubeSphere 界面的集群网关去监控一下流量和请求的情况。


## 相关内容参考的链接：

- 使用 Ingress-Nginx 进行灰度发布： https://v2-1.docs.kubesphere.io/docs/zh-CN/quick-start/ingress-canary/ 
- KubeSphere 应用路由与服务示例入门： https://v2-1.docs.kubesphere.io/docs/zh-CN/quick-start/ingress-demo/
- 深入浅出 Kubernetes 项目网关与应用路由： https://kubesphere.com.cn/blogs/how-to-use-kubesphere-project-gateways-and-routes/
- 在 Kubernetes 中安装和使用 Apache APISIX Ingress 网关： https://kubesphere.io/zh/blogs/use-apache-apisix-ingress-in-kubesphere/
- OpenELB 项目进入 CNCF Sandbox，让私有化环境对外暴露服务更简单： https://kubesphere.io/zh/blogs/openelb-joins-cncf-sandbox-project/
- OpenELB 官网： https://openelb.github.io/