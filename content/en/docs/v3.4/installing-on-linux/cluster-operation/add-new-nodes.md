---
title: "Add New Nodes to a Kubernetes Cluster"
keywords: 'Kubernetes, KubeSphere, scale-out, add-nodes'
description: 'Add more nodes to scale out your cluster.'
linkTitle: "Add New Nodes"
weight: 3610
version: "v3.4"
---

After you use KubeSphere for a certain period of time, it is likely that you need to scale out your cluster with an increasing number of workloads. From KubeSphere v3.0.0, you can use the brand-new installer [KubeKey](https://github.com/kubesphere/kubekey) to add new nodes to a Kubernetes cluster. Fundamentally, the operation is based on Kubelet's registration mechanism. In other words, the new nodes will automatically join the existing Kubernetes cluster. KubeSphere supports hybrid environments, which means the newly-added host OS can be CentOS or Ubuntu.

This tutorial demonstrates how to add new nodes to a single-node cluster. To scale out a multi-node cluster, the steps are basically the same.

## Prerequisites

- You need to have a single-node cluster. For more information, see [All-in-One Installation on Linux](../../../quick-start/all-in-one-on-linux/).

- You have [downloaded KubeKey](../../../installing-on-linux/introduction/multioverview/#step-2-download-kubekey).

## Add Worker Nodes to Kubernetes

1. Retrieve your cluster information using KubeKey. The command below creates a configuration file (`sample.yaml`).

   ```bash
   ./kk create config --from-cluster
   ```
   
   {{< notice note >}}
   

You can skip this step if you already have the configuration file on your machine. For example, if you want to add nodes to a multi-node cluster which was set up by KubeKey, you might still have the configuration file if you have not deleted it.

{{</ notice >}} 

2. In the configuration file, put the information of your new nodes under `hosts` and `roleGroups`. The example adds two new nodes (i.e. `node1` and `node2`). Here `master1` is the existing node.

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
   
- For more information about the configuration file, see [Edit the configuration file](../../../installing-on-linux/introduction/multioverview/#2-edit-the-configuration-file).
- You are not allowed to modify the host name of existing nodes when adding new nodes.
- Replace the host name in the example with your own.
  
   {{</ notice >}}
3. Execute the following command:

   ```bash
   ./kk add nodes -f sample.yaml
   ```

4. You will be able to see the new nodes and their information on the KubeSphere console when the installation finishes. On the **Cluster Management** page, select **Cluster Nodes** under **Nodes** from the left menu, or execute the command `kubectl get node` to check the changes.

   ```bash
   $ kubectl get node
   NAME          STATUS   ROLES           AGE   VERSION
   master1       Ready    master,worker   20d   v1.17.9
   node1         Ready    worker          31h   v1.17.9
   node2         Ready    worker          31h   v1.17.9
   ```

## Add New Master Nodes for High Availability

The steps of adding master nodes are generally the same as adding worker nodes while you need to configure a load balancer for your cluster. You can use any cloud load balancers or hardware load balancers (for example, F5). In addition, Keepalived and [HAproxy](https://www.haproxy.com/), or Nginx is also an alternative for creating highly available clusters.

1. Create a configuration file using KubeKey.

   ```
   ./kk create config --from-cluster
   ```

2. Open the file and you can see some fields are pre-populated with values. Add the information of new nodes and your load balancer to the file. Here is an example for your reference:

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

3. Pay attention to the `controlPlaneEndpoint` field.

   ```yaml
     controlPlaneEndpoint:
       # If you use a load balancer, the address should be set to the load balancer's ip.
       domain: lb.kubesphere.local
       address: 172.16.0.253
       port: 6443
   ```

   - The domain name of the load balancer is `lb.kubesphere.local` by default for internal access. You can change it based on your needs.
   - In most cases, you need to provide the **private IP address** of the load balancer for the field `address`. However, different cloud providers may have different configurations for load balancers. For example, if you configure a Server Load Balancer (SLB) on Alibaba Cloud, the platform assigns a public IP address to the SLB, which means you need to specify the public IP address for the field `address`.
   - The field `port` indicates the port of `api-server`.

4. Save the file and execute the following command to apply the configuration.

   ```bash
   ./kk add nodes -f sample.yaml
   ```

