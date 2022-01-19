---
title: "开源峰会"
css: "scss/conferences.scss"

viewDetail: 查看详情

list:
  - name: KubeCon 大会 2021
    content: KubeSphere 社区在 KubeCon + CloudNativeCon 2021 上的技术主题分享。
    icon: images/conferences/kubecon.svg
    bg: images/conferences/kubecon-bg.svg
    bgColor: linear-gradient(270deg, rgb(101, 193, 148), rgb(76, 169, 134))
    children:
      - name: 基于 RBAC 和 Kubefed 的 Kubernetes 多集群和多租户管理
        summary: 软隔离是一种没有严格隔离不同用户、工作负载或应用程序的隔离形式。就 Kubernetes 而言，软隔离通常由 RBAC 和命名空间隔离。当集群管理员跨多个 Kubernetes 集群实现隔离时，会遇到许多挑战，如身份验证和授权、资源配额、网络策略、安全策略等。
        author: 万宏明
        link:  rbac/
        image: https://pek3b.qingstor.com/kubesphere-community/images/kubecon2021-hongming.png

      - name: 用统一的方式分发 Helm 和 Operator 应用
        summary: 许多应用程序定义和框架都来自云原生计算基金会领域，Helm 和 Operator 是 Kubernetes 生态系统中打包和管理应用程序的最流行方式。根据云原生计算基金会 2020 年的调查，以多集群和多云为代表的企业架构已成为现代基础设施的新趋势。如何利用以应用为中心的概念来提供自助服务，跨多个 Kubernetes 集群和云交付/部署应用程序？
        author: 赖正一
        link: apps/
        image: https://pek3b.qingstor.com/kubesphere-community/images/kubecon2021-zhengyi.png

      - name: 用云原生无服务器技术构建现代 FaaS（函数即服务）平台
        summary: 作为无服务器的核心，FaaS（函数即服务）越来越受到人们的关注。新兴的云原生无服务器技术可以通过用更强大的云原生替代方案替换 FaaS平台的关键组件，从而构建一个强大的现代 FaaS 平台。
        author: 霍秉杰，雷万钧
        link:  openfunction/
        image: https://pek3b.qingstor.com/kubesphere-community/images/kubecon2021-ben.png

      - name: 去哪儿网 Kubernetes 多集群和金丝雀部署最佳实践
        summary: 随着云原生时代的到来，学习和拥抱云原生不可避免，因为其可以使业务运营更加敏捷。容器化是将应用转移到 Kubernetes 之前的第一步。如何将数以千计的应用程序高效、顺畅地从基于内核的虚拟机 (KVM) 迁移到容器已成为去哪儿网基础设施团队面临的一个巨大挑战。
        author: 邹晟，陈靖贤
        link:  qunar/
        image: https://pek3b.qingstor.com/kubesphere-community/images/kubecon2021-qunar.png   

  - name: KubeCon 大会 2020
    content: KubeSphere 团队在 KubeCon + CloudNativeCon 2020 上的技术主题分享。
    icon: images/conferences/kubecon.svg
    bg: images/conferences/kubecon-bg.svg
    bgColor: linear-gradient(270deg, rgb(101, 193, 148), rgb(76, 169, 134))
    children:
      - name: 基于云原生系统通用模型的计量计费系统
        summary: 云原生服务比传统云服务更具弹性和可定制性。计算能力、存储和网络能力应该按需求实时分配，指标计量和计费参数复杂，产品定价策略将依靠许多参数不仅包括资源指标，和不同的资源提供者将使用不同的程序创建和释放资源，所以硬编码的计量/计费系统不能满足快速增长的需求。
        author: Anne Song，马丹
        link:  metering/
        image: http://pek3b.qingstor.com/kubesphere-community/images/kubecon2020-metering.png

      - name: 多租户环境中的 Kubernetes 事件导出、过滤和警报
        summary: K8s 事件管理的各个方面，包括事件导出、过滤、告警及通知；如何使用 Kube-Events Operator 管理事件导出、过滤和告警；如何处理多租户环境中的事件告警需求；如何使用 Alertmanager 像管理 Prometheus发出的告警一样，来管理 K8s 事件告警；如何使用 Notification Manager 在多租户环境下管理 Alertmanager 发出的通知。
        author: 霍秉杰，向军涛
        link: event/
        image: http://pek3b.qingstor.com/kubesphere-community/images/kubecon2020-event.jpg

  - name: KubeCon 大会 2019
    content: KubeSphere 团队在 KubeCon + CloudNativeCon 2019 Shanghai 上的技术主题分享。
    icon: images/conferences/kubecon.svg
    bg: images/conferences/kubecon-bg.svg
    bgColor: linear-gradient(270deg, rgb(101, 193, 148), rgb(76, 169, 134))
    children:
      - name: Porter-面向裸金属环境的 Kubernetes 开源负载均衡器
        summary: 我们知道，在 Kubernetes 集群中可以使用 “LoadBalancer” 类型的服务将后端工作负载暴露在外部。云厂商通常为 Kubernetes 提供云上的 LB 插件，但这需要将集群部署在特定 IaaS 平台上。然而，许多企业用户通常都将 Kubernetes…
        author: 宋雪涛
        link: porter/
        image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611115347.png

      - name: 云原生可观测性之日志管理
        summary: 日志通常含有非常有价值的信息，日志管理是云原生可观测性的重要组成部分。不同于物理机或虚拟机，在容器与 Kubernetes 环境中，日志有标准的输出方式(stdout…
        author: 霍秉杰，马丹
        link: logging/
        image: https://pek3b.qingstor.com/kubesphere-docs/png/20200607224942.png

      - name: 基于 Kubernetes 的 Serverless Jenkins — Jenkins X
        summary: 在云原生时代，应用模块不断被拆分，使得模块的数量不断上涨并且关系也越加复杂。企业在落地云原生技术的时候同事也需要有强大的 DevOps 手段，没有 DevOps 的云原生不可能是成功的。Jenkins X 是 CDF（持续交付基金会）与
        author: 夏润泽
        link: jenkins-x/
        image: https://pek3b.qingstor.com/kubesphere-docs/png/20190930095450.png
   
  - name: QCon 全球软件开发大会
    content:
    icon: images/conferences/qcon.svg
    bg: images/conferences/qcon-bg.svg
    bgColor: linear-gradient(to left, rgb(52, 197, 209), rgb(95, 182, 216))
    children:
      - name: 基于 CSI Kubernetes 存储插件的开发实践
        summary: 现在很多用户都会将自己的应用迁移到 Kubernetes 容器平台中。在 Kubernetes 容器平台中，存储是支撑用户应用的基石。随着用户不断的将自己的应用深度部署在 K8S 容器平台中，但是我们现有的 Kubernetes…
        author: 王欣
        link: csi/
        image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611114611.png
---
