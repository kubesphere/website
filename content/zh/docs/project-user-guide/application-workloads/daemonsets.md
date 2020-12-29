---
title: "守护进程集 (DaemonSet)"
keywords: 'KubeSphere, Kubernetes, DaemonSet, workload'
description: 'Kubernetes DaemonSets'
linkTitle: "守护进程集 (DaemonSet)"

weight: 10230
---

守护程序集管理多组复制的 Pod，同时确保所有（或某些）节点运行 Pod 的副本，保证在每个 Node 上都运行一个容器副本，将节点添加到集群后，DaemonSets会根据需要自动将Pod添加到新节点。

有关更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)。

## 使用 DaemonSets

在您要在所有或者没有任何用户干预的特定节点上部署正在运行的后台任务的情况下，DaemonSets 非常有用，例如：
- 在每个节点上运行日志收集守护程序, 比如 Fluentd 和 Logstash 等。
- 在每个节点上运行一个节点监视守护程序，比如 Prometheus Node Exporter、collected 和 AppDynamics Agent 等。
- 在每个节点上运行集群存储守护程序和系统程序，比如 Glusterd、Ceph、kube-dns 和 kube-proxy 等。

## 先决条件

您需要创建一个企业空间、一个项目以及一个帐户 (`project-regular`)。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project)。

## 创建 DaemonSet

### 步骤 1: Open Dashboard

以 `project-regular` 身份登录控制台。 转到项目的**应用负载**，选择**工作负载（Workload）**，然后在**守护进程集**选项卡下单击**创建**。

![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets.png)

### 步骤 2: 填写基本信息

为 DaemonSet 指定一个名称（例如 `demo-daemonset`），然后单击**下一步**继续。

![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets_form_1.png)

### 步骤 3: 设置镜像

1. 单击**添加容器镜像**。

    ![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets_form_2_container_btn.png)

2. 从公共 Docker Hub 或您指定的[私有镜像仓库](../../configuration/image-registry/)中输入镜像名称。 例如，在搜索栏中输入 `fluentd`，然后按 **Enter** 键。

    ![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets_form_2_container_1.png)

    {{< notice note >}}

- 在搜索栏中输入镜像名称后，请记得要按键盘上的 **Enter** 键。
- 如果要使用私有镜像仓库，则应首先在**配置中心**下的**密钥**中[创建私有镜像仓库密钥](../../configuration/image-registry/)。

    {{</ notice >}}

3. 根据您的需求设置对 CPU 和内存资源的预留和限制。 有关更多信息，请参见[容器镜像设置中的资源预留和资源限制](../container-image-settings/#add-container-image)。

    ![daemonset-request-limit](/images/docs/project-user-guide-zh/workloads-zh/daemonset-request-limit.png)

4. 服务设置里可以**使用默认端口**进行**服务设置**，您也可以自定义**协议**、**名称**和**容器端口**。

5. 从下拉菜单中选择镜像拉取策略。 有关更多信息，请参见容器镜像设置中的[镜像拉取策略](../container-image-settings/#add-container-image)。

6. 对于其他设置（**健康检查器**、**启动命令**、**环境变量**、**容器安全上下文（Security Context）**和**同步主机时区**），也可以在仪表板上对其进行配置。 有关更多信息，请参见[容器镜像设置](../container-image-settings/#add-container-image)中这些属性的详细说明。 完成后，单击右下角的 **√** 继续。

7. 从下拉菜单中选择一种更新策略。 建议您选择滚动更新 (RollingUpdate)。 有关更多信息，请参见[更新策略](../container-image-settings/#update-strategy)。

8. 选择部署模式。有关更多信息，请参见[部署模式](../container-image-settings/#deployment-mode)。

9. 完成设置容器镜像后，单击**下一步**转到下一步。

### 步骤 4: 挂载卷

您可以直接添加卷，也可以挂载 ConfigMap 或 Secret。 或者，直接单击**下一步**以跳过此步骤。有关卷的更多信息，请参考[卷](../../storage/volumes/#mount-a-volume)。

![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets_form_3.png)

{{< notice note >}}

DaemonSets 不能使用 StatefulSets 使用的卷模板。

{{</ notice>}}

### 步骤 5: 配置高级设置

您可以在此部分中添加元数据。 完成后，单击**创建**完成创建 DaemonSet 的整个过程。

![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets_form_4.png)

- **添加元数据**

  对资源进行额外的元数据设置，例如 `Label` 和 `Annotation`。

## 检查 DaemonSet 详细信息

### 详细页面

1. 创建 DaemonSet 后，它将显示在列表中，如下所示。 您可以单击右侧的三个点从菜单中选择操作修改 DaemonSet。

    ![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets_list.png)

    - **编辑**: 查看和编辑几本信息。
    - **编辑 YAMl**: 查看、上传、下载或者更新 YAML 文件。
    - **重新部署**: 重新部署 DaemonSet 。
    - **删除**: 删除 DaemonSet 。

2. 单击 DaemonSet 的名称，然后可以转到其详细信息页面。

    ![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets_detail.png)

3. 单击**更多操作**显示有关此 DaemonSet 的操作。

    ![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets_detail_operation_btn.png)

    - **版本回退**: 选择要回滚的版本。
    - **编辑服务**: 设置端口公开容器镜像和服务端口。
    - **编辑配置模版**: 配置更新策略、容器和卷
    - **编辑 YAML 文件**: 查看、上传、下载或更新 YAML 文件。
    - **重新部署**: 重新部署此 DaemonSet。
    - **删除**: 删除 DaemonSet，然后返回到 DaemonSet 列表页面。

4. 单击**资源状态**选项卡查看 DaemonSet 的端口和 Pod 信息。

    ![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets_detail_state.png)

    - **副本运行状态**: 您不能更改 DaemonSet 的 Pod 副本的数量。
    - **Pod 细节**

      ![daemonsets](/images/docs/project-user-guide-zh/workloads-zh/daemonsets_detail_pod.png)

        - Pod 列表提供 Pod 的详细信息（状态、节点、Pod IP 和资源使用情况）。
        - 您可以通过单击 Pod 条目查看容器信息。
        - 单击容器日志图标可以查看容器的输出日志。
        - 您可以通过单击 Pod 名称查看 Pod 详细信息页面。

### Revision Records

对工作负载的资源模板进行修改后会生成一个新的记录并重新调度容器组（Pod）进行版本的迭代，默认保存 10 个最近的版本。您可以根据版本记录进行重新部署。
