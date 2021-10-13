---
title: "部署"
keywords: 'KubeSphere, Kubernetes, 部署, 工作负载'
description: '了解部署的基本概念以及如何在 KubeSphere 中创建部署。'
linkTitle: "部署"

weight: 10210
---

部署控制器为 Pod 和副本集提供声明式升级。您可以在部署对象中描述一个期望状态，部署控制器会以受控速率将实际状态变更为期望状态。一个部署运行着应用程序的几个副本，它会自动替换宕机或故障的实例。因此，部署能够确保应用实例可用，处理用户请求。

有关更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/workloads/controllers/deployment/)。

## 准备工作

您需要创建一个企业空间、一个项目和一个用户 (`project-regular`)，务必邀请该帐户到项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建部署

### 步骤 1：打开仪表板

以 `project-regular` 身份登录控制台。转到项目的**应用负载**，选择**工作负载**，点击**部署**选项卡下面的**创建**。

![部署](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployments.PNG)

### 步骤 2：输入基本信息

为该部署指定一个名称（例如 `demo-deployment`），点击**下一步**继续。

![输入部署名称](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployment-name.PNG)

### 步骤 3：设置镜像

1. 设置镜像前，请点击**容器组副本数量**中的 <img src="/images/docs/zh-cn/project-user-guide/application-workloads/deployments/plus-icon.png" width="20px" /> 或 <img src="/images/docs/zh-cn/project-user-guide/application-workloads/deployments/minus-icon.png" width="20px" /> 来定义 Pod 的副本数量，该参数显示在清单文件中的 `.spec.replicas` 字段。

    {{< notice tip >}}
您可以启用右上角的**编辑模式**，查看 YAML 格式的部署清单文件。KubeSphere 使您可以直接编辑清单文件创建部署，或者您可以按照下列步骤使用仪表板创建部署。
    {{</ notice >}}

    ![设置副本数量](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/replica-number.PNG)

2. 点击**添加容器镜像**。

    ![添加容器镜像](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/add-container-image.PNG)

3. 输入镜像名称，该镜像可以来自公共 Docker Hub，也可以来自您指定的[私有仓库](../../../project-user-guide/configuration/image-registry/)。例如，在搜索栏输入 `nginx` 然后按**回车键**。

    ![输入镜像名称](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/input-image-name.PNG)

    {{< notice note >}}

- 在搜索栏输入镜像名称后，请记得按键盘上的**回车键**。
- 如果想使用您的私有镜像仓库，您应该先通过**配置中心**下面的**密钥**[创建镜像仓库密钥](../../../project-user-guide/configuration/image-registry/)。

    {{</ notice >}}

