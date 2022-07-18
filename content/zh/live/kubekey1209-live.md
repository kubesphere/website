---
title: KubeKey v2.0.0 上手指南
description: 本次分享就给大家介绍一下 KubeKey v2.0.0 的整体架构和重要改动，帮助大家快速上手 KubeKey v2.0.0。
keywords: KubeSphere, Kubernetes, KubeKey
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=379700194&bvid=BV1JZ4y197bR&cid=458198382&page=1&high_quality=1
  type: iframe
  time: 2021-12-09 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

KubeKey 是一款帮助用户搭建 Kubernetes 集群的安装工具，其上手简单、功能丰富的特点深受社区用户喜爱。前段时间 KubeKey 公布了开发 v2.0.0 版本的计划，在经过几个月的开发工作后，最近代码已经合并到了仓库的主分支，并且发布了 alpha 版本。本次分享就给大家介绍一下 KubeKey v2.0.0 的整体架构和重要改动，帮助大家快速上手 KubeKey v2.0.0。

## 讲师简介

李耀宗，KubeSphere 后端研发工程师

个人简介：
李耀宗，目前就职于青云科技公司容器研发部，开源爱好者，KubeKey 维护者，Installtion SIG 成员。目前主要负责 KubeKey v2.0.0 相关开发工作。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/kubekey1209-live.png)

## 直播时间

2021 年 12 月 09 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654


## PPT 下载

可扫描官网底部二维码，关注「KubeSphere云原生」公众号，后台回复 `20211209` 即可下载 PPT。

## Q & A

### Q1： Module、task 是串行还是并行？支持 Module 之间有 DAG 依赖的情况？只能按照 task 数组执行吗？

A：Module 目前分为包含 task 的 taskModule 和 通过协程启动的 GoroutineModule，但是目前 kk 的流水线中只使用了 taskModule。从设计上来将可以实现 Module 可以实现串行和并行。task 通过 parallel 字段可以控制是否并行执行。DAG 依赖以后考虑可能会支持。目前只能通过 Module 只能按照 task 数组执行，可以通过控制语句或 task  中的 prepare 控制该 task 是否执行。

### Q2：KubeKey 是否支持一个部署文件可以部署多个 K8s 集群？例如定义一个 K8s 集群集合，指定每个 K8s 集群的配置，是否考虑定义一个 ClusterSet CRD？

A：KubeKey 未来会考虑结合 cluster-api 来重构 operator 模式，之后会设计集群级别，node 级别等不同的 CRD。

### Q3：v1.2.0 版本是否会支持 centos/redhat 8，计划的支持时间节点是？是否有 Web 界面支持计划？部署后是否有考虑将集群巡检加入 KubeKey 的计划吗？

A：对于 v1.2.0 版本，我们考虑之后只会 patch 一些修复 bug 的 PR，新的 feature 将仅添加至 v2.0.0 之后的版本。Web 界面和 KubeSphere 社区的集群巡检工具 KubeEye 之后都会考虑集成进 KubeKey。

### Q4：当一个待部署的集群中同时存在 X86 和 ARM64 机器时，KubeKey 在部署 K8s、Istio 等服务时候是如何处理镜像的？不同机器架构需要不同的 Docker 镜像。

A：KubeKey 会下载不同架构的二进制文件和镜像，并推送到对应架构的机器。

### Q5：如何参与 KubeKey 开发？如何在本地进行开发、测试与 debug？

A：以 Goland 为例，最好有一台 linux 云服务器、虚拟机或者WSL 作为安装 K8s 的机器。Goland 配置 sftp ，这样可以在保存时将代码同步至 linux 中。linux 上可安装这个远程 debug 工具 https://github.com/go-delve/delve。在 linux 上编译 kk，并通过 debug 工具执行 kk 命令，Goland 上配置 go remote 连接 linux 上的 delve debug 服务，这样将可以在 Goland 中进行断点调试。

### Q6：RemoteTask 与 LocalTask 有什么区别? 他们的结构体定义重复度很高,是否提取统一?

A：RemoteTask 包含 Hosts 数组，主要用于 ssh 连接至远程宿主机上执行 Linux 命令。
LocalTask 不包含 Hosts 数组，主要用于运行 kk 的工作节点执行一些本地，不需要连接远程机器的逻辑，如：在终端上显示一个用户确认窗口。
两者均实现了TaskInterface这个接口，之后可以再次进行提取抽象。

