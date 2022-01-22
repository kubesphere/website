---
title: '基于 RBAC 和 Kubefed 的 Kubernetes 多集群和多租户管理'
author: '万宏明'
createTime: '2021-12-09'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubecon2021-hongming.png'
---

## 议题简介

软隔离是一种没有严格隔离不同用户、工作负载或应用程序的隔离形式。就 Kubernetes 而言，软隔离通常由 RBAC 和命名空间隔离。当集群管理员跨多个 Kubernetes 集群实现隔离时，会遇到许多挑战，如身份验证和授权、资源配额、网络策略、安全策略等。在本次演讲中，KubeSphere 维护人员分享了他们在设计隔离体系结构方面的经验和最佳实践。如何跨多个集群管理用户和身份验证。如何管理不同集群租户的资源配额。资源隔离机制以及如何跨多个集群授权资源。

## 分享者简介

万宏明，KubeSphere 研发工程师 & 核心贡献者，KubeSphere 多租户和安全团队负责人，专注于开源和云原生安全领域。

## 视频回放

<video id="videoPlayer" controls="" preload="true">
  <source src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeCon2021-China-hongming.mp4" type="video/mp4">
</video>

## 对应文章

整理中，敬请期待