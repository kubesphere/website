---
title: qunar
description:

css: scss/case-detail.scss

section1:
  title: 图菱科技
  content: 图菱（成都）科技有限公司成立于 2020 年，主要的业务是为互联网在线模版网站提供模版输出以及系统化解决方案。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 图菱（成都）科技有限公司成立于 2020 年，创始人团队有丰富的创业经验。图菱科技主要的业务是为互联网在线模版网站提供模版输出以及系统化解决方案。目前已与多家互联网模版公司签署了正式的商务合同。我们建立了标准化的模版输出体系和人力模型，为大量客户解决批量化输出的问题。我们需要大量的优秀的设计人员加入我们团队，我们会为优秀的人员提供高于业界标准的薪资待遇。给予更广阔的发展空间。并能够锻炼设计人员的管理能力。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-1.png

    - title: 背景介绍
      contentList:
        - content: 早在 2020 年之前，公司 IT 团队规模比较小，开发还要兼职运维测试。发展初期，基本上由业务驱动开发。基于资源方面因素，所以在系统架构上首先是满足功能使用，快速开发推出产品，系统架构建设也是基于阿里云一步步从单体到多模块，再到微服务做演进。
        - content: 公司初期业务方向是印刷类商品的私人订制，满足个性化的输出的移动端应用，配套生产的供应的订单管理系统，同时涉及到旅行行业，为旅行社提供定制线路设计的 SaaS 系统，模板海报的输出系统，以及图库等旅行社所需要的素材资源。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-2.png

    - title: 业务痛点
      contentList:
        - content: 经过几年发展，业务系统服务开始增多，基础技术架构难以应付业务的快速变化，研发团队也亟需合理的开发流程来支持后续管理。我们将主要面临困难进行了梳理，大致有以下几点：
        - content: 开发环境和生产环境不一致：在项目迭代过程中，有时出现开发环境和生产环境配置不一致的问题，导致生产系统和业务问题不一致；
        - content: 无统一发布管理系统：初期由于各方面管理粗犷，缺乏自动化构建系统，版本功能完后，开发需要专门手动编译，打包上线发布，过程复杂还不好管理；
        - content: 资源协调：虽然业务系统已经采用 SpringCloud 整体微服务化，但各个服务资源的分配却无法协调。印刷服务在生成印刷文件时需要占用系统资源比普通业务系统高几倍，但又不是实时需要。之前都是专门用一台机器来做，但其实这种不太灵活。所以亟需能自动扩缩容的方案。
      image: 

    - title: 方案选型
      contentList:
        - content: 基于上述的痛点，结合自身业务系统，准备进行容器化改造。
        - content: 最开始接触 Kubernetes 时了解到官方提供的管理平台，通过调研和尝试了下后发现它只是管理 Kubernetes 容器的基本信息，并不是简单将业务放上去就能开箱即用，而涉及业务上的日志平台，监控系统，链路最终等基础运维体系还需自己去引入管理，最后还是通过朋友公司他们的一些经验建议使用一些集成的平台解决方案，类似 Rancher, KubeSphere 等。
        - content: 经过对比后决定采用 KubeSphere，主要基于以下几点：
        - content: Kubernetes 这块全新的知识体系要掌握达到生产落地学习时间成本较高，对于我们应用性企业需要的是能简单上手的产品；
        - content: Rancher 侧重于运维管理，学习成本相对较高；KubeSphere 偏向与业务应用为中心，更符合我们公司情况；
        - content: Rancher 需要自己部署 Jenkins 等插件；KubeSphere 在一些组件整合上做的较好，比如 DevOps 能做到开箱即用。而发布部署是我们目前最迫切需要的；
        - content: KubeSphere 是由国内青云科技推出的产品，使用更符合国人习惯，而且完全开源。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-5.jpeg

    - title: 实践过程
      contentList:
        - specialContent:
            text: 已有硬件资源
            level: 3
        - content: 公司整个业务基础设施构建在阿里云上，包括 ECS、数据库和 OSS 存储等。
        - content: P6 台 ECS 分布如下：
        - content: ECS-1～ECS-4：业务服务
        - content: ECS-5：测试机器。
        - content: ECS-6：公司内部项目管理，包括 Bug 管理，Git 等。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-6.jpeg
    - title:
      contentList:
        - specialContent:
            text: 主要实施步骤
            level: 3
        - content: 1. 搭建镜像仓库：在 ECS-6 上，搭建 Harbor 仓库。提供公司业务容器应用的私有镜像管理工具。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-7.png
    - title:
      contentList:
        - content: 2. 构建业务系统镜像：对每个业务服务添加相应配置文件 Dockerfile, 用于平台流水线发布时构建镜像。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-8.png
    - title:
      contentList:
        - content: 3. 准备系统环境
        - content: 系统环境主要是 Kubernetes 搭建，这里主要考虑存储和网络选型。
        - content: 存储：最开始考虑使用 Ceph，搭建 demo 使用后发现，如果和 Kubernetes 搭建于同一集群环境，对资源还是有一定消耗。基于目前业务设计（基本上没有有状态服务需要涉及）、以及当前业务体量，最终采用相对轻量的 NFS 共享盘方式。
        - content: 网络：Kubernetes 主流的网络插件目前主要有 Calico 和 Flannel，我们参考社区的经验，最终选择了 Calico。
      image: 
    - title:
      contentList:
        - content: 4. 安装 KubeSphere 平台
        - content: KubeSphere 平台是按照官网提供的文档基于 Kubernetes 搭建的。我们先最小化搭建，然后在使用的过程中再根据需要开启一些所需组件。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-9.png
    - title:
      contentList:
        - content: KubeSphere 平台在插件安装这块的体验比较好，只需要对配置文件相应做调整就能很容易实现。比如日志平台默认由 Elasticsearch 做存储，但我们已经自建有 Elasticsearch 集群，只需要调整 ks-installer 配置。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-10.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-11.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-12.png
    - title:
      contentList:
        - specialContent:
            text: DevOps 实践
            level: 3
        - content: CI/CD 发布流程是这次改造的重点。
        - content: DevOps 项目是 KubeSphere 中的一个可插拔组件，提供了基于 Jenkins 的 CI/CD 流水线，支持自动化工作流，包括 Binary-to-Image (B2I) 和 Source-to-Image (S2I) 等。
        - content: KubeSphere DevOps 提供了开箱即用的 CI/CD 流水线，并通过图形化方式降低了学习门槛，我们就直接对官网的示例进行改造，采用配置文件基于流水线 Pipleline 构建和发布。
      image: 
    - title:
      contentList:
        - content: 1. 环境区分：我们的环境对应的是 KubeSphere 中的项目，通过在流水线中指定对应配置文件区分。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-13.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-14.png
    - title:
      contentList:
        - content: 2. 前端 Node 环境指定：由于 KubeSphere 平台默认提供的 Node.js 版本和我们所需版本有差异，所以结合自己经验对平台 Node.js 环境通过 Jenkins 插件方式进行了修改，后续流水线中指定对应版本即可。这种方式稍显麻烦，可能通过在流水线中指定镜像应该也能满足，但还未实践。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-15.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-16.png
    - title:
      contentList:   
        - content: 日志采集这块，KubeSphere 平台提供了 FluentBit Operator，在集群所有节点以 DaemonSet 运行，并统一部署配置了 Fluent Bit，同时查询方式能满足现有业务。只有 Elasticsearch 我们对接了自己的环境。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-17.png

    - type: 1
      contentList:
        - content: 降低了企业容器化改造门槛以及运维成本
        - content: 提高了产品发布效率
        - content: 增强了团队对整个产品系统的认识度
  
    - title: 实践效果
      contentList:
        - content: 历时差不多一个月时间完成基本业务系统容器化。
        - content: 容器化后开发流程比之前有显著改善：
        - content: 我们直接通过 KubeSphere 不同企业空间下的项目(Namespace)来进行开发、测试与生产环境的隔离以及通过不同角色赋予不同企业空间的权限做到细粒度的权限管理；
        - content: 版本上线基于 Kubernetes 的副本以及探针来控制，基本上能在不影响业务情况下做到随时发布；
        - content: 公司基本架构走向自动流程化。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-18.png

    - type: 2
      content: 'KubeSphere 帮助我们轻松实现业务系统容器化，在业务系统的运维上更加从容。'
      author: '图菱科技'

    - title: 未来展望
      contentList:
        - content: 目前在服务网格这块还在探索阶段，服务治理（比如：监控指标，微服务流控）还是处于试用体验阶段。
        - content: 后续随着业务复杂度提升后，这块还是希望能快速落地。尽量在 KubeSphere 平台中实现服务治理，做到业务与技术分离。
      image: https://pek3b.qingstor.com/kubesphere-community/images/tuling-21.png

  rightPart:
    icon: /images/case/logo-turing.png
    list:
      - title: 行业
        content: 互联网设计
      - title: 地点
        content: 中国
      - title: 云类型
        content: 公有云
      - title: 挑战
        content: 统一的产品发布运维管理
      - title: 采用功能
        content: DevOps、日志、监控
---
