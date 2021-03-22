---
title: 安畅网络
description:

css: scss/case-detail.scss

section1:
  title: 安畅网络
  content: 安畅网络 (https://www.anchnet.com/) 是中国市场领先的下一代云托管服务商（Cloud MSP）。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 安畅以客户需求驱动，以云计算为底座，面向企业客户提供云原生技术服务和数字化解决方案，帮助客户上好云、管好云和用好云（为客户构建下一代云基础设施和技术中台、提供智能化全托管云运维和管理服务、开发现代化云原生应用），致力于成为 IT 新生态和产业互联网的连接器。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180506.png

    - title: 迁移平台
      contentList:
        - content: SmartAnt 是一款一站式、轻量级的迁移平台，能帮助用户快速将业务迁移上云，摆脱繁琐的迁移上云过程。通过可视化界面，一键迁移，支持主机/数据库/对象存储等迁移类型，从根本上颠覆传统云迁移所带来的困扰。
      image:

    - title: 基础架构演进
      contentList:
        - content: 一路走来，迁移工具从单模块单体，到多模块单体，再到微服务架构，业务架构在顺应分布式的微服务技术潮流进行演进；同时，我们的基础设施架构也在不断变更，从传统的 IDC 物理机房服务器，到云服务器的虚拟化，利用公有云资源提供的负载均衡器及其他云产品完成高可用架构，再到以 Docker 和 Kubernetes 为基础的云原生架构，我们为了响应市场的快速需求而不断进行技术革新与演进。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180616.png

    - title: 基础设施高可用
      contentList:
        - content: 我们直接采用了开源的 KubeSphere 容器平台，使用 KubeSphere Installer 一键部署了高可用架构的 Kubernetes 集群，配合我们在公有云和私有云的负载均衡器来实现高可用架构。通过 KubeSphere 内置的集群状态监控面板，实现了对节点的资源用量进行可视化管理。即使在安装后遇到节点资源不足，也能非常方便地通过 Installer 按需新增 Node 节点，免去了 Kubernetes 基础设施部署的复杂性。
        - content: 存储利用云盘自建 Ceph 集群，KubeSphere 提供丰富的存储插件，快速方便地继承到 Kubernetes 的 StorageClass中，为应用提供持久化的数据存储，并且在界面也可以非常方便地对 Ceph RBD 存储卷进行可视化管理。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180633.png

    - type: 1
      contentList:
        - content: 流畅的用户体验
        - content: 支持跨平台
        - content: 高可用

    - title: 对不同环境的权限进行管控
      contentList:
        - content: 由于 Kubesphere 对原生 Kubernetes 的 RBAC 基于企业空间层（Workspace）的权限管控设计，以及细粒度的基于用户与角色的权限分配，我们直接通过 KubeSphere 不同企业空间下的项目（Namespace）来进行开发、测试与生产环境的隔离。如下图，其中 Dev 环境为业务开发环境，开发人员授权可以登录容器终端查看容器日志等，test 环境为测试人员开放权限，方便测试人员进行业务功能的测试，prod 环境为线上正式环境，只有集群管理员可以登录维护。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180719.png

    - title: CI/CD 流水线的落地
      contentList:
        - content: 目前针对 Dev 环境，为了方便开发人员进行协同开发，我们直接使用 Gitalb CI，利用 GitOPS 理念，端到端的开发自动部署。而正式环境则使用 KubeSphere 内置的 DevOps 流水线，天然继承，无需多余扩张即可实现应用的快速发布上线。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180737.png

    - title: 使用 Argo CD, 期待 Tekton
      contentList:
        - content: KubeSphere 的 Devops 流水线，WEB 简单配置即可生成 Jenkinsfile，快捷方便。另外，我们有一部分应用也使用了 Argo CD ，在未来也计划尝试 Tekton 等。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180838.png

    - type: 2
      content: 'KubeSphere 提供了一整套云原生解决方案，包括高可用基础设施部署、CI/CD、服务治理、访问控制、监控、日志和告警。'
      author: '安畅网络'

    - title: 服务治理
      contentList:
        - content: 针对南北流量，利用开源 Kong 提供 API 网关，基础设施下沉到 Kubernetes 内，提供流量控制、黑白名单、认证鉴权等功能。在微服务间的东西流量管理上，我们使用了 KubeSphere 内置的 Istio 来实现微服务治理，帮助我们对 SmartAnt 平台满足了负载均衡、流量监控、链路追踪、熔断降级等非常典型的应用场景。可喜的是 KubeSphere 是一个优秀的服务治理平台，基于其一键部署的特点，只需将自己的业务应用制作成 Helm 的 charts 来提交到平台上。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611182110.png

    - title: 灰度上线
      contentList:
        - content: 对于频繁更新的应用，灰度上线是必不可少的功能。基于 KubeSphere 内置的 Istio 提供的金丝雀发布的特性，我们可以非常方便地在 KubeSphere 控制台通过拖拽的方式对不同版本的应用组件的进行灰度发布上线。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611182140.png

    - title: 监控与告警
      contentList:
        - content: 不同级别的监控支持不同类型的告警。目前，集群维度的监控我们使用了 KubeSphere 内置的监控，希望 KubeSphere 在后续版本可以提供更多告警方式。
        - content: 其他功能，如日志管理、app 发布等，都有利于我们云原生 app 的快速转型。
      image: 

    - title: 拥抱开源，共话云原生
      contentList:
        - content: 目前 SmartAnt 的 SaaS 版本完全免费供企业及个人使用，私有定制化版本目前已支持 Openstack 无缝迁移及 Any to image，最终可以利用将镜像导入其他私有或公有平台，另外公司致力于多云管理，自研 SmartOps 云管平台，助力企业更好的进行多云管理。
        - content: KubeSphere 帮助我们打造了 SmartAnt 云原生迁移平台，我们能够把更多的精力放在迁移平台的业务逻辑开发，提供从基础设施高可用部署、CI/CD、服务治理、权限管控、监控日志告警等一整套完善的云原生解决方案，并且 KubeSphere 是完全开源的，社区也非常活跃，在这里可以遇到志同道合的友人，共同探讨适合自己的业务转型的云原生之路。
      image:

  rightPart:
    icon: /images/case/section6-anchnet.jpg
    list:
      - title: 行业
        content: 云计算
      - title: 地点
        content: 中国
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 高可用、微服务迁移、一致性
      - title: 采用功能
        content: DevOps、灰度发布、监控和告警

---
