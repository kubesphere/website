---
title: excelsecu
description:

css: scss/case-detail.scss

section1:
  title:  文鼎创
  content: 深圳市文鼎创数据科技有限公司创立于 2006 年，是全球领先的线上身份认证解决方案提供商。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 深圳市文鼎创数据科技有限公司创立于 2006 年，是全球领先的线上身份认证解决方案提供商，专注网络身份认证，数据安全领域，坚持稳健经营，持续创新、开放合作，在金融电子化、政府、企业办公等应用中提供解决方案，成为众多国有商业银行、全国性股份制银行、城市商业银行、农村商业银行、各省市税务、政府、各大 CA 机构以及跨国企业的合作伙伴，累积服务近亿用户，不断满足客户差异化需求。
        - content: 公司多年来持续创新，申请了大量的发明专利、实用新型专利和产品外观专利；登记了多项计算机软件着作权，同时是国家级高新技术企业；拥有商用密码产品型号证书、密码检测证书、银联认证证书、ISO9001:2015 国际质量管理体系认证及 ISO14001 环境管理体系认证；产品通过了 CE/FCC 认证、RoHS 认证。
        - content: 公司作为国际线上快速身份验证联盟（FIDO）的核心成员之一，致力于实现全球统一的在线验证标准，我们将运用该技术为不同地区的人们提供享有平等的安全网络世界的权利。
      image: 

    - title: 背景介绍
      contentList:
        - content: “文鼎创智能物联”是深圳市文鼎创数据科技有限公司针对物联网应用，推出的物联网解决方案，方案包含统一的物联网服务平台，”云打印机“，”收款云音箱“，”收款云扫码盒子“等旗下产品，为用户的数据安全保驾护航。
        - content: 作为一家 TO B 解决方案的硬件提供商，“硬件为主，软件为辅”是公司长期以来的开发模式，因此前期在对服务端的开发、部署、架构设计重视不够。传统的项目停留在单机（虚拟机）部署，人工打包上传，不仅费时费力，还容易出错，造成服务的不可用。
        - content: 在拥抱 K8s 之前，我们也尝试过 docker-compose 的方案，相对于人工打包部署，docker-compose 也确实给我们带来了一些便利：
        - content: 1. ALL-IN-ONE，提供一键式的软件部署方案，无需执行繁琐的部署流程；
        - content: 2. 隔离了宿主机系统的差异性；
        - content: 3. 减少了运维人员进行版本迭代的操作，降低操作失误的可能性。
        - content: 在面向物联网行业推出新产品，新解决方案之后，对服务的稳定性，以及可靠性带来了新的挑战，现有的开发模式逐步跟不上业务的迭代需求，为此我们迫切需要打破现有的框架，探索新的一套软件迭代流程。
      image: 

    - title: 选型说明
      contentList:
        - content: 在决定拥抱云原生之时，我们对市面上的容器管理平台进行了调研，发现国外 Rancher 用户较多，国内 KubeSphere 位居前列。我们对容器管理平台的选型有几个标准：
        - content: 1. 生态：一个开源项目的生态是否完善很重要，周边配套的工具能带来极佳的使用体验和可维护性。
        - content: 2. 社区活跃度：官方仓库 Issue 或问答社区是否回应及时，代码提交是否活跃？
        - content: 3. 商业公司或基金会支持：是否有商业公司或开源基金会支持，如果为个人项目，后续停止维护，则可能会给用户带来的一定的风险。
        - content: 4. 技术栈：使用的技术栈与团队是否吻合，是否有能力解决和维护？
        - content: 5. 用户体验：是否有 UI 操作界面，界面是否美观，使用流畅？
        - content: 6. 本土化：是否做了一些本土化的优化，符合国人的使用习惯？
        - content: 在调研选型时，我们发现 KubeSphere 能充分满足的我们的要求。KubeSphere 团队开源的 KubeKey 工具，能帮助我们快速搭建一个 KubeSphere 集群，省去了繁琐且复杂的部署流程，OpenELB 项目则为我们提供了本地集群负载均衡的解决方案。
        - content: 在使用过程中发现的问题，在中文问答社区基本都能找到对应的解决方案。KubeSphere 的控制台简化了 Kubernetes 服务的部署，使得团队一些没有 K8s 使用经验的成员也能快速上手，用过的同事都说好。
      image: https://pek3b.qingstor.com/kubesphere-community/images/excelsecu-kubesphere-1.png

    - type: 1
      contentList:
        - content: 安装部署便捷，开箱即用
        - content: 降低了学习成本
        - content: 简化了中间件的部署

    - title: 目前架构
      contentList:
        - content: 目前采用微服务设计，开发语言以 Golang、Java 为主，服务之间通信使用 gRPC。
      image: https://pek3b.qingstor.com/kubesphere-community/images/excelsecu-kubesphere-2.jpeg
    - title:
      contentList:
        - content: 生产环境使用两个腾讯云 CLB 分别接入来自业务和物联网终端的流量。整个业务服务部署在腾讯云 TKE 集群，并使用 KubeSphere 来管理应用的日常发布。而集群的基础设施，本着“能买就买，实在不能买就自建”的原则（并不是不差钱，而是小公司运维压力大）。之所以没有使用 TKE 的控制台来管理应用的发布，主要是 TKE 的控制台体验并不是很友好，另外一个很重要的原因，应用商店对第三方 Helm 仓库支持很差，无法充分利用 Helm 的生态。
      image: https://pek3b.qingstor.com/kubesphere-community/images/excelsecu-kubesphere-3.jpeg

    - title: 实践过程
      contentList:
        - specialContent:
            text: 硬件资源
            level: 3
        - content: 测试环境：10 台 ESXI 虚拟机，自建 Kubernetes 集群。
        - content: 生产环境：7 台 腾讯云 CVM 节点，Kubernetes 使用腾讯云托管 TKE 集群。
      image: https://pek3b.qingstor.com/kubesphere-community/images/excelsecu-kubesphere-4.png
    - title:
      contentList:
        - specialContent:
            text: 存储方案
            level: 3
        - content: 测试环境：使用 3 台 ESXI 虚拟机作为分布式存储 Ceph 的 OSD 节点。
        - content: 生产环境：出于成本和稳定性的考虑，使用腾讯云 CBS 作为 K8s 存储方案。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 最小化安装
            level: 3
        - content: 由于生产环境和测试环境已经有一些外部服务，比如 Prometheus 和 Logging，为了最大化利用现有资源，在部署 KubeSphere 采取了最小化安装。
      image: https://pek3b.qingstor.com/kubesphere-community/images/excelsecu-kubesphere-5.png
    - title:
      contentList:
        - content: 值得一提的是，Monitor 并不是可插拔组件，即使最小化安装，KubeSphere 依然会默认安装，在生产环境中，安装 TKE 监控的 prometheus-operator 会与其冲突，需要关闭 KubeSphere 的 Prometheus 或者手动卸载。
      image: 
    - title:
      contentList:
        - specialContent:
            text: DevOps
            level: 3
        - content: 在早期开发阶段，版本迭代是一件非常痛苦的事情，开发人员在本地编译打包后人工上传到服务器进行部署。在经历了多次各种环境差异，人工操作失误教训后，团队下定决心改变现有的流程，决定搭建适合团队自身的 DevOps 体系。
      image: https://pek3b.qingstor.com/kubesphere-community/images/excelsecu-kubesphere-6.jpeg
    - title:
      contentList:
        - content: 1. 持续集成（CI）：开发在每次提交代码之前都进行 CI，以确保代码的质量和一致性。这包括运行单元测试，代码静态分析，编译和构建过程等。当 CI 失败时，开发立即修复代码并重新提交。
        - content: 2. 持续交付（CD）：一旦代码通过了 CI 流程，就将其交付给测试团队进行测试。测试团队进行测试以确保产品的质量。在测试环境，使用了 Coding 的自定义节点作为 CI 的自动化构建，CI 通过后通过脚本自动更新 KubeSphere 的镜像版本。在生产环境，由于涉及发布评审流程，配置变更，各个业务团队的协调，目前暂时还是交由运维人员手动变更应用版本进行发布。
        - content: 3. 监控和警报：一旦代码被部署到生产环境，对其进行监控。监控可以帮助团队快速发现和解决问题，确保产品的可用性和性能。
        - content: 目前的 DevOps 实践，主要解决了团队以下的痛点：
        - content: 1. 统一编译环境：规定项目内应编写 Dockerfile，使用 Docker 容器内的编译环境进行编译，同时通过代码提交事件触发代替开发机本地编译，从而隔离各个开发机环境的差异。
        - content: 2. 发布版本可追溯：早期项目版本管理十分随意，全凭开发人员心情命名。导致出现问题时无法快速定位。为此，我们约定在 CI 构建时，镜像版本需要满足特定的命名格式，如：`${VERSION}-${ENV}-\${CI_NUMBER}`，这种命名格式可以帮助我们快速定位到某个环境出现问题某次 CI 构建的版本。
        - content: 3. 平滑迭代：早期项目使用单机单体部署，在进行迭代时，常常有短时间的服务不可用，导致流量损失。在进行容器化改造后，利用 Kubernetes 的探针，可以进行服务的平滑更新，并且在服务状态不健康时，能自动重启，无需人工介入，大大提升了服务的可用性。
        - content: 4. 运维效率：充分发挥 Kubernetes 的运维体系和云原生的可观测性实践，降低了多业务多环境运维的压力。在服务故障发生时，能够及时感知。
      image: 

    - title: 使用效果
      contentList:
        - specialContent:
            text: 流水线配置
            level: 3
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/excelsecu-kubesphere-7.png
    - title:
      contentList:
        - content: 流水线使用了 Coding 的方案，有以下几方面的考虑：
        - content: 1. 能够深度融合企业微信，在 CI 过程，有任何问题能够及时通过 IM 工具通知到开发；
        - content: 2. 配套工具完善，官方的 Jenkins 有点跟不上云原生的发展，需要安装一系列的插件才能满足需求，配置过程也很繁琐。
      image: 
    - title: 
      contentList:
        - specialContent:
            text: 应用部署
            level: 3
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/excelsecu-kubesphere-8.png
    - title:
      contentList:
        - content: “文鼎创智能物联”项目已全部使用 Helm 应用发布，在使用过程，发现 KubeSphere 一个比较不友好的体验，如果升级应用因 yaml 文件配置错误导致应用升级失败，会无法再次升级。在生产环境中，应用无法升级是一个很糟糕的问题，发现该 Bug 后，已提交了修复代码给社区并合并。
      image: 
    - title: 
      contentList:
        - specialContent:
            text: 集群资源监控
            level: 3
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/excelsecu-kubesphere-9.png
    - title:
      contentList:
        - content: KubeSphere 内置的监控系统，满足运维人员日常对集群健康状态的巡检，同时 KubeSphere 提供了多个层面的监控，针对 namespace 和服务本身，团队使用频次较高的是服务监控，以便开发人员对自身发布的服务的资源使用情况有所了解。
      image: 
    
    - type: 2
      content: 'KubeSphere 安装部署便捷，开箱即用，且简化了 K8s 的部署，大大降低了学习成本。应用商店支持第三方 Helm 仓库，简化了中间件的部署。'
      author: '文鼎创'

    - title: 未来规划
      contentList:
        - content: 1. “文鼎创智能物联”作为公司探索的新项目已全面完成容器化工作，运行在 KubeSphere 集群，未来打算将历史遗留的 TO B 项目进行容器化改造和迁移到 KubeSphere 集群，提升项目的可维护性和可用性。
        - content: 2. 探索 Service Mesh 方案，进一步提升服务的平稳发布和可观测性。
      image: 

  rightPart:
    icon: /images/case/logo-excelsecu.png
    list:
      - title: 行业
        content: 物联网
      - title: 地点
        content: 中国深圳
      - title: 云类型
        content: 公有云
      - title: 挑战
        content: 高可用、交付效率，资源利用率
      - title: 采用功能
        content: 应用商店、监控、存储管理
---
