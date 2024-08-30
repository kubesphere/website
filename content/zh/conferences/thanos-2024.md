---
title: '超越基础：朝着使 Thanos 达到生产就绪状态的方向前进'
author: '霍秉杰，张军豪'
createTime: '2024-08-23'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2024-thanos.png'
---

## 议题信息

### 议题简介

作为最受欢迎和强大的 Prometheus 长期存储项目之一，Thanos 被社区广泛采用。但要在生产环境中使用 Thanos，仍然需要自动化许多第二天的运维工作。

在这次演讲中，KubeSphere 的维护者将分享他们在生产环境中使用和维护 Thanos 的经验，包括：

- 所有 Thanos 组件的 Kubernetes 本地定义
- 数据摄入、规则评估、压缩的租户隔离
- 基于租户的 Thanos Ingester、Ruler 和 Compactor 的自动扩展机制
- Thanos 存储的基于时间的分区
- 基于租户的数据生命周期管理
- 全局规则分片机制，用于处理大量录制规则和警报规则评估工作负载
- 用于读写的网关和代理机制，带有租户访问控制
- 网关的 basic_auth、内置查询 UI 以及外部远程写入和查询支持
- Thanos 组件之间的 tls 支持
- 三层配置管理

### 分享者简介

- 霍秉杰：KubeSphere 可观测性、边缘计算和 Serverless 团队负责人，Fluent Operator 和 OpenFunction 项目的创始人，还是多个可观测性开源项目包括 Kube-Events、Notification Manager 等的作者，热爱云原生技术，并贡献过 KEDA、Prometheus Operator、Thanos、Loki 和 Falco 等知名开源项目。

- 张军豪：青云科技高级软件工程师，负责容器平台监控、报警等云原生服务的研发。拥有多年行业经验，曾就职于瑞幸咖啡、海康威视等公司。对 Kubernetes、Prometheus、Thanos、容器网络等云原生技术有深入的了解，在云化容器产品的研发、实施和运维方面拥有丰富的经验。

### 视频回放

<video id="videoPlayer" controls="" preload="true">
  <source src="https://kubesphere-community.pek3b.qingstor.com/videos/Towards-Making-Thanos-Production-Ready.mp4" type="video/mp4">
</video>

### PPT 下载

关注公众号【KubeSphere云原生】，后台回复关键词 `20240823` 即可获取 PPT 下载链接。