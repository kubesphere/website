---
title: "有状态副本集"
keywords: 'KubeSphere, Kubernetes, 有状态副本集, 仪表板, 服务'
description: '了解有状态副本集的基本概念以及如何在 KubeSphere 中创建有状态副本集。'
linkTitle: "有状态副本集"

weight: 10220
---

有状态副本集是用于管理有状态应用的工作负载 API 对象，负责一组容器组的部署和扩缩，并保证这些容器组的顺序性和唯一性。

与部署类似，有状态副本集管理基于相同容器规范的容器组。与部署不同的是，有状态副本集为其每个容器组维护一个粘性身份。这些容器组根据相同的规范而创建，但不能相互替换：每个容器组都有一个持久的标识符，无论容器组如何调度，该标识符均保持不变。

如果您想使用持久卷为工作负载提供持久化存储，可以使用有状态副本集作为解决方案的一部分。尽管有状态副本集中的单个容器组容易出现故障，但持久的容器组标识符可以更容易地将现有持久卷匹配到替换任意故障容器组的新容器组。

对于需要满足以下一个或多个需求的应用程序来说，有状态副本集非常有用。

- 稳定的、唯一的网络标识符。
- 稳定的、持久的存储。
- 有序的、优雅的部署和扩缩。
- 有序的、自动的滚动更新。

有关更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/workloads/controllers/statefulset/)。

## 准备工作

您需要创建一个企业空间、一个项目以及一个用户 (`project-regular`)，务必邀请该用户到项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建有状态副本集

在 KubeSphere 中，创建有状态副本集时也会创建 **Headless** 服务。您可以在项目的**应用负载**下的[服务](../services/)中找到 Headless 服务。

### 步骤 1：打开仪表板

以 `project-regular` 身份登录控制台。转到项目的**应用负载**，选择**工作负载**，然后在**有状态副本集**选项卡下点击**创建**。

### 步骤 2：输入基本信息

为有状态副本集指定一个名称（例如 `demo-stateful`），选择项目，然后点击**下一步**继续。

### 步骤 3：设置容器组

1. 设置镜像前，请点击**容器组副本数量**中的 <img src="/images/docs/v3.3/zh-cn/project-user-guide/application-workloads/statefulsets/plus-icon.png" width="20px" alt="icon" /> 或 <img src="/images/docs/v3.3/zh-cn/project-user-guide/application-workloads/statefulsets/minus-icon.png" width="20px" alt="icon" /> 来定义容器组的副本数量，该参数显示在清单文件中的 `.spec.replicas` 字段。

    {{< notice tip >}}

您可以启用右上角的**编辑 YAML**，查看 YAML 格式的有状态副本集清单文件。KubeSphere 使您可以直接编辑清单文件创建有状态副本集，或者您可以按照下列步骤使用仪表板创建有状态副本集。

    {{</ notice >}}

2. 点击**添加容器**。

3. 输入镜像名称，该镜像可以来自公共 Docker Hub，也可以来自您指定的[私有仓库](../../../project-user-guide/configuration/image-registry/)。例如，在搜索栏输入 `nginx` 然后按**回车键**。

    {{< notice note >}}

- 在搜索栏输入镜像名称后，请记得按键盘上的**回车键**。
- 如果想使用您的私有镜像仓库，您应该先通过**配置**下面的**保密字典**[创建镜像仓库保密字典](../../../project-user-guide/configuration/image-registry/)。

    {{</ notice >}}

