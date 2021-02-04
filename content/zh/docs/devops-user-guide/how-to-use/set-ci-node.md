---
title: "为缓存依赖项设置 CI 节点"
keywords: 'Kubernetes, docker, KubeSphere, Jenkins, cicd, pipeline, dependency cache'
description: '如何为 KubeSphere 流水线的缓存依赖项设置 CI 节点'
linkTitle: "为缓存依赖项设置 CI 节点"
weight: 11270
---

通常，在构建应用程序时需要提取不同的依赖关系。 这可能会导致某些问题，例如较长的拉取时间和网络的不稳定会进一步导致构建失败。 为了为您的流水线提供更可靠和稳定的环境，您可以配置一个或一组专门用于持续集成（CI）的节点。 这些 CI 节点可以通过使用缓存来加快构建过程。</br>
本教程演示如何设置 CI 节点，以便 KubeSphere 调度流水线的任务，并在这些节点上构建 S2I / B2I。

## 前提条件

您需要一个被授予**集群管理**角色的帐户。 例如，您可以直接以 `admin` 身份登录控制台或使用授权创建新角色并将其分配给帐户。

## 标记 CI 节点

1. 单击左上角的**平台管理**，然后选择**集群管理**。

![clusters-management](/images/docs/devops-user-guide-zh/set-ci-node-for-dependency-cache-zh/clusters-management.png)

2. 如果您已经在导入成员集群时启用了[多集群特性](../../../multicluster-management)，那么您可以选择一个特定集群以查看其应用程序资源。 如果尚未启用该特性，请直接参考下一步。

3. 导航到**节点管理**下的**群集节点**，您可以在其中查看当前集群中的现有节点。

![Node Management](/images/docs/devops-user-guide-zh/set-ci-node-for-dependency-cache-zh/set-node-1.png)

4. 从列表中选择一个节点以运行 CI 任务。 例如，在此处选择 `node2`，然后单击它以转到其详细信息页面。 单击**更多操作**，然后选择**编辑标签**。

![Select CI Node](/images/docs/devops-user-guide-zh/set-ci-node-for-dependency-cache-zh/set-node-2.png)

5. 在出现的对话框中，单击**添加标签**。 使用键 `node-role.kubernetes.io/worker` 和值 `ci` 添加新标签，然后单击**保存**。

![Add CI Label](/images/docs/devops-user-guide-zh/set-ci-node-for-dependency-cache-zh/set-node-3.png)

{{< notice note >}} 

节点可能已经有空值的键,这种情况下您可以直接补充值 `ci`。

{{</ notice >}} 

## 给 CI 节点添加污点

流水线和 S2I/B2I 工作流基本上是根据[节点亲和性](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity)调度到该节点。 如果要将节点专用于 CI 任务，这意味着不允许为其安排其他工作负载，则可以在该节点上添加[污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)。

1. 单击**更多操作**，然后选择**污染管理**。

![Select CI Node](/images/docs/devops-user-guide-zh/set-ci-node-for-dependency-cache-zh/set-node-4.png)

2. 单击**添加污点**，然后输入键 `node.kubernetes.io/ci` 而不指定值。 您可以根据需要选择 `不允许调度 (NoSchedule)` 或 `(尽量不调度) PreferNoSchedule` 。

![Add Taint](/images/docs/devops-user-guide-zh/set-ci-node-for-dependency-cache-zh/set-node-5.png)

3. 单击**保存**。 KubeSphere 将根据您设置的污点安排任务。 您现在可以回到DevOps工作流上工作。

![Taint Result](/images/docs/devops-user-guide-zh/set-ci-node-for-dependency-cache-zh/set-node-6.png)

{{< notice tip >}}

本教程还介绍了与节点管理有关的操作。 有关详细信息，请参阅[节点管理](../../../cluster-administration/nodes/)。

{{</ notice >}}