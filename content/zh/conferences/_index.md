---
title: "开源峰会"
css: "scss/conferences.scss"

viewDetail: 查看详情

list:
  - name: KubeCon 大会
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
