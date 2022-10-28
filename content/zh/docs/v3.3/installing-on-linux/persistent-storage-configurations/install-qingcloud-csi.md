---
title: "安装 QingCloud CSI"
keywords: 'KubeSphere, Kubernetes, QingCloud CSI, 安装, 配置, 存储'
description: '使用 KubeKey 搭建 KubeSphere 集群并配置 QingCloud CSI 存储。'
linkTitle: "安装 QingCloud CSI"
weight: 3320
---

如果您打算在[青云QingCloud](https://www.qingcloud.com/) 上安装 KubeSphere，可以选择 [QingCloud CSI](https://github.com/yunify/qingcloud-csi) 作为底层存储插件。

本教程演示了如何使用 KubeKey 搭建 KubeSphere 集群及配置 QingCloud CSI 以提供存储服务。

## 准备工作

您需要在[青云QingCloud 平台](https://intl.qingcloud.com/)上创建集群节点。

## 步骤 1：在青云QingCloud 平台上创建 API 密钥

若要确保该平台可以为集群创建云磁盘，就需要在单独的 QingCloud CSI 配置文件中提供 API 密钥（`qy_access_key_id` 和 `qy_secret_access_key`）。

1. 登录[青云QingCloud](https://console.qingcloud.com/login) 的 Web 控制台，从右上角的下拉菜单中选择 **API 密钥**。

   ![access-key](/images/docs/v3.3/zh-cn/installing-on-linux/persistent-storage-configurations/qingcloud-csi/access-key.png)

2. 点击**创建**生成密钥。创建完成后，下载密钥，该密钥存储在一个 csv 文件中。

## 步骤 2：为 QingCloud CSI 创建配置文件

单独的配置文件中包含 QingCloud CSI 的全部参数，KubeKey 将在安装过程中使用这些参数。

1. 访问您稍后想要下载 KubeKey 到其上的节点（任务机），运行以下命令创建配置文件。

   ```
   vi csi-qingcloud.yaml
   ```

   示例配置文件：

   ```yaml
   config:
     qy_access_key_id: "MBKTPXWCIRIEDQYQKXYL"    #请替换为您自己的密钥 id。
     qy_secret_access_key: "cqEnHYZhdVCVif9qCUge3LNUXG1Cb9VzKY2RnBdX"  #请替换为您自己的 API 密钥。
     zone: "pek3a"  #仅支持小写字母。
   sc:
     isDefaultClass: true #将其设置为默认存储类型。
   ```

2. 字段 `zone` 指定云磁盘创建的可用区。在青云QingCloud 平台，您必须在创建云磁盘之前指定一个可用区。

   ![storage-zone](/images/docs/v3.3/zh-cn/installing-on-linux/persistent-storage-configurations/qingcloud-csi/storage-zone.jpg)

   请确保为 `zone` 指定的值与以下区域 ID 匹配：

   | 可用区                                  | 区域 ID                 |
   | --------------------------------------- | ----------------------- |
   | 上海1区-A/上海1区-B                     | sh1a/sh1b               |
   | 北京3区-A/北京3区-B/北京3区-C/北京3区-D | pek3a/pek3b/pek3c/pek3d |
   | 广东2区-A/广东2区-B                     | gd2a/gd2b               |
   | 亚太2区-A                               | ap2a                    |

   如果想要配置更多的值，请参见 [QingCloud CSI Chart 配置](https://github.com/kubesphere/helm-charts/tree/master/src/test/csi-qingcloud#configuration)。
   
3. 保存文件。

## 步骤 3：下载 KubeKey

根据以下步骤在任务机上下载 [KubeKey](../../../installing-on-linux/introduction/kubekey/)。

{{< tabs >}}

{{< tab "如果您能够正常访问 GitHub/Googleapis" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或者直接运行以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

首先运行以下命令，确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

运行以下命令下载 KubeKey：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{< notice note >}}

下载 KubeKey 之后，如果您将其转移到访问 Googleapis 受限的新机器上，请务必再次运行 `export KKZONE=cn`，然后继续执行以下步骤。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

通过以上的命令，可以下载 KubeKey 的最新版本 (v2.3.0)。您可以更改命令中的版本号来下载特定的版本。

{{</ notice >}}

使 `kk` 可执行：

```bash
chmod +x kk
```

## 步骤 4：创建集群

1. 指定您想要安装的 Kubernetes 版本和 KubeSphere 版本，例如：

   ```bash
   ./kk create config --with-kubernetes v1.22.10 --with-kubesphere v3.3.1
   ```

   {{< notice note >}}

   - 安装 KubeSphere 3.3 的建议 Kubernetes 版本：v1.19.x、v1.20.x、v1.21.x、v1.22.x 和 v1.23.x（实验性支持）。如果不指定 Kubernetes 版本，KubeKey 将默认安装 Kubernetes v1.23.7。有关受支持的 Kubernetes 版本的更多信息，请参见[支持矩阵](../../../installing-on-linux/introduction/kubekey/#支持矩阵)。

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
       version: v1.21.5
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

3. 请特别注意 `addons` 字段，您必须在该字段下提供 QingCloud CSI 的信息。有关文件中每个参数的更多信息，请参见[多节点安装](../../../installing-on-linux/introduction/multioverview/#2-编辑配置文件)。

   {{< notice note >}}

   KubeKey 将通过 Helm Chart 安装 QingCloud CSI 及其 StorageClass。

   {{</ notice >}}

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

## 步骤 5：验证安装

您可以使用命令行或者通过 KubeSphere 的 Web 控制台来验证 QingCloud CSI 是否安装成功。

### 命令行

1. 运行以下命令检查存储类型。

   ```bash
   kubectl get sc
   ```

   预期输出：

   ```bash
   NAME                      PROVISIONER              RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
   csi-qingcloud (default)   disk.csi.qingcloud.com   Delete          WaitForFirstConsumer   true                   28m
   ```

2. 运行以下命令检查 Pod 的状态。

   ```bash
   kubectl get pod -n kube-system
   ```

   请注意，`csi-qingcloud` 安装在命名空间 `kube-system` 中，预期输出（不包括其他无关 Pod）：

   ```bash
   NAME                                       READY   STATUS    RESTARTS   AGE
   csi-qingcloud-controller-f95dcddfb-2gfck   5/5     Running   0          28m
   csi-qingcloud-node-7dzz8                   2/2     Running   0          28m
   csi-qingcloud-node-k4hsj                   2/2     Running   0          28m
   csi-qingcloud-node-sptdb                   2/2     Running   0          28m
   ```

### KubeSphere 控制台

1. 使用默认帐户和密码 (`admin/P@88w0rd`) 通过 `<NodeIP>:30880` 登录 Web 控制台。点击左上角的**平台管理**，选择**集群管理**。

2.  选择**应用负载** > **容器组**，从下拉菜单中选择 `kube-system`。可以看到 `csi-qingcloud` 的 Pod 正常运行。

3. 选择**存储**下的**存储类型**，可以看到集群中可用的存储类型。

   {{< notice note >}}
   
   有关如何在 KubeSphere 控制台创建持久卷声明的更多信息，请参见[持久卷声明](../../../project-user-guide/storage/volumes/)。
   
   {{</ notice >}} 
