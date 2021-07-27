---
title: "在 KubeSphere 上管理多集群环境"
keywords: 'Kubernetes，KubeSphere，联邦，多集群，混合云'
description: '理解如何在 KubeSphere 上管理多集群环境。'
linkTitle: "在 KubeSphere 上管理多集群环境"
weight: 16710

---

KubeSphere 提供了易于使用的多集群功能，帮助您[在 KubeSphere 上面构建多集群环境](../../../multicluster-management/)。本指南将会说明如何在 KubeSphere 上面管理多集群环境。

## 准备工作

- 请保证 Kubernetes 集群在被用作 Host 集群和 Member 集群之前，已经正确安装在 KubeSphere 上。
- 请保证 Host 集群和 Member 集群设置了正确的集群角色，同时请保证在 Host 集群和 Member 集群上的 `jwtSecret` 也相同。
- 建议您在将 Member 集群导入 Host 集群之前，Member 集群应该处于一个干净、没有任何资源被创建的环境中。


## 管理 KubeSphere 多集群环境

当您在 KubeSphere 上面创建多集群环境之后，您可以通过中央控制平面管理 Host 集群。在创建资源的时候，您可以选择一个特定的集群，但是需要避免您的 Host 集群过载。同时不建议您登录 KubeSphere 上， Member 集群 的 Web 控制台，并在上面创建资源。因为部分资源（例如：企业空间）将不会同步到您的 Host 集群进行管理。

### 资源管理

不建议您将 Host 集群转换成 Member 集群或其他形式。如果一个 Member 集群曾经被导入进 Host 集群，您必须使用名字相同的 Member 集群，将它从之前的 Host 集群中解除绑定，并导入新的 Host 集群。

如果想在保留现有项目（例如：命名空间）的同时，将 Member 集群导入新的 Host 集群，请按照以下步骤进行操作。

1. 在 Member 集群上运行以下命令以解除要从企业空间保留的项目的绑定。

   ```bash
   kubectl label ns <namespace> kubesphere.io/workspace- && kubectl patch ns <namespace>   -p '{"metadata":{"ownerReferences":[]}}' --type=merge
   ```

2. 在 Member 集群运行如下命令去清空您的企业空间。

   ```bash
   kubectl delete workspacetemplate <workspace name>
   ```

3. 当您在 Host 集群中创建新的企业空间，并将 Member 集群分配到这个企业空间时，请在 Member 集群运行如下命令以绑定为企业空间保留的项目。

   ```bash
   kuebctl label ns <namespace> kubesphere.io/workspace=<workspace name>
   ```

### 账户管理

当您在 Host 集群中用中央控制平面的账户将会被同步至 Member 集群。

如果您希望让不同的账户访问不同的集群，您可以创建企业空间并[赋予他们不同的集群](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/)。 在此之后，您可以根据这些账户的访问要求，邀请不同的账户访问这些企业空间。此外，您还可以在[创建了具有不同集群授权的多集群项目](../../../project-administration/project-and-multicluster-project/#multi-cluster-projects)之后邀请不同的账户。这样您就可以让不同的账户访问不同的集群了。

### KubeSphere 组件管理

KubeSphere 提供了一些可插拔的组件，您可以根据您的需要去启用。在多集群环境下，您可以在 Host 集群和 Member 集群上启用这些组件。

例如，您只需在 Host 集群上启用应用商店，就可以直接在 Member 集群上使用与应用商店相关的功能。对于其他组件，当您在 Host 集群上启用它们时，仍然需要手动启用 Member 集群上的相同组件以实现相同的功能。此外，您还可以仅在 Member 集群上启用组件，以便仅在 Member 集群上实现相应的功能。

如果您需要了解更多关于启用可插拔组件的信息，请参考[启用可插拔组件](../../../pluggable-components/)。

