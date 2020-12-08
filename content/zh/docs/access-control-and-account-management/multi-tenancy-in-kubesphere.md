---
title: "KubeSphere中的多租户"
keywords: "kubernetes, kubesphere, multi-tenancy"
description: "Multi-tenancy in KubeSphere"

linkTitle: "KubeSphere中的多租户"
weight: 12100
---


K8s 解决了应用编排、容器调度的难题，极大的提高了资源的利用率。有别与传统的集群运维方式，在使用 K8s 的过程中，我们将在资源共享和安全性方面面临诸多挑战。

首当其冲的就是企业环境中多租户形态该如何定义，租户的安全边界该如何划分。K8s 社区[关于多租户的讨论](https://docs.google.com/document/d/1fj3yzmeU2eU8ZNBCUJG97dk_wC7228-e_MmdcmTNrZY)从未停歇，但到目前为止最终的形态尚无定论。

## K8s 多租户面临的挑战

多租户是一种常见的软件架构，简单概括就是在多用户环境下实现资源共享，并保证各用户间数据的隔离性。在多租户集群环境中，我们需要最大程度的避免恶意租户对其他租户的攻击，公平地分配集群资源。

无论企业的多租户形态如何，多租户都无法避免以下两个层面的问题：逻辑层面的资源隔离；物理资源的隔离。

逻辑层面的资源隔离主要包括API的访问控制，针对用户的权限控制。K8s 中 [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) 和 namespace 提供了基本的逻辑隔离能力，这在大部分企业环境中并不适用。企业中的租户往往需要跨多个 namespace 甚至是多个集群进行资源管理。除此之外，针对用户的行为审计、租户隔离的日志、事件查询也是不可或缺的能力。

物理资源的隔离主要包括节点、网络的隔离，当然也包括容器运行时安全。我们可以通过 NetworkPolicy 对网络进行划分，通过 PodSecurityPolicy 限制容器的行为，Kata Containers 也提供了更安全的容器运行时。

## KubeSphere中的多租户

为了解决上述问题，KubeSphere 提供了基于 K8s 的多租户管理方案。

![multi-tenancy-architecture.png](/images/docs/access-control-and-account-management/multi-tenancy-architecture.png)

首先我们来看看 KubeSphere 中对租户的定义，在 KubeSphere 中 `Workspace` 是最小的租户单元，Workspace 提供了跨集群、跨 namespace 资源共享的能力。Workspace 中的成员可以在授权集群中创建项目，并通过邀请授权的方式参与项目协同。

**用户**是 KubeSphere 的账户实例，可以被设置为平台层面的管理员参与集群的管理，也可以被添加到 Workspace 中参与项目协同。

多级的权限控制和资源配额限制是 KubeSphere 中资源隔离的基础，奠定了多租户最基本的形态。

### 逻辑隔离

与 K8s 一致 KubeSphere 通过 RBAC 对用户的权限加以控制，实现逻辑层面的资源隔离。

![rbac.png](/images/docs/access-control-and-account-management/rbac.png)

KubeSphere 中的权限控制分为平台、企业空间、项目三个层级，通过角色来控制用户在不同层级的资源访问权限。

1. [平台角色](/docs/quick-start/create-workspace-and-project)：主要控制用户对平台资源的访问权限，如集群的管理、企业空间的管理、平台用户的管理等等.
2. [企业空间角色](/docs/workspace-administration/role-and-member-management)：主要控制企业空间成员在企业空间下的资源访问权限，如企业空间下namespace、DevOps Project的管理等等。
3. [项目角色](/docs/project-administration/role-and-member-management)：主要控制项目下资源的访问权限，如工作负载的管理、流水线的管理等等。



### 网络隔离

除了逻辑层面的资源隔离，KubeSphere 中还可以可以针对企业空间、项目设置[网络隔离策略](/docs/pluggable-components/network-policy/)。

### 操作审计

KubeSphere 还提供了针对用户的的[操作审计](/docs/pluggable-components/auditing-logs/)。

### 更多

KubeSphere 完整的认证鉴权链路如下图所示，可以通过 OPA 拓展 K8s 的 RBAC 规则。我们计划集成 [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) 以支持更为丰富的安全管控策略。

![request-chain.png](/images/docs/access-control-and-account-management/request-chain.jpg)
