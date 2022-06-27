---
title: "在 KubeSphere 上管理多集群环境"
keywords: 'Kubernetes，KubeSphere，联邦，多集群，混合云'
description: '理解如何在 KubeSphere 上管理多集群环境。'
linkTitle: "在 KubeSphere 上管理多集群环境"
weight: 16710

---

KubeSphere 提供了易于使用的多集群功能，帮助您[在 KubeSphere 上构建多集群环境](../../../multicluster-management/)。本指南说明如何在 KubeSphere 上管理多集群环境。

## 准备工作

- 请确保您的 Kubernetes 集群在用作主集群和成员集群之前已安装 KubeSphere。
- 请确保主集群和成员集群分别设置了正确的集群角色，并且在主集群和成员集群上的 `jwtSecret` 也相同。
- 建议成员集群在导入主集群之前是干净环境，即没有创建任何资源。


## 管理 KubeSphere 多集群环境

当您在 KubeSphere 上创建多集群环境之后，您可以通过主集群的中央控制平面管理该环境。在创建资源的时候，您可以选择一个特定的集群，但是需要避免您的主集群过载。不建议您登录成员集群的 KubeSphere Web 控制台去创建资源，因为部分资源（例如：企业空间）将不会同步到您的主集群进行管理。

### 资源管理

不建议您将主集群转换为成员集群，或将成员集群转换成主集群。如果一个成员集群曾经被导入进主集群，您将该成员集群从先前的主集群解绑后，再导入进新的主集群时必须使用相同的集群名称。

如果您想在将成员集群导入新的主集群时保留现有项目，请按照以下步骤进行操作。

1. 在成员集群上运行以下命令将需要保留的项目从企业空间解绑。

   ```bash
   kubectl label ns <namespace> kubesphere.io/workspace- && kubectl patch ns <namespace>   -p '{"metadata":{"ownerReferences":[]}}' --type=merge
   ```

2. 在成员集群运行以下命令清除您的企业空间。

   ```bash
   kubectl delete workspacetemplate <workspace name>
   ```

3. 当您在主集群中创建新的企业空间，并将成员集群分配到这个企业空间时，请在成员集群运行以下命令将保留的项目绑定至新的企业空间。

   ```bash
   kuebctl label ns <namespace> kubesphere.io/workspace=<workspace name>
   ```

### 用户管理

您通过主集群的中央控制平面创建的用户会被同步至成员集群。

如果您希望让不同的用户访问不同的集群，您可以创建企业空间并[赋予他们不同的集群](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/)。 在此之后，您可以根据这些用户的访问要求，邀请不同的用户至这些企业空间。

### KubeSphere 组件管理

KubeSphere 提供了一些可插拔组件，您可以根据需要去启用。在多集群环境下，您可以在主集群或成员集群上启用这些组件。

例如，您只需在主集群上启用应用商店，就可以直接在成员集群上使用与应用商店相关的功能。对于其他组件，当您在主集群上启用它们时，仍然需要在成员集群上手动启用相同组件以实现相同的功能。此外，您还可以仅在成员集群上启用组件，以便仅在成员集群上实现相应的功能。

有关如何启用可插拔组件的更多信息，请参考[启用可插拔组件](../../../pluggable-components/)。

