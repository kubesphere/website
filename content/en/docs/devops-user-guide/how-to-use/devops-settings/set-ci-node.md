---
title: "Set a CI Node for Dependency Caching"
keywords: 'Kubernetes, docker, KubeSphere, Jenkins, cicd, pipeline, dependency cache'
description: 'Configure a node or a group of nodes specifically for continuous integration (CI) to speed up the building process in a pipeline.'
linkTitle: "Set a CI Node for Dependency Caching"
weight: 11245
---

Generally, different dependencies need to be pulled as applications are being built. This may cause some issues such as long pulling time and network instability, further resulting in build failures. To provide your pipeline with a more enabling and stable environment, you can configure a node or a group of nodes specifically for continuous integration (CI). These CI nodes can speed up the building process by using caches. 

This tutorial demonstrates how to set CI nodes so that KubeSphere schedules tasks of pipelines and S2I/B2I builds to these nodes.

## Prerequisites

You need a user granted a role including the permission of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the permission and assign it to a user.

## Label a CI Node

1. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. If you have enabled the [multi-cluster feature](../../../../multicluster-management/) with Member clusters imported, you can select a specific cluster to view its nodes. If you have not enabled the feature, refer to the next step directly.

3. Navigate to **Cluster Nodes** under **Nodes**, where you can see existing nodes in the current cluster.

4. Select a node from the list to run CI tasks. Click the node name to go to its details page. Click **More** and select **Edit Labels**.

5. In the displayed dialog box, you can see a label with the key `node-role.kubernetes.io/worker`. Enter `ci` for its value and click **Save**.

   {{< notice note >}} 

   You can also click **Add** to add new labels based on your needs.

   {{</ notice >}} 

## Add a Taint to a CI Node

Basically, pipelines and S2I/B2I workflows will be scheduled to this node according to [node affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity). If you want to make the node a dedicated one for CI tasks, which means other workloads are not allowed to be scheduled to it, you can add a [taint](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) to it.

1. Click **More** and select **Edit Taints**.

2. Click **Add Taint** and enter a key `node.kubernetes.io/ci` without specifying a value. You can choose `Prevent scheduling`, `Prevent scheduling if possible`, or `Prevent scheduling and evict existing Pods` based on your needs.

3. Click **Save**. KubeSphere will schedule tasks according to the taint you set. You can go back to work on your DevOps pipeline now.

   {{< notice tip >}} 

   This tutorial also covers the operation related to node management. For detailed information, see [Node Management](../../../../cluster-administration/nodes/).

   {{</ notice >}}
