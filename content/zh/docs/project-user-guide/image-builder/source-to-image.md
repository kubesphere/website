---
title: "Source to Image：无需 Dockerfile 发布应用"
keywords: 'KubeSphere, Kubernetes, Docker, S2I, Source-to-Image'
description: '如何使用 Source-to-Image 发布应用程序。'
linkTitle: "Source to Image：无需 Dockerfile 发布应用"
weight: 10610
---

Source-to-Image (S2I) 是一个工具箱和工作流，用于从源代码构建可再现容器镜像。S2I 通过将源代码注入容器镜像，自动将编译后的代码打包成镜像。KubeSphere 集成 S2I 来自动构建镜像，并且无需任何 Dockerfile 即可发布到 Kubernetes。

本教程演示如何通过创建服务 (Service) 使用 S2I 将 Java 示例项目的源代码导入 KubeSphere。KubeSphere Image Builder 将基于源代码创建 Docker 镜像，将其推送至目标仓库，并发布至 Kubernetes。

![构建流程](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/build-process.png)

## 准备工作

- 您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)，该系统已集成 S2I。
- 您需要创建一个 [GitHub](https://github.com/) 帐户和一个 [Docker Hub](http://www.dockerhub.com/) 帐户，也支持 GitLab 和 Harbor。本教程使用 Github 仓库提供源代码，用于构建镜像并推送至 Docker Hub。
- 您需要创建一个企业空间、一个项目和一个用户 (`project-regular`)，请务必邀请该帐户至项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 设置一个 CI 专用节点用于构建镜像。该操作不是必需，但建议开发和生产环境进行设置，专用节点会缓存依赖项并缩短构建时间。有关更多信息，请参见[为缓存依赖项设置 CI 节点](../../../devops-user-guide/how-to-use/set-ci-node/)。

## 使用 Source-to-Image (S2I)

### 步骤 1：Fork 示例仓库

登录 GitHub 并 Fork GitHub 仓库 [devops-java-sample](https://github.com/kubesphere/devops-java-sample) 至您的 GitHub 个人帐户。

![Fork 仓库](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/fork-repository.PNG)

### 步骤 2：创建密钥 (Secret)

以 `project-regular` 身份登录 KubeSphere 控制台，转到您的项目，分别为 Docker Hub 和 GitHub 创建密钥。有关更多信息，请参见[创建常用密钥](../../../project-user-guide/configuration/secrets/#创建常用密钥)。

{{< notice note >}}

如果您 Fork 的是公开仓库，则不需要创建 GitHub 密钥。

{{</ notice >}} 

### 步骤 3：创建服务

1. 在该项目中，转到**应用负载**下的**服务**，点击**创建**。

   ![创建服务](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/create-service.PNG)

2. 选中**通过代码构建新的服务**下的 **Java**，将其命名为 `s2i-demo` 并点击**下一步**。

   ![选择语言类型](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/select-lang-type.PNG)

   {{< notice note >}}

   KubeSphere 已集成常用的 S2I 模板，例如 Java、Node.js 和 Python。如果您想使用其他语言或自定义 S2I 模板，请参见[自定义 S2I 模板](../s2i-templates/)。

   {{</ notice >}} 

3. 在**构建设置**页面，请提供以下相应信息，并点击**下一步**。

   ![构建设置](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/build_settings.png)

   **服务类型**：本示例选择**无状态服务**。有关不同服务的更多信息，请参见[服务类型](../../../project-user-guide/application-workloads/services/#服务类型)。

   **构建环境**：选择 **kubesphere/java-8-centos7:v2.1.0**。

   **代码地址**：源代码仓库地址（目前支持 Git）。您可以指定代码分支和在源代码终端的相对路径。URL 支持 HTTP 和 HTTPS。在该字段粘贴已 Fork 仓库的 URL（您自己仓库的地址）。

   ![复制仓库代码](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/copy-repo-code.PNG)

   **分支**：分支用于构建镜像。本教程中在此输入 `master`。您可以输入 `dependency` 进行缓存测试。

   **密钥**：您不需要为公共仓库提供密钥。如果您想使用私有仓库，请选择 GitHub 密钥。

   **镜像名称**：自定义镜像名称。本教程会向 Docker Hub 推送镜像，故请输入 `dockerhub_username/s2i-sample`。`dockerhub_username` 是您的 Docker ID，请确保该 ID 有权限推送和拉取镜像。

   **tag**：镜像标签，请输入 `latest`。

   **Target image repository**：镜像会推送至 Docker Hub，故请选择 Docker Hub 密钥。

   **高级设置**：您可以定义代码相对路径。该字段请使用默认的 `/`。

4. 在**容器设置**页面，下拉至**服务设置**，为容器设置访问策略。**协议**选择 **HTTP**，自定义名称（例如 `http-1`），**容器端口**和**服务端口**都输入 `8080`。

   ![服务设置](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/service-settings.PNG)

5. 下拉至**健康检查器**并选中，填写以下参数设置就绪探针。探针设置完成后点击 **√**，然后点击**下一步**继续。

   ![健康检查器](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/health-checker.PNG)

   **HTTP 请求**：选择 **HTTP** 作为协议，输入 `/` 作为路径（本教程中的根路径），输入 `8080` 作为暴露端口。

   **初始延迟**：容器启动后，存活探针启动之前等待的秒数。本字段输入 `30`。

   **超时时间**：探针超时的秒数。本字段输入 `10`。

   其他字段请直接使用默认值。有关如何在**容器设置**页面配置探针和设置其他参数的更多信息，请参见[容器镜像设置](../../../project-user-guide/application-workloads/container-image-settings/)。

6. 在**挂载存储**页面，您可以为容器添加存储卷。有关更多信息，请参见[存储卷](../../../project-user-guide/storage/volumes/)。点击**下一步**继续。

7. 在**高级设置**页面，选中**外网访问**并选择 **NodePort** 作为访问方式。点击**创建**完成整个操作过程。

   ![创建完成](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/create-finish.PNG)

8. 点击左侧导航栏的**构建镜像**，您可以看到正在构建示例镜像。

   ![构建中](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/building.PNG)

### 步骤 4：查看结果

1. 稍等片刻，您可以看到镜像状态变为**成功**。

   ![构建成功](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/successful-result.PNG)

2. 点击该镜像前往其详情页面。在**任务记录**下，点击记录右侧的 <img src="/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/down-arrow.png" width="20px" /> 查看构建日志。如果一切运行正常，您可以在日志末尾看到 `Build completed successfully`。

   ![构建日志](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/build-log.PNG)

3. 回到上一层页面，您可以看到该镜像相应的任务、部署和服务都已成功创建。

   #### 服务

   ![service](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/service.PNG)

   #### 部署

   ![deployment](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/deployment.PNG)

   #### 任务

   ![job](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/job.PNG)

4. 在您的 Docker Hub 仓库，您可以看到 KubeSphere 已经向仓库推送了带有预期标签的镜像。

   ![Docker 镜像](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/docker-image.PNG)

### 步骤 5：访问 S2I 服务

1. 在**服务**页面，请点击 S2I 服务前往其详情页面。

   ![Service 详情](/images/docs/zh-cn/project-user-guide/image-builder/source-to-image/service-detail.PNG)

2. 要访问该服务，您可以执行 `curl` 命令使用 Endpoint 或者访问 `<Node IP>:<Port Number>`。例如：

   ```bash
   $ curl 10.10.131.44:8080
   Really appreciate your star, that is the power of our life.
   ```

   {{< notice note >}}

   如果您想从集群外访问该服务，可能需要根据您的部署环境在安全组中放行端口并配置端口转发规则。

   {{</ notice >}} 