4. 根据您的需求设置 CPU 和内存的资源请求和限制。有关更多信息，请参见[容器镜像设置中关于资源请求和资源限制的内容](../../../project-user-guide/application-workloads/container-image-settings/#添加容器镜像)。

5. 点击**使用默认端口**以自动填充**端口设置**，或者您可以自定义**协议**、**名称**和**容器端口**。

6. 从下拉列表中选择镜像拉取策略。有关更多信息，请参见[容器镜像设置中关于镜像拉取策略的内容](../../../project-user-guide/application-workloads/container-image-settings/#添加容器镜像)。

7. 对于其他设置（**健康检查**、**启动命令**、**环境变量**、**容器安全上下文** 以及**同步主机时区**），您也可以在仪表板上配置它们。有关更多信息，请参见[容器组设置](../../../project-user-guide/application-workloads/container-image-settings/#添加容器镜像)中对这些属性的详细说明。操作完成后，点击右下角的 **√** 继续。

8. 在下拉菜单中选择更新策略。建议您选择**滚动更新**。有关更多信息，请参见[更新策略](../container-image-settings/#更新策略)。

9. 选择容器组调度规则。有关更多信息，请参见[容器组调度规则](../../../project-user-guide/application-workloads/container-image-settings/#容器组调度规则)。

10. 完成容器组设置后，点击**下一步**继续。

### 步骤 4：挂载持久卷

有状态副本集可以使用持久卷模板，但是您必须提前在**存储**中创建它。有关持久卷的更多信息，请访问[持久卷](../../../project-user-guide/storage/volumes/#挂载持久卷)。完成后，点击**下一步**继续。

### 步骤 5：配置高级设置

您可以在此部分中设置节点调度策略并添加元数据。完成操作后，点击**创建**完成创建有状态副本集的整个流程。

- **选择节点**

  分配容器组副本在指定节点上运行。该参数在 `nodeSelector` 字段中指定。

- **添加元数据**

  为资源进行额外的元数据设置，例如**标签**和**注解**。

## 查看有状态副本集详情

### 详情页面

1. 有状态副本集创建后会显示列表中。您可以点击右边的 <img src="/images/docs/v3.3/zh-cn/project-user-guide/application-workloads/statefulsets/three-dots.png" width="20px" alt="icon" />，在弹出菜单中选择操作，修改您的有状态副本集。

    - **编辑信息**：查看并编辑基本信息。
    - **编辑 YAML**：查看、上传、下载或者更新 YAML 文件。
    - **重新创建**：重新创建该有状态副本集。
    - **删除**：删除该有状态副本集。

2. 点击有状态副本集名称可以进入它的详情页面。

3. 点击**更多操作**，显示您可以对该有状态副本集进行的操作。

    - **回退**：选择要回退的版本。
    - **编辑服务**：设置端口来暴露容器镜像和服务端口。
    - **编辑设置**：配置更新策略、容器和存储。
    - **编辑 YAML**：查看、上传、下载或者更新 YAML 文件。
    - **重新创建**：重新创建该有状态副本集。
    - **删除**：删除该有状态副本集并返回有状态副本集列表页面。

4. 点击**资源状态**选项卡，查看该有状态副本集的端口和容器组信息。

    - **副本运行状态**：点击 <img src="/images/docs/v3.3/common-icons/replica-plus-icon.png" width="20px" alt="icon" /> 或 <img src="/images/docs/v3.3/common-icons/replica-minus-icon.png" width="20px" alt="icon" /> 来增加或减少容器组副本数量。
    - **容器组**

        - 容器组列表中显示了容器组详情（运行状态、节点、容器组IP 以及资源使用情况）。
        - 您可以点击容器组条目查看容器信息。
        - 点击容器日志图标查看容器的输出日志。
        - 您可以点击容器组名称查看容器组详情页面。

### 版本记录

修改工作负载的资源模板后，会生成一个新的日志并重新调度容器组进行版本更新。默认保存 10 个最近的版本。您可以根据修改日志进行重新创建。

### 元数据

点击**元数据**选项卡以查看有状态副本集的标签和注解。

### 监控

1. 点击**监控**选项卡以查看有状态副本集的 CPU 使用量、内存使用量、网络流出速率和网络流入速率。

2. 点击右上角的下拉菜单以自定义时间范围和采样间隔。

3. 点击右上角的 <img src="/images/docs/v3.3/zh-cn/project-user-guide/application-workloads/statefulsets/statefulsets_autorefresh_start.png" alt="statefulsets_autorefresh_start" width="20px" alt="icon" />/<img src="/images/docs/v3.3/zh-cn/project-user-guide/application-workloads/statefulsets/statefulsets_autorefresh_stop.png" width="20px" alt="icon" /> 以开始或停止自动刷新数据。

4. 点击右上角的 <img src="/images/docs/v3.3/zh-cn/project-user-guide/application-workloads/statefulsets/statefulsets_refresh.png" width="20px" alt="icon" /> 以手动刷新数据。

### 环境变量

点击**环境变量**选项卡查看有状态副本集的环境变量。

### 事件

点击**事件**查看有状态副本集的事件。
