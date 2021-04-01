---
title: Maxnerva
description:

css: scss/case-detail.scss

section1:
  title: 云智汇科技服务有限公司
  content: 云智汇科技建立“IaaS + PaaS + SaaS”核心服务，力创“智能制造+智慧城市+运维服务”的全价值生态 MCS 产品轴，以科技为核心，以服务为导向，多层次、多模式实现企业数字化转型升级，致力成为全方位的IT整体解决方案和科技服务的提供者和领导者，核心助力中国制造 2025。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 云智汇科技服务有限公司（Maxnerva Technology Services, HK.1037），是由跃居【财富】全球企业 500 强的鸿海富士康科技集团投资的其关联上市公司。凭借在 3C 高端产品产业从业 20 年的 IT 服务经验，融汇了富士康“云、移、物、大、智、网+机器人”创新技术，融合了经验丰富的工业化和信息化开发、实施与运维的金牌专业团队。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611184404.png

    - title: 背景
      contentList:
        - content: '根据富士康 2019 年数字化转型战略(中国制造 2025，工业 4.0)，我们的运营团队面临以下挑战：'
        - content: '从技术方面:'
        - content: 1. 支持私有云，公有云和混合云。
        - content: 2. 管理数千个微服务，支持近 700 个旧 SLA 服务。
        - content: 3. 支持从边缘计算到数据分析的大数据架构。
        - content: 4. 支持海量数据存储和数据分析。
        - content: '而现在的架构并不能满足上述的要求、同样也存在以下问题:'
        - content: 1. 所有服务都是基于 Docker-compose 进行编排、存在严重的单节点的、没有办法保障服务本身的高可用。
        - content: 2. 资源利用率低。
        - content: 3. 对于开发人员操作不方便。
        - content: 4. 多服务更新时间周期长。
        - content: 在我们全面转向云原生技术栈之前，我们所有的服务都是基于 Docker 和 Docker-compose 的，不同的服务部署在不同的主机或集群上。为了满足需求，解决存在的问题，我们选择了 Kubernetes、Prometheus 以及 KubeSphere 在内的云原生生态系统工具来面对挑战。最大的好处是，我们可以为客户提供低成本、高效率的制造业数字化转型策略。
      image:

    - title: 选择 KubeSphere 的原因
      contentList:
        - content: 基于我们的需求和问题，我们也进行了多种解决方案的 POC，包括 Rancher、蓝鲸、原生的 Kubernetes。最终选择 KubeSphere 的原因是，KubeSphere 提供了一个完整的交付链环境，我们可以基于 KubeSphere 以最快捷的方式完成新环境的部署，并且可以对接现有环境。
        - content: 通过 KubeSphere 打包的一系列云原生工具，我们能够在几分钟内部署新服务，并在几秒钟内升级我们的业务系统。开发人员只需要推送他们的代码，这些代码将在大约 10 分钟内自动发布到生产环境中。因此，我们的资源利用率增加了一倍，交付效率提高了十倍以上。
        - content: KubeSphere 给我们带来的最大优势是，现在所有环境的发布，都已经可以由开发人员直接操作，而不需要运维人员全程介入。大大减少了中间的沟通成本和运维工作量。在 KubeSphere 的基础上，我们构建了 AIOps 平台，与我们现有的系统服务和组件紧密集成。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611185811.png

    - title: KubeSphere 部署架构
      contentList:
        - content: KubeSphere 为我们提供了在多个机房中的混合云部署，使我们能够构建一个工业物联网平台。富士康的工厂分布在世界各地，为了满足业务本身的需求，在不同的地方都有独立的机房进行业务系统的部署。而且开发环境只有一个，通过“标签”进行控制不同的地区中的资源，实现本地编译、本地存储、本地部署上线。这就是我们实现快速应用交付的方式。
        - content: 基于数据安全防护的需求，集群中资源默认没有访问 Internet 权限，需要通过安全审计服务器才可以正常访问。同样对于集群内部的资源也需要通过审计服务器进行。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611184525.png

    - type: 1
      contentList:
        - content: 降低学习成本
        - content: DevOps 定制
        - content: 提升交付效率

    - title: 存储和网络解决方案
      contentList:
        - content: 我们在第一次部署中采用 Calico 作为集群网络解决方案。在验证测试时发现多节点之间的网络延迟非常高。这是因为 Calico 对 BGP 协议有特定的要求，而我们部署的中间的网络非常复杂，没有办法针对网络进行更改。后期修改为 flannel 并做部署配置调整，同网段内使用 hostgw ，非同网段时使用 VXLan。最后验证测试确认网络性能有了明显的提升。
        - content: 我们使用 GlusterFS 集群和 NFS 存储作为集群持久存储的解决方案。GlusterFS 主要为存储卷提供持久挂载，而 NFS 用于数据备份。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611185626.png

    - title: 日志和监控解决方案
      contentList:
        - content: 我们是直接对接的现有的监控体系，包括 Zabbix、ELK 和 Prometheus。这样做的优势是可以减少部署的成本，同时也可以实现与现有环境的对接。
        - content: KubeSphere 平台的主要使用者"开发人员"，可以直接通过 KubeSphere 平台实现统一的部署和状态信息、监控系统的查看。对于专职的“运维人员”，可以通过现在的监控平台实现更详细的资源查看和故障的处理。
      image:

    - type: 2
      content: 'KubeSphere 提供了一个完整的交付链环境，我们可以基于 KubeSphere 以最快捷的方式完成新环境的部署。'
      author: '云智汇科技'

    - title: KubeSphere DevOps 定制
      contentList:
        - content: 在使用 KubeSphere 的过程中，我们也遇到了一个新的困境，开发的业务系统远远多于专职的运维人员，新环境的发布前置条件，严重依赖于运维人员。运维人员需要协助开发团队进行中间件和流水线的初始化部署创建。整个运维团队的人力资源成为流程中的一个新的约束点。
        - content: 流水线创建所需要使用的 Jenkinsfile 文件的编辑，对于开发人员来讲，存在一定技术上的难度。幸运的是，作为一个完全开放源码的平台，KubeSphere 允许我们根据其现有特性进行定制开发和打包。更具体地说，我们提供了一个快速创建的新功能，以满足开发人员在创建或更新 DevOps 工程和 CI/CD 流水线时的需求。
        - content: 基于KubeSphere 提供的各项完整的便捷功能，我们实现了少量专职运维人员对应 10+ 开发团队的运维工作。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611190317.png

    - title: 未来展望
      contentList:
        - content: '对 KubeSphere 的建议或需求:'
        - content: 1. 更详细的监控信息。
        - content: 2. 协调统一项目管理。
        - content: 3. 一个内置的简单的工单系统。
        - content: 4. 对于 Windows 节点的管理。
      image:

  rightPart:
    icon: /images/case/section6-maxnerva.jpg
    list:
      - title: 行业
        content: IT 服务
      - title: 地点
        content: 中国
      - title: 云类型
        content: 混合云
      - title: 挑战
        content: DevOps、效率、有限的人力资源
      - title: 采用功能
        content: CI/CD、日志、监控

---
