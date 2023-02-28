---
title: 使用 eBPF 零成本落地分布式追踪
description: 本次分享介绍 DeepFlow 使用 eBPF 为分布式追踪带来的革命性创新。
keywords: KubeSphere, Kubernetes, eBPF, DeepFlow
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=822410030&bvid=BV1Dg4y1n7Gf&cid=1023153497&page=1&high_quality=1
  type: iframe
  time: 2023-02-23 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

十二年前 Dapper 在 Google 的成功定义了分布式追踪的规范，而随着云基础设施及云原生架构的规模化采用，经典的追踪机制逐渐遇到了瓶颈：一方面微服务的简化为开发者带来了自由，但随之而来的是插码工作量的显著增大；另一方面服务网格、K8s、云基础设施等组件带来的复杂度超越了业务本身，让开发者捉摸不透，成为了追踪路径上的主要盲点。

本次分享介绍 DeepFlow 使用 eBPF 为分布式追踪带来的革命性创新。借助 eBPF 的零侵扰机制，开发者无需修改代码、无需重新发布、无需重启服务，即可实现全景、全栈的分布式追踪能力，覆盖各类语言的微服务及基础设施。以此为起点，开发者可以灵活选择符合 OpenTelemetry 规范的经典追踪方式生成代码粒度的追踪数据，进一步细化追踪粒度。

## 讲师简介

向阳，云杉网络产品研发总监。2013 年获得清华大学计算机系博士学位，期间独立实现了世界上第一个全球 BGP 劫持实时监测系统，获得了网络测量领域国际顶级会议 IMC 颁发的社区贡献奖，也是该会议首次颁发奖项给中国大陆科研人员。2013 年加入云杉网络，现负责 DeepFlow 产品线，致力于打造一款零侵扰云原生应用可观测性平台产品。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/ebpf0223-live.png)

## 直播时间

2023 年 02 月 23 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20230223` 即可下载 PPT。

## Q & A

### Q1：eBPF 的落地成本和效益之间如何权衡？

A：成本很低：无需修改代码、无需业务进程重新发版、无需重启业务进程。收益显著：零侵扰获取全栈性能指标、全景应用拓扑、分布式追踪数据。

### Q2：是否支持了 Java 异步线程的链路追踪？另外 Java 函数级的耗时能否追踪到？

A：某个调用的请求和响应分别位于两个线程中，这种场景可支持；两个调用完全在两个不同的线程，这种场景目前尚不支持。Java 函数级的耗时追踪预计在 v6.3 中支持。

### Q3：eBPF 是否支持获取服务器节点算力信息，例如 CPU 利用率、核数、memory、gpu 等信息？

A：这些基本指标无需使用 eBPF 获取，Prometheus Node Exporter、Telegraf 都能实现。

### Q4：如何无侵入做 Go 和 PHP 的方法调用维度(服务内)的链路监控, 理论上应该是可行的？

A：对于协程语言，DeepFlow 通过协程染色机制实现分布式追踪，详细逻辑可看直播回放了解。

### Q5：是否支持 K3s？

A：eBPF 不涉及到容器编排系统的兼容性，支持。但 DeepFlow 没在 K3s 上实际跑过，社区小伙伴感兴趣可跑一跑并反馈遇到的问题。

### Q6：每台机器上的性能开销如何?

A：eBPF 的插桩开销可参考 Brendan，Gregg 大神的巨著《BPF 之巅：洞悉 Linux 系统和应用性能》，可以看到 tracepoint 的开销约为 90ns、kprobe 开销约为 70ns、kretprobe 开销约为 210ns、uprobe 开销约为 1280ns、uretprobe 开销约为 1930ns。业务逻辑越简单时，eBPF 插桩造成的开销在整个业务进程资源消耗中的占比越大。例如对于一个 nginx hello-world 页面，对他插桩前后的性能影响比例会远大于对一个正常业务请求。一般来讲 DeepFlow 在生产环境中的经验数据是 1%~5%。

### Q7：DeepFlow 的采集方案加载后，对服务的处理能力有多大的影响？比如请求的响应时间、服务的吞吐量等。

A：影响的经验值在 1%~5%，我们也在整理一些测试代码和测试数据，后续会分享出来。

### Q8：对于多虚拟 veth 网口，DeepFlow 是如何采集？以及保证采集效率的呢？

A：通过 AF_PACKET v3 采集网口流量，MMAP 机制保证了采集包拥有很好的性能，deepflow-agent 在处理采集包时也进行了大量的数据结构和算法优化，例如避免 malloc/free 压力、避免内存复制等，欢迎压测。

### Q9：传统的 ECS (未接入 K8s 的 机器), 是否支持接入 DeepFlow, 接入是否困难？
A：支持，操作非常简单，可参考在线文档：
https://deepflow.io/docs/zh/install/legacy-host/

### Q10：没有 Tracing ID 的情况下，eBPF 是如何快速关联上 Logging 的？

A：通过线程 ID 和时间信息，我们支持了将 eBPF span 与产生该 span 的线程所做的 IO 操作进行关联。

### Q11：当一个服务部署在主备环境的情况下，使用 DeepFlow 的效果如何？

A：对 DeepFlow 没有影响，而且能展现主备 Instance 各自的性能指标、访问拓扑、分布式追踪数据等。

### Q12：eBPF 本身的限制（比如指令数，函数调用等）对 DeepFlow 实现分布式追踪有什么影响？

A：我们在这些限制之下进行了大量的工程优化，欢迎阅读代码了解。

### Q13：DeepFlow 是否具备上生产的条件？贵公司的生产环境已经大规模使用了？对代码的侵入性？性能消耗怎么样？

A：DeepFlow 已经在金融、能源、运营商等 500 强客户中有大量的生产落地，而且 DeepFlow 也在持续监控着云杉网络自己的所有应用系统和云基础设施。零代码修改，性能开销 1%~5%。

### Q14：在可观测性方面，DeepFlow 与 Istio 有比较吗？

A：Istio 是一种服务网格，它的可观测性能力仅限于穿越服务网格代理进程（如 Ingress Gateway、Sidecar Proxy 等）的指标和分布式追踪数据。DeepFlow 是实现云原生可观测性的完整解决方案，不局限于服务网格场景。另外，DeepFlow 可利用 eBPF 零侵扰实现可观测性。

### Q15：DeepFlow 能提供一些应用场景的 Demo 吗？DeepFlow 社区版和企业版差别？

A：Demo 请参考在线文档：
https://deepflow.io/docs/zh/install/overview/

社区版和企业版的差别请参考：
https://deepflow.io/docs/zh/about/editions/

### Q16：无 Trace ID 情况下，如何做 grpc 的链路追踪？

A：请参考直播回放。

### Q17：eBPF 的最新进展，比如新特性会对于 DeepFlow 的性能有很大的提升吗？

A：目前 DeepFlow 适配了内核 4.14+ 中的 eBPF 能力，未来通过提升最低内核版本依赖，我们将会采用越来越多的新特性来进行功能和性能上的提升。
