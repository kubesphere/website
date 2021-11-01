---
title: 'Calico 路由反射模式权威指南'
tag: 'Kubernetes,KubeSphere,Calico'
keywords: 'Kubernetes, KubeSphere, Calico, 网络插件'
description: '作为 Kubernetes 最长使用的一种网络插件，Calico 具有很强的扩展性，较优的资源利用和较少的依赖，相较于 Flannel 插件采用 Overlay 的网络，Calico 可以通过三层路由的方式采用性能更佳的 Underlay 网络，Calico 网络插件的转发效率是所有方案中较高的。'
createTime: '2021-06-02'
author: '武献雨'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/calico-cover.png'
---

## 概述

作为 Kubernetes 最长使用的一种网络插件，Calico 具有很强的扩展性，较优的资源利用和较少的依赖，相较于 Flannel 插件采用 Overlay 的网络，Calico 可以通过三层路由的方式采用性能更佳的 Underlay 网络，Calico 网络插件的转发效率是所有方案中较高的。

在使用 Calico 网络插件的实际生产环境当中，为了提高网络的性能和灵活性，需要将 K8s 的工作节点和物理网络中的 leaf 交换机建立 BGP 邻居关系，同步 BGP 路由信息，可以将 pod 网络的路由发布到物理网络中。Calico 给出了三种类型的 BGP 互联方案，分别是 **Full-mesh**、**Route reflectors** 和 **Top of Rack (ToR)**。

### Full-mesh

全互联模式，启用了 BGP 之后，Calico 的默认行为是在每个节点彼此对等的情况下创建完整的内部 BGP（iBGP）连接，这使 Calico 可以在任何 L2 网络（无论是公有云还是私有云）上运行，或者说（如果配了 IPIP）可以在任何不禁止 IPIP 流量的网络上作为 Overlay 运行。对于 vxlan overlay，Calico 不使用 BGP。

Full-mesh 模式对于 100 个以内的工作节点或更少节点的中小规模部署非常有用，但是在较大的规模上，Full-mesh 模式效率会降低，较大规模情况下，Calico 官方建议使用 Route reflectors。

### Route reflectors

如果想构建内部 BGP（iBGP）大规模集群，可以使用 BGP 路由反射器来减少每个节点上使用 BGP 对等体的数量。在此模型中，某些节点充当路由反射器，并配置为在它们之间建立完整的网格。然后，将其他节点配置为与这些路由反射器的子集（通常为冗余，通常为 2 个）进行对等，从而与全网格相比减少了 BGP 对等连接的总数。

### Top of Rack（ToR）

在本地部署中，可以将 Calico 配置为直接与物理网络基础结构对等。通常，这需要涉及到禁用 Calico 的默认 Full-mesh 行为，将所有 Calico 节点与 L3 ToR 路由器对等。

本篇文章重点会介绍如何在 BGP 网络环境下配置 Calico 路由反射器，本篇主要介绍将 K8S 工作节点作为路由反射器和物理交换机建立 BGP 连接。配置环境拓扑如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/20210602104325.png)

在本次环境中，分别有一台 spine 交换机和两台 leaf 交换机来建立 EBGP 连接。所有 leaf 交换机都属于一个独立的自治系统，所有 leaf 交换机下的 node 都属于一个独立的自治系统。Kubernetes 集群节点中每个 leaf 下由两台工作节点作为 CalicoRR（路由反射器），之所以用两台 node 作为路由反射器是考虑冗余性，所有 Calico RR 都跟自己上联的 leaf 交换机建立 EBGP 连接。Calico RR 和自己所属的 node 之间建立 iBGP 连接。

## 安装 calicoctl

Calico RR 所有配置操作都需要通过 calicoctl 工具来完成， calicoctl 允许从命令创建，读取，更新和删除 Calico 对象，所以我们首先需要在 Kubernetes 所有的工作节点上安装 calicoctl 工具。

采用二进制方式安装 calicoctl 工具。

登录到主机，打开终端提示符，然后导航到安装二进制文件位置，一般情况下 calicoctl 安装到 /usr/local/bin/。

使用以下命令下载 calicoctl 二进制文件，版本号选择自己 Calico 的版本。

```
$ curl -O -L  https://github.com/projectcalico/calicoctl/releases/download/v3.17.2/calicoctl
```

将文件设置为可执行文件。

```
$ chmod +x calicoctl
```

每次执行 calicoctl 之前需要设置环境变量。