4. 根据您的需求设置 CPU 和内存的资源请求和限制。有关更多信息，请参见[容器镜像设置中关于资源请求和资源限制的内容](../../../project-user-guide/application-workloads/container-image-settings/#添加容器镜像)。

    ![资源设置](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/resource-setting.PNG)

5. 点击**使用默认端口**以自动填充**端口设置**，或者您可以自定义**协议**、**名称**和**容器端口**。

6. 在下拉菜单中选择镜像拉取策略。有关更多信息，请参见[容器镜像设置中关于镜像拉取策略的内容](../../../project-user-guide/application-workloads/container-image-settings/#添加容器镜像)。

7. 对于其他设置（**健康检查器**、**启动命令**、**环境变量**、**容器 Security Context** 以及**同步主机时区**），您也可以在仪表板上配置它们。有关更多信息，请参见[容器镜像设置](../../../project-user-guide/application-workloads/container-image-settings/#添加容器镜像)中对这些属性的详细说明。操作完成后，点击右下角的 **√** 继续。

8. 在下拉菜单中选择更新策略。建议您选择**滚动更新**。有关更多信息，请参见[更新策略](../../../project-user-guide/application-workloads/container-image-settings/#更新策略)。

9. 选择部署模式。有关更多信息，请参见[部署模式](../../../project-user-guide/application-workloads/container-image-settings/#部署模式)。

10. 完成容器镜像设置后，点击**下一步**继续。

### 步骤 4：挂载存储卷

您可以直接添加存储卷或者挂载 ConfigMap 或密钥，或者直接点击**下一步**跳过该步骤。有关存储卷的更多信息，请访问[存储卷](../../../project-user-guide/storage/volumes/#挂载存储卷)。

![挂载存储](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/mount-volumes.PNG)

{{< notice note >}}

部署无法使用存储卷模板，而有状态副本集可以使用。

{{</ notice>}}

### 步骤 5：配置高级设置

您可以在该部分设置节点调度策略并添加元数据。完成操作后，点击**创建**完成创建部署的整个流程。

![高级设置](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/advanced-settings.PNG)

- **设置节点调度策略**

  您可以让 Pod 副本在指定节点上运行。该参数在 `nodeSelector` 字段中指定。

- **添加元数据**

  为资源进行额外的元数据设置，例如**标签**和**注解**。

## 查看部署详情

### 详情页面

1. 部署创建后会显示在下方的列表中。您可以点击右边的 <img src="/images/docs/zh-cn/project-user-guide/application-workloads/deployments/three-dots.png" width="20px" />，在弹出菜单中选择操作，修改您的部署。

    ![部署列表](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployment-listed.PNG)

    - **编辑**：查看并编辑基本信息。
    - **编辑配置文件**：查看、上传、下载或者更新 YAML 文件。
    - **重新部署**：重新部署该部署。
    - **删除**：删除该部署。

2. 点击部署名称可以进入它的详情页面。

    ![部署详情](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployment-detail-page.PNG)

3. 点击**更多操作**，显示您可以对该部署进行的操作。

    ![更多操作](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/more-actions.PNG)

    - **版本回退**：选择要回退的版本。
    - **弹性伸缩**：根据 CPU 和内存使用情况自动伸缩副本。如果 CPU 和内存都已指定，则在满足任一条件时会添加或删除副本。
    - **编辑配置模板**：配置更新策略、容器和存储卷。
    - **编辑配置文件**：查看、上传、下载或者更新 YAML 文件。
    - **重新部署**：重新部署该部署。
    - **删除**：删除该部署并返回部署列表页面。

4. 点击**资源状态**选项卡，查看该部署的端口和 Pod 信息。

    ![资源状态](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/resource-status.PNG)

    - **副本运行状态**：点击 <img src="/images/docs/zh-cn/project-user-guide/application-workloads/deployments/up-arrow.png" width="20px" /> 或 <img src="/images/docs/zh-cn/project-user-guide/application-workloads/deployments/down-arrow.png" width="20px" /> 来增加或减少 Pod 副本数量。
    - **Pod 详情**

        ![Pod 详情](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/pod-details.PNG)

        - Pod 列表中显示了 Pod 详情（运行状态、节点、Pod IP 以及资源使用情况）。
        - 您可以点击 Pod 条目查看容器信息。
        - 点击容器日志图标查看容器的输出日志。
        - 您可以点击 Pod 名称查看 Pod 详情页面。

### 版本记录

修改工作负载的资源模板后，会生成一个新的日志并重新调度 Pod 进行版本更新。默认保存 10 个最近的版本。您可以根据修改日志进行重新部署。

### 元数据

点击**元数据**选项卡以查看部署的标签和注解。

![deployments](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployments-matadata.png)

### 监控

1. 点击**监控**选项卡以查看部署的 CPU 使用量、内存使用量、网络流出速率和网络流入速率。

   ![deployments-monitoring](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployments-monitoring.png)

2. 点击右上角的下拉菜单以自定义时间范围和时间间隔。

   ![deployments](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployments-time-range.png)

3. 点击右上角的 <img src="/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployments_autorefresh_start.png" width="20px" />/<img src="/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployments_autorefresh_stop.png" width="20px" /> 以开始或停止数据自动刷新。 

4. 点击右上角的 <img src="/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployments_refresh.png" width="20px" /> 以手动刷新数据。

### 环境变量

点击**环境变量**选项卡以查看部署的环境变量。

![deployments](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployments-env-variables.png)

### 事件

点击**事件**选项卡以查看部署的事件。

![deployments](/images/docs/zh-cn/project-user-guide/application-workloads/deployments/deployments-events.png)