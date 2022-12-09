---
title: 'KubeSphere v3.3.1 权限控制详解'
tag: 'KubeSphere'
keywords: 'KubeSphere, 权限, 租户, RBAC, Workspace, 企业空间'
description: '本文介绍了 KubeSphere v3.3.1 的权限控制和租户解析，以及新增角色 Platform Self Provisioner 的设计'
createTime: '2022-12-06'
author: '周文浩'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202212091124389.jpg'
---

> 作者：周文浩，青云科技研发工程师，KubeSphere Maintainer。热爱云原生，热爱开源，目前负责KubeSphere 权限控制的开发与维护。

KubeSphere 3.3.1 已经发布一个多月了。 3.3.1 版本对于 KubeSphere 来说只是一个小的 Patch 版本，但是权限控制模块改动较大。这篇文章将从开发者的视角为你分享权限控制模块的改动内容。

这次的改动的主要目的是提升 KubeSphere 权限控制的安全性和易用性。使用过 KubeSphere 的小伙伴应该对 KubeSphere 的租户体系有一些印象，这对于用户来说是非常重要的一部分。

## 权限控制及租户解析

在介绍这次的改动前，我将先简单为你介绍 KubeSphere 的权限控制和租户体系，这 对于理解本次 3.3.1 版本对于权限控制的改动有非常大的帮助。或者你可以参考[创建企业空间、项目、用户和平台角色](https://kubesphere.io/zh/docs/v3.3/quick-start/create-workspace-and-project/)自己动手实验一下。

我们借鉴了 Kubernetes 的 RBAC 权限控制机制，使用**角色**给租户授予对 KubeSphere 的操作权限，而角色是由**授权项**组成的一个权限实体。角色分为内置角色和自定义角色，在通常的使用场景下，我们希望内置角色就能够覆盖用户的使用需求。如果你有特殊的权限要求则可以自定义一个角色。自定义角色使得你可以用 KubeSphere 提供的授权项随意组合，创建一个特定的角色。

角色由分为不同的层级，从租户体系来看，我们将整个 KS 分为四个层级，即：

- 平台 (Platform)
- 企业空间（Workspace）
- 命名空间 (Namespace) - 集群 (Cluster)

与之对应的角色则是：

- 平台角色 (Platform Role)
- 企业空间角色 (Workspace Role)
- 命名空间角色 (Namespace Role)
- 集群角色 (Cluster Role)。

下面这张图可以帮助你理解不同层级和角色之间的关系。

从资源层级来看，命名空间属于企业空间，企业空间属于平台。在这里我们只将集群作为一个部署命名空间的资源池。

租户可以被邀请进多个企业空间，并授予企业空间角色。在企业空间中，又可以被邀请到多个命名空间，并授权命名空间角色。

![](https://pek3b.qingstor.com/kubesphere-community/images/202212091127682.png)

## 角色

### 删除角色

- 平台级: Users Manager (用户管理员)，Workspaces Manager (企业空间管理 员)

基于安全性考虑，我们删除了两个内置平台角色：Users Manager (用户管理员) 和 Workspaces Manager (企业空间管理员)。

用户管理员可以创建任意层级、任意权限的自定义用户，如果你需要，甚至可以使用用户管理员来创建一个平台管理员 (Platform Administrator) 。对于一个安全的权限控制体系来说应是不被允许的，这会带来极强的越权风险，所以我们删除了这个角色。删除这个角色之后，我们只能使用平台管理员来创建角色。

企业空间管理员可以用来管理平台中所有的企业空间及企业空间中资源。企业空间对于 KubeSphere 来说是一个及其重要的资源，在平台中企业空间是集群中所有资源的载体。所以我们删除了这个角色，以保证除平台管理员之外的角色的权利过于集中。

### 新增角色

- 平台级：platform-self-provisioner 为了使得企业空间的管理更加方便易用，我们又新增平台角色 Platform Self Provisioner

## Platform Self Provisioner 设计

### 基本原型

可以创建企业空间（无法修改和删除），管理自己创建的企业空间内的所有资源。

同时由于企业空间属于平台层级，企业空间内的所有资源在多集群环境下应该可以部 署在多个集群中。所以对于多集群环境，Platform Self Provisioner 在以下情况下可以 在集群中部署企业空间内的资源。

### 多集群环境下企业空间部署

+ 开启了集群可见性的集群，self-provisioner 创建的企业空间，可以使用这个集 群部署项目
+ 末开启集群可见性的集群，self-provisioner 创建的企业空间，需要向（platform-admin）平台管理员，集群管理员（cluster-admin）申请这个集群 的部署授权

### 单集群环境下企业空间部署

self-provisioner 创建的企业空间，可以在当前集群下部署项目。

### 对自定义角色的限制

对于自定义角色来说，我们则是屏蔽了某些授权项，以限制自定义角色的权限。内置角色的对应权限任然可用，我们从三个层级对自定义角色屏蔽了相关授权项。自定义角色也是基于同样的考虑，屏蔽的都是与角色、成员、企业空间相关的权限。

- 平台级：用户管理，角色管理，企业空间管理；
- 企业空间级：成员管理，角色管理，组管理；
- 命名空间级：成员管理，角色管理。

### 升级策略

如果已有旧版本的 KubeSphere 集群，在升级到 KubeSphere 3.3.1 版本时，我们也有自动的升级 Job，对已有的角色进行迁移。具体的升级方式可见使用 KubeKey 升级。

### 自定义角色的升级

对于已有上述已禁用权限的自定义角色，仍然保留其角色，但是删除其包含的已禁用的权限。

具体策略:

- 重新创建一个同名的角色，但是不包含旧的权限项。

### 内置角色升级

对于已绑定上述废弃的内置角色的租户，将之前的租户的角色降级为 platform-regular。