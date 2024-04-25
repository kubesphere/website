---
title: '网络隔离的最小配置'
tag: 'KubeSphere, Kubernetes, network'
keywords: 'KubeSphere, Kubernetes, network, 网络隔离, nodeport, NetworkPolicy, LoadBalancer, Ingress, OpenELB'
description: '本文主要介绍网络隔离的最小配置方法。'
createTime: '2024-04-25'
author: '任云康'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/20240425-cover.png'
---

> 作者：任云康，青云科技研发工程师

## 前言

对于项目下的网络隔离，有用户提出了以下疑问：
- 网络隔离是针对 Pod 的吗？
- 网络隔离的最小配置是什么？
  - 配置后，哪些是可以访问的，哪些是不可以访问的？
  - 通过 Ingress 暴露、LB 类型的 Service 暴露、NodePort 类型的 Service 暴露的流量的具体链路是什么样的？

## KubeSphere 网络策略的实现思路

![](https://pek3b.qingstor.com/kubesphere-community/images/20240425-1.png)

KubeSphere 对于 NetworkPolicy 的集成中主要包含：

- 集群网络策略管理：主要提供一个原生的 NetworkPolicy 资源的管理，当 KubeSphere 租户网络隔离无法满足用户的全部需求时，可以在此通过 yaml 管理原生的 NetworkPolicy。

- 租户网络隔离管理：分为企业空间网络隔离和项目空间的网络隔离。
  - 当开启企业空间网络隔离时，会自动为该企业空间的所有项目创建一条只允许本企业空间访问的入站规则的网络策略，默认不限制出站流量；
  - 当开启项目网络隔离时，会自动为该项目创建一条只允许项目访问的入站规则的网络策略；
  - 项目网络隔离下可以配置白名单列表，内部白名单允许当前项目中的容器组与当前企业空间其他项目中的服务进行通信，外部白名单允许当前项目中的容器组与企业空间外部的特定网段和端口进行通信；
  - 默认不限制出站流量；如果配置出站白名单，那只会放行白名单上的出站项。

> 出站：即对本项目下的 pod 是否可以访问本项目外的 pod/ip/port 的限制。
>
> 入站：即对本项目外的 pod/ip 是否可以访问本项目下的 pod 所提供的服务的限制。
>
> 注意：NetworkPolicy 是由具体的 CNI 来实现，KubeSphere 做了 UI 化的管理，同时封装了一个项目级别的 NetworkPolicy，用作项目空间的网络隔离。

因此，对前文的问题，我们有了答案：

1. 网络隔离是针对与 pod 的，而项目网络隔离会匹配本项目下的所有 pod；也可以认为此处的网络隔离是针对项目的。
2. 服务通过 Ingress、NodePort、LoadBalancer 暴露，表明 service 要给集群外提供服务，如果使用 KubeSphere 项目网络隔离进行管理的话，需要配置外部白名单。

## 配置

当我们通过 NodePort、LoadBalancer 暴露 Kubernetes 的 service 时，kube-proxy 会创建相应的 ipvs 或 iptables 规则来转发流量。然而，当外部流量进入集群并根据这些规则被转发时，如果目标 pod 不在本地节点上，就会进行一次源网络地址转换（SNAT），这将导致 TCP 包中的源 IP 地址被替换为节点 IP 或 overlay 封装接口的 IP，从而丢失了客户端的原始 IP。如果目标 pod 在本地节点上，可能会直接转发到本机 pod，此时会保留客户端 IP。

> 这里以 Calico 举例，如果使用的非 ipip/vxlan 模式，我们需要找到 node 上的 eth0 网口上的 IP；如果使用的是 ipip/vxlan 模式，需要找到 node 上的用于封装网卡的 IP，然后添加到外部白名单中放行。同时也要把客户端 IP 也添加到外部白名单中放行。

为了总是保留客户端的原始 IP，可以将 service 的外部访问策略设置为 Local。但是当流量进入没有目标 pod 的节点上时，流量不再进行转发导致请求失败。

### 配置 NodePort 暴露

当配置 service 为 NodePort 且配置外部访问策略为 Cluster 时，流量访问如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/20240425-2.png)

当配置 service 为 NodePort 且配置外部访问策略为 Local 时，流量访问如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/20240425-3.png)

开启项目网络隔离后，

- 当外部访问策略为 Cluster ，需要在外部白名单中放行集群的所有节点 IP 或 overlay 封装接口的 IP、客户端 IP，缺点是可能会丢失客户端 IP，且由于 SNAT 的缘故无法拦截指定的 IP；
- 当外部访问策略为 Local ，需要在外部白名单中放行可以访问该服务的客户端 IP，缺点需要确保使用运行了 pod 的节点 IP:NodePort 来访问 service，否则数据包会被丢弃，从而导致请求失败。

### 配置 LoadBalancer 暴露

当 service 设置为 LoadBalancer 时，你需要支持配置外部负载均衡器的环境，不同的环境技术实现也会有所不同，下面以 OpenELB 为例说明。

当配置 service 为 LoadBalancer 且配置外部访问策略为 Cluster 时，流量访问如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/20240425-4.png)

当配置 service 为 LoadBalancer 且配置外部访问策略为 Local 时，流量访问如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/20240425-5.png)

开启项目网络隔离后，

- 当外部访问策略为 Cluster ，需要在外部白名单中放行集群的所有节点 IP 或 overlay 封装接口的 IP、客户端 IP，缺点是可能会丢失客户端 IP，且由于 SNAT 的缘故无法拦截指定的 IP；
- 当外部访问策略为 Local ，需要在外部白名单中放行可以访问该服务的客户端 IP，OpenELB 只会将访问 LoadBalancer serviceip 的流量转发到已经运行了 pod 的节点上。

### 配置 Ingress 暴露

当配置 Ingress 访问时，集群内部不同的 service 需要注册相应的应用路由，同时 Ingress svc 依旧需要通过 LoadBalancer 或者 NodePort 对外暴露，访问流量如下图：

![](https://pek3b.qingstor.com/kubesphere-community/images/20240425-6.png)

对于 LoadBalancer 或者 NodePort 对外暴露可见我们上述探讨。

更多技术原理可参考 kubernetes networkpolicy：

- https://kubernetes.io/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/
- https://kubernetes.io/zh-cn/docs/concepts/services-networking/network-policies/
