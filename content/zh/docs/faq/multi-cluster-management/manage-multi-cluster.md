---
title: "在 KubeSphere 上管理多集群环境"
keywords: 'Kubernetes，KubeSphere，联邦，多集群，混合云'
description: '理解如何在 KubeSphere 上管理多集群环境。'
linkTitle: "在 KubeSphere 上管理多集群环境"
weight: 16710

---

KubeSphere 提供了易于使用的多集群功能，帮助您[在 KubeSphere 上构建多集群环境](../../../multicluster-management/)。本指南说明如何在 KubeSphere 上管理多集群环境。

## 准备工作

- 请确保您的 Kubernetes 集群在用作 Host 集群和 Member 集群之前已安装 KubeSphere。
- 请确保 Host 集群和 Member 集群分别设置了正确的集群角色，并且在 Host 集群和 Member 集群上的 `jwtSecret` 也相同。
- 建议 Member 集群在导入 Host 集群之前是干净环境，即没有创建任何资源。


## 管理 KubeSphere 多集群环境

当您在 KubeSphere 上创建多集群环境之后，您可以通过 Host 集群的中央控制平面管理该环境。在创建资源的时候，您可以选择一个特定的集群，但是需要避免您的 Host 集群过载。不建议您登录 Member 集群的 KubeSphere Web 控制台去创建资源，因为部分资源（例如：企业空间）将不会同步到您的 Host 集群进行管理。

### 资源管理

不建议您将 Host 集群转换成 Member 集群或将 Member 集群转换成 Host 集群。如果一个 Member 集群曾经被导入进 Host 集群，您将该 Member 集群从先前的 Host 集群解绑后，再导入进新的 Host 集群时必须使用相同的集群名称。

如果您想在将 Member 集群导入新的 Host 集群时保留现有项目（即命名空间），请按照以下步骤进行操作。

1. 在 Member 集群上运行以下命令将需要保留的项目从企业空间解绑。

   ```bash
   kubectl label ns <namespace> kubesphere.io/workspace- && kubectl patch ns <namespace>   -p '{"metadata":{"ownerReferences":[]}}' --type=merge
   ```

2. 在 Member 集群运行以下命令清除您的企业空间。

   ```bash
   kubectl delete workspacetemplate <workspace name>
   ```

3. 当您在 Host 集群中创建新的企业空间，并将 Member 集群分配到这个企业空间时，请在 Member 集群运行以下命令将保留的项目绑定至新的企业空间。

   ```bash
   kuebctl label ns <namespace> kubesphere.io/workspace=<workspace name>
   ```

### 帐户管理

您通过 Host 集群的中央控制平面创建的帐户会被同步至 Member 集群。

如果您希望让不同的帐访问不同的集群，您可以创建企业空间并[赋予他们不同的集群](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/)。 在此之后，您可以根据这些帐户的访问要求，邀请不同的帐户至这些企业空间。在未来版本中，您可以邀请帐户至[多集群项目](../../../project-administration/project-and-multicluster-project/#多集群项目)中。

### KubeSphere 组件管理

KubeSphere 提供了一些可插拔组件，您可以根据需要去启用。在多集群环境下，您可以在 Host 集群或 Member 集群上启用这些组件。

例如，您只需在 Host 集群上启用应用商店，就可以直接在 Member 集群上使用与应用商店相关的功能。对于其他组件，当您在 Host 集群上启用它们时，仍然需要在 Member 集群上手动启用相同组件以实现相同的功能。此外，您还可以仅在 Member 集群上启用组件，以便仅在 Member 集群上实现相应的功能。

有关如何启用可插拔组件的更多信息，请参考[启用可插拔组件](../../../pluggable-components/)。

