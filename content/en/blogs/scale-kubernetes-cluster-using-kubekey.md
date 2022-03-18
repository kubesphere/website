---
title: 'Scaling a Kubernetes Cluster: One of the Best Practices for Using KubeKey'
keywords: Kubernetes, scaling, installer, KubeKey
description: KubeKey allows you to scale a Kubernetes cluster in a flexible way.
tag: 'Kubernetes, KubeKey, scaling, installer'
createTime: '2021-01-14'
author: 'Sherlock'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/KubeKey-lightweight-installer.png'
---

In my [last post](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/), I demonstrated how to set up a three-node Kubernetes cluster using [KubeKey](https://github.com/kubesphere/kubekey). As I mentioned in the article, KubeKey is a lightweight, powerful installer that is able to install Kubernetes as well as its related add-ons in a quick and convenient way. In fact, KubeKey can do way more than that as it is also an efficient tool to scale your Kubernetes cluster.

On some cloud platforms, you can directly scale your cluster by increasing or decreasing the number of nodes. Usually, this does not entail complex operations as these platforms will do almost everything for you and you only need to click a few buttons. However, in some on-premises environments, you may need to manually change the number of nodes. In this article, I am going to demonstrate how to scale out and scale in your cluster using KubeKey. The steps are listed as follows:

1. Download KubeKey.
2. Use KubeKey to retrieve cluster information with a configuration file created automatically.
3. Verify cluster information and apply the configuration to scale out the cluster.
4. Scale in the cluster.

## Prepare Hosts

Here is my node information of the existing Kubernetes cluster.

| Host IP     | Host Name | Role         | System                                    |
| ----------- | --------- | ------------ | ----------------------------------------- |
| 192.168.0.2 | master    | master, etcd | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 192.168.0.3 | worker1   | worker       | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 192.168.0.4 | worker2   | worker       | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |

```bash
$ kubectl get nodes
NAME      STATUS   ROLES    AGE     VERSION
master    Ready    master   9m50s   v1.17.9
worker1   Ready    worker   9m19s   v1.17.9
worker2   Ready    worker   9m20s   v1.17.9
```

Here is the node that will be added to the cluster first and then removed from the cluster.

| Host IP     | Host Name | Role   | System                                    |
| ----------- | --------- | ------ | ----------------------------------------- |
| 192.168.0.5 | worker3   | worker | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |

For more information about requirements for nodes, network, and dependencies, [see my last post](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/#node-requirements).

## Download KubeKey

1. Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command to download KubeKey version 1.0.1. You only need to download KubeKey to one of your machines that serves as the **taskbox** for scaling, such as the master node.

   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v2.0.0 sh -
   ```

   {{< notice note >}}

   You can change the version number in the command to download a specific version.

   {{</ notice >}}

2. The above command downloads KubeKey and unzips the file. Your folder now contains a file called `kk`. Make it executable:

   ```bash
   chmod +x kk
   ```


## Scale out the Cluster

1. Now that I have KubeKey ready, I need to create a configuration file that contains the information of all nodes, which is the same as setting up a Kubernetes cluster through KubeKey. If your cluster is installed through KubeKey, you may still have that configuration file on your machine. In this case, you can edit it directly. Otherwise, execute the following command to retrieve your cluster information.

   ```
   ./kk create config --from-cluster
   ```

    The flag `--from-cluster` is used to get the existing cluster's information.

2. The above command creates a configuration file, which is `sample.yaml` by default. Open the file and you can see some fields are pre-populated with values. Add the information of the new node and verify if other fields are set correctly.

   ```bash
   vi sample.yaml
   ```

   ```bash
   apiVersion: kubekey.kubesphere.io/v1alpha1
   kind: Cluster
   metadata:
     name: sample
   spec:
     hosts:
     # You should complete the ssh information of the hosts
     - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: root, password: Testing123}
     - {name: worker1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: Testing123}
     - {name: worker2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Testing123}
     - {name: worker3, address: 192.168.0.5, internalAddress: 192.168.0.5, user: root, password: Testing123}
     roleGroups:
       etcd:
       - master
       master:
       - master
       worker:
       - worker1
       - worker2
       - worker3
     controlPlaneEndpoint:
       # If loadbalancer was used, 'address' should be set to loadbalancer's ip.
       domain: lb.kubesphere.local
       address: ""
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

   - You are not allowed to modify the host name of existing nodes (e.g. master) when adding new nodes.

   - For more information about different parameters in the configuration file, see my [last article](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/#install-kubernetes).

   {{</ notice >}} 

3. Save the file and execute the following command to apply the configuration:

   ```bash
   ./kk add nodes -f sample.yaml
   ```

4. You can see the output as below when scaling finishes.

   ```bash
   Congratulations! Scaling cluster is successful.
   ```

5. Execute the following command to check the status of namespaces.

   ```bash
   kubectl get pod --all-namespaces
   ```

   ```bash
   NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
   kube-system   calico-kube-controllers-59d85c5c84-48dbg   1/1     Running   0          50m
   kube-system   calico-node-8f9tr                          1/1     Running   0          50m
   kube-system   calico-node-ttl4c                          1/1     Running   0          3m56s
   kube-system   calico-node-wkfld                          1/1     Running   0          50m
   kube-system   calico-node-x9ks2                          1/1     Running   0          50m
   kube-system   coredns-74d59cc5c6-6jszk                   1/1     Running   0          50m
   kube-system   coredns-74d59cc5c6-mzcxp                   1/1     Running   0          50m
   kube-system   kube-apiserver-master                      1/1     Running   0          50m
   kube-system   kube-controller-manager-master             1/1     Running   0          50m
   kube-system   kube-proxy-fw5cf                           1/1     Running   0          50m
   kube-system   kube-proxy-qrv5p                           1/1     Running   0          50m
   kube-system   kube-proxy-r82sh                           1/1     Running   0          3m56s
   kube-system   kube-proxy-v4rnf                           1/1     Running   0          50m
   kube-system   kube-scheduler-master                      1/1     Running   0          50m
   kube-system   nodelocaldns-4wfsv                         1/1     Running   0          3m56s
   kube-system   nodelocaldns-fbsbl                         1/1     Running   0          50m
   kube-system   nodelocaldns-mzpvt                         1/1     Running   0          50m
   kube-system   nodelocaldns-zj5jz                         1/1     Running   0          50m
   ```

6. Execute the following command to check your nodes.

   ```bash
   kubectl get nodes
   ```

   ```bash
   NAME      STATUS   ROLES    AGE     VERSION
   master    Ready    master   52m     v1.17.9
   worker1   Ready    worker   51m     v1.17.9
   worker2   Ready    worker   51m     v1.17.9
   worker3   Ready    worker   5m12s   v1.17.9
   ```

   As you can see above, all the nodes are up and running.

## Scale in the Cluster

1. To delete a node, you also need to prepare a configuration file in advance. If you jump to this step directly, or you have not downloaded KubeKey, refer to the above content to download KubeKey and retrieve your cluster information. After that, edit the configuration file.

   ```bash
   vi sample.yaml
   ```

2. Double check if all the fields are set correctly, make changes if necessary, and save the file.

   ```yaml
   apiVersion: kubekey.kubesphere.io/v1alpha1
   kind: Cluster
   metadata:
     name: sample
   spec:
     hosts:
     # You should complete the ssh information of the hosts
     - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: root, password: Testing123}
     - {name: worker1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: Testing123}
     - {name: worker2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Testing123}
     - {name: worker3, address: 192.168.0.5, internalAddress: 192.168.0.5, user: root, password: Testing123}
     roleGroups:
       etcd:
       - master
       master:
       - master
       worker:
       - worker1
       - worker2
       - worker3
     controlPlaneEndpoint:
       # If loadbalancer was used, 'address' should be set to loadbalancer's ip.
       domain: lb.kubesphere.local
       address: ""
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

3. Execute the following command to scale in your cluster (`worker3` is removed in this example).

   ```bash
   ./kk delete node <nodeName> -f sample.yaml
   ```

   {{< notice note >}}

   Replace `<nodeName>` with your own node name.

   {{</ notice >}}

4. Execute the following command to verify the result.

   ```bash
   kubectl get nodes
   ```

   ```bash
   NAME      STATUS   ROLES    AGE    VERSION
   master    Ready    master   3h7m   v1.17.9
   worker1   Ready    worker   3h6m   v1.17.9
   worker2   Ready    worker   3h7m   v1.17.9
   ```

5. You can see that the node (`worker3`) has been successfully removed.

## Summary

Adding and deleting nodes remains an important part of cluster maintenance. In reality, you need to adjust the number of nodes based on the actual workloads running on your cluster for optimal resource utilization. KubeKey, fortunately, turns out to be one of the most efficient tools for in this regard.

## Reference

[KubeKey](https://github.com/kubesphere/kubekey)

[Multi-node Installation](https://kubesphere.io/docs/installing-on-linux/introduction/multioverview/)

[KubeKey: A Lightweight Installer for Kubernetes and Cloud Native Addons](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/)
