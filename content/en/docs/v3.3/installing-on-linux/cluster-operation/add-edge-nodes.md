---
title: "Add Edge Nodes"
keywords: 'Kubernetes, KubeSphere, KubeEdge'
description: 'Add edge nodes to your cluster.'
linkTitle: "Add Edge Nodes"
weight: 3630
---

KubeSphere leverages [KubeEdge](https://kubeedge.io/en/), to extend native containerized application orchestration capabilities to hosts at edge. With separate cloud and edge core modules, KubeEdge provides complete edge computing solutions while the installation may be complex and difficult.

![kubeedge_arch](/images/docs/v3.3/installing-on-linux/add-and-delete-nodes/add-edge-nodes/kubeedge_arch.png)

{{< notice note >}}

For more information about different components of KubeEdge, see [the KubeEdge documentation](https://docs.kubeedge.io/en/docs/kubeedge/#components).

{{</ notice >}} 

This tutorial demonstrates how to add an edge node to your cluster.

## Prerequisites

- You have enabled [KubeEdge](../../../pluggable-components/kubeedge/).
- To prevent compatability issues, you are advised to install Kubernetes v1.21.x or earlier.
- You have an available node to serve as an edge node. The node can run either Ubuntu (recommended) or CentOS. This tutorial uses Ubuntu 18.04 as an example.
- Edge nodes, unlike Kubernetes cluster nodes, should work in a separate network.

## Prevent non-edge workloads from being scheduled to edge nodes

Due to the tolerations some daemonsets (for example, Calico) have, to ensure that the newly added edge nodes work properly, you need to run the following command to manually patch the pods so that non-edge workloads will not be scheduled to the edge nodes.

```bash
#!/bin/bash
   
   
NoShedulePatchJson='{"spec":{"template":{"spec":{"affinity":{"nodeAffinity":{"requiredDuringSchedulingIgnoredDuringExecution":{"nodeSelectorTerms":[{"matchExpressions":[{"key":"node-role.kubernetes.io/edge","operator":"DoesNotExist"}]}]}}}}}}}'
   
ns="kube-system"


DaemonSets=("nodelocaldns" "kube-proxy" "calico-node")

length=${#DaemonSets[@]}
   
for((i=0;i<length;i++));  
do
         ds=${DaemonSets[$i]}
        echo "Patching resources:DaemonSet/${ds}" in ns:"$ns",
        kubectl -n $ns patch DaemonSet/${ds} --type merge --patch "$NoShedulePatchJson"
        sleep 1
done
```

## Create Firewall Rules and Port Forwarding Rules

To make sure edge nodes can successfully talk to your cluster, you must forward ports for outside traffic to get into your network. Specifically, map an external port to the corresponding internal IP address (control plane node) and port based on the table below. Besides, you also need to create firewall rules to allow traffic to these ports (`10000` to `10004`).

   {{< notice note >}}
   In `ClusterConfiguration` of the ks-installer, if you set an internal IP address, you need to set the forwarding rule. If you have not set the forwarding rule, you can directly connect to ports 30000 to 30004.
   {{</ notice >}} 

| Fields              | External Ports | Fields                  | Internal Ports |
| ------------------- | -------------- | ----------------------- | -------------- |
| `cloudhubPort`      | `10000`        | `cloudhubNodePort`      | `30000`        |
| `cloudhubQuicPort`  | `10001`        | `cloudhubQuicNodePort`  | `30001`        |
| `cloudhubHttpsPort` | `10002`        | `cloudhubHttpsNodePort` | `30002`        |
| `cloudstreamPort`   | `10003`        | `cloudstreamNodePort`   | `30003`        |
| `tunnelPort`        | `10004`        | `tunnelNodePort`        | `30004`        |

## Configure an Edge Node

You need to configure the edge node as follows.

### Install a container runtime

[KubeEdge](https://docs.kubeedge.io/en/docs/) supports several container runtimes including Docker, containerd, CRI-O and Virtlet. For more information, see [the KubeEdge documentation](https://docs.kubeedge.io/en/docs/advanced/cri/).

{{< notice note >}}

If you use Docker as the container runtime for your edge node, Docker v19.3.0 or later must be installed so that KubeSphere can get Pod metrics of it.

{{</ notice >}}

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

## Add an Edge Node

1. Log in to the console as `admin` and click **Platform** in the upper-left corner.

2. Select **Cluster Management** and navigate to **Edge Nodes** under **Nodes**.

   {{< notice note >}}

   If you have enabled [multi-cluster management](../../../multicluster-management/), you need to select a cluster first.

   {{</ notice >}} 

3. Click **Add**. In the dialog that appears, set a node name and enter an internal IP address of your edge node. Click **Validate** to continue.

   ![add-edge-node](/images/docs/v3.3/installing-on-linux/add-and-delete-nodes/add-edge-nodes/add-edge-node.png)

   {{< notice note >}} 

   - The internal IP address is only used for inter-node communication and you do not necessarily need to use the actual internal IP address of the edge node. As long as the IP address is successfully validated, you can use it.
   - It is recommended that you check the box to add the default taint.

   {{</ notice >}} 

4. Copy the command automatically created under **Edge Node Configuration Command** and run it on your edge node.

   ![edge-command](/images/docs/v3.3/installing-on-linux/add-and-delete-nodes/add-edge-nodes/edge-command.png)

   {{< notice note >}}

   Make sure `wget` is installed on your edge node before you run the command.

   {{</ notice >}} 

5. Close the dialog, refresh the page, and the edge node will appear in the list.

   {{< notice note >}}

   After an edge node is added, if you cannot see CPU and memory resource usage on the **Edge Nodes** page, make sure [Metrics Server](../../../pluggable-components/metrics-server/) 0.4.1 or later is installed in your cluster.

   {{</ notice >}}

## Collect Monitoring Information on Edge Nodes

To collect monitoring information on edge node, you need to enable `metrics_server` in `ClusterConfiguration` and `edgeStream` in KubeEdge.

1. On the KubeSphere web console, choose **Platform > Cluster Management**.

2. On the navigation pane on the left, click **CRDs**.

3. In the search bar on the right pane, enter `clusterconfiguration`, and click the result to go to its details page.

4. Click <img src="/images/docs/v3.3/common-icons/three-dots.png" width="15" alt="icon" /> on the right of ks-installer, and click **Edit YAML**.

5. Search for **metrics_server**, and change the value of `enabled` from `false` to `true`.

    ```yaml
      metrics_server:
      enabled: true # Change "false" to "true".
    ```

6. Click **OK** in the lower right corner to save the change.

7. Open the `/etc/kubeedge/config` file, search for `edgeStream`, change `false` to `true`, and save the change.
    ```bash
    cd /etc/kubeedge/config
    vi edgecore.yaml
    ```

    ```bash
    edgeStream:
    enable: true #Change "false" to "true".。
    handshakeTimeout: 30
    readDeadline: 15
    server: xx.xxx.xxx.xxx:10004 #If port forwarding is not configured, change the port ID to 30004 here.
    tlsTunnelCAFile: /etc/kubeedge/ca/rootCA.crt
    tlsTunnelCertFile: /etc/kubeedge/certs/server.crt
    tlsTunnelPrivateKeyFile: /etc/kubeedge/certs/server.key
    writeDeadline: 15
    ```

8. Run the following command to restart `edgecore.service`.
    ```bash
    systemctl restart edgecore.service
    ```

9. If you still cannot see the monitoring data, run the following command:

    ```bash
    journalctl -u edgecore.service -b -r
    ```
    
    {{< notice note >}}
     
   If `failed to check the running environment: kube-proxy should not running on edge node when running edgecore` is displayed, refer to Step 8 to restart `edgecore.service` again.
     
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

3. To uninstall KubeEdge from your cluster, run the following commands:

   ```bash
   helm uninstall kubeedge -n kubeedge
   ```
   
   ```bash
   kubectl delete ns kubeedge
   ```
   
   {{< notice note >}}
   
   After uninstallation, you will not be able to add edge nodes to your cluster.
   
   {{</ notice >}} 
