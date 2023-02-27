---
title:  bobinfo
description:

css: scss/case-detail.scss

section1:
  title:  好上好信息
  content: 好上好信息是中国大陆一家致力于为中国智造提供全面支持的综合服务商。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 好上好信息（001298）是中国大陆一家致力于为中国智造提供全面支持的综合服务商。总部位于深圳，员工 500 多人，旗下拥有北高智、天午、大豆、蜜连和泰舸等子公司。主营业务包括电子元器件分销、物联网产品设计及芯片定制业务。好上好信息采用“集团大平台+子公司业务自主”的运营模式，各个子公司在业务层面独立经营和管理，在仓储物流、资金信贷、IT 信息系统、方案设计等后台资源方面全面共享。
        - content: 其子公司大豆电子致力于互联网智能家居的整体解决方案、为物联网生态提供蓝牙模组、WIFI 模组等定制化组件，蜜连科技提供物联网整体方案开发，主要为共享产品赋能，如共享单车、共享充电宝、共享纸巾机、共享咖啡机、环保塑料袋取袋机等。
      image: 

    - title: 背景介绍
      contentList:
        - content: 各子公司引入物联网业务初期，分为两个团队，独立开发各自业务，资源分配上也是以满足当前业务需求为主，要求能快速开发功能，快速上线，人员投入相对较多，因项目开发较早，技术选型相互独立，系统架构独立设计，大豆电子以 Spring boot 为主，蜜连科技以 Python Flask 为主，搭配 Golang 做中间件消息处理。
        - content: 随着业务交叉重合增多，旧的体系架构存在如下弊端：
        - content: 各子公司独立开发，业务直接部署在 ECS 运行；
        - content: 数据层相互独立部署在单独的 ECS 中使用；
        - content: 子公司间相关联业务调用，通过第三方云云接口交互；
        - content: 部署需人工打包，上线，无 CI/CD；
        - content: 增加新的 ECS 提供服务时，部署操作复杂；
        - content: 资源无法动态分配利用；
        - content: 监控引入 Prometheus，各部分功能自行配置实现。
        - content: 旧业务架构如下：
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-hsh-1.png

    - title: 选型
      contentList:
        - content: 为解决当前架构中存在的业务中存在的问题，引入 K8s + Docker 对现有容器进行改造，同时进行新业务扩展。
        - content: 在进行 K8s 调研及使用时，学习一众 K8s 相关技术，并搭建出一整套的 K8s 集群进行测试对比，K8s 官方提供的管理平台，操作方式繁杂，搭建过程比较复杂，在研究 K8s 的过程中，通过网络分享了解到 KubeSphere 平台。
        - content: 经对比后发现：
        - content: KubeSphere 是 Kubernetes 之上构建的面向云原生应用的分布式操作系统,包含了 K8s 所能实现的所有功能；
        - content: KubeSphere 在 K8s 的基础上，提倡开箱即用，内置多种可配置插件，为使用者提供相对最优解决方案；
        - content: KubeSphere 提供多租户管理，监控告警等各种监看功能；
        - content: KubeSphere 管理界面对比 K8s 简洁明了，操作方便；
        - content: KubeSphere 提供 Kubekey 快速集群搭建，只需要简单的几个配置修改，便可完成 K8s 集群，KubeSphere 管理页面等众多复杂的安装部署工作；
        - content: KubeSphere 为国内开源项目，提供丰富的示例文档、视频教程、开源社区等，出现问题时更快速的找到解决方案。
        - content: 目前，我同新业务使用 SpringCloud 微服务业务进 KubeSphere 生产集群、 KubeSphere 测试集群来满足我司业务的开展，使用 GitLab+Harbor+KubeSphere 提供的 DevOps，实现 CI/CD，实现快速部署，高效监看。
      image: 

    - type: 1
      contentList:
        - content: 便捷搭建 K8s 集群 
        - content: 高效 CI/CD 
        - content: 人性化集群监控

    - title: 实践过程
      contentList:
        - specialContent:
            text: 硬件资源
            level: 3
        - content: 阿里云 ECS(8C 16G) 12 台。阿里云 SLB 1 台。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 资源分配
            level: 3
        - content: 生产集群： 阿里云 SLB 1 台、阿里云 ECS 8 台；
        - content: 测试集群： 阿里云 ECS 3 台；
        - content: 代码及 BUG 管理：阿里云 ECS 1 台。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 部署架构
            level: 3
        - content: 生产环境：为满足 K8s 集群服务需要做到高可用，需要保证 kube- apiserver 的 HA ，使用了阿里云 SLB 的方式进行高可用配置，具体部署结构如图；
        - content: 测试环境：使用三台 ECS 搭建 KubeSphere 集群，其中 Master 同时做 worker 节点使用(不推荐)；
        - content: 代码及缺陷追踪系统： 单独使用一台 ECS 使用 Docker 搭建，方便迁移与维护，为集团内所有技术开发人员提供 Git Server 及 mantis 服务；
        - content: 数据存储：数据存储层使用阿里 NAS 文件系统，方便数据快照备份及容量扩展；
        - content: 互联网文件分发：使用阿里云 OSS + 阿里云 CDN 进行分发内容。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-hsh-2.png
    - title:
      contentList:
        - specialContent:
            text: 系统架构图
            level: 3
        - content: 采用标准 Springboot 微服务架构，业务层、中间件层、数据层、CI/CD 均使用 KubeSphere 进行部署，使用 K8s 标准存储类进行数据存储，中间件及数据层的配置数据及加密数据，则使用 K8s 配置字典和保密字典。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-hsh-3.png
    - title:
      contentList:
        - specialContent:
            text: 数据存储类
            level: 3
        - content: 平台存储部分使用 Kubersphere 安装时提供的 OpenEBS，业务及中间件数据均采用阿里 NAS 使用，方便业务数据备份。
    - title:
      contentList:
        - specialContent:
            text: 云平台 CI/CD 实践
            level: 3
        - content: CI/CD 流程图：
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-hsh-4.png
    - title:
      contentList:
        - content: CI/CD 简述：
        - content: 开发人员提交代码；
        - content: Gitlab 触发推送事件；
        - content: GitLab 调用回调钩子触发 Jenkins 构建任务；
        - content: Jenkins 根据构建任务中流水线脚本进行任务执行，拉取代码、Maven 编译、Docker 构建、Docker 推送 Harbor、执行部署脚本、企业微信通知。
        - content: CI/CD 工作流：
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-hsh-5.png
    - title:
      contentList:
        - specialContent:
            text: 日志系统
            level: 3
        - content: 一部分，集群运行日志及容器运行日志，采用 KubeSphere 默认提供的 ES 进行收集存储；
        - content: API 业务部分日志采用 logstash + ElasticSearch 进行收集落盘，采用 kibana 进行日志读取及查看。
      image: 

    - title: 使用效果
      contentList:
        - content: 安装 KubeSphere 环境非常便捷，基本上属于开箱即用；
        - content: CI/CD 大大简化了开发部署成本；
        - content: KubeSphere 内置的多种稳定高效组件，保证集群的稳定运行；
        - content: KubeSphere 可以使用第三方 Helm 仓库，方便安装 Helm 应用，在安装中间件上，简化了原有的编写 yml 文件的过程。
      image: 
    
    - type: 2
      content: 'KubeSphere 让 K8s 变的更简单，集成大量优秀的第三方常用组件，开箱即用，省去了第三方组件选型及安装，大大降低了从 0 到 K8s 集群运行的难度。'
      author: '好上好信息'

    - title: 未来规划
      contentList:
        - content: 目前公司新业务运行在 KubeSphere 集群，未来规划将旧业务平滑迁移进 KubeSphere 集群；
        - content: 目前微服务 Spring Cloud，治理采用 sentinel，更多新业务有可能选用 Golang 开发，届时会使用的网关的无侵入功能。
      image: 

  rightPart:
    icon: /images/case/logo-hsh.png
    list:
      - title: 行业
        content: 智能家居
      - title: 地点
        content: 中国深圳
      - title: 云类型
        content: 公有云
      - title: 挑战
        content: 动态扩缩容、容器化部署、高可用、集群观测
      - title: 采用功能
        content: DevOps、集群监控报警、应用商店、负载管理
---
