---
title: 浅析 Kubernetes 对 GPU 虚拟化、池化技术的集成
description: 对比 NVIDIA 对 Kubernetes 中 GPU 支持的官方实现，结合 GPU 虚拟化、池化等技术特点，分析利用 kube-scheduler 拓展技术，进行 GPU 调度增强的实现方式，及其在 KubeSphere 中的集成与使用。
keywords: KubeSphere, Kubernetes, GPU, GPU 虚拟化, kube-scheduler
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=940198089&bvid=BV1SW4y167K5&cid=754212674&page=1&high_quality=1
  type: iframe
  time: 2022-06-23 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

对比 NVIDIA 对 Kubernetes 中 GPU 支持的官方实现，结合 GPU 虚拟化、池化等技术特点，分析利用 kube-scheduler 拓展技术，进行 GPU 调度增强的实现方式，及其在 KubeSphere 中的集成与使用。

## 讲师简介

韦伟，趋动科技研发工程师，五年云原生相关经验，开源贡献者。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/gpu0623-live.png)

## 直播时间

2022 年 06 月 23 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## Q & A

### Q1：对比 VMware 的 bitfusion 与 OrionX 在架构的实现层面有哪些不同？如：性能，上层机器学习框架的使用，硬件的支持等，希望做一个横向的对比。

A：bitfusion 目前看只依赖于 VMware 企业平台支持，目前只有远程调用的功能，OrionX 全平台支持，包括 KVM 虚机、容器和裸金属服务器，硬件支持上我们除了 NVIDIA 的卡目前还支持国产的卡。

### Q2：OrionX 虚拟化后的资源是否可以针对视频流进行处理？

A：目前已经支持基于 NVIDIA 视频流的处理能力。

### Q3：远程 GPU 加速这种情况下 Pod 的数据传输到 OrionX-server 传输的网络带宽和延迟是否有要求？

A：本地调用的话没有什么要求，远程调用建议使用 RDMA 网络。

### Q4：如何实现 GPU 加速网络和 Pod 业务网络的之间的分离？

A：加速网络建议走 RDMA，我们 server 启动的时候会配置 RDMA 网口，让 server 的流量直接走 RDMA。

### Q5：OrionX GPU 虚拟化技术，是否获得 NVIDIA 官方认证，如果 NVIDIA 对相关驱动程序停更，或者对某款 GPU 卡停止支持，OrionX 是否会受到影响？

A：我们是基于 NVIDIA 公开的 cuda API 来实现，不受限 GPU 卡的支持。

### Q6：OrionX GPU 虚拟化是否仅支持 NVIDIA 公司的 GPU 产品，面对国产化和信创的趋势，OrionX 是否有相关替代性方案？

A：目前已经支持国产卡，后续会支持更多国产卡。

### Q7：OrionX GPU 虚拟化的集中池化和远程调用 ，这与 NVIDIA 原生的直接调度相比，性能会有多大程度的损失？是否有相关性能对比？

A：性能损耗跟网络关系比较大，在 RDMA 环境下通过 TensorFlow benchmark 测试性能损耗在 5% 以内。

### Q8：OrionX 能否对大显存显卡进行分割，例如某个显卡 A 的显存有 24G、那么我需要启动三个 8G 的 Pod 去使用 A 的资源，该如何进行？

A：我们支持任意比例的切分，算力最小 1%。显存最小 1MB。

### Q9：请问是否支持 GPU 卡级别的 binpack/spread 策略？score 阶段打分函数如何定义？

A：我们支持不同的调度测试，可以根据客户的需求进行配置。

### Q10：OrionX 项目是否开源？

答：目前暂无开源计划。

### Q11：请教下在容器训练和机器上训练，有区别吗？

A：没有太大区别，容器使用更方便。

### Q12：OrionX 对于异构计算上有没有特别的考量？或者说是特殊的优化？

A：我们在底层也做了很多优化，在某些场景中甚至比本地性能更好。

### Q13：请问是否支持差异化的 QoS 级别？支持哪些混部能力？

A：我们支持统一资源池管理，无论研发、测试、训练还是推理可以在一个集群统一管理。支持在线离线的混部。

### Q14：OrionX 目前都支持 NVIDIA 的哪些系列的 GPU 卡，另外， NVIDIA 消费级的 Geforce 卡因其价廉物美，是否也可以通过 OrionX 用来池化，以降低 GPU 的投资成本？

A：我们支持卡的类型跟 cuda 版本有关，只要在我们支持的 cuda 版本范围内的卡，我们都可以支持。

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220623` 即可下载 PPT。