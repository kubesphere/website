---
title: Yatai —— 云原生上的 MLOps 平台
description: 简要介绍 MLOps 的现状和困境以及 BentoML 是如何思考和解决这些问题的，进一步引出 Yatai 如何配合 BentoML 把模型部署带进云原生领域。
keywords: KubeSphere, Kubernetes, MLOps, Yatai, BentoML
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=810999783&bvid=BV1J34y1e7Ys&cid=582153759&page=1&high_quality=1
  type: iframe
  time: 2022-04-21 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

简要介绍 MLOps 的现状和困境以及 BentoML 是如何思考和解决这些问题的，进一步引出 Yatai 如何配合 BentoML 把模型部署带进云原生领域。

## 讲师简介

管锡鹏（yetone），曾就职于豆瓣、旷视，现在在 BentoML 担任全栈开发工程师。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/yatai0421-live.png)

## 直播时间

2022 年 04 月 21 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220421` 即可下载 PPT。

## Q & A

### Q1：模型是嵌套在镜像里还是在远端存储呢，模型的下载延迟怎么处理？

A：模型会存两份，一份是打成 tar 包存储在 s3 存储上，可以随时随地用 BentoML CLI 把模型 pull 到本地，方便用户分享模型。另外一份是编译成 docker image 然后 push 到 docker registry，用于结合 csi-driver-image-populator 优化模型的下载和存储，实现同一个模型在同一个节点上只会被下载和存储一次的目的。

### Q2. 模型能否部署到边缘端（如 KubeEdge）？

A：可以的，Yatai 并不影响 pod 更高级的调度策略，在创建部署的时候可以自由地给 runner 加上特定的 label、node selector、node affinity 等控制其调度的信息。

### Q3：Yatai 是否开源？

A：已开源，GitHub Repo 地址:  https://github.com/bentoml/Yatai

### Q4：Yatai 可以接入 Kubeflow 吗？

A：可以的。准确来说可以用 BentoML 把 Kubeflow 生产出来的 model 以及相关业务代码打包成 bento，然后在 Yatai 中管理和部署。

### Q5：autoscaling 支持 scale 到 0 吗？怎么处理冷启动的问题，假如每一个pod都不在同一个节点上（高可用），用镜像是不是就无法优化了？

A：默认的 autoscaler 使用的是自带的 HPA，所以不支持 sacle 到 0，不过可以灵活替换成其他第三方的 autoscaler。

### Q6：自动调优调整的是谁的参数？模型的还是运行框架的（tf、pytorch）？

A：batch size。

### Q7：对 GPU 共享有支持吗？

A：暂不支持 virtual GPU。

### Q8：模型的可观测性有什么支持？比如 log 什么的。

A：prediction log 后续会有支持，届时可以支持流量重放，新旧模型指标对比等特性。

### Q9：链路追踪有能看的 demo 嘛？

A：抱歉，暂时还没有链路追踪的 demo，因为 Tracing 组件还在开发当中。

### Q10：模型部署上线后，可以拿来类似于 postman 进行调试吗？

A：可以的，我们会为每个 BentoDeployment 生成一个域名并创建 ingress，可以随时通过这个域名进行访问。

### Q11：老师能讲讲模型训练有哪些好用的工具吗，就是 Yatai 的上游？

A：BentoML 不关心模型的训练，只关心 model serving。

### Q12：模型更新也只能通过镜像更新吗，能介绍一下模型更新的流程吗？

A：在开发环境中更新模型后，在 bento project 中使用新的模型，然后通过 BentoML CLI 打包 bento 并 push bento 到 Yatai 中，届时就可以在 Yatai 中部署此 bento。

### Q13：老师作为全栈工程师，平时是工程多一点，还是 AI 算法研究多一点？

A：主要是工程方面到开发工作，前端、后端和云原生。

### Q14：老师有没有联系方式？

A： https://github.com/yetone。

### Q15：支持复杂的 workflow 吗？

A：后续会增加 webhook 的功能，方便接入到其他的 workflow 到产品中。

### Q16：Yatai 部署了一个模型服务，对模型服务进行访问，支持 http 或者 rpc 的 request 和 response 的日志采集嘛？

A：prediction log 在后续的支持计划当中，会保存每次请求到 request 和 response，方便流量重放和模型对比。

###  Q17：有支持 canary 吗？

A：暂不支持，后续会集成 Argo CD。
