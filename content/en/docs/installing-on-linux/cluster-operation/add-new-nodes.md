---
title: "Add New Nodes"
keywords: 'kubernetes, kubesphere, scale, add-nodes'
description: 'How to add new nodes in an existing cluster'


weight: 2340
---

When you use KubeSphere for a certain time, most likely you need to scale out your cluster with workloads increasing. In this scenario, KubeSphere provides script to add new nodes to the cluster. Fundamentally the operation is based on Kubelet's registration mechanism, i.e., the new nodes will automatically join the existing Kubernetes cluster.

{{< notice tip >}}
From v3.0.0, the brand-new installer [KubeKey](https://github.com/kubesphere/kubekey) supports scale master amd worker node from a sing-node (all-in-one) cluster.
{{</ notice >}}

### Step 1: Modify the Host Configuration

KubeSphere supports hybrid environment, that is, the newly added host OS can be CentOS or Ubuntu. When new machines are ready, add the configurations about the new machine information in the `hosts` and `roleGroups` of the file `config-sample.yaml`.

{{< notice warning >}}
Do not allowed to modify the host name of the original nodes (e.g. master1) when adding new nodes.
{{</ notice >}}

For example, if you started the installation with [all-in-one](../../quick-start/all-in-one-on-linux) and you want to add new nodes for the single-node cluster, you can create a configuration file use KubeKey.

```
# Assume your original Kubernetes cluster is v1.17.9
./kk create config --with-kubesphere --with-kubernetes v1.17.9
```

The following section demonstrates how to add two nodes (i.e. `node1` and `node2`) using `root` user as an example, it assumes your host name of the first machine is `master1` (Replace the following host name with yours).

```yaml
spec:
  hosts:
  - {name: master1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: Qcloud@123}
  - {name: node1, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Qcloud@123}
  - {name: node2, address: 192.168.0.5, internalAddress: 192.168.0.5, user: root, password: Qcloud@123}
  roleGroups:
    etcd:
    - master1
    master:
    - master1
    worker:
    - node1
    - node2
···
```

### Step 2: Execute the Add-node Command

Execute the following command to apply the changes:

```bash
./kk add nodes -f config-sample.yaml
```

Finally, you will be able to see the new nodes and their information on the KubeSphere console after a successful return. Select **Nodes → Cluster Nodes** from the left menu, or using `kubectl get node` command can also see the changes.

```
kubectl get node
NAME          STATUS   ROLES           AGE   VERSION
master1       Ready    master,worker   20d   v1.17.9
node1         Ready    worker          31h   v1.17.9
node2         Ready    worker          31h   v1.17.9
```
