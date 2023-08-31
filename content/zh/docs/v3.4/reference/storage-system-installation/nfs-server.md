---
title: "搭建 NFS 服务器"
keywords: 'Kubernetes, KubeSphere, NFS 服务器'
description: '如何搭建 NFS 服务器'
linkTitle: "搭建 NFS 服务器"
weight: 17410
---

KubeSphere 支持存储插件 [NFS-client Provisioner](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client)。若想使用该插件，必须预先配置 NFS 服务器。NFS 服务器配置完成后，NFS 客户端会在服务器机器上挂载目录，以便 NFS 客户端访问 NFS 服务器上的文件，即您需要创建并输出客户端机器可以访问的目录。

NFS 服务器机器就绪后，您可以使用 [KubeKey](../../../installing-on-linux/introduction/kubekey/) 通过 Helm Chart 来安装 NFS-client Provisioner 以及 Kubernetes 和 KubeSphere。您必须在 Chart 配置中提供 NFS 服务器的输出目录以便 KubeKey 在安装时使用。

{{< notice note >}}

- 您也可以在安装 KubeSphere 集群后创建 NFS-client 的存储类型。
- NFS 与部分应用不兼容（例如 Prometheus），可能会导致容器组创建失败。如果确实需要在生产环境中使用 NFS，请确保您了解相关风险或咨询 KubeSphere 技术支持 support@kubesphere.cloud。

{{</ notice >}} 

本教程演示了如何安装 NFS 服务器，以 Ubuntu 16.04 为例。

## 安装及配置 NFS 服务器

### 步骤 1：安装 NFS 服务器 (NFS kernel server)

若要设置服务器机器，就必须在机器上安装 NFS 服务器。

1. 运行以下命令，使用 Ubuntu 上的最新软件包进行安装。

   ```bash
   sudo apt-get update
   ```

2. 安装 NFS 服务器。

   ```bash
   sudo apt install nfs-kernel-server
   ```

### 步骤 2：创建输出目录

NFS 客户端将在服务器机器上挂载一个目录，该目录已由 NFS 服务器输出。

1. 运行以下命令来指定挂载文件夹名称（例如，`/mnt/demo`）。

   ```bash
   sudo mkdir -p /mnt/demo
   ```

2. 出于演示目的，请移除该文件夹的限制性权限，这样所有客户端都可以访问该目录。

   ```bash
   sudo chown nobody:nogroup /mnt/demo
   ```

   ```bash
   sudo chmod 777 /mnt/demo
   ```

### 步骤 3：授予客户端机器访问 NFS 服务器的权限

1. 运行以下命令：

   ```bash
   sudo nano /etc/exports
   ```

2. 将客户端信息添加到文件中。

   ```bash
   /mnt/demo clientIP(rw,sync,no_subtree_check)
   ```

   如果您有多台客户端机器，则可以将它们的客户端信息全部添加到文件中。或者，在文件中指定一个子网，以便该子网中的所有客户端都可以访问 NFS 服务器。例如：

   ```bash
   /mnt/demo 192.168.0.0/24(rw,sync,no_subtree_check)
   ```

   {{< notice note >}}

   - `rw`：读写操作。客户端机器拥有对卷的读写权限。
   - `sync`：更改将被写入磁盘和内存中。
   - `no_subtree_check`：防止子树检查，即禁用客户端挂载允许的子目录所需的安全验证。

   {{</ notice >}}

3. 编辑完成后，请保存文件。

### 步骤 4：应用配置

1. 运行以下命令输出共享目录。

   ```bash
   sudo exportfs -a
   ```

2. 重启 NFS 服务器。

   ```bash
   sudo systemctl restart nfs-kernel-server
   ```
