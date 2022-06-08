---
title: 'Adding Master Nodes to Achieve HA: One of the Best Practices for Using KubeKey'
keywords: Kubernetes, scaling, installer, KubeKey, HA
description: KubeKey allows you to scale a Kubernetes cluster to achieve HA in a flexible way.
tag: 'Kubernetes, KubeKey, scaling, installer, HA'
createTime: '2021-01-21'
author: 'Sherlock'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/KubeKey-lightweight-installer.png'
---

As demonstrated in my [last article](https://kubesphere.io/blogs/scale-kubernetes-cluster-using-kubekey/), you can use KubeKey to easily scale in and out your cluster. As I only had one master node in the example, the cluster did not feature high availability. In this post, I will continue to demonstrate how to scale out your cluster while by adding master nodes this time to achieve high availability.

The steps are listed as follows:

1. Download KubeKey.
2. Use KubeKey to retrieve cluster information with a configuration file created automatically.
3. Add your node and load balancer information in the file and apply the configuration.

## Prepare Hosts

Here is my node information of the existing Kubernetes cluster.

| Host IP    | Host Name | Role         | System                                    |
| ---------- | --------- | ------------ | ----------------------------------------- |
| 172.16.0.2 | master1   | control plane, etcd | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 172.16.0.3 | worker1   | worker       | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 172.16.0.4 | worker2   | worker       | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |

```bash
$ kubectl get nodes
NAME      STATUS   ROLES    AGE     VERSION
master1   Ready    master   2m15s   v1.17.9
worker1   Ready    worker   86s     v1.17.9
worker2   Ready    worker   86s     v1.17.9
```

Here are the nodes that will be added to the cluster to achieve high availability. Note that the number of your etcd nodes in total must be **odd**.

| Host IP    | Host Name | Role         | System                                    |
| ---------- | --------- | ------------ | ----------------------------------------- |
| 172.16.0.5 | master2   | master, etcd | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 172.16.0.6 | master3   | master, etcd | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 172.16.0.7 | worker3   | worker       | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |

![node-info](https://ap3.qingstor.com/kubesphere-website/docs/ha-architecture-node-info.jpg)

For more information about requirements for nodes, network, and dependencies, [see this article](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/#node-requirements).

## Prepare Load Balancers

You can use any cloud load balancers or hardware load balancers (e.g. F5). In addition, Keepalived and [HAproxy](https://www.haproxy.com/), or Nginx is also an alternative for creating high-availability clusters. In this example, I have an internal load balancer with a listener that listens on port `6443` (`api-server`) and an external load balancer with a listener that listens on the port of the Kubernetes dashboard.

## Download KubeKey

1. Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command to download KubeKey version 1.0.1. You only need to download KubeKey to one of your machines that serves as the **taskbox** for scaling.

   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v2.0.0 sh -
   ```

2. The above command downloads KubeKey and unzips the file. Your folder now contains a file called `kk`. Make it executable:

   ```bash
   chmod +x kk
   ```


## Add Master Nodes

1. Create a configuration file using KubeKey. If your cluster is installed through KubeKey, you may still have that configuration file on your machine. In this case, you can edit it directly. Otherwise, execute the following command to retrieve your cluster information.

   ```bash
   ./kk create config --from-cluster
   ```

2. The above command creates a configuration file, which is `sample.yaml` by default. Open the file and you can see some fields are pre-populated with values. Add the information of new nodes and your load balancer to the file. 

   ```bash
   vi sample.yaml
   ```

   This is my configuration for your reference:

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
       master:
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
       version: v1.17.9
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

   {{< notice note >}}

   - You are not allowed to modify the host name of existing nodes (e.g. `master1`) when adding new nodes.
   - For more information about different parameters in the configuration file, see [this article](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/#install-kubernetes).

   {{</ notice >}} 

3. Pay attention to the `controlPlaneEndpoint` field in the above example.

   ```yaml
     controlPlaneEndpoint:
       # If loadbalancer is used, 'address' should be set to loadbalancer's ip.
       domain: lb.kubesphere.local
       address: 172.16.0.253
       port: 6443
   ```

   - The domain name of the load balancer is `lb.kubesphere.local` by default for internal access. You can change it based on your needs.
   - In most cases, you need to provide the **private IP address** of the load balancer for the field `address`. However, different cloud providers may have different configurations for load balancers. For example, if you configure a Server Load Balancer (SLB) on Alibaba Cloud, the platform assigns a public IP address to the SLB, which means you need to specify the public IP address for the field `address`.
   - The field `port` indicates the port of `api-server`.

4. Save the file and execute the following command to apply the configuration:

   ```bash
   ./kk add nodes -f sample.yaml
   ```

5. You can see the output as below when scaling finishes.

   ```bash
   Congratulations! Scaling cluster is successful.
   ```

6. Execute the following command to check the status of namespaces.

   ```bash
   kubectl get pod --all-namespaces
   ```

   ```bash
   NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
   kube-system   calico-kube-controllers-59d85c5c84-tnk8s   1/1     Running   0          36m
   kube-system   calico-node-87gtw                          1/1     Running   0          75s
   kube-system   calico-node-8dj8n                          1/1     Running   0          76s
   kube-system   calico-node-k2bjr                          1/1     Running   0          35m
   kube-system   calico-node-lpl78                          1/1     Running   0          36m
   kube-system   calico-node-scfld                          1/1     Running   0          75s
   kube-system   calico-node-t27vn                          1/1     Running   0          35m
   kube-system   coredns-74d59cc5c6-87qkr                   1/1     Running   0          36m
   kube-system   coredns-74d59cc5c6-qm7kb                   1/1     Running   0          36m
   kube-system   kube-apiserver-master1                     1/1     Running   0          36m
   kube-system   kube-apiserver-master2                     1/1     Running   0          73s
   kube-system   kube-apiserver-master3                     1/1     Running   0          74s
   kube-system   kube-controller-manager-master1            1/1     Running   0          36m
   kube-system   kube-controller-manager-master2            1/1     Running   0          74s
   kube-system   kube-controller-manager-master3            1/1     Running   0          74s
   kube-system   kube-proxy-48h9q                           1/1     Running   0          35m
   kube-system   kube-proxy-72cv7                           1/1     Running   0          76s
   kube-system   kube-proxy-gjzk2                           1/1     Running   0          36m
   kube-system   kube-proxy-nkkv8                           1/1     Running   0          75s
   kube-system   kube-proxy-swh67                           1/1     Running   0          35m
   kube-system   kube-proxy-xn7g9                           1/1     Running   0          75s
   kube-system   kube-scheduler-master1                     1/1     Running   0          36m
   kube-system   kube-scheduler-master2                     1/1     Running   0          73s
   kube-system   kube-scheduler-master3                     1/1     Running   0          74s
   kube-system   nodelocaldns-47bgw                         1/1     Running   0          35m
   kube-system   nodelocaldns-4bp5b                         1/1     Running   0          75s
   kube-system   nodelocaldns-5f9g8                         1/1     Running   0          36m
   kube-system   nodelocaldns-h4xzk                         1/1     Running   0          35m
   kube-system   nodelocaldns-jz86j                         1/1     Running   0          75s
   kube-system   nodelocaldns-xcjt6                         1/1     Running   0          76s
   ```

7. Execute the following command to check your nodes.

   ```bash
   kubectl get nodes
   ```

   ```bash
   NAME      STATUS   ROLES    AGE     VERSION
   master1   Ready    master   37m     v1.17.9
   master2   Ready    master   2m17s   v1.17.9
   master3   Ready    master   2m17s   v1.17.9
   worker1   Ready    worker   36m     v1.17.9
   worker2   Ready    worker   36m     v1.17.9
   worker3   Ready    worker   2m18s   v1.17.9
   ```

   As you can see above, all the nodes are up and running.

## Summary

The steps of adding more master nodes so that your cluster is highly available is basically the same as demonstrated in my [last post](https://kubesphere.io/blogs/scale-kubernetes-cluster-using-kubekey/). The major difference is that you must configure your load balancer correctly.

## Reference

[KubeKey](https://github.com/kubesphere/kubekey)

[Multi-node Installation](https://kubesphere.io/docs/installing-on-linux/introduction/multioverview/)

[KubeKey: A Lightweight Installer for Kubernetes and Cloud Native Addons](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/)

[Scaling a Kubernetes Cluster: One of the Best Practices for Using KubeKey](https://kubesphere.io/blogs/scale-kubernetes-cluster-using-kubekey/)