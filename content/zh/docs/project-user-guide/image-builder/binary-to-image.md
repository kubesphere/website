---
title: "Binary to Image：发布制品到 Kubernetes"
keywords: "KubeSphere, Kubernetes, Docker, B2I, Binary-to-Image"
description: "如何使用 Binary-to-Image 发布制品到 Kubernetes"
linkTitle: "Binary to Image：发布制品到 Kubernetes"
weight: 10620
---

Binary-to-Image (B2I) 是一个工具箱和工作流，用于从二进制可执行文件（例如 Jar、War 和二进制包）构建可再现容器镜像。更确切地说，您可以上传一个制品并指定一个目标仓库，例如 Docker Hub 或者 Harbor，用于推送镜像。如果一切运行成功，会推送您的镜像至目标仓库，并且如果您在工作流中创建服务 (Service)，也会自动部署应用程序至 Kubernetes。

在 B2I 工作流中，您不需要编写 Dockerfile。这不仅能降低学习成本，也能提升发布效率，使用户更加专注于业务。

本教程演示在 B2I 工作流中基于制品构建镜像的两种不同方式。最终，镜像会发布至 Docker Hub。

以下是一些示例制品，用于演示和测试，您可以用来实现 B2I 工作流：

| 制品包                                                       | GitHub 仓库                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [b2i-war-java8.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war) | [spring-mvc-showcase](https://github.com/spring-projects/spring-mvc-showcase) |
| [b2i-war-java11.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java11.war) | [springmvc5](https://github.com/kubesphere/s2i-java-container/tree/master/tomcat/examples/springmvc5) |
| [b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary) | [devops-go-sample](https://github.com/runzexia/devops-go-sample) |
| [b2i-jar-java11.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java11.jar) | [ java-maven-example](https://github.com/kubesphere/s2i-java-container/tree/master/java/examples/maven) |
| [b2i-jar-java8.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java8.jar) | [devops-java-sample](https://github.com/kubesphere/devops-java-sample) |

## 准备工作

- 您已启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要创建一个 [Docker Hub](http://www.dockerhub.com/) 帐户，也支持 GitLab 和 Harbor。
- 您需要创建一个企业空间、一个项目和一个用户 (`project-regular`)，请务必邀请该帐户至项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 设置一个 CI 专用节点用于构建镜像。该操作不是必需，但建议开发和生产环境进行设置，专用节点会缓存依赖项并缩短构建时间。有关更多信息，请参见[为缓存依赖项设置 CI 节点](../../../devops-user-guide/how-to-use/set-ci-node/)。

## 使用 Binary-to-Image (B2I) 创建服务

下图中的步骤展示了如何在 B2I 工作流中通过创建服务来上传制品、构建镜像并将其发布至 Kubernetes。

![服务构建](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/service-build.png)

### 步骤 1：创建 Docker Hub 密钥

您必须创建 Docker Hub 密钥，以便将通过 B2I 创建的 Docker 镜像推送至 Docker Hub。以 `project-regular` 身份登录 KubeSphere，转到您的项目并创建一个 Docker Hub 密钥。有关更多信息，请参见[创建常用密钥](../../../project-user-guide/configuration/secrets/#创建常用密钥)。

### 步骤 2：创建服务

1. 在该项目中，转到**应用负载**下的**服务**，点击**创建**。

   ![创建服务](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/create-service.PNG)

2. 下拉至**通过制品构建新的服务**，选择 **war**。本教程使用 [spring-mvc-showcase](https://github.com/spring-projects/spring-mvc-showcase) 项目作为示例并上传 war 制品至 KubeSphere。设置一个名称，例如 `b2i-war-java8`，点击**下一步**。

3. 在**构建设置**页面，请提供以下相应信息，并点击**下一步**。

   ![构建设置](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/build-settings.PNG)

   **服务类型**：本示例选择**无状态服务**。有关不同服务的更多信息，请参见[服务类型](../../../project-user-guide/application-workloads/services/#服务类型)。

   **上传制品**：上传 war 制品 ([b2i-war-java8](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war))。

   **构建环境**：选择 **kubesphere/tomcat85-java8-centos7:v2.1.0**。

   **镜像名称**：输入 `<DOCKERHUB_USERNAME>/<IMAGE NAME>` 或 `<HARBOR-PROJECT_NAME>/<IMAGE NAME>` 作为镜像名称。

   **tag**：镜像标签，请输入 `latest`。

   **Target image repository**：镜像会推送至 Docker Hub，故请选择 Docker Hub 密钥。
   
4. 在**容器设置**页面，下拉至**服务设置**，为容器设置访问策略。**协议**选择 **HTTP**，自定义名称（例如 `http-port`），**容器端口**和**服务端口**都输入 `8080`。点击**下一步**继续。

   ![容器设置](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/container-settings.PNG)

   {{< notice note >}}

   有关如何在**容器设置**页面设置其他参数的更多信息，请参见[容器镜像设置](../../../project-user-guide/application-workloads/container-image-settings/)。

   {{</ notice >}} 

5. 在**挂载存储**页面，您可以为容器添加存储卷。有关更多信息，请参见[存储卷](../../../project-user-guide/storage/volumes/)。

6. 在**高级设置**页面，选中**外网访问**并选择 **NodePort** 作为访问方式。点击**创建**完成整个操作过程。

   ![高级设置](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/advanced-settings.PNG)

7. 点击左侧导航栏的**构建镜像**，您可以看到正在构建示例镜像。![构建中](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/building.PNG)


### 步骤 3：查看结果

1. 稍等片刻，您可以看到镜像状态变为**成功**。

   ![构建成功](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/successful.PNG)

2. 点击该镜像前往其详情页面。在**任务记录**下，点击记录右侧的 <img src="/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/down-arrow.png" width="20px" /> 查看构建日志。如果一切运行正常，您可以在日志末尾看到 `Build completed successfully`。

   ![查看日志](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/inspect-logs.PNG)

3. 回到上一层页面，您可以看到该镜像相应的任务、部署和服务都已成功创建。

   #### 服务

   ![service](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/service.PNG)

   #### 部署

   ![deployment](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/deployment.PNG)

   #### 任务

   ![job](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/job.PNG)

4. 在您的 Docker Hub 仓库，您可以看到 KubeSphere 已经向仓库推送了带有预期标签的镜像。

   ![Docker 镜像](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/docker-image.PNG)

### 步骤 4：访问 B2I 服务

1. 在**服务**页面，请点击 B2I 服务前往其详情页面，您可以查看暴露的端口号。

   ![端口暴露](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/exposed-port.PNG)

2. 通过 `http://<Node IP>:<NodePort>/<Binary-Package-Name>/` 访问服务。

   ![访问服务](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/access-service.PNG)

   {{< notice note >}}

   取决于您的部署环境，您可能需要在安全组中放行端口并配置端口转发规则。

   {{</ notice >}} 

## 使用 Image Builder 构建镜像

前述示例通过创建服务来实现整个 B2I 工作流。此外，您也可以直接使用 Image Builder 基于制品构建镜像，但这个方式不会将镜像发布至 Kubernetes。

![build-binary](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/build-binary.png)

{{< notice note >}}

请确保您已经创建了 Docker Hub 密钥。有关更多信息，请参见[创建常用密钥](../../../project-user-guide/configuration/secrets/#创建常用密钥)。

{{</ notice >}} 

### 步骤 1：上传制品

1. 以 `project-regular` 身份登录 KubeSphere，转到您的项目。

2. 在左侧导航栏中选择**构建镜像**，然后点击**创建**。

   ![image-builder](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/image-builder.PNG)

3. 在弹出对话框中，选择 **binary** 并点击**下一步**。

   ![upload-artifact](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/upload-artifact.PNG)

4. 在**构建设置**页面，请提供以下相应信息，然后点击**创建**。

   ![buidling-settings-2](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/building-settings-2.PNG)

   **上传制品**：下载 [b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary) 并上传至 KubeSphere。

   **构建环境**：选择 **kubesphere/s2i-binary:v2.1.0**。

   **镜像名称**：自定义镜像名称。

   **tag**：镜像标签，请输入 `latest`。

   **Target image repository**：镜像会推送至 Docker Hub，故请选择 Docker Hub 密钥。

5. 在**构建镜像**页面，您可以看到正在构建镜像。

   ![构建状态](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/building-status.PNG)

### 步骤 2：检查结果

1. 稍等片刻，您可以看到镜像状态变为**成功**。

   ![构建成功](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/image-success.PNG)

2. 点击该镜像前往其详情页面。在**任务记录**下，点击记录右侧的 <img src="/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/down-arrow.png" width="20px" /> 查看构建日志。如果一切运行正常，您可以在日志末尾看到 `Build completed successfully`。

   ![查看日志](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/inspect-log.PNG)

3. 回到上一层页面，您可以看到该镜像相应的任务已成功创建。

   ![Job 已创建](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/job-created.PNG)

4. 在您的 Docker Hub 仓库，您可以看到 KubeSphere 已经向仓库推送了带有预期标签的镜像。

   ![Docker 镜像已推送](/images/docs/zh-cn/project-user-guide/image-builder/binary-to-image/docker-image-pushed.PNG)

