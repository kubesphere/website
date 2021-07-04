---
title: '云原生的 WebAssembly 能取代 Docker 吗？'
tag: 'Kubernetes, Docker'
keywords: 'KubeSphere,  WebAssembly, Kubernetes, Docker, Rust'
description: '本文是整理自 2020 年 KubeSphere 社区组织的年度 Meetup 上 Second State  CEO Michael Yuan 的分享，主要介绍了 WebAssembly 在服务端的位置，与 Docker 的对比，与 Rust 的结合以及与 Kubernetes 的结合等。'
createTime: '2021-03-31'
author: 'Michael Yuan'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/webassembly-docker-banner.png'
---


>WebAssembly 是一个可移植、体积小、加载快并且兼容 Web 的全新格式。由于 WebAssembly 具有很高的安全性，可移植性，效率和轻量级功能，因此它是应用程序安全沙箱方案的理想选择。现如今 WebAssembly 已受到容器，功能计算以及物联网和边缘计算社区的广泛关注。究竟 WebAssembly 是怎样的一种技术，能否取代 Docker，就请阅读本文。

>本文是整理自 KubeSphere 2020 年度 Meetup 中 Second State  CEO Michael Yuan 的分享。

大家下午好，我是 Second State 的 CEO Michael Yuan，我们公司的主要研发在台北和美国，然后在北京望京有个办公室。今天非常开心来到 KubeSphere 2020 Meetup，我给大家分享的主题是云原生的 WebAssembly 能取代 Docker 吗？

## 背景

