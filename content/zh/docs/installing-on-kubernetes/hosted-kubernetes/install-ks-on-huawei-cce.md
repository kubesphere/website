---
title: "Install KubeSphere on Huawei CCE"
keywords: "kubesphere, kubernetes, docker, huawei, cce"
description: "It is to introduce how to install KubeSphere 3.0 on Huaiwei CCE."
---

This instruction is about how to install KubeSphere 3.0.0 on [Huaiwei CCE](https://support.huaweicloud.com/en-us/qs-cce/cce_qs_0001.html).

## Preparation for Huawei CCE

### Create Kubernetes Cluster

First, create a Kubernetes Cluster according to the resources. Meet the requirements below (ignore this part if your environment is as required).

- KubeSphere 3.0.0 supports Kubernetes `1.15.x`, `1.16.x`, `1.17.x`, and `1.18.x` by default. Select a version and create the cluster, e.g. `v1.15.11`, `v1.17.9`.
- Ensure the cloud computing network for your Kubernetes cluster works, or use an elastic IP when “Ato Create”or “Select Existing”; or confiure the network after the cluster is created. Refer to Configure [NAT Gateway](https://support.huaweicloud.com/en-us/productdesc-natgateway/en-us_topic_0086739762.html).
- Select `s3.xlarge.2`  `4-core｜8GB` for nodes and add more if necessary (3 and more nodes are required for production environment).

### Create a public key for kubectl

- Go to `Resource Management` > `Cluster Management` > `Basic Information` > `Network`, and bind `Public apiserver`.
- Select `kubectl` on the right column, go to `Download kubectl configuration file`, and click `Click here to download`, then you will get a public key for kubectl.

![Generate Kubectl config file](/images/docs/huawei-cce/en/generate-kubeconfig.png)

After you get the configuration file for kubectl, use kubectl command lines to verify the connection to the cluster.

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"18", GitVersion:"v1.18.8", GitCommit:"9f2892aab98fe339f3bd70e3c470144299398ace", GitTreeState:"clean", BuildDate:"2020-08-15T10:08:56Z", GoVersion:"go1.14.7", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"17+", GitVersion:"v1.17.9-r0-CCE20.7.1.B003-17.36.3", GitCommit:"136c81cf3bd314fcbc5154e07cbeece860777e93", GitTreeState:"clean", BuildDate:"2020-08-08T06:01:28Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}

```

## KubeSphere Deployment

### Create a custom StorageClass

> Huawei CCE built-in Everest CSI provides StorageClass `csi-disk` which uses SATA (normal I/O) by default, but the actual disk that is for Kubernetes clusters is either SAS (high I/O) or SSD (extremely high I/O). So it is suggested that create an extra StorageClass and set it as default for later. Refer to the official document - [Use kubectl to create a cloud storage](https://support.huaweicloud.com/en-us/usermanual-cce/cce_01_0044.html).

Below is an example to create a SAS(high I/O) for its corresponding StorageClass.

```yaml
# csi-disk-sas.yaml

---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
    storageclass.kubesphere.io/support-snapshot: "false"
  name: csi-disk-sas
parameters:
  csi.storage.k8s.io/csi-driver-name: disk.csi.everest.io
  csi.storage.k8s.io/fstype: ext4
  # Bind Huawei “high I/O storage. If use “extremely high I/O, change it to SSD.
  everest.io/disk-volume-type: SAS
  everest.io/passthrough: "true"
provisioner: everest-csi-provisioner
allowVolumeExpansion: true
reclaimPolicy: Delete
volumeBindingMode: Immediate

```

For how to set up or cancel a default StorageClass, refer to Kubernetes official document - [Change Default StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)。 

### Use ks-installer to minimize the deployment

Use [ks-installer](https://github.com/kubesphere/ks-installer) to deploy KubeSphere on an existing Kubernetes cluster. It is suggested that you install it in minimal size.

```bash
$ kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/kubesphere-installer.yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/cluster-configuration.yaml

```

Go to `Workload` > `Pod`, and check the running status of the pod in `kubesphere-system` of its namespace to understand the minimal deployment of KubeSphere. `ks-console-xxxx` of the namespace to understand the app availability of KubeSphere console. 

![Deploy KubeSphere in Minimal](/images/docs/huawei-cce/en/deploy-ks-minimal.png)

### Expose KubeSphere Console

Check the running status of Pod in `kubesphere-system` namespace and make sure the basic components of  KubeSphere are running. Then expose KubeSphere console.

Go to `Resource Management` > `Network` and choose the service in `ks-console`. It is suggested that you choose `LoadBalancer` (Public IP is required). The configuration is shown below.

![Expose KubeSphere Console](/images/docs/huawei-cce/en/expose-ks-console.png)

Default settings are OK for other detailed configurations. You can also set it as you need.

![Edit KubeSphere Console SVC](/images/docs/huawei-cce/en/edit-ks-console-svc.png)

After you set LoadBalancer for KubeSphere console, you can visit it via the given address. Go to KubeSphere login page and use the default account (username `admin` and pw `P@88w0rd`) to log in.

![Log in KubeSphere Console](/images/docs/huawei-cce/en/login-ks-console.png)

### Start add-ons via KubeSphere

When KubeSphere can be visited via the Internet, all the actions can be done on the console. Refer to the document - `Start add-ons in KubeSphere 3.0`.

💡 Notes: Before you start Istio, you have to delete `applications.app.k8s.io` built in Huawei CCE due to the CRD conflict. The simple way to do it is to use kubectl.

```bash
$ kubectl delete crd applications.app.k8s.io
```

After all add-ons are installed, go to the Cluster Management, and you will see the interface below. You can see all the started add-ons in `Add-Ons`.

![Full View of KubeSphere Console](/images/docs/huawei-cce/en/view-ks-console-full.png)
