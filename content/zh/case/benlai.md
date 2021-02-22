---
title: Benlai
description:

css: scss/case-detail.scss

section1:
  title: 本来生活
  content: 本来生活网创办于2012年，是一家生鲜电商平台，提供蔬菜、水果、海鲜等优质生鲜果蔬食材食品网购服务。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 从优质食品供应基地、供应商中精挑细选，剔除中间环节，提供冷链配送、食材食品直送到家服务。致力于通过保障食品安全、提供冷链宅配、基地直送来改善中国食品安全现状，成为中国优质食品提供者。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611182545.png

    - title: '技术现状：基础设施'
      contentList:
        - content: 部署在 IDC 机房
        - content: 拥有 100 多台物理机
        - content: 虚拟化部署
      image:

    - title: 存在的问题
      contentList:
        - content: 物理机 95% 以上的占用率
        - content: 相当多的资源闲置
        - content: 应用扩容比较慢
      image:

    - title: 为什么选择 DevOps 与 Kubernetes
      contentList:
        - content: '公司走上容器平台的 DevOps 这条康庄大道主要目标有三:'
        - content: 1、提高资源利用率
        - content: 2、提高发布效率
        - content: 3、降低运维的工作成本等等
        - content: 其实最主要的还是省钱。接下来介绍我们本来生活的 DevOps 升级之路。
      image:

    - type: 1
      contentList:
        - content: 提高资源利用率
        - content: 提高发布效率
        - content: 降低工作成本

    - title: 'Level 1: DevOps 工具选型'
      contentList:
        - content: 我们从初步接触 DevOps 相关知识，在此期间偶然了解到开源的 KubeSphere (kubesphere.io)。KubeSphere 是在 Kubernetes 之上构建的以应用为中心的企业级容器平台，支持敏捷开发与自动化运维、DevOps、微服务治理、灰度发布、多租户管理、监控告警、日志查询与收集、应用商店、存储管理、网络管理等多种业务场景。
        - content: KubeSphere 内置的基于 Jenkins 的 DevOps 流水线非常适合我们，并且还打通了我们日常运维开发中需要的云原生工具生态，这个平台正是我们当初希望自己开发实现的。
        - content: 于是，我们开始学习 KubeSphere 与 Jenkins 的各种操作、语法、插件等，开始构建适合我们自己的 CI/CD 的整个流程。最终结合 KubeSphere 容器平台，初步实现了第一级的 CI/CD 流程。
        - content: 在 Level 1 的流程中，我们主要实现了拉取代码、编译应用、发布镜像到本地仓库、部署到本地 Kubernetes 集群。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611182621.png

    - title: 积累经验值
      contentList:
        - content: 在 KubeSphere 初步完成 CI/CD 流程后，我们继续研究和完善流水线。比如，在研究 Jenkins Pipeline 的自定义方法后，我们实现了动态生成应用相关信息。Jenkins 成为企业级的主流 CI/CD 软件很大一部原因是其拥有丰富的插件生态，因此我们继续研究 Jenkins 插件，并在流水线中实现了上传 FTP、通过命令动态部署 ConfigMap、部署存储等流程。
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611182839.png

    - type: 2
      content: 'KubeSphere 内置的基于 Jenkins 的 DevOps 流水线非常适合我们，并且还打通了我们日常运维开发中需要的云原生工具生态.'
      author: '杨杨'

    - title: 'Level 2: 完善流水线'
      contentList:
        - content: 经过不停的努力学习 Jenkinsfile 语法及插件后，我们的 CI/CD 流程升级到 Level 2。我们在流水线中，加入了 部署配置、部署存储、上传 CDN 等。
        - content: 因为业务需要，我们的 CI/CD 流程需要 分为几种类型的发布，而每种类型的发布都需要不同的参数；于是我们按照之前学习到的 Jenkins Pipeline 语法，想当然的使用 When 条件语句去判断传入的发布类型跳转到不同 Stage ，然后在通过 Input 输入参数语句实现不同参数的输入，但是发现 Input 参数语句的优先级高于 When 条件语句，也就是说不管我选择哪个发布类型都要先输入参数，然后系统才会去判断是否跳过该 Stage，这与我们想的完全不一样。于是我们各种 Google 和查官方文档，最后找到另外一种 input 语法，可以把 input 的优先级降低，使得 When 条件语句先判断，这样就满足了我们的需求。
      image:

    - title: 'Level 3: 回滚'
      contentList:
        - content: 经过采坑动态参数，我们将 CI/CD  流程升级到 Level 3，即新增了根据不同发布类型的任务，满足动态生成所需的参数。
        - content: 在实际生成环境中我们回滚肯定是要将应用的程序和 ConfigMap 一起回滚的，但是 Kubernetes 的 ConfigMap 是没有版本控制的，这对于管理就会非常麻烦。于是，我们只能使用笨办法，在每次发布应用时，去配置中心抓取当前应用的配置生成 ConfigMap。并且，在 ConfigMap 名称后面跟上当前应用的发布版本，然后，在部署到 Kubernetes 时，会将该版本的 ConfigMap 挂载到当前发布的 Deployment 中，这样我们在回滚或发布时，就能直接将应用的镜像和 ConfigMap 一起回滚到指定版本。
      image:

    - title: 标准化流程
      contentList:
        - content: 经过前期各种学习和采坑，我们的 CI/CD 流程基本成熟了后，我们开始考虑是不是能把整个流程标准化，每个应用只需要调用这个标准化流程去执行发布就好；而不是把 CI/CD 流程写到每个应用的 Pipeline 中；不然以后应用多了，万一需要修改 CI/CD 流程，想想有那么多应用的流程要修改，会比较麻烦。
        - content: 我们搜索了标准化的相关信息，终于发现了一个叫 Jenkins 的扩展共享库。通过 Jenkins 扩展共享库我们把 CI/CD 流程拆分为 通用方法 和 流程逻辑 两块。然后每个应用的 Jenkins Pipeline 中只需按要求传入参数，然后调用要执行的流程方法即可；每个应用的 Jenkins Pipeline 的代码量从原来的 500 多行减少到了不到 30 行。
      image:

    - title: 'Level 9: 实现一键发布'
      contentList:
        - content: 经过采坑和填坑的不懈努力，我们积累了很好的经验；一下子跳级到 Level 9，CI/CD 流程有了质的飞跃，化整为零了。
        - content: 以后的持续发布过程，只需要在 KubeSphere 平台点击运行，选择发布类型和环境，然后点击确定，就可以去喝一杯咖啡 ☕️ ，安静地等待服务发布上线！
      image:

  rightPart:
    icon: /images/case/section6-benlai.jpg
    list:
      - title: 行业
        content: 电商
      - title: 地点
        content: 中国
      - title: 云类型
        content: 私有云
      - title: 挑战
        content: 资源利用率、交付效率、成本
      - title: 采用功能
        content: CI/CD, DevOps, Jenkins

---
