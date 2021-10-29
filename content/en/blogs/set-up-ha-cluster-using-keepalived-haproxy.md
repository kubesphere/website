---
title: 'Create a Highly Available Kubernetes Cluster Using Keepalived and HAproxy'
keywords: Kubernetes, Keepalived, HAproxy, KubeKey, HA
description: Use Keepalived and HAproxy to create an HA cluster.
tag: 'Kubernetes, KubeKey, installation, installer, HA'
createTime: '2021-01-27'
author: 'Pixiake, Sherlock'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/architecture-ha-k8s-cluster.png'
---

A highly available Kubernetes cluster ensures your applications run without outages which is required for production. In this connection, there are plenty of ways for you to choose from to achieve high availability. For example, if your cluster is deployed on cloud (e.g. Google Cloud and AWS), you can create load balancers on these platforms directly. At the same time, Keepalived, HAproxy and NGINX are also possible alternatives for you to achieve load balancing.

In this article, I am going to use Keepalived and HAproxy for load balancing and achieve high availability. The steps are listed as below:

1. Prepare hosts.
2. Configure Keepalived and HAproxy.
3. Use KubeKey to set up a Kubernetes cluster.

## Cluster Architecture

In my cluster, I will set three master nodes, three worker nodes, two nodes for load balancing and one virtual IP address. The virtual IP address in this example may also be called "a floating IP address". That means in the event of node failures, the IP address can be passed between nodes allowing for failover, thus achieving high availability.

