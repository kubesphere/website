---
title: yiheda
description:

css: scss/case-detail.scss

section1:
  title:  怡合达
  content: 怡合达自动化专业从事自动化零部件研发、生产和销售，提供 FA 工厂自动化零部件一站式供应。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 东莞怡合达自动化股份有限公司，成立于 2010 年，专业从事自动化零部件研发、生产和销售，提供 FA 工厂自动化零部件一站式供应。公司深耕自动化设备行业，基于应用场景对自动化设备零部件进行标准化设计和分类选型，通过标准设定、产品开发、供应链管理、平台化运营，以信息和数字化为驱动，致力于为自动化设备行业提供高品质、低成本、短交期的自动化零部件产品。
        - content: 公司以“推动智能制造赋能中国制造”为企业愿景，致力于打造行业领先的 FA 工厂自动化零部件一站式供应商。公司以平台化为支撑，以信息和数字化为驱动，充分整合社会资源，链接自动化设备行业上下游资源，以标准设定和产品开发为起点，遵循“产品供给一平台整合一生态驱动”的发展路径，逐渐提高自动化设备中零部件标准化、模块化、组件化的覆盖比例，提升自动化设备供给效率，降低综合成本，最终推动自动化行业的技术进步。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-1.png

    - title: 背景介绍
      contentList:
        - content: 在使用 Kubernetes 之前，公司一直是采用超融合传统虚拟机的方式来部署上线项目，这就导致公司资源浪费非常严重，每年单单在服务器的开销就大大增加。项目在上线的过程中出错的几率非常大，并且难以排查，没有一套规范的流程，需要开发人员手动部署，导致人员消耗非常严重。
        - content: 目前公司拥有 3000+ 的员工，其中研发团队（运维，开发，测试，产品等）超过 300 人，在苏州，湖北都有研发团队。
        - content: 目前行业正在向自动化、云原生靠近，传统的互联网模式已经无法满足大公司的业务需求了，为了让开发人员将更多的精力放在业务上，自动化部署、项目的全方位监控就变得越来越重要。目前公司云原生是刚刚起步，很多东西需要去探索发现，所以技术上有很多欠缺，需要非常细致地理解各个组件的运行原理和模式。
      image: 

    - title: 选型
      contentList:
        - content: 在使用 KubeSphere 之前，我们也使用了很多其他的项目，如 KubeOperator，DaoCloud，Choerodon等。但是在使用过程中发现，其他工具的功能并不是很完善，遇到问题很难排查，社区也不是很活跃，这就导致我们的使用成本和维护成本大大增加。
        - content: 经过实践使用 KubeSphere 搭建的集群更加稳定，资源管控更加便捷，与同类云原生产品相比，KubeSphere 几乎实现了我们在生产环境会用到的所有功能。于是我们就开始在测试环境搭建并使用，随后慢慢地向生产环境迁移。目前我们公司有三分之一的项目已经迁移到 KubeSphere 平台上，并且回收了之前的旧服务器，大大提高了资源使用率。
      image: 

    - type: 1
      contentList:
        - content: 提升资源利用率
        - content: 全方位项目管控
        - content: 规范项目部署发版流程

    - title: 实践过程
      contentList:
        - specialContent:
            text: 基础设施与部署架构
            level: 3
        - content: 目前我们使用私有环境来搭建 Kubernetes 与 KubeSphere，因为是在我们内部使用，所以不考虑在云上进行搭建。
        - content: 基础服务器采用的是 Linux CentOS 7，内核版本是 5.6。
        - content: 在搭建 Kubernetes 集群时，我选择使用 Keepalived 和 HAproxy 创建高可用 Kubernetes 集群，其中包括两个负载均衡入口。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-2.png
    - title:
      contentList:
        - content: 然后是 3 个 Master 节点，3 个 Worker 节点，一个 Etcd 集群，因为是多集群，我会为公司每个项目创建一个集群，所以我们单个集群分配的资源不是很多，当资源不够使用时需要进行申请。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-3.png
    - title:
      contentList:
        - specialContent:
            text: 平台的存储与网络
            level: 3
        - content: 平台的持久化存储我们使用的是第三方杉岩，这就需要对方来提供存储卷和创建存储系统空间，所以在这里就不做过多介绍。大家也可以使用开源的存储插件来做，KubeSphere 文档中提到了很多开源存储插件，使用起来也非常的方便。
        - content: 在集群内部我们采用的是 Calico CNI 插件负责集群的内部通讯，当我们的服务部署至 Kubernetes 集群时会产生一个内部访问地址，这个地址在我们集群内是可以 ping 通和访问的，但外部无法访问。
        - content: 所以在外部网络通讯方面我做了两套方案：
        - content: 1. 考虑到我们之前的项目使用 APISIX 作为网关路由，所以我们就在集群内搭建了 APISIX：
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-4.png
    - title:
      contentList:
        - content: 搭建方式也非常简单，创建一个 APISIX 模板，再创建一个应用就可以了：
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-5.png
    - title:
      contentList:
        - content: 创建完成之后集群内的项目就可以使用 APISIX 了，将 APISIX 开启对外访问，作为集群的唯一入口，接下来在服务中创建路由，就会在 APISIX 中自动生成一条路由规则与上游服务：
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-6.png
    - title:
      contentList:
        - content: 2. 第二种方案则是使用负载均衡器 OpenELB，OpenELB 官方提供了三种模式，我们选用的是 Layer2 模式，因为 BGP 和 VIP 需要机器的支持，就暂时没有搭建，后续会考虑改用另外两种模式对外访问。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-7.png
    - title:
      contentList:
        - content: 但是需要注意的是，通过应用商店进行安装一定要注意集群的内存空间是否充足，否则会导致集群监控组件异常。
        - content: 安装完成之后，我们只需要开启 strictARP： true，并设置 EIP 池就可以了，然后我们在部署服务时加上注解。将 type 改为 LoadBalance，就会在我们的 IP 池中获取一个对外访问的 IP 分配给服务进行对外访问了。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-code.png
    - title:
      contentList:
        - specialContent:
            text: 日志与监控
            level: 3
        - content: 我们搭建了一套 EFK 的日志系统，通过 Filebeat 收集服务端的数据，再通过 Kafka 发送到 es 中，然后通过 Kibana 查询日志数据，另外我们增加了一套 SkyWalking，它会给我们生成一个链路 ID，这样我们就可以根据这个链路 ID 直接查找当前请求下的所有日志。
        - content: 在监控方面除了 KubeSphere 自带的监控之外，我们还用了一套外部的监控系统：
        - content: 主机层面：Prometheus + General
        - content: 服务层面：SkyWalking
        - content: 包括服状态的监控以及所有的告警
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-8.png
    - title:
      contentList:
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-9.png
    - title:
      contentList:
        - specialContent:
            text: CI/CD
            level: 3
        - content: 我们开启了 KubeSphere 的 DevOps 模块，里面集成了 Jenkins，流水线的构建，实现了项目从拉取代码，质量检查到项目部署一键化的流程。
        - content: 在 DevOps 模块中用的是自定义 GitLab 仓库，如果是自己实践的话可以去 KubeSphere 应用商店中下载使用，在这里我就介绍一下自定义实现。
        - content: 首先需要打开 KubeSphere 自带的 Jenkins，进入页面创建一个 GitLab 的凭证，然后在系统配置自定义 GitLab 的地址。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-10.png
    - title:
      contentList:
        - content: 这里的凭据就是我们刚刚创建的 GitLab 凭据，地址就直接填自己仓库的地址，然后就可以在 KubeSphere 中看到刚刚填写的地址了。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-11.png
    - title:
      contentList:
        - content: 根据官方文档创建的流水线，其中有些地方需要自己指定。
        - content: 在 Jenkins 中是提供一个 Maven，在这里我需要改成自定义的 Maven，不然项目构建的时候会失败，我们只需要在 configMap 中修改 setting.xml 文件就可以了。
        - content: 镜像仓库用的是自定义 Harbor 仓库，要在 Harbor 中先创建存放镜像的地址，然后创建权限，在 KubeSphere 中添加凭证就可以使用了。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-12.png
    - title:
      contentList:
        - content: 在使用流水线之前一定要把 GitLab、Kubernetes、镜像仓库的凭证建好，后面直接使用就可以了。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-13.png
    - title:
      contentList:
        - content: 一些前置的条件配置好之后就可以直接去创建流水线了。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-14.png
    - title:
      contentList:
        - content: 运行后可以看到运行记录。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-15.png
    - title:
      contentList:
        - content: 流水线跑完之后就可以在项目中看到之前部署的项目了。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-yiheda-16.png
    - title:
      contentList:
        - content: 包括服务和容器组，在里面就可以对项目进行管理了，包括负载均衡，网关，路由，扩容等一些操作。
      image: 

    - title: 使用效果
      contentList:
        - content: 1. 在使用 KubeSphere 之后，我们所有的项目都集中在一起了，管理起来方便很多，服务器的资源也很大程度的减少，在资金方面节省了很多。
        - content: 2. 项目上线现在只需要创建执行流水线就可以了，再根据定时任务定时执行，并且项目可以自动增加副本，项目启动失败会自动回滚到之前的版本。
        - content: 3. 在业务方面，接口的请求时间降低了，用户的使用体验也增加了不少，出现 bug 能够快速的定位并解决问题。
      image: 
    
    - type: 2
      content: 'KubeSphere 提供了项目一站式的部署，管理，监控流程，最大化的分配资源使用率，提高项目的稳定性，降低了维护成本和人员消耗。'
      author: '怡合达'

    - title: 未来规划
      contentList:
        - content: 未来我们将把公司内部系统与 KubeSphere 完全打通，成立云原生小组来负责云原生的研发工作。
        - content: 公司的服务器资源将完全回收，将会以集群分配的方式管理项目，之后会自研一些插件和组件使用并进行开源。
      image: 

  rightPart:
    icon: /images/case/logo-yiheda.png
    list:
      - title: 行业
        content: 智能制造供应链
      - title: 地点
        content: 中国东莞
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 资源利用率，大规模项目管理，人员资源分配
      - title: 采用功能
        content: DevOps，多集群管理，日志，OpenELB
---
