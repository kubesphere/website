---
title: "KubeSphere 中的多租户"
keywords: "Kubernetes, KubeSphere, 多租户"
description: "理解 KubeSphere 中的多租户架构。"
linkTitle: "KubeSphere 中的多租户"
weight: 12100
---

Kubernetes 解决了应用编排、容器调度的难题，极大地提高了资源的利用率。有别于传统的集群运维方式，在使用 Kubernetes 的过程中，企业和个人用户在资源共享和安全性方面均面临着诸多挑战。

首当其冲的就是企业环境中多租户形态该如何定义，租户的安全边界该如何划分。Kubernetes 社区[关于多租户的讨论](https://docs.google.com/document/d/1fj3yzmeU2eU8ZNBCUJG97dk_wC7228-e_MmdcmTNrZY)从未停歇，但到目前为止最终的形态尚无定论。

## Kubernetes 多租户面临的挑战

多租户是一种常见的软件架构，简单概括就是在多用户环境下实现资源共享，并保证各用户间数据的隔离性。在多租户集群环境中，集群管理员需要最大程度地避免恶意租户对其他租户的攻击，公平地分配集群资源。

无论企业的多租户形态如何，多租户都无法避免以下两个层面的问题：逻辑层面的资源隔离；物理资源的隔离。

逻辑层面的资源隔离主要包括 API 的访问控制，针对用户的权限控制。Kubernetes 中的 [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) 和命名空间 (namespace) 提供了基本的逻辑隔离能力，但在大部分企业环境中并不适用。企业中的租户往往需要跨多个命名空间甚至是多个集群进行资源管理。除此之外，针对用户的行为审计、租户隔离的日志、事件查询也是不可或缺的能力。

物理资源的隔离主要包括节点、网络的隔离，当然也包括容器运行时安全。您可以通过 [NetworkPolicy](../../pluggable-components/network-policy/) 对网络进行划分，通过 PodSecurityPolicy 限制容器的行为，[Kata Containers](https://katacontainers.io/) 也提供了更安全的容器运行时。

## KubeSphere 中的多租户

为了解决上述问题，KubeSphere 提供了基于 Kubernetes 的多租户管理方案。

![multi-tenancy-architecture](/images/docs/zh-cn/access-control-and-account-management/multi-tanancy-in-kubesphere/multi-tenancy-architecture.png)

在 KubeSphere 中[企业空间](../../workspace-administration/what-is-workspace/)是最小的租户单元，企业空间提供了跨集群、跨项目（即 Kubernetes 中的命名空间）共享资源的能力。企业空间中的成员可以在授权集群中创建项目，并通过邀请授权的方式参与项目协同。

**用户**是 KubeSphere 的帐户实例，可以被设置为平台层面的管理员参与集群的管理，也可以被添加到企业空间中参与项目协同。

多级的权限控制和资源配额限制是 KubeSphere 中资源隔离的基础，奠定了多租户最基本的形态。

### 逻辑隔离

与 Kubernetes 相同，KubeSphere 通过 RBAC 对用户的权限加以控制，实现逻辑层面的资源隔离。

KubeSphere 中的权限控制分为平台、企业空间、项目三个层级，通过角色来控制用户在不同层级的资源访问权限。

1. [平台角色](../../quick-start/create-workspace-and-project/)：主要控制用户对平台资源的访问权限，如集群的管理、企业空间的管理、平台用户的管理等。
2. [企业空间角色](../../workspace-administration/role-and-member-management/)：主要控制企业空间成员在企业空间下的资源访问权限，如企业空间下项目、DevOps 工程的管理等。
3. [项目角色](../../project-administration/role-and-member-management/)：主要控制项目下资源的访问权限，如工作负载的管理、流水线的管理等。

### 网络隔离

除了逻辑层面的资源隔离，KubeSphere 中还可以针对企业空间和项目设置[网络隔离策略](../../pluggable-components/network-policy/)。

### 操作审计

KubeSphere 还提供了针对用户的[操作审计](../../pluggable-components/auditing-logs/)。

### 认证鉴权

KubeSphere 完整的认证鉴权链路如下图所示，可以通过 OPA 拓展 Kubernetes 的 RBAC 规则。KubeSphere 团队计划集成 [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) 以支持更为丰富的安全管控策略。

![request-chain](/images/docs/zh-cn/access-control-and-account-management/multi-tanancy-in-kubesphere/request-chain.jpg)
