---
title: "service mesh"
layout: "scenario"

css: "scss/scenario.scss"

section1:
  title: KubeSphere 基于 Istio 微服务框架提供可视化的微服务治理功能，全面提升用户体验
  content: 如果您在 Kubernetes 上运行和伸缩微服务，您可以为您的分布式系统配置基于 Istio 的微服务治理功能。KubeSphere 提供统一的操作界面，便于您集成并管理各类工具，包括 Istio、Envoy 和 Jaeger 等。
  image: /images/service-mesh/banner.jpg

image: /images/service-mesh/service-mesh.jpg
bg: /images/service-mesh/28.svg

section2:
  title: KubeSphere 独特的微服务治理功能
  list:
    - title: 流量治理
      image: /images/service-mesh/traffic-management.png
      summary:
      contentList:
        - content: <span>金丝雀发布</span>提供灵活的灰度策略，将流量按照所配置的比例转发至当前不同的灰度版本
        - content: <span>蓝绿部署</span>支持零宕机部署，让应用程序可以在独立的环境中测试新版本的功能和特性
        - content: <span>流量镜像</span>模拟生产环境，将实时流量的副本发送给被镜像的服务
        - content: <span>熔断机制</span>支持为服务设置对单个主机的调用限制

    - title: 虚拟化
      image: /images/service-mesh/visualization.png
      summary: 可观测性有助于了解云原生微服务之间的关系。KubeSphere 支持可视化界面，直接地呈现微服务之间的拓扑关系，并提供细粒度的监控数据。
      contentList:

    - title: 分布式链路追踪
      image: /images/service-mesh/distributed-tracing.png
      summary: KubeSphere 基于 Jaeger 让用户追踪服务之间的通讯，以虚拟化的方式使用户更深入地了解请求延迟、性能瓶颈、序列化和并行调用等。
      contentList:

section3:
  title: 观看 KubeSphere 微服务治理工作流操作演示
  videoLink: https://www.youtube.com/embed/EkGWtwcsdE4
  content: 想自己动手体验实际操作？
  btnContent: 开始动手实验
  link: docs/pluggable-components/service-mesh/
  bgLeft: /images/service-mesh/3-2.svg
  bgRight: /images/service-mesh/3.svg
---
