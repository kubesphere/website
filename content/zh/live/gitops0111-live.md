---
title: 借助 Argo CD 实现 GitOps 多环境管理
description: 本次分享介绍如何使用 Argo CD Generators 和 ApplicationSet 自动管理多套 K8s 环境，并实现“代码即环境”的统一管理方式。
keywords: KubeSphere, Kubernetes, Argo CD, GitOps
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=565206819&bvid=BV1Wv4y1y7Kr&cid=962143660&page=1&high_quality=1
  type: iframe
  time: 2023-01-11 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次分享介绍如何使用 Argo CD Generators 和 ApplicationSet 自动管理多套 K8s 环境，并实现“代码即环境”的统一管理方式。

## 讲师简介

王炜，极客时间《云原生架构和 GitOps 实战》专栏作者，《Spinnaker 实战》作者，深圳氦三科技联合创始人。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/gitops0111-live.png)

## 直播时间

2023 年 01 月 11 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

# PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20230111` 即可下载 PPT。

## Q & A

### Q1：如果 production 跟 test/staging 不在同一个 K8s cluster，Argo CD 该如何配置呢?

A：可以借助 generators 的内置变量把目录名和集群名字关联起来，在配置 destination 字段的时候用变量来选择集群，此外，Cluster generators 也可以实现不同集群的配置效果。

### Q2：你们有用 Argo CD 部署基础组件吗，比如日志 es 监控 Prometheus 存储 OpenEBS 等等插件，是否适合用 Argo CD?

A：基础组件目前不适合用 Argo CD 部署，有一些基础组件用 Argo CD 部署可能会有兼容问题导致无法部署，推荐使用 IaC 的方式例如 Terraform 来定义这些基础组件。未来 Argo CD 进一步完善之后，可以考虑。

### Q3：刚刚上述创建的多个 App 是运行在单个集群还得多个集群呢？如何保证这些环境的隔离？这些新增的环境是怎么创建的呢？

A：我演示的是单集群的方式，隔离通过 namespace 来解决。同时，你可以通过部署到不同的集群来解决隔离问题。环境的创建是通过 generators 通过目录结构自动生成环境的。

### Q4：Argo CD 支持 pull 模式的应用部署么（目前看起来只需要在管控集群安装，然后走 push 模式）？

A：Argo CD 默认是 pull 的方式部署应用。

### Q5：Argo CD 上可以配置两个 source 和 target 的 Git 地址吗，比如一个 Application 是拉去 GitHub 上的代码仓库，另一个拉去 Gitee 的仓库地址？

A：可以通过配置不同的 Application 来实现。

### Q6：Argo CD 支持 gerrit/bitbucket 吗？代码库是 gerrit/bitbucket 的 CI 咋做?

A：只要是标准的 Git 仓库都支持，GitHub 和 GitLab 自带 CI，如果是其他代码仓库的话就需要自建 CI 了，比如 Jenkins、Tekton 等。

### Q7：demo pull request 时用是一个 app 一个环境及域名，但是对于想真正测试 app 来讲，应该是多个 app（Java 语言更明显）才能一起工作，所以多个 app 应用多环境时应该如何处理呢，是基于同一个 ns 下，多个应用共用吗，还是什么思想？

A：比如 a 微服务的 pull 与 b 微服务的 pull request 每次触发一次，均是全量的微服务是一个很耗费资源的，所以 Argo CD 在这个场景还有意义吗,或者说这种 GitOps 更使用于单体的应用（微服务依赖相对较少的服务）。

### Q8：pull 和 push 的模型哪个更好？

A：这两个方案没有好坏，要看使用场景。pull 模型可以不需要对外暴露 webhook，在安全性方面更好，但实时性会稍差。push 模型实时性更好，但在公网暴露了 webhook 可能会导致安全隐患。如果你对实时性要求没这么高，建议用 pull 模型。

### Q9：老师演示 Demo 的时候，发起 PR，Argo CD 监听到就开始创建对应环境了吗？如果 PR 正好触发了 CI，对应的 Docker image 还没上传，会不会创建环境失败？

A：监听到 PR 之后就会立即创建新的环境。此时 image 还没构建好是必然的结果，但没关系，构建镜像和拉取镜像是解耦异步的，即便是镜像不存在，K8s 也会不断重试，直到能拉到镜像为止，这时候就可以创建对业务来说是无感知的。

### Q10：pull 的轮循周期是可配置自定义的？Argo 的部署是否天然支持多云架构？

A：可定义，例如 Demo 里对 PR 的监听我配置的是 10 秒一次，Argo CD 支持多集群，通过使用不同的云厂商 K8s 集群就可以支持多云架构。

### Q11：Argo CD 拉远程 GitHub 仓库的时候，假如集群节点上能连接 baidu 这种外网，但可能 ping 不通外网 GitHub，也能正常在 CD 上 webhook 到 Git 变更吗？

A：你可以开通一个海外节点的集群解决访问 GitHub 的问题，前提条件是集群需要能访问 GitHub。webhook 的前提是 GitHub 能访问到你的 webhook 接口。

### Q12： 一个微服务一个 pull request，Argo CD 会拉起多个依赖微服务，拉起多个微服务自然会消耗掉更多的 K8s 资源（也就是更多的 pod），所以对于微服务体系内环境的共用应该是一个必要解决的问题了，不然引入 Argo CD 对于 K8s 的消耗是巨大的？

A：对于微服务很多的应用，这确实是一个问题。不过实际上也没这么严重，虽然每一个环境都会部署全量的微服务，但这些微服务其实没什么流量，你可以通过配置合理的资源 request 和 limit 对集群资源进行大量超卖。比如，你的业务应用有 100 个 Java 微服务，它在启动过程需要 2C4G 的资源（Java 服务启动比较吃资源），但启动完之后可能只需要 0.5C2G 资源，这时候，假设你的集群有 10C40G 的资源，那么完全可以支撑 20+ 套环境（因为并不是所有环境都同时在启动）。

此外，环境共用也是一个很好的思路，借助 istio 完全可以实现你想要的效果，只是配置起来很复杂，为了那一点资源增加了巨大的维护成本，我个人觉得不划算。