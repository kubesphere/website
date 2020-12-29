---
title: "有状态副本集 （StatefulSets）"
keywords: 'KubeSphere, Kubernetes, StatefulSets, dashboard, service'
description: 'Kubernetes StatefulSets'
linkTitle: "有状态副本集 （StatefulSets）"

weight: 10220
---

作为工作负载 API 对象，有状态副本集 （StatefulSets）用于管理有状态的应用程序。 它负责一组 Pod 的部署和扩展，并保证这些 Pod 的顺序和唯一性。

与 Deployment 类似 ，StatefulSet 管理基于相同容器规范的 Pod。 与 Deployment 不同的是，StatefulSet 为其每个 Pod 维护一个粘性身份。 这些 Pod 是根据相同的规范创建的，但不可互换：每个 Pod 都有一个持久性标识符，该标识符在任何重新调度中都会被维护。

如果希望使用存储卷为工作负载提供持久性存储，可以使用 StatefulSet 作为解决方案的一部分。 尽管 StatefulSet 中的单个 Pod 容易出现故障，但持久性的 Pod 标识符可以更容易地将现有的卷匹配到替换任何故障的新 Pod。

对于需要一个或多个以下应用程序的应用程序来说，StatefulSets 非常有用。

- 稳定的唯一网络标识符。
- 稳定的持久化存储。
- 有序部署、有序扩展。
- 有序收缩、有序删除。

有关更多信息，请参见 [Kubernetes 的官方文档](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)。

## 先决条件

您需要创建一个企业空间、一个项目以及一个帐户 (`project-regular`)。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../quick-start/create-workspace-and-project/)。

## 创建一个 StatefulSet

在 KubeSphere 中，创建 StatefulSet 时也会创建 **Headless** 服务。 您可以在项目的**应用负载**下的[服务](../services/)中找到 headless 服务。

### 步骤 1: 打开仪表板

以 `project-regular` 身份登录控制台。 转到项目的**应用负载**，选择**工作负载（Workload）**，然后在**有状态副本集**选项卡下单击**创建**。

![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets.png)

### 步骤 2: 输入基本信息

为 StatefulSet 指定一个名称（例如 `demo-stateful`），然后单击**下一步**继续。

![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_form_1.png)

### 步骤 3: 设置镜像

1. 在设置镜像之前，请通过单击 **+** 或 **-** 图标来定义容器组副本数量，这个值是清单文件里的 `.spec.replicas` 字段值。

    {{< notice tip >}}

通过启用右上角的**编辑模式**可以查看 YAML 格式的 StatefulSet 清单文件。KubeSphere 允许您直接编辑清单文件以创建 StatefulSet。 或者您可以按照以下步骤通过仪表板创建 StatefulSet。

    {{</ notice >}}
    
    ![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_form_2.png)

2. 单击**添加容器镜像**。

![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_form_2_container_btn.png)

3. 从公共 Docker Hub 或您指定的私有存储库中输入镜像名称。 例如，在搜索栏中输入 nginx，然后按 Enter 键。

    ![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_form_2_container_1.png)

    {{< notice note >}}

- 在搜索栏中输入镜像名称后，请记得要按键盘上的 **Enter** 键。
- 如果要使用私有镜像仓库，则应首先在**配置**下的**凭据**中[创建私有镜像仓库凭据](../../configuration/image-registry/)。

    {{</ notice >}}

4. 根据您的需求设置对 CPU 和内存资源的预留和限制。 有关更多信息，请参见[容器镜像设置中的资源预留和资源限制](../container-image-settings/#add-container-image)。

    ![statefulset-request-limit](/images/docs/project-user-guide-zh/workloads-zh/statefulset-request-limit.png)

5. 服务设置里可以**使用默认端口**进行**服务设置**，您也可以自定义**协议**、**名称**和**容器端口**。

6. 从下拉菜单中选择镜像拉取策略。 有关更多信息，请参见容器镜像设置中的[镜像拉取策略](../container-image-settings/#add-container-image)。

7. 对于其他设置（**健康检查器**、**启动命令**、**环境变量**、**容器安全上下文（Security Context）**和**同步主机时区**），也可以在仪表板上对其进行配置。 有关更多信息，请参见[容器镜像设置](../container-image-settings/#add-container-image)中这些属性的详细说明。 完成后，单击右下角的 **√** 继续。

8. 从下拉菜单中选择一种更新策略。 建议您选择滚动更新 (RollingUpdate)。 有关更多信息，请参见[更新策略](../container-image-settings/#update-strategy)。
   
![statefulset-update-strategy](/images/docs/project-user-guide-zh/workloads-zh/update-strategy.png)

9. 选择部署模式。有关更多信息，请参见[部署模式](../container-image-settings/#deployment-mode)。

10. 完成设置容器镜像后，单击**下一步**转到下一步。

### 步骤 4: 挂载卷

StatefulSets 可以使用卷模板，但是您必须提前在 **Storage** 中创建它。 有关卷的更多信息，请参考[卷](../../storage/volumes/#mount-a-volume)。 完成后，单击**下一步**继续。

![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_form_3.png)

### 步骤 5: 配置高级设置

您可以在此部分中设置节点调度策略并添加元数据。 完成后，单击**创建**完成创建 StatefulSet 的整个过程。

![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_form_4.png)

- **设置节点调度策略**

  可以让 Pod 副本在指定的节点上运行。 在字段 `nodeSelector` 中指定。

- **添加元数据**

  对资源进行额外的元数据设置，例如 `Label` 和 `Annotation`。

## 检查 StatefulSet 详细信息

### 详细页面

1. 创建 StatefulSet 后，它将显示在列表中，如下所示。 您可以单击右侧的三个点从菜单中选择操作修改 StatefulSet。

    ![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_list.png)

    - **编辑**: 查看和编辑几本信息。
    - **编辑 YAMl**: 查看、上传、下载或者更新 YAML 文件。
    - **重新部署**: 重新部署 StatefulSet.
    - **删除**: 删除 StatefulSet.

2. 单击 StatefulSet 的名称，然后可以转到其详细信息页面。

    ![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_detail.png)

3. 单击**更多操作**显示有关此 StatefulSet 的操作

    ![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_detail_operation_btn.png)

    - **版本回退**: 选择要回滚的版本。
    - **编辑服务**: 设置端口公开容器镜像和服务端口。
    - **编辑配置模版**: 配置更新策略、容器和卷
    - **编辑 YAML 文件**: 查看、上传、下载或更新 YAML 文件。
    - **重新部署**: 重新部署此 StatefulSet。
    - **删除**: 删除 StatefulSet，然后返回到 StatefulSet 列表页面。

4. 单击**资源状态**选项卡查看 StatefulSet 的端口和 Pod 信息。

    ![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_detail_state.png)

    - **副本运行状态**: 单击图像中的箭头可以增加或减少 Pod 副本的数量。
    - **Pod 细节**

        ![statefulsets](/images/docs/project-user-guide-zh/workloads-zh/statefulsets_detail_pod.png)

        - Pod 列表提供 Pod 的详细信息（状态、节点、Pod IP 和资源使用情况）。
        - 您可以通过单击 Pod 条目查看容器信息。
        - 单击容器日志图标可以查看容器的输出日志。
        - 您可以通过单击 Pod 名称查看 Pod 详细信息页面。

### 版本记录

对工作负载的资源模板进行修改后会生成一个新的记录并重新调度容器组（Pod）进行版本的迭代，默认保存 10 个最近的版本。您可以根据版本记录进行重新部署。