```
$ export DATASTORE_TYPE=kubernetes
$ export KUBECONFIG=~/.kube/config
```

如果不希望每次执行 calicoctl 之前都需要设置环境变量，可以将环境变量信息写到永久写入到 /etc/calico/calicoctl.cfg 文件里，calicoctl.cfg 配置文件编辑如下：

```yaml
apiVersion: projectcalico.org/v3
kind: CalicoAPIConfig
metadata:
spec:
  datastoreType: "kubernetes"
  kubeconfig: "/root/.kube/config"
```

命令使用：

```
[root@node1 ~]# calicoctl -h
Usage:
  calicoctl [options] <command> [<args>...]

    create       Create a resource by filename or stdin.
    replace      Replace a resource by filename or stdin.
    apply        Apply a resource by filename or stdin.  This creates a resource
                 if it does not exist, and replaces a resource if it does exists.
    patch        Patch a pre-exisiting resource in place.
    delete       Delete a resource identified by file, stdin or resource type and
                 name.
    get          Get a resource identified by file, stdin or resource type and
                 name.
    label        Add or update labels of resources.
    convert      Convert config files between different API versions.
    ipam         IP address management.
    node         Calico node management.
    version      Display the version of calicoctl.
    export       Export the Calico datastore objects for migration
    import       Import the Calico datastore objects for migration
    datastore    Calico datastore management.

Options:
  -h --help               Show this screen.
  -l --log-level=<level>  Set the log level (one of panic, fatal, error,
                          warn, info, debug) [default: panic]

Description:
  The calicoctl command line tool is used to manage Calico network and security
  policy, to view and manage endpoint configuration, and to manage a Calico
  node instance.

  See 'calicoctl <command> --help' to read about a specific subcommand.
```

## 关闭 Full-mesh 模式

Calico 默认是 Full-mesh 全互联模式，Calico 集群中的的节点之间都会建立连接，进行路由交换。但是随着集群规模的扩大，mesh 模式将形成一个巨大服务网格，连接数成倍增加。这时就需要使用 Route Reflector（路由器反射）模式解决这个问题。确定一个或多个 Calico 节点充当路由反射器，让其他节点从这个 RR 节点获取路由信息。

关闭 node-to-node BGP 网络，具体操作步骤如下：

添加 default BGP 配置，调整 nodeToNodeMeshEnabled 和 asNumber：

```
[root@node1 calico]# cat bgpconf.yaml
apiVersion: projectcalico.org/v3
kind: BGPConfiguration
metadata:
  name: default
spec:
  logSeverityScreen: Info
  nodeToNodeMeshEnabled: false
  asNumber: 64512
```

直接应用一下，应用之后会马上禁用 Full-mesh：

```
[root@node1 calico]# calicoctl apply -f bgpconf.yaml
Successfully applied 1 'BGPConfiguration' resource(s)
```

查看 bgp 网络配置情况，false 为关闭：

```
[root@node1 calico]# calicoctl get bgpconfig
NAME      LOGSEVERITY   MESHENABLED   ASNUMBER
default   Info          false         64512
```

## 修改工作节点的 Calico 配置

通过 calicoctl get nodes --output=wide 可以获取各节点的 ASN 号：

```
[root@node1 calico]# calicoctl get nodes --output=wide
NAME    ASN      IPV4             IPV6
node1   (64512)   172.20.0.11/24
node2   (64512)   172.20.0.12/24
node3   (64512)   172.20.0.13/24
node4   (64512)   173.20.0.11/24
node5   (64512)   173.20.0.12/24
node6   (64512)   173.20.0.13/24
```

可以看到获取的 ASN 号都是“（64512）”，这是因为如果不给每个节点指定 ASN 号，默认都是 64512。我们可以按照拓扑图配置各个节点的 ASN 号，不同 leaf 交换机下的节点，ASN 号不一样，每个 leaf 交换机下的工作节点都是一个独立自治系统。

通过如下命令，获取工作节点的 Calico 配置信息：

```
$ calicoctl get node node1 -o yaml > node1.yaml
```

每一个工作节点的 Calico 配置信息都需要获取一下，输出为 yaml 文件，“node1”为 Calico 节点的名称。

按照如下格式进行修改：

