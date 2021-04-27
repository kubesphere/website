---
title: Huaxia Bank
description: Migrate to Microservices using KubeSphere in FinTech Transformation

css: scss/case-detail.scss

section1:
  title: 华夏银行
  content: 华夏银行成立于1992年。作为一家金融机构，华夏银行正在进行金融科技转型，为客户提供技术领先的金融服务。


section2:
  listLeft:
    - title: '公司简介'
      contentList:
        - content: 在改革开放总设计师邓小平的关心支持下，华夏银行于 1992 年 10 月在北京成立。1995 年 3 月，实行股份制改造；2003 年 9 月，首次公开发行股票并上市交易（股票代码：600015），成为全国第五家上市银行。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611164953.png

    - title: '背景'
      contentList:
        - content: 作为一家金融机构，华夏银行正在进行金融科技转型，为客户提供技术领先的金融服务。
        - content: 该银行在全国有 40 多家一线分行。每个分行都有自己的本地银行业务，需要快速交付需求。此外，每个分行的很多应用，如基金监管、ETC、支付系统等，使用不同的语言编写，如 C/ C++、Java、Python 等，使用传统的单片架构，部署在虚拟机上。此外，华夏银行自研了大型的 Snowflake 生态系统，每种工具需要分别配置与部署。
      image:

    - title: '采用 KubeSphere 作为平台解决方案'
      contentList:
        - content: 华夏银行选择将应用迁移到 Kubernetes。 我们引入了 KubeSphere 来增强 Kubernetes 平台的能力。通过统一门户连接 KubeSphere 中的 DevOps、 微服务管理和 Kubernetes 平台，我们能更轻松地采用云原生技术栈。KubeSphere 对于新的开发人员是十分友好的。 使用 Istio service mesh，我们可以很轻松地实现灰度发布。 KubeSphere 简化了 DevOps 的工作流，并且其内置角色是为开发人员和操作人员设计的。
        - content: 此外，可观察性在日常开发和操作中非常重要。KubeSphere 提供集中的日志搜索和监控功能，这有助于我们定位不同微服务之间的问题和瓶颈。
      image:

    - title: 'Kubernetes 是为微服务架构量身定制的'
      contentList:
        - content: 作为我行自 2019 年以来第一个采用 Kubernetes 的团队，我们致力于引领金融科技转型，让科技助推金融业务创新。幸运的是，几个实验项目证明 Kubernetes 是为微服务架构量身定制的，而且 Kubernetes 为我行的多个分行节省了大量时间。
        - content: '当分行开发人员看到，与虚拟机进程相比，容器的运行速度有多快时，所有分行都开始尝试在容器中运行应用，并在  Kubernetes 中发布。通过 Kubernetes 和 KubeSphere 平台，发布过程从小时级提升到分钟级，上线时间得到了显著改善。'
      image:

    - type: 1
      contentList:
        - content: 上线时间显著改善
        - content: 推动金融业务创新
        - content: 对新手开发人员友好

    - title: '云原生是加速金融科技转型的利器'
      contentList:
        - content: 说到对生态系统的好处，我们已经证明了原生云是加速金融科技转型的好方法。作为我行的先驱，我们为其他项目提供了一些最佳实践。如今，开发人员可以快速地部署、发布用不同语言和框架编写的应用程序。Kubernetes 以一致的方式提供了我们在云原生生态系统中所需要的所有工具。 
      image:

    - type: 2
      content: '通过 Kubernetes 和 KubeSphere 平台，发布过程从小时级提升到分钟级，上线时间得到了显著改善。'
      author: '华夏银行'

    - title: 关于 KubeSphere
      contentList:
        - content: KubeSphere 整合了很多云原生技术和工具，包括 Docker、Istio mesh、DevOps、监控、日志等。 我们已经演示了在过个分行中使用 Kubernetes 和 KubeSphere 的最佳实践。
        - content: 对银行业来说，大多数应用必须是容错率高、高可用性和高可靠性的。我们证明了即使在 Kubernetes 上运行这些应用也可以实现这些严格的要求。我们希望我们的用户案例研究，能够促进 Kubernetes 在银行业的采用。
      image:

  rightPart:
    icon: /images/case/section6-huaxia-bank.jpg
    list:
      - title: 行业
        content: 金融
      - title: 地点
        content: 中国
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 高可用性、高效率、数据安全
      - title: 采用功能
        content: Istio Mesh, DevOps, Kubernetes

---
