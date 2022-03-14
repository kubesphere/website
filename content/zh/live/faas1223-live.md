---
title: 函数计算应用场景探讨及 FaaS 设计和实现
description: 从社区开源的 Knative、OpenFaaS、OpenFunction 入手 到 Lambda、Cloud Run 等商业产品，讲解 FaaS 的使用和经典设计，抛砖引玉介绍"旷视"内部的 FaaS 设计和实现。
keywords: KubeSphere, Kubernetes, FaaS, OpenFunction, Knative, OpenFaaS
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=935107557&bvid=BV1DT4y1f7TG&cid=467466159&page=1&high_quality=1
  type: iframe
  time: 2021-12-23 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

FaaS 是什么，为什么需要了解 FaaS，以及 FaaS 如何实现，我们怎么用？从社区开源的 Knative、OpenFaaS、OpenFunction 入手 到 Lambda、Cloud Run 等商业产品，讲解 FaaS 的使用和经典设计，抛砖引玉介绍"旷视"内部的 FaaS 设计和实现。

## 讲师简介

王续，旷视科技资深工程师

个人简介：
王续，旷视科技资深工程师。专注于云原生，负责公司内 PaaS、FaaS 平台的设计、实现。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/faas1223-live.png)

## 直播时间

2021 年 12 月 23 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20211223` 即可下载 PPT。

## Q & A

### Q1：旷视 FaaS 对 AI 场景有什么特别的优化？ 和 kfserving 比较呢？

A：没有特别优化，我们现在还没有全面推广开，更多的场景和 kfserving 都比较 类似，能够支持用户上传自己的模型、或者 下载某个地址的模型，声明你是 TensorFlow 还是 pytorch 什么的，可以用官方的 serving 服务起来， 可以理解为并没有比 KFServing 特殊的优化。

### Q2：冷启动方面有什么解决方案？

A：冷启动个人理解会分为几个层次，网络上常见的图也比较多，核心就是 代码拉取、镜像拉取、 到 容器启动 再到 容器内的进程启动的过程，代码我们通过将简单的构建物，比如 编译之后的二进制 放在 共享存储，避免镜像的重复拉取；涉及到负责镜像定制的，我们有选项可以在每次编译之后 把镜像推送下去；至于容器启动，我们简单对比了 containerd、firecracker 这种，firecracker、gvisor 确实速度更快一些，我们在 dev 集群是用到轻量虚拟机；容器内的进程启动，我们做的就是 健康检查设置的更频繁，真正 ready 后能快速对外服务。

### Q3：AI 模型的加载方面怎么做优化提速？

A：目前没有特别多的经验，有更多经验之后，我们还会继续和大家讨论；不过 个人理解的模型拉取这一块可以把模型拉到最近的 pvc，社区有 fluid 解决方案。

### Q4：作为一个 FaaS 平台，采取了什么优化措施，可以减少从用户源码到部署到响应请求整个关键路径上的时间延迟，当服务结束后，会从内存中卸载函数/容器（不严谨说一个函数对应起一个容器）吗？如果过一段时间之后用户又再次进行同样的请求呢，需要重新起容器吗？此外对于横向扩展，即当请求暴增时，有没有优化措施，在其它工作节点快速部署服务，减少时间延迟？

A：大部分回答 和 回答2 比较类似，不过我们默认函数触发是没有触发不启动，可以理解为 replica 为 0，有需要的我们支持设置默认replica 为 1，还可以延长函数冷却、scaleToZero时间 ；卸载函数/容器 是这样的，每个函数 我们会启动容器，容器里只会有一个函数在运行，运行完之后才接收下一个，不会存在1个容器里同时处理 两个 甚至更多函数，这样会对用户造成比较大的延迟 和 环境污染问题。

目前没有做类似 cdn 的缓存，我理解的是 请求同一个函数，同样的参数，把结果直接返回这种，因为我们不确定用户是不是幂等接口，所以没有考虑。

请求暴增的时候，我们目前做的比较多的是限制它不能超过 limit，以防止对被人造成影响，至于函数快速启动，就是 冷启动做的优化了，目前来看一个函数 从没有代码、镜像到启动，6s 左右，还可以接受，没有更多的优化策略。


### Q5：FaaS 相比传统服务有什么解决不了的问题？

A：需要明确的是 FaaS 不是万能的钥匙，对延迟敏感、逻辑复杂的情况我们还是推荐传统 PaaS 服务；你可以把 FaaS 理解为一个通用事件触发的简单任务，可以是 报表、统计、也可以是类似 job、异步函数的任务，比如 Python 里的 celerry，有调用了就会执行动作这种比较适合 FaaS。

### Q6：CloudIDE 多个用户的函数怎么隔离？

A：我们的场景是每个用户单独拥有函数，如果你想公开函数，可以选择一个版本，进行公开，但是如果别人使用你的公开模板，这个函数就是他自己的了；CloudIDE 我们采用的是 code server，我们做的比较简单，在镜像里集成一些自己的命令比如 cli，启动的时候挂载每个用户在共享存储上的 path 到 /home/coder；用户打开界面的时候我们会用 agent 做 proxy，需要注意的是 proxy 过程中 使用 argon 设置 cookie 即可，类似 key=$argonxxxxxxxxxx。
