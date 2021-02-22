---
title: Aqara
description:

css: scss/case-detail.scss

section1:
  title: Aqara
  content: Aqara 隶属于绿米联创科技有限公司，总部位于中国深圳。目前，我们在全国拥有 300 多家 Aqara 服务提供商和 300 多家智能家居展厅。我们的用户包括学生、家庭、工作人员和遍布 158 个国家的跨国公司。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 五年前，我们开始着手创造一种不同的智能家居解决方案，一种可靠、环保的解决方案，适用于任何想改善家居、简化日常生活的人。我们相信，建设一个智能家居不应该复杂或成本高昂，这就是为什么我们有 200 多名 Aqara 研发团队成员不知疲倦地工作，以我们可以负担得起的成本，制造最创新和最高质量的产品。
      image: /images/case/aqara-1.jpg

    - title: 背景
      contentList:
        - content: 从传统运维到容器化的 Docker Swarm 编排，从 Docker Swarm 转向 Kubernetes，然后在 Kubernetes 运行 SpringCloud 微服务全家桶，到最终拥抱 KubeSphere，并基于 KubeSphere 打造绿米联创自己的物联网微服务平台，绿米联创已在生产环境中稳定运行 KubeSphere 和 Kubernetes 半年多时间，积累了丰富的微服务应用开发以及应用平台运维的经验。本文由深圳绿米联创科技有限公司的运维工程师魏恒军与徐洋冰投稿，图片素材来自 Aqara 官网 (https://www.aqara.com/)。
      image:

    - title: 从传统运维到容器技术
      contentList:
        - content: 一入运维深似海，魏恒军作为一名多年工作经验的资深运维工程师，从最初的扛机器上机房，在工作中生疏的操作着网线钳，麻木地安装着操作系统，费力地部署应用程序和调试着应用服务，以及在那黑夜因一连串告警惊醒，永远感觉自己是个伟大消防员。
        - content: 技术的快速迭代更新，迎来了微服务，迎来了虚拟化技术，也迎来了容器化与云原生技术。运维也从最初的人肉运维发展到脚本运维，再到平台运维，最后到现在的容器运维。本人运维过的机器，不知不觉也从个人维护几十台到现在的近千台服务器，传统的应用部署方式，每次迭代一次，都需要花费大量的时间去准备配置文件、操作注意事项、数据库等等，然后再经过一群人层层审批，再发到线上，这期间已经过了半个月，在这个互联网比速度的时代，显然这种传统方式劣势非常明显，而容器应时势而生。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200514144227.png

    - title: 使用 Docker Swarm 搭建容器编排系统
      contentList:
        - content: 传统部署应用方式，资源利用率非常低，时长让老板们本狠狠地咬牙切齿。在这种情况下，本人在 2017 年开始接触容器，尝试着在公司上开发与测试环境。当时直接给公司开发、测试环境的资源利用率提高了 50%。到 2018 年，开始在生产环境用 Docker Swarm 排编容器，更显著提高了资源的利用率。
        - content: 从命令行到脚本化，最后到平台化，一路走来步步艰辛。当刚开始加入绿米大家庭，发现绿米运维还处在原始野人阶段，回顾四周，我只能屡起袖子顶着压力分析情况，发现绿米的微服务架构 80% 以上都是偏内存型服务，资源利用率非常低，尤其是 CPU、磁盘存储，十分让人懊恼。且迭代速度也不尽人意。静心思静，决定大改这种状况。从持续集成开始、Jenkins、Harbor 搭建，到测试环境 Docker Swarm 排编。这大大改善了测试环境的交付速度以及交付质量，但慢慢发现，业务量曾涨速度太快，Docker Swarm 排编劣势明显：
        - content: 1. 跨平台支持效果差；
        - content: 2. 业务量访问高峰期的时候，内部 Service 通信的时候就会出现超时的问题。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200514150210.png

    - type: 1
      contentList:
        - content: 提高资源利用率
        - content: 支持跨平台
        - content: 高效的容器编排

    - title: 从 Docker Swarm 全面转向 Kubernetes
      contentList:
        - content: 三架马车时代已是过去式，Kubernetes 击败 Docker Swarm 和 Mesos 成为容器编排领域的事实标准。因此，我们的业务架构从 Docker Swarm 全面转向 Kubernetes。选择 Kubernetes 几年前就在心里扎根，尤其是近来需要运维近千台机器的时候，一个运维友好与统一的容器云平台成为了我们基于 kubernetes 大规模落地云原生微服务应用的刚需。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200514002430.png

    - title: 开源容器平台选型：拥抱 KubeSphere
      contentList:
        - content: 但是对于原生安装与运维 Kubernetes 还是借助第三方开源方案，我们经过反复的琢磨，最终选择了使用第三方开源项目。看来看去 Rancher 和 KubeSphere 成了考虑的选型。
        - content: KubeSphere 是由青云 QingCloud 发起并联合多个企业共同参与开发的开源项目。对比 Rancher 和 KubeSphere，后者不仅有清爽的操作界面，向导式的资源创建方式，完全以应用为中心，更倾向于 Kubernetes 集群资源的管理，提供优雅的 API 接口，并且在 Kubernetes 之上集成与包装了我们运维开发常用的功能组件，例如 Jenkins、Harbor、Promethues、Apache SkyWalking，还支持在任何基础设施环境部署，所以我们毫不犹豫的选择了 KubeSphere 容器平台。
        - content: KubeSphere 跨多云平台的兼容、以及支持多插件的选择，在使用过程中加深了我们对 Kubernetes 各个模块的理解、推进了我们对生产环境落地 Kubernetes 容器编排的步伐。并且，KubeSphere 解放了我们运维日常面临的重复的工作，减低了应用的整体维护成本。是运维的一把利器，是互联网公司的一道福音。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200620002443.png


    - title: 绿米物联网微服务平台部署架构
      contentList:
        - content: 目前公司主要是在腾讯云上用 7 台服务器来构建集群。
        - content: 目前所有的无状态的服务都运行在 KubeSphere，有状态的数据存储类服务，我们使用云上的 Redis、HBase、Flink、Elasticsearch、MySQL 等集群服务。
        - content: 截止目前为止已经运行半年多且无大问题出现，这推动我们计划近期把公司开发、测试、生产环境中所有的有状态和无状态服务全部迁移到 KubeSphere 上去。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200513002703.png

    - title: 绿米物联网微服务平台设计架构
      contentList:
        - content: 首先可以看看绿米物联网的业务架构图，目前绿米海外地区的服务，基本上全部都运行在 KubeSphere 之上，包括 Gateway 微服务路由调度、Push、Send 推送、iftt 定时等等。
        - content: 由于我们的业务以 Java 为主，因此绿米物联网微服务平台是基于 SpringCloud 框架进行微服务化，使用 Apollo 分布式配置中心管理配置，Eureka 注册中心服务注册与发现。
        - content: 结合 Ribbon、Feign 实现微服务负载均衡以及服务调用。同时，我们使用 Hystrix 线程池实现隔离、熔断以及降级、sentinel 限流，而 springcloud-gateway 网关路由则用来实现路由调度，日志使用的是经典的 ELK 组合，APM 使用 SkyWalking 作为 Java 微服务分布式系统的应用程序性能监视工具。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200514005601.png

    - title:
      contentList:
        - content: 如上图所示，IaaS 我们使用的是腾讯云，Platform （平台层）主要是物联网业务平台的微服务，Platform 层的绝大多数应用都运行在 KubeSphere 容器平台之上，所有子设备通过 Zigbee 协议 连接 Hub 设备，即智能网关、智能插座网关、摄像头等，Hub 设备通过 RPC 协议与绿米智能家居的微服务平台通信，微服务平台为 App、SaaS 等应用提供数据，反向应用通过一系列安全鉴权、认证来调用绿米微服务平台，实现控制智能家居设备。服务层拥有链路追踪、基础监控、CI/CD 等插件。
        - content: KubeSphere 让我们对 Kubernetes 的入门变得更简单、加快推进生产环境 Kubernetes 的上线，对业务迭代有明显的效率提高，并且能够让研发更快地随意切换部署验证各个应用的功能模块。
      image:


    - type: 2
      content: 'KubeSphere 是运维的一把利器，是互联网公司的一道福音。'
      author: '魏恒军'

    - title: 未来计划
      contentList:
        - content: 截止目前为止，这一套物联网微服务平台已经在我们绿米联创的生产运行半年多且无大问题出现，因此，我们计划在近期把公司开发、测试、生产环境中所有的有状态和无状态服务全部迁移到 KubeSphere 上去。
      image:  

  rightPart:
    icon: /images/case/aqara-detail.jpg
    list:
      - title: 行业
        content: 智能家居
      - title: 地点
        content: 中国
      - title: 云类型
        content: 混合云
      - title: 挑战
        content: 可用性、效率、速度
      - title: 采用功能
        content: 托管

---
