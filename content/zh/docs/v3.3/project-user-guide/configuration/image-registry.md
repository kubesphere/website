---
title: "镜像仓库"
keywords: 'KubeSphere, Kubernetes, Docker, 保密字典'
description: '了解如何在 KubeSphere 中创建镜像仓库。'
linkTitle: "镜像仓库"
weight: 10430
---

Docker 镜像是一个只读的模板，可用于部署容器服务。每个镜像都有一个唯一标识符（即`镜像名称:标签`）。例如，一个镜像可以包含只安装有 Apache 和几个应用的完整的 Ubuntu 操作系统软件包。镜像仓库可用于存储和分发 Docker 镜像。

本教程演示如何为不同的镜像仓库创建保密字典。

## 准备工作

您需要创建一个企业空间、一个项目和一个用户（例如 `project-regular`）。该用户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建保密字典

创建工作负载、[服务](../../../project-user-guide/application-workloads/services/)、[任务](../../../project-user-guide/application-workloads/jobs/)或[定时任务](../../../project-user-guide/application-workloads/cronjobs/)时，除了从公共仓库选择镜像，您还可以从私有仓库选择镜像。要使用私有仓库中的镜像，您必须先为私有仓库创建保密字典，以便在 KubeSphere 中集成该私有仓库。

### 步骤 1：进入保密字典页面

以 `project-regular` 用户登录 KubeSphere Web 控制台并进入项目，在左侧导航栏中选择**配置**下的**保密字典**，然后点击**创建**。

### 步骤 2：配置基本信息

设置保密字典的名称（例如 `demo-registry-secret`），然后点击**下一步**。

{{< notice tip >}}

您可以在对话框右上角启用**编辑 YAML** 来查看保密字典的 YAML 清单文件，并通过直接编辑清单文件来创建保密字典。您也可以继续执行后续步骤在控制台上创建保密字典。

{{</ notice >}} 

### 步骤 3：配置镜像服务信息

将**类型**设置为 **镜像服务信息**。要在创建应用负载时使用私有仓库中的镜像，您需要配置以下字段：

- **仓库地址**：镜像仓库的地址，其中包含创建应用负载时需要使用的镜像。
- **用户名**：登录镜像仓库所需的用户名。
- **密码**：登录镜像仓库所需的密码。
- **邮箱**（可选）：您的邮箱地址。

#### 添加 Docker Hub 仓库

1. 在 [Docker Hub](https://hub.docker.com/) 上添加镜像仓库之前，您需要注册一个 Docker Hub 帐户。在**保密字典设置**页面，将**仓库地址**设置为 `docker.io`，将**用户名**和**密码**分别设置为您的 Docker ID 和密码，然后点击**验证**以检查地址是否可用。

2. 点击**创建**。保密字典创建后会显示在**保密字典**界面。有关保密字典创建后如何编辑保密字典，请参阅[查看保密字典详情](../../../project-user-guide/configuration/secrets/#查看保密字典详情)。

#### 添加 Harbor 镜像仓库

[Harbor](https://goharbor.io/) 是一个开源的可信云原生仓库项目，用于对内容进行存储、签名和扫描。通过增加用户经常需要的功能，例如安全、身份验证和管理，Harbor 扩展了开源的 Docker Distribution。Harbor 使用 HTTP 和 HTTPS 为仓库请求提供服务。

**HTTP**

1. 您需要修改集群中所有节点的 Docker 配置。例如，如果外部 Harbor 仓库的 IP 地址为 `http://192.168.0.99`，您需要在 `/etc/systemd/system/docker.service.d/docker-options.conf` 文件中增加 `--insecure-registry=192.168.0.99` 标签。

   ```bash
   [Service]
   Environment="DOCKER_OPTS=--registry-mirror=https://registry.docker-cn.com --insecure-registry=10.233.0.0/18 --data-root=/var/lib/docker --log-opt max-size=50m --log-opt max-file=5 \
   --insecure-registry=192.168.0.99"
   ```

   {{< notice note >}} 

   - 请将镜像仓库的地址替换成实际的地址。

   - 有关 `Environment` 字段中的标签，请参阅 [Dockerd Options](https://docs.docker.com/engine/reference/commandline/dockerd/)。

   - Docker 守护进程需要 `--insecure-registry` 标签才能与不安全的仓库通信。有关该标签的更多信息，请参阅 [Docker 官方文档](https://docs.docker.com/engine/reference/commandline/dockerd/#insecure-registries)。

   {{</ notice >}}

2. 重新加载配置文件并重启 Docker。

   ```bash
   sudo systemctl daemon-reload
   ```

   ```bash
   sudo systemctl restart docker
   ```

3. 在 KubeSphere 控制台上进入创建保密字典的**数据设置**页面，将**类型**设置为**镜像服务信息**，将**仓库地址**设置为您的 Harbor IP 地址，并设置用户名和密码。

   {{< notice note >}} 

   如需使用 Harbor 域名而非 IP 地址，您需要在集群中配置 CoreDNS 和 nodelocaldns。

   {{</ notice >}} 
   
4. 点击**创建**。保密字典创建后会显示在**保密字典**页面。有关保密字典创建后如何编辑保密字典，请参阅[查看保密字典详情](../../../project-user-guide/configuration/secrets/#查看保密字典详情)。

**HTTPS**

有关如何集成基于 HTTPS 的 Harbor 仓库，请参阅 [Harbor 官方文档](https://goharbor.io/docs/1.10/install-config/configure-https/)。请确保您已使用 `docker login` 命令连接到您的 Harbor 仓库。

## 使用镜像仓库

如果您已提前创建了私有镜像仓库的保密字典，您可以选择私有镜像仓库中的镜像。例如，创建[部署](../../../project-user-guide/application-workloads/deployments/)时，您可以在**添加容器**页面点击**镜像**下拉列表选择一个仓库，然后输入镜像名称和标签使用镜像。

如果您使用 YAML 文件创建工作负载且需要使用私有镜像仓库，需要在本地 YAML 文件中手动添加 `kubesphere.io/imagepullsecrets` 字段，并且取值是 JSON 格式的字符串（其中 `key` 为容器名称，`value` 为保密字典名），以保证 `imagepullsecrets` 字段不被丢失，如下示例图所示。

![kubesphere-ecosystem](/images/docs/v3.3/project-user-guide/configurations/image-pull-secrets.png)