```
[root@node1 calico]# cat node1.yaml
apiVersion: projectcalico.org/v3
kind: Node
metadata:
  annotations:
    projectcalico.org/kube-labels: '{"beta.kubernetes.io/arch":"amd64","beta.kubernetes.io/os":"linux","kubernetes.io/arch":"amd64","kubernetes.io/hostname":"node1","kubernetes.io/os":"linux","node-role.kubernetes.io/master":"","node-role.kubernetes.io/worker":"","rr-group":"rr1","rr-id":"rr1"}'
  creationTimestamp: null
  labels:
    beta.kubernetes.io/arch: amd64
    beta.kubernetes.io/os: linux
    kubernetes.io/arch: amd64
    kubernetes.io/hostname: node1
    kubernetes.io/os: linux
    node-role.kubernetes.io/master: ""
    node-role.kubernetes.io/worker: ""
  name: node1
spec:
  bgp:
    asNumber: 64512                           ## asNumber根据自己需要进行修改

    ipv4Address: 172.20.0.11/24
    routeReflectorClusterID: 172.20.0.11      ## routeReflectorClusterID一般改成自己节点的IP地址
  orchRefs:
  - nodeName: node1
    orchestrator: k8s
status:
  podCIDRs:
  - ""
  - 10.233.64.0/24
```

将所有节点的 Calico 配置信息全部修改之后，通过 calicoctl get nodes -o wide 命令获取到的节点信息如下：

```
[root@node1 calico]# calicoctl get nodes -o wide
NAME    ASN     IPV4             IPV6
node1   64512   172.20.0.11/24
node2   64512   172.20.0.12/24
node3   64512   172.20.0.13/24
node4   64513   173.20.0.11/24
node5   64513   173.20.0.12/24
node6   64513   173.20.0.13/24
```

上面可以可以看到所有的 ASN 好都已变为手动指定的，不在是全局默认的。

## 为 node 节点进行分组（添加 label）

为方便让 BGPPeer 轻松选择节点，在 Kubernetes 集群中，我们需要将所有节点通过打 label 的方式进行分组，这里，我们将 label 标签分为下面几种：

- rr-group 这里定义为节点所属的 Calico RR 组，主要有 rr1 和 rr2 两种，为不同 leaf 交换机下的 Calico RR
- rr-id 这里定义为所属 Calico RR 的 ID，节点添加了该标签说明该节点作为了路由反射器，主要有 rr1 和 rr2 两种，为不同 leaf 交换机下的 Calico RR

