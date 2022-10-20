---
title: xdf
description:

css: scss/case-detail.scss

section1:
  title:  新东方教育科技集团
  content: 新东方教育科技集团定位于以学生全面成长为核心，以科技为驱动力的综合性教育集团。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 新东方教育科技集团定位于以学生全面成长为核心，以科技为驱动力的综合性教育集团。
        - content: 集团由 1993 年成立的北京新东方学校发展壮大而来，拥有短期培训系统、文化传播系统、咨询服务系统、科技产业系统等多个发展平台，打造了新东方学习成长中心、新东方国际教育、新东方大学生学习与发展中心、新东方在线、新东方前途出国、新东方国际游学、新东方满天星、新东方大愚文化等诸多知名教育品牌。
        - content: 作为中国著名私立教育机构，新东方教育科技集团于2006年9月7日在美国纽约证券交易所成功上市，2020 年 11 月 9 日在香港联合交易所成功二次上市。
      image: 

    - title: 背景介绍
      contentList:
        - content: 随着公司业务全面迁入 Kubernetes，在租户管理、对接镜像仓库、存储管理、服务扩缩容配置，监控日志等可观测、易运维、高可用方面带来了很大挑战。
      image: https://pek3b.qingstor.com/kubesphere-community/images/a72b6d6f-6550-4922-bdf2-6b108f063c56.png

    - title: 选型
      contentList:
        - content: 从 0 到 1 自研一套功能全面的 Kubernetes 管理平台开发周期太长。目前开源的 KubeSphere 使用多租户方式管理和使用资源，集成了 CI/CD 等丰富的云原生技术生态，轻松构建企业级 DevOps 架构，非常符合公司的需求。为了将开发运维功能一站式管理，我们选择了 KubeSphere。
        - content: 1. 更符合开发人员使用习惯，权限分配更加细粒度；
        - content: 2. 功能强大，生态友好，可扩展性强；
        - content: 3. 支持 Kubernetes 多集群统一管理；
        - content: 4. 强大的 DevOps 系统，使得服务自动化发布流程变得简单；
        - content: 5. 以应用为中心，可以轻松配置服务自动扩缩容，增加了服务可用性；
        - content: 6. WebShell，服务监控，日志，让故障排查变得不再困难。
        - content: 7. 这些功能基本解决了我们现阶段痛点，大大降低了运维成本。
      image: 

    - type: 1
      contentList:
        - content: 降低开发人员使用 Kubernetes 的门槛
        - content: 提高了服务打包部署效率
        - content: 提高了系统可观测性能力

    - title: DevOps 实践
      contentList:
        - content: 在没迁入 Kubernetes 之前，公司的 Jenkins 部署在物理机上，运维人员维护 Jenkins 的生命周期；开发人员在 Jenkins 上创建流水线，发布服务，管理服务生命周期。维护成本和学习成本较高。
        - content: 引入了 KubeSphere，它基于 Jenkins 的 DevOps 系统帮助开发和运维团队用非常简单的方式构建、测试、发布服务到 Kubernetes。它还兼容 Harbor 镜像仓库和 GitLab 代码库，使得我们的系统可以无缝迁移。
        - content: 可视化的 CI/CD 流水线，打造了极佳的用户体验，服务的自动化发布和生命周期从碎片化到集中式管理。
        - content: 目前公司的大多数应用都是通过 KubeSphere DevOps 系统发布，其中包括：业务应用、中间件 Operator、存储组件等 100 多个流水线。
      image: https://pek3b.qingstor.com/kubesphere-community/images/d85b11c2-a429-4337-8e88-55fb1f005dc7.png

    - title: 中间件可观测
      contentList:
        - content: Zookeeper、Kafka、Redis 中间件容器化后，由 Operator 管理其生命周期，中间件和 Operator 容器的故障排查、日志监控查看得益于 KubeSphere 的图形化管理、资源监控功能。
        - specialContent:
            text: Kafka
            level: 3
        - content: 监控 Kafka 容器的 CPU、内存使用量等：
      image: https://pek3b.qingstor.com/kubesphere-community/images/55665d63-ad3b-4d86-8916-95cf47d1f4b9.png
    - title:
      contentList:
        - specialContent:
            text: Zookeeper
            level: 3
        - content: 直观展示集群服务列表：
      image: https://pek3b.qingstor.com/kubesphere-community/images/e40be9bd-5e38-4a76-8713-b1ad64606c17.png
    - title:
      contentList:
        - specialContent:
            text: Redis
            level: 3
        - content: 展示 Redis 命名空间无状态、有状态副本集、存储卷、服务、容器组等概览：
      image: https://pek3b.qingstor.com/kubesphere-community/images/d72004cf-c7fa-45b1-916a-dcd5c5d3fc4b.png
    - title:
      contentList:
        - content: 通过 WebShell 轻松查看集群状态：
      image: https://pek3b.qingstor.com/kubesphere-community/images/9981ba08-dfec-442c-ad5e-c590fa590c43.png

    - title: 日志系统
      contentList:
        - content: KubeSphere 的日志系统，通过其开源的 Fluentbit Operator 控制 FluentBit CRD 配置 Fluent Bit，可以通过 kubectl edit fluentbit fluent-bit 以 Kubernetes 原生的方式来更改 FluentBit 的配置。
        - content: 公司 Kube-apiserver、kube-scheduler、kubelet 等系统组件都是通过二进制部署，通过 systemd 管理。如果要采集 kubelet 日志，新建一个 Input Yaml 即可轻松实现：
      image: https://pek3b.qingstor.com/kubesphere-community/images/xdf-yaml-1.png
    - title:
      contentList:
        - content: 通过界面上工具箱中的日志查询，即可查看系统日志，对公司故障排查和集群监控特别有用。
      image: https://pek3b.qingstor.com/kubesphere-community/images/e3ee4224-a7f4-4068-a8bd-0a71106c2759.png

    - title: GitOps 实践
      contentList:
        - content: GitOps 目前被用作 Kubernetes 和云原生应用开发的运维模式，可以实现对 Kubernetes 的持续部署。它使用 Git 存储系统的状态，使得系统状态的修改痕迹可查看审计。
        - content: 公司基于 KubeSphere v3.1.1 的流水线，根据公司的场景，实现了基于 Git 的 DevOps（GitOps） 工作流水线服务发布流程。
        - content: 用 Top Pipeline 生成的流水线，有统一的格式，所以凭证必须统一。
      image: 
    - title:
      contentList:
        - specialContent:
            text: 凭证统一
            level: 3
        - content: Kubernetes 中 secret 是 namespace 层级的资源。在实际的使用过程中经常会遇到需要在多个 namespace 之间共享 secret 的需求，在多个 namesapce 下去创建 secret 或是逐一编辑，会带来许多重复工作。
        - content: 例如：KubeShere DevOps 项目中的凭证，有时每个项目都是一样的，所以没必要每次创建 DevOps 项目都去手动创建凭证。
        - content: 针对我们的 GitOps 场景，Harbor、Argo CD 的 GitOps 账户、GitLab 的账号凭证需要在多个 DevOps 项目之间同步。
        - content: 我们采用了 kubed（Config Syncer）+ Kyverno，在 kubesphere-devops-system 下创建的源 secret，将会自动同步到所有 devops project 下。达到统一、自动化管理凭证目的。
      image: https://pek3b.qingstor.com/kubesphere-community/images/260552ee-e505-4028-bfbe-4359e0bfe2fa.png
    - title:
      contentList:
        - content: 这里引入 Kyverno 的作用是：Kubesphere 根据 Secret 的 type 字段前缀有：credential.devops.kubesphere.io/ 就会处理。为了避免 kubesphere-devops-system 下的源 Secret 被 ks-controller-manager 同步。所以源 Secret 的 type 不可为 type： credential.devops.kubesphere.io/basic-auth。kubed 在执行同步的时候，Kyverno 会将其替换。这样控制器只会同步目标凭证到 Jenkins。
      image: 
    - title:
      contentList: 
        - specialContent:
            text: Top Pipeline
            level: 3
        - content: Top Pipeline 用来自动化创建 GitOps 仓库，生成服务部署清单、pipeline CR 清单、Application CR 清单，将清单提交到 GitLab 仓库，并将 Application 创建到 K8s 集群中。
      image: https://pek3b.qingstor.com/kubesphere-community/images/1374bfe4-b7a6-4af4-bb62-bfe4e8486a38.png
    - title:
      contentList: 
        - content: 整体用 Groovy 语法实现如下步骤的流水线：
      image: https://pek3b.qingstor.com/kubesphere-community/images/728ad0b8-0ea4-4267-9276-f572ade0bb94.png
    - title:
      contentList: 
        - content: 输入服务配置参数，点击确定运行。
      image: https://pek3b.qingstor.com/kubesphere-community/images/887a562f-2d92-4ba6-84bf-6aeccaef4422.png
    - title:
      contentList: 
        - content: 流水线会自动获取需要选择的动态参数，点击下一步，选择参数：
      image: https://pek3b.qingstor.com/kubesphere-community/images/30c975a5-57c5-4687-aac3-aea0bc8c9051.png
    - title:
      contentList: 
        - content: 选择动态参数之后，程序会自动检查 GitLab 中是否存在该 DevOps 项目的仓库，不存在会自动新建仓库；最终创建 Application 和服务 Pipeline CR 到 Argo CD 所在的 Kubernetes 集群。
        - content: 查看流水线运行每一个步骤的执行日志：
      image: https://pek3b.qingstor.com/kubesphere-community/images/448ef4c9-87ca-4562-bc4f-95be61b2533d.png
    - title:
      contentList: 
        - specialContent:
            text: 服务流水线
            level: 3
        - content: 下面是生成的统一风格的服务 GitOps 流水线：
      image: https://pek3b.qingstor.com/kubesphere-community/images/f63f8402-f017-403e-9d56-3ac48d30daf0.png
    - title:
      contentList: 
        - content: 详细步骤：
      image: https://pek3b.qingstor.com/kubesphere-community/images/deeb73a4-9c80-415d-b489-593a622c7bc2.png
    - title:
      contentList: 
        - content: kubesphere/builder-base:v3.2.2 镜像中包含了 kustomize 和 Git，我们将 Argo CD 命令行集成到这个镜像中，用生成的镜像作为 Agent。
        - content: kustomize：使用 kustomize edit set image 更新 kustomization.yaml 中镜像 Tag，以及校验语法是否正确，避免语法不正确提交。提交时，需要先 pull 再 push，并增加失败重试。
        - content: Argo CD：当 GitLab 仓库发生变更，Argo CD 默认是 3~4 分钟触发同步，时间较长。为了及时触发 CD 同步，用集成到 Agent 镜像中的 argocd 命令行工具，并建专门的 gitops 账号，通过 RBAC 控制该账号的权限。（执行 argocd sync 命令也需要加失败重试）
        - content: 审核阶段：如果点击终止（一般在新版本测试不通过的情况下点击），将回滚上一个阶段的镜像版本（通过 git revert 命令回退某一次提交），如果 30 分钟内没有点击，或者点了继续，本次发布流程结束。
      image:    

    - type: 2
      content: 'KubeSphere 帮助我们简化了多集群管理，服务发布效率得到大幅提升，监控日志集中管理，让集群排障不再是黑盒。'
      author: '新东方'

    - title: 未来规划
      contentList:
        - content: KubeSphere 帮助我们简化了多集群管理，服务发布效率得到大幅提升，监控日志集中管理，让集群排障不再是黑盒。
        - content: 未来随着公司在中间件、微服务、DevOps  方向上发力，利用 KubeSphere 生态，逐步扩大应用场景，在服务治理 Istio、APM、Serverless 、边缘计算等领域做更多的实践。
      image: 

  rightPart:
    icon: /images/case/logo-xdf.png
    list:
      - title: 行业
        content: 教育
      - title: 地点
        content: 中国
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 一站式服务生命周期管理，集群运维管理
      - title: 采用功能
        content: DevOps、日志、监控、多集群管理
---
