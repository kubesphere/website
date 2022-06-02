---
title: 容器原生虚拟化：从 KubeVirt 到 KSV 虚拟化
description: 通过与 Hypervisors、OpenStack 等传统虚拟化技术在计算/存储/网络/原理等多维度的对比，体现云原生虚拟化 KubeVirt 所带来的技术优势，以及 KubeVirt 在 KSV 平台的实现方式和 demo 演示。
keywords: KubeSphere, Kubernetes, OpenStack, KubeVirt, 虚拟化
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=596971133&bvid=BV1gB4y1X73s&cid=730553912&page=1&high_quality=1
  type: iframe
  time: 2022-05-26 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

通过与 Hypervisors、OpenStack 等传统虚拟化技术在计算/存储/网络/原理等多维度的对比，体现云原生虚拟化 KubeVirt 所带来的技术优势，以及 KubeVirt 在 KSV 平台的实现方式和 demo 演示。

## 讲师简介

刘远清，青云科技容器团队顾问级工程师，有十年的电信产品研发经验。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/ksv0526-live.png)

## 直播时间

2022 年 05 月 26 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

# PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220526` 即可下载 PPT。

## Q & A

### Q1：很多虚拟机都有固定 IP 的功能，这方面我们是怎么实现的，保证虚拟机重启后 IP 是不变的？

A：对于 Macvtap 的实现，KSV 有自己的 IPAM 功能模块来管理 IP 地址，只要创建 VM 的时候就会固定给他分配 IP 地址，VM和容器网络是分开的，所以不存在重启后 IP 地址变化的问题，对于 Kube-OVN 也是支持重启后 IP 地址不变的。

### Q2：在问题 1 的基础上，虚拟机都会有很多单独的 IP 的管理分配，有没有具体的 multus CNI 方案去实现？

A：虚拟机的 IP 地址是通过 Kubevirt 的 clount-init 配置传递到虚拟机中的，所以与 CNI 没有关系。

### Q3：类似 OpenStack FloatingIP 的 feature 有实现吗？

A: 暂时没有实现这个功能，在云原生下应该更希望用 LB 或者 service 来解决。

### Q4：KubeVirt 是不是支持集群的 worker node 是裸金属服务器的情况啊？

A：KubeVirt 的母体是 K8s，K8s 是支持安装在裸金属服务器上的，考虑虚拟机的嵌套虚拟化的需要，最好安装到裸金属服务器上。

### Q5：KSV 里使用了什么网络插件 Overlay 网络？

A：KSV 用 Macvtap 实现的是 Underlay 网络，正在集成 Kube-OVN。

### Q6：VM 实例和 Pod 是什么关系，是 Pod 里启动的 VM 吗？

A：Pod 是带有 libvirt 环境的，所以虚拟机是在 Pod 里面起来的。

### Q7：OpenStack 相比于 KubeVirt，KubeVirt 更适合什么场景？

A：KubeVirt 会让 K8s 统一纳管容器和 VM，让虚拟机与容器之间更好的交互，虚拟机可以重用云原生组件，还有就是 K8s 要比 OpenStack 更轻量级。

### Q8：Kube-OVN 性能有点差，有使用网络加速插件吗？

A：容器下的大多网络插件都是在一个子网平面的，但是 Kube-OVN 提供了虚拟交换机，虚拟路由器，网关等功能，更加灵活。现在 Kube-OVN 是通过 vether+bridge 的方式接入虚拟机，经过的路径太长，希望 Kube-OVN 和 KubeVirt 社区合作，通过 OVS 的 internal port 直接挂到 VM 中，这样路径很短很多，也可以通过 DPDK+OVS 来提高这个性能，如果更高的网络性能需求，建议使用网卡的硬件虚拟化技术 SRIOV，KubeVirt 是支持的。

### Q9：虚拟机支持组播吗？

A：对于 Macvtap 来说，只要物理交换机支持，应该没问题的。

### Q10： KSV 产品可以试用吗？

A：前端支持 3 节点 9VM 的免费体验，但是后端用 kubectl 命令是没有任何限制的，可以 [KSV 官网](https://kubesphere.cloud/ksv/)了解和下载体验。