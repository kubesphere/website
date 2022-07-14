---
title: "添加边缘节点"
keywords: 'Kubernetes, KubeSphere, KubeEdge'
description: '将边缘节点添加到集群。'
linkTitle: "添加边缘节点"
weight: 3630
---

KubeSphere 利用 [KubeEdge](https://kubeedge.io/zh/) 将原生容器化应用程序编排功能扩展到边缘的主机。KubeEdge 拥有单独的云端和边端核心模块，提供完整的边缘计算解决方案，但安装过程可能较为繁琐。

![kubeedge_arch](/images/docs/v3.3/zh-cn/installing-on-linux/add-and-delete-nodes/add-edge-nodes/kubeedge_arch.png)

{{< notice note >}}

有关 KubeEdge 不同组件的更多信息，请参见 [KubeEdge 文档](https://docs.kubeedge.io/zh/docs/kubeedge/#components)。

{{</ notice >}} 

本教程演示如何将边缘节点添加到集群。

## 准备工作

- 您需要启用 [KubeEdge](../../../pluggable-components/kubeedge/)。
- 您有一个可用节点作为边缘节点，该节点可以运行 Ubuntu（建议）或 CentOS。本教程以 Ubuntu 18.04 为例。
- 与 Kubernetes 集群节点不同，边缘节点应部署在单独的网络中。

## 配置边缘节点

您需要在边缘节点上安装容器运行时并配置 EdgeMesh。

### 安装容器运行时

[KubeEdge](https://docs.kubeedge.io/zh/docs/) 支持多种容器运行时，包括 Docker、containerd、CRI-O 和 Virtlet。有关更多信息，请参见 [KubeEdge 文档](https://docs.kubeedge.io/zh/docs/advanced/cri/)。

{{< notice note >}}

如果您的边缘节点使用 Docker 作为容器运行时，为确保 KubeSphere 可以获取 Pod 指标，请务必在边缘节点上安装 Docker v19.3.0 或更高版本。

{{</ notice >}}

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

若要确保边缘节点可以成功地与集群通信，您必须转发端口，以便外部流量进入您的网络。您可以根据下表将外网端口映射到相应的内网 IP 地址（主节点）和端口。此外，您还需要创建防火墙规则以允许流量进入这些端口（`10000` 至 `10004`）。

   {{< notice note >}}
   在 ks-installer 的 `ClusterConfiguration`中，如果您设置的是局域网地址，那么需要配置转发规则。如果您未配置转发规则，直接连接 30000 – 30004 端口即可。
   {{</ notice >}} 

| 字段                | 外网端口 | 字段                    | 内网端口 |
| ------------------- | -------- | ----------------------- | -------- |
| `cloudhubPort`      | `10000`  | `cloudhubNodePort`      | `30000`  |
| `cloudhubQuicPort`  | `10001`  | `cloudhubQuicNodePort`  | `30001`  |
| `cloudhubHttpsPort` | `10002`  | `cloudhubHttpsNodePort` | `30002`  |
| `cloudstreamPort`   | `10003`  | `cloudstreamNodePort`   | `30003`  |
| `tunnelPort`        | `10004`  | `tunnelNodePort`        | `30004`  |

## 添加边缘节点

1. 使用 `admin` 用户登录控制台，点击左上角的**平台管理**。

2. 选择**集群管理**，然后导航至**节点**下的**边缘节点**。

   {{< notice note >}}

   如果已经启用[多集群管理](../../../multicluster-management/)，则需要首先选择一个集群。

   {{</ notice >}} 

3. 点击**添加**。在出现的对话框中，设置边缘节点的节点名称并输入其内网 IP 地址。点击**验证**以继续。

   {{< notice note >}} 

   - 内网 IP 地址仅用于节点间通信，您不一定要使用边缘节点的真实内网 IP 地址。只要 IP 地址验证成功，您就可以使用该 IP 地址。
   - 建议您勾选方框添加默认污点。

   {{</ notice >}} 

4. 复制**边缘节点配置命令**下自动创建的命令，并在您的边缘节点上运行该命令。

   {{< notice note >}}

   在运行该命令前，请确保您的边缘节点上已安装 `wget`。

   {{</ notice >}} 

5. 关闭对话框，刷新页面，您将看到边缘节点显示在列表中。

   {{< notice note >}}

   添加边缘节点后，如果在**边缘节点**页面查看不到 CPU 和内存资源使用情况，请确保您的集群中已安装 [Metrics Server](../../../pluggable-components/metrics-server/) 0.4.1 或以上版本。

   {{</ notice >}}


## 收集边缘节点监控信息

如果需要收集边缘节点的监控信息，请先在`ClusterConfiguration` 中开启 `metrics_server`，以及在 KubeEdge 中开启 `edgeStream`。

1. 在 KubeSphere 控制台上，点击**平台管理 > 集群管理**。

2. 在左侧导航栏。点击**定制资源定义**。

3. 在右侧的搜索框中，输入 `clusterconfiguration`，并点击结果查看其详细页面。

4. 点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/common-icons/three-dots.png" width="15" alt="icon" />，选择**编辑 YAML**。

5. 找到 **metrics_server**，将 `enabled` 的 `false` 更改为 `true`。

    ```yaml
      metrics_server:
      enabled: true # 将“false”更改为“true”。
    ```

6. 点击右下角的**确定**，保存配置。

7. 进入 `/etc/kubeedge/config` 文件，搜索 `edgeStream`，将 `false` 更改为 `true` 并保存文件。
    ```bash
    cd /etc/kubeedge/config
    vi edgecore.yaml
    ```

    ```bash
    edgeStream:
    enable: true #将“false”更改为“true”。
    handshakeTimeout: 30
    readDeadline: 15
    server: xx.xxx.xxx.xxx:10004 #如果没有添加端口转发，将端口修改为30004。
    tlsTunnelCAFile: /etc/kubeedge/ca/rootCA.crt
    tlsTunnelCertFile: /etc/kubeedge/certs/server.crt
    tlsTunnelPrivateKeyFile: /etc/kubeedge/certs/server.key
    writeDeadline: 15
    ```

8. 重启 `edgecore.service`。
    ```bash
    systemctl restart edgecore.service
    ```

9. 边缘节点加入集群后，部分 Pod 在调度至该边缘节点上后可能会一直处于 `Pending` 状态。由于部分守护进程集（例如，Calico）有强容忍度，您需要手动 Patch Pod 以防止它们调度至该边缘节点。


   ```bash
   #!/bin/bash
   
   NodeSelectorPatchJson='{"spec":{"template":{"spec":{"nodeSelector":{"node-role.kubernetes.io/master": "","node-role.kubernetes.io/worker": ""}}}}}'
   
   NoShedulePatchJson='{"spec":{"template":{"spec":{"affinity":{"nodeAffinity":{"requiredDuringSchedulingIgnoredDuringExecution":{"nodeSelectorTerms":[{"matchExpressions":[{"key":"node-role.kubernetes.io/edge","operator":"DoesNotExist"}]}]}}}}}}}'
   
   edgenode="edgenode"
   if [ $1 ]; then
           edgenode="$1"
   fi
   
   
   namespaces=($(kubectl get pods -A -o wide |egrep -i $edgenode | awk '{print $1}' ))
   pods=($(kubectl get pods -A -o wide |egrep -i $edgenode | awk '{print $2}' ))
   length=${#namespaces[@]}
   
   
   for((i=0;i<$length;i++));  
   do
           ns=${namespaces[$i]}
           pod=${pods[$i]}
           resources=$(kubectl -n $ns describe pod $pod | grep "Controlled By" |awk '{print $3}')
           echo "Patching for ns:"${namespaces[$i]}",resources:"$resources
           kubectl -n $ns patch $resources --type merge --patch "$NoShedulePatchJson"
           sleep 1
   done
   ```

10. 如果仍然无法显示监控数据，执行以下命令：
    ```bash
    journalctl -u edgecore.service -b -r
    ```
    
    {{< notice note >}}
     
   如果提示 `failed to check the running environment: kube-proxy should not running on edge node when running edgecore`，需要参考步骤 8 再次重启 `edgecore.service`。
     
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

   如果无法删除 tmpfs 挂载的文件夹，请重启节点或先取消挂载该文件夹。

   {{</ notice >}} 

2. 运行以下命令从集群中移除边缘节点：

   ```bash
   kubectl delete node <edgenode-name>
   ```

3. 如需从集群中卸载 KubeEdge，运行以下命令：

   ```bash
   helm uninstall kubeedge -n kubeedge
   ```
   
   ```bash
   kubectl delete ns kubeedge
   ```
   
   {{< notice note >}}
   
   卸载完成后，您将无法为集群添加边缘节点。
   
   {{</ notice >}} 
