---
title: 5G + IoT 场景下云原生的应用与思考
description: 本期将分享中国移动 5G 和 IoT 相关产品与云原生的结合以及优秀应用案例分享。
keywords: KubeSphere, Kubernetes, IoT, 5G, 云原生
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=640688537&bvid=BV1hY4y1h7fj&cid=576208410&page=1&high_quality=1
  type: iframe
  time: 2022-04-14 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

近日，全球物联网知名研究机构 IoT Analytics 发布了《2022 年值得关注的 10 大物联网技术趋势》，其中之一就是物联网场景下云原生应用正在兴起。当前，随着国内 5G 大规模商用，势必会加速 CT、IT 和 OT 相互融合，云原生作为 IT 领域优秀的基础设施，对以 5G 为代表的 CT 领域带来巨大改变，本期将分享中国移动 5G 和 IoT 相关产品与云原生的结合以及优秀应用案例分享。

## 讲师简介

姜仁杰，现就职于中移物联网有限公司，担任 5G 专网产品部副总经理，负责中国移动 5G 专网平台和应用研发。姜仁杰先后负责过公司云原生研发基础设施，IoT 物联网平台、边缘计算等产品和研发工作，对云原生在 IoT 领域应用实践有丰富经验。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/iot0414-live.png)

## 直播时间

2022 年 04 月 14 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220414` 即可下载 PPT。

## Q & A 

### Q1：部署问题：EdgeCore 是不是只用部署 Docker，用不用加入 K8s Worker 角色中？需要 kubeadm join 后再安装 EdgeCore 程序么？

A：EdgeCore 相当于轻量级 Kubelet，在边缘侧主动连接云端 Cloudcore，由 Cloudcore 代为注册或连接到 K8s 集群中，即加了 K8s 集群，成为 Worker 角色。

kubeadm 只是个安装工具，它会向指定地址下载 EdgeCore 安装包，并检查本地主机环境，为 EdgeCore 生成默认的配置文件，然后启动 EdgeCore 进程。EdgeCore 启动后连接 Cloudcore，加入云端 K8s 集群，然后就可以接受云端的 Pod 部署了。

### Q2：两个平台如何保持数据一致性？

A： 不知是指哪两个平台，这里都说明一下。

自研边缘管理平台没有使用 KubeEdge 的 IoT 相关功能，所以 IoT 相关数据不存在数据一致性问题。

K8s 的节点和自研边缘管理平台的网关进行一对一绑定，KubeEdge+K8s 负责节点管理和应用生命周期管理，IoT 边缘管理平台负责网关设备管理，网关是节点在 IoT 平台的影子概念，用来作为终端设备的拓扑模型。如果是人为故意去删除节点或者网关其中一个而破坏了绑定关系，确实会导致数据不一致。

我们只使用了 K8s 来纳管边缘节点和部署边缘应用，也就只用到了 KubeSphere 对 K8s 资源的封装接口。我们有自研边缘应用市场，和 KubeSphere 云应用商店不冲突 。所以和 KubeSphere 平台不存在数据一致性问题。

### Q3：项目选择 KubeEdge 而没有选择 K3s，是怎么考量的？

A：EdgeCore 官方声称只需要 256M+1C 即可运行——当然如果还再运行几个边缘应用，可能需要 512M 内存以上——主要是它只有一个可执行二进制，可以方便地进行交差编译，运行在轻量级资源受限的嵌入式盒子上。而 K3s 虽然声称是一个简化版的轻量 K8s 集群，但仍然是一个集群，需要在边缘侧安装部署多个集群所需组件，自然对边缘主机的资源要求相对 EdgeCore 来说较高。

K3s 平台侧强依赖其 Rancher 产品，云端管理 API 是 Rancher 自定义的。而 KubeEdge 是对 K8s 的无缝扩展，其云端管理 API 就是 K8s API，不增加学习负担。

在边缘集群问题上，KubeEdge 近半年提取出了 EdgeMesh，可以在边缘节点分组基础上，模拟出一个边缘集群。在这种场景下，边缘侧也就两个可执行二进制进程，相对于 K3s 来说仍然更轻量化，安装也方便。EdgeMesh 可以按需以边缘应用的方式从云端部署下来。也就是在资源受限的单节点上，只需要跑一个 EdgeCore；如果需要边缘集群，再部署一个 EdgeMesh 就行。

### Q4：现在支持的 Linux 系统有点少，这点后续会有更多支持么？

A：EdgeCore 目前支持的 CPU 架构包括：AMD64（x86_64）、ARM64、ARM。支持的操作系统有：Ubuntu、CentOS、Archlinux、OpenWrt 等。如果遇到了不支持的 Linux 系统，可以使用源码包本地编译和交叉编译脚本，自行编译。

边缘异构场景比较多，而云端组件支持主流系统即可，所以 Cloudcore 支持 Ubuntu、CentOS 已经够用。