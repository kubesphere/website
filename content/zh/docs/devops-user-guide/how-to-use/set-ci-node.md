---
title: "为依赖项缓存设置 CI 节点"
keywords: 'Kubernetes, Docker, KubeSphere, Jenkins, CICD, 流水线, 依赖项缓存'
description: '配置专门用于持续集成 (CI) 的一个或一组节点，加快流水线中的构建过程。'
linkTitle: "为依赖项缓存设置 CI 节点"
weight: 11270
---

通常情况下，构建应用程序的过程中需要拉取不同的依赖项。这可能会导致某些问题，例如拉取时间长和网络不稳定，这会进一步导致构建失败。要为您的流水线提供更可靠和稳定的环境，您可以配置一个节点或一组节点，专门用于持续集成 (CI)。这些 CI 节点可以通过使用缓存来加快构建过程。

本教程演示如何设置 CI 节点，以便 KubeSphere 将流水线的任务以及 S2I/B2I 构建的任务调度到这些节点。

## 准备工作

您需要一个具有**集群管理**权限的帐户。例如，您可以直接以 `admin` 身份登录控制台或者创建一个具有该权限的新角色并将该新角色其分配给一个帐户。

## 标记 CI 节点

1. 点击左上角的**平台管理**，然后选择**集群管理**。

2. 如果您已经启用[多集群功能](../../../multicluster-management/)并已导入 Member 集群，那么您可以选择一个特定集群以查看其节点。如果尚未启用该功能，请直接参考下一步。

3. 转到**节点**下的**集群节点**，您可以在其中查看当前集群中的现有节点。

   ![节点管理](/images/docs/zh-cn/devops-user-guide/use-devops/set-ci-node-for-dependency-caching/node-management.png)

4. 从列表中选择一个节点用来运行 CI 任务。例如，在此处选择 `node02`，点击它以转到其详情页面。点击**更多操作**，然后选择**编辑标签**。

   ![选择 CI 节点](/images/docs/zh-cn/devops-user-guide/use-devops/set-ci-node-for-dependency-caching/select-ci-node.png)

5. 在弹出对话框中，您可以看到一个标签的键是 `node-role.kubernetes.io/worker`。输入 `ci` 作为此标签的值，然后点击**保存**。

   ![添加 CI 标签](/images/docs/zh-cn/devops-user-guide/use-devops/set-ci-node-for-dependency-caching/add-ci-label.png)

   {{< notice note >}} 

   您也可以点击**添加标签**来按需添加新标签。

   {{</ notice >}} 

## 给 CI 节点添加污点

流水线和 S2I/B2I 工作流基本上会根据[节点亲和性](https://kubernetes.io/zh/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)调度到该节点。如果要将节点专用于 CI 任务，即不允许将其他工作负载调度到该节点，您可以在该节点上添加[污点](https://kubernetes.io/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)。

1. 点击**更多操作**，然后选择**污点管理**。

   ![选择污点管理](/images/docs/zh-cn/devops-user-guide/use-devops/set-ci-node-for-dependency-caching/select-taint-management.png)

2. 点击**添加污点**，然后输入键 `node.kubernetes.io/ci` 而不指定值。您可以根据需要选择 `不允许调度 (NoSchedule)` 或 `尽量不调度 (PreferNoSchedule)` 。

   ![添加污点](/images/docs/zh-cn/devops-user-guide/use-devops/set-ci-node-for-dependency-caching/add-taint.png)

3. 点击**保存**。KubeSphere 将根据您设置的污点调度任务。您现在可以回到 DevOps 流水线上进行操作。

   ![污点已添加](/images/docs/zh-cn/devops-user-guide/use-devops/set-ci-node-for-dependency-caching/taint-result.png)

   {{< notice tip >}} 

   本教程还涉及与节点管理有关的操作。有关详细信息，请参见[节点管理](../../../cluster-administration/nodes/)。

   {{</ notice >}}
