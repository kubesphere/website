---
title: 使用 KubeSphere 快速部署开源向量数据库 Milvus 2.0
description: 本次直播，我们将为大家介绍如何使用 KubeSphere 快速部署开源向量数据库 Milvus 2.0。
keywords: KubeSphere, Kubernetes, Milvus, 向量数据库, 人工智能
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=682551711&bvid=BV1yU4y1d7g9&cid=558192634&page=1&high_quality=1
  type: iframe
  time: 2022-03-24 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

Milvus 为解决非结构化数据的检索问题而生：海量的非结构化数据在通过深度学习网络后转化成 embedding 向量，并在向量空间内完成近似性检索，从而发现数据背后的一些特征。

Milvus 2.0 采用了相较于 Milvus 1.0 更加云原生的架构、拥有更高的灵活性和查询效率。

Milvus 已被广泛应用在推荐系统、商品搜索、智能问答机器人、视频去重等多种场景，助力了全球超过千家企业的 AI 场景落地。

相较于使用 Helm 或是 K8s Operator 的部署方式，KubeSphere 可直观地可视化部署 Milvus 集群，大大降低了用户的使用门槛。

本次直播，我们将为大家介绍如何使用 KubeSphere 快速部署开源向量数据库 Milvus 2.0。

## 讲师简介

李云梅，Zilliz DevOps 工程师。毕业于华中科技大学计算机系。加入 Zilliz 以来，致力于为开源向量数据库 Milvus 探索解决方案，帮助用户打造场景应用。目前主专注于 DevOps、Kubernetes、云原生等相关技术的工作。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/milvus0324-live.png)

## 直播时间

2022 年 03 月 24 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220324` 即可下载 PPT。

## Q & A

### Q1：能给我科普下什么是向量数据库吗？向量数据库与常规的关系型数据库以及非关系型数据库有什么区别？应用场景是啥？

A：向量数据库旨在存储、管理向量，用于向量的快速检索和相似性搜索。参考：[What is a Vector Database?](https://zilliz.com/learn/what-is-vector-database#relational-is-not-enough)。

与现有的主要用作处理结构化数据的关系型数据库不同，向量数据库在底层设计上就是为了处理由各种非结构化数据转换而来的向量而生。 

向量数据库正在越来越多的应用中使用，包括但不限于图像搜索、推荐系统、文本理解、视频分析、药物发现、股票市场分析等等。参考: [关于 Milvus](https://milvus.io/cn/docs/v2.0.x/overview.md#Milvus-%E5%BA%94%E7%94%A8%E5%9C%BA%E6%99%AF)。

### Q2：向量数据库怎么分析地质辅助油田开采呢？比如钻井数据，工况分析等，有没有其他的开采案例能分享呢？

A：目前 Milvus 没有相关开采案例，希望可以加入 Milvus 技术交流群和我们进一步讨论该场景的数据类型和具体需求，一起探索 Milvus 在新领域的应用。

### Q3：Milvus 向量数据库在生产环境部署是更推荐 K8s 还是在物理机/VM 上呢？K8s 上部署数据库这类有状态应用有哪些利弊？

A：生产环境中推荐在 K8s 上部署。 
- 利：快速扩容，容灾备份等 
- 弊：需要额外的维护 K8s 集群

### Q4：Milvus 向量数据库的使用和入门需要对 AI 算法的掌握有要求吗？

A：使用 Milvus 本身不需要。但要结合 Milvus 开发 AI 应用，需要掌握如何使用模型将非结构化数据转化为向量这一过程。目前各个领域都有许多优秀的开源模型，因此上手也很简单。

### Q5：能大概介绍一下那个 helm 配置参数，或者创建的每个 pod 的作用吗？以及数据保存在那里或者哪个盘需要挂载的比较大之类的。

A：Helm 配置参数： https://artifacthub.io/packages/helm/milvus/milvus#configuration 

Milvus 各组件作用参考文档： https://milvus.io/cn/docs/v2.0.x/four_layers.md 

Milvus 数据主要存储在 pulsar，etcd 和对象存储（Minio, S3 等）中。对象存储需要的空间比较大。

### Q6：向量数据库领域还有哪些开源或商业产品？Milvus 的优势相对其它产品体现在哪些方面？

A：pinecone, weaviate, qdrant, vespa, etc. Milvus 设计更加云原生，多云支持。

### Q7：Milvus 在内网能使用吗？有案例可以分享吗？

A：可以，离线安装参考： https://github.com/milvus-io/milvus/tree/master/deployments/offline

### Q8：index 支持 serverless 模式吗？构建索引有时候可能需要高配机器，常驻太贵了.

A：支持。

### Q9：Milvus 除了 cpu 指令集，支持 GPU 指令集吗？

A：Milvus 1.0 支持，2.0 适配还在开发中。

### Q10：Milvus 2.0 后续可以内置集成到 KubeSphere 应用商店吗？这样更方便 K8s 部署。

A：后续 Milvus 社区会和 KubeSphere 社区进一步讨论将 Milvus 集成到 KubeSphere 应用商店的可能。
