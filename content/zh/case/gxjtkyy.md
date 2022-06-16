---
title: gxjtkyy
description:

css: scss/case-detail.scss

section1:
  title:  广西交科集团
  content: 广西交科集团有限公司是一家在交通运输系统中具有重要影响力的高新技术企业，致力于为建设交通强国贡献智慧解决方案。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 广西交科集团有限公司软件研究院成立于 2017 年，前身为公司智能交通所软件研发中心，主要从事高速公路领域的软件开发、系统集成业务 , 为行业客户提供相关解决方案。现拥有软件著作权 74 项、软件产品 90 项，并通过 IS09001 质量体系认证，是广西高速公路领域最大的软件服务提供商。该院已获得美国 CMMI 研究院颁发的 CMMI5 级评估证书，在软件研发能力成熟度和项目管理方面达到了国际较高水平。
        - content: 该院专注高速公路收费领域，在高速公路收费、高速公路运营管理支持、城市公共交通支付等领域取得突出成果，研发的“高速公路 IC 卡‘一卡通’联网收费系统”使广西率先成为全国第一批实现高速：公路联网收费的省份；成功研发了广西第-套具有完全知识产权的“ETC 不停车收费系统”，包含广西高速公路联网电子不停车收费 (ETC) 系统服务及结算平台、ETC 联网清分中心系统、ETC 密钥管理系统等，ETC 不停车收费车道系统已经覆盖全广西范围内的高速公路并实现全国互联互通。二十多年来在广西累计建设 MTC 车道 3300 多条，ETC 车道 1600 多条，自动发卡机车道 370 多条。除专注发展高速公路收费领域外，该院在发展高速公路建管养一体化领域、口岸信息化领域也取得显著成果。
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-1.png

    - title: 建设目标
      contentList:
        - content: 我们期望基于 K8s 搭建 PaaS 云计算平台。使用多租户方式管理和使用资源。集成 CI/CD 支持灵活扩容与升级集群。构建企业级一站式 DevOps 架构，提供集群资源的可监控性服务。
      image: 

    - title: 环境痛点
      contentList:
        - content: 在使用 K8s 前，我们使用由第三方的运维团队负责的虚拟机管理平台。开发部署环境混乱，运维管理成本大，服务器资源利用率低。由于安全需要，每次登陆虚拟机都需要先经过一个堡垒机，然后再输入目标虚拟机的账户密码才能登录。
        - content: 由于虚拟机的账户密码每 3 个月就会更换一次，所以每次登录都需要先查表才能知道最新的密码，非常麻烦。另外，每次更换密码也都需要运维人员大量纯手工操作，极其耗费时间。开发人员上线新应用时，需要运维人员支持先分配一台或多台虚拟机后将 IP 和账户密码发给开发人员，从此开发人员就拥有这个虚拟机的使用权，开发人员需要从 0 开始配置虚机的系统环境，安装中间件，手动上传应用，最后，再手动将应用运行起来。
        - content: 应用下线时，开发人员一般是不会及时通知运维人员去回收资源的，因为重新配置一台机器非常麻烦，所以总是优先考虑留着资源，以备新的应用上线。由于运维人员对每个虚机的实际使用情况根本无法掌握，所以虚拟机资源经常无法回收，造成了大量服务器资源的浪费。
      image: 

    - title: IT 运维与开发团队的规模
      contentList:
        - content: 基础设施运维 3 人 ， 开发团队 70 人。
      image:

    - title: 背景介绍
      contentList:
        - content: 在拥抱云原生之前，我们有上百台虚拟机被运维和开发人员同时管理，应用分布散乱，管理起来既费时又费力，已经是失控的边缘。拥抱云原生，使用 K8s 之后，我们采用 DevOps，统一分配资源。释放了运维人员的生产力，提升了开发人员的开发效率。
        - content: 初期，我们部署了原生 K8s, 使用原生 Dashboard 运行了一段时间。后来觉得它对用户的认证方式过于粗放，UI 界面也不太友好，学习成本过高。直到有同事推荐了 KubeShpere，尝试着登录他们的官网，浏览帮助文档，登录社区论坛。 "more than Kubernetes and easier than Kubernetes"——“比 K8s 强大，又比 K8s 易用”，从部署到运维体现得淋漓尽致。相对于同类产品的优势在于国人开发，本地化程度很高，面向开发用户友好，多租户的权限细粒度管理，日志查询界面便捷，周边生态整合全面，可灵活配置需要模块。
        - content: 目前，我们已经搭建了两套 KubeSphere 环境。测试环境由 2 台物理机和一台虚机构成（1 个主节点 2 个工作节点）。生产环境由 5 台物理机构成（2 个主节点 3 个工作节点）。借着最近一个系统改造契机，我们已经把 80% 的应用运行在 KubeSphere 之上，后续的新开发的应用也都会直接部署 KubeSphere 环境上。
      image: 

    - title: 实践过程
      contentList:
        - specialContent:
            text: KubeSphere 在相关业务的基础设施与部署架构
            level: 3
        - content: 我们依托 KubeSphere 部署 Redis、RabbitMq、搭建 Elasticsearch 集群，Kibana 等。
        - content: 部署 Redis
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-2.png
    - title:
      contentList:
        - content: 部署 RabbitMQ
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-3.png
    - title:
      contentList:
        - content: 部署 Elasticsearch 集群
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-4.png
    - title:
      contentList:
        - content: 部署 Kibana
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-5.png
    - title:
      contentList:
        - content: 现在核心业务的数据库我们使用的是物理机部署 Oracle，后续的一些轻量级应用我们计划可以依托 KubeSphere 部署 MySQL。
      image: 
    - title:
      contentList:
        - specialContent:
            text: KubeSphere 在 CI/CD 的应用
            level: 3
        - content: 由于在使用 KubeSphere 之前，我们已经有一套 CI/CD 流程，所以我们的 Jenkins 和 Harbor 没有使用 KubeSphere 提供的构建流水线服务，后续我们会进行一些探索，尝试采用 Helm 构建应用，更好贴合 KubeSphere 的应用市场。
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-6.png
    - title:
      contentList:
        - specialContent:
            text: KubeSphere 自带集群监控
            level: 3
        - content: 整体监控
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-7.png
    - title:
      contentList:
        - content: 各个节点资源监控
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-8.png
    - title:
      contentList:
        - content: 应用监控  
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-9.png
    - title:
      contentList: 
        - content: 应用日志查看
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-10.png
    - title:
      contentList: 
        - content: 自定义监控报警
      image: https://pek3b.qingstor.com/kubesphere-community/images/gxjtkyy-11.png

    - title: 公司业务与 KubeSphere 的契合点
      contentList:
        - content: 我们项目组成员缺乏 Docker 和 K8s 的使用经验。KubeSphere 无缝契合 K8s，操作画面友好，我们的开发人员能够低成本上手使用 K8s，享受 K8s 带来的便携性。
        - content: KubeSphere 的多租户架构与我们集团公司的企业架构一致。架构分三个层级。集群，企业空间和项目。其中，KubeSphere 中的最底层的项目等同于 Kubernetes 的命名空间。集群、企业空间是构建在 K8s 的名字空间之上的进一步抽象。KubeSphere 可以为建立多个集群，对应一个集团公司，一个集群下可以建立多个企业空间，对应一个公司，一个企业空间可以建立多个项目，对应公司实际产品线，每个层级的一个实例就是一个 Workspace，其他与同层次其他实例的资源隔离。
      image: 

    - type: 1
      contentList:
        - content: 服务器资源利用率显著提高
        - content: 运维管理成本降低
        - content: 业务系统可靠性提高
  
    - title: 落地成效
      contentList:
        - content: 我们在落地了 KubeSphere 之后，有了以下成效。
        - content: 1. 开发部署环境已经被有序管理。应用都运行在容器平台中，使用多少资源一目了然。
        - content: 2. 运维管理成本降低。统一通过 KubeSphere 登录容器平台，不论查看应用日志，进入容器内部进行操作，修改应用配置都十分便利。
        - content: 3. 服务器资源利用率显着提高。我们原先使用了 30 多台物理机来构建我们应用，现在仅使用了 8 台物理机，解放了大量服务器资源。
        - content: 4. 务系统可靠性提高。K8s 自带容器存活探针，当应用无法正常使用给予预警提示，自动重启容器。以前我们升级应用的时候，一般都会发个通告，暂停业务半小时，现在升级应用对业务几乎无感。
      image: 

    - type: 2
      content: 'KubeSphere 帮助我们有序管理服务器资源，简化了开发、测试、部署、运维各个流程。'
      author: '广西交科集团'

    - title: 未来规划
      contentList:
        - content: 未来我们会逐步扩大应用场景，在集团公司其他业务领域基建、口岸等信息化建设工程中应用。
        - content: 另外，我们想在服务网格方面进行探索，尽量在 KubeSphere 平台中实现业务与技术分离。
        - content: 目前，我们公司软件队伍主要利用 Java 语言做相关业务领域的开发，未来我们可以组建精通 Golang 技术的团队从事一些云原生中间件的开发。
      image: 

  rightPart:
    icon: /images/case/logo-gxjtkyy.png
    list:
      - title: 行业
        content: 交通
      - title: 地点
        content: 中国广西
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 统一的产品发布运维管理
      - title: 采用功能
        content: DevOps、日志、监控
---
