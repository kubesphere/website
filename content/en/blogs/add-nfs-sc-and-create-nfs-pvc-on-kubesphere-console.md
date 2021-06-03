---
title: 'Configure an NFS Storage Class on an Existing KubeSphere Cluster and Create a PersistentVolumeClaim'
keywords: Kubernetes, KubeSphere, NFS
description: Create an NFS storage class and use its PVC for a Deployment.
tag: 'KubeSphere, storage, NFS, installation'
createTime: '2021-03-11'
author: 'Sherlock'
snapshot: '/images/blogs/en/add-nfs-storage-class-on-kubesphere-console/banner-page.png'
---

In my [last article](https://kubesphere.io/blogs/install-nfs-server-client-for-kubesphere-cluster/), I talked about how to use KubeKey to create a Kubernetes and KubeSphere cluster together with NFS storage. In fact, KubeSphere provides you with great flexibility as you can use KubeKey to install NFS storage when you create a cluster while it can also be deployed separately on an existing cluster.

KubeSphere features a highly interactive dashboard where virtually all the operations can be performed on it. In this article, I am going to demonstrate show to configure an NFS storage class on your existing KubeSphere cluster and create a PVC using the storage class.

## Before You Begin

- You have [set up a Kubernetes cluster with KubeSphere installed](https://kubesphere.io/docs/quick-start/all-in-one-on-linux/). Here is my cluster information for your reference:

  ```bash
  # kubectl get node -o wide
  NAME     STATUS   ROLES           AGE   VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
  client   Ready    master,worker   17m   v1.17.9   192.168.0.3   <none>        Ubuntu 16.04.4 LTS   4.4.0-116-generic   docker://20.10.5
  ```

- You have an available NFS server which provides an exported directory for external storage services. For more information, see [my previous article](https://kubesphere.io/blogs/install-nfs-server-client-for-kubesphere-cluster/#install-and-configure-an-nfs-server).

## Configure the Client Machine

This is basically the same as what I did last time as we need to make sure all of our client machines can use essential NFS client libraries and utilities.

1. Run the following command to make sure you are using the latest package.

   ```bash
   sudo apt-get update
   ```

2. Install `nfs-common` on all the clients.

   ```bash
   sudo apt-get install nfs-common
   ```

   {{< notice note >}}

   For CentOS-based Linux distributions, `nfs-utils` needs to be installed.

   {{</ notice >}}

3. To make sure you can use NFS storage, you need to install its corresponding volume plugin. As Helm is installed together with KubeSphere by default, I will install [NFS-client Provisioner](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client) by Helm charts including its storage class. Run the following command to add a repository first:

   ```
   helm repo add stable https://charts.kubesphere.io/main
   ```

   {{< notice note >}}

   - As NFS itself does not have an internal provisioner, I will be using NFS-client Provisioner for dynamic provisioning of volumes.

   - `kubectl` is integrated into the console of KubeSphere. You can run commands with it from **Toolbox** in the bottom-right corner of the KubeSphere dashboard.

   {{</ notice >}} 

4. Intall [NFS-client Provisioner](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client).

   ```bash
   helm install stable/nfs-client-provisioner --set nfs.server=192.168.0.2 --set nfs.path=/mnt/demo
   ```

   {{< notice note >}}

   - Replace the server IP address and the exported directory with your own in the above command.
   - For Helm 3, you must specify the flag `--generate-name`.
   - For more information about configurable parameters, see [this table.](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner#configuration)

   {{</ notice >}}

5. Log in to the KubeSphere console with the default account and password (`admin/P@88w0rd`) and go to **Storage Classes** on the **Cluster Management** page. You can see that the NFS storage class has been added.

   ![storage-class-nfs](/images/blogs/en/add-nfs-storage-class-on-kubesphere-console/storage-class-nfs.png)

## Create a PVC and Mount a Volume to a Workload

To mount a volume to your workload, you need to create a [PersistentVolumeClaim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC) first. If your storage class supports dynamic provisioning, KubeSphere will automatically bind the PVC created to a [PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) (PV) that satisfies the request you set for the PVC, such as access mode and capacity. You can then mount it to your workload to provide storage services.

1. In KubeSphere, you have different projects (i.e. namespaces) where workloads are running. Go to a project, navigate to the **Volumes** page, and click **Create**.

   ![volumes](/images/blogs/en/add-nfs-storage-class-on-kubesphere-console/volumes.png)

   {{< notice note >}}

   - All objects created on this page are essentially PVCs.
   - This article is not focused on the multi-tenant system of KubeSphere which features different levels for tenant isolation. For more information about KubeSphere workspaces and projects, see [this article](https://kubesphere.io/docs/quick-start/create-workspace-and-project/).

   {{</ notice >}} 

2. Click **Create** and set a name and necessary parameters for the PVC. You can select `nfs-client` as the storage class as shown below:

   ![create-nfs-pvc](/images/blogs/en/add-nfs-storage-class-on-kubesphere-console/create-nfs-pvc.png)

   {{< notice note >}}

   In fact, you can also create a volume by using a volume snapshot while your storage class must support this feature. For more information, see [Volume Snapshots](https://kubesphere.io/docs/project-user-guide/storage/volume-snapshots/).

   {{</ notice >}} 

3. The PVC is bound now.

   ![bound-pvc](/images/blogs/en/add-nfs-storage-class-on-kubesphere-console/bound-pvc.png)

4. Go to **Application Workloads** and create a Deployment from **Workloads**. Here I am using NGINX as an example.

   ![image](/images/blogs/en/add-nfs-storage-class-on-kubesphere-console/image.png)

   {{< notice note >}}

   To create workloads in KubeSphere, you can create and apply YAML files just as what you did before (**Edit Mode** in the top-right corner). At the same time, you can also set parameters for your workloads on the KubeSphere dashboard one by one. I will not talk about the whole process in detail as this article is mainly about how to configure storage and create volumes. Have a look at [the KubeSphere documentation](https://kubesphere.io/docs/project-user-guide/application-workloads/deployments/) to learn more about how to create workloads. 

   {{</ notice >}} 

5. On the **Mount Volumes** tab, click **Add Volume** and select the PVC just created. Here is my configuration for your reference. For more information about dashboard properties, see [Volumes](https://kubesphere.io/docs/project-user-guide/storage/volumes/).

   ![select-pvc](/images/blogs/en/add-nfs-storage-class-on-kubesphere-console/select-pvc.png)

6. The Deployment will be up and running soon after creation.

   ![deployment-ready](/images/blogs/en/add-nfs-storage-class-on-kubesphere-console/deployment-ready.png)
   
7. The volume has also been mounted successfully.

   ![pvc-mounted](/images/blogs/en/add-nfs-storage-class-on-kubesphere-console/pvc-mounted.png)

8. Click the PVC to see the detail page.

   ![resource-status](/images/blogs/en/add-nfs-storage-class-on-kubesphere-console/resource-status.png)

## Summary

I think once you have your NFS storage server ready, it will not be a complicated task to install the storage class by Helm (KubeSphere installs Helm for you by default). As for creating and using PVCs, KubeSphere provides consistent user experiences as you can create your resources from the command line as always. That said, it is not a bad idea to try its dashboard to create PVCs which frees you from creating and applying any YAML configurations manually.

## References

[Volumes](https://kubesphere.io/docs/project-user-guide/storage/volumes/)

[Persistent Volumes and Storage Classes](https://kubesphere.io/docs/cluster-administration/persistent-volume-and-storage-class/)