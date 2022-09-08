---
title: "Set up an HA Kubernetes Cluster Using Keepalived and HAproxy"
keywords: 'Kubernetes, KubeSphere, HA, high availability, installation, configuration, Keepalived, HAproxy'
description: 'Learn how to create a highly available cluster using Keepalived and HAproxy.'
linkTitle: "Set up an HA Cluster Using Keepalived and HAproxy"
weight: 3230
showSubscribe: true
---

A highly available Kubernetes cluster ensures your applications run without outages which is required for production. In this connection, there are plenty of ways for you to choose from to achieve high availability.

This tutorial demonstrates how to configure Keepalived and HAproxy for load balancing and achieve high availability. The steps are listed as below:

1. Prepare hosts.
2. Configure Keepalived and HAproxy.
3. Use KubeKey to set up a Kubernetes cluster and install KubeSphere.

## Cluster Architecture

The example cluster has three master nodes, three worker nodes, two nodes for load balancing and one virtual IP address. The virtual IP address in this example may also be called "a floating IP address". That means in the event of node failures, the IP address can be passed between nodes allowing for failover, thus achieving high availability.

![architecture-ha-k8s-cluster](/images/docs/v3.3/installing-on-linux/high-availability-configurations/set-up-ha-cluster-using-keepalived-haproxy/architecture-ha-k8s-cluster.png)

Notice that in this example, Keepalived and HAproxy are not installed on any of the master nodes. Admittedly, you can do that and high availability can also be achieved. That said, configuring two specific nodes for load balancing (You can add more nodes of this kind as needed) is more secure. Only Keepalived and HAproxy will be installed on these two nodes, avoiding any potential conflicts with any Kubernetes components and services.

## Prepare Hosts

| IP Address  | Hostname | Role                 |
| ----------- | -------- | -------------------- |
| 172.16.0.2  | lb1      | Keepalived & HAproxy |
| 172.16.0.3  | lb2      | Keepalived & HAproxy |
| 172.16.0.4  | master1  | master, etcd         |
| 172.16.0.5  | master2  | master, etcd         |
| 172.16.0.6  | master3  | master, etcd         |
| 172.16.0.7  | worker1  | worker               |
| 172.16.0.8  | worker2  | worker               |
| 172.16.0.9  | worker3  | worker               |
| 172.16.0.10 |          | Virtual IP address   |

For more information about requirements for nodes, network, and dependencies, see [Multi-node Installation](../../../installing-on-linux/introduction/multioverview/#step-1-prepare-linux-hosts).

## Configure Load Balancing

[Keepalived](https://www.keepalived.org/) provides a VRPP implementation and allows you to configure Linux machines for load balancing, preventing single points of failure. [HAProxy](https://www.haproxy.org/), providing reliable, high performance load balancing, works perfectly with Keepalived.

As Keepalived and HAproxy are installed on `lb1` and `lb2`, if either one goes down, the virtual IP address (i.e. the floating IP address) will be automatically associated with another node so that the cluster is still functioning well, thus achieving high availability. If you want, you can add more nodes all with Keepalived and HAproxy installed for that purpose.

Run the following command to install Keepalived and HAproxy first.

```bash
yum install keepalived haproxy psmisc -y
```

### HAproxy Configuration

1. The configuration of HAproxy is exactly the same on the two machines for load balancing. Run the following command to configure HAproxy.

   ```bash
   vi /etc/haproxy/haproxy.cfg
   ```

2. Here is an example configuration for your reference (Pay attention to the `server` field. Note that `6443` is the `apiserver` port):

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

3. Save the file and run the following command to restart HAproxy.

   ```bash
   systemctl restart haproxy
   ```

4. Make it persist through reboots:

   ```bash
   systemctl enable haproxy
   ```

5. Make sure you configure HAproxy on the other machine (`lb2`) as well.

### Keepalived Configuration

Keepalived must be installed on both machines while the configuration of them is slightly different.

1. Run the following command to configure Keepalived.

   ```bash
   vi /etc/keepalived/keepalived.conf
   ```

2. Here is an example configuration (`lb1`) for your reference:

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

   - For the `interface` field, you must provide your own network card information. You can run `ifconfig` on your machine to get the value.

   - The IP address provided for `unicast_src_ip` is the IP address of your current machine. For other machines where HAproxy and Keepalived are also installed for load balancing, their IP address must be provided for the field `unicast_peer`.

     {{</ notice >}} 

3. Save the file and run the following command to restart Keepalived.

   ```bash
   systemctl restart keepalived
   ```

4. Make it persist through reboots:

   ```bash
   systemctl enable keepalived
   ```

5. Make sure you configure Keepalived on the other machine (`lb2`) as well.

## Verify High Availability

Before you start to create your Kubernetes cluster, make sure you have tested the high availability. 

1. On the machine `lb1`, run the following command:

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

2. As you can see above, the virtual IP address is successfully added. Simulate a failure on this node:

   ```bash
   systemctl stop haproxy
   ```

3. Check the floating IP address again and you can see it disappear on `lb1`.

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

4. Theoretically, the virtual IP will be failed over to the other machine (`lb2`) if the configuration is successful. On `lb2`, run the following command and here is the expected output:

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

5. As you can see above, high availability is successfully configured.

## Use KubeKey to Create a Kubernetes Cluster

[KubeKey](https://github.com/kubesphere/kubekey) is an efficient and convenient tool to create a Kubernetes cluster. Follow the steps below to download KubeKey.

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v2.2.2) of KubeKey. You can change the version number in the command to download a specific version.

{{</ notice >}} 

Make `kk` executable:

```bash
chmod +x kk
```

Create an example configuration file with default configurations. Here Kubernetes v1.22.10 is used as an example.

```bash
./kk create config --with-kubesphere v3.3.0 --with-kubernetes v1.22.10
```

{{< notice note >}}

- Recommended Kubernetes versions for KubeSphere 3.3.0: v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support). If you do not specify a Kubernetes version, KubeKey will install Kubernetes v1.23.7 by default. For more information about supported Kubernetes versions, see [Support Matrix](../../../installing-on-linux/introduction/kubekey/#support-matrix).

- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.
- If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.

{{</ notice >}}

## Deploy KubeSphere and Kubernetes

After you run the commands above, a configuration file `config-sample.yaml` will be created. Edit the file to add machine information, configure the load balancer and more.

{{< notice note >}}

The file name may be different if you customize it.

{{</ notice >}} 

### config-sample.yaml example

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

- Replace the value of `controlPlaneEndpoint.address` with your own VIP address.
- For more information about different parameters in this configuration file, see [Multi-node Installation](../../../installing-on-linux/introduction/multioverview/#2-edit-the-configuration-file).

{{</ notice >}} 

### Start installation

After you complete the configuration, you can execute the following command to start the installation:

```bash
./kk create cluster -f config-sample.yaml
```

### Verify installation

1. Run the following command to inspect the logs of installation.

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
   ```

2. When you see the following message, it means your HA cluster is successfully created.

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
