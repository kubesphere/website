---
title: 'Use KubeKey to Set up a Kubernetes and KubeSphere Cluster with NFS Storage'
keywords: Kubernetes, KubeSphere, NFS, KubeKey
description: Set up your NFS server and use it to provide externals storage for your Kubernetes cluster.
tag: 'KubeSphere, storage, NFS, KubeKey, installation'
createTime: '2021-03-02'
author: 'Sherlock'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/KubeKey-lightweight-installer.png'
---

In my previous articles, I talked about how to use [KubeKey](https://github.com/kubesphere/kubekey) to set up and scale a Kubernetes cluster. As you may already know, KubeKey can do way more than that. You can also use KubeKey to install KubeSphere, a [container platform](https://kubesphere.io/) running on top of Kubernetes with streamlined DevOps workflows, unified multi-cluster management and more. Besides, KubeKey is able to install cloud-native add-ons by Chart or YAML files.

Among other things, storage represents one of, if not the most important element as you set up a Kubernetes cluster. Kubernetes itself supports multiple storage solutions, such as NFS-client, Ceph CSI and GlusterFS (in-tree). In this article, I am going to show you how to use KubeKey to create a Kubernetes and KubeSphere cluster with [NFS-client Provisioner](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client) providing external storage.

## What is NFS

Network File System (NFS) provides you with remote access to files and directories on a server machine. It allows multiple clients to access shared resources over a network.

You can install [NFS-client Provisioner](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client) as a storage plugin for your Kubernetes cluster while you must configure an NFS server beforehand. Here is how it works: an NFS client mounts a directory on the server machine so that files residing on the NFS server are accessible to the NFS client. The directory, which you create on the server and share with your client, is also called an **exported directory**. To ensure that your client can access the directory smoothly, you must grant the access to them with several commands which I will show you later.

At the same time, a component called `nfs-common` (for Debian-based Linux distributions) or `nfs-utils` (for CentOS-based Linux distributions) needs to be installed on all the client machines to provide essential NFS client libraries and utilities.

## How Does KubeKey Use NFS-client Configurations

As I said above, you can use KubeKey to install different add-ons by Chart or YAML files. The configuration of these add-ons must be offered in the configuration file (`config-sample.yaml` by default) created by KubeKey. To let KubeKey apply these configurations during installation, there are generally two ways:

1. Input necessary parameters under the `addons` field directly in `config-sample.yaml`.
2. Create a separate configuration file for your add-on to list all the necessary parameters and provide the path of the file in `config-sample.yaml` so that KubeKey can reference it.

In this article, I will use the second way for demonstration. The general steps are:

1. Set up an NFS server.
2. Install `nfs-common` or `nfs-utils` on all the client machines in your cluster and create a separate configuration file for NFS-client Provisioner on one of the client machines that servers as the taskbox for installation.
3. Download KubeKey on the taskbox.
4. Use KubeKey to create your cluster configuration file (`config-sample.yaml`) and edit it.
5. Install Kubernetes, KubeSphere and NFS-client Provisioner including the storage class.

## Prepare Hosts

Here is my node information for your reference:

| Host IP     | Hostname | Role         | System                                        |
| ----------- | -------- | ------------ | --------------------------------------------- |
| 192.168.0.2 | server   | NFS server   | Ubuntu 16.04, 4 Cores, 4 G Memory, 100 G Disk |
| 192.168.0.3 | client1  | master, etcd | Ubuntu 16.04, 8 Cores, 8 G Memory, 50 G Disk  |
| 192.168.0.4 | client2  | worker       | Ubuntu 16.04, 8 Cores, 8 G Memory, 50 G Disk  |
| 192.168.0.5 | client3  | worker       | Ubuntu 16.04, 8 Cores, 8 G Memory, 50 G Disk  |

The `server` machine, where the NFS server will be installed, provides external storage services for three client machines in the cluster.

For more information about requirements for nodes, network, and dependencies, see [one of my previous posts](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/#node-requirements).

## Install and Configure an NFS Server

### Step 1: Install the NFS kernel server

To set up your server machine, you must install the NFS kernel server on it.

1. Run the following command so that you will be using the latest package on Ubuntu for installation.

   ```bash
   sudo apt-get update
   ```

2. Install the NFS kernel server.

   ```bash
   sudo apt install nfs-kernel-server
   ```

### Step 2: Create an exported directory

Your NFS client will mount a directory on the server machine which has been exported by the NFS server.

1. Run the following command as root to specify a mount folder name (for example, `/mnt/demo`). This is also the directory that will be shared with your client machines.

   ```bash
   sudo mkdir -p /mnt/demo
   ```

2. To ensure that all the clients can access the directory, remove permissions of the folder.

   ```bash
   sudo chown nobody:nogroup /mnt/demo
   ```

   ```bash
   sudo chmod 777 /mnt/demo
   ```

### Step 3: Grant your client machine access to the NFS server

1. Run the following command to edit the `/etc/exports` file with `nano`.

   ```bash
   sudo nano /etc/exports
   ```

2. Add your client information to the file. Note that if you have multiple directories that you want to share with your clients, you need to add them all to the file. Here is the syntax:

   ```bash
   /mnt/demo clientIP(rw,sync,no_subtree_check)
   ```

   If you have multiple client machines, add each line for all of them. Alternatively, specify a subnet in the file so that all the clients within it can access the NFS server. For example:

   ```bash
   /mnt/demo 192.168.0.0/24(rw,sync,no_subtree_check)
   ```

   {{< notice note >}}

   - `rw`: Read and write operations. The client machine will have both read and write access to the volume.
   - `sync`: Changes will be written to disk and memory.
   - `no_subtree_check`: Prevent subtree checking. It disables the security verification required for a client to mount permitted subdirectories.

   {{</ notice >}}

3. Save the file.

### Step 4: Apply the configuration

1. Run the following command to export your shared directory.

   ```bash
   sudo exportfs -a
   ```

2. To make your configuration effective, restart the NFS kernel server.

   ```bash
   sudo systemctl restart nfs-kernel-server
   ```

## Configure the Client Machine

Now that we have our server machine ready, we need to install `nfs-common` on all of our clients. It provides necessary NFS functions while you do not need to install any server components.

1. Likewise, execute the following command to make sure you are using the latest package.

   ```bash
   sudo apt-get update
   ```

2. Install `nfs-common` on all the clients.

   ```bash
   sudo apt-get install nfs-common
   ```

3. Go to one of the client machines (taskbox) where you want to download KubeKey later (for example, `client1`). Create a configuration file that contains all the necessary parameters of your NFS server which will be referenced by KubeKey during installation.

   ```bash
   vi nfs-client.yaml
   ```

   Here is my configuration for your reference:

   ```yaml
   nfs:
     server: "192.168.0.2"    # This is the server IP address. Replace it with your own.
     path: "/mnt/demo"    # Replace the exported directory with your own.
   storageClass:
     defaultClass: false
   ```

   {{< notice note >}}

   - If you want to configure more values, see [chart configurations for NFS-client](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner#configuration).
   - The `storageClass.defaultClass` field controls whether you want to set the storage class of NFS-client Provisioner as the default one. If you input `false` for it, KubeKey will install [OpenEBS](https://github.com/openebs/openebs) to provide local volumes, while they are not provisioned dynamically as you create workloads on your cluster. After you install KubeSphere, you can change the default storage class on the console directly.

   {{</ notice >}}

4. Save the file. Now you can use KubeKey to install both Kubernetes and KubeSphere, together with NFS-client Provisioner.

## Download KubeKey and Install a Cluster

1. Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command to download KubeKey version 1.0.1. You only need to download KubeKey to one of your machines that serves as the **taskbox** for installation.

   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
   ```

2. The above command downloads KubeKey and unzips the file. Your folder now contains a file called `kk`. Make it executable.

   ```bash
   chmod +x kk
   ```

3. Specify a Kubernetes version and a KubeSphere version that you want to install. For more information about supported Kubernetes versions, see [this list](https://github.com/kubesphere/kubekey/blob/master/docs/kubernetes-versions.md).

   ```bash
   ./kk create config --with-kubernetes v1.20.4 --with-kubesphere v3.0.0
   ```

4. A default file `config-sample.yaml` will be created if you do not customize the name. Edit the file.

   ```bash
   vi config-sample.yaml
   ```

   ```yaml
   ...
   metadata:
     name: sample
   spec:
     hosts:
     - {name: client1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
     - {name: client2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
     - {name: client3, address: 192.168.0.5, internalAddress: 192.168.0.5, user: ubuntu, password: Testing123}
     roleGroups:
       etcd:
       - client1
       master:
       - client1
       worker:
       - client2
       - client3
     controlPlaneEndpoint:
       domain: lb.kubesphere.local
       address: ""
       port: "6443"
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
     addons:
     - name: nfs-client
       namespace: kube-system
       sources:
         chart:
           name: nfs-client-provisioner
           repo: https://charts.kubesphere.io/main
           values: /home/ubuntu/nfs-client.yaml # Use the path of your own NFS-client configuration file.
   ...             
   ```

5. Pay special attention to the field of `addons`. For more information about each parameter in this file, you can see [one of my previous posts](https://kubesphere.io/blogs/install-kubernetes-using-kubekey/#install-kubernetes), or have a look at [this example file](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md) and [explanations](https://github.com/kubesphere/kubekey/blob/master/docs/addons.md) for the `addons` field. Note that you can also enable pluggable components of KubeSphere in this file, such as DevOps, service mesh, and App Store.

6. Save the file and execute the following command to install Kubernetes and KubeSphere:

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

7. When the installation finishes, you can inspect installation logs with the following command:

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
   ```

   You can see the following message if the installation is successful:

   ```bash
   #####################################################
   ###              Welcome to KubeSphere!           ###
   #####################################################
   
   Console: http://192.168.0.3:30880
   Account: admin
   Password: P@88w0rd
   
   NOTES：
     1. After you log into the console, please check the
        monitoring status of service components in
        "Cluster Management". If any service is not
        ready, please wait patiently until all components 
        are up and running.
     2. Please change the default password after login.
   
   #####################################################
   https://kubesphere.io             20xx-xx-xx xx:xx:xx
   #####################################################
   ```

## Verify Installation

You can verify that NFS-client has been successfully installed either from the command line or from the KubeSphere web console.

### Command line

1. Run the following command to check your storage class.

   ```bash
   kubectl get sc
   ```

   I did not set `nfs-client` as the default storage class so KubeKey installed OpenEBS for me as well. Expected output:

   ```bash
   NAME              PROVISIONER                                       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
   local (default)   openebs.io/local                                  Delete          WaitForFirstConsumer   false                  16m
   nfs-client        cluster.local/nfs-client-nfs-client-provisioner   Delete          Immediate              true                   16m
   ```

2. Run the following command to check the statuses of Pods.

   ```bash
   kubectl get pod -n kube-system
   ```

   Note that `nfs-client` is installed in the namespace `kube-system`. Expected output (exclude irrelevant Pods):

   ```bash
   NAME                                                 READY   STATUS    RESTARTS   AGE
   nfs-client-nfs-client-provisioner-6fc95f4f79-92lsh   1/1     Running   0          16m
   ```

### KubeSphere console

1. The `ks-console` Service is being exposed through a NodePort. Log in to the console at `<node IP>:30880` with the default account and password (`admin/P@88w0rd`). You may need to open the port in your security groups and configure relevant port forwarding rules depending on your environment.

2. Click **Platform** in the top-left corner and go to **Cluster Management**. In **Storage Classes** under **Storage**, you can see two storage classes:

   ![nfs-storage-class](/images/blogs/en/install-nfs-server-client-for-kubesphere-cluster/nfs-storage-class.png)

3. Go to **Pods** under **Application Workloads**, the Pod of `nfs-client` is also functioning well in the `kube-system` namespace.

   ![nfs-client-pod](/images/blogs/en/install-nfs-server-client-for-kubesphere-cluster/nfs-client-pod.png)
   
4. You can create a PVC in a project and verify the persistent volume bound to it can be mounted to a workload successfully.

   ![nfs-client-pvc](/images/blogs/en/install-nfs-server-client-for-kubesphere-cluster/nfs-client-pvc.png)

   For more information about how to create a PVC on the KubeSphere console, see [Volumes](https://kubesphere.io/docs/project-user-guide/storage/volumes/).
