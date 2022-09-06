---
title: 10 万边缘节点！KubeEdge 大规模边缘集群性能测试实战
description: 在本次分享中，将介绍性能测试使用的相关指标、如何开展大规模测试以及如何实现大规模边缘节点接入。
keywords: KubeSphere, Kubernetes, KubeEdge,  边缘计算
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=857697158&bvid=BV1JV4y1p7Pk&cid=821658445&page=1&high_quality=1
  type: iframe
  time: 2022-09-01 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

随着越来越多的企业以及组织将 KubeEdge 大规模落地，KubeEdge 的可扩展性和大规模部署逐步成为社区用户的关注点。因此，KubeEdge 社区进行了 KubeEdge 集群的大规模性能测试，目前 K8s + KubeEdge 集群能够稳定支持 10 万边缘节点同时在线，并且管理超过 100 万的 Pod。在本次分享中，将介绍性能测试使用的相关指标、如何开展大规模测试以及如何实现大规模边缘节点接入。

## 讲师简介

许世威，华为云边缘计算技术专家。硕士毕业于浙江大学，2017 年加入华为云云原生团队，参与华为内部云原生技术平台建设与开源社区贡献。主要负责云原生智能边缘平台的设计与开发，KubeEdge 社区研发工作，在云原生和边缘容器等领域拥有丰富的开源社区与商业落地实践经验。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeedge0901-live.png)

## 直播时间

2022 年 09 月 01 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654


## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220901` 即可下载 PPT。

## Q & A 

### Q1. 请问百万级的 Pod，每个节点生成的大量 iptables 规则怎么处理？

答：在边缘计算场景中，边缘节点通常分布在不同的地理区域，这些区域中的节点有着计算资源、网络结构和硬件平台等属性上的差异。基于此，我们抽象出了跨地域的应用部署模型, 该模型将边缘节点按地区划分为节点组，并将应用所需资源打包成一个整体在节点组上进行部署。同时，我们提供了流量闭环的能力，将服务流量限制在同一节点组内，在一个节点组中访问 Service 时，后端总是在同一个节点组中。KubeEdge 云上组件 CloudCore 会根据节点组对 Endpoint 和 Endpointslice 进行过滤，滤除不在同一节点组内的后端，之后再下发到边缘节点。所以边缘侧拿到的 Service 元数据只是本节点组的数据，建立的 iptables 或者 ipvs 的规则数目也会大大的减少。

### Q2. quick 协议速度快了多少？

答：在边缘计算的场景下，KubeEdge 云边请求平均响应时间约为 6ms，k3s、原生的 Kubernetes 及其他友商项目，云边请求平均响应时间为 60ms、122ms，甚至更高。在弱网或者网络发生丢包的情况下，KubeEdge 的性能表现更好。详情可见： https://elastisys.com/master-thesis-evaluation-of-kubernetes-alternatives-for-fog-computing/

### Q3. KubeEdge 对硬件的要求是？芯片也没要求？

答：KubeEdge 本身对硬件没有什么要求，边缘侧 Edgecore 组件采用轻量化设计，运行仅需 70MB 内存，建议边缘设备内存 >256MB，CPU>=1 核。针对芯片，KubeEdge 对主流的芯片架构，如 X86、ARM、RiSC-V 等，都有完整的支持。

### Q4. 想在边缘部署一个 20 个左右微服务的应用，是否可用 KubeEdge 方案？边缘的资源没有限制。

答：可以，KubeEdge 全面兼容 Kubernetes 原生能力，支持用户使用 Kubernetes 原生 API 统一管理边缘应用。边缘资源配置建议内存 >256MB，CPU>=1 核。

### Q5. 是否可以在边缘节点不需要升级 Pod 的时候停止 Edgecore 以节约 cloudcore 资源？

答：KubeEdge 支持边缘节点离线自治，在节点断连的场景下，边缘业务可以正常运行。边缘节点可以根据用户的运维等需要，按需开启或者断开边缘节点和 cloudcore 之间的网络。但是不能直接停掉 Edgecore 进程，否则离线自治的能力就会丢失。

### Q6. 所有节点是通过 WebSocket 一直连着？

答：如问题 5 所述，可以根据运维需要，按需连通。

### Q7. 为什么不考虑 rpc，而选用 WebSocket？

答：WebSocket 数据传输基于 TCP 协议，相比于常见的 rpc 实现，WebSocket 和 quic 的网络传输性能更好，在边缘场景弱网以及丢包的场景下，WebSocket 和 quic 表现更胜一筹。

### Q8. 如何快速预装 Edgecore 到量产设备？keadm 联网太慢。

答：keadm 支持离线安装，可以将相关的边缘安装包和证书文件预置到边缘节点，边缘设备上电时，自动注册到云端。

### Q9. 现在有商业化的案例么？

答：随着 KubeEdge 社区的不断发展，KubeEdge 在越来越多的企业以及组织大规模落地。如基于 KubeEdge 的高速取消省界项目，使用 KubeEdge 打造的车云协同管理平台，天翼云大规模 CDN 节点管理平台，采用 KubeEdge 的智慧停车项目等等。