> 其他问题请查看[问题收集文档](https://docs.qq.com/doc/DQ1VMUlhwVVFCY1J0)。

### Q1：内置负载均衡会考虑 kube-vip 吗？当时未选择 kube-vip 的原因是什么？

A：内置负载均衡第一版是由 kube-vip 实现的，但是之后发现只能实现高可用，vip 绑定到具体一台 master 节点，所有流量也均会进入这台 master，不能实现负载均衡。

### Q2：KubeKey 部署的 K8s 集群安装路径（比如 kubelet，kubectl，kubeadm）和a pt get 安装默认路径不一样，后期手工升级有影响，这个差异是预期还是有其他考虑？

A：建议通过 KubeKey 升级 K8s 集群。与apt默认安装路径不同也是为了使 KubeKey 方便统一管理，尽可能不受环境其他因素影响。

### Q3：Module、task 是串行还是并行？支持 Module 之间有 DAG 依赖的情况？只能按照 task 数组执行吗？

A：Module 目前分为包含 task 的 taskModule 和 通过协程启动的 GoroutineModule，但是目前 KubeKey 的流水线中只使用了 taskModule。从设计上来将可以实现 Module 可以实现串行和并行。task 通过 parallel 字段可以控制是否并行执行。DAG 依赖以后考虑可能会支持。目前只能通过 Module 只能按照 task 数组执行，可以通过控制语句或 task  中的 prepare 控制该 task 是否执行。

### Q4：KubeKey 是否支持一个部署文件可以部署多个 K8s 集群？例如定义一个 K8s 集群集合，指定每个 K8s 集群的配置，是否考虑定义一个 ClusterSet CRD？

A：KubeKey 未来会考虑结合 cluster-api 来重构 operator 模式，之后会设计集群级别，node 级别等不同的 CRD。

### Q5：v1.2.0 是否会支持 centos/redhat 8，计划支持时间节点？是否有 Web 界面支持计划？部署后是否有考虑将集群巡检加入 KubeKey 的计划吗？

A：对于 v1.2.0 版本，我们考虑之后只会 patch 一些修复 bug 的 PR，新的 feature 将仅添加至 v2.0.0 之后的版本。Web 界面和 KubeSphere 社区的集群巡检工具 KubeEye 之后都会考虑集成进 KubeKey。

### Q6：当一个待部署的集群中同时存在 X86 和 ARM64 机器时，KubeKey 在部署 K8s、Istio 等服务时候是如何处理镜像的？不同机器架构需要不同的 Docker 镜像？

A：KubeKey 会下载不同架构的二进制文件和镜像，并推送到对应架构的机器。

### Q7：会出一期关于搭建配置 KubeKey 的开发环境的教程吗，例如早期的搭建 KubeSphere 的教程？

A：可能之后考虑在 SIG 例会上分享 KubeKey 相关的开发环境配置。

### Q8：如何参与 KubeKey 开发何在本地进行开发、测试与 debug？

A：以 Goland 为例，最好有一台 linux 云服务器、虚拟机或者 WSL 作为安装 K8s 的机器。Goland 配置 sftp ，这样可以在保存时将代码同步至 linux 中。linux 上可安装这个远程 debug 工具： https://github.com/go-delve/delve。在 linux 上编译 KubeKey，并通过 debug 工具执行 kk 命令，Goland 上配置 go remote 连接 linux 上的 delve debug 服务，这样将可以在 Goland 中进行断点调试。

### Q9：RemoteTask 与 LocalTask 有什么区别? 他们的结构体定义重复度很高,是否提取统一?

A：RemoteTask 包含 Hosts 数组，主要用于 ssh 连接至远程宿主机上执行 linux 命令。

LocalTask 不包含 Hosts 数组，主要用于运行 KubeKey 的工作节点执行一些本地，不需要连接远程机器的逻辑，如：在终端上显示一个用户确认窗口。

两者均实现了 TaskInterface 这个接口，之后可以再次进行提取抽象。

### Q10：如何修改 KubeKey 安装下载的容器镜像？

A：配置私有仓库，KubeKey 安装集群时指定通过私有仓库进行安装。

### Q11：precheck 是什么处理逻辑呢？

A：Task 执行流程主要有三步：
1. 初始化。主要是为 runtime 连接对应的宿主机。
2. 执行 prepare。若prepare为空则跳过，不为空则执行 prepare 中 PreCheck() 的逻辑。当 PreCheck() 方法返回 true，且error为空时，该 task 接着执行，否则该 task skipped 或 KubeKey 报错退出。
3. 执行 action。执行 action 中 Execute() 的逻辑。

### Q12：如果用 operator 部署，那和 kubeVela 有什么区别？

A：目前考虑的是 KubeKey 更注重对集群和节点进行管理和操作。
