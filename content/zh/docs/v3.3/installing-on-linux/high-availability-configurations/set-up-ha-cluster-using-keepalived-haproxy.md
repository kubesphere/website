---
title: "使用 Keepalived 和 HAproxy 创建高可用 Kubernetes 集群"
keywords: 'Kubernetes, KubeSphere, HA, 高可用, 安装, 配置, Keepalived, HAproxy'
description: '如何使用 Keepalived 和 HAproxy 配置高可用 Kubernetes 集群。'
linkTitle: "使用 Keepalived 和 HAproxy 创建高可用集群"
weight: 3220
---

高可用 Kubernetes 集群能够确保应用程序在运行时不会出现服务中断，这也是生产的需求之一。为此，有很多方法可供选择以实现高可用。

本教程演示了如何配置 Keepalived 和 HAproxy 使负载均衡、实现高可用。步骤如下：

1. 准备主机。
2. 配置 Keepalived 和 HAproxy。
3. 使用 KubeKey 创建 Kubernetes 集群，并安装 KubeSphere。

## 集群架构

示例集群有三个主节点，三个工作节点，两个用于负载均衡的节点，以及一个虚拟 IP 地址。本示例中的虚拟 IP 地址也可称为“浮动 IP 地址”。这意味着在节点故障的情况下，该 IP 地址可在节点之间漂移，从而实现高可用。

![architecture-ha-k8s-cluster](/images/docs/v3.3/installing-on-linux/high-availability-configurations/set-up-ha-cluster-using-keepalived-haproxy/architecture-ha-k8s-cluster.png)

请注意，在本示例中，Keepalived 和 HAproxy 没有安装在任何主节点上。但您也可以这样做，并同时实现高可用。然而，配置两个用于负载均衡的特定节点（您可以按需增加更多此类节点）会更加安全。这两个节点上只安装 Keepalived 和 HAproxy，以避免与任何 Kubernetes 组件和服务的潜在冲突。

## 准备主机

| IP 地址     | 主机名  | 角色                 |
| ----------- | ------- | -------------------- |
| 172.16.0.2  | lb1     | Keepalived & HAproxy |
| 172.16.0.3  | lb2     | Keepalived & HAproxy |
| 172.16.0.4  | master1 | master, etcd         |
| 172.16.0.5  | master2 | master, etcd         |
| 172.16.0.6  | master3 | master, etcd         |
| 172.16.0.7  | worker1 | worker               |
| 172.16.0.8  | worker2 | worker               |
| 172.16.0.9  | worker3 | worker               |
| 172.16.0.10 |         | 虚拟 IP 地址         |

