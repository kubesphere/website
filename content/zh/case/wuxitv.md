---
title: wuxitv
description:

css: scss/case-detail.scss

section1:
  title:  无锡广播电视集团
  content: 无锡广播电视集团成立于 1999 年，为全国首家广电集团。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 无锡广播电视集团成立于 1999 年，为全国首家广电集团。2007 年底组建成立无锡广播电视台（与无锡广播电视集团两块牌子、一套班子）。集团作为主流媒体和市属文化国企，承担宣传与经营双重职能：一方面为市委市政府中心工作和全市改革发展稳定大局提供舆论服务，一方面通过保持提升经营效益，为宣传工作提供支撑，为全市文化产业发展贡献力量。集团目前拥有 6 个广播频率、7 个电视频道（其中 1 个公交、地铁移动电视频道）、“无锡博报”领衔的新媒体矩阵。
      image: 

    - title: 背景介绍
      contentList:
        - content: 作为国内最早提出媒体融合发展理念，并付诸实践和不断创新的城市广电媒体之一，无锡广电早在 2012 年就开始布局移动端战略并不断创新，在 2021 年将旗下两大客户端升级迭代全新的“无锡博报”客户端，并形成系列化的“博报”微信公众号、微博和视频号，组成传播力和影响力更强的新媒体矩阵。近期荣获国家广电总局 2022 年度“全国广播电视媒体融合先导单位”和“新时代 新品牌 新影响”等荣誉。
        - content: 在长期的实践中，无锡广电逐步摸索出适合城市广电的媒体融合发展思路和经验。以传播力建设为引领，对外积极打造新型传播体系，坚持“移动优先”战略，做大做强移动端平台，占领新兴传播阵地。以全网传播和本地运营需求为导向，持续推动内部组织架构、体制机制、业务流程、技术平台的再造和优化。推动“主力军全面挺进主战场”，将传统广播电视的团队和产能向新媒体端转移，打造具有城市媒体特色舆论主阵地。
        - content: 这就要求无锡广电必须快速适应不断变化的运营和市场需求，用高效、敏捷的应用部署和运维对各类成几何式增长业务提供有力支撑。
        - content: 在进行容器化改造前，无锡广电主要是采用基于虚拟化技术的基础设施环境，每个业务应用根据各自的需求采用独立虚机部署，随着时间的积累虚机规模变得越来越庞大、复杂。架构不足日益凸显，具体如下：
        - content: 1.在达到一定规模下虚机操作系统本身需要占用的计算资源和存储资源较为浪费；
        - content: 2.长期积累的老旧操作系统需要跟进维护升级，如：现存大量的 CentOS 系统在官方停止维护后需要新的发行版本替代；
        - content: 3.每个应用都需要独立维护和管理，使得部署和运维成本变得越来越高；
        - content: 4.弹性伸缩的能力较差，部署时间长；
        - content: 5.缺少测试环境，并且开发环境和生产环境不统一，应用更新依赖手工；
        - content: 6.缺少业务与资源利用率的监控，无法提前发现潜在的问题。
        - content: 这些问题导致运维效率相对较低，无法满足业务快速迭代的需求。因此，无锡广电新媒体运维团队决定进行容器化改造，以提升系统的弹性、灵活性和可维护性，实现如下功能：
        - content: 1.更高效的资源利用率：容器化技术可以实现共享操作系统内核，从而减少每个应用所需的计算资源和存储资源；
        - content: 2.更好的可维护性：通过使用容器编排工具，可更好地管理和维护容器，提高部署和运维效率，降低成本；
        - content: 3.更高的弹性：容器化技术可以实现快速部署和启动，实现快速伸缩，从而更好地满足业务的变化需求；
        - content: 4.更高的一致性：容器化技术可以保证开发环境、测试环境和生产环境的一致性，从而降低应用更新的风险；
        - content: 5.更好的可观测性：通过分布式追踪、可视化的流量拓扑和监控，可以实现对节点到容器到业务资源监控和告警，及时发现、定位和解决问题；
        - content: 6.更好的应用生命周期管理：通过集成应用商店和 DevOps 系统及微服务治理等技术，可以使应用的发布管理更加敏捷、弹性和可扩展。
        - content: 为此，拥抱云原生已经成为整个行业的趋势，可以帮助降低成本、提高效率、增强竞争力。
      image: 

    - title: 选型
      contentList:
        - content: 通过前期初步使用容器化及 Kubernetes 的积累上，在决定全面转型容器化前我们对未来整个 Kubernetes 的管理平台规划上面建立了结合自身的一些需求：
        - content: 1.能够纳管多个 Kubernetes 集群，我们会根据业务适配情况拆分多个集群，并且可在现有集群上安装；
        - content: 2.能够从 Kubernetes 集群的部署、升级维护、管理的一体化集成，涵盖集群和应用的生命周期管理；
        - content: 3.有 API 接口便于和自有 CI/CD 工具上的对接；
        - content: 4.非 CentOS 系统的兼容性（选型期间正推进去 CentOS 化）；
        - content: 5.便于今后的集群升级，在集群部署上能完美适配 containerd 容器运行时；
        - content: 6.部署后的集群接近原生安装，以便于后期脱离工具自行维护集群；
        - content: 7.有国内安装镜像，支持纯离线部署。
        - content: 在选型期间我们正好在规划部署自研业务的集群，在 CNCF 认证的 Kubernetes 部署工具中发现了 KubeSphere 和 Kubekey 这个解决方案，并在集群部署和生命周期管理方面进行了深度的测试，主要围绕下面一些维度：
      image: https://pek3b.qingstor.com/kubesphere-community/images/wuxitv-1.png
    - title:
      contentList:
        - content: 通过测试，发现 KubeSphere+KubeKey 在各个方面都更加契合当初对管理平台的需求，为此采用 KubeSphere+KubeKey 来搭建了自研业务（运营类为主）的一套 Kubernetes 集群以及管理平台。
      image:

    - type: 1
      contentList:
        - content: 提升资源利用率
        - content: 增强运维可观测性
        - content: 简化应用部署管理流程

    - title: 实践过程
      contentList:
        - specialContent:
            text: 部署架构
            level: 3
        - content: 基础设施以自己的机房虚拟化集群为基础，并使用虚拟机来构建 Kubernetes 集群。在集群规划方面，分为两个生产集群，分别用于内容生产业务和运营业务。对于内容生产业务集群，更注重稳定性，因此采用了 1.21 版本。而对于运营业务集群，在追求相对稳定的基础上，还跟进了一些新版本特性，采用了 1.23 版本。同时在运营业务集群会先行实践一些新版本的特性积累经验，以便为将来升级内容生产业务集群打好基础。当然，无论是哪个集群，每次进行相应的升级和维护之前，都会创建一个临时的测试集群，以进行相关操作的测试和验证。
      image: https://pek3b.qingstor.com/kubesphere-community/images/wuxitv-2.png
    - title:
      contentList:
        - specialContent:
            text: 集群资源
            level: 3
        - content: 这里以 1.23 版本的 K8s 集群为例，介绍下部署的环境。
        - content: 资源清单：
      image: https://pek3b.qingstor.com/kubesphere-community/images/wuxitv-table.png
    - title:
      contentList:
        - content: 全部服务器均采用本地虚拟化平台的虚机方式提供。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 对外业务暴露
            level: 3
        - content: 为了实现 K8s 集群对外业务的访问，使用了两台 OpenResty 服务器，并通过反向代理模式将流量分发到 K8s 集群中的各个工作节点的 Ingress NodePort 端口。为了保证高可用性对 OpenResty 服务器进行了双活部署。同时使用 OpenResty 实现了配置的热更新、限流和安全防护功能。此外，还在 OpenResty 上统一了全局的 SSL 证书管理，以简化在 K8s 集群中分散部署 SSL 证书带来的管理复杂度。通过这些措施，能够更加高效地管理 Kubernetes 集群对外的业务访问。
        - content: 为了实现 K8s 集群管理的高可用性，使用 Keepalived 和 HAProxy 部署了 1 个高可用负载均衡服务，用来实现后端 3 台 master 节点 API server 的对外统一暴露。此外，也搭建了一套 dnsmasq 用于提供各个节点的 DNS 解析服务，以便于解析一些内部服务的域名。这样，可以确保 Kubernetes 集群的 API server 能够持续提供服务，并且内部服务的域名能够得到正确的解析。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 存储实现方案
            level: 3
        - content: 根据业务需求，需将较多传统的虚机业务迁移到容器化环境下，因此对 K8s 集群的存储方案进行了深入了解。目标是充分利用现有的硬件基础，同时尽可能简化架构并降低运维成本。因此，在底层存储方面，使用现有专业的硬件 NAS 存储和基于 vSphere 的 Cloud Native Storage（CNS），以应对不同的数据持久化场景。
      image: https://pek3b.qingstor.com/kubesphere-community/images/wuxitv-3.png
    - title:
      contentList:
        - content: 为了解决多个 Deployment 同时读写的应用的存储问题，采用了基于 nfs-subdir-external-provisioner 的 StorageClass 存储类，或直接在 Pod 内挂载 nfs volumes 的形式。然而，我们也意识到 NFS 存储在某些应用场景下可能不兼容并存在性能问题。因此，针对只需要 ReadWriteOnce 访问类型且对性能要求较高的数据持久化场景，例如数据库和缓存，采用了虚拟化环境自带的 vSphere 的 CNS 来实现 StorageClass 存储类。这极大地简化了存储解决方案的复杂度。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 可观测性方案
            level: 3
        - content: 作为广电宣传应用对整个平台稳定性的要求较高，在日常的运维中对可观测性关注度较高，最初采用了 Prometheus-operator 套件和 Grafana 进行集群资源监控，同时使用 Netdata 进行配合。对于应用日志方面，则采用了 Loki、Promtail 和 Grafana 进行处理。但在应用中发现，这个方案在集群内应用管理方面的结合性不够强，存在一些使用上的割裂。在体验了 KubeSphere 提供的整体监控和日志方案后，果断决定切换到 KubeSphere 上。这样做解决了之前各个系统之间的割裂问题，实现了集群+应用的管理、监控和日志的一体化。
      image: https://pek3b.qingstor.com/kubesphere-community/images/wuxitv-4.png
    - title:
      contentList:
        - specialContent:
            text: DevOps 方案
            level: 3
        - content: 在 DevOps 方面，采用了 GitLab CI/CD 的方案。研发只需要提交代码并打上 tag，GitLab 会自动生成相应的 jobs。然后，通过 GitLab Runner 运行相应的脚本，实现打包、镜像推送等操作，并通过特定的 tag 名称触发 API 修改线上应用的镜像 tag，从而实现自动部署。
      image: https://pek3b.qingstor.com/kubesphere-community/images/wuxitv-5.png

    - title: 使用效果
      contentList:
        - content: 1.Kubernetes 集群部署和升级的方便快捷性：在应用 KubeSphere 后，不再需要手动安装和配置 Kubernetes 集群，因为 KubeSphere 提供了 KubeKey 工具实现了一键式的部署和升级功能，这使得可以快速创建和管理集群。此外，KubeSphere 还提供了基于 Helm 和 Operator 的应用管理，可以更加方便地部署和管理应用。
        - content: 2.对多个 Kubernetes 集群的统一管理：在实际应用业务中，需要同时管理多个 Kubernetes 集群。在应用 KubeSphere 后，可以将多个 Kubernetes 集群统一管理，从而更加方便地进行操作和监控。此外，KubeSphere 还提供了集群间的应用镜像复制和调度，使得可以在多个集群之间灵活地部署应用。
        - content: 3.实现租户形式的企业空间访问控制管理和资源分配：在业务中需要对不同的用户和团队进行访问控制管理和资源分配。在应用 KubeSphere 后，可以通过创建租户来实现对企业空间的访问控制和资源分配，从而更加灵活地管理业务。
        - content: 4.集群和应用的日志、监控平台的统一：在之前，需要分别使用不同的日志和监控工具后台来管理集群和应用。在应用 KubeSphere 后，我们可以使用 KubeSphere 提供的统一日志和监控平台来管理集群和应用，可以更加方便地查看和分析数据。
        - content: 5.简化了在应用治理方面的使用门槛：在我们的业务中，应用治理是非常重要的一部分。在应用 KubeSphere 后，可以使用 KubeSphere 提供的应用治理组件，例如灰度发布和流量管理，来更加方便地管理应用。这样，可以降低应用治理的使用成本，提高效率。
      image: 
    
    - type: 2
      content: 'KubeSphere 简化了 K8s 集群管理，实现了多集群统一管理、租户级访问控制和资源分配、集中化日志和监控平台，同时使用应用治理在业务上提升了测试运营效率。'
      author: '无锡广播电视集团'

    - title: 未来规划
      contentList:
        - content: 结合广电应用实际，在 KubeSphere 应用方面，有以下后期计划：
        - content: 1.在测试中尝试使用 KubeSphere 灰度发布。
        - content: 2.探索使用 KubeSphere 的 DevOps 组件，将灰度发布与 CI/CD 流水线结合使用。
        - content: 3.利用应用治理组件，实现业务 APM 的可观测性。
      image: 

  rightPart:
    icon: /images/case/logo-wxtv.png
    list:
      - title: 行业
        content: 媒体
      - title: 地点
        content: 中国江苏
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 资源利用率、多集群、弹性伸缩、可观测性
      - title: 采用功能
        content: 多集群管理，应用治理，监控，日志
---
