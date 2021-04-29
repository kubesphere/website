---
title: "添加边缘节点"
keywords: 'Kubernetes, KubeSphere, KubeEdge'
description: '将边缘节点添加到群集。'
linkTitle: "添加边缘节点"
weight: 3630
---

KubeSphere 利用 [KubeEdge](https://kubeedge.io/en/) 将原生容器化应用程序编排功能扩展到边缘的主机。通过单独的云和边缘核心模块，KubeEdge 提供完整的边缘计算解决方案，但安装过程可能较为繁琐。

![kubeedge_arch](/images/docs/installing-on-linux/add-and-delete-nodes/add-edge-nodes/kubeedge_arch.png)

{{< notice note >}}

有关 KubeEdge 不同组件的更多信息，请参见 [KubeEdge 文档](https://docs.kubeedge.io/zh/docs/kubeedge/#components)。

{{</ notice >}} 

After an edge node joins your cluster, the native KubeEdge cloud component requires you to manually configure iptables so that you can use commands such as `kubectl logs` and `kubectl exec`. In this connection, KubeSphere features an efficient and convenient way to add edge nodes to a Kubernetes cluster. It uses supporting components (for example, EdgeWatcher) to automatically configure iptables.

边缘节点加入集群后，原生 KubeEdge 云组件要求手动配置 iptables，以便您可以使用 `kubectl logs` 和 `kubectl exec` 等命令。在这方面，KubeSphere 能够提供一种高效便捷的方法将边缘节点添加到 Kubernetes 集群。它使用所支持的组件（例如，EdgeWatcher）来自动配置 iptables。

![edge-watcher](/images/docs/installing-on-linux/add-and-delete-nodes/add-edge-nodes/edge-watcher.png)

本教程演示如何将边缘节点添加到集群中。

## 准备工作

- 您需要启用 [KubeEdge](../../../pluggable-components/kubeedge/)。
- 您有一个可用节点作为边缘节点，该节点可以运行 Ubuntu（建议）或 CentOS。本教程以 Ubuntu 18.04 为例。
- 与 Kubernetes 集群节点不同，边缘节点应该在单独的网络中工作。

## 配置边缘节点

You need to install a container runtime and configure EdgeMesh on your edge node.您需要在边缘节点上安装容器运行时并配置 EdgeMesh。

### 安装容器运行时

[KubeEdge](https://docs.kubeedge.io/zh/docs/) 支持几种容器运行时，包括 Docker，containerd，CRI-O 和 Virtlet。有关更多信息，请参见 [KubeEdge 文档](https://docs.kubeedge.io/zh/docs/advanced/cri/)。

### 配置 EdgeMesh

执行以下步骤以在边缘节点上配置 [EdgeMesh](https://kubeedge.io/zh/docs/advanced/edgemesh/)。

1. 编辑 `/etc/nsswitch.conf`。

   ```bash
   vi /etc/nsswitch.conf
   ```

2. 在该文件中添加以下内容。

   ```bash
   hosts:          dns files mdns4_minimal [NOTFOUND=return]
   ```

3. 保存文件并运行以下命令启用 IP 转发：

   ```bash
   sudo echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
   ```

4. 验证修改：

   ```bash
   sudo sysctl -p | grep ip_forward
   ```

   预期结果：

   ```bash
   net.ipv4.ip_forward = 1
   ```

## 创建防火墙规则和端口转发规则

To make sure edge nodes can successfully talk to your cluster, you must forward ports for outside traffic to get into your network. Specifically, map an external port to the corresponding internal IP address (master node) and port based on the table below. Besides, you also need to create firewall rules to allow traffic to these ports (`10000` to `10004`).

| 字段                | 外部端口 | 字段                    | 内部端口 |
| ------------------- | -------- | ----------------------- | -------- |
| `cloudhubPort`      | `10000`  | `cloudhubNodePort`      | `30000`  |
| `cloudhubQuicPort`  | `10001`  | `cloudhubQuicNodePort`  | `30001`  |
| `cloudhubHttpsPort` | `10002`  | `cloudhubHttpsNodePort` | `30002`  |
| `cloudstreamPort`   | `10003`  | `cloudstreamNodePort`   | `30003`  |
| `tunnelPort`        | `10004`  | `tunnelNodePort`        | `30004`  |

## 添加边缘节点

1. 使用 `admin` 用户登录控制台，点击左上角的**平台管理**。

2. 选择**集群管理**，然后导航至**节点管理**下的**边缘节点**。

   {{< notice note >}}

   如果已经启用[多集群管理](../../../multicluster-management/)，则需要首先选择一个集群。

   {{</ notice >}} 

3. 点击**添加节点**。在出现的对话框中，选择边缘节点的节点名称并输入其内网 IP 地址。点击**验证**以继续。

   {{< notice note >}} 

   - The internal IP address is only used for inter-node communication and you do not necessarily need to use the actual internal IP address of the edge node. As long as the IP address is successfully validated, you can use it.内网 IP 地址仅用于节点间通信，您不一定需要使用边缘节点的真实内网 IP 地址。只要 IP 地址验证成功，您就可以使用该节点。
   - 建议您勾选方框添加默认污点。

   {{</ notice >}} 

4. 复制**添加命令**下自动创建的命令，并在您的边缘节点上运行该命令。

   {{< notice note >}}

   在运行该命令前，请确保您的边缘节点上已安装 `wget`。

   {{</ notice >}} 

   ![edge-node-dialog](/images/docs/installing-on-linux/add-and-delete-nodes/add-edge-nodes/edge-node-dialog.png)

5. 关闭对话框，刷新页面，您将看到边缘节点显示在列表中。

   ![edge-node-added](/images/docs/installing-on-linux/add-and-delete-nodes/add-edge-nodes/edge-node-added.png)

   {{< notice note >}}

   After an edge node is added, if you cannot see CPU and memory resource usage on the **Edge Nodes** page, make sure [Metrics Server](../../../pluggable-components/metrics-server/) 0.4.1 or later is installed in your cluster.边缘节点添加后，如果在**边缘节点**页面查看不到 CPU 和内存资源使用情况，请确保集群中安装的 [Metrics Server](../../../pluggable-components/metrics-server/) 为 0.4.1及以上。

   {{</ notice >}}

## 移除边缘节点

移除边缘节点之前，请删除在该节点上运行的全部工作负载。

1. 在边缘节点上运行以下命令：

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

   If you cannot delete the tmpfs-mounted folder, restart the node or unmount the folder first.如果无法删除 tmpfs 挂载的文件夹，请重启节点或先取消挂载该文件夹。

   {{</ notice >}} 

2. 运行以下命令从集群中移除边缘节点：

   ```bash
   kubectl delete node <edgenode-name>
   ```

3. 如需从集群中卸载 KubeEdge，运行以下命令：

   ```bash
   helm uninstall kubeedge -n kubeedge
   ```
   
   {{< notice note >}}
   
   卸载完成后，您将无法看到添加到集群中的边缘节点。
   
   {{</ notice >}} 
