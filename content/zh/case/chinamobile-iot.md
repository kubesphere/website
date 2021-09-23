---
title: chinamobile-iot
description:

css: scss/case-detail.scss

section1:
  title: 中移物联网
  content: 中移物联网有限公司是中国移动通信集团有限公司的全资子公司，是中国移动在物联网领域的主责企业。
section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 中移物联网有限公司是中国移动通信集团有限公司的全资子公司，是中国移动在物联网领域的主责企业。公司定位为物联网核心能力的锻造者、物联网专业市场的领导者、全网物联网业务的支撑者、科技型企业改革的示范者。公司聚焦物联网业务能力建设与市场拓展，重点围绕物联网基础通用能力、视频物联网（VIoT）、智能物联网（AIoT）、产业物联网（IIoT）打造物联网核心技术和产品，支撑全网物联网业务发展。
      image: https://pek3b.qingstor.com/kubesphere-community/images/Chinamobile-iot-1.jpeg

    - title: EdgeBox 简介
      contentList:
        - content: 中移物联网是中国移动集团在物联网方向的专业研发子公司，在各个垂直行业都有非常丰富和完成的解决方案。
        - content: 本文通过中移物联网的物联网边缘计算解决方案：OneCyber 5G 边缘网关，简称 OneCyber EdgeBox (下文统称为 EdgeBox)，介绍中国移动在基于 Kubernetes 的物联网边缘计算应用实践。
        - content: 首先对边缘计算做一个简要的介绍，边缘计算是一种在数据源头侧提供运算、存储、网络等的IT能力，用以降低数字化转型的成本、提高资源利用率、增强业务的灵活性。
        - content: 下图展示了边缘计算的总览和分类。图中上半部分称为轻边缘，也叫远边缘，因为边缘计算的算力距离用户和现场比较近，经常作为物联网的网关设备呈现在用户面前。而图中下半部分称为重边缘，也叫近边缘，也就是我们通常所说的 MEC，MEC 的运算、存储、网络等IT能力都比轻边缘强的多，在 MEC 部署的业务的应用就在边缘端处理用户请求和流量，不能处理的才继续上行到中心 DC 或云端。
      image: https://pek3b.qingstor.com/kubesphere-community/images/edgecomputing.png
    - title: 
      contentList:
        - content: 本文介绍的 EdgeBox 就是远边缘的典型应用，以智能边缘硬件的形式部署在用户现场，和云端的边缘计算管理平台进行云边协同，将云端的应用和能力延申到边缘侧。
        - content: EdgeBox 作为中国移动旗下的远边缘计算整体解决方案，提供以下的核心能力：
        - content: 1. 智能边缘硬件(支持 5G)
        - content: 2. 边缘基础设施管理
        - content: 3. 边缘容器应用管理
        - content: 4. 云边协同能力
        - content: 5. 边缘应用商城
        - content: 6. IoT 设备多协议接入服务
        - content: 7. 数据集成/数据分析服务
        - content: 8. 丰富的行业 AI 算法
    - title: 
      contentList:
        - content: 下图展示了 EdgeBox 解决方案的构成，包括智能边缘硬件和物联网边缘计算平台。
      image: https://pek3b.qingstor.com/kubesphere-community/images/edgebox.png
    - title: 
      contentList:
        - content: 智能边缘硬件在边缘侧提供设备接入，边缘应用等能力，并通过云边协同能力和云端的物联网边缘计算平台进行交互。物联网边缘计算平台在云端提供应用商城，边缘管理等能力，并通过标准接口和第三方平台进行对接。
        - content: 智能边缘硬件主要分为 EdgeBox-A 系列和 EdgeBox-V 系列。EdgeBox-A 系列定位为通用边缘 APP 一体机，基于通用 CPU 和标准操作系统，侧重于承载边云一体化应用。而 EdgeBox-V 系列则定位为 AI 机器视觉一体机，通过配置神经网络 ASIC，侧重边缘侧的视频和图像分析。

    - title: 物联网边缘计算平台
      contentList:   
        - content: 下图展示了 EdgeBox 解决方案中物联网边缘计算平台的组件构成。
      image: https://pek3b.qingstor.com/kubesphere-community/images/iot-edgecomputing.png
    - title:
      contentList:
        - content: 上图中，物联网边缘计算平台主要由蓝色部分的边缘计算基础设施能力和红色部分的由应用带来的扩展能力构成。边缘计算基础设施能力的部分称之为边缘计算平台，而由应用带来的扩展能力的部分称之为应用使能平台。
        - content: 边缘计算平台主要提供以下能力：
        - content: 1. 边缘基础设施管理
        - content: 2. 边缘容器应用管理
        - content: 3. 云边协同能力
        - content: 4. 边缘应用商城 (丰富的行业 AI 算法)
        - content: 应用使能平台则主要提供以下能力：
        - content: 1. IoT 设备多协议接入服务
        - content: 2. 数据集成/数据分析服务
        - content: 边缘计算平台和应用使能平台，共同构成了 EdgeBox 解决方案中云端的物联网边缘计算平台。下面就分别对这两个平台进行详细的说明。
      image: 
      
    - title: 边缘计算平台
      contentList:   
        - content: 边缘计算平台在 EdgeBox 整体解决方案中作为边缘计算的底座，提供边缘基础设施和应用的基础管理能力。有了边缘计算平台，才可以通过应用等方式扩展整个解决方案的能力。
        - content: 边缘计算平台主要提供以下六大类基础能力：
        - content: 1. 边缘节点管理：统一管理边缘计算硬件，提供认证、监控、配置下发等功能。
        - content: 2. 云边协同能力：所有边缘硬件资源纳入统一资源池进行协同管理；为边缘应用提供云边数据通道和云边管理通道，让业务在云和边之间无缝协同。
        - content: 3. 容器镜像管理：镜像仓库可以在用户维度进行容器镜像管理。
        - content: 4. 边缘应用管理：统一管理边缘应用，提供应用部署、配置下发、应用监控、远程调试。
        - content: 5. 边缘应用市场：统一收纳客户边缘业务应用，方便维护应用版本、部署模板。
        - content: 6. 云端集群管理：统一管理云端多 K8s 集群，提供统一视图并有效扩展业务规模。
    - title: 
      contentList: 
        - content: 为了提供上述的六大类边缘计算的基础能力，边缘计算平台的架构需要相应的组件和模块进行支撑。边缘计算平台的技术架构如下图所示。
      image: https://pek3b.qingstor.com/kubesphere-community/images/arch-edgecomputing.png
    - title: 
      contentList:   
        - content: 上图中，主要的组件和模块的作用解释如下。
        - content: 北向 API 层：边缘计算的资源建模，包括边缘节点，边缘应用等，同时负责向用户和第三方平台提供北向 REST API，以及持久化和缓存处理。
        - content: 多集群容器云平台：向北向 API 层提供节点，容器，和多集群的管理能力，南向管理 EdgeBox 的云端代理和承载云端代理的 K8s 集群。
        - content: EdgeBox 云端代理：云边协同的云端代理服务，部署在云端 K8s 集群中，提供边缘节点接入和向边缘端的资源同步等。
        - content: EdgeBox 边缘管理：云边协同的边缘代理服务，安装在智能边缘硬件上，提供边缘应用的运行环境和向云端的资源同步等。
        - content: 应用市场：管理镜像和边缘应用。
    - title: 
      contentList:   
        - content: 根据以上的架构设计，EdgeBox 的边缘计算平台在部分组件上需要集成开源软件来避免重复造轮子。其中多集群容器云平台和 EdgeBox 的云端以及边缘代理是选型的重点。
        - content: 最终边缘计算平台的选型结果如下图所示。
      image: https://pek3b.qingstor.com/kubesphere-community/images/edge-computing-platform.png
    - title: 
      contentList:   
        - content: 多集群容器云平台的选型最终敲定为 KubeSphere，理由是 KubeSphere 有如下的优势和能力：   
        - content: 1. 无缝集成 KubeEdge
        - content: 2. 边缘资源监控/运维
        - content: 3. 北向 API 完备丰富
        - content: 4. 开源社区比较活跃
        - content: 5. 用户多商用案例多  
    - title: 
      contentList:   
        - content: EdgeBox 云端代理和边缘代理的选型最终敲定为 KubeEdge，理由是 KubeEdge 拥有如下的优势和能力：
        - content: 1. 云边协同
        - content: 2. 边缘自治
        - content: 3. 边缘设备管理
        - content: 4. 轻量化边缘
    - title: 
      contentList:   
        - content: 基于 KubeSphere 和 KubeEdge 的既有能力，EdgeBox 解决方案也自研和增强了一部分特性，当前包括如下六大类：
        - content: 1. 节点管理：包括边缘节点纳管增强认证，边缘节点的属主信息，边缘节点的预置应用下发，边缘节点的数字连接关联等。
        - content: 2. 节点组：包括节点加入/退出节点组，应用在节点组内自动调度，节点故障时应用重调度，亲和/反亲和调度规则指定。
        - content: 3. 应用市场：包括适用于边缘场景的应用市场，应用审核，应用上下架，合作伙伴开发丰富行业应用，用户购买第三方提供应用。
        - content: 4. 云边消息：包括云边用户消息和数据通道，云边 REST 和 MQTT 双向通道，云边 REST 和 REST 双向通道。
        - content: 5. 云边文件传输：基于云边消息的文件传输服务。
        - content: 6. 公有云运维监控：引入 IPAM 的 IP 冲突解决，提供用户边缘容器运维/监控。
        - content: 综本章节所述，边缘计算平台通过基于 KubeSphere 和 KubeEdge 的开源框架，及规划的自研特性和能力，为 EdgeBox 解决方案提供了边缘计算的基础设施管理和云边协同能力，为物联网应用和平台提供了基础和底座。


    - type: 1
      contentList:
        - content: 丰富了集群监控指标
        - content: 支持统一纳管 KubeEdge 边缘节点
        - content: 提升了边缘容器的调试和运维效率

    - title: 应用使能平台
      contentList:
        - content: 应用使能平台基于边缘计算平台，通过物联网或其他垂直行业的边缘应用，以及相应的云端平台或服务，向用户提供完整的具有云边协同能力的行业解决方案。本章节着重介绍应用使能平台的两种套件，数字连接套件和数据集成套件。
        - specialContent:
            text: 数字连接套件
            level: 3
        - content: 数字连接套件提供物联网设备接入、多协议解析、协议转换、命令下发等一站式连接能力。支持电信级可靠、海量接入、跨机房部署。
        - content: 数字连接套件的技术架构如下图所示。
      image: https://pek3b.qingstor.com/kubesphere-community/images/digital-connecting-kit.png
    - title: 
      contentList:
        - content: 数字连接套件的适用场景，包括但不限于公有协议设备直连接入，私有协议设备接入，设备管理通用能力等。
        - content: 套件的能力包括：
        - content: 1. 支持各种协议设备接入，如 MQTT、LWM2M 和其他私有协议。
        - content: 2. 提供完整的设备生命周期管理功能，支持设备创建、功能定义、数据解析、在线调试等。
        - content: 3. 支持产品物模型，对产品添加属性、事件和服务。
      image: 
    - title:
      contentList:
        - specialContent: 
            text: 数据集成套件
            level: 3
        - content: 数据集成套件作为适配中间件，用于异构平台之间的数据对接，提供多种数据源采集能力和数据目的推送能力，以及数据缓存、抽取、变形等处理能力，打通个各业务孤岛，实现数据互联互通，助力企业数字化转型。数据集成套件的技术架构如下图所示。
      image: https://pek3b.qingstor.com/kubesphere-community/images/digital-intergration-suite.png
    - title:
      contentList:
        - content: 数据集成套件的适用场景，包括但不限于异构系统之间需要数据同步，场景联动，事件触发动作，以及作为规则引擎对采集的数据进行条件过滤等。
        - content: 套件的能力包括：
        - content: 支持多种异构数据源间的同步，如 HTTP、Kafka、MQS、数字连接设备属性、状态等。
        - content: 支持按时间（定时、周期、实时）、同步方式（主动调用、被动监听）等任务触发规则来调度任务。
        - content: 支持数据路由、数据转换等丰富的数据处理控件和内置函数。
      image: 

    - type: 2
      content: 'KubeSphere 对 Kubernetes + KebeEdge 云边系统进行了无侵入式的封装与扩展，完善了边缘容器的运维和监控功能。'
      author: '中移物联网'

    - title: 未来展望
      contentList:
        - content: 本文介绍了中国移动在物联网边缘计算赛道上的应用实践，也就是 5G 边缘网关 EdgeBox 解决方案。EdgeBox 基于 KubeSphere 和 KubeEdge，再加以规划和自研的强大特性和能力，给物联网边缘计算领域带来了开箱即用的整体解决方案。
        - content: 在 EdgeBox 后续的能力迭代中，基于当前的开放和易扩展架构，EdgeBox 规划了丰富的高级特性，例如：
        - content: 1. 支持边缘侧的 Kubelet 和 KubeProxy 等原生组件，使用户的云原生基础设施和资源无需做任何变更即可在边缘部署和应用
        - content: 2. 支持边缘侧的多集群管理，用户的资源能够在边缘侧的多集群中做到协同部署和扩缩容，让用户在边缘侧同样体验到多集群管理的能力
        - content: 3. 将整个解决方案上架移动公有云，同时支持私有部署和服务公有云用户
        - content: 如上这些都是在业界比较前沿的边缘计算能力和模式。
        - content: 未来，得益于 EdgeBox 开放和易扩展的技术架构，我们相信 EdgeBox 必定能够赋能各行各业，为 5G 新基建和数字化转型添砖加瓦。
      image: 

  rightPart:
    icon: /images/case/chinamobile-iot.png
    list:
      - title: 行业
        content: 物联网
      - title: 地点
        content: 中国
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 集群监控，边缘应用容器运维和监控
      - title: 采用功能
        content: 以边缘计算为主的多项能力

---
