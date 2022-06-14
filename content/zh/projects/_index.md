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
      - title: Porter 负载均衡器
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608102707.png'
        link: 'https://openelb.github.io/'
        description: 适用于物理部署 Kubernetes 环境的负载均衡器插件，Porter 使用物理交换机实现，利用 BGP 和 ECMP 从而达到性能最优和高可用性，提供用户在物理环境暴露 LoadBalancer 类型服务与云上获得一致性体验。

  - name: 安装部署
    children:
      - title: KubeKey
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608103108.png'
        link: 'https://github.com/kubesphere/kubekey'
        description: KubeKey 是 Kubernetes 和 KubeSphere 的下一代 Installer（安装程序），旨在更方便、快速、高效和灵活地安装 Kubernetes 与 KubeSphere。KubeKey 摒弃了原来 Ansible 带来的依赖问题，用 Go 重写，支持单独 Kubernetes 或整体安装 KubeSphere。

  - name: 日志管理
    children:
      - title: Fluentbit Operator
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608104816.png'
        link: 'https://github.com/kubesphere/fluentbit-operator'
        description: Fluentbit Operator 极大地方便了 Fluent Bit 在 Kubernetes 之上的部署，并且基于 Fluent Bit 提供了非常灵活日志管理，提供了 Fluent Bit 运维管理、自定义配置、动态加载等功能。

  - name: 消息通知
    children:
      - title: Notification Manager
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608105148.png'
        link: 'https://github.com/kubesphere/notification-manager'
        description: Notification Manager 管理多租户 Kubernetes 环境中的消息通知。它支持接收来自不同发送方的告警或通知，然后根据告警/通知的租户标签 (如 “namespace”)向平台的各个租户接收方发送通知，支持邮件、企业微信、Slack 等通知渠道，下个版本支持 Webhook。

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
