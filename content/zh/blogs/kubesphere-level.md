---
title: '基于 KubeSphere 的分级管理实践'
tag: 'KubeSphere'
keywords: 'KubeSphere, 分级管理, level'
description: '我们在 KubeSphere 的基础上进行了改造，以适应租户与资源之间和资源与资源之间的分级管理，同时在项目的网络策略中，增加黑名单和白名单策略，增强了项目间的网络隔离，让资源的管理更安全。'
createTime: '2022-06-22'
author: '许伟'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-level-cover.png'
---

> 作者：许伟，航天网信研发工程师

K8s 是容器编排和分布式应用部署领域的领导者，在 K8s 环境中，我们只需要关心应用的业务逻辑，减轻了我们服务器网络以及存储等方面的管理负担。对于一个用户而言，K8s 是一个很复杂的容器编排平台，学习成本非常高。KubeSphere 抽象了底层的 K8s，并进行了高度的产品化，构建了一个全栈的多租户容器云平台，为用户提供了一个健壮、安全、功能丰富、具备极致体验的 Web 控制台，解决了 K8s 使用门槛高和云原生生态工具庞杂等痛点，使我们可以专注于业务的快速迭代，其多维度的数据监控，对于问题的定位，提供了很大的帮助。

### 为什么要在 KuberSphere 上实现分级管理

在 KubeSphere 中，资源可以在租户之间共享，根据分配的不同角色，可以对各种资源进行操作。租户与资源之间、资源与资源之间的自由度很高，权限粒度也比较大。在我们的系统中，资源是有权限等级的，像是低等级用户可以通过邀请、赋予权限等操作来操作高等级资源，或者像是低等级项目中的 Pod 可以调度到高等级的节点上，对资源。诸如此类跨等级操作资源等问题，我们在 KubeSphere 基础上来实现了分级管理。

### 什么是分级体系

分级，顾名思义就是按照既定的标准对整体进行分解、分类。我们将其抽象成一个金字塔模型，从地基到塔顶会有很多个层级，我们将公共资源作为金字塔的地基，拥有最高权限的 admin 作为塔顶，其他资源按照权限等级划分成不同等级。低层级资源是不能访问高等级资源，高等级资源可以获取它等级之下的所有资源，构建了这样一个权益递减、层级间隔离的分级体系。

![](https://pek3b.qingstor.com/kubesphere-community/images/level-xuwei-1.jpg)

### 如何实现分级管理

我们定义了一个代表等级的标签 `kubernetes.io/level`。以一个多节点的集群为例，首先我们会给用户、企业空间、节点等资源打上代表等级的标签。在邀请用户加入企业空间或者项目时，要求加入的企业空间或者项目的等级不得高于用户的等级，同样项目在绑定企业空间时，也要求项目的等级不得高于企业空间的等级，才能对资源进行纳管；我们认为同一项目下的资源的等级是相同的，基于项目创建的负载、Pod、服务等资源的等级跟项目保持一致；同时 Pod 中加入节点亲和性，以使 Pod 调度到不高于其权限等级的节点上。

![](https://pek3b.qingstor.com/kubesphere-community/images/level-xuwei-2.jpg)

例如这里，我们创建了一个权限等级是 3 的用户 `demo-user`，他可以加入权限等级不高于3的企业空间或者项目中。

```yaml
kind: User
apiVersion: iam.kubesphere.io/v1alpha2
metadata:
  name: demo-user
  labels:
    kubernetes.io/level: 3
spec:
  email: demo-user@kubesphere.io
```

创建一个权限等级是 2 的项目 `demo-ns`，那么基于项目创建的负载、Pod、存储等资源的权限等级也是 2。

```yaml
apiVersion: v1
kind: Namespace
metadata:
   name: demo-ns
   labels:
     kubernetes.io/level: 2
```

基于 `demo-ns` 项目创建了一个`nginx` 的 Pod，他的权限等级也是 2，同时加入节点亲和性，要求其调度到权限等级不高于 2 的节点上。

```yaml
apiVersion: apps/v1
kind: Pod
metadata:
  labels:
    kubernetes.io/level: 2
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
    ports:
    - containerPort: 80
      protocol: TCP
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
       nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/level
            operator: Lt
            values:
            - 2
        - matchExpressions:
          - key: kubernetes.io/level
            operator: In
            values:
            - 2
```

### 如何实现资源的升降级

在分级管理体系中，支持等级的无限划分，只需要定义一个中间值，就可以在两个等级之间插入一个新的等级，无需操作其他资源；在对资源进行升降级时，只需要修改对应资源的 `label` 标签，就可以对资源进行升降级操作。当然，在对资源进行升降级的时候，我们需要对资源进行检测，保证升级时，其上层资源的权限等级不得低于目标等级；同时，降级时，其下层资源的权限等级不得高于目标等级。在不满足升降级操作条件时，需要将对应资源也做相应调整才可以。

![](http://pek3b.qingstor.com/kubesphere-community/images/level-xuwei-3.png)

### 不同层级间 Pod 的网络隔离

在分级体系中，我们要求高等级的 Pod 能访问低等级的 Pod，但是低等级的 Pod 不能访问高等级的 Pod，那我们需要如何保证不同层级间 Pod 的网络通信呢。

项目在不开启网络隔离的情况下，Pod 间的网络是互通的，所以这里会新增一个黑名单的网络策略。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: demo-ns
  labels:
    kubernetes.io/level: 2
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

`podSelector:{}` 作用于项目中所有 Pod，阻止所有流量的流入。

然后放行标签等级大于目标等级（这里是 2）的流量流入（我们对 Ingress 流量没有做限制）。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: level-match-network-policy
  namespace: demo-ns
  labels:
    kubernetes.io/level: 2
spec:
  podSelector:
    matchExpressions:
    - key: kubernetes.io/level
      operator: Gt
      values:
      - 2
  policyTypes:
  - Ingress
```

### 总结

KubeSphere 解决了用户构建、部署、管理和可观测性等方面的痛点，它的资源可以在多个租户之间共享。但是在资源有权限等级的场景中，低等级资源可以操作高等级资源，造成资源越权管理的问题。为解决这一问题，我们在 KubeSphere 的基础上进行了改造，以适应租户与资源之间和资源与资源之间的分级管理，同时在项目的网络策略中，增加黑名单和白名单策略，增强了项目间的网络隔离，让资源的管理更安全。