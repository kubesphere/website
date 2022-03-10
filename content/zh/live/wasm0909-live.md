---
title: WebAssembly ——Dapr 的高性能执行环境
description: WebAssembly 可以为微服务应用提供高性能、轻量级、安全的软件沙盒。WebAssembly + Dapr 将使微服务应用更高效、更安全，也更可移植。本次演讲将演示如何使用 CNCF 沙箱项目 WasmEdge 在 Dapr 上构建基于 go 与 基于 Rust  的 sidecar，并在这些 sidecar 里面运行 WebAssembly 函数实现的业务逻辑。
keywords: KubeSphere, Kubernetes, WebAssembly, Dapr
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=462954787&bvid=BV15L411x7D5&cid=405889914&page=1&high_quality=1
  type: iframe
  time: 2021-09-09 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

Dapr 是微软推出的一款非常流行的开源微服务框架。它采用 sidecar 的模式，解耦基础设施和核心业务。作为分布式应用方案，Dapr 可以支持基于 NaCl，容器，以及各种高级语言框架的微服务。

WebAssembly 可以为微服务应用提供高性能、轻量级、安全的软件沙盒。WebAssembly + Dapr 将使微服务应用更高效、更安全，也更可移植。本次演讲将演示如何使用 CNCF 沙箱项目 WasmEdge 在 Dapr 上构建基于 go 与 基于 Rust  的 sidecar，并在这些 sidecar 里面运行 WebAssembly 函数实现的业务逻辑。

## 讲师简介

Michael Yuan，WasmEdge Maintainer / Second State CEO 

个人简介：
Michael Yuan 博士是 WasmEdge 的创始人和维护者。WasmEdge 是一个由 CNCF 托管的开源 WebAssembly 运行环境，用于边缘计算、Service Mesh 和嵌入式函数。 Michael 撰写过6 本软件工程书籍，也是长期的开源贡献者。 Michael 同时也是 Second State 的联合创始人。Second State 是一家 获得 VC 融资的初创公司，开发和商业化 WebAssembly 和 Rust 生态系统中的企业应用。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/wasm0909-live.png)

## 直播时间

2021 年 09 月 09 日晚 8:00-9:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20210909` 即可下载 PPT。

## Q & A

### Q1：Webassembly 会取代 Docker 吗？

**A：** Webassembly 不会取代 Docker 。我们刚刚讲了，Docker 模拟的是操作系统，WebAssembly 模拟的是进程。这是不同层面的问题。

WebAssembly 会在什么场景取代 docker 呢？就是今天 docker 不适合，但是又必须要隔离的场景。比如微服务、边缘计算、汽车。Docker 不适合在实时操作系统上运行。但是这个场景需要隔离，需要容器化，目前没有更好的做法。WebAssembly 在这种场景下会取代 docker，在边缘计算上会取代 Docker。

实际场景是 WebAssembly 和 Docker  side by side 运行，就是说用 K8s 或者 Dapr 这样的微服务框架同时去调度很多不同的 application runtime，这里面会有 Docker  Based 以及 WebAssembly Based。

未来还会有很多 application 仍然使用 docker，但是会有些新的 Application 比如微服务、边缘计算，不适合使用 Docker，就会用 WebAssembly 来写。

所以，我觉得，WebAssembly 更是要把容器的概念发展到 Docker 达不到的地方。

### Q2：有哪些大型项目目前在使用 WebAssembly？

**A：**
要看你怎么定义大型项目，基本上所有的微服务或服务网格项目都有在调研 WebAssembly。

国外上 production 的有 Fastly、cloudflare、shopify。如果大家对这个议题有兴趣的话，可以来参加 KubeCon North America 的 Cloud Native Wasm Day ，来看看世界范围内的公司怎么使用 WebAssembly。

我个人觉得 WebAssembly 的大量使用要从今年的下半年开始。

### Q3：Wasm 程序的内存是如何管理的？Dapr 结合的 Wasm 有源码 demo 吗？

**A：**
Dapr-Wasm 的源代码： https://github.com/second-state/dapr-wasm。

Wasm 里的内存管理是比较复杂的问题。其实 Java 当年出来的时候，就是号称用 JVM 在 runtime 解决了内存管理的问题。但是这也带来了很多问题，比如 JVM 非常复杂，实时性很差。

新一代编程语言，比如 Rust 是用编译器里解决内存管理问题，这是 WebAssembly 管理内存的一个主要思路。可以产生轻量级，高性能，同时内存安全的代码。但是我们也理解大部分云原生程序员，并没有要学习 Rust 的意愿，所以 [WasmEdge 也要支持 JavaScript](https://www.secondstate.io/articles/run-javascript-in-webassembly-with-wasmedge/)。

内存管理是个很深的问题，简单来说，最好的办法是用编译器管理，如果编译器做不到，比如 JavaScript，那就要 WebAssembly 里有个 runtime 进行管理。

### Q4：WasmEdge 是包活的还是每次 fork 的？这里面说的 wasm 隔离性，可以理解为可以限制 cpu、memory 的使用量吗？上面说的图像处理、AI处理，是不是用 serveless 更合适呢？

**A：**
在 dapr 这个场景是每次fork ，因为是从 rust  和 go 起的。之所以可以这么干，就是因为 Wasm 启动时间非常短，启动时间是毫秒级的。如果用 docker 的话，程序的响应时间以秒计，但是 WebAssembly 是以毫秒计。

Wasm 的隔离性是有多种多样的。一个是运行 Wasm 的进程是需要隔离的。在 dapr 这个例子，他提供了一些隔离，一些安全隔离，我可以告诉他，这些进程可以 acess 哪些文件系统，有没有网络。

但是如果要做到 CPU 和 资源的隔离，需要在 Wasm 里面做静态内存分配。我们在起 Wasm 虚拟机的时候，就已经把资源分配好了。

然后我们还有另外一个概念，叫做 gas ，这个概念是从区块链来的。用 gas 来衡量记录执行了多少个 webassembly 指令。在区块链上运行智能合约的时候，就要先给 gas，然后再来运行智能合约，如果gas 不够，那这个合约就不能执行。在这种情况下，也能做到某种程度的资源隔离。

传统意义上的资源隔离使用 K8s 来做的，k8s 进行资源隔离的有 runc 和 crun，我们在这个基础上写 runw 与 [crunw](https://github.com/second-state/crunw)，让 k8s 能够直接起 WasmEdge，这样可以通过 systemd 和 cgroupfs 去进行资源管理。这种方式就更像传统意义上的资源管理与隔离。 

是的，dapr 里的这两个 demo 就是 serverless 。我们用 dapr 起一个 serverless framework，就让人上传函数计算的 function，一个是 AI，一个是图像处理。WebAssembly 文件上传上来，在 dapr 里就可以直接用了。其他的应用直接替换 WebAssembly 文件就可以了，这是一个标准的 serverless 做法。

### Q5：和直接起个进程跑业务逻辑的区别是？

**A：**
直接起个进程，要明确进程里跑什么。要么是 Native Client 或是 node.js 或者是 python，那他的区别就在于对语言的选择、安全性以及隔离性的区别。WebAssembly 最终还是一个容器，提供了容器提供的优点，可以管理，可以隔离，有安全性。最重要的是对资源和安全性有了隔离。那如果是直接在进程里跑业务的话，这些东西是没有的。比如说直接在进程里起一个 native application ，如果这个应用出现了什么问题的话，会把系统 crush 掉，而且也能看到其他应用的内存，把其他应用也 crush 掉。

> 其他问题请查看[问题收集文档](https://docs.qq.com/doc/DQ1VMUlhwVVFCY1J0)。