---
title: '中通快递关键业务和复杂架构挑战下的 Kubernetes 集群服务暴露实践'
tag: 'KubeSphere, Kubernetes'
keywords: 'KubeSphere, 集群服务, Kubernetes, ZTO, Ingress Nginx'
description: '云原生已经势在必行，而应用容器化之后，应用的访问方式该如何解决？中通快递通过打通容器和物理网段以及 Ingress 解决了这一难题，以及当前的其他各种复杂场景问题。'
createTime: '2021-06-11'
author: '王文虎'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/cluster-zhongtong.jpeg'
---

> 本文是上海站 Meetup 讲师王文虎根据其分享内容整理的文章。[点击查看视频回放](https://kubesphere.com.cn/live/zhongtong-shanghai/)

KubeSphere 社区的小伙伴们，大家好。我是中通快递容器云平台的研发工程师王文虎，主要负责中通快递容器云平台开发、应用容器化推广、容器平台运维等工作。非常感谢 KubeSphere 社区的邀请，让我有机会跟大家分享中通快递关键业务和复杂架构挑战下的 Kubernetes 集群服务暴露实践。

## ZKE 容器管理平台

首先介绍一下中通的容器云管理平台 ZKE。ZKE 平台是基于 KubeSphere 开发的，现在管理的中通内部集群超过十个，包含开发、测试、预发布、生产等环境，所有用户都通过 ZKE 平台管理容器应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/ZKE.png)

## Kubernetes 集群服务暴露方案

根据中通的实际业务需求和一些探索，梳理出了中通 Kubernetes 集群服务暴露的几种方案。

![](https://pek3b.qingstor.com/kubesphere-community/images/暴露方案.png)

### Dubbo 服务之间访问

中通大部分应用都是基于 Java 语言开发的，使用的微服务框架为 Dubbo。在上容器之初，我们考虑到虚拟机和容器并存的场景可能会持续很长时间，所以在规划 Kubernetes 集群的时候，通过把容器网络和物理网络打通的方式，来解决 Dubbo 服务在容器和虚拟机混布的场景下互相调用的问题。

- 如何打通 Kubernetes 容器网络和物理网络？

我们内部环境中 Kubernetes 集群网络组件使用 Calico BGP 模式，数据中心物理网络也开启了 BGP 路由协议，通过在物理网络上开启 BGP RR（Route Reflector），避免后期集群规模太大导致 BGP 宣告路由条目过多的问题。BGP RR 和 Kubernetes 集群节点建立 EBGP 邻居，互相学习路由。

![](https://pek3b.qingstor.com/kubesphere-community/images/暴露方案-2.png)

### 泛域名方式访问

在初步推广开发和测试容器化时，我们遇到最多的问题就是用户在应用发布到容器环境后如何访问。

用户在 ZKE 平台上创建 Ingress 以后，该域名是不能访问的，必须要运维把域名指向集群 Ingress Controller，而且公司申请域名需要走 OA 流程，所以这就使得我们的容器环境在初始推广阶段进度很慢。

我们收集了部分用户的反馈，加上自己的思考，终于探索出了一条开发/测试环境比较高效的 Ingress 使用之路：

通过给每个集群分配一个三级泛域名，在公司 DNS 上配置把对应泛域名指向集群的 Ingress Controller，用户后续创建业务域名时可以直接在 ZKE 界面上创建 Ingress，该域名便会立即生效，省去了很大部分测试和开发环境上容器的时间，因为公司安全管理要求，Ingress 只提供了暴露 HTTP 协议的功能，但是这一措施也还是很大程度加快了测试开发容器化的推广速度。

![](https://pek3b.qingstor.com/kubesphere-community/images/暴露方案-3.png)

### 自定义域名访问

泛域名可以帮我们解决大部分开发/测试环境的域名需求，但是针对生产环境、项目域名需要使用 HTTPS 协议、项目需要自定义域名这些场景时，用户除了需要创建 Ingres 之外，还是需要通过 OA 流程进行审批的。

![](https://pek3b.qingstor.com/kubesphere-community/images/暴露方案-4.png)

## 服务暴露方案踩坑实践

以下内容是我们在使用 Kubernetes 的过程中服务暴露以及网络相关踩的坑，供大家参考以避坑。


### Ingress Nginx Controller 服务踩坑实践

下图是我根据 Ingress Nginx Controller 代码启动流程，画的启动流程图（关于启动流程以及这个问题更详细分析可以查看链接： https://mp.weixin.qq.com/s/Pw9-_cPXxhfrd6btSXUrqA）。

![](https://pek3b.qingstor.com/kubesphere-community/images/ingress-nginx-启动流程.png)

Ingress Nginx Controller 启动流程与一个通用的 K8s Controller 的类似，但是真正执行把 K8s Ingress 及其相关资源同步到 Nginx 配置文件的业务逻辑是从 `n.syncIngress` 函数开始的，这个留到下面说。

该问题是我们测试环境使用过程中踩过的一个坑，用户通过 ZKE 管理平台创建 Ingress 时触发了集群 Ingress Controller 故障。我们在做故障分析时发现了故障复现的条件，如下图所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/踩坑实践-1.png)

前面说到 `n.syncIngress` 函数是 Ingress Nginx Controller 业务逻辑的入口，从该入口到本次故障最终调用函数中间的调用链 PPT 中也有提供，最终的问题点落在了 `extractTLSSecretName` 函数。

![](https://pek3b.qingstor.com/kubesphere-community/images/踩坑实践-2.png)

根据代码逻辑再分析一下原因：

1. createServers 函数会遍历 `ing.Spec.Rules`，当 `ing.Spec.TLS` 字段不为空时会把 `rule.Host`、Ingress 以参数形式传入 `extractTLSSecretName` 函数；
2. `extractTLSSecretName` 函数首先会遍历 `ing.Spec.TLS`，校验 `tls.Hosts` 中是否包含 host，如果包含直接返回 `tls.SecretName`；
3. 当 `tls.Hosts` 中不包含 host 时，会把 `tls.SecretName` 对应的 secret 资源转为 `*ingress.SSLCert` 类型并且校验 host 是否匹配证书中的 SAN 或 CN 属性。然而当配置的 secret 为非 TLS 类型证书时，`cert.Certificate` 值为 nil，就会导致 `cert.Certificate.VerifyHostname`(host) 处代码会报 panic 导致主程序异常，然后 Nginx controller 就挂了；

修复措施分两部分：

1. 平台用户操作层面避免这种情况：主要是通过用户创建 Ingress 选择证书时过滤掉非 TLS 类型的 secret，保证绝大部分通过平台使用者不会触发此类问题；
2. 修复代码逻辑根治此问题：增加判断 `cert.Certificate` 是否为nil的逻辑。
 
### Calico 关闭 natOutgoing 配置

这个配置发生的背景是在 Dubbo 应用生产容器化过程中，生产环境 Zookeeper 对单个 IP 连接限制数比节点上 Pod 数小，导致节点上容器里的 Dubbo 应用经常会出现连接 Zookeeper 被拒绝的问题。再因为容器网络和物理网络已经打通，通过 Calico 配置 natOutgoing 参数为  false，这个问题就迎刃而解了。

![](https://pek3b.qingstor.com/kubesphere-community/images/踩坑实践-3.png)
