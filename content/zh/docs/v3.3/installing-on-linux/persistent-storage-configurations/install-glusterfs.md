---
title: "安装 GlusterFS"
keywords: 'KubeSphere, Kubernetes, GlusterFS, 安装, 配置, 存储'
description: '使用 KubeKey 搭建 KubeSphere 集群并配置 GlusterFS 存储。'
linkTitle: "安装 GlusterFS"
weight: 3340
---

[GlusterFS](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) 是 Kubernetes 中的树内 (in-tree) 存储插件。因此，您只需要安装存储类型。

本教程演示了如何使用 KubeKey 搭建 KubeSphere 集群并配置 GlusterFS 以提供存储服务。

{{< notice note >}}

本教程以 Ubuntu 16.04 为例。

{{</ notice >}} 

## 准备工作

您需要搭建 GlusterFS 集群并配置 Heketi。有关更多信息，请参见[搭建 GlusterFS 服务器](../../../reference/storage-system-installation/glusterfs-server/)。

## 步骤 1：配置客户端机器

您需要在全部客户端机器上安装 GlusterFS 客户端安装包。

1. 安装 `software-properties-common`。

   ```bash
   apt-get install software-properties-common
   ```

2. 添加社区 GlusterFS PPA。

   ```bash
   add-apt-repository ppa:gluster/glusterfs-7
   ```

3. 请确保使用的是最新安装包。

   ```bash
   apt-get update
   ```

4. 安装 GlusterFS 服务器。

   ```bash
   apt-get install glusterfs-server -y
   ```

5. 验证 GlusterFS 版本。

   ```bash
   glusterfs -V
   ```

## 步骤 2：为 GlusterFS 创建配置文件

单独的配置文件包含 GlusterFS 存储的全部参数，KubeKey 在安装过程中会使用这些参数。

1. 访问稍后想要在其上下载 KubeKey 的节点（任务机），运行以下命令创建配置文件。

   ```
   vi glusterfs-sc.yaml
   ```

   示例配置文件（包括 Heketi 密钥）：

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: heketi-secret
     namespace: kube-system
   type: kubernetes.io/glusterfs
   data:
     key: "MTIzNDU2"    #请替换为您自己的密钥。Base64 编码。
   ---
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     annotations:
       storageclass.beta.kubernetes.io/is-default-class: "true"
       storageclass.kubesphere.io/supported-access-modes: '["ReadWriteOnce","ReadOnlyMany","ReadWriteMany"]'
     name: glusterfs
   parameters:
     clusterid: "21240a91145aee4d801661689383dcd1"    #请替换为您自己的 GlusterFS 集群 ID。
     gidMax: "50000"
     gidMin: "40000"
     restauthenabled: "true"
     resturl: "http://192.168.0.2:8080"    #Gluster REST 服务/Heketi 服务 URL 可按需供应 gluster 存储卷。请替换为您自己的 URL。
     restuser: admin
     secretName: heketi-secret
     secretNamespace: kube-system
     volumetype: "replicate:3"    #请替换为您自己的存储卷类型。
   provisioner: kubernetes.io/glusterfs
   reclaimPolicy: Delete
   volumeBindingMode: Immediate
   allowVolumeExpansion: true
   ```

   {{< notice note >}}

   - 请使用字段 `storageclass.beta.kubernetes.io/is-default-class` 将 `glusterfs` 设置为默认存储类型。如果选择 `false`，KubeKey 将会安装 OpenEBS 作为默认存储类型。
   - 有关存储类型清单中参数的更多信息，请参见 [Kubernetes 文档](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#glusterfs)。

   {{</ notice >}} 

2. 保存文件。

## 步骤 3：下载 KubeKey

根据以下步骤在任务机上下载 [KubeKey](../../../installing-on-linux/introduction/kubekey/)。

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或者直接运行以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

首先运行以下命令，以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

运行以下命令来下载 KubeKey：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{< notice note >}}

下载 KubeKey 之后，如果您将其转移到访问 Googleapis 受限的新机器上，请务必再次运行 `export KKZONE=cn`，然后继续执行以下步骤。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

通过以上的命令，可以下载 KubeKey 的最新版本 (v2.2.2)。您可以更改命令中的版本号来下载特定的版本。

{{</ notice >}}

使 `kk` 可执行：

```bash
chmod +x kk
```

## 步骤 4：创建集群

1. 指定想要安装的 Kubernetes 版本和 KubeSphere 版本，例如：

   ```bash
   ./kk create config --with-kubernetes v1.22.10 --with-kubesphere v3.3.0
   ```

   {{< notice note >}}

   - 安装 KubeSphere 3.3.0 的建议 Kubernetes 版本：v1.19.x、v1.20.x、v1.21.x、v1.22.x 和 v1.23.x（实验性支持）。如果不指定 Kubernetes 版本，KubeKey 将默认安装 Kubernetes v1.23.7。有关受支持的 Kubernetes 版本的更多信息，请参见[支持矩阵](../../../installing-on-linux/introduction/kubekey/#支持矩阵)。

   - 如果您在此步骤的命令中不添加标志 `--with-kubesphere`，则不会部署 KubeSphere，只能使用配置文件中的 `addons` 字段安装，或者在您后续使用 `./kk create cluster` 命令时再次添加这个标志。
   - 如果您添加标志 `--with-kubesphere` 时不指定 KubeSphere 版本，则会安装最新版本的 KubeSphere。

   {{</ notice >}}

2. 如果您不自定义名称，将创建默认文件 `config-sample.yaml`。编辑文件：

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
   
3. 请特别注意 `addons` 字段，您必须在该字段下提供要创建的存储类型以及 Heketi 密钥的信息。有关文件中每个参数的更多信息，请参见[多节点安装](../../../installing-on-linux/introduction/multioverview/#2-编辑配置文件)。

4. 保存文件，执行以下命令安装 Kubernetes 和 KubeSphere：

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

5. 安装完成后，可以运行以下命令检查安装日志：

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
   ```

   预期输出：

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

## 步骤 5：验证安装

您可以使用命令行或者在 KubeSphere 的 Web 控制台验证 GlusterFS 是否成功安装。

### 命令行

运行以下命令行检查您的存储类型。

```bash
kubectl get sc
```

预期输出：

```bash
NAME                  PROVISIONER               RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
glusterfs (default)   kubernetes.io/glusterfs   Delete          Immediate           true                   104m
```

### KubeSphere 控制台

1. 使用默认帐户和密码 (`admin/P@88w0rd`) 通过 `<NodeIP>:30880` 登录 Web 控制台。点击左上角的**平台管理**，选择**集群管理**。

3. 访问**存储**下的**持久卷声明**，可以看到 PVC 正在使用。

   {{< notice note >}}
   
   有关如何在 KubeSphere 控制台上创建持久卷声明的更多信息，请参见[持久卷声明](../../../project-user-guide/storage/volumes/)。
   
   {{</ notice >}} 
   
3. 在**存储类**页面，可以看到集群中可用的存储类型。

