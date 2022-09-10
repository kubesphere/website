---
title: "Install QingCloud CSI"
keywords: 'KubeSphere, Kubernetes, QingCloud CSI, installation, configurations, storage'
description: 'Use KubeKey to create a cluster with QingCloud CSI providing storage services.'
linkTitle: "Install QingCloud CSI"
weight: 3320
---

If you plan to install KubeSphere on [QingCloud](https://www.qingcloud.com/), [QingCloud CSI](https://github.com/yunify/qingcloud-csi) can be chosen as the underlying storage plugin. 

This tutorial demonstrates how to use KubeKey to set up a KubeSphere cluster and configure QingCloud CSI to provide storage services.

## Prerequisites

Your cluster nodes are created on [QingCloud Platform](https://intl.qingcloud.com/).

## Step 1: Create Access Keys on QingCloud Platform

To make sure the platform can create cloud disks for your cluster, you need to provide the access key (`qy_access_key_id` and `qy_secret_access_key`) in a separate configuration file of QingCloud CSI.

1. Log in to the web console of [QingCloud](https://console.qingcloud.com/login) and select **Access Key** from the drop-down list in the top-right corner.

   ![access-key](/images/docs/v3.3/installing-on-linux/introduction/persistent-storage-configuration/access-key.jpg)

2. Click **Create** to generate keys. Download the key after it is created, which is stored in a csv file.

## Step 2: Create a Configuration File for QingCloud CSI

The separate configuration file contains all parameters of QingCloud CSI which will be used by KubeKey during installation.

1. Go to one of the nodes (taskbox) where you want to download KubeKey later and run the following command to create a configuration file.

   ```
   vi csi-qingcloud.yaml
   ```

   An example configuration file:

   ```yaml
   config:
     qy_access_key_id: "MBKTPXWCIRIEDQYQKXYL"    # Replace it with your own key id.
     qy_secret_access_key: "cqEnHYZhdVCVif9qCUge3LNUXG1Cb9VzKY2RnBdX"  # Replace it with your own access key.
     zone: "pek3a"  # Lowercase letters only.
   sc:
     isDefaultClass: true # Set it as the default storage class.
   ```

2. The field `zone` specifies where your cloud disks are created. On QingCloud Platform, you must select a zone before you create them.

   ![storage-zone](/images/docs/v3.3/installing-on-linux/introduction/persistent-storage-configuration/storage-zone.jpg)

   Make sure the value you specify for `zone` matches the region ID below:

   | Zone                                        | Region ID               |
   | ------------------------------------------- | ----------------------- |
   | Shanghai1-A/Shanghai1-B                     | sh1a/sh1b               |
   | Beijing3-A/Beijing3-B/Beijing3-C/Beijing3-D | pek3a/pek3b/pek3c/pek3d |
   | Guangdong2-A/Guangdong2-B                   | gd2a/gd2b               |
   | Asia-Pacific 2-A                            | ap2a                    |

   If you want to configure more values, see [chart configuration for QingCloud CSI](https://github.com/kubesphere/helm-charts/tree/master/src/test/csi-qingcloud#configuration).
   
3. Save the file.

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
     - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: root, password: Testing123}
     - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: Testing123}
     - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Testing123}
     roleGroups:
       etcd:
       - master
       control-plane:
       - master
       worker:
       - node1
       - node2
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
     - name: csi-qingcloud
       namespace: kube-system
       sources:
         chart:
           name: csi-qingcloud
           repo: https://charts.kubesphere.io/test
           valuesFile: /root/csi-qingcloud.yaml
   ...
   ```

3. Pay special attention to the field of `addons`, under which you must provide the information of QingCloud CSI. For more information about each parameter in this file, see [Multi-node Installation](../../../installing-on-linux/introduction/multioverview/#2-edit-the-configuration-file).

   {{< notice note >}}

   KubeKey will install QingCloud CSI by Helm charts together with its StorageClass.

   {{</ notice >}}

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

## Step 5: Verify Installation

You can verify that QingCloud CSI has been successfully installed either from the command line or from the KubeSphere web console.

### Command line

1. Run the following command to check your storage class.

   ```bash
   kubectl get sc
   ```

   Expected output:

   ```bash
   NAME                      PROVISIONER              RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
   csi-qingcloud (default)   disk.csi.qingcloud.com   Delete          WaitForFirstConsumer   true                   28m
   ```

2. Run the following command to check the statuses of Pods.

   ```bash
   kubectl get pod -n kube-system
   ```

   Note that `csi-qingcloud` is installed in the namespace `kube-system`. Expected output (exclude other irrelevant Pods):

   ```bash
   NAME                                       READY   STATUS    RESTARTS   AGE
   csi-qingcloud-controller-f95dcddfb-2gfck   5/5     Running   0          28m
   csi-qingcloud-node-7dzz8                   2/2     Running   0          28m
   csi-qingcloud-node-k4hsj                   2/2     Running   0          28m
   csi-qingcloud-node-sptdb                   2/2     Running   0          28m
   ```

### KubeSphere console

1. Log in to the web console with the default account and password (`admin/P@88w0rd`) at `<NodeIP>:30880`. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. Go to **Pods** in **Application Workloads** and select `kube-system` from the project drop-down list. You can see that the Pods of `csi-qingcloud` are up and running.

3. Go to **Storage Classes** under **Storage**, and you can see available storage classes in your cluster.
   
   {{< notice note >}}
   
   For more information about how to create volumes on the KubeSphere console, see [Volumes](../../../project-user-guide/storage/volumes/).
   
   {{</ notice >}} 