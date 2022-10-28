---
title: "添加新节点"
keywords: 'Kubernetes, KubeSphere, 水平扩缩, 添加节点'
description: '添加更多节点以扩展集群。'
linkTitle: "添加新节点"
weight: 3610
---

KubeSphere 使用一段时间之后，由于工作负载不断增加，您可能需要水平扩展集群。自 KubeSphere v3.0.0 起，您可以使用全新的安装程序 [KubeKey](https://github.com/kubesphere/kubekey) 将新节点添加到集群。从根本上说，该操作是基于 Kubelet 的注册机制。换言之，新节点将自动加入现有的 Kubernetes 集群。KubeSphere 支持混合环境，这意味着新添加的主机操作系统可以是 CentOS 或者 Ubuntu。

本教程演示了如何将新节点添加到单节点集群。若要水平扩展多节点集群，操作步骤基本相同。

## 准备工作

- 您需要一个单节点集群。有关更多信息，请参见[在 Linux 上以 All-in-One 模式安装 KubeSphere](../../../quick-start/all-in-one-on-linux/)。

- 您需要已经[下载了 KubeKey](../../../installing-on-linux/introduction/multioverview/#步骤-2下载-kubekey)。

## 添加工作节点

1. 使用 KubeKey 检索集群信息。以下命令会创建配置文件 (`sample.yaml`)。

   ```bash
   ./kk create config --from-cluster
   ```

   {{< notice note >}}

如果您的机器上已有配置文件，就可以跳过此步骤。例如，若要将节点添加到由 KubeKey 设置的多节点集群，如果您没有删除该集群，则可能仍拥有该配置文件。

{{</ notice >}} 

2. 在配置文件中，将新节点的信息放在 `hosts` 和 `roleGroups` 之下。该示例添加了两个新节点（即 `node1` 和 `node2`）。这里的 `master1` 是现有节点。

   ```bash
   ···
   spec:
     hosts:
     - {name: master1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: Qcloud@123}
     - {name: node1, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Qcloud@123}
     - {name: node2, address: 192.168.0.5, internalAddress: 192.168.0.5, user: root, password: Qcloud@123}
     roleGroups:
       etcd:
       - master1
       control-plane:
       - master1
       worker:
       - node1
       - node2
   ···
   ```

   {{< notice note >}}

- 有关更多配置文件的信息，请参见[编辑配置文件](../../../installing-on-linux/introduction/multioverview/#2-编辑配置文件)。

- 添加新节点时，请勿修改现有节点的主机名。

- 用自己的主机名替换示例中的主机名。

  {{</ notice >}}

3. 执行以下命令：

   ```bash
   ./kk add nodes -f sample.yaml
   ```

4. 安装完成后，您将能够在 KubeSphere 的控制台上查看新节点及其信息。在**集群管理**页面，选择左侧菜单**节点**下的**集群节点**，或者执行命令 `kubectl get node` 以检查更改。

   ```bash
   $ kubectl get node
   NAME          STATUS   ROLES           AGE   VERSION
   master1       Ready    master,worker   20d   v1.17.9
   node1         Ready    worker          31h   v1.17.9
   node2         Ready    worker          31h   v1.17.9
   ```

## 添加主节点以实现高可用

添加主节点的步骤与添加工作节点的步骤大体一致，不过您需要为集群配置负载均衡器。您可以使用任何云负载均衡器或者硬件负载均衡器（例如 F5）。另外，Keepalived 和 [HAproxy](https://www.haproxy.com/)、或者 Nginx 也是创建高可用集群的替代方案。

1. 使用 KubeKey 创建配置文件。

   ```
   ./kk create config --from-cluster
   ```

2. 打开文件，可以看到一些字段预先填充了值。将新节点和负载均衡器的信息添加到文件中。以下示例供您参考：

   ```yaml
   apiVersion: kubekey.kubesphere.io/v1alpha1
   kind: Cluster
   metadata:
     name: sample
   spec:
     hosts:
     # You should complete the ssh information of the hosts
     - {name: master1, address: 172.16.0.2, internalAddress: 172.16.0.2, user: root, password: Testing123}
     - {name: master2, address: 172.16.0.5, internalAddress: 172.16.0.5, user: root, password: Testing123}
     - {name: master3, address: 172.16.0.6, internalAddress: 172.16.0.6, user: root, password: Testing123}
     - {name: worker1, address: 172.16.0.3, internalAddress: 172.16.0.3, user: root, password: Testing123}
     - {name: worker2, address: 172.16.0.4, internalAddress: 172.16.0.4, user: root, password: Testing123}
     - {name: worker3, address: 172.16.0.7, internalAddress: 172.16.0.7, user: root, password: Testing123}
     roleGroups:
       etcd:
       - master1
       - master2
       - master3
       control-plane:
       - master1
       - master2
       - master3
       worker:
       - worker1
       - worker2
       - worker3
     controlPlaneEndpoint:
       # If loadbalancer is used, 'address' should be set to loadbalancer's ip.
       domain: lb.kubesphere.local
       address: 172.16.0.253
       port: 6443
     kubernetes:
       version: v1.21.5
       imageRepo: kubesphere
       clusterName: cluster.local
       proxyMode: ipvs
       masqueradeAll: false
       maxPods: 110
       nodeCidrMaskSize: 24
     network:
       plugin: calico
       kubePodsCIDR: 10.233.64.0/18
       kubeServiceCIDR: 10.233.0.0/18
     registry:
       privateRegistry: ""
   ```

3. 请注意 `controlPlaneEndpoint` 字段。

   ```yaml
     controlPlaneEndpoint:
       # If you use a load balancer, the address should be set to the load balancer's ip.
       domain: lb.kubesphere.local
       address: 172.16.0.253
       port: 6443
   ```

   - 负载均衡器的域名默认为 `lb.kubesphere.local`，用于内部访问。您可以按需进行更改。
   - 大多数情况下，您需要为 `address` 字段提供负载均衡器的**私有 IP 地址**。然而，不同的云厂商可能为负载均衡器进行不同的配置。例如，如果您在阿里云上配置服务器负载均衡 (SLB)，该平台会为 SLB 分配一个公共 IP 地址，这意味着您需要为 `address` 字段指定公共 IP 地址。
   - `port` 字段指代 `api-server` 的端口。

4. 保存文件并执行以下命令以应用配置。

   ```bash
   ./kk add nodes -f sample.yaml
   ```

