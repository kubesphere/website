---
title: adaspace
description:

css: scss/case-detail.scss

section1:
  title: 成都国星宇航科技股份有限公司
  content: 国星宇航是一家 AI 卫星互联网科技公司，由卫星互联网领域的科研院所及部队领军人才创办。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 国星宇航是一家 AI 卫星互联网科技公司，由卫星互联网领域的科研院所及部队领军人才创办。截至目前，国星宇航已完成 11 次太空任务，研制并发射 15 颗 AI 卫星及载荷。国星宇航通过低成本快响应卫星研制技术体系、全栈 AI 卫星网络技术体系、面向未来的可信共享互联通信技术体系，形成了面向不同应用场景的 B 端、G 端、C 端等卫星互联网产品，已服务上百家政企客户，并覆盖上亿 C 端用户。国星宇航始终坚持与祖国在一起，助力社会，服务人民，致力于实现“同一个星空，同一个网络”的美好愿景。
      image: 

    - title: IT 建设目标
      contentList:
        - content: 我们期望基于 K8s 搭建 PaaS 云计算基础平台，多租户管理使用资源，集成 CI/CD、支持灵活扩容与升级集群，构建企业级一站式 DevOps 架构，提高集群资源可监控性，可溯源操作审计。
      image: 

    - title: 环境痛点
      contentList:
        - content: 物理机服务器集群，未使用第三方托管上云，在使用 K8s 之前使用 Docker Swarm 模式部署，Portainer 可视化管理 Docker 容器，开发部署环境混乱，运维管理成本大，服务器资源利用率不高。
      image: 

    - title: IT 运维与开发团队的规模
      contentList:
        - content: 子部门，后端开发 2 人，前端 2 人，运维兼开发一人，小规模开发团队。
      image: 

    - title: 背景介绍
      contentList:
        - content: 云原生（Cloud Native）这个概念最早由来自美国云原生公司 Pivotal 的 MattStine 于 2013 年首次提出，最早只是他根据其多年的架构与咨询经验总结出的一个思想集合，包括 DevOps、持续交付、微服务、敏捷基础设施和 12 要素等几大主体。
        - content: 现在着眼于云应用部署，其拥有着弹性、共享、自治、高可用、按需分配资源、可监控审计等优秀特点。
        - content: 结合于云原生的各项优势，我们相信云原生即是未来。
        - content: 在使用 K8s 之前，应用的部署以及管控对于开发者、运维来说繁琐且耗费精力，容器资源的分配、使用的情况在应用分部散乱的时候尤其难管理。
        - content: 拥抱云原生，使用 K8s 后能方便业务解耦，分离部署，高可用，对于开发人员能极大提升开发效率。
        - content: 在初期选型考虑过部署原生 K8s，使用原生 Dashboard，后来考虑学习成本过高，得不偿失，直到偶然的机会发现了 KubeShpere。
        - content: 对于本人来说一直对于云原生都有向往，一眼相中了 KubeSphere 的 UI 界面，当然，还有更贴合开发的操作界面，在我认知方面 KubeSphere 之于 K8s 如同 Spring 之于 Java，开箱即用，即用即拿。
        - contetn: KubeSphere 对比于同类产品（Rancher 之类）的优势在于国人开发， 本地化程度更高，面向开发用户友好，多租户权限分配更细粒度，日志查询界面便捷，周边生态整合全面，模块可插拔，可灵活配置需要的模块。
        - content: 我们当前将一部分 SaaS 产品运行于 KubeSphere 上，后续会考虑进一步迁移。
      image: 

    - title: 实践过程
      contentList:
        - specialContent:
            text: KubeSphere 在相关业务的基础设施与部署架构介绍
            level: 3
        - content: 我们依托于 kubeshere 部署 Harbor 私有镜像库，暂时使用手动上传 Jar 包构建镜像，未使用 CI/CD 流程，后续可能会自行构建流水线，采用 Helm 构建应用，更好贴合于 KubeSphere 应用市场。
        - content: 在项目中，我们使用项目网关，服务只有 Gateway 模块通过 Ingress 暴露对外地址，前端使用 OpenResty 部署。
        - content: 鉴于人员不多以及应用暂时仅对公司内部运行的情况，还未接入容器监控模块，后续可能会采用 Prometheus+Grafana 监控配置，以保证服务运行状态的可观测性，以及根据监控数据灵活的动态伸缩。
        - content: 通过企业空间逻辑隔离出 pord 、dev 、test 环境，开发人员按部门以及项目进行授权。
      image: https://pek3b.qingstor.com/kubesphere-community/images/guoxingyuhang-1.png
    - title:
      contentList:
        - content:
      image: https://pek3b.qingstor.com/kubesphere-community/images/guoxingyuhang-2.png
    - title:
      contentList:
        - specialContent:
            text: 搭建 Nacos
            level: 3
        - specialContent:
            text: 在 Mysql 中执行 Nacos 初始化 SQL。
            link: https://github.com/alibaba/nacos/blob/master/distribution/conf/nacos-mysql.sql
        - content: 选择新建自制应用。
      image: https://pek3b.qingstor.com/kubesphere-community/images/guoxingyuhang-3.png
    - title:
      contentList:
        - content:
      image: https://pek3b.qingstor.com/kubesphere-community/images/guoxingyuhang-4.png
    - title:
      contentList:
        - content: 本处使用 DockerHub 中的 Nacos 镜像，需要加入参数启动。
      image: https://pek3b.qingstor.com/kubesphere-community/images/guoxingyuhang-5.png
    - title:
      contentList:
        - content: 如若只添加这两个环境变量，则默认采用内置 derby 数据库，重启会导致数据清除，为了数据持久化，建议采用外置数据库。
      image: https://pek3b.qingstor.com/kubesphere-community/images/guoxingyuhang-6.png
    - title:
      contentList:
        - content:
      image: https://pek3b.qingstor.com/kubesphere-community/images/guoxingyuhang-yaml.png
    - title:
      contentList:
        - content: 部署完毕后，登入 Nacos（此处使用路由解析了域名）。
      image: https://pek3b.qingstor.com/kubesphere-community/images/guoxingyuhang-7.png      
    - title:
      contentList:
        - specialContent:
            text: KubeSphere 自带底包运行应用远程调试
            level: 3
        - content: 使用第三方底包可以之家在启动命令处加入 java 启动命令来实现远程 Debug，此处示例 KubeSphere 自带 Java 底包。在构建镜像，点击高级设置，可以对应添加调试参数，使用 Nodeport 对外暴露端口，即可以进行远程 Debug 应用。
      image: https://pek3b.qingstor.com/kubesphere-community/images/guoxingyuhang-8.png
    - title:     
      contentList:
        - specialContent:
            text: KubeSphere 自带集群监控
            level: 3
      image: https://pek3b.qingstor.com/kubesphere-community/images/guoxingyuhang-9.png

    - type: 1
      contentList:
        - content: 降低了项目开发运维成本，助力企业容器化改造
        - content: 提高了 DevOps 的扩展能力
        - content: 提高了部门下不同项目开发的区分度
  
    - title: 与 KubeSphere 的契合点
      contentList:
        - content: 在开发部署上，对内可针对于项目快速应用开发，部署运行环境、中间件，且借助于 KubeSphere 自带监控告警保证服务可用；对外产品演示时能灵活创建销毁容器，服务即用即拿。
        - content: 考虑到 KubeSphere 无缝契合 K8s，其友好的操作界面，使得我们开发人员也能低成本的上手使用 K8s，享受其带来的便捷性。
        - content: 由于我们当前使用物理机部署，在将来可能会接入公有云产品，所导致的资源连通问题是绕不开的话题，所以 KubeSphere 所推行的混合云也是吸引我们的一个点，借助于 KubeSphere 加速云上云下整合实现更好的资源共享。
        - content: 对于一个良好的 K8s 载体，KubeSphere 的多租户特性这是原生 K8s 和其他同类产品都没有的功能。青云QingCloud 做了很多企业级特性增强的工作，对于多项目并行以及环境隔离来说简直是一剂良药，使得项目部署规划更加规整，并且 KubeSphere 的可观察性以及监控告警也是多租户的，可以细分开发人员更好的专注于自己所负责的模块。
      image: 

    - type: 2
      content: 'KubeSphere 使我们云上云下资源利用率显著提升，资源使用情况明确、可量化，业务相关的运维以及开发更便捷高效。'
      author: '国星宇航'

    - title: 落地成效
      contentList:
        - content: 应用 KubeSphere 之后，和之前相比，开发人员生成镜像制品更加便捷、集群资源利用率提高、应用服务能灵活分配资源、环境隔离更加直观且易于管理、多租户权限配置能更大限度的防止误操作，后续可扩展性提升。
      image: 

  rightPart:
    icon: /images/case/logo-adaspace.png
    list:
      - title: 行业
        content: 互联网商业卫星
      - title: 地点
        content: 中国
      - title: 云类型
        content: 混合云
      - title: 采用功能
        content: DevOps、日志、监控、网关
---
