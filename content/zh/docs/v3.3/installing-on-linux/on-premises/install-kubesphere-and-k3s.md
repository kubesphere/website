---
title: "部署 K3s 和 KubeSphere"
keywords: 'Kubernetes, KubeSphere, K3s'
description: '了解如何使用 KubeKey 安装 K3s 和 KubeSphere。'
linkTitle: "部署 K3s 和 KubeSphere"
weight: 3530
---

[K3s](https://www.rancher.cn/k3s/) 是专为物联网和边缘计算打造的轻量级 Kubernetes 发行版，最大程度上剔除了外部依赖项。它打包为单个二进制文件，减少了搭建 Kubernetes 集群所需的依赖项和步骤。

您可以使用 KubeKey 同时安装 K3s 和 KubeSphere，也可以将 KubeSphere 部署在现有的 K3s 集群上。

{{< notice note >}} 

目前，由于功能尚未充分测试，在 K3s 上部署 KubeSphere 仅用于测试和开发。

{{</ notice >}} 

## 准备工作

- 有关安装 K3s 的准备工作的更多信息，请参阅 [K3s 文档](https://docs.rancher.cn/docs/k3s/installation/installation-requirements/_index)。
- 取决于您的网络环境，您可能需要配置防火墙规则和端口转发规则。有关更多信息，请参见[端口要求](../../../installing-on-linux/introduction/port-firewall/)。

## 步骤 1：下载 KubeKey

执行以下步骤下载 [KubeKey](../../../installing-on-linux/introduction/kubekey/)。

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或直接运行以下命令：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

首先运行以下命令，以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

运行以下命令来下载 KubeKey：

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{< notice note >}}

下载 KubeKey 之后，如果您将其转移到访问 Googleapis 受限的新机器上，请务必再次运行 `export KKZONE=cn`，然后继续执行以下步骤。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

通过以上的命令可以下载 KubeKey 的最新版本 (v2.3.0)。请注意，更早版本的 KubeKey 无法下载 K3s。

{{</ notice >}}

执行以下命令为 `kk` 文件增加执行权限：

```bash
chmod +x kk
```

## 步骤 2：创建集群

1. 执行以下命令为集群创建一个配置文件：

   ```bash
   ./kk create config --with-kubernetes v1.21.4-k3s --with-kubesphere v3.3.1
   ```

   {{< notice note >}}

   - KubeKey v2.3.0 支持安装 K3s v1.21.4。

   - 您可以在以上命令中使用 `-f` 或 `--file` 参数指定配置文件的路径和名称。如未指定路径和名称，KubeKey 将默认在当前目录下创建 `config-sample.yaml` 配置文件。

   {{</ notice >}} 

2. 执行以下命令编辑配置文件（以下以默认配置文件名为例）：

   ```bash
   vi config-sample.yaml
   ```

   ```yaml
   ...
   metadata:
     name: sample
   spec:
     hosts:
     - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123}
     - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
     - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
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
       version: v1.21.4-k3s
       imageRepo: kubesphere
       clusterName: cluster.local
     network:
       plugin: calico
       kubePodsCIDR: 10.233.64.0/18
       kubeServiceCIDR: 10.233.0.0/18
     registry:
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ...
   ```

   {{< notice note >}}

   有关配置文件中每个字段的更多信息，请参阅[示例文件](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md)。

   {{</ notice >}} 

3. 保存文件并执行以下命令安装 K3s 和 KubeSphere：

   ```
   ./kk create cluster -f config-sample.yaml
   ```

4. 安装完成后，可运行以下命令查看安装日志：

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
   ```

   如果显示如下信息则安装成功：

   ```bash
   #####################################################
   ###              Welcome to KubeSphere!           ###
   #####################################################
   
   Console: http://192.168.0.2:30880
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


5. 从安装日志的 `Console`、`Account` 和 `Password` 参数分别获取 KubeSphere Web 控制台的地址、系统管理员用户名和系统管理员密码，并使用 Web 浏览器登录 KubeSphere Web 控制台。

   {{< notice note >}}

   您可以在安装后启用 KubeSphere 的可插拔组件，但由于在 KubeSphere 上部署 K3s 目前处于测试阶段，某些功能可能不兼容。
   
   {{</ notice >}} 

