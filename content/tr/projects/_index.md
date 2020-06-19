---
title: "Hakkında"


css: "scss/projects.scss"
name: Açık Kaynak Kodlu Projeler
groups:
  - name: Konteyner Platformu
    children:
      - title: KubeSphere
        icon: 'images/kubesphere.svg'
        link: ''
        description: 基于 Kubernetes 之上构建的以应用为中心的多租户容器平台，支持部署运行在任何基础设施之上，提供简单易用的操作界面以及向导式 UI，旨在解决 Kubernetes 的存储、网络、安全与易用性等痛点。
  
  - name: Uygulama Yönetimi 
    children:
      - title: OpenPitrix
        icon: ''
        link: ''
        description: 开源的多云应用管理平台，用来在多云环境下打包、部署和管理不同类型的应用，包括传统应用、微服务应用以及 Serverless 应用等，其中云平台包括 AWS、Kubernetes、QingCloud、VMWare。

  - name: Depolama Bileşenleri
    children:
      - title: QingStor-CSI
        icon: ''
        link: ''
        description: QingStor CSI 插件实现 CSI 接口，使容器编排平台（如 Kubernetes）能够使用 NeonSAN 分布式存储的资源。目前，QingStor CSI 插件实现了存储卷管理和快照管理功能，并在 Kubernetes v1.12 环境中通过了 CSI Sanity 测试。
      
      - title: QingCloud-CSI
        icon: ''
        link: ''
        description: QingCloud CSI 插件实现了 CSI 接口，并使容器管理平台能够使用 QingCloud 云平台的块存储资源。目前，QingCloud CSI 插件已经在 Kubernetes v1.14/v1.15 环境中通过了 CSI 测试。

---