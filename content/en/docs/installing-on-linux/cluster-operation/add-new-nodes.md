---
title: "Add New Nodes"
keywords: 'Kubernetes, KubeSphere, scale-out, add-nodes'
description: 'How to add new nodes to an existing cluster.'
linkTitle: "Add New Nodes"
weight: 3410
---

After you use KubeSphere for a certain period of time, it is likely that you need to scale out your cluster with an increasing number of workloads. From KubeSphere v3.0.0, you can use the brand-new installer [KubeKey](https://github.com/kubesphere/kubekey) to add new nodes to a cluster. Fundamentally, the operation is based on Kubelet's registration mechanism. In other words, the new nodes will automatically join the existing Kubernetes cluster. KubeSphere supports hybrid environments, which means the newly-added host OS can be CentOS or Ubuntu.

This tutorial demonstrates how to add new nodes to a single-node cluster. To scale out a multi-node cluster, the steps are basically the same.

## Prerequisites

- You need to have a single-node cluster. For more information, see [All-in-One Installation on Linux](../../../quick-start/all-in-one-on-linux/).

- You have [downloaded KubeKey](../../../installing-on-linux/introduction/multioverview/#step-2-download-kubekey).

## Add New Nodes

### Step 1: Modify host configurations

1. Create a configuration file (`config-sample.yaml`) using KubeKey.

   ```bash
   # Assume your original Kubernetes cluster is v1.17.9
   ./kk create config --with-kubesphere v3.0.0 --with-kubernetes v1.17.9
   ```

   {{< notice note >}}

   You can skip this step if you already have the configuration file on your machine. For example, if you want to add nodes to a multi-node cluster which was set up by KubeKey, you might still have the configuration file if you have not deleted it.

   {{</ notice >}} 

2. In the configuration file, put the information of your new nodes under `hosts` and `roleGroups`. The example adds two new nodes (i.e. `node1` and `node2`). Here `master1` is the existing node.

   ```bash
   spec:
     hosts:
     - {name: master1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: Qcloud@123}
     - {name: node1, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Qcloud@123}
     - {name: node2, address: 192.168.0.5, internalAddress: 192.168.0.5, user: root, password: Qcloud@123}
     roleGroups:
       etcd:
       - master1
       master:
       - master1
       worker:
       - node1
       - node2
   ···
   ```

   {{< notice note >}}

   - For more information about the configuration file, see [Edit the configuration file](../../../installing-on-linux/introduction/multioverview/#2-edit-the-configuration-file).
   - You are not allowed to modify the host name of existing nodes when adding new nodes.
   - Replace the host name in the example with your own.

{{</ notice >}}

### Step 2: Apply the configuration to add nodes

1. Execute the following command:

   ```bash
   ./kk add nodes -f config-sample.yaml
   ```

2. You will be able to see the new nodes and their information on the KubeSphere console when the installation finishes. On the **Cluster Management** page, select **Cluster Nodes** under **Nodes** from the left menu, or execute the command `kubectl get node` to check the changes.

   ```bash
   $ kubectl get node
   NAME          STATUS   ROLES           AGE   VERSION
   master1       Ready    master,worker   20d   v1.17.9
   node1         Ready    worker          31h   v1.17.9
   node2         Ready    worker          31h   v1.17.9
   ```