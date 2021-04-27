---
title: "Install NFS Client"
keywords: 'KubeSphere, Kubernetes, storage, installation, configurations, NFS'
description: 'Use KubeKey to create a cluster with NFS Client providing storage services.'
linkTitle: "Install NFS Client"
weight: 3330
---

This tutorial demonstrates how to set up a KubeSphere cluster and configure NFS storage.

{{< notice note >}}

Ubuntu 16.04 is used as an example in this tutorial.

{{</ notice >}}

## Prerequisites

You must have an NFS server ready providing external storage services. Make sure you have created and exported a directory on the NFS server which your permitted client machines can access. For more information, see [Set up an NFS Server](../../../reference/storage-system-installation/nfs-server/).

## Step 1: Configure the Client Machine

Install `nfs-common` on all of the clients. It provides necessary NFS functions while you do not need to install any server components.

1. Execute the following command to make sure you are using the latest package.

   ```bash
   sudo apt-get update
   ```

2. Install `nfs-common` on all the clients.

   ```bash
   sudo apt-get install nfs-common
   ```

3. Go to one of the client machines (taskbox) where you want to download KubeKey later. Create a configuration file that contains all the necessary parameters of your NFS server which will be referenced by KubeKey during installation.

   ```bash
   vi nfs-client.yaml
   ```

   An example configuration file:

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

4. Save the file.

## Step 2: Download KubeKey

Follow the steps below to download [KubeKey](../../../installing-on-linux/introduction/kubekey/) on the taskbox.

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v1.0.1) of KubeKey. You can change the version number in the command to download a specific version.

{{</ notice >}}

Make `kk` executable:

```bash
chmod +x kk
```

## Step 3: Create a Cluster

1. Specify a Kubernetes version and a KubeSphere version that you want to install. For example:

   ```bash
   ./kk create config --with-kubernetes v1.20.4 --with-kubesphere v3.1.0
   ```

   {{< notice note >}}

   - Recommended Kubernetes versions for KubeSphere v3.1.0: v1.17.9, v1.18.8, v1.19.8 and v1.20.4. If you do not specify a Kubernetes version, KubeKey will install Kubernetes v1.19.8 by default. For more information about supported Kubernetes versions, see [Support Matrix](../../../installing-on-linux/introduction/kubekey/#support-matrix).

   - If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.
   - If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.

   {{</ notice >}}

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

5. Pay special attention to the field of `addons`, under which you must provide the information of NFS-client. For more information about each parameter in this file, see [Multi-node Installation](../../../installing-on-linux/introduction/multioverview/#2-edit-the-configuration-file).

6. Save the file and execute the following command to install Kubernetes and KubeSphere:

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

7. When the installation finishes, you can inspect installation logs with the following command:

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
   ```

   Expected output:

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

## Step 4: Verify Installation

You can verify that NFS-client has been successfully installed either from the command line or from the KubeSphere web console.

### Command line

1. Run the following command to check your storage class.

   ```bash
   kubectl get sc
   ```

   Expected output:

   ```bash
   NAME              PROVISIONER                                       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
   local (default)   openebs.io/local                                  Delete          WaitForFirstConsumer   false                  16m
   nfs-client        cluster.local/nfs-client-nfs-client-provisioner   Delete          Immediate              true                   16m
   ```

   {{< notice note >}}

   If you set `nfs-client` as the default storage class, OpenEBS will not be installed by KubeKey.

   {{</ notice >}} 

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

1. Log in to the web console as `admin` with the default account and password at `<NodeIP>:30880`. Click **Platform** in the top left corner and select **Cluster Management**.

2. Go to **Pods** in **Application Workloads** and select `kube-system` from the project drop-down list. You can see that the Pod of `nfs-client` is up and running.

   ![nfs-pod](/images/docs/installing-on-linux/persistent-storage-configurations/nfs-client/nfs-pod.png)

3. Go to **Storage Classes** under **Storage**, and you can see available storage classes in your cluster.

   ![nfs-storage-class](/images/docs/installing-on-linux/persistent-storage-configurations/nfs-client/nfs-storage-class.png)
   
   {{< notice note >}}
   
   For more information about how to create volumes on the KubeSphere console, see [Volumes](../../../project-user-guide/storage/volumes/).
   
   {{</ notice >}} 