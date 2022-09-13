---
title: "安装 NFS Client"
keywords: 'KubeSphere, Kubernetes, 存储, 安装, 配置, NFS'
description: '使用 KubeKey 搭建 KubeSphere 集群并配置 NFS 存储。'
linkTitle: "安装 NFS Client"
weight: 3330
---

本教程演示了如何搭建 KubeSphere 集群并配置 NFS 存储。

{{< notice note >}}

- 本教程以 Ubuntu 16.04 为例。
- NFS 与部分应用不兼容（例如 Prometheus），可能会导致容器组创建失败。如果确实需要在生产环境中使用 NFS，请确保您了解相关风险或咨询 KubeSphere 技术支持 support@kubesphere.cloud。

{{</ notice >}}

## 准备工作

您必须准备好提供外部存储服务的 NFS 服务器。请确保已在客户端机器允许访问的 NFS 服务器上创建并导出目录。有关更多信息，请参见[搭建 NFS 服务器](../../../reference/storage-system-installation/nfs-server/)。

## 步骤 1：配置客户端机器

请在所有客户端上安装 `nfs-common`，它提供必要的 NFS 功能，而无需安装其他服务器组件。

1. 执行以下命令确保使用最新软件包。

   ```bash
   sudo apt-get update
   ```

2. 在所有客户端上安装 `nfs-common`。

   ```bash
   sudo apt-get install nfs-common
   ```

3. 访问稍后想要下载 KubeKey 到其上的一台客户端机器（任务机）。创建一个配置文件，其中包含 NFS 服务器的全部必要参数，KubeKey 将在安装过程中引用该文件。

   ```bash
   vi nfs-client.yaml
   ```

   示例配置文件：

   ```yaml
   nfs:
     server: "192.168.0.2"    # This is the server IP address. Replace it with your own.
     path: "/mnt/demo"    # Replace the exported directory with your own.
   storageClass:
     defaultClass: false
   ```

   {{< notice note >}}

   - 如果想要配置更多的值，请参见 [NFS-client Chart 配置](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner#configuration)。
   - `storageClass.defaultClass` 字段决定是否将 NFS-client Provisioner 的存储类型设置为默认存储类型。如果您输入 `false`，KubeKey 将安装 [OpenEBS](https://github.com/openebs/openebs) 来提供本地卷，您在集群上创建工作负载时，不会动态供应本地持久卷。安装 KubeSphere 之后，您可以直接在控制台上更改默认存储类型。

   {{</ notice >}}

4. 保存文件。

## 步骤 2：下载 KubeKey

根据以下步骤在任务机上下载 [KubeKey](../../../installing-on-linux/introduction/kubekey/)。

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或者直接运行以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

首先运行以下命令，确保您从正确的区域下载 KubeKey。

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

通过以上命令，可以下载 KubeKey 的最新版本 (v2.2.2)。您可以更改命令中的版本号来下载特定的版本。

{{</ notice >}}

使 `kk` 可执行：

```bash
chmod +x kk
```

## 步骤 3：创建集群

1. 指定您想要安装的 Kubernetes 版本和 KubeSphere 版本，例如：

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
     - {name: client1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
     - {name: client2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
     - {name: client3, address: 192.168.0.5, internalAddress: 192.168.0.5, user: ubuntu, password: Testing123}
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
     - name: nfs-client
       namespace: kube-system
       sources:
         chart:
           name: nfs-client-provisioner
           repo: https://charts.kubesphere.io/main
           valuesFile: /home/ubuntu/nfs-client.yaml # Use the path of your own NFS-client configuration file.
   ...             
   ```

3. 请特别注意 `addons` 字段，您必须在该字段下提供 NFS-client 的信息。有关文件中每个参数的更多信息，请参见[多节点安装](../../../installing-on-linux/introduction/multioverview/#2-编辑配置文件)。

4. 保存文件，执行以下命令安装 Kubernetes 和 KubeSphere：

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

5. 安装完成后，可以使用以下命令检查安装日志：

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
   ```

   预期输出：

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

## 步骤 4：验证安装

您可以使用命令行或者从 KubeSphere 的 Web 控制台来验证  NFS-client 是否安装成功。

### 命令行

1. 运行以下命令检查存储类型：

   ```bash
   kubectl get sc
   ```

   预期输出：

   ```bash
   NAME              PROVISIONER                                       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
   local (default)   openebs.io/local                                  Delete          WaitForFirstConsumer   false                  16m
   nfs-client        cluster.local/nfs-client-nfs-client-provisioner   Delete          Immediate              true                   16m
   ```

   {{< notice note >}}

   若将 `nfs-client` 设置为默认存储类型，KubeKey 则不会安装 OpenEBS。

   {{</ notice >}} 

2. 运行以下命令检查 Pod 的状态。

   ```bash
   kubectl get pod -n kube-system
   ```

   请注意，`nfs-client` 安装在命名空间 `kube-system` 中，预期输出（不包括无关 Pod）：

   ```bash
   NAME                                                 READY   STATUS    RESTARTS   AGE
   nfs-client-nfs-client-provisioner-6fc95f4f79-92lsh   1/1     Running   0          16m
   ```

### KubeSphere 控制台

1. 使用默认帐户和密码 (`admin/P@88w0rd`) 通过 `<NodeIP>:30880` 登录 Web 控制台。点击左上角的**平台管理**，选择**集群管理**。

2. 选择**应用负载** > **容器组**，从下拉菜单中选择 `kube-system`，可以看到 `nfs-client` 的 Pod 正常运行。

3.  选择**存储** > **存储类型**，可以看到集群中可用的存储类型。

   {{< notice note >}}
   
   有关如何在 KubeSphere 控制台上创建持久卷声明的更多信息，请参见[持久卷声明](../../../project-user-guide/storage/volumes/)。
   
   {{</ notice >}} 