![architecture](https://ap3.qingstor.com/kubesphere-website/docs/architecture-ha-k8s-cluster.png)

Notice that in my cluster, I am not going to install Keepalived and HAproxy on any of the master nodes. Admittedly, you can do that and high availability can also be achieved. That said, I would like to try a different way by configuring two specific nodes for load balancing (You can add more nodes of this kind as needed). Only Keepalived and HAproxy will be installed on these two nodes, avoiding any potential conflicts with any Kubernetes components and services.

## Host Information

Here is the detailed information of each node in my cluster for your reference:

| IP Address  | Host Name | Role                 | System                                     |
| ----------- | --------- | -------------------- | ------------------------------------------ |
| 172.16.0.2  | lb1       | Keepalived & HAproxy | CentOS 7.5, 4 Cores, 4 G Memory, 20 G Disk |
| 172.16.0.3  | lb2       | Keepalived & HAproxy | CentOS 7.5, 4 Cores, 4 G Memory, 20 G Disk |
| 172.16.0.4  | master1   | master, etcd         | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 172.16.0.5  | master2   | master, etcd         | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 172.16.0.6  | master3   | master, etcd         | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 172.16.0.7  | worker1   | worker               | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 172.16.0.8  | worker2   | worker               | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 172.16.0.9  | worker3   | worker               | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 172.16.0.10 |           | Virtual IP address   |                                            |

For more information about requirements for nodes, network, and dependencies, [see one of my previous posts](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/#node-requirements).

## Configure Load Balancing

[Keepalived](https://www.keepalived.org/) provides a VRPP implementation and allows you to configure Linux machines for load balancing, preventing single points of failure. [HAProxy](http://www.haproxy.org/), providing reliable, high performance load balancing, works perfectly with Keepalived.

As I said above, I will install both Keepalived and HAproxy on `lb1` and `lb2`. The logic is very simple: if one of the node goes down, the virtual IP address (i.e. the floating IP address) will be automatically associated with another node so that the cluster is still functioning well, thus achieving high availability. If you want, you can add more nodes all with Keepalived and HAproxy installed for that purpose. 

Run the following command to install Keepalived and HAproxy first.

```bash
yum install keepalived haproxy psmisc -y
```

### HAproxy

1. The configuration of HAproxy is exactly the same on the two machines for load balancing. Run the following command to configure HAproxy.

   ```bash
   vi /etc/haproxy/haproxy.cfg
   ```

2. Here is my configuration for your reference (Pay attention to the `server` field. Note that `6443` is the `apiserver` port):

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

### Keepalived

Keepalived must be installed on both machines while the configuration of them is slightly different.

1. Run the following command to configure Keepalived.

   ```bash
   vi /etc/keepalived/keepalived.conf
   ```

2. Here is my configuration (`lb1`) for your reference:

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

   - The IP address provided for `unicast_src_ip` is the IP address of your current machine. For other machines where HAproxy and Keepalived are also installed for load balancing, their IP address must be input for the field `unicast_peer`.

     {{</ notice >}} 

3. Save the file and run the following command to restart Keepalived.

   ```bash
   systemctl restart keepalived
   ```

4. Make it persist through reboots:

   ```bash
   systemctl enable haproxy
   ```

5. Make sure you configure Keepalived on the other machine (`lb2`) as well.

## Verify HA

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

[KubeKey](https://github.com/kubesphere/kubekey) is an efficient and convenient tool to create a Kubernetes cluster. If you are not familiar with KubeKey, have a look at my previous articles about using KubeKey to [create a three-node cluster](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/) and scale your cluster.

1. Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command to download KubeKey version 1.0.1. You only need to download KubeKey to one of your machines (e.g. `master1`) that serves as the **taskbox** for installation.

   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
   ```

2. The above command downloads KubeKey and unzips the file. Your folder now contains a file called `kk`. Make it executable:

   ```bash
   chmod +x kk
   ```

3. Create a configuration file to specify cluster information. The Kubernetes version I am going to install is `v1.17.9`.

   ```bash
   ./kk create config --with-kubernetes v1.20.4
   ```

4. A default file `config-sample.yaml` will be created. Edit the file and here is my configuration for your reference:

   ```yaml
   apiVersion: kubekey.kubesphere.io/v1alpha1
   kind: Cluster
   metadata:
     name: sample
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
       master:
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
     kubernetes:
       version: v1.17.9
       imageRepo: kubesphere
       clusterName: cluster.local
     network:
       plugin: calico
       kubePodsCIDR: 10.233.64.0/18
       kubeServiceCIDR: 10.233.0.0/18
     registry:
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```

   {{< notice note >}}

   - Replace the value of `controlPlaneEndpoint.address` with your own VIP address.
   - For more information about different parameters in this configuration file, see [one of my previous blogs](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/#install-kubernetes).

   {{</ notice >}} 

5. Save the file and execute the following command to create your cluster:

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

6. You can see the output as below when the installation finishes.

   ```bash
   Congratulations! Installation is successful.
   ```

7. Execute the following command to check the status of namespaces.

   ```bash
   kubectl get pod --all-namespaces
   ```

   ```bash
   NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
   kube-system   calico-kube-controllers-59d85c5c84-l7zp5   1/1     Running   0          42s
   kube-system   calico-node-5d6gb                          1/1     Running   0          21s
   kube-system   calico-node-77bcj                          1/1     Running   0          42s
   kube-system   calico-node-bdzfp                          1/1     Running   0          21s
   kube-system   calico-node-ph756                          1/1     Running   0          22s
   kube-system   calico-node-phz7d                          1/1     Running   0          22s
   kube-system   calico-node-v7wnf                          1/1     Running   0          22s
   kube-system   coredns-74d59cc5c6-gdkmz                   1/1     Running   0          53s
   kube-system   coredns-74d59cc5c6-j2lhc                   1/1     Running   0          53s
   kube-system   kube-apiserver-master1                     1/1     Running   0          48s
   kube-system   kube-apiserver-master2                     1/1     Running   0          19s
   kube-system   kube-apiserver-master3                     1/1     Running   0          19s
   kube-system   kube-controller-manager-master1            1/1     Running   0          48s
   kube-system   kube-controller-manager-master2            1/1     Running   0          19s
   kube-system   kube-controller-manager-master3            1/1     Running   0          19s
   kube-system   kube-proxy-29sfc                           1/1     Running   0          21s
   kube-system   kube-proxy-drzsc                           1/1     Running   0          22s
   kube-system   kube-proxy-lgwhd                           1/1     Running   0          22s
   kube-system   kube-proxy-npq6t                           1/1     Running   0          21s
   kube-system   kube-proxy-srlwx                           1/1     Running   0          22s
   kube-system   kube-proxy-vdtbk                           1/1     Running   0          53s
   kube-system   kube-scheduler-master1                     1/1     Running   0          48s
   kube-system   kube-scheduler-master2                     1/1     Running   0          19s
   kube-system   kube-scheduler-master3                     1/1     Running   0          20s
   kube-system   nodelocaldns-2chnt                         1/1     Running   0          22s
   kube-system   nodelocaldns-2wszl                         1/1     Running   0          22s
   kube-system   nodelocaldns-2xqlc                         1/1     Running   0          21s
   kube-system   nodelocaldns-92ksq                         1/1     Running   0          53s
   kube-system   nodelocaldns-cktmd                         1/1     Running   0          22s
   kube-system   nodelocaldns-skmlq                         1/1     Running   0          21s
   ```

## Summary

Creating a highly available Kubernetes cluster is not just about business applications running without downtime. It is also about selecting the correct tools and using them to set up the cluster with high availability in the most graceful and efficient way. Why not try Keepalived, HAproxy and KubeKey? Perhaps they will give you the answer you have been seeking for so long. 

## Reference

[KubeKey: A Lightweight Installer for Kubernetes and Cloud Native Addons](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/)

[KubeKey GitHub Repository](https://github.com/kubesphere/kubekey)