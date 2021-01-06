---
title: "为安装配置加速器"
keywords: 'KubeSphere, 加速器, 安装, FAQ'
description: '如何为安装配置加速器'
linkTitle: "为安装配置加速器"
weight: 16200
---

如果您无法从 `dockerhub.io` 下载镜像，强烈建议您预先配置仓库的镜像地址（即加速器）以加快下载速度。您可以参考[ Docker 官方文档](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon)，或执行以下步骤。

## 获取加速器地址

您需要获取仓库的一个镜像地址以配置加速器。以下示例介绍如何从阿里云获取加速器地址。

1. 登录阿里云控制台，在搜索栏中输入“容器镜像服务”，点击搜索结果中的**容器镜像服务**。

   ![container-registry.png](/images/docs/zh-cn/installing-on-linux/faq/configure-booster/container-registry.PNG)

2. 点击**镜像加速器**。

   ![image-booster](/images/docs/zh-cn/installing-on-linux/faq/configure-booster/image-booster.PNG)

3. 在如图所示的位置获取**加速器地址**，并按照页面上提供的阿里云官方操作文档配置加速器。

   ![booster-url](/images/docs/zh-cn/installing-on-linux/faq/configure-booster/booster-url.PNG)

## 配置仓库镜像地址

您可以直接配置 Docker 守护程序，也可以使用 KubeKey 进行配置。

### 配置 Docker 守护程序

{{< notice note >}}

采用此方法，您需要预先安装 Docker。

{{</ notice >}} 

1. 执行如下命令：

   ```bash
   sudo mkdir -p /etc/docker
   ```

   ```bash
   sudo vi /etc/docker/daemon.json
   ```

2. 在文件中添加 `registry-mirrors` 键值对。

   ```json
   {
     "registry-mirrors": ["https://<my-docker-mirror-host>"]
   }
   ```

   {{< notice note >}}

   请将命令中的地址替换成您实际的加速器地址。

   {{</ notice >}} 

3. 执行如下命令保存文件并重新加载 Docker，以使修改生效。

   ```bash
   sudo systemctl daemon-reload
   ```

   ```bash
   sudo systemctl restart docker
   ```

### 使用 KubeKey 配置仓库镜像地址

1. 在安装前用 KubeKey 创建 `config-sample.yaml` 文件，并定位到文件中的 `registry` 位置。

   ```yaml
   registry:
       registryMirrors: [] # For users who need to speed up downloads
       insecureRegistries: [] # Set an address of insecure image registry. See https://docs.docker.com/registry/insecure/
       privateRegistry: "" # Configure a private image registry for air-gapped installation (e.g. docker local registry or Harbor)
   ```

2. 在 `registryMirrors` 处填入仓库的镜像地址并保存文件。关于安装过程的更多信息，请参见[多节点安装](../../../installing-on-linux/introduction/multioverview/)。

{{< notice note >}}

[在 Linux 上通过 All-in-one 模式安装 KubeSphere](../../../quick-start/all-in-one-on-linux/) 不需要 `config-sample.yaml` 文件。该模式下请采用第一种方法进行配置。

{{</ notice >}}