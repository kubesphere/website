---
title: alphaflow
description:

css: scss/case-detail.scss

section1:
  title:  杭州微宏科技
  content: 杭州微宏科技是专注于业务流程管理和自动化（BPM&BPA）软件研发和解决方案供应商。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 杭州微宏科技有限公司于 2012 年成立，专注于业务流程管理和自动化(BPM&BPA)软件研发和解决方案供应商。创始团队毕业于浙江大学、清华大学、美国 Rice 大学和 University of Texas 等海内外知名高校，曾服务于世界知名软件公司和 500 强企业。
        - content: 微宏已为超过 1000 家的国内国外大中型企业和政府提供了从流程规划设计、流程运行、流程自动化、流程集成、流程挖掘的全生命周期流程软件产品和解决方案，客户分布于制造、金融、电器电子、医药、服务业、高科技和政府等十多个行业。
        - content: 微宏科技是国家高新技术企业、浙江省专精特新企业，通过了 ISO9001 质量管理体系认证、CMMI 认证、ISO27001 信息安全管理体系认证。获赛迪“2021 年智能 BPM 领域最佳产品”奖、“2021-2022 业务流程管理&自动化领域优秀产品”奖、中国软件网“2021 年度智能流程平台优秀产品奖”、“2022 应龙杯最佳 BPA 业务流程自动化产品奖、“2022 数字政府建设领军企业”奖，连续 2 年上榜浙江省软件协会“浙江省软件核心竞争力企业（成长型）”榜单。
      image: https://pek3b.qingstor.com/kubesphere-community/images/1696663218887.jpg

    - title: 背景介绍
      contentList:
        - content: 公司在自建 IDC 机房的物理服务器上搭建了 Kubernetes 集群，并使用 Kuboard 作为集群管理工具。研发环境使用这些集群资源进行开发和测试。而 CI/CD 流水线则通过同样部署在物理服务器上的 Jenkins 来实现代码编译、镜像构建等步骤，最终以手动方式发布服务。
        - content: 这种模式下存在一些问题：缺乏统一的服务编排和管理，集群和服务之间缺乏联动，CI/CD 流程自动化程度不足，部署发布需要手动操作，日志和监控数据分散，缺少统一可视化平台等。这种传统研发模式已经难以适应企业对敏捷开发和自动化交付的需求。需要进一步融合云原生技术，实现基础设施的智能化和研发流程的端到端自动化。
      image: 

    - title: 选型
      contentList:
        - content: 作为 DevOps 运维团队，我们需要提供自助化的综合运维平台。在开源平台选型时，公司考虑到以下两点最终选择了 KubeSphere：
        - content: 1. KubeSphere 屏蔽了 Kubernetes 的复杂性，通过 GUI 来简化集群管理，降低学习成本。
        - content: 2. KubeSphere 整合并扩展了多种优秀开源项目，如 Prometheus、Jenkins 等，提供了统一的入口，实现了全栈的 DevOps 能力。
        - content: 相比其他平台，KubeSphere 更好地规避了 Kubernetes 本身的复杂性，也减少了集成各类开源工具的工作量。这使得我们可以更专注于运维自动化与自助化平台建设，而不需要单独管理底层基础架构与服务。因此 KubeSphere 成为我们满足公司需求的最佳选择。
      image: 

    - type: 1
      contentList:
        - content: 应用 CI/CD 流水线自动化构建，极大提升部署效率
        - content: 应用商店统一包管理，使应用发布和使用更便捷
        - content: 集群管理和监控可视化，快速定位和解决问题

    - title: 实践过程
      contentList:
        - specialContent:
            text: 硬件资源
            level: 3
        - content: 研发环境：IDC 机房 40 台虚拟机，自建 K8s+KubeSphere 集群。
        - content: 生产环境：阿里云 ACK 集群 12 节点。
        - content: 
      image: 
    - title:
      contentList:
        - specialContent:
            text: 存储方案
            level: 3
        - content: 使用 JuiceFS 作为分布式文件层，搭配 MinIO 作为对象存储接入层。
        - content: JuiceFS：提供分布式高性能文件存储。使用近似原子开源存储引擎如 LevelDB。
        - content: MinIO：开源对象存储兼容 AWS S3 API，作为 JuiceFS 对象存储接口。
        - content: 整合方案优点：
        - content: 简单易用，提供类 S3 对象存储 API；
        - content: 高性能、弹性，通过 JuiceFS 实现；
        - content: 低成本，可以使用廉价的云硬盘或 NAS 作为后端存储。
      image: https://pek3b.qingstor.com/kubesphere-community/images/juicefs-arch-52477e7677b23c870b72f08bb28c7ceb.svg
    - title:
      contentList:
        - specialContent:
            text: DevOps 持续集成部署
            level: 3
        - content: 公司以前研发环境中的 CI/CD 主要依靠单节点 Jenkins 实现，存在许多问题：
        - content: 开发人员频繁更新代码，多环境切换导致构建部署经常出错；
        - content: Jenkins 资源有限，构建效率较低。
        - content: 为解决这些问题，我们切换到了 KubeSphere 平台，利用其整合的 DevOps 功能改进了 CI/CD 流程：
        - content: KubeSphere 提供了可视化流水线编排，简化了复杂流程的搭建；
        - content: 基于 Kubernetes 的弹性资源，可以动态扩展 Jenkins executor 提升构建效率；
        - content: 标准化和最佳实践减少了环境配置错误，提升了部署稳定性。
        - content: 通过 KubeSphere 的 DevOps 解决方案，我们改善了 CI/CD 流程，提升了研发环境的效率和质量。
      image: https://pek3b.qingstor.com/kubesphere-community/images/123213213123.png
    - title:
      contentList:
        - specialContent:
            text: 日志及监控
            level: 3
        - content: 公司使用自建的 ELK 栈采集日志数据，并使用 KubeSphere 平台内置的 Prometheus 作为监控方案，然后通过 Grafana 来可视化展示监控数据。
      image: https://pek3b.qingstor.com/kubesphere-community/images/1696481910520.png

    - title: 使用效果
      contentList:
        - specialContent:
            text: CI/CD
            level: 3
        - content: 公司使用 KubeSphere 平台的 DevOps 功能，更好地满足了大规模并发构建流水线的需求。
      image: https://pek3b.qingstor.com/kubesphere-community/images/alphflow-x.png
    - title:
      contentList:
        - specialContent:
            text: 存储方案
            level: 3
        - content: 公司在探索云原生过程中，发现使用 Helm 可以标准化地进行应用发布。KubeSphere 天生具备应用商店功能，将 Helm 的能力可视化，大大降低了开发人员的学习成本。
      image: https://pek3b.qingstor.com/kubesphere-community/images/alphflow-xy.png
    
    - type: 2
      content: '使用 KubeSphere 之后，我们实现了应用交付自动化，工程效率显著提升。'
      author: '微宏科技'

    - title: 未来规划
      contentList:
        - content: 目前我们已完成业务的全面容器化，并基于 KubeSphere 平台的能力进行云原生架构的迁移。KubeSphere 为我们提供了 GUI 化的 Kubernetes 集群管理、CI/CD 流水线、服务网格治理等功能，简化了云原生技术的运用。
        - content: 在平台助力下，我们的研发和运维效率显著提升。我们相信运用 KubeSphere 的云原生平台，必将为公司下一步业务增长提供坚实基础。我们将持续扩展业务场景，丰富平台功能，并探索基于 KubeSphere 的多云和边缘计算等新型架构，为客户带来更出色的产品体验。
      image: 

  rightPart:
    icon: /images/case/logo-alphaflow.png
    list:
      - title: 行业
        content: BPA、BPM
      - title: 地点
        content: 杭州
      - title: 云类型
        content: 公有云，私有云
      - title: 挑战
        content: CI/CD
      - title: 采用功能
        content: DevOps、监控、日志
---
