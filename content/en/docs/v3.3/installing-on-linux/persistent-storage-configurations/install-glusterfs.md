---
title: "Install GlusterFS"
keywords: 'KubeSphere, Kubernetes, GlusterFS, installation, configurations, storage'
description: 'Use KubeKey to create a cluster with GlusterFS providing storage services.'
linkTitle: "Install GlusterFS"
weight: 3340
---

[GlusterFS](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) is an in-tree storage plugin in Kubernetes. Hence, you only need to install the storage class.

This tutorial demonstrates how to use KubeKey to set up a KubeSphere cluster and configure GlusterFS to provide storage services.

{{< notice note >}}

Ubuntu 16.04 is used as an example in this tutorial.

{{</ notice >}} 

## Prerequisites

You have set up your GlusterFS cluster and configured Heketi. For more information, see [Set up a GlusterFS Server](../../../reference/storage-system-installation/glusterfs-server/).

## Step 1: Configure the Client Machine

You need to install the GlusterFS client package on all your client machines.

1. Install `software-properties-common`.

   ```bash
   apt-get install software-properties-common
   ```

2. Add the community GlusterFS PPA.

   ```bash
   add-apt-repository ppa:gluster/glusterfs-7
   ```

3. Make sure you are using the latest package.

   ```bash
   apt-get update
   ```

4. Install the GlusterFS client.

   ```bash
   apt-get install glusterfs-server -y
   ```

5. Verify your GlusterFS version.

   ```bash
   glusterfs -V
   ```

## Step 2: Create a Configuration File for GlusterFS

The separate configuration file contains all parameters of GlusterFS storage which will be used by KubeKey during installation.

1. Go to one of the nodes (taskbox) where you want to download KubeKey later and run the following command to create a configuration file.

   ```
   vi glusterfs-sc.yaml
   ```

   An example configuration file (include a Heketi Secret):

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: heketi-secret
     namespace: kube-system
   type: kubernetes.io/glusterfs
   data:
     key: "MTIzNDU2"    # Replace it with your own key. Base64 coding.
   ---
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     annotations:
       storageclass.beta.kubernetes.io/is-default-class: "true"
       storageclass.kubesphere.io/supported-access-modes: '["ReadWriteOnce","ReadOnlyMany","ReadWriteMany"]'
     name: glusterfs
   parameters:
     clusterid: "21240a91145aee4d801661689383dcd1"    # Replace it with your own GlusterFS cluster ID.
     gidMax: "50000"
     gidMin: "40000"
     restauthenabled: "true"
     resturl: "http://192.168.0.2:8080"    # The Gluster REST service/Heketi service url which provision gluster volumes on demand. Replace it with your own.
     restuser: admin
     secretName: heketi-secret
     secretNamespace: kube-system
     volumetype: "replicate:3"    # Replace it with your own volume type.
   provisioner: kubernetes.io/glusterfs
   reclaimPolicy: Delete
   volumeBindingMode: Immediate
   allowVolumeExpansion: true
   ```

   {{< notice note >}}

   - Use the field `storageclass.beta.kubernetes.io/is-default-class` to set `glusterfs` as your default storage class. If it is `false`, KubeKey will install OpenEBS as the default storage class.
   - For more information about parameters in the storage class manifest, see [the Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs).

   {{</ notice >}} 

2. Save the file.

## Step 3: Download KubeKey

Follow the steps below to download [KubeKey](../../../installing-on-linux/introduction/kubekey/) on the taskbox.

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

## Step 4: Create a Cluster

1. Specify a Kubernetes version and a KubeSphere version that you want to install. For example:

   ```bash
   ./kk create config --with-kubernetes v1.22.10 --with-kubesphere v3.3.0
   ```

   {{< notice note >}}

   - Recommended Kubernetes versions for KubeSphere 3.3.0: v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support). If you do not specify a Kubernetes version, KubeKey will install Kubernetes v1.23.7 by default. For more information about supported Kubernetes versions, see [Support Matrix](../../../installing-on-linux/introduction/kubekey/#support-matrix).

   - If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.
   - If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.

   {{</ notice >}}

2. A default file `config-sample.yaml` will be created if you do not customize the name. Edit the file.

   ```bash
   vi config-sample.yaml
   ```

   ```yaml
   ...
   metadata:
     name: sample
   spec:
     hosts:
     - {name: client1, address: 192.168.0.5, internalAddress: 192.168.0.5, user: ubuntu, password: Testing123}
     - {name: client2, address: 192.168.0.6, internalAddress: 192.168.0.6, user: ubuntu, password: Testing123}
     - {name: client3, address: 192.168.0.7, internalAddress: 192.168.0.7, user: ubuntu, password: Testing123}
     roleGroups:
       etcd:
       - client1
       control-plane:
       - client1
       worker:
       - client2
       - client3
     controlPlaneEndpoint:
       domain: lb.kubesphere.local
       address: ""
       port: 6443
     kubernetes:
       version: v1.22.10
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
     - name: glusterfs
       namespace: kube-system
       sources:
         yaml:
           path:
           - /root/glusterfs-sc.yaml
   ...
   ```
   
3. Pay special attention to the field of `addons`, under which you must provide the information of the storage class to be created as well as the Heketi Secret. For more information about each parameter in this file, see [Multi-node Installation](../../../installing-on-linux/introduction/multioverview/#2-edit-the-configuration-file).

4. Save the file and execute the following command to install Kubernetes and KubeSphere:

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

5. When the installation finishes, you can inspect installation logs with the following command:

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
   ```

   Expected output:

   ```bash
   #####################################################
   ###              Welcome to KubeSphere!           ###
   #####################################################
   
   Console: http://192.168.0.4:30880
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

## Step 5: Verify Installation

You can verify that GlusterFS has been successfully installed either from the command line or from the KubeSphere web console.

### Command line

Run the following command to check your storage class.

```bash
kubectl get sc
```

Expected output:

```bash
NAME                  PROVISIONER               RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
glusterfs (default)   kubernetes.io/glusterfs   Delete          Immediate           true                   104m
```

### KubeSphere console

1. Log in to the web console with the default account and password (`admin/P@88w0rd`) at `<NodeIP>:30880`. Click **Platform** in the upper-left corner and select **Cluster Management**.

3. Go to **Volumes** under **Storage**, and you can see PVCs in use.
   
   {{< notice note >}}
   
   For more information about how to create volumes on the KubeSphere console, see [Volumes](../../../project-user-guide/storage/volumes/).
   
   {{</ notice >}} 
   
4. On the **Storage Classes** page, you can see the storage class available in your cluster.