---
title: "开源项目"


css: "scss/projects.scss"
name: 开源项目
groups:
  - name: 容器平台
    children:
      - title: "KubeSphere 容器平台"
        icon: 'images/projects/kubesphere.svg'
        link: 'https://github.com/kubesphere/kubesphere'
        description: 基于 Kubernetes 之上构建的以应用为中心的多租户容器平台，支持部署运行在任何基础设施之上，提供简单易用的操作界面以及向导式 UI，旨在解决 Kubernetes 的存储、网络、安全与易用性等痛点。

  - name: 应用管理
    children:
      - title: OpenPitrix 多云应用管理平台
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200607231502.png'
        link: 'https://github.com/openpitrix/openpitrix'
        description: 开源的多云应用管理平台，用来在多云环境下打包、部署和管理不同类型的应用，包括传统应用、微服务应用以及 Serverless 应用等，其中云平台包括 AWS、Kubernetes、QingCloud、VMWare。

  - name: 服务代理
    children:
      - title: OpenELB 负载均衡器
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608102707.png'
        link: 'https://github.com/openelb'
        description: CNCF 沙箱项目，此前命名为 PorterLB，是为物理机（Bare-metal）、边缘（Edge）和私有化环境设计的负载均衡器插件，可作为 Kubernetes、K3s、KubeSphere 的 LB 插件对集群外暴露 “LoadBalancer” 类型的服务。

  - name: 安装部署
    children:
      - title: KubeKey
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608103108.png'
        link: 'https://github.com/kubesphere/kubekey'
        description: KubeKey 是 Kubernetes 和 KubeSphere 的下一代 Installer（安装程序），旨在更方便、快速、高效和灵活地安装 Kubernetes 与 KubeSphere。KubeKey 摒弃了原来 Ansible 带来的依赖问题，用 Go 重写，支持单独 Kubernetes 或整体安装 KubeSphere。

  - name: 集群巡检
    children:
      - title: KubeEye
        icon: 'https://pek3b.qingstor.com/kubesphere-community/images/202211111151370.png'
        link: 'https://github.com/kubesphere/kubeeye'
        description: KubeEye 是为 Kubernetes 设计的巡检工具，用于发现 Kubernetes 资源（使用 OPA ）、集群组件、集群节点（使用Node-Problem-Detector）等配置是否符合最佳实践，对于不符合最佳实践的，将给出修改建议。KubeEye 支持自定义巡检规则、插件安装，通过 KubeEye Operator 能够使用 web 页面的图形化展示来查看巡检结果以及给出修复建议。

  - name: Serverless
    children:
      - title: OpenFunction
        icon: 'https://pek3b.qingstor.com/kubesphere-community/images/openfunction-logo-2.png'
        link: 'https://github.com/OpenFunction'
        description: OpenFunction 是一个云原生、开源的 FaaS（函数即服务）框架，旨在让开发人员专注于业务逻辑，而不必关心底层运行环境和基础设施。开发人员只需集中精力以函数的形式开发业务相关的源代码。

  - name: 日志管理
    children:
      - title: Fluent Operator
        icon: 'https://pek3b.qingstor.com/kubesphere-community/images/fluent-operator-icon.svg'
        link: 'https://github.com/fluent/fluent-operator'
        description: 使用 Fluent Operator 可以灵活且方便地部署、配置及卸载 Fluent Bit 以及 Fluentd。同时, 社区还提供支持 Fluentd 以及 Fluent Bit 的海量插件，用户可以根据实际情况进行定制化配置。

  - name: 消息通知
    children:
      - title: Notification Manager
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608105148.png'
        link: 'https://github.com/kubesphere/notification-manager'
        description: Notification Manager 管理多租户 Kubernetes 环境中的消息通知。它支持接收来自不同发送方的告警或通知，然后根据告警/通知的租户标签 (如 “namespace”)向平台的各个租户接收方发送通知，支持邮件、钉钉、飞书、企业微信、Slack 等通知渠道。

  - name: Kubernetes 事件
    children:
      - title: kube-events
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608111002.png'
        link: 'https://github.com/kubesphere/kube-events'
        description: Kube-events 围绕 Kubernetes 事件（Events），支持对事件进行多维度处理，例如向接收方发送事件，针对事件发出告警通知。在其中一些维度中，Kube-events 还提供了可配置的过滤规则以满足不同的业务需求。

  - name: 告警系统
    children:
      - title: Alerting System
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608111200.png'
        link: 'https://github.com/kubesphere/alert'
        description: KubeSphere Alert 是一种企业级的通用高性能报警系统。

  - name: CI/CD
    children:
      - title: S2i-operator
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608111455.png'
        link: 'https://github.com/kubesphere/s2ioperator'
        description: Source-to-Image (S2I) Operator 是一个基于 Kubernetes CRD 的控制器，它为声明式的 CI/CD 流水线提供了简单的 Kubernetes 风格的资源。S2I Operator 通过向容器镜像中注入源代码，并让容器准备执行源代码来创建准备运行的镜像。

  - name: 前端设计
    children:
      - title: kube-design
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608114816.png'
        link: 'https://github.com/kubesphere/kube-design'
        description: kube-design 是为 KubeSphere Console 前端创建的一组 React 组件库。如果您想开发与扩展 KubeSphere 控制台（Console）的前端，这个库在定制 KubeSphere 前端时会非常有用。

  - name: 存储插件
    children:
      - title: QingStor-CSI
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608111848.png'
        link: 'https://github.com/yunify/qingstor-csi'
        description: QingStor CSI 插件实现 CSI 接口，使容器编排平台（如 Kubernetes）能够使用 NeonSAN 分布式存储的资源。目前，QingStor CSI 插件实现了存储卷管理和快照管理功能，并在 Kubernetes v1.12 环境中通过了 CSI Sanity 测试。

      - title: QingCloud-CSI
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608112327.png'
        link: 'https://github.com/yunify/qingcloud-csi'
        description: QingCloud CSI 插件实现了 CSI 接口，并使容器管理平台能够使用 QingCloud 云平台的块存储资源。目前，QingCloud CSI 插件已经在 Kubernetes v1.14/v1.15 环境中通过了 CSI 测试。
---
