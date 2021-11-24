---
title: '基础架构的未来是 Kubernetes，那么 Kubernetes 的未来在何方？'
tag: 'Kubernetes,多集群管理'
keyword: 'Kubernetes, MicroVM, WebAssembly, WASM, K3s, KubeEdge, KubeSphere'
description: 'Kubernetes 已经逐渐开始无聊，关于 Kubernetes 之后有哪些令人兴奋的新技术，作者给出了自己的见解。'
createTime: '2021-11-23'
author: '米开朗基杨'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202111242121018.png'
---

随着容器技术大行其道，应用的复杂性只增不减，开发者们开始广泛使用更先进的工具，比如 Kubernetes。目前 Kubernetes 已经不年轻了，逐渐开始 boring，你可能会想问 Kubernetes 之后还有什么令人兴奋的新技术。但云计算是一个快速发展的领域，不太容易精准预测下一个令人兴奋的新技术，不如我们将目光聚焦到目前云计算没有完全覆盖的细分领域。

## 微型虚拟机 (MicroVM)

在 Kubernetes 之后，有一个前景广阔的云技术可能会被广泛接受，即微型虚拟机 (MicroVM)。微型虚拟机与容器的区别在于它不与宿主机共用内核，拥有自己的微内核，提供了与虚拟机一样的硬件虚拟化安全性。虚拟机抽象了内存、CPU、网络、存储和其他计算资源，而微型虚拟机是围绕应用程序来对资源进行抽象，只抽象了必要的资源，所以更加高效。

