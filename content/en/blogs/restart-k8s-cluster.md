---
title: 'Restart a Kubernetes Cluster in a Practical Way'  
tag: 'Kubernetes, Cluster, Restart'  
keywords: Kubernetes, Cluster, Restart  
description: This article provides a practical way to restart a Kubernetes cluster.   
createTime: '2022-03-17'  
author: 'Felix'  
snapshot: '/images/blogs/en/restart-k8s-cluster/restart-k8s.png'
---

As cloud-native technologies continue to gain momentum, developers are focusing more on transforming conventional applications into cloud-native applications, hoping to take advantage of the flexibility and scalability that cloud-native technologies like Kubernetes offer.

Powerful as Kubernetes is, it could still bring difficulties in practice. For example, it might be a puzzle when it comes to restarting a Kubernetes cluster. In this article, we'll look into how to restart a Kubernetes cluster in a practical way.

## What is a Kubernetes Cluster

A Kubernetes cluster is a combination of nodes that run containerized applications. These nodes can be virtual machines if the cluster is deployed in a cloud environment, or physical machines if the cluster is running in an on-premises environment. A Kubernetes cluster includes at least one control plane and a number of worker nodes. The control plane exposes the Kubernetes API so that the worker nodes can communicate with the control plane.

As the control plane oversees the state of a Kubernetes cluster, worker nodes handles tasks assigned by it to actually run containerized applications in pods. Moreover, the pods are not tied to any specific worker nodes. Kubernetes can schedule them around the cluster according to the declarative YAML manifests to improve stability and efficiency. To learn more about the concept of Kubernetes cluster, see [Cluster Architecture](https://kubernetes.io/docs/concepts/architecture/).

## Restart a Kubernetes Cluster

You have to make sure that you at least finish the backup for ectd before restarting your cluster, which would prevent you from the loss of critical data. Next, let's go into details about the process of restarting a Kubernetes cluster.

### Shut down worker nodes

1. Connect to a worker node through SSH.

2. Run the following commands to stop pod scheduling and drain existing pods on the node.

   ```
   kubectl cordon <worker node name>
   kubectl drain <worker node name>
   ```

3. Run the following command to stop kubelet and kube-proxy.

   ```
   sudo docker stop kubelet kube-proxy
   ```

4. Run the following command to stop Docker.

   ```
   sudo systemctl stop docker
   ```

5. Run the following command to shut down the worker node.

   ```
   sudo shutdown now
   ```

6. Perform the same operations on other worker nodes (if any) to shut them down.

### Shut down control planes

1. Connect to a control plane through SSH.

2. Run the following commands to stop pod scheduling and drain existing pods on the node.

   ```
   kubectl cordon <control plane name>
   kubectl drain <control plane name>
   ```

3. Run the following command to stop kubelet and kube-proxy.

   ```
   sudo docker stop kubelet kube-proxy
   ```

4. Run the following command to stop kube-scheduler and kube-controller-manager.

   ```
   sudo docker stop kube-scheduler kube-controller-manager
   ```

5. Run the following command to stop kube-apiserver.

   ```
   sudo docker stop kube-apiserver
   ```

6. Run the following command to stop Docker.

   ```
   sudo systemctl stop docker
   ```

7. Run the following command to shut down the control plane.

   ```
   sudo shutdown now
   ```

8. Perform the same operations on other control planes (if any) to shut them down.

### Shut down ectd nodes

1. Connect to an etcd node through SSH.

2. Run the following command to stop kubelet and kube-proxy.

   ```
   sudo docker stop kubelet kube-proxy
   ```

3. Run the following command to stop etcd.

   ```
   sudo docker stop etcd
   ```

4. Run the following command to stop Docker.

   ```
   sudo systemctl stop docker
   ```

5. Run the following command to shut down the ectd node.

   ```
   sudo shutdown now
   ```

6. Perform the same operations on other etcd nodes (if any) to shut them down.

### Shut down storage

When all the worker nodes and control planes are shut down, you can shut down any persistent storage devices (if any).

### Restart the Kubernetes cluster

1. Power on any persistent storage devices (if any).
2. Power on the instances for ectd nodes. You can log in to the etcd nodes and run the command `docker ps` to ensure that ectd is up and running.
3. Power on the instances for control planes. You can log in to the control planes and run the command `docker ps` to ensure that kube-apiserver, kube-controller-manager, and kube-scheduler are up and running.
4. Power on the instances for worker nodes. You can log in to the worker nodes and run the command `docker ps` to ensure that kubelet and kube-proxy are up and running.

## Conclusion

This article hopes to give you a practical idea about how to restart a Kubernetes cluster. Nevertheless, restarting Kubernetes clusters requires caution because we might come across downtime during the restarting process, especially when we run single replicas of our application. In this connection, we should always pay attention to issues necessary to be taken into consideration before restarting any Kubernetes clusters.