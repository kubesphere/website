---
title: 任务
keywords: "KubeSphere, Kubernetes, docker, jobs"
description: "Create a Kubernetes Job"

weight: 2270
---

Job 会创建一个或者多个 Pods，并确保指定数量的 Pods 成功终止。 随着 Pods 成功结束，Job 跟踪记录成功完成的 Pods 个数。 当数量达到指定的成功个数阈值时，任务（即 Job）结束。 删除 Job 的操作会清除所创建的全部 Pods。

一种简单的使用场景下，你会创建一个 Job 对象以便以一种可靠的方式运行某 Pod 直到完成。 当第一个 Pod 失败或者被删除（比如因为节点硬件失效或者重启）时，Job 对象会启动一个新的 Pod。你也可以使用 Job 以并行的方式运行多个 Pod。



下面是在 KubeSphere 中的一个 Job 配置示例。它负责计算 π 到小数点后 2000 位，并将结果打印出来。 

## 前提条件

- 您需要创建一个工作区，一个项目和一个帐户（`project-regular`）。 如果尚未准备好，请参考[创建工作区，项目，帐户和角色](../../../quick-start/create-workspace-and-project)。
- 您需要先使用`project-admin`帐户登录，然后邀请 `project-regular`加入相应的项目。 如果尚未准备好，请首先[邀请成员](../../../quick-start/create-workspace-and-project#task-3-create-a-project)。

## 创建任务

### 第一步：打开工作台

以常规项目身份登录控制台。 访问**应用负载**，然后单击**任务，** 单击**创建**。

![create-job](/images/docs/project-user-guide/application-workloads/jobs/create-job-zh.png)

### 第二步：输入基本信息

输入基本信息。 请参考下图作为示例。

- **名称**：任务（Job）的名称，也是唯一的标识符。
- **别名**：任务（Job）的别名，使资源易于识别。
- **描述信息**：任务（Job）的描述，简要介绍了作业。

![job-create-basic-info](/images/docs/project-user-guide/application-workloads/jobs/job-create-basic-info-zh.png)

### 第三步： 任务设置（可选）

您可以按照以下步骤在此步骤中设置值，或单击**下一步**以使用默认值。 有关每个字段的详细说明，请参见下表。

![job-create-job-settings](/images/docs/project-user-guide/application-workloads/jobs/job-create-job-settings-zh.png)

| 名称                   | 定义                         | 描述信息                                                     |
| ---------------------- | ---------------------------- | ------------------------------------------------------------ |
| 最大重试次数           | `spec.backoffLimit`          | 设置为视 Job 为失败之前的重试次数。 失效回退的限制值默认为 6 |
| 完成数                 | `spec.completions`           | 设置完成数时，Job 控制器所创建的每个 Pod 使用完全相同的 [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。 这意味着任务的所有 Pod 都有相同的命令行，都使用相同的镜像和数据卷，甚至连 环境变量都（几乎）相同。 这些模式是让每个 Pod 执行不同工作的几种不同形式。有关更多信息，请参见 [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/). |
| 并行数                 | `spec.parallelism`           | 并行性请求（`.spec.parallelism`）可以设置为任何非负整数。 如果未设置，则默认为 1。 如果设置为 0，则 Job 相当于启动之后便被暂停，直到此值被增加。 有关更多信息，请参见 [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/). |
| 退出超时时限(单位：秒) | `spec.activeDeadlineSeconds` | 终止 Job 可以设置一个活跃期限。 你可以为 Job 的 `.spec.activeDeadlineSeconds` 设置一个秒数值。 该值适用于 Job 的整个生命期，无论 Job 创建了多少个 Pod。 一旦 Job 运行时间达到 `activeDeadlineSeconds` 秒，其所有运行中的 Pod 都会被终止，并且 Job 的状态更新为 `type: Failed` 及 `reason: DeadlineExceeded`。 |

### 第四步： 设置镜像

1. 为**重启策略**选择**从不**。 当任务未完成时，您只能为**重启策略**指定**从不**或 **OnFailure**：

   - 如果将**重新启动策略**设置为**从不**，则当 Pod 发生故障时，任务将创建一个新 Pod，并且失败的 Pod 不会消失。

   - 如果将**重新启动策略**设置为 **OnFailure**，则任务将在 Pod 发生故障时在内部重新启动容器，而不是创建新的 Pod。

    ![job-container-settings](/images/docs/project-user-guide/application-workloads/jobs/job-container-settings-zh.png)

2. 点击**添加容器镜像**，它将引导您进入**添加容器**页面。 在图片搜索栏中输入 **perl** ，然后按 **Return** 键。

    ![add-container-image-job](/images/docs/project-user-guide/application-workloads/jobs/add-container-image-job-zh.png)

3. 在同一页面上，向下滚动到**启动命令**。 在计算 pi 到 2000 位数的框中输入以下命令，然后打印出来。 单击右下角的**√**，然后选择**下一步**以继续。

    ```bash
    perl,-Mbignum=bpi,-wle,print bpi(2000)
    ```

    ![start-command-job](/images/docs/project-user-guide/application-workloads/jobs/start-command-job-zh.jpg)

    {{< notice note >}}有关设置图像的更多信息，请参见[容器镜像设置](../container-image-settings/)。{{</ notice >}}

### 第五步： 检查任务清单（可选）

1. 启用右上角的**编辑模式**，以显示任务的清单文件。 您可以看到所有值都是根据先前步骤中指定的值设置的。

    ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
      namespace: cc
      labels:
        app: job-test-1
      name: job-test-1
      annotations:
        kubesphere.io/alias-name: Test
        kubesphere.io/description: A job test
    spec:
      template:
        metadata:
          labels:
            app: job-test-1
          annotations:
            kubesphere.io/containerSecrets: null
        spec:
          containers:
            - name: container-xv4p2o
              imagePullPolicy: IfNotPresent
              image: perl
              command:
                - perl
                - '-Mbignum=bpi'
                - '-wle'
                - print bpi(2000)
          restartPolicy: Never
          serviceAccount: default
          initContainers: []
          volumes: []
          imagePullSecrets: null
      backoffLimit: 5
      parallelism: 2
      completions: 4
      activeDeadlineSeconds: 300
    ```

2. 您可以直接在清单中进行调整，然后单击**创建**或禁用**编辑模式**，然后返回**创建任务**页面。

    {{< notice note >}}您可以跳过本教程的**安装卷**和**高级设置**。 有关更多信息，请参见  [Pod 卷](../deployments/#step-4-mount-volumes) 和  [Deployment 高级设置](../deployments/#step-5-configure-advanced-settings)。{{</ notice >}}

### 第六步：检查结果

1. 在**高级设置**的最后一步中，单击**创建**以完成。 如果创建成功，新项目将添加到**任务**列表中。

    ![job-list-new](/images/docs/project-user-guide/application-workloads/jobs/job-list-new-zh.png)

2. 单击此任务，然后转到**执行记录**选项卡，您可以在其中查看每个执行记录的信息。 由于在步骤 3 中**完成次数**设置 **4**，因此完成了四个 Pod。

    ![execution-record](/images/docs/project-user-guide/application-workloads/jobs/execution-record-zh.jpg)

    {{< notice tip >}}如果任务失败，则可以重新运行该任务，其原因显示在**消息**下。{{</ notice >}}

3. 在**资源状态**中，您可以检查 Pod 状态。 每次将 **Parallelism** 设置为 2 时，都会创建两个 Pod。单击右侧的箭头，然后检查容器日志，如下所示，该日志显示了预期的计算结果。

    ![container-log](/images/docs/project-user-guide/application-workloads/jobs/container-log-zh.jpg)

    ![container-log-check](/images/docs/project-user-guide/application-workloads/jobs/container-log-check-zh.jpg)

    {{< notice tip >}}

- 在**资源状态**中，**Pod** 列表提供了 Pod 的详细信息（例如创建时间，节点，Pod IP 和监视数据）。
- 您可以通过单击 Pod 来查看容器信息。
- 单击容器日志图标以查看容器的输出日志。
- 您可以通过单击 Pod 名称查看 Pod 详细信息页面。

    {{</ notice >}}

## 任务操作

在任务详细信息页面上，您可以在创建任务后对其进行管理。

- **编辑信息**：编辑除**名称**以外的基本信息。
- **重新运行任务**：重新运行任务，Pod 将重新启动，并生成新的执行记录。
- **查看配置文件**：以 YAML 格式查看任务的规范。
- **删除**：删除任务并返回到任务列表页面。

![job-operation](/images/docs/project-user-guide/application-workloads/jobs/job-operation-zh.jpg)

