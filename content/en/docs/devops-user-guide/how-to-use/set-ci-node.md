---
title: "Set a CI Node for Dependency Caching"
keywords: 'Kubernetes, docker, KubeSphere, Jenkins, cicd, pipeline, dependency cache'
description: 'Configure a node or a group of nodes specifically for continuous integration (CI) to speed up the building process in a pipeline.'
linkTitle: "Set a CI Node for Dependency Caching"
weight: 11270
---

Generally, different dependencies need to be pulled as applications are being built. This may cause some issues such as long pulling time and network instability, further resulting in build failures. To provide your pipeline with a more enabling and stable environment, you can configure a node or a group of nodes specifically for continuous integration (CI). These CI nodes can speed up the building process by using caches. 

This tutorial demonstrates how to set CI nodes so that KubeSphere schedules tasks of pipelines and S2I/B2I builds to these nodes.

## Prerequisites

You need an account granted a role including the permission of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the permission and assign it to an account.

## Label a CI Node

1. Click **Platform** in the top-left corner and select **Cluster Management**.

2. If you have enabled the [multi-cluster feature](../../../multicluster-management/) with Member clusters imported, you can select a specific cluster to view its nodes. If you have not enabled the feature, refer to the next step directly.

3. Navigate to **Cluster Nodes** under **Nodes**, where you can see existing nodes in the current cluster.

   ![Node Management](/images/docs/devops-user-guide/using-devops/set-ci-node-for-dependency-cache/set-node-1.png)

4. Choose a node from the list to run CI tasks. For example, select `node2` here and click it to go to its detail page. Click **More** and select **Edit Labels**.

   ![Select CI Node](/images/docs/devops-user-guide/using-devops/set-ci-node-for-dependency-cache/set-node-2.png)

5. In the dialog that appears, you can see a label with the key `node-role.kubernetes.io/worker`. Enter `ci` for its value and click **Save**.

   ![Add CI Label](/images/docs/devops-user-guide/using-devops/set-ci-node-for-dependency-cache/set-node-3.png)

   {{< notice note >}} 

   You can also click **Add Labels** to add new labels based on your needs.

   {{</ notice >}} 

## Add a Taint to a CI Node

Basically, pipelines and S2I/B2I workflows will be scheduled to this node according to [node affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity). If you want to make the node a dedicated one for CI tasks, which means other workloads are not allowed to be scheduled to it, you can add a [taint](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) to it.

1. Click **More** and select **Taint Management**.

   ![Select CI Node](/images/docs/devops-user-guide/using-devops/set-ci-node-for-dependency-cache/set-node-2.png)

2. Click **Add Taint** and enter a key `node.kubernetes.io/ci` without specifying a value. You can choose `NoSchedule` or `PreferNoSchedule` based on your needs.

   ![Add Taint](/images/docs/devops-user-guide/using-devops/set-ci-node-for-dependency-cache/set-node-4.png)

3. Click **Save**. KubeSphere will schedule tasks according to the taint you set. You can go back to work on your DevOps pipeline now.

   ![Taint Result](/images/docs/devops-user-guide/using-devops/set-ci-node-for-dependency-cache/set-node-5.png)

   {{< notice tip >}} 

   This tutorial also covers the operation related to node management. For detailed information, see [Node Management](../../../cluster-administration/nodes/).

   {{</ notice >}}