![](https://pek3b.qingstor.com/kubesphere-community/images/20210602104444.png)

通过以下命令为每个节点添加 label：

```
$ kubectl label nodes node1 rr-group=rr1
$ kubectl label nodes node1 rr-id=rr1
```

查看最终设置情况：

```
[root@node1 calico]# kubectl get nodes --show-labels
NAME         STATUS           ROLES            AGE          VERSION         LABELS
node1   Ready    master,worker   31d   v1.17.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node1,kubernetes.io/os=linux,node-role.kubernetes.io/master=,node-role.kubernetes.io/worker=,rr-group=rr1,rr-id=rr1
node2   Ready    master,worker   31d   v1.17.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node2,kubernetes.io/os=linux,node-role.kubernetes.io/master=,node-role.kubernetes.io/worker=,rr-group=rr1,rr-id=rr1
node3   Ready    master,worker   31d   v1.17.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node3,kubernetes.io/os=linux,node-role.kubernetes.io/master=,node-role.kubernetes.io/worker=,rr-group=rr1
node4   Ready    worker          16d   v1.17.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node4,kubernetes.io/os=linux,node-role.kubernetes.io/worker=,rr-group=rr2,rr-id=rr2
node5   Ready    worker          16d   v1.17.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node5,kubernetes.io/os=linux,node-role.kubernetes.io/worker=,rr-group=rr2,rr-id=rr2
node6   Ready    worker          16d   v1.17.9   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node5,kubernetes.io/os=linux,node-role.kubernetes.io/worker=,rr-group=rr2,rr-id=rr2
```

## 配置 BGPPeer

在配置 BGPPeer 之前，我们可以先查看一下各个 node BGP 的节点状态，因为已经禁用了 Full-mesh，并且现在还没有配置 BGPPeer，所以所有节点里的信息都是空的。

```
[root@node3 ~]# calicoctl node status
Calico process is running.

IPv4 BGP status
No IPv4 peers found.

IPv6 BGP status
No IPv6 peers found.
```

根据环境拓扑，node1 和 node2 作为 Calico RR，需要和 leaf01 交换机建立 BGP 连接；node4 和 node5 作为 Calico RR 需要和 leaf02 交换机建立 BGP 连接；node1、node2 和 node3 需要和 RR1 建立 BGP 连接；node4、node5 和 node6 需要和 RR2 建立 BGP 连接。按照下面步骤依次配置：

1. RR1 和 leaf01 建立 BGP 连接

编写配置文件，取名为“rr1-to-leaf1-peer.yaml”，配置文件编辑如下：

```
[root@node1 calico]# cat rr1-to-leaf1-peer.yaml
apiVersion: projectcalico.org/v3
kind: BGPPeer
metadata:
  name: rr1-to-leaf1-peer        ## 给BGPPeer取一个名称，方便识别

spec:
  nodeSelector: rr-id == 'rr1'   ## 通过节点选择器添加有rr-id == 'rr1'标签的节点

  peerIP: 172.20.0.254           ##  leaf01交换机的地址
  asNumber: 65009                ##  leaf01交换机的AS号
```

应用该配置：

```
[root@node1 calico]# calicoctl apply -f rr1-to-leaf1-peer.yaml
Successfully applied 1 'BGPPeer' resource(s)
```

2. RR1 和自己所属的节点建立 BGP 连接

RR1 所属的节点主要有 node1、node2 和 node3，也就是打了 rr-group=rr1 标签的节点，配置文件编写如下：

```
[root@node1 calico]# cat rr1-to-node-peer.yaml
apiVersion: projectcalico.org/v3
kind: BGPPeer
metadata:
  name: rr1-to-node-peer              ## 给BGPPeer取一个名称，方便识别

spec:
  nodeSelector: rr-group == 'rr1'     ## 通过节点选择器添加有rr-group == ‘rr1’标签的节点

  peerSelector: rr-id  == 'rr1'       ## 通过peer选择器添加有rr-id == ‘rr1’标签的路由反射器
```

应用该配置：

```
[root@node1 calico]# calicoctl apply -f rr1-to-node-peer.yaml
Successfully applied 1 'BGPPeer' resource(s)
```

3. 在 leaf01 交换机上操作，建立 leaf01 交换机和 RR1 的 BGP 连接，交换机配置完成后，可以查看交换机 bgp peer 的连接状态

```
[leaf01]show bgp peer ipv4

 BGP local router ID: 2.2.2.2
 Local AS number: 65009
 Total number of peers: 3		  Peers in established state: 3

  * - Dynamically created peer
  Peer                    AS  MsgRcvd  MsgSent OutQ PrefRcv Up/Down  State

  100.0.0.1            65008     1696     1677    0       8 23:52:28 Established
  172.20.0.11          64512     1648     1506    0       4 23:51:50 Established
  172.20.0.12          64512     1647     1659    0       4 23:51:44 Established
```

上面 172.20.0.11 和 172.20.0.12 是 node1 和 node2 节点，也就是 RR1。状态显示为“Established“说明 BGP 连结已建立。

4. RR2 和 leaf02 建立 BGP 连接

编写配置文件，取名为“rr2-to-leaf2-peer.yaml”，配置文件编辑如下：

```
[root@node1 calico]# cat rr2-to-leaf2-peer.yaml
apiVersion: projectcalico.org/v3
kind: BGPPeer
metadata:
  name: rr2-to-leaf2-peer        ## 给BGPPeer取一个名称，方便识别

spec:
  nodeSelector: rr-id == 'rr2'   ## 通过节点选择器添加有rr-id == 'rr2'标签的节点
  peerIP: 173.20.0.254           ##  leaf02交换机的地址
  asNumber: 65010                ##  leaf02交换机的AS号
```

应用该配置：

```
[root@node1 calico]# calicoctl apply -f rr2-to-leaf2-peer.yaml
Successfully applied 1 'BGPPeer' resource(s)
```

5. RR2 和自己所属的节点建立 BGP 连接

RR2 所属的节点主要有 node4、node5 和 node6，也就是打了 rr-group=rr2 标签的节点，配置文件编写如下：

```
[root@node1 calico]# cat rr2-to-node-peer.yaml
apiVersion: projectcalico.org/v3
kind: BGPPeer
metadata:
  name: rr2-to-node-peer              ## 给BGPPeer取一个名称，方便识别

spec:
  nodeSelector: rr-group == 'rr2'     ## 通过节点选择器添加有rr-group == ‘rr2’标签的节点
  peerSelector: rr-id  == 'rr2'       ## 通过peer选择器添加有rr-id == ‘rr2’标签的路由反射器
```

应用该配置：

```
[root@node1 calico]# calicoctl apply -f rr2-to-node-peer.yaml
Successfully applied 1 'BGPPeer' resource(s)
```

6. 在 leaf02 交换机上操作，建立 leaf02 交换机和 RR2 的 BGP 连接

交换机配置完成后，可以查看交换机 bgp peer 的连接状态：

```
<leaf02>sys
System View: return to User View with Ctrl+Z.
[leaf02]show bgp peer ipv4

 BGP local router ID: 3.3.3.3
 Local AS number: 65010
 Total number of peers: 3		  Peers in established state: 3

  * - Dynamically created peer
  Peer                    AS  MsgRcvd  MsgSent OutQ PrefRcv Up/Down  State

  100.0.0.5            65008     1561     1686    0      11 24:01:03 Established
  173.20.0.11          64513     1655     1650    0       2 23:59:44 Established
  173.20.0.12          64513     1661     1883    0       2 23:59:56 Established
```

上面 173.20.0.11 和 173.20.0.12 是 node4 和 node5 节点，也就是 RR2。状态显示为“Established“说明 BGP 连结已建立。

最后，我们可以通过 calicoctl get bgppeer 命令来查看所有的 BGPPeer 配置条目：

```
[root@node1 calico]# calicoctl get bgppeer
NAME                PEERIP         NODE                ASN
rr1-to-leaf1-peer   172.20.0.254   rr-id == 'rr1'      65009
rr1-to-node-peer                   rr-group == 'rr1'   0
rr2-to-leaf2-peer   173.20.0.254   rr-id == 'rr2'      65010
rr2-to-node-peer                   rr-group == 'rr2'   0

```

如果想删除某个 BGPPeer 条目，可以通过下面的命令：

```
$ calicoctl delete bgppeer rr2-to-node-peer
```

## 工作节点配置验证

至此，BGPPeer 配置已完成，可以在各个节点里再次查看 BGPPeer 状态信息。

在 node1 节点操作：

```
[root@node1 calico]# calicoctl node status
Calico process is running.

IPv4 BGP status
+--------------+---------------+-------+------------+-------------+
| PEER ADDRESS |   PEER TYPE   | STATE |   SINCE    |    INFO     |
+--------------+---------------+-------+------------+-------------+
| 172.20.0.12  | node specific | up    | 2021-02-16 | Established |
| 172.20.0.13  | node specific | up    | 2021-02-16 | Established |
| 172.20.0.254 | node specific | up    | 2021-02-16 | Established |
+--------------+---------------+-------+------------+-------------+

IPv6 BGP status
No IPv6 peers found.
```

可以看到该节点已经和 leaf01 交换机、node2 和 node3 节点建立了 BGP 连接。

在 node2 节点操作：

```
[root@node2 ~]# calicoctl node status
Calico process is running.

IPv4 BGP status
+--------------+---------------+-------+------------+-------------+
| PEER ADDRESS |   PEER TYPE   | STATE |   SINCE    |    INFO     |
+--------------+---------------+-------+------------+-------------+
| 172.20.0.11  | node specific | up    | 2021-02-16 | Established |
| 172.20.0.13  | node specific | up    | 2021-02-16 | Established |
| 172.20.0.254 | node specific | up    | 2021-02-16 | Established |
+--------------+---------------+-------+------------+-------------+

IPv6 BGP status
No IPv6 peers found.
```

可以看到该节点已经和 leaf01 交换机、node1 和 node3 节点建立了 BGP 连接。

在 node3 节点操作：

```
[root@node3 ~]# calicoctl node status
Calico process is running.

IPv4 BGP status
+--------------+---------------+-------+------------+-------------+
| PEER ADDRESS |   PEER TYPE   | STATE |   SINCE    |    INFO     |
+--------------+---------------+-------+------------+-------------+
| 172.20.0.11  | node specific | up    | 2021-02-16 | Established |
| 172.20.0.12  | node specific | up    | 2021-02-16 | Established |
+--------------+---------------+-------+------------+-------------+

IPv6 BGP status
No IPv6 peers found.
```

可以看到该节点已经和 node1 和 node2 节点建立了 BGP 连接，因为该节点不作为路由反射器节点，所以并为与 leaf01 交换机建立 BGP 连接。

在 node4 节点操作：

```
[root@node4 ~]# calicoctl node status
Calico process is running.

IPv4 BGP status
+--------------+---------------+-------+------------+-------------+
| PEER ADDRESS |   PEER TYPE   | STATE |   SINCE    |    INFO     |
+--------------+---------------+-------+------------+-------------+
| 173.20.0.12  | node specific | up    | 2021-02-16 | Established |
| 173.20.0.13  | node specific | up    | 2021-02-16 | Established |
| 173.20.0.254 | node specific | up    | 2021-02-16 | Established |
+--------------+---------------+-------+------------+-------------+

IPv6 BGP status
No IPv6 peers found.
```

可以看到该节点已经和 leaf02 交换机、node5 和 node6 节点建立了 BGP 连接。

在 node5 节点操作：

```
[root@node5 ~]# calicoctl node status
Calico process is running.

IPv4 BGP status
+--------------+---------------+-------+------------+-------------+
| PEER ADDRESS |   PEER TYPE   | STATE |   SINCE    |    INFO     |
+--------------+---------------+-------+------------+-------------+
| 173.20.0.11  | node specific | up    | 2021-02-16 | Established |
| 173.20.0.13  | node specific | up    | 2021-02-16 | Established |
| 173.20.0.254 | node specific | up    | 2021-02-16 | Established |
+--------------+---------------+-------+------------+-------------+

IPv6 BGP status
No IPv6 peers found.
```

可以看到该节点已经和 leaf02 交换机、node4 和 node6 节点建立了 BGP 连接。

在 node6 节点操作：

```
[root@node6 ~]# calicoctl node status
Calico process is running.

IPv4 BGP status
+--------------+---------------+-------+------------+-------------+
| PEER ADDRESS |   PEER TYPE   | STATE |   SINCE    |    INFO     |
+--------------+---------------+-------+------------+-------------+
| 173.20.0.11  | node specific | up    | 2021-02-16 | Established |
| 173.20.0.12  | node specific | up    | 2021-02-16 | Established |
+--------------+---------------+-------+------------+-------------+

IPv6 BGP status
No IPv6 peers found.
```

可以看到该节点已经和 node4 和 node5 节点建立了 BGP 连接，因为该节点不作为路由反射器节点，所以并为与 leaf02 交换机建立 BGP 连接。

## 交换机配置验证

我们可以在所有交换机里去查看 BGP 同步的路由信息有没有署于 pod 的路由地址。

Spine 交换机操作：

![](https://pek3b.qingstor.com/kubesphere-community/images/20210602104537.png)

Leaf01 交换机操作：

![](https://pek3b.qingstor.com/kubesphere-community/images/20210602104556.png)

Leaf02 交换机操作：

![](https://pek3b.qingstor.com/kubesphere-community/images/20210602104612.png)

在上面交换机操作截图中，10.233 开头的地址段都是 pod 地址段的路由信息。

## 将 Service 地址路由同步到物理网络

有些时候不光需要 Pod 地址可以在现网可被路由，Service 地址也会有这个需求，我们可以通过修改 bgpconfig 配置来实现 Service 地址的路由同步。

首先检查是否具有默认的 BGP 配置：

```
[root@node1 ~]# calicoctl get bgpconfig default
NAME      LOGSEVERITY   MESHENABLED   ASNUMBER
default   Info          false         64512
```

默认的 BGP 配置是存在的，更新 BGP 配置：

```
[root@node1 ~]# calicoctl patch BGPConfig default --patch \
> '{"spec": {"serviceClusterIPs": [{"cidr": "10.233.0.0/18"}]}}'
Successfully patched 1 'BGPConfiguration' resource
```

注意将上面 10.233.0.0./18 地址段修改为 Service 的地址段。

上述配置完成之后，便可以在交换机里看到已经同步过来的 Service 地址段的路由信息。

## 文档参考链接

绝大多数配置都可以通过 Calico 官方文档获取，以下就是撰写本文参考的主要官方文档链接：

- [https://docs.projectcalico.org/networking/bgp](https://docs.projectcalico.org/networking/bgp "https://docs.projectcalico.org/networking/bgp")
- [https://docs.projectcalico.org/getting-started/clis/calicoctl/install](https://docs.projectcalico.org/getting-started/clis/calicoctl/install "https://docs.projectcalico.org/getting-started/clis/calicoctl/install")
- [https://docs.projectcalico.org/networking/advertise-service-ips#advertise-service-cluster-ip-addresses](https://docs.projectcalico.org/networking/advertise-service-ips#advertise-service-cluster-ip-addresses "https://docs.projectcalico.org/networking/advertise-service-ips#advertise-service-cluster-ip-addresses")
