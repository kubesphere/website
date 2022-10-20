---
title: xdf
description:

css: scss/case-detail.scss

section1:
  title:  vesoft inc. 
  content: vesoft inc. 成立于 2018 年 10 月，是一家科技型创业公司。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: vesoft inc. 成立于 2018 年 10 月，是一家科技型创业公司。公司创始团队来自于 Facebook、阿里巴巴、华为等国内外各大知名公司。致力于世界上唯一开源的分布式图数据库 NebulaGraph 的研发，为客户提供稳定高效的互联网基础技术服务。
      image: 

    - title: 多云架构挑战
      contentList:
        - content: Nebula Graph 的云产品定位是 DBaaS （Database-as-a-Service）平台，因此肯定要借助云原生技术来达成这一目标。到底该如何落地呢？首先要明确一点，任何技术都不是银弹，只有合适的场景使用合适的技术。虽然我们拥有很多可供挑选的开源产品来搭建这个平台，但是最终落实到交付给用户的产品上，还有很多挑战。
        - content: 业务挑战：多个云厂商的资源适配，这里需要实现统一的资源抽象模型，同时还要做好国际化，国际化需要考虑地域文化差异、当地法律法规差异、用户消费习惯差异等多个要素，这些要素决定了需要在设计模式上去迎合当地用户的使用习惯，从而提升用户体验。
        - content: 性能挑战：在大多数情况下，通过同一云厂商网络传输的数据移动速度比必须通过全球互联网从一个云厂商传输到另一个云厂商的数据移动速度要快得多。这意味着跨云之间的网络连接可能成为多云体系结构的严重性能瓶颈。数据孤岛很难打破，因为企业无法迁移格式不同且驻留在不同技术中的数据，缺乏可迁移性会带给多云战略带来潜在的风险。在单个云厂商中，使用云厂商的原生自动扩展工具配置工作负载的自动扩展非常容易，当用户的工作负载跨越多个云厂商时，自动扩展就会变得棘手。
        - content: 运营挑战：大规模的 Kubernetes 集群运营是非常有挑战的事情，满足业务的快速发展和用户需求也是对团队极大的考验。首先是做到集群的管理标准化、可视化，其次全部的运维操作流程化，这需要有一个深入了解运维痛点的管理平台，可以解决我们大部分的运维需求。数据安全上需要考虑在没有适当的治理和安全控制的情况下，将数据从一个平台迁移到另一个平台(或从一个区域迁移到另一个区域)会带来数据安全风险。
      image: 

    - title: KubeSphere 多集群管理
      contentList:
        - specialContent:
            text: 平台化管理
            level: 3
        - content: KubeSphere 衍生自青云公有云的操作面板，除了继承颜值，同时在功能上也是相当完备。NebulaCloud 需要对接的主流云厂商都已经支持上，因此一套管理平台就可以运维所有的 Kubernetes 集群。多集群管理是我们最为看重的功能点。
        - content: 我们在本地环境部署了 Host 集群，其余的云上托管 Kubernetes 集群通过直连接入的方式作为 Member 集群，这里需要注意 ApiServer 访问配置放通单个 IP，比如本地环境的出口公网 IP。
      image: https://pek3b.qingstor.com/kubesphere-community/images/nebula-kubesphere-IP.jpg
    - title:
      contentList: 
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/nebula-kubesphere-multicluster.jpg
    - title:
      contentList:
        - specialContent:
            text: 流程化操作
            level: 3
        - content: 我们使用 IaC 工具 pulumi 部署新集群，再通过自动化脚本工具设置待管理集群 member 角色，全部过程无需人工操作。集群的创建由平台的告警模块来触发，当单集群的资源配额达到告警水位后，会自动触发弹性出一套新的集群。
      image: https://pek3b.qingstor.com/kubesphere-community/images/nebula-pipeline.jpg

    - type: 1
      contentList:
        - content: 降低多集群管理复杂度
        - content: 提升后台运营体验
        - content: 开发测试流程自动化

    - title:
      contentList:
        - specialContent:
            text: 自动化监控
            level: 3
        - content: KubeSphere 提供了丰富的内置告警策略，同时还支持自定义告警策略，内置的告警策略基本可以覆盖日常所需的监控指标。在告警方式上也有多种选择，我们采用了邮件与钉钉相结合的方式，重要紧急的可以通过钉钉直接钉到值班人员，普通级别的可以走邮件方式。
      image: https://pek3b.qingstor.com/kubesphere-community/images/nebula-kubesphere-notification.jpg
    - title:
      contentList: 
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/nebula-kubesphere-monitor.jpg
    - title:
      contentList:
        - specialContent:
            text: 智能化运营
            level: 3
      image: https://pek3b.qingstor.com/kubesphere-community/images/智能化运-1.jpg
    - title:
      contentList: 
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/智能化运营-2.jpg

    - type: 2
      content: '省去了 K8s 多集群管理与基础设施层运维后台的开发成本，KubeSphere 丰富的可插拔插件为智能化运营带来了良好的使用体验，我们通过主动运维提前发现问题，将风险控制在源头，提升了平台服务的稳定性。'
      author: 'vesoft'

    - title: 未来规划
      contentList:
        - content: KubeSphere 还有很多好用的配套工具，比如日志查询、事件查询、操作审计日志等，这些工具在精细化运营都是必不可少的。 我们目前已经接入了测试环境集群，在深度使用掌握 KubeSphere 的全貌后会尝试接入生产集群。
      image: 

  rightPart:
    icon: /images/case/section6-vesoft-4.png
    list:
      - title: 行业
        content: 互联网
      - title: 地点
        content: 中国
      - title: 云类型
        content: 公有云
      - title: 挑战
        content: 多集群管理与后台运营
      - title: 采用功能
        content: 多集群管理、监控、应用商店
---