有关更多节点、网络、依赖项等要求的信息，请参见[多节点安装](../../../installing-on-linux/introduction/multioverview/#step-1-prepare-linux-hosts)。

## 配置负载均衡

[Keepalived](https://www.keepalived.org/) 提供 VRRP 实现，并允许您配置 Linux 机器使负载均衡，预防单点故障。[HAProxy](http://www.haproxy.org/) 提供可靠、高性能的负载均衡，能与 Keepalived 完美配合。

由于 `lb1` 和 `lb2` 上安装了 Keepalived 和 HAproxy，如果其中一个节点故障，虚拟 IP 地址（即浮动 IP 地址）将自动与另一个节点关联，使集群仍然可以正常运行，从而实现高可用。若有需要，也可以此为目的，添加更多安装 Keepalived 和 HAproxy 的节点。

先运行以下命令安装 Keepalived 和 HAproxy。

```bash
yum install keepalived haproxy psmisc -y
```

### HAproxy

1. 在两台用于负载均衡的机器上运行以下命令以配置 Proxy（两台机器的 Proxy 配置相同）：

   ```bash
   vi /etc/haproxy/haproxy.cfg
   ```

2. 以下是示例配置，供您参考（请注意 `server` 字段。请记住 `6443` 是 `apiserver` 端口）：

   ```bash
   global
       log /dev/log  local0 warning
       chroot      /var/lib/haproxy
       pidfile     /var/run/haproxy.pid
       maxconn     4000
       user        haproxy
       group       haproxy
       daemon
   
      stats socket /var/lib/haproxy/stats
   
   defaults
     log global
     option  httplog
     option  dontlognull
           timeout connect 5000
           timeout client 50000
           timeout server 50000
   
   frontend kube-apiserver
     bind *:6443
     mode tcp
     option tcplog
     default_backend kube-apiserver
   
   backend kube-apiserver
       mode tcp
       option tcplog
       option tcp-check
       balance roundrobin
       default-server inter 10s downinter 5s rise 2 fall 2 slowstart 60s maxconn 250 maxqueue 256 weight 100
       server kube-apiserver-1 172.16.0.4:6443 check # Replace the IP address with your own.
       server kube-apiserver-2 172.16.0.5:6443 check # Replace the IP address with your own.
       server kube-apiserver-3 172.16.0.6:6443 check # Replace the IP address with your own.
   ```

3. 保存文件并运行以下命令以重启 HAproxy。

   ```bash
   systemctl restart haproxy
   ```

4. 使 HAproxy 在开机后自动运行：

   ```bash
   systemctl enable haproxy
   ```

5. 确保您在另一台机器 (`lb2`) 上也配置了 HAproxy。

### Keepalived

两台机器上必须都安装 Keepalived，但在配置上略有不同。

1. 运行以下命令以配置 Keepalived。

   ```bash
   vi /etc/keepalived/keepalived.conf
   ```

2. 以下是示例配置 (`lb1`)，供您参考：

   ```bash
   global_defs {
     notification_email {
     }
     router_id LVS_DEVEL
     vrrp_skip_check_adv_addr
     vrrp_garp_interval 0
     vrrp_gna_interval 0
   }
   
   vrrp_script chk_haproxy {
     script "killall -0 haproxy"
     interval 2
     weight 2
   }
   
   vrrp_instance haproxy-vip {
     state BACKUP
     priority 100
     interface eth0                       # Network card
     virtual_router_id 60
     advert_int 1
     authentication {
       auth_type PASS
       auth_pass 1111
     }
     unicast_src_ip 172.16.0.2      # The IP address of this machine
     unicast_peer {
       172.16.0.3                         # The IP address of peer machines
     }
   
     virtual_ipaddress {
       172.16.0.10/24                  # The VIP address
     }
   
     track_script {
       chk_haproxy
     }
   }
   ```

   {{< notice note >}} 

   - 对于 `interface` 字段，您必须提供自己的网卡信息。您可以在机器上运行 `ifconfig` 以获取该值。

   - 为 `unicast_src_ip` 提供的 IP 地址是您当前机器的 IP 地址。对于也安装了 HAproxy 和 Keepalived 进行负载均衡的其他机器，必须在字段 `unicast_peer` 中输入其 IP 地址。

     {{</ notice >}} 

3. 保存文件并运行以下命令以重启 Keepalived。

   ```bash
   systemctl restart keepalived
   ```

4. 使 Keepalived 在开机后自动运行：

   ```bash
   systemctl enable keepalived
   ```

5. 确保您在另一台机器 (`lb2`) 上也配置了 Keepalived。

## 验证高可用

在开始创建 Kubernetes 集群之前，请确保已经测试了高可用。

1. 在机器  `lb1` 上，运行以下命令：

   ```bash
   [root@lb1 ~]# ip a s
   1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
       link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
       inet 127.0.0.1/8 scope host lo
          valid_lft forever preferred_lft forever
       inet6 ::1/128 scope host
          valid_lft forever preferred_lft forever
   2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
       link/ether 52:54:9e:27:38:c8 brd ff:ff:ff:ff:ff:ff
       inet 172.16.0.2/24 brd 172.16.0.255 scope global noprefixroute dynamic eth0
          valid_lft 73334sec preferred_lft 73334sec
       inet 172.16.0.10/24 scope global secondary eth0 # The VIP address
          valid_lft forever preferred_lft forever
       inet6 fe80::510e:f96:98b2:af40/64 scope link noprefixroute
          valid_lft forever preferred_lft forever
   ```

2. 如上图所示，虚拟 IP 地址已经成功添加。模拟此节点上的故障：

   ```bash
   systemctl stop haproxy
   ```

3. 再次检查浮动 IP 地址，您可以看到该地址在 `lb1` 上消失了。

   ```bash
   [root@lb1 ~]# ip a s
   1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
       link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
       inet 127.0.0.1/8 scope host lo
          valid_lft forever preferred_lft forever
       inet6 ::1/128 scope host
          valid_lft forever preferred_lft forever
   2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
       link/ether 52:54:9e:27:38:c8 brd ff:ff:ff:ff:ff:ff
       inet 172.16.0.2/24 brd 172.16.0.255 scope global noprefixroute dynamic eth0
          valid_lft 72802sec preferred_lft 72802sec
       inet6 fe80::510e:f96:98b2:af40/64 scope link noprefixroute
          valid_lft forever preferred_lft forever
   ```

4. 理论上讲，若配置成功，该虚拟 IP 会漂移到另一台机器 (`lb2`) 上。在 `lb2` 上运行以下命令，这是预期的输出：

   ```bash
   [root@lb2 ~]# ip a s
   1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
       link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
       inet 127.0.0.1/8 scope host lo
          valid_lft forever preferred_lft forever
       inet6 ::1/128 scope host
          valid_lft forever preferred_lft forever
   2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
       link/ether 52:54:9e:3f:51:ba brd ff:ff:ff:ff:ff:ff
       inet 172.16.0.3/24 brd 172.16.0.255 scope global noprefixroute dynamic eth0
          valid_lft 72690sec preferred_lft 72690sec
       inet 172.16.0.10/24 scope global secondary eth0   # The VIP address
          valid_lft forever preferred_lft forever
       inet6 fe80::f67c:bd4f:d6d5:1d9b/64 scope link noprefixroute
          valid_lft forever preferred_lft forever
   ```

5. 如上所示，高可用已经配置成功。

## 使用 KubeKey 创建 Kubernetes 集群

[KubeKey](https://github.com/kubesphere/kubekey) 是一款用来创建 Kubernetes 集群的工具，高效而便捷。请按照以下步骤下载 KubeKey。

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或者直接使用以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

首先运行以下命令，以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

运行以下命令来下载 KubeKey：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{< notice note >}}

下载 KubeKey 之后，如果您将其转移到访问 Googleapis 受限的新机器上，请务必再次运行 `export KKZONE=cn`，然后继续执行以下步骤。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

通过以上命令，可以下载 KubeKey 的最新版本 (v2.2.2)。您可以更改命令中的版本号来下载特定的版本。

{{</ notice >}} 

使 `kk` 成为可执行文件：

```bash
chmod +x kk
```

使用默认配置创建一个示例配置文件。此处以 Kubernetes v1.22.10 作为示例。

```bash
./kk create config --with-kubesphere v3.3.0 --with-kubernetes v1.22.10
```

{{< notice note >}}

- 安装 KubeSphere 3.3.0 的建议 Kubernetes 版本：v1.19.x、v1.20.x、v1.21.x、v1.22.x 和 v1.23.x（实验性支持）。如果不指定 Kubernetes 版本，KubeKey 将默认安装 Kubernetes v1.23.7。有关受支持的 Kubernetes 版本的更多信息，请参见[支持矩阵](../../../installing-on-linux/introduction/kubekey/#支持矩阵)。

- 如果您没有在本步骤的命令中添加标志 `--with-kubesphere`，那么除非您使用配置文件中的 `addons` 字段进行安装，或者稍后使用 `./kk create cluster` 时再添加该标志，否则 KubeSphere 将不会被部署。
- 如果您添加标志 `--with-kubesphere` 时未指定 KubeSphere 版本，则会安装最新版本的 KubeSphere。

{{</ notice >}}

## 部署 KubeSphere 和 Kubernetes

运行上述命令后，将创建配置文件 `config-sample.yaml`。编辑文件以添加机器信息、配置负载均衡器等。

{{< notice note >}}

如果自定义文件名，那么文件名可能会有所不同。

{{</ notice >}} 

### config-sample.yaml 示例

```yaml
...
spec:
  hosts:
  - {name: master1, address: 172.16.0.4, internalAddress: 172.16.0.4, user: root, password: Testing123}
  - {name: master2, address: 172.16.0.5, internalAddress: 172.16.0.5, user: root, password: Testing123}
  - {name: master3, address: 172.16.0.6, internalAddress: 172.16.0.6, user: root, password: Testing123}
  - {name: worker1, address: 172.16.0.7, internalAddress: 172.16.0.7, user: root, password: Testing123}
  - {name: worker2, address: 172.16.0.8, internalAddress: 172.16.0.8, user: root, password: Testing123}
  - {name: worker3, address: 172.16.0.9, internalAddress: 172.16.0.9, user: root, password: Testing123}
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
    domain: lb.kubesphere.local
    address: 172.16.0.10   # The VIP address
    port: 6443
...
```

{{< notice note >}}

- 请使用您自己的 VIP 地址来替换 `controlPlaneEndpoint.address` 的值。
- 有关更多本配置文件中不同参数的信息，请参见[多节点安装](../../../installing-on-linux/introduction/multioverview/#2-edit-the-configuration-file)。

{{</ notice >}} 

### 开始安装

完成配置之后，可以执行以下命令开始安装：

```bash
./kk create cluster -f config-sample.yaml
```

### 验证安装

1. 运行以下命令以检查安装日志。

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
   ```

2. 看到以下信息时，表明高可用集群已成功创建。

   ```bash
   #####################################################
   ###              Welcome to KubeSphere!           ###
   #####################################################
   
   Console: http://172.16.0.4:30880
   Account: admin
   Password: P@88w0rd
   
   NOTES：
     1. After you log into the console, please check the
        monitoring status of service components in
        the "Cluster Management". If any service is not
        ready, please wait patiently until all components
        are up and running.
     2. Please change the default password after login.
   
   #####################################################
   https://kubesphere.io             2020-xx-xx xx:xx:xx
   #####################################################
   ```
