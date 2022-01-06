---
title: '去哪儿网 Kubernetes 多集群和金丝雀部署最佳实践'
author: '陈靖贤，邹晟'
createTime: '2021-12-10'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubecon2021-qunar.png '
---

## 议题简介

去哪儿网是中国领先的在线旅游平台，成立于 2005 年 5 月，总部位于北京。去哪儿网基础设施团队在 2020 年底开始研究和应用 k8s，其计划在 2021 年底前将在生产中将所有应用程序迁移到 Kubernetes 中。目前去哪儿网使用 KubeSphere 作为多 K8s 集群管理平台，大大提高了运维同学的工作效率，同时作为统一的集群入口，它也保障了业务数据的安全。

随着云原生时代的到来，学习和拥抱云原生不可避免，因为其可以使业务运营更加敏捷。容器化是将应用转移到 Kubernetes 之前的第一步。如何将数以千计的应用程序高效、顺畅地从基于内核的虚拟机 (KVM) 迁移到容器已成为去哪儿网基础设施团队面临的一个巨大挑战。在此次分享中，去哪儿网基础设施团队分享讨论：

- 如何将 CI/CD 模式从 KVM 发展到云原生时代
- 如何运用多集群和基于批量的 Canary 部署帮助应用程序、sdk 顺利进行升级
- 从 CI/CD 演化路径中吸取的教训。
- KubeSphere 多集群在去哪儿网的落地实践

## 分享者简介

陈靖贤，去哪儿网 DevOps 产品经理，目前主要负责在去哪儿传播 DevOps 文化，调查、导入和开发流程、工具、平台的最佳实践，帮助公司以更快的速度交付软件，降低风险，降低运营成本。

邹晟，去哪儿网基础架构团队高级 DevOps 工程师，现主要负责 CI/CD 平台开发与维护，云原生技术研究与实现。同时也是 KubeSphere Talented Speaker。

## 视频回放

<video id="videoPlayer" controls="" preload="true">
  <source src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeCon2021-China-qunar.mp4" type="video/mp4">
</video>

## 对应文章

整理中，敬请期待