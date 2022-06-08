---
title: sinodata
description:

css: scss/case-detail.scss

section1:
  title: 北京中科金财科技股份有限公司
  content: 北京中科金财科技股份有限公司成立于 2003 年 12 月，是国内领先的区块链技术与金融科技综合服务商，致力于打造领先的产业互联网科技赋能平台。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 北京中科金财科技股份有限公司成立于 2003 年 12 月，是国内领先的区块链技术与金融科技综合服务商，致力于打造领先的产业互联网科技赋能平台。2012 年 2 月 28 日公司在深圳证券交易所成功上市（股票代码：002657），是“中国软件和信息服务业十大领军企业”、“高新技术企业” 、“中国支付清算协会会员”、“北京市企业技术中心”、“北京区块链技术应用协会会长单位”、“国家火炬计划产业化示范项目” 。 
        - content: 以金融科技解决方案与数据中心综合服务为基础，中科金财深耕金融、政府、教育等行业用户，目前已为人民银行、银保监会、证监会、银联、银行间交易商协会、支付清算协会及近 600 家银行金融机构总部客户提供服务。
        - content: 中科金财致力于成为领先的产业互联网科技赋能平台，公司面向政府监管部门、金融机构、产业互联网、工业互联网用户提供基于区块链 BaaS（区块链即服务）平台与多方安全计算平台的技术服务，以解决防篡改、隐私保护、可追溯等痛点。
        - content: 始于金融科技，放眼价值互联。未来，中科金财将以区块链 BAAS 服务平台、多方安全计算平台、区块链公共服务平台为基础，继续以科技服务金融和监管，携手合作伙伴，深耕行业场景，帮助产业客户实现从 IT 到 DT 到 AT 的技术升级。
      image: 

    - title: 业务介绍：公司区块链战略
      contentList:
        - content: 自 2019 年 10 月 24 日区块链上升为国家战略至今已满两年。继 20 年区块链被纳入“新基建”后，21 年 3 月份，区块链被写入《中华人民共和国国民经济和社会发展第十四个五年规划和 2035 年远景目标纲要》，规划提出培育壮大区块链等新兴数字产业。
        - content: 公司研究政策趋势并结合多年 B 端科技服务的经验，将区块链技术及应用建设纳入公司的战略，持续在区块链技术底层、上层业务应用及整体运维管理方面进行建设。
      image: 

    - title: 业务介绍：区块链平台的定位
      contentList: 
        - content: 区块链技术集众多技术之大成，且在行业中的应用价值方面还处于不断探索的阶段。从底层链技术方面来看，国外的联盟链 Fabric、公链以太坊等，国内的开源联盟链 fisco bcos、政府背书的星火链，长安链，树图等，同时国内还有一些企业自主开发的区块链技术，如趣链公司的区块链、中科金财的中科金链、天河国云的天河链、复杂美的 chain33。
        - content: 不同的链底层技术所涉及的部署、维护、应用接入方式都可能不太一样，造成了开展行业应用的成本较高，而为了降低用户在接入和维护区块链设施时的实践成本和学习成本，且尽可能的适配不同的技术底层，在区块链中间件的标准定义下，需要一套区块链即服务（Blockchain as a Service）平台。
      image: 

    - title: 背景介绍：BaaS 平台的建设现状
      contentList:
        - content: 中科金财于 2018 年已开展 BaaS 平台的建设，采用相对成熟稳定的应用架构进行开发，逐渐加入了基于多租户的 RBAC 权限体系、资源及区块链网络监控、区块链动态部署及节点管理等功能，并在一些项目场景中投入使用。
        - content: 但由于整体架构的缺陷，在部署效率、部署资源动态管理、区块链网络服务状态实时监控、账本高可用、证书托管等方面遇到了较大的技术难度，进一步迭代升级的成本非常大。因此重新进行 BaaS 的总体设计，拥抱 Kubernetes、拥抱云原生变得非常重要。
      image:
    
    - title: 背景介绍：BaaS 为什么拥抱云原生
      contentList:  
        - content: 云原生是关于速度和敏捷性的，有利于各组织在公有云、私有云和混合云等新型动态环境中，构建和运行可弹性扩展的应用，能够构建容错性好、易于管理和便于观察的松耦合系统。
        - content: 符合云原生架构的应用程序应该是采用开源技术栈（Kubernetes+Docker）进行容器化部署，利用基础设施管理能力实现资源弹性伸缩、服务动态部署与资源利用率优化等。
        - content: 中科金财 SinoBaaS 平台在对区块链网络进行动态部署管理、运行检测、资源弹性扩充等方面的迫切需求与云原生的一些特点非常契合，因此在新的版本改造过程中决定全面集成 Kubernetes。
      image: 

    - title: 方案选型
      contentList:
        - content: 在决定拥抱云原生架构的时候我们选型决定要使用其中非常活跃和成熟的 Kubernetes 作为我们平台的底层支撑，但是 Kubernetes 整体系统比较复杂学习成本比较高，对非专业用户使用非常不友好。综合考虑之后我们决定选择一个较完善的 Kubernetes 发行版本。我们针对市场上一些比较流行的平台做了评估，最终选择了 KubeSphere 作为我们的管理平台。
        - content: 选择 KubeSphere 主要原因有以下几点：
        - content: 1. KubeSphere 代码开源，这对于我们后期进行二次开发非常有利；
        - content: 2. KubeSphere 整体功能比较完善，也集成了非常多的功能插件，通过这些插件不仅能够快速搭建一套稳定的环境且更有利于我们后期和 BaaS 平台做融合 ;
        - content: 3. KubeSphere 的整体口碑评价很高，社区交流与官方支持都比较活跃 ;
        - content: 4. KubeSphere 是国内的青云公司开发的，整体设计比较贴合国人的使用习惯这极大的降低了学习成本。
      image: 

    - title: 整体融合
      contentList:
        - content: KubeSphere 拥有一套非常完善的配套功能，这让我们只需要重点关注区块链相关的功能组件开发就可以。中科金财 BaaS 平台在 KubeSphere 上做了以下融合：
        - content: 1. 新增联盟管理组件，其中主要包含了区块链网络创建；区块链信息概览；组织、通道、链码管理；交易详情查询；数据存证；资产转账等功能。
        - content: 2. 依托 KubeSphere 的用户角色体系构建区块链网络盟主等用户角色体系。
        - content: 3. 通过 KubeSphere 提供的日志、监控、审计等服务组件对区块链网络中的节点进行运维监管。
        - content: 4. 定制化 ks-installer 安装工具，实现快速标准化的搭建一套稳定的 BaaS 平台。
      image: 

    - title: 实践过程
      contentList:
        - specialContent:
            text: 平台的整体架构
            level: 3
        - content: 中科金财针对 BaaS 平台所需要具备如灵活部署、资源动态伸缩管理、可视化运维、细颗粒度监控与预警、运行高可靠等方面的核心能力，进行了中科金财区块链即服务平台 SinoBaaS 的总体设计，设计图如下：
        - content: 1. 安全可控：提供基于 RBAC 的级权限管理体系、提供日志审计，全方位保障平台与服务的安全可靠；
        - content: 2. 极速上手：通过对区块链应用于生态的构建提供全流程赋能，帮助用户专注于业务应用层的创新与接入，降低区块链使用门槛；
        - content: 3. 高可用性：支持平台、链节点的集群化部署，可以按需动态扩容，满足企业级安全需求；
        - content: 4. 智能运维：支持为提供联盟链、节点、主机等多维度的实时监控服务，通过 Dashboard 提供丰富的图表展现形式，实现监控数据的可视化，轻松了解链、节点、主机等资源的运行健康状态；
        - content: 5. 支持可插拔形式的多种区块链底层（中科金链和 Hyperledger Fabric 等）在不同环境中的多种部署模式（云主机、物理机)，灵活满足业务层技术选项，降低对于环境属性的依赖，可以持续集成管理市场上其他的链技术底层；
        - content: 6. 高扩展性：支持通过加入自定义插件、第三方云原生插件来扩展平台的性能，比如加入 CA 服务插件，可集中化进行插件的管理。
      image: https://pek3b.qingstor.com/kubesphere-community/images/sinobaas-architecture.png
    - title:
      contentList:
        - specialContent:
            text: 平台所采用的存储方案
            level: 3
        - content: SinoBaaS 在初期的实践中使用了 PersistentVolume 的 localhost 模式，这种方式使得区块链节点对物理节点的耦合性非常高，且证书也都保存在物理环境中，使得 Kubernetes 的自动调度的特性被严重限制了。在组建区块链网络中还需要通过证书加密，证书保存到本地安全隐患也非常高，一旦磁盘损坏可能会导致证书丢失，失去了证书的节点服务就跟失去了身份的人一样，后续的补偿措施非常困难。
        - content: 因此在开发过程中，引入了独立的分布式存储，并将证书等信息存储在 Kubernetes 的 ConfigMap 中，整个区块链网络运行所产生的账本数据、状态数据、证书等都得到了高可靠的存储，解决了 Kubernetes 在漂移调度过程中资源依赖问题。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 平台部署方案
            level: 3
        - content: 在 BaaS 平台未融合 KubeSphere 改造前，区块链网络部署过程相当繁琐，首先需要我们手动生成区块链网络所需的证书再分别拷贝到节点机器上，再通过修改脚本参数生成部署组织节点的 yaml 文件，然后才能部署到各个机器中，整个部署过程十分不标准且容易出错，排查起来问题比较困难，整体部署效率较低。
        - content: 我们在选择 KubeSphere 时就考虑到它拥有一套标准的部署流程，而且 ks-installer 工具也是开源的非常适合我们针对部署痛点进行优化。优化过后的 ks-installer 集群可以实现只需要根据不同项目环境修改特定的几个参数就可以非常流畅的部署一套标准的 BaaS 平台。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 平台融合区块链方案
            level: 3
        - content: 1. 部署区块链网络：
        - content: 我们认为使用 BaaS 进行部署区块链网络时一般考虑几点要素：
        - content: a. 易用性
        - content: — 隐藏区块链关键技术的概念，比如共识算法，P2P 网络，密码学，交易管理等
        - content: — 隐藏技术细节，BaaS 平台的网络的搭建，比如落块的规则，peer 锚节点的设定，状态数据库选择 LevelDB 还是 CouchDB 等
        - content: — 操作足够简单，输入几个配置信息就能搭建区块链网络
        - content: b. 安全与稳定
        - content: — 基于 RBAC 的身份鉴别
        - content: — 平台的监控告警
        - content: — 数据完备，容灾切换等高可用机制
        - content: c. 弹性部署，并发业务
        - content: — 能进行水平扩展与收缩，比如能迅速新增节点，关闭 Node 节点时平台服务不会收到影响
        - content: — 同时支持多用户多业务实现链上操作
        - content: d. 开放与隐私管理
        - content: — 对各类区块链技术及各类应用场景需要保持开放性，比如存储智能合约的链码仓库，以及链码管理
        - content: — 用户信息，证书，部署信息，账本数据，交易信息进行隔离
        - content: 创建完的联盟的架构如下：整个区块链联盟使用 Namespace 作为资源的隔离，整体的搭建也分为三层——服务层（service），容器层（Pod），和分布式存储。
      image: https://pek3b.qingstor.com/kubesphere-community/images/baas-blockchain-namespace.png
    - title:
      contentList:
        - content: 2. 区块链网络管理
        - content: 区块链的管理，直接面对用户，提供给运维或者普通用户来操作，所以既要保证可操作性又要保证关键数据的呈现。
        - content: 当然针对各类应用场景如数据层证，资产转账等常用场景我们也提供了内置的链码，如需定制化智能合约可以通过链码仓库来上传链码，并进行实例化等操作，能有比较好的开放性。
      image: https://pek3b.qingstor.com/kubesphere-community/images/baas-blockchain-network.png
    - title:
      contentList:
        - specialContent:
            text: 本地化开发模式
            level: 3
        - content: 在对 KubeSphere 进行二次开发的过程中，前端的本地化开发比较容易只需要替换 server/config.yaml 中的 server:apiServer:url/wsUrl 地址便可。但后端的本地化开发便涉及到若干问题：如何确保开发环境与测试环境的一致，如何快速开发调试，如果开发涉及到多个云上多个服务之间的相互调用又该如何？这些问题成为了团队开发的痛点。
        - content: 这让我们团队积极探索本地化开发的方式，其中 telepresence 和 kt-connect 都能解决以上痛点，实现的效果类似，都能将集群流量转发到本地。这里使用 kt-connect 官方原图说明一下。
      image: https://pek3b.qingstor.com/kubesphere-community/images/4b79ceb0-11fe-40e7-b771-526b01b59cae.png
    - title:
      contentList:
        - specialContent:
            text: 多租户融合
            level: 3
        - content: KubeSphere 平台提供了多租户管理，角色管理，并以企业空间，项目进行更细颗粒度的权限管理。结合区块链 BaaS 平台也需要多租户，创建区块链联盟，并在联盟中创建区块链节点和服务。BaaS 在 KubeSphere 的多租户的基础上进行融合，提供多租户的登录能力，每一个租户创建自己的区块链服务；通过 BaaS 创建的区块链服务来满足业务系统的上链需求。
        - content: 区块链创建一个联盟，包含一个和多个组织同时每个组织拥有一定数量的区块链节点，提供区块链服务。通过 BaaS 平台创建用户并关联相应的组织，当创建联盟时邀请相关组织加入联盟。
      image: https://pek3b.qingstor.com/kubesphere-community/images/baas-blockchain-cluster.png
    - title:
      contentList:
        - content: 用户基本信息如下： 包括用户名，用户所属组织，用户邮箱等信息。
      image: https://pek3b.qingstor.com/kubesphere-community/images/baas-blockchain-name.png
    - title:
      contentList: 
        - content: 在 Baas 平台中的组织管理中可以添加组织并关联到用户，再邀请到创建的联盟中进行通道和智能合约的操作。
      image: https://pek3b.qingstor.com/kubesphere-community/images/baas-blockchain-group.png
    - title:
      contentList:
        - specialContent:
            text: 实践过程中遇到的问题
            level: 3
        - content: SinoBaaS 平台从开始改造，到积极拥抱云原生架构，到最终选择 KubeSphere 作为技术开发平台，也遇到不少的问题和挑战：
        - content: 不熟悉 K8s，在 K8s 概念、部署、使用方式的各个方面都要学习和探索。
        - content: 不熟悉云原生的开发和调试流程，不熟悉 KubeSphere 的前后端和安装脚本 ks-install，从最开始的二进制方式运行 ks-apiserver，本地化调试前端，到容器化部署，在开发过程中也缺乏对容器化开发调试的方法，到最后选择 telepresence 代理方式调试服务。
        - content: 不熟悉 KubeSphere 的代码和功能组件，通过官方文档和社区逐渐熟悉 kapi 接口，KubeSphere 的架构和在 CRD 的扩展方面不断的摸索，最终在自定义 CRD 部分，重新设计区块链部分的 CRD 结构。
        - content: 区块链功能和 KubeSphere 的融合：在融合方面，由于区块链服务和 KubeSphere 功能还是有不少差异。在联盟管理，项目角色以及企业空间等方面的融合与展示，以达到不至于特别突兀的效果，团队内部进行了数次讨论。
      image: 

    - type: 1
      contentList:
        - content: 降低了区块链网络在部署运维过程中的实施难度，做到了对资源、对环境、对流程标准化的管理应用
        - content: 对区块链网络中的各种服务进行原子化透析，涵盖全生命周期的管理
        - content: 对后续适配、集成多类型区块链底层技术提供了标准化的 PaaS 层支持
  
    - title: 实践效果
      contentList:
        - content: SinoBaaS 平台经过 KubeSphere 的初步改造升级，完成了区块链联盟的创建，组织管理，通道管理，链码仓库，链码管理，区块和交易查询，数据存证和资产转账等功能。联盟的创建和删除更加的便捷，融合 KubeSphere 的企业空间和项目进行了多层级的权限管理，不同角色的用户可以有不同的区块链视图，看到不同的区块链的节点和服务信息。简单效果如下：
        - content: 区块链浏览器页面：
      image: https://pek3b.qingstor.com/kubesphere-community/images/baas-blockchain-browser.png
    - title:
      contentList: 
        - content: 联盟概览页面：
      image: https://pek3b.qingstor.com/kubesphere-community/images/baas-blockchain-overview.png
    - title:
      contentList:
        - content: 信息查询页面（可以通过区块号，区块 hash，交易 ID 等进行查询操作）：
      image: https://pek3b.qingstor.com/kubesphere-community/images/baas-blockchain-search.png

    - type: 2
      content: 'KubeSphere 为中科金财的 BaaS 平台融合 Kubernetes 通用 PaaS 层技术集成多类型区块链底层技术，实现如多租户体系、区块链网络灵活动态部署维护管理、合约商店应用共享审核与合约审计机制、区块链网络细颗粒度监控等诸多要求提供了集成支持，为产品带来了拥抱云原生、SaaS 化的先进架构。'
      author: '中科金财'

    - title: 未来展望
      contentList:
        - content: 在 SinoBaaS 1.0 版本开发结束后，我们也在抓紧推进后续版本的规划和迭代，在此也做一下列举说明，以供参考交流。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 本地协同开发模式
            level: 3
        - content: 目前可以实现将 ks-apiserver 云上的流量全部拦截在本地，但是在面对多人协同开发时还存在不足，下一步需要实现创建路由规则重定向特定流量，实现多人协作场景下互不影响的本地调试。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 自定义服务组件
            level: 3
        - content: 目前区块链网络还是以本地化 SDK 的方式接入，在使用便捷性和标准化方面还存在不足，且还无法对访问进行审计管控，因此还需要在平台中开发基于 AK/SK 的 API 服务，作为区块链网络对外接入访问的入口，并将 API 的服务作为 KubeSphere 的一个服务组件，并配置进 ks-installer 中，随平台的一起初始化部署，并在 Service Components 中可以查询到服务的状态。
        - content: 后续甚至可以加入更多的 DApp 应用，都可以纳入服务组件中统一管理，并在应用环节深度集成到平台的各个功能中。
      image: https://pek3b.qingstor.com/kubesphere-community/images/baas-blockchain-service.jpg
    - title:
      contentList:
        - specialContent:
            text: 集群联邦下打造区块链联邦网络
            level: 3
        - content: SinoBaas 平台为更好的适应复杂网络场景下的需求，如多个参与组织都有独立的局域网，相互间以专线形式通讯，考虑依托 KubeSphere 的多集群托管模式实现跨集群区块链组网和区块链跨网络通信，真正解决联盟链应用下复杂网络对区块链运行及管理的影响。
      image:     
    - title:
      contentList:
        - specialContent:
            text: 基于应用商店来打造合约商店
            level: 3
        - content: KubeSphere 中提供了应用商店的功能，用户可以上传、部署应用商店的应用或者自定义应用。区块链中有很多基于智能合约的应用（溯源、存证、加密猫，基于 ERC721 的数字藏品等），将基于智能合约的应用打造成标准的合约模板，借助应用商店的机制来打造合约商店，方便 SinoBaaS 平台的用户自主选择合约应用进行部署。
      image:

  rightPart:
    icon: /images/case/section6-sinodata.png
    list:
      - title: 行业
        content: 信息科技
      - title: 地点
        content: 北京
      - title: 云类型
        content: 私有云、混合云
      - title: 挑战
        content: 高效、稳定的区块链专项技术融合运维管理
      - title: 采用功能
        content: 三层权限体系、应用发布及管理、日志、监控、分布式存储、ConfigMap 等
---
