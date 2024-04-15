---
title: '负载均衡器 OpenELB ARP 欺骗技术解析'
tag: 'OpenELB'
keywords: 'KubeSphere, OpenELB, 负载均衡, Kubernetes'
description: 'OpenELB 正是为裸金属服务器提供 LoadBalancer 服务而生的'
createTime: '2022-11-30'
author: '大飞哥'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/openelb-arp-cover.png'
---

> 作者：大飞哥，视源电子运维工程师，KubeSphere 用户委员会广州站站长，KubeSphere Ambassador。

K8s 对集群外暴露服务有三种方式：NodePort，Ingress 和 Loadbalancer。NodePort 用于暴露 TCP 服务（4 层），但限于对集群节点主机端口的占用，不适合大规模使用；Ingress 用于暴露 HTTP 服务(7 层)，可对域名地址做路由分发；Loadbalancer 则专属于云服务，可动态分配公网网关。

对于私有云集群，没有用到公有云服务，能否使用 LoadBalancer 对外暴露服务呢？

答案当然是肯定的，OpenELB 正是为裸金属服务器提供 LoadBalancer 服务而生的！

## 应用安装与配置

### 安装 OpenELB

> 参考[官方安装文档](https://openelb.io/docs/getting-started/installation/install-openelb-on-kubernetes/)

```shell
$ kubectl apply -f https://raw.githubusercontent.com/openelb/openelb/master/deploy/openelb.yaml
```

### 添加 EIP 池

> EIP 地址要与集群主机节点在同一网段内，且不可绑定任何网卡；

```yaml
apiVersion: network.kubesphere.io/v1alpha2
kind: Eip
metadata:
  name: eip-sample-pool
  annotations:
    eip.openelb.kubesphere.io/is-default-eip: "true"
spec:
  address: 192.168.0.91-192.168.0.100
  protocol: layer2
  interface: eth0
  disable: false
```

### 配置 Service 为 LoadBalancer

把 Service 类型修改为 LoadBalancer，同时 annotations 中添加如下三行：

```yaml
lb.kubesphere.io/v1alpha1: openelb
protocol.openelb.kubesphere.io/v1alpha1: layer2
eip.openelb.kubesphere.io/v1alpha2: layer2-eip
```

总体配置清单如下：

```yaml
kind: Service
apiVersion: v1
metadata:
  name: layer2-svc
  annotations:
    lb.kubesphere.io/v1alpha1: openelb
    protocol.openelb.kubesphere.io/v1alpha1: layer2
    eip.openelb.kubesphere.io/v1alpha2: layer2-eip
spec:
  selector:
    app: layer2-openelb
  type: LoadBalancer
  ports:
    - name: http
      port: 80
      targetPort: 8080
  externalTrafficPolicy: Cluster
```

## Layer2 模式中的黑客技术


![](https://pek3b.qingstor.com/kubesphere-community/images/ff880d68-be25-4def-8cd6-b09a032ae753.webp)

> ARP 欺骗技术: 应用程序主动回复路由器 ARP 请求，让路由器以为该应用是合法终端，从而劫持网络流量包。

OpenELB 正是利用 ARP 欺骗技术，从而获取路由器流量，再由 kube-proxy 将流量转发到 Service 网络。OpenELB Layer2 模式需要配置 EIP，如上图所示的 EIP 为 `192.168.0.91`。

当请求 EIP 地址时，路由器会在局域网内发起 ARP 协议广播，哪个终端设备响应，就把数据包发送给谁；配置 EIP 时有要求，EIP 地址不能绑定任何网卡，也就是说正常情况下，不会有任何物理硬件设备响应。此时的 OpenELB，就趁虚而入，捕获到 ARP 广播信息后，对路由器广播进行响应，把自己伪装成终端设备。OpenELB 获得流量后，再经由 kube-proxy 转发入 Service 网络。

可以在其中一台 Node 上面抓包看一下：

```bash
$ tcpdump -i any arp -nn -vvv | grep 192.168.0.91

17:33:01.398722 ARP, Ethernet (len 6), IPv4 (len 4), Request who-has 192.168.0.91 (ff:ff:ff:ff:ff:ff) tell 192.168.0.91, length 46
17:33:01.398793 ARP, Ethernet (len 6), IPv4 (len 4), Reply 192.168.0.91 is-at 52:54:22:3a:e6:6e, length 46
```

路由器的 ARP 缓存每过一段时间就会失效，重新发起 ARP 协议广播，使用 tcpdump 一直监听就可以抓到相关的数据包。可以看到 OpenELB 响应的 MAC 地址是 Kubernetes 的其中一台节点的 MAC 地址。

## 改善与建议

OpenELB Layer2 模式因其实现简单，而且对物理硬件和网络没有额外要求，所以实际生产中经常会用到。但目前仍存在单点故障风险，即如果 OpenELB 实例因资源不足故障，则整个对外流量将中断。

万幸的是 OpenELB 官方已有新的解决方案，即 Layer2 VIP 模式，该模式的使用方式可以参考[官方文档](https://openelb.io/docs/concepts/vip-mode-beta/)。