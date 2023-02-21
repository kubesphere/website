---
title: 浅聊 K8s 存储与 CSI
description: 本次分享将为大家介绍什么是 CSI，通过重温 K8s 常见的基本存储对象理解 CSI 的作用，讲解 CSI 的标准、CSI 插件的构成及流程。
keywords: KubeSphere, Kubernetes, CSI
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=567014873&bvid=BV1Uv4y1x7Mm&cid=1011910515&page=1&high_quality=1
  type: iframe
  time: 2023-02-16 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次分享将为大家介绍什么是 CSI，通过重温 K8s 常见的基本存储对象理解 CSI 的作用，讲解 CSI 的标准、CSI 插件的构成及流程。希望浅显易懂地让听众更熟悉 K8s 存储的运作机制，并在此后的工作中能简单排查集群存储问题。

## 讲师简介

邓堪文，青云科技高级研发工程师，QingCloud-CSI maintainer，Rook contributor。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/csi0216-live.png)

## 直播时间

2023 年 02 月 16 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20230216` 即可下载 PPT。

## Q & A

### Q1：CSI 对企业存储的支持如何，例如 EMC 的 SYMM（VMAX,PowerMax）？

A：CSI 本身只是一个协议标准的定义，适配工作是由 CO（容器编排系统，如 K8s/Mesos 等）与 SP（存储厂商）自行适配的。因此，更合适的问法是，有多少企业存储支持了 CSI？这个问题的答案是几乎所有知名的存储厂商都开发了自己的 CSI 插件，在这个链接中可以看到支持 CSI 的驱动列表：https://kubernetes-csi.github.io/docs/drivers.html，其中也包括了 Dell 的多个存储系统。

### Q2：目前使用了 NFS 的 StorageClass，在部署 Prometheus 时会遇到 failed to mmap 问题，是否是 NFS 在 K8s 中使用有兼容性问题？

A：该问题与 K8s 对 NFS 的兼容性无关，因为部署于 K8s 上的 Pod（如问题中的 Prometheus）本质上只是 Linux 上的进程，与直接运行于 Linux 上的程序并无区别。该问题是 Prometheus 本身与 NFS 的兼容问题，见https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects。

### Q3：通过 CSI 挂载的存储稳定性和性能怎么样，比如 Ceph？

A：CSI 接口本身只与编排流程有关，如创建磁盘，插入磁盘，挂载磁盘，而不是在 I/O 操作中增加了一层抽象中转层，因此性能不会受到影响。

### Q4：有状态服务的主流存储类型是什么？

A：取决于用户的选择。云平台用户一般直接使用该平台云厂商提供的云存储，如 QingCloud-CSI、GCP-PD-CSI、AWS-EBS-CSI 等。私有化部署的企业用户常采购商业存储解决方案，如 NeonSAN、Portworx 等。其他用户多使用开源的存储系统，如 OpenEBS-Local、NFS、Ceph、GlusterFS等。

### Q5：nfs-provisioner 和 nfs-csi 的优劣势以及后续发展趋势能分析下吗？

A：基于 NFS 的 PV 本质上只是 NFS Server 中的一个目录，而无论是 nfs-provisioner 还是 nfs-csi，都只支持 NFS 基本的创建及使用，因此他们的区别不大，后续也没有什么发展趋势可言。
需要注意的是，nfs-client-provisioner 不支持 v1.20 以上的 K8s，需使用 nfs-subdir-external-provisioner。

### Q6：CSI 支持对象存储稳定吗？

A：CSI 只支持文件系统与块存储，若问题是想将对象存储挂载为 Pod 中的一个文件系统，可考虑社区基于 FUSE 实现的 S3-CSI 如：https://github.com/ctrox/csi-s3。

若要使用对象存储（以应用可感知的方式，即应用程序直接调用的是 S3 API），可以参考 K8s 在 v1.25 新推出的 COSI 标准（目前为 Alpha 阶段）：https://container-object-storage-interface.github.io/。

### Q7：GlusterFS 可以不挂载磁盘，用虚拟目录吗？

A：若问题所指的挂载磁盘是指 GlusterFS 的 Node 所使用的 Brick，它只需要是一个文件系统（目录），无论是一个子目录还是完整的磁盘根目录，GlusterFS 均可使用。出于性能及资源限制的因素，官方推荐为 GlusterFS 准备完整的磁盘或分区。

若问题所指的挂载为消费存储的客户端（如 Pod 使用 PV），GlusterFS 对外暴露的形式本就是一个文件系统，而非块设备磁盘。