![](https://pek3b.qingstor.com/kubesphere-community/images/WebAssembly-2.png)

这是一个著名的 Twitter，是 Docker 的创始人 Solomon Hykes 在 2019 年 3 月份发布的。他说如果2008年的时候，WASM (WebAssembly) 和 WASI (WebAssembly System Interface, WASM 系统接口) 这两个东西已经存在了的话，他就没有必要创立 Docker了。他认为 WebAssembly 是计算的未来。这条推特在社区里造成很大影响，引发了很多人的的疑问。因为很多人认为，WebAssembly 可以在浏览器里取代 JavaScript，是用来玩游戏的。为什么突然成为在服务端能够取代 Docker 的东西呢？也就在这一年多后，包括我们公司在内，很多人在这里面做了很多 research。

## WebAssembly 在服务端的位置

![](https://pek3b.qingstor.com/kubesphere-community/images/WebAssembly-3.png)

在服务端，我们一般可以把容器、虚拟机或者说运行环境分成三个不同的抽象的层次。

1.在最底层是硬件的 Hypervisor VM，或者说像 AWS Firecracker，这种叫做 microVMs，能够直接跟硬件打交道。

2.再上面一层叫做 Application containers，在这种 vm 上面你可以做像 Docker 这样的 application container。application container 仍然是在操作系统这个层级，是需要把整个操作系统调进来的。

3.再上面一层叫做 High level language VMs ，这是从 Jvm 开始的。然后把 WebAssembly 在操作系统这个层级上面给抽象出来了。这是 WebAssembly 在服务端的位置。

如果 WebAssembly 能够做成一个像 JVM 的 language VM,我们在今天也许能够实现 Java 二十几年前提出的梦想：在不同的操作系统上，在不同的硬件和软件的平台上，能够给开发者提供一个安全并高抽象性的运行环境。

## WebAssembly 和 Docker 的对比

![](https://pek3b.qingstor.com/kubesphere-community/images/WebAssembly-4.png)

WebAssembly 跟 Docker 之间到底是什么关系，为什么说 WebAssembly 有可能会取代 Docker 呢？这里列举了 WebAssembly 相对于Docker 的一些优势。

1. 在冷启动上，WebAssembly 比 Docker 快 100 倍

大家如果做 serverless 或者做容器服务，有一个诟病很多的问题就是冷启动慢。AWS 有预留实例（reserve instance），如果要 keep hot，就违背了无服务器的初衷。用 serverless，我想要的是按毫秒付费，结果我现在先要把东西给 reserve 起来，变成了按天付费。WebAssembly 有一个很大的优势，就是不用启动整个操作系统，所以它在冷启动的时候性能超过 docker 100倍。

2. 在执行时间上，WebAssembly 比 Docker 快 10%-50%

WebAssembly 是一个非常简单的虚拟机，没有操作系统那套东西，所以它在运行时性能也比 Docker 快 10%-50%。

3. WebAssembly 占用的空间更小

WebAssembly 的应用一般在 1MB 以下，而 Docker 镜像经常就能够达到一两百 MB。

4. WebAssembly 有一个现代的安全模型

WebAssembly 安全策略是“Capability-based Security”，一种基于给定资源的安全性控制策略。们可以有针对性地为每一个独立的模块实例提供不同的操作系统接口 / 资源权限。这些操作系统接口或资源权限可以在每个模块进行实例化时被调用者主动指定

5. WebAssembly 使软件更具有可组合性

目前有一个 serverless 应用架构叫做 JAMStack，一个 JavaScript 应用后面可能会有 100 个甚至 1000 个 serverless 函数。我们需要把这些 serverless 函数组合在一起。如果我们用容器来做的话，其实是一件非常重的事。因为要从网络或者操作系统层次来做。但是使用 WebAssembly 可以通过“nanoprocess”，在有安全控制的情况下，将这些函数组合在一起。

6. WebAssembly 无缝支持服务器应用程序框架

如 Node.js，比如 Python

以上就是 WebAssembly 的优势所在。

## WebAssembly 和 Rust

![](https://pek3b.qingstor.com/kubesphere-community/images/WebAssembly-6.png)

讲到 WebAssembly，不能不讲的就是 Rust。 Rust 已经连续 5 年在 Stack Overflow 上成为开发者最受欢迎的语言，大有取代 C 语言的趋势。

因为 WebAssembly 与 LLVM 相接，所以前端可以支持 20 种语言，但是对有 runtime 的语言比如 Python 和 Java 不能很好地支持，对 C++、Rust 等语言支持较好。所以我们觉得 WebAssembly 和 Rust 是天生一对，就像 Java 和 JVM 一样。

Rust 提高了开发者的效率和内存的安全。WebAssembly 提高了运行时的安全与跨平台的执行。而且他们同时都是高性能的和轻量级的。

## WebAssembly System Interface（WASI）

![](https://pek3b.qingstor.com/kubesphere-community/images/WebAssembly-7.png)


WASI 类似于 Java 的 JNI。WebAssembly 之前一直是一个浏览器里的技术，今年要把它放到服务器端，如果要访问文件系统、线程、命令、服务器上的标准库等等，那么就必须通过 WASI。

另外比如说 serverless 的一个主要应用场景是 AI 推理，那么就需要在 WebAssembly 的 runtime 里能够用 GPU、ASIC、TensorFlow 等，这些都是通过 WASI 加入进来的。

## WebAssembly 和 Kubernetes 结合
![](https://pek3b.qingstor.com/kubesphere-community/images/WebAssembly-8.png)

WebAssembly 在浏览器里普及率高，但在服务器端普及率低，这是因为在服务器端它的调度能力不强，缺乏 DevOps 的解决方案。目前是需要自身去管理进程，管理资源分配。所以能够把 WebAssembly 和 Kubernetes 结合起来，是一个非常前沿的领域。

其中一种方法是把 WebAssembly 做成 OCI（open container interface） compliant，另一种方法是在 containerd 里面写 shim API。

现在有不同的人涉足这个领域，包括我们自己，但是目前还是一个比较早期的项目阶段。也希望大家能够关注这个项目，跟我们讨论更好的做法。

上图中的这个链接，是阿里云做的，采用的第二种方法。

![](https://pek3b.qingstor.com/kubesphere-community/images/WebAssembly-9.png)

上文讲到 Docker 的创始人发布的推特在社区造成了很大影响，引发了很多 Docker 粉丝的不满。为了平息大家的怨言，他又发布了一条推特。事实上一年半之后，我们发现情况完全不是这样的，他应该把 Docker 这个词改成 Kubernetes。


## WebAssembly 会取代 Docker 吗？

![](https://pek3b.qingstor.com/kubesphere-community/images/WebAssembly-10.png)

即便 WebAssembly 能够取代 Docker，也不会很快。Docker 有自己的生态，而且与 WebAssembly 不在同一个抽象的层级，所以不是一个新的 runtime 能够很快就取代的。

但是 WebAssembly 在有些方面会有很大的应用，包括需要有高性能的和轻量级的，比如微服务、JAMStack、边缘计算等。

以上是我的分享，欢迎大家一起交流！