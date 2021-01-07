---
title: "定时任务 (CronJob)"
keywords: "KubeSphere, Kubernetes, jobs, cronjobs"
description: "创建 KubeSphere 定时任务 (CronJob)"
linkTitle: "定时任务 (CronJob)"

weight: 10260
---

CronJobs 对于创建定期和重复执行的任务非常有用，例如运行备份或发送电子邮件。CronJobs 还可以在特定时间或间隔执行单个任务，例如在集群可能处于空闲状态时安排任务。

有关更多信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/).

## 先决条件

您需要创建一个企业空间、一个项目以及一个帐户 (`project-regular`)。必须邀请该帐户以 `operator` 身份加入该项目。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project)。

## 创建 CronJob

### 步骤 1: 打开控制台

以 `project-regular` 身份登录控制台。 转到项目的**应用负载**，选择**任务**，然后在**定时任务**选项卡下单击**创建**。

![cronjob-list](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/cronjob-list.png)

### 步骤 2: 输入基本信息

输入基本信息。 您可以参考以下图像的每个字段。 完成后，单击**下一步**。

![cronjob-create-basic-info](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/cronjob-create-basic-info.png)

- **名称**: CronJob 的名称，也是唯一的标识符。
- **别名**: CronJob 的别名, 帮助您更好的区分资源。
- **定时计划**: 按照给定的时间计划运行任务。语法参照 [CRON](https://en.wikipedia.org/wiki/Cron) 。KubeSphere 中提供了一些预置 CRON 语句，以简化输入。该字段由`.spec.schedule`指定。对于此 CronJob，输入`* / 1 * * * *`，这意味着它每分钟运行一次。

  | 类型       | CRON        |
  | ----------- | ----------- |
  | 每小时  | `0 * * * *` |
  | 每天   | `0 0 * * *` |
  | 每周  | `0 0 * * 0` |
  | 每月 | `0 0 1 * *` |
  
- **高级设置 (执行参数)**:
  
  - **启动 Job 的期限（秒）**. 由清单文件中的 `.spec.startingDeadlineSeconds` 指定，此可选字段表示如果由于任何原因错过计划时间，ConJob启动所需的最大秒数。错过执行的 CronJob 将被视为失败。 如果未指定此字段，则 CronJob 没有截止日期。
  - **保留完成 Job 数**. 由清单文件中的 `.spec.successfulJobsHistoryLimit` 指定，此字段表示要保留的成功 CronJob 执行次数。 如若未指定该字段，则默认值为 3。
  - **保留失败 Job 数**. 由清单文件中的 `.spec.failedJobsHistoryLimit` 指定，此字段表示要保留的 CronJob 执行失败的次数。 如若未指定该字段，则默认值为 1。
  - **并发策略**. 由 `.spec.concurrencyPolicy` 指定，它表示如何处理 Job 的并发执行。 有效值为:
      - **Allow** (默认值): 允许CronJobs并发运行。
      - **Forbid**: 禁止并发运行，如果前一个还没有完成，则直接跳过下一个。
      - **Replace**: 取消当前正在运行的 Job，用一个新的来替换。

{{< notice note >}}

您可以在右上角启用**编辑模式**查看此 CronJob 的 YAML 格式配置文件。

{{</ notice >}}

### 步骤 3: ConJob 设置 (可选)

请参阅 [任务（Jobs）](../jobs/#step-3-job-settings-optional)。

### 步骤 4: 设置镜像

1. 在**容器镜像**里单击 **添加容器镜像**  ，在搜索栏中输入 `busybox` 。

    ![input-busybox](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/input-busybox.png)

2. 向下滚动到**启动命令** 然后在**参数**框中输入 `/bin/sh,-c,date; echo "KubeSphere!"` 。

    ![start-command](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/start-command.png)

3. 单击 **√** 完成镜像设置，然后单击**下一步**继续。

    ![finish-image](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/finish-image.png)

    {{< notice note >}}

- 此示例 CronJob 打印字母 `KubeSphere`。 有关设置镜像的更多信息请参阅[容器镜像设置](../container-image-settings/)。
- 有关**重新启动策略**的更多信息，请参见[任务（Job）](../jobs/#step-4-set-image)。
- 您可以跳过本教程的**挂载存储**和**高级设置**。 有关更多信息，请参见在 Deployments 中[挂载存储](../deployments/#step-4-mount-volumes)和[配置高级设置](../deployments/#step-5-configure-advanced-settings)。

    {{</ notice >}}

### 步骤 5: 检查结果

1. 在**高级设置**的最后一步中，单击**创建**以完成。 如果创建成功，新项目将添加到 CronJob 列表中。 此外，您还可以在**任务（Jobs）**标签下找到作业任务。

    ![cronjob-list-new](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/cronjob-list-new.png)

    ![job-list](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/job-list.png)

2. 在 **ConJobs** 选项卡下，单击此 CronJob，然后转到**任务记录**选项卡，您可以在其中查看每个执行记录的信息。 由于将字段`successJobsHistoryLimit`设置为 3，因此只记录了成功执行 3 次的任务。

    ![execution-record](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/execution-record.png)

3. 单击其中任何一个，您将转到作业详细信息页面。

    ![job-detail-page](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/job-detail-page.png)

4. 在**资源状态**中，您可以检查 Pod 状态。 单击右侧的箭头，可以检查容器日志，如下所示，该日志显示了预期的输出。

    ![container-log-1](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/container-log-1.png)

    ![container-log-2](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/container-log-2.png)

## CronJob 操作

在 CronJob 详细信息页面上，您可以在创建 CronJob 之后对其进行管理。

- **编辑信息**: 编辑除了 CronJob `名称` 以外的基本信息。
- **暂停/启动**: 暂停或启动 Cronjob。 暂停 CronJob 将告诉控制器暂停后续任务，这不适用于已经开始执行的任务。
- **编辑 YAML**: 以 YAML 格式编辑 CronJob 的配置。
- **删除**: 删除 CronJob，然后返回到 CronJob 列表页面。

![cronjob-action](/images/docs/project-user-guide-zh/application-workloads-zh/cronjobs-zh/cronjob-action.png)