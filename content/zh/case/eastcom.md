---
title: eastcom
description:

css: scss/case-detail.scss

section1:
  title: 东方通信
  content: 东方通信是一家集硬件设备、软件、服务为一体的整体解决方案提供商。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 东方通信股份有限公司（以下简称“东方通信”）创立于 1958 年，是一家集硬件设备、软件、服务为一体的整体解决方案提供商。公司于 1996 年成功改制上市，成为上海证交所同时发行 A 股和 B 股的国有控股上市公司。公司业务主要包括：专网通信及信息安全产品和解决方案、公网通信相关产品及 ICT 服务、金融电子设备及软件产品、智能制造业务。
        - content: 十四五期间，公司主责主业聚焦在以专网通信、公网通信、ICT 服务为基础的“信息通信产业”，金融电子为基础的“金融科技产业”和“智能制造产业”三大产业，围绕主责主业不断创新与转型升级。 肩负“科技创造价值，共筑美好生活”的使命，东方通信坚持“诚信、务实、创新、共赢”的理念，致力于为客户提供优质的产品、便利的体验、完美的方案和满意的服务，努力成为在国际市场中拥有优势品牌、持续创新和发展的领先企业！
      image: 

    - title: 技术现状
      contentList:
        - content: 在使用 KubeSphere 之前，公司已经开始研究云原生和探索应用上云的道路。但是由于每个团队接触和学习云原生技术的时间不同，原生 Kubernetes 的使用还是存在一定的门槛。并且随着公司云的基础设施和使用团队的的增加，也提高了云平台团队对云的管理难度。
        - content: 项目的交付方式还是传统的瀑布式开发模式，没有高效的流程，不同的环境下需要对应的开发或运维人员手动部署，增大出现差异性和错误的几率。
      image: 

    - title: 团队规模
      contentList:
        - content: 公司拥有国家级企业技术中心和博士后工作站，承担着多项国家重点研发项目，并多次荣获国家科技进步奖，现有员工 2500 余名，其中 75% 以上为技术专业人才。
      image: 

    - title: 背景介绍
      contentList:
        - content: 近几年，云原生技术已经不再是一个新鲜词汇，根据权威 IT 研究公司 Gartner 预测，到 2025 年，云原生平台将成为 95%以上的新数字化计划的基础，而在 2021 年这一比例只有不到 40%。云原生技术在效率上的巨大优势，使其逐渐成为 IT 发展的主流趋势。
        - content: 针对用户在业务上提出的一些需求，云原生技术能够为我们提供更多的选择。以我司最近的一个项目为例，用户要求为每条业务线路提供主备实例，同时还需要提供容灾备份。在传统部署方式下，需要采购的服务器数量是业务线路数量的 4 倍。但是使用云原生技术，通过容器的方式来实现业务线路之间的隔离，可以大大降低基础设施部署的成本，使用 Kubernetes 作为编排引擎，以声明式脚本的方式部署业务，规范并简化了部署流程，提高了可重复性和一致性。
        - content: 上面举例中提到的只是云原生技术带来的其中一部分改变，随着业务更加深入的进行云化改造，还可以在业务的弹性和高可用，敏捷开发等方面带来更多的价值。
      image: 

    - title: 选型
      contentList:
        - content: 公司与 KubeSphere 的相遇始于针对 Kubernetes 的 Dashboard 的选型。在使用 KubeSphere 之前，我们也研究和试用了许多其他的项目，比如 Kubernetes 官方的 Dashboard 和其他市场同类型产品。Kubernetes 官方的 Dashboard 的功能比较单一，只是提供了对集群资源的管理，市场同类型产品虽然功能更丰富，但还是无法完全满足我们的需求。
        - content: 最终选择 KubeSphere 的原因有以下几点：
        - content: 首先，KubeSphere 不仅仅只是单纯的 Dashboard ，除了针对 Kubernetes 资源管理之外，还提供了统一的集群管理、包含日志、审计、监控在内的强大的可观测性等许多附加功能。同时提供可插拔组件的部署方式，既满足了功能多样性，又满足了部署的灵活性需求。
        - content: 其次，KubeSphere 很好的集成了 DevOps 自动化流程，而 DevOps 自动化流程是提高软件交付速度、保障质量和可靠性的最佳实践方法。
        - content: 最后，我们看重的是 KubeSphere 活跃的开源社区。最为一款开源产品，一个充满活力的开放性开源社区，才能提供充分的能力和技术知识支持，让大家能共享开源模式所带来的红利。
      image: 

    - type: 1
      contentList:
        - content: 大幅度提高现有资源利用率
        - content: 为各业务组提供上云改造参考
        - content: 提高发布、部署效率

    - title: 实践过程
      contentList:
        - specialContent:
            text: 基础设施与部署架构
            level: 3
        - content: 在使用 KubeSphere 的过程中，我们首先是借助 KubeSphere 提供的多集群和多租户功能对现有的集群资源和云上的组织整体架构做了调整，下图所示是我们现在基于 KubeSphere 的东信云组织架构。
      image: https://pek3b.qingstor.com/kubesphere-community/images/eastcom-kubesphere-architecture.jpg
    - title:
      contentList:
        - content: 利用多集群管理功能，对现有的集群资源进行了统一管理。既实现了隔离不同环境，又实现了跨集群的统一管理。通过统一的控制平面，将应用程序及其副本分发到不同集群，实现了集中监控、日志系统、事件和审计日志。
        - content: 其次，借助多租户管理功能，为不同的事业部创建各自的企业空间（WorkSpace），在企业空间中控制资源访问权限。每个企业空间下按开发、测试、运维小组划分为不同的部门，同时为每个项目创建项目空间（NameSpace）。部门作为权限管理的逻辑单元，通过设置项目角色使部门拥有项目的对应权限，再将用户分配至部门后，简化对新加入成员的权限分配过程。
        - content: 引入 DevOps 工作流，利用 S2I、B2I 实现镜像的快速交付，借助 Jenkins 流水线实现 CI/CD，帮助团队实现软件的快速、安全、可靠地交付。
        - content: 借助 KubeSphere 的应用商店功能来管理应用程序的整个生命周期（提交、审核、测试、发布、升级和下架），同时我们还部署了 Harbor 来管理容器镜像。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 存储实现方案
            level: 3
        - content: 为了解决持久化存储的问题，采用基于 nfs-subdir-external-provisioner 的 storageclass 作为存储类，同时对不方便进行改造的业务支持使用本地存储。由用户创建业务 Pod 和 PVC 来申请使用一定量的存储资源，集群管理员管理存储类和 PV，如果使用的是 NFS 类型的存储，由 nfs-subdir-external-provisioner 根据 PVC 申请的存储大小自动创建 PV，如果使用的是本地存储，则由管理员负责手动创建 PV。
      image: https://pek3b.qingstor.com/kubesphere-community/images/image-20230714102940995.png
    - title:
      contentList:
        - specialContent:
            text: 日志与监控
            level: 3
        - content: 为了实现日志文件持久化存储，从容器中读取日志可读，且重启和掉电不丢。采用 EFK（Elasticsearch + Fluentd + Kibana）的日志收集和分析方案来帮助有效的管理和分析大规模日志数据。日志收集目标包括：Docker 组件日志、业务容器日志、管理面组件日志。Elasticsearch 组件目前是直接使用 KubeSphere 内置的 ES，后期为了提升性能，考虑接入外部的 Elasticsearch。
      image: https://pek3b.qingstor.com/kubesphere-community/images/image-20230714104912008.png
    - title:
      contentList:
        - content: 引入 Prometheus 服务作为监控中心，定时采集业务容器、控制面组件以及物理服务器三个层面的指标数据，通过 KubeSphere 界面或 Grafana 的界面展示详细信息。使用采集到的各种指标来判断业务或集群是否正常，针对异常可通过 Prometheus 的 AlarmManage 告警功能进行信息的转发，将告警信息同步到网管（内部管理平台）或通过邮箱、短信、钉钉等方式通知到运维人员。
      image: https://pek3b.qingstor.com/kubesphere-community/images/image-20230714104651231.png
    - title:
      contentList:
        - specialContent:
            text: 多租户管理
            level: 3
        - content: 这里我们想重点分享一下我们针对 KubeSphere 的多租户结构的分析，KubeSphere 在 Kubernetes 的 RBAC 和命名空间提供的基本的逻辑隔离能力基础上，增加了企业空间提供了跨集群、跨项目（即 Kubernetes 中的命名空间）共享资源的能力和权限控制。下面的分析都是基于我们公司使用的 KubeSphere V3.3.0 版本展开。
      image: https://pek3b.qingstor.com/kubesphere-community/images/16892401243511.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/eastcom-kubesphere-xxx.png
    - title:
      contentList:
        - content: 1. 用户 Users：
        - content: 用户是 KubeSphere 的帐户实例，是登陆 KubeSphere 控制台的实体账号，在 KubeSphere 中使用 users.iam.kubesphere.io 资源对用户进行抽象。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992925029.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/16892399292385.png
    - title:
      contentList:
        - content: 用户信息中保存了用户名、密码、最后登陆时间等信息。
      image: https://pek3b.qingstor.com/kubesphere-community/images/16892399292386.png
    - title:
      contentList:
        - content: 平台角色 globalroles：
        - content: 在 KubeSphere 中平台角色使用 globalroles.iam.kubesphere.io 资源抽象。安装成功后，会预创建 4 个内置的平台角色，每个平台角色实际又关联着一个或多个平台模板角色（平台角色的权限是关联模板角色权限的集合）。
      image: https://pek3b.qingstor.com/kubesphere-community/images/eastcom-kubesphere-yyy.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/16892399292387.png
    - title:
      contentList:
        - content: 以 users-manager 角色为例子，其关联了用户查看、角色查看、用户管理、角色管理四个模板角色，这让 users-manager 角色拥有了这四个角色模板下所对应的资源访问权限。
      image: https://pek3b.qingstor.com/kubesphere-community/images/16892399292388.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/16892399292389.png
    - title:
      contentList:
        - content: 平台角色绑定 globalrolebindings：
        - content: 创建用户后，需要为用户分配一个平台角色，使用 globalrolebindings.iam.kubesphere.io 资源来抽象用户和平台角色的绑定关系。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992923810.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992923911.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992923912.png
    - title:
      contentList:
        - content: 在创建一个新的平台角色时，需要编辑权限，此时就是为新创建的平台角色关联预创建的角色模板。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992923913.png
    - title:
      contentList:
        - content: 2. 企业空间 WorkSpace
        - content: 企业空间是 KubeSphere 中用来管理项目、DevOps 项目、应用模板和应用仓库的一种逻辑单元。可以在企业空间中控制资源访问权限，也可以安全地在团队内部分享资源。在 KubeSphere 中使用 workspaces.tenant.kubesphere.io 和 workspacesTemplate.tenant.kubesphere.io 资源对企业空间进行抽象。
        - content: 企业空间角色 workspaceroles： 
        - content: 在 KubeSphere 中企业空间角色使用 workspaceroles.iam.kubesphere.io 资源抽象。安装成功后，会预创建 4 个内置的企业空间角色，每个企业空间角色实际又关联着一个或多个企业空间模板角色（企业空间角色的权限是关联企业空间模板角色权限的集合）。
      image: https://pek3b.qingstor.com/kubesphere-community/images/eastcom-kubesphere-zzz.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992923914.png
    - title:
      contentList:
        - content: 以 system-workspace-viewer 为例子，其关联了业空间设置查看、角色查看、成员查看、部门查看、项目查看、DevOps 项目查看、应用模板查看、应用仓库查看八个模板角色。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992923915.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992923916.png
    - title:
      contentList:
        - content: 企业空间角色绑定 workspacerolebindings：
        - content: 在企业空间中，可以在企业空间成员处邀请用户加入企业空间，邀请用户加入时，还需要为其分配企业空间角色，使用 workspacerolebindings.iam.kubesphere.io 资源来抽象用户和企业空间角色的绑定关系。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992923917.png
    - title:
      contentList:
        - content: 此处以企业空间的默认管理员角色为例（管理员的角色绑定是在创建企业空间时选择管理员时绑定）。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992923918.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992924019.png
    - title:
      contentList:
        - content: 3. 项目 NameSpace
        - content: KubeSphere 中项目就是 K8s 中的命名空间，使用的就是 NameSpace 资源来抽象项目，企业空间和项目的关系是一对多，即一个企业空间下，可以创建多个项目。K8s 的默认命名空间和 KubeSphere 系统相关的命名空间，都归属于默认企业空间 system-workspace。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992924020.png
    - title:
      contentList:
        - content: 下面在前面创建的 demo-ws 企业空间下创建一个新的项目 demo-ws-project-01。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992924021.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992924022.png
    - title:
      contentList:
        - content: 项目角色 roles：
        - content: 在 KubeSphere 中项目角色对应的就是 K8s 自带的 roles 资源。但是通过 KubeSphere 创建新项目时，会自动创建 3 个内置的项目角色，每个项目角色实际又关联着一个或多个项目模板角色（项目角色的权限是关联项目模板角色权限的集合）。
      image: https://pek3b.qingstor.com/kubesphere-community/images/eastcom-kubesphere-xyz.png
    - title:
      contentList:
        - content: 下图展示的是 demo-ws-project-01 项目下的项目角色，如需查看其他项目下的角色，需要带 -n 参数指定项目名（命名空间）。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992924023.png
    - title:
      contentList:
        - content: 以 viewer 角色为例，关联了如下的项目模板角色。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992924024.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992924025.png
    - title:
      contentList:
        - content: 项目角色绑定 rolebindings：
        - content: 在项目下，可以在项目成员处邀请用户加入项目，邀请用户加入时，还需要为其分配项目角色，此时使用的就是 K8s 自带的 rolebindings 资源。以 demo-ws-project-01 项目下绑定关系为例。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992924026.png
    - title:
      contentList:
        - content: 从下图可以看到，admin 用户绑定了该项目下的 admin 角色。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992924027.png
    - title:
      contentList:
        - content: 从下图可以看到，admin 用户绑定了该项目下的 admin 角色。
      image: https://pek3b.qingstor.com/kubesphere-community/images/168923992924028.png

    - title: 使用效果
      contentList:
        - content: 1. 在使用了 KubeSphere 之后，原有的分散管理的多个集群在逻辑上组成了一个大一统环境，集群管理的许多操作不需要再分别连接到不同集群上去操作，对多个集群的状态监控也能够在统一的入口获取，极大的提高了管理的效率。
        - content: 2. 项目交付和部署更加的规范，减少了因环境和不同人员操作而可能产生的差异性，特别是应用商城让应用如同货架上的商品一样唾手可得，应用的部署也只需要很少的修改后即可一键安装。
        - content: 3. 友好的用户界面和可视化的操作方式，降低了公司其他团队使用云的门槛，让即使是刚接触云原生的团队，也能很快的上手。
      image: 
    
    - type: 2
      content: '借助 KubeSphere 的集群管理，有效的整合集群资源并提升了资源使用效率。改造传统业务，加快业务的发布、部署，提高产品核心竞争力。'
      author: '东方通信'

    - title: 未来规划
      contentList:
        - content: 未来我们计划探索和使用更多 KubeSphere 的组件功能，如审计日志、服务网格等。针对东信团队的内部需求，对 KubeSphere 的源码进行二次开发，并争取能够回馈社区。积极参与社区活动，与社区进行更加深入的交流。
      image: 

  rightPart:
    icon: /images/case/logo-eastcom.png
    list:
      - title: 行业
        content: 通信
      - title: 地点
        content: 中国杭州
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 资源统一管理、传统业务改造及定制化、快速发布/部署
      - title: 采用功能
        content: 集群化统一管理资源；存储、网络、日志业务上云改造，少量业务定制化；发布/部署方案及实现上云重构
---
