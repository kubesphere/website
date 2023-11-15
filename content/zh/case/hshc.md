---
title: hshc
description:

css: scss/case-detail.scss

section1:
  title:  花生好车
  content: 花生好车致力于打造下沉市场汽车出行解决方案第一品牌。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 花生好车成立于 2015 年 6 月，致力于打造下沉市场汽车出行解决方案第一品牌。通过自建直营渠道，瞄准下沉市场，现形成以直租、批售、回租、新能源汽车零售，四大业务为核心驱动力的汽车新零售平台，目前拥有门店 600 余家，覆盖 400 余座城市，共设有 25 个中心仓库。目前已为超 40 万以上用户提供优质的用车服务，凭借全渠道优势和产品丰富度成功领跑行业第一梯队。
      image: 

    - title: 背景介绍
      contentList:
        - content: 公司在自建 IDC 机房的物理服务器使用 KVM 作为底层虚拟机管理，随着业务增加，导致系统存在一些问题，故有了此次底层基础架构改造实践：
        - content: 利用率不饱和：各类服务器的 CPU 利用率普遍不饱和，闲时利用率低下，且忙闲不均；
        - content: 耗能大：服务器需求量大，机柜、网络、服务器等利用率低；
        - content: 基础资源庞杂：底层标准化不一，无法传承；
        - content: 资源共享不足：烟筒式建设模式，资源相互隔离且固定投资成本高，为满足业务峰值，需采购大量数据扩容服务器产品等；
        - content: 存储容量不断上升，逻辑存储设备增加，管理复杂和强度增大；
        - content: 业务网缺乏总体发展规划，部分系统或平台的功能定位不清晰，跨部门、跨区域、跨系统的流程界面模糊；
        - content: 系统开发和上线周期长，后期维护和问题定位开销大，平台的独立建设多为烟筒式建设和孤岛化解决方案；
        - content: 业务流程，平台结构和接口缺乏统一规范和要求。
      image: 

    - title: 平台选型
      contentList:
        - content: 作为 DevOps 运维团队，我们需要提供自助化的综合运维平台。在开源平台选型时，公司最终选择了 KubeSphere：
        - content: 1. 完全开源，无收费，可进行二次开发；
        - content: 2. 功能丰富，安装简单，支持一键升级和扩容，完善的 DevOps 工具链；
        - content: 3. 支持多集群管理，用户可以使用直接连接或间接连接导入 Kubernetes 集群；
        - content: 4. 集成可观测性,可按需添加想要监控的指标以及告警，以及日志查询；
        - content: 5. 自定义角色和审计功能，便于后续数据分析。
        - content: 相比其他平台，KubeSphere 更好地规避了 Kubernetes 本身的复杂性，也减少了集成各类开源工具的工作量。这使得我们可以更专注于运维自动化与自助化平台建设，而不需要单独管理底层基础架构与服务。提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。因此 KubeSphere 成为我们满足公司需求的最佳选择。
      image: 

    - type: 1
      contentList:
        - content: Kubernetes 集群部署和升级的方便快捷性
        - content: 集群和应用的日志、监控平台的统一管理
        - content: 简化了在应用治理方面的使用门槛

    - title: 实践过程
      contentList:
        - specialContent:
            text: 基础设施建设与规划
            level: 3
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/hshc-kubesphere-1.svg
    - title:
      contentList:
        - specialContent:
            text: Kubernetes 集群
            level: 3
        - content: 因业务需要，我们将测试、生产两套环境独立开，避免相互影响。生产如上图所示是三个 Matsre 节点，目前为十三个 Node 节点，这里 Master 节点标注污点使其 Pod 不可调度，避免主节点负载过高等情况发生。
        - content: 生产环境使用了官方推荐的 Keepalived 和 HAproxy 创建高可用 Kubernetes 集群高可用 Kubernetes 集群能够确保应用程序在运行时不会出现服务中断，这也是生产的需求之一。
      image: https://pek3b.qingstor.com/kubesphere-community/images/hshc-kubesphere-2.png
    - title:
      contentList:
        - content: 发版工作流示意图：
      image: https://pek3b.qingstor.com/kubesphere-community/images/hshc-kubesphere-3.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/hshc-kubesphere-4.png
    - title:
      contentList:
        - specialContent:
            text: 底层存储环境
            level: 3
        - content: 底层存储环境，我们并未采用容器化的方式进行部署，而是以传统的方式部署。这样做也是为了高效，而且在互联网业务中，存储服务都有一定的性能要求来应对高并发场景。因此将其部署在裸机服务器上是最佳的选择。
        - content: MySQL、Redis、NFS 均做了高可用，避免了单点问题，Ceph 是作为 KubeSphere StorageClass 存储类通过 cephfs 挂载，目前大部分为无状态应用，后续部署有状态应用会对存储进一步优化。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 监控平台
            level: 3
        - content: 为日常高效使用 KubeSphere，我们将集成的监控告警进行配置，目前大部分可满足使用，至于 node 节点，通过单独的 PMM 监控来查看日常问题。
        - content: 告警示例：
      image: https://pek3b.qingstor.com/kubesphere-community/images/hshc-kubesphere-5.png
    - title:
      contentList:
        - content: 监控示例：
      image: https://pek3b.qingstor.com/kubesphere-community/images/hshc-kubesphere-6.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/hshc-kubesphere-7.png

    - title: 使用效果
      contentList:
        - content: 引入 KubeSphere 很大程度的减轻了公司研发持续集成、持续部署的负担，极大提升了整个研发团队生产里项目交付效率。研发团队只需自行在本地实现 function 修复 Bug，之后 Commit 提交代码至 git，然后基于 Jenkins 发布测试环境/生产环境的工程，此时整套 CI/CD 持续集成交付的工作流程就彻底完成了，剩余的联调工作就交给研发。
        - content: 基于 KubeSphere 实现 DevOps，给我们带来了最大的效率亮点如下：
        - content: 1. 平台一体化管理：在服务功能迭代方面，只需要登录 KubeSphere 平台，点击各自所负责的项目即可，极大的减轻了部署工作量，可以通过 Jenkins 结合 KubeSphere，同样能实现项目交付工作，但整套流程相对繁琐，既要关注 Jenkins 平台的构建情况，同时也要关注 KubeSphere 交付结果；造成了诸多不便，也背离了我们交付的初衷,后续我们可能通过 KubeSphere 自带的自定义流水线来统一管理。
        - content: 2. 资源利用率显著提高：KubeSphere 和 Kubernetes 相结合，进一步优化了系统资源利用率，降低了使用成本，最大限度增加了 DevOps 资源利用率。
      image: 
    
    - type: 2
      content: 'KubeSphere 为我们简化了 K8s 集群管理，进一步优化了系统资源利用率，降低了使用成本，最大限度增加了 DevOps 资源利用率。'
      author: '花生好车'

    - title: 未来规划（改进）
      contentList:
        - content: 目前通过这次生产项目中引入 KubeSphere 云原生平台实践，发现确实给我们解决了微服务部署和管理的问题，基于 KubeSphere 平台的能力进行云原生架构的迁移,极大的提高我们的便捷性。负载均衡、应用路由、自动扩缩容、DevOps 等。
        - content: 在平台助力下，我们的研发和运维效率显著提升。我们相信运用 KubeSphere 的云原生平台，服务网格治理、金丝雀、灰度发布、链路追踪必将为公司下一步业务增长提供坚实基础。
      image: 

  rightPart:
    icon: /images/case/logo-hshc.png
    list:
      - title: 行业
        content: 金融
      - title: 地点
        content: 北京
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 资源利用率、多集群、弹性伸缩、可观测性
      - title: 采用功能
        content: 多集群管理，应用治理，监控，告警，日志
---
