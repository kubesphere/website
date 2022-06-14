---
title: 初探 KubeSphere x Apache Pulsar —— 打造云原生分布式消息流平台
description: 本次分享打算介绍 Apache Pulsar 的历史由来以及架构设计简析和特点，并详细介绍 pub/sub 模型和社区典型案例及在 KubeSphere 上的部署实战。
keywords: KubeSphere, Kubernetes, Apache Pulsar
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=727291246&bvid=BV1xS4y1i7Yx&cid=742553663&page=1&high_quality=1
  type: iframe
  time: 2022-06-09 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

Apache Pulsar 是新一代云原生分布式消息队列，其独有的存储计算分离架构和故障自动转移等特性更适合当前云原生时代。本次分享打算介绍 Apache Pulsar 的历史由来以及架构设计简析和特点，并详细介绍 pub/sub 模型和社区典型案例及在 KubeSphere 上的部署实战。

## 讲师简介

刘德志，曾任职腾讯，负责腾讯计费平台架构与技术方案实施，并主导了腾讯云 TDMQ for Pulsar 产品落地实施，拥有丰富的消息中间件开发与运维经验。活跃于最新一代云原生消息中间件开源项目 Apache Pulsar 社区，对消息和流系统拥有独特的洞察与思考、以及丰富的行业实践沉淀。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar0609-live.png)

## 直播时间

2022 年 06 月 09 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220609` 即可下载 PPT。

## Q & A

### Q1：Pulsar 是如何使用分层分片的架构来解决使用和运维的痛点的？

A：Apache Pulsar 采用的计算存储分离的架构，首先可以更好的利用资源，根据计算层和存储层对资源的要求不同灵活搭配，以及使用情况进行细粒度资源调整。其次分片模式，突破以往 Topic 数据与机器强绑定的模式，避免了数据分布不均衡和扩容时带来大量数据迁移再平衡的问题，极大提升运维体验。

### Q2：Pulsar 能够满足大数据计算框架中的批流一体的存储需求吗？

A：本身Apache Pulsar 采用 Bookeeper 提供了流数据的存储，同时 Pulsar 提供了分级存储能力，可以将 Bookeeper 里的数据卸载到更低廉的存储介质中，例如 HDFS、S3 等，并且提供统一的读取接口，这样基于 Pulsar 能够提供完整的业务数据， 因此像大数据计算框架 Flink 可以利用 pulsar-flink-connector 实现批流计算。

### Q3：Pulsar 和 Spark、Flink 以及批处理中的 Presto 和 Hive 结合有没有实践案例？

A：Bigo 基于 Pulsar 和 Flink 构建了日百亿量级实时数仓，覆盖实时指标计算、用户特征实时更新等场景。智联招聘基于 Pulsar 和 Presto 构建了数据分析平台，支撑了内部报表统计和数据分析。

### Q4：Apache Pulsar 如何保证消息不丢不重？

A：当 broker 接收到写入请求时，会将数据写入到多个 bookie 节点中，也就是多副本保证，bookie 节点收到数据并且持久化成功后返回给 broker 成功应答，当收到一半以上节点的成功应答后，返回给客户端成功，代表该数据写入成功。在可靠性方面，bookie 提供机架感知能力和集群间的跨地域复制能里，来加强数据的可靠性。

消息不重体现在两个方面，生产端的消息不重，对于单分区 Topic 而言，生产消息时可以指定递增的 sequenceId，broker 端根据当前的 sequenceId 和写入的 sequenceId 进行比较，如果小小于当前的 sequenceId 则认为已写入，需要去重。消费端的不重相对要复杂些，因为一个消息是否需要再次消费，取决于业务逻辑处理的情况和 ACK 的时机，例如消费端拉取到消息后，业务逻辑处理超时了，或者业务逻辑处理成功后消费端异常退出了，这种情况一般通过业务幂等来解决 ，当然也可以通过事务来处理。

### Q5：Apache Pulsar 的协议有没有弱点？

A：Apache Pulsar 自身有一套私有化协议，从性能上来看，对于消息体内容采用二进制透传的模式保证性能；从安全上来看，提供了丰富的身份认证和操作鉴权能力；从扩展性上来看，抽象了协议接口，可以方便集成其它协议，目前已支持 Kafka、AMDP、MQTT、RocketMQ 等协议。

### Q6：StreamNative 花费了如此多的时间与精力在 Pulsar 与其社区生态上，是否会造成 Pulsar 与商业公司绑定，削弱项目的开源协作属性呢？

A：Apache Pulsar 项目是 Apache 基金会顶级项目，本身项目的代码所有权、品牌和商标等都属于 Apache 软件基金会，日常由 PMC 管理，StreamNative 组织举办的 Pulsar Summit 、Pulsar Hackathon 每次举办都是经过 PMC 审核通过，组委会成员也要遵循多样性原则进行；日常 Pulsar 重要功能、版本发布，也都是经过社区严格的开发流程、投票流程进行。最根本的一点是 Apache 基金会的项目贡献，都是以个人名义贡献，贡献者只代表个人，这点和其他基金会有区别。 当前 Apache 软件基金会项目的运行规则和机制都保证了项目的独立性。