目前最受欢迎的微型虚拟机就是 [AWS Firecracker](https://github.com/firecracker-microvm/firecracker)，它使用 Rust 语言编写，内存开销极低，将微型虚拟机打包到 Kubernetes 集群中，以提高工作负载的安全性和隔离性。AWS 目前正使用 Firecracker 作为 Serverless 的基础单元，冷启动延迟极低。

Weaveworks 也开源了一个基于 Firecracker 的虚拟机管理器 [Ignite](https://github.com/weaveworks/ignite)，将 Firecracker MicroVM 与 Docker/OCI 镜像结合起来，统一了容器和虚拟机。它以 GitOps 的方式工作，可以像 Kubernetes 和 Terraform 一样声明式管理虚拟机。

还有一些其他项目，例如 [slim](https://github.com/ottomatica/slim/)，旨在从 Dockerfile 中构建和运行微型虚拟机。它的工作原理是从 Dockerfile 中构建并提取 rootfs，然后将该文件系统与一个在 RAM 中运行的微内核合并。

随着越来越多的应用程序被迁移到云端，以及越来越多围绕 5G 技术建立的新业务解决方案，微型虚拟机将会发挥至关重要的作用。

## 高性能 WebAssembly

自从 1995 年 Netscape 公司推出 JavaScript 之后，很长一段时间它都是唯一的网络编程语言。之后人们提出了很多替代方案，但都没有成功，这些替代方案要么不支持跨平台，要么需要浏览器插件。因此，纵然 JavaScript 有它的缺陷性，还是变成了世界上最流行的编程语言之一。

WebAssembly 的出现打破了这个僵局，严格来说，它不是一种编程语言，而是一种二进制指令集。因此它对 JavaScript 没有威胁，也无意取代 JavaScript，它可以和 JavaScript 协同工作，你也可以将 JavaScript 编译成 WebAssembly 二进制格式。

但 WebAssembly 的潜力不仅局限于浏览器层面，全球著名的 CDN 厂商 Fastly 的 CTO 之前在一个视频中完美阐述了 WebAssembly 的价值：

![](https://pek3b.qingstor.com/kubesphere-community/images/202111231140200.webp)

**虚拟机模拟了完整的计算机；容器模拟了完整的操作系统；WebAssembly 仅仅模拟了进程。**

容器大家都比较熟悉，它只模拟了完整操作系统的用户空间，不包含内核空间，也不包含硬件相关的抽象。但是对于微服务和 Serverless 而言，它仍然很重，我只需要启动一个进程，你却让我先启动一个完整的操作系统再启动进程。

这时候 WebAssembly 的价值就体现出来了，你只需要启动一个进程，而我恰好就只启动了进程，没有操作系统，也没有硬件虚拟化，只有孤单的进程，只是这个进程被放入了 WebAssembly 的沙盒中。

看到了这一点，众多工程师开始发挥自己的无限想象力，比如将 WebAssembly 作为 Kubernetes 的 CRI 运行时，代替容器以适应 Serverless 场景。

目前大约有 40 种高级编程语言开始支持 WebAssembly，包括 C、C++、Python、Go、Rust、Java 和 PHP，未来可期。

## 轻量级 Kubernetes 发行版

为了避免 Kubernetes 的安装部署过于复杂，越来越多的人更愿意使用 Kubernetes 的阉割版本，即轻量版。像 [K3s](https://k3s.io/) 这样的轻量级发行版更容易通过命令行安装，它提供了更轻量级的存储后端，并且所有的组件都打包在一个单一的可执行文件中，体积更小。由于它只需要极低的资源就可以运行，因此它能够在任何 512MB 内存以上的设备上运行集群。

## 边缘计算与物联网

伴随着轻量级 Kubernetes 发行版的发展，适用于边缘计算和物联网场景的 Kubernetes 发行版也崭露头角，例如 [KubeEdge](https://kubeedge.io/en/)，提供了边缘计算所需的轻量级和边缘自治能力。但 KubeEdge 缺少云端控制层面的支持，将混合云容器平台 [KubeSphere](https://kubesphere.com.cn/) 与 KubeEdge 结合，可以解决边缘节点纳管、边缘工作负载调度和边缘可观测性等难题，结合 KubeSphere 已有的多集群管理将混合多云管理延伸至边缘侧。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111222046479.png)

## 多集群管理

虽然目前 Kubernetes 中有很多工具可以隔离多租户工作负载，但有时出于安全与合规原因，使用集群作为边界来隔离团队和应用程序更有意义。

随着越来越多的团队和组织在各个云中运行多个 Kubernetes 集群，对多个 Kubernetes 集群的管理和控制变得愈发艰难，像 [CiliumMesh](https://docs.cilium.io/en/v1.9/concepts/clustermesh/)、[Submariner](https://github.com/submariner-io/submariner)、[Skupper](https://github.com/skupperproject)、[Istio](https://istio.io/latest/docs/setup/install/multicluster/) 和 [KubeSphere](https://kubesphere.com.cn/docs/multicluster-management/) 这样的多集群管理工具将使多集群 Kubernetes 环境的管理更加方便和高效。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111222056864.png)

多集群的另一个好处是减少集群故障的影响范围，如果你有强隔离的要求，可以考虑使用多集群。此外，多集群也能简化操作流程，比如在同一个控制平面进行调度和升级。KubeSphere 目前已经支持将工作负载的多副本按不同比例灵活分发到多个集群。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111031147569.png)

## 跨集群备份容灾

随着云原生对 IT  产业的重新洗牌，很多传统的技术在云原生的场景下已经不再适用，譬如备份和容灾。传统的备份容灾还停留在数据搬运的层次上，备份机制比较固化，以存储为核心，无法适应容器化的弹性、池化部署场景；而云原生的核心是服务本身，不再以存储为核心，用户需要更贴合容器场景的备份容灾能力，利用云原生的编排能力，实现备份容灾的高度自动化，同时灵活运用云原生的弹性能力按需付费，降低成本。

为了适应云原生场景，众多 Kubernetes 备份容灾产品开始涌现，比如 Veeam 推出的 [Kasten K10](https://www.veeam.com/cn/kubernetes-native-backup-and-restore.html) 以及 VMware 推出的 [Velero](https://velero.io/)。青云科技也推出了 [Kubernetes 备份容灾即服务产品](https://kubesphere.cloud/self-service/disaster-recovery/)，基于原生的 Kubernetes API，提供了可视化界面，能够覆盖云原生数据保护的绝大多数重要场景，而且能够跨集群、跨云服务商、跨存储区域，轻松实现基础设施间多地、按需的备份恢复。目前该服务还在体验改进阶段，提供了 1TB 的免费托管仓库，感兴趣的可以填写[问卷](https://jinshuju.net/f/W6FoC7)加入他们的专属体验群。