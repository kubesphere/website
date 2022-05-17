---
title: "守护进程集"
keywords: 'KubeSphere, Kubernetes, 守护进程集, 工作负载'
description: '了解守护进程集的基本概念以及如何在 KubeSphere 中创建守护进程集。'
linkTitle: "守护进程集"

weight: 10230
---

守护进程集管理多组容器组副本，确保所有（或某些）节点运行一个容器组的副本。集群添加节点时，守护进程集会根据需要自动将容器组添加到新节点。

有关更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/workloads/controllers/daemonset/)。

## 使用守护进程集

如果您想在所有节点或者没有用户干预的特定节点上部署持续运行的后台任务，守护进程集会非常有用。例如：

- 在每个节点上运行日志收集守护进程，例如 Fluentd 和 Logstash 等。
- 在每个节点上运行节点监控守护进程，例如 Prometheus Node Exporter、collectd 和 AppDynamics Agent 等。
- 在每个节点上运行集群存储守护进程和系统程序，例如 Glusterd、Ceph、kube-dns 和 kube-proxy 等。

## 准备工作

您需要创建一个企业空间、一个项目和一个用户 (`project-regular`)，务必邀请该用户到项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建守护进程集

### 步骤 1：打开仪表板

以 `project-regular` 身份登录控制台。转到项目的**应用负载**，选择**工作负载**，点击**守护进程集**选项卡下面的**创建**。

### 步骤 2：输入基本信息

为该守护进程集指定一个名称（例如 `demo-daemonset`），点击**下一步**继续。

### 步骤 3：设置容器组

1. 点击**添加容器**。

2. 输入镜像名称，该镜像可以来自公共 Docker Hub，也可以来自您指定的[私有仓库](../../../project-user-guide/configuration/image-registry/)。例如，在搜索栏输入 `fluentd` 然后按**回车键**。

    {{< notice note >}}

- 在搜索栏输入镜像名称后，请记得按键盘上的**回车键**。
- 如果想使用您的私有镜像仓库，您应该先通过**配置**下面的**保密字典**[创建镜像仓库保密字典](../../../project-user-guide/configuration/image-registry/)。

    {{</ notice >}}

3. 根据您的需求设置 CPU 和内存的资源请求和限制。有关更多信息，请参见[容器镜像设置中关于资源请求和资源限制的内容](../../../project-user-guide/application-workloads/container-image-settings/#添加容器镜像)。

4. 点击**使用默认端口**以自动填充**端口设置**，或者您可以自定义**协议**、**名称**和**容器端口**。

5. 在下拉菜单中选择镜像拉取策略。有关更多信息，请参见[容器镜像设置中关于镜像拉取策略的内容](../../../project-user-guide/application-workloads/container-image-settings/#添加容器镜像)。

6. 对于其他设置（**健康检查**、**启动命令**、**环境变量**、**容器安全上下文** 以及**同步主机时区**），您也可以在仪表板上配置它们。有关更多信息，请参见[容器组设置](../../../project-user-guide/application-workloads/container-image-settings/#添加容器镜像)中对这些属性的详细说明。操作完成后，点击右下角的 **√** 继续。

7. 在下拉菜单中选择更新策略。建议您选择**滚动更新**。有关更多信息，请参见[更新策略](../../../project-user-guide/application-workloads/container-image-settings/#更新策略)。

8. 选择容器组调度规则。有关更多信息，请参见[容器组调度规则](../../../project-user-guide/application-workloads/container-image-settings/#容器组调度规则)。

9. 完成容器组设置后，点击**下一步**继续。

### 步骤 4：挂载卷

您可以直接添加持久卷或者挂载配置字典或保密字典，或者直接点击**下一步**跳过该步骤。有关持久卷的更多信息，请访问[持久卷声明](../../../project-user-guide/storage/volumes/#挂载持久卷)。

{{< notice note >}}

守护进程集无法使用持久卷声明模板，而有状态副本集可以使用。

{{</ notice>}}

### 步骤 5：配置高级设置

您可以在该部分添加元数据。完成操作后，点击**创建**完成创建守护进程集的整个流程。

- **添加元数据**

  为资源进行额外的元数据设置，例如**标签**和**注解**。

## 查看守护进程集详情

### 详情页面

1. 守护进程集创建后会显示列表中。您可以点击右边的 <img src="/images/docs/zh-cn/project-user-guide/application-workloads/daemonsets/three-dots.png" width="20px" />，在弹出菜单中选择操作，修改您的守护进程集。

    - **编辑信息**：查看并编辑基本信息。
    - **编辑 YAML**：查看、上传、下载或者更新 YAML 文件。
    - **重新创建**：重新创建该守护进程集。
    - **删除**：删除该守护进程集。

2. 点击守护进程集名称可以进入它的详情页面。

3. 点击**更多操作**，显示您可以对该守护进程集进行的操作。

    - **回退**：选择要回退的版本。
    - **编辑设置**：配置更新策略、容器和存储。
    - **编辑 YAML**：查看、上传、下载或者更新 YAML 文件。
    - **重新创建**：重新创建该守护进程集。
    - **删除**：删除该守护进程集并返回守护进程集列表页面。

4. 点击**资源状态**选项卡，查看该守护进程集的端口和容器组信息。

    - **副本运行状态**：您无法更改守护进程集的容器组副本数量。
    - **容器组**

      - 容器组列表中显示了容器组详情（运行状态、节点、容器组IP 以及资源使用情况）。
      - 您可以点击容器组条目查看容器信息。
      - 点击容器日志图标查看容器的输出日志。
      - 您可以点击容器组名称查看容器组详情页面。

### 版本记录

修改工作负载的资源模板后，会生成一个新的日志并重新调度容器组进行版本更新。默认保存 10 个最近的版本。您可以根据修改日志进行重新创建。

### 元数据

点击**元数据**选项卡以查看守护进程集的标签和注解。

### 监控

1. 点击**监控**选项卡以查看 CPU 使用量、内存使用量、网络流入速率和网络流出速率。

2. 点击右上角的下拉菜单以自定义时间范围和采样间隔。

3. 点击右上角的 <img src="/images/docs/zh-cn/project-user-guide/application-workloads/daemonsets/daemonsets_autorefresh_start.png" width="20px" />/<img src="/images/docs/zh-cn/project-user-guide/application-workloads/daemonsets/daemonsets_autorefresh_stop.png" width="20px" /> 以开始或停止自动刷新数据。

4. 点击右上角的 <img src="/images/docs/zh-cn/project-user-guide/application-workloads/daemonsets/daemonsets_refresh.png" width="20px" /> 以手动刷新数据。

### 环境变量

点击**环境变量**选项卡以查看守护进程集的环境变量。

### 事件

点击**事件**以查看守护进程集的事件。