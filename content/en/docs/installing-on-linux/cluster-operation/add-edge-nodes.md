---
title: "Add Edge Nodes"
keywords: 'Kubernetes, KubeSphere, KubeEdge'
description: 'Add edge nodes to your cluster.'
linkTitle: "Add Edge Nodes"
weight: 3630
---

KubeSphere leverages [KubeEdge](https://kubeedge.io/en/), to extend native containerized application orchestration capabilities to hosts at edge. With separate cloud and edge core modules, KubeEdge provides complete edge computing solutions while the installation may be complex and difficult. 

![kubeedge_arch](/images/docs/installing-on-linux/add-and-delete-nodes/add-edge-nodes/kubeedge_arch.png)

{{< notice note >}}

For more information about different components of KubeEdge, see [the KubeEdge documentation](https://docs.kubeedge.io/en/docs/kubeedge/#components).

{{</ notice >}} 

After an edge node joins your cluster, the native KubeEdge cloud component requires you to manually configure iptables so that you can use commands such as `kubectl logs` and `kubectl exec`. In this connection, KubeSphere features an efficient and convenient way to add edge nodes to a Kubernetes cluster. It uses supporting components (for example, EdgeWatcher) to automatically configure iptables.

![edge-watcher](/images/docs/installing-on-linux/add-and-delete-nodes/add-edge-nodes/edge-watcher.png)

This tutorial demonstrates how to add an edge node to your cluster.

## Prerequisites

- You have enabled [KubeEdge](../../../pluggable-components/kubeedge/).
- You have an available node to serve as an edge node. The node can run either Ubuntu (recommended) or CentOS. This tutorial uses Ubuntu 18.04 as an example.
- Edge nodes, unlike Kubernetes cluster nodes, should work in a separate network.

## Configure an Edge Node

You need to install a container runtime and configure EdgeMesh on your edge node.

### Install a container runtime

[KubeEdge](https://docs.kubeedge.io/en/docs/) supports several container runtimes including Docker, containerd, CRI-O and Virtlet. For more information, see [the KubeEdge documentation](https://docs.kubeedge.io/en/docs/advanced/cri/).

### Configure EdgeMesh

Perform the following steps to configure [EdgeMesh](https://kubeedge.io/en/docs/advanced/edgemesh/) on your edge node.

1. Edit `/etc/nsswitch.conf`.

   ```bash
   vi /etc/nsswitch.conf
   ```

2. Add the following content to this file:

   ```bash
   hosts:          dns files mdns4_minimal [NOTFOUND=return]
   ```

3. Save the file and run the following command to enable IP forwarding:

   ```bash
   sudo echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
   ```

4. Verify your modification:

   ```bash
   sudo sysctl -p | grep ip_forward
   ```

   Expected result:

   ```bash
   net.ipv4.ip_forward = 1
   ```

## Create Firewall Rules and Port Forwarding Rules

To make sure edge nodes can successfully talk to your cluster, you must forward ports for outside traffic to get into your network. Specifically, map an external port to the corresponding internal IP address (master node) and port based on the table below. Besides, you also need to create firewall rules to allow traffic to these ports (`10000` to `10004`).

| Fields              | External Ports | Fields                  | Internal Ports |
| ------------------- | -------------- | ----------------------- | -------------- |
| `cloudhubPort`      | `10000`        | `cloudhubNodePort`      | `30000`        |
| `cloudhubQuicPort`  | `10001`        | `cloudhubQuicNodePort`  | `30001`        |
| `cloudhubHttpsPort` | `10002`        | `cloudhubHttpsNodePort` | `30002`        |
| `cloudstreamPort`   | `10003`        | `cloudstreamNodePort`   | `30003`        |
| `tunnelPort`        | `10004`        | `tunnelNodePort`        | `30004`        |

## Add an Edge Node

1. Log in to the console as `admin` and click **Platform** in the top left corner.

2. Select **Cluster Management** and navigate to **Edge Nodes** under **Node Management**.

   {{< notice note >}}

   If you have enabled [multi-cluster management](../../../multicluster-management/), you need to select a cluster first.

   {{</ notice >}} 

3. Click **Add Node**. In the dialog that appears, set a node name and enter an internal IP address of your edge node. Click **Validate** to continue.

   {{< notice note >}} 

   - The internal IP address is only used for inter-node communication and you do not necessarily need to use the actual internal IP address of the edge node. As long as the IP address is successfully validated, you can use it.
   - It is recommended that you check the box to add the default taint.

   {{</ notice >}} 

4. Copy the command automatically created under **Add Command** and run it on your edge node.

   {{< notice note >}}

   Make sure `wget` is installed on your edge node before you run the command.

   {{</ notice >}} 

   ![edge-node-dialog](/images/docs/installing-on-linux/add-and-delete-nodes/add-edge-nodes/edge-node-dialog.png)

5. Close the dialog, refresh the page, and the edge node will appear in the list.

   ![edge-node-added](/images/docs/installing-on-linux/add-and-delete-nodes/add-edge-nodes/edge-node-added.png)

   {{< notice note >}}

   After an edge node is added, if you cannot see CPU and memory resource usage on the **Edge Nodes** page, make sure [Metrics Server](../../../pluggable-components/metrics-server/) 0.4.1 or later is installed in your cluster.

   {{</ notice >}}

## Remove an Edge Node

Before you remove an edge node, delete all your workloads running on it.

1. On your edge node, run the following commands:

   ```bash
   ./keadm reset
   ```

   ```
   apt remove mosquitto
   ```

   ```bash
   rm -rf /var/lib/kubeedge /var/lib/edged /etc/kubeedge/ca /etc/kubeedge/certs
   ```

   {{< notice note >}}

   If you cannot delete the tmpfs-mounted folder, restart the node or unmount the folder first.

   {{</ notice >}} 

2. Run the following command to remove the edge node from your cluster:

   ```bash
   kubectl delete node <edgenode-name>
   ```

3. To uninstall KubeEdge from your cluster, run the following command:

   ```bash
   helm uninstall kubeedge -n kubeedge
   ```
   
   {{< notice note >}}
   
   After the uninstallation, you will not be able to add edge nodes to your cluster.
   
   {{</ notice >}} 
