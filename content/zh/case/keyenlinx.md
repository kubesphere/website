---
title: keyenlinx
description:

css: scss/case-detail.scss

section1:
  title:  技研智联
  content: 技研智联是一家专注于为纺织企业提供自动化控制系统软件、工业互联网应用平台、数字化转型与智能制造整体解决方案的高新技术企业。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 深圳市技研智联科技有限公司：为佛山技研智联科技有限公司子公司，前者为三技精密和研华合资公司。提供从工控设备，网关，云平台一体化的专业印染数字化工业互联网平台。
        - content: 佛山技研智联科技有限公司（以下简称“技研智联”）是由三技精密技术（广东）股份有限公司以及研华科技股份有限公司于 2020 年 8 月合资成立，是一家专注于为纺织企业提供自动化控制系统软件、工业互联网应用平台、数字化转型与智能制造整体解决方案，并为企业提供行业软件咨询、实施、集成等服务的高新技术企业，专精特新中小企业。
        - content: 公司发展至今已经是 100 多人规模专业技术产品团队，自主研发的 iTEX 智慧纺织云平台，目前已经连接 70 多家工厂，2000 多台设备，能够把工厂各个系统、各类跨业务的数据在同一个平台上打通，让企业实现基于数据和流程的业务协同。
        - content: 公司较早就开始拥抱云原生容器化部署，支持客户在公有云 iTEX 云平台使用 SaaS 产品，同时支持用户按私有云方式私有化部署安装使用。目前 IT 和运维团队规模 5 人，主要满足自身研发上云和客户安装部署运维需求。
      image: 

    - title: 背景介绍
      contentList:
        - content: 使用超融合服务器上分割部署 K8s 集群，通过 Rancher 来管理服务器集群。DevOps 用的 git 支持的脚步打 Docker 镜像方式，手动发布服务。存在服务器资源不足，扩展性欠缺，运维管理不便，技术框架差异等问题，随着业务发展需要底层资源管理，技术框架，公共服务统一服务化迫在眉睫。
      image: 

    - title: 选型
      contentList:
        - content: 作为公司基础服务平台团队，需要提供统一易用的容器服务发布部署管理一站式平台，期间对比了 Openshift，Rancher，KubeSphere 这几大开源 PaaS 容器管理平台，一方面 KubeSphere 优秀的交互体验一下击中了研发人员的心理，同时本着融合产品模块化开发的初衷，最终选择了 KubeSphere，希望能提高交互效果，另外期望可以提升整体产品底层设施稳定性和开发效率。
      image: 

    - type: 1
      contentList:
        - content: 集成发布更便捷
        - content: 性能监控更及时排错更快速
        - content: 租户权限控制更清晰安全性更高

    - title: 实践过程
      contentList:
        - content: K8s 集群基于腾讯云服务器 centos7.9 系统采用三个 Master 节点高可用集群多个 Worker 节点方案搭建，使用稳定 K8s v1.23.5 版本。分为开发，测试，预发布和生产四个私有网络 K8s 集群。
      image: 

    - title: 
      contentList:
        - specialContent:
            text: 网络方案
            level: 3
        - content: 网络采用 Calico CNI。相比 Flannel，Calico 网络插件具有如下优势：
        - content: 功能更全面，还可提供网络安全和管理；
        - content: Calico 不使用 Overlay 网络。相反，Calico 配置第 3 层网络，该网络使用 BGP 路由协议在主机之间路由数据包，性能具有优势 - 能做网络策略，可与服务网格 Istio 集成。
        - content: 集群网络为腾讯云 VPC 私有网络外网不可访问,对外采用负载均衡统一接入经过 APISIX 流量网关后再到业务网关处理。服务之间都是内网通过 K8s 虚拟网络解析服务名访问。
      image: 
    - title:
      contentList:
        - specialContent:
            text: DevOps 持续集成部署
            level: 3
        - content: 在使用 KubeSphere 之前公司公有云服务都部署在超融合服务器环境，使用 GitLab 的 CI 能力，在 Rancher 上发布服务。开发测试环境开发人员进行代码编译打包然后发布，生产环境开发人员打 tag 推送镜像，然后统一由运维人员使用 Rancher 进行发布部署。CI/CD 流程架构图如下：
      image: http://pek3b.qingstor.com/kubesphere-community/images/jyzl-1.png
    - title:
      contentList:
        - content: 改用 KubeSphere 后开发人员集成发布在 KubeSphere DevOps 项目里完成整个流程的编辑运行查看等操作。基于 Jenkins 脚本编排流水线，生产环境由运维人员进行 DevOps 项目授权操作。操作起来更流畅，能实现更复杂的流水线编排，但 Jenkins 容器镜像相对较大会吃资源一点。基于 KubepShere CI/CD 流程架构图如下：
      image: http://pek3b.qingstor.com/kubesphere-community/images/jyzl-2.png
    - title:
      contentList:
        - specialContent:
            text: 日志与监控
            level: 3
        - content: 
      image: http://pek3b.qingstor.com/kubesphere-community/images/jyzl-3.png
    - title:
      contentList:
        - content: 日志监控采用更为轻量的 Loki 系统组件来采集处理，并用 Grafana 进行可视化展示，监控使用 Prometheus，同样使用 Grafana 来展示。
      image: https://pek3b.qingstor.com/kubesphere-community/images/202302141725488.png
    - title:
      contentList:
        - specialContent:
            text: KubeSphere 账号权限管理
            level: 3
        - content: 各个应用普遍存在自己的账号角色体系，管理起来会比较繁琐，因此打通产品应用账号和 KubepShere 账号体系能极大提高配置使用体验，幸好 KubepShere 提供了 oauth 授权接口模板，只需要按照例子配置 url 及 client_id，写好回调处理接口即可打通账号授权登录。授权登录架构图如下：
      image: https://pek3b.qingstor.com/kubesphere-community/images/202302141726710.png

    - title: 使用效果
      contentList:
        - specialContent:
            text: 账号以及项目权限管理
            level: 3
        - content: 打通应用系统账号跟 KubepShere 账号授权后，用户及权限管理更容易便捷，KubeSphere 集成效果如下图：
      image: https://pek3b.qingstor.com/kubesphere-community/images/202302141727908.png
    - title:
      contentList:
        - content: 初次登录 KubeSphere 授权个人信息即可，后续登录无需重复授权操作。目前不足之处是企业租户和角色没有和我们平台应用打通，需要各自配置。授权信息需要账号 ID，账号名字以及邮箱等。第一次授权确认账号信息如下图所示：
      image: https://pek3b.qingstor.com/kubesphere-community/images/202302141727045.png
    - title: 
      contentList:
        - specialContent:
            text: 应用服务发布部署
            level: 3
        - content: 应用服务发布部署功能更全面，方便统一管理控制。
      image: https://pek3b.qingstor.com/kubesphere-community/images/202302141728151.png
    - title:
      contentList:
        - content: 在使用过程中也出现过偶尔卡住需要取消重新运行情况，多个流水线同时运行需要较长时间排队问题，后续运行效率这块希望能够优化。
      image: 
    - title: 
      contentList:
        - specialContent:
            text: 资源及服务性能监控
            level: 3
        - content: KubeSphere 监控提供了 Prometheus 监控套件，对服务器资源及使用情况能实时监控同时可以查询历史变化，极大方便了系统维护管理，提前发现系统资源瓶颈进行处理，提高稳定性。服务器集群监控如下图所示：
      image: https://pek3b.qingstor.com/kubesphere-community/images/202302141728860.png
    - title:
      contentList:
        - content: KubeSphere 同时支持对单个服务的性能和资源使用进行监控，对评估整体服务部署资源性能占用有了很好计算参考和优化方向。服务监控如下图所示：
      image: https://pek3b.qingstor.com/kubesphere-community/images/202302141729978.png
    - title: 
      contentList:
        - specialContent:
            text: 容器管理组件扩展
            level: 3
        - content: 2022 年六月底 KubeShere 3.3.0 版本发布后第一时间安装尝鲜，一开始全功能安装 KubeSphere，core，Prometheus，Istio，DevOps，monitor，APP 应用商店等各个组件。发现整个一套部署下去会很重，同时当前阶段有些组件还不太用得上，于是在部署安装配置文件里对一些模块（如 Istio，APP 商店）设置为 false 不安装即可。
      image: 

    - type: 2
      content: 'KubeSphere 帮助我们解决了 K8s 集群管理和监控问题，让服务部署、监控、日志查询排错变得更容易，大大提升了研发效率，运维安全性也得到了可靠保障。'
      author: '技研智联'

    - title: 未来规划
      contentList:
        - content: PaaS 容器管理监控等基础设施作为企业产品服务的重要底座，稳定性，易用性，可适配性也是我们不断追求的目标，因此计划后续结合 KubeSphere 强大的容器管理平台能力进行自身产品需求服务管理进行融合，几个重要方向如下：
        - content: 1. 轻量化部署 KubeSphere 核心组件，同时开发适配自己需要的插件。
        - content: 2. 轻量化部署后做多环境集群统一管理。
        - content: 3. 同时特殊场景下支持混合云场景。
        - content: 4. 根据后续业务量合适时机上 Istio 和 Serverless。
      image: 

  rightPart:
    icon: /images/case/logo-keyenlinx.png
    list:
      - title: 行业
        content: 工业互联网
      - title: 地点
        content: 中国
      - title: 云类型
        content: 公有云和私有云
      - title: 挑战
        content: 部署服务及监控割裂效率低，专业云原生开发团队要求高组建困难，业务团队多租户管理复杂安全稳定性急需提升
      - title: 采用功能
        content: 容器管理、DevOps、日志、监控
---
