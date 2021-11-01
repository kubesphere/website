---
title: "CronJobs"
keywords: "KubeSphere, Kubernetes, Jobs, CronJobs"
description: "Learn basic concepts of CronJobs and how to create CronJobs on KubeSphere."
linkTitle: "CronJobs"
weight: 10260
---

CronJobs are useful for creating periodic and recurring tasks, like running backups or sending emails. CronJobs can also schedule individual tasks at a specific time or interval, such as scheduling a Job for when your cluster is likely to be idle.

For more information, see [the official documentation of Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/).

## Prerequisites

You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create a CronJob

### Step 1: Open the dashboard

Log in to the console as `project-regular`. Go to **Jobs** of a project, choose **CronJobs** and click **Create**.

### Step 2: Enter basic information

Enter the basic information. You can refer to the instructions below for each field. When you finish, click **Next**.

- **Name**: The name of the CronJob, which is also the unique identifier.
- **Alias**: The alias name of the CronJob, making resources easier to identify.
- **Schedule**: It runs a Job periodically on a given time-based schedule. Please see [CRON](https://en.wikipedia.org/wiki/Cron) for grammar reference. Some preset CRON statements are provided in KubeSphere to simplify the input. This field is specified by `.spec.schedule`. For this CronJob, enter `*/1 * * * *`, which means it runs once per minute.

  | Type        | CRON        |
  | ----------- | ----------- |
  | Every Hour  | `0 * * * *` |
  | Every Day   | `0 0 * * *` |
  | Every Week  | `0 0 * * 0` |
  | Every Month | `0 0 1 * *` |
  
- **Advanced Settings**:
  
  - **Maximum Start Delay (s)**. Specified by `.spec.startingDeadlineSeconds` in the manifest file, this optional field represents the maximum number of seconds that a ConJob can take to start if it misses the scheduled time for any reason. CronJobs that have missed executions will be counted as failed ones. If you do not specify this field, there is no deadline for the CronJob.
  - **Successful Jobs Retained**. Specified by `.spec.successfulJobsHistoryLimit` in the manifest file, this field represents the number of successful CronJob executions to retain. This is a pointer to distinguish between explicit zero and not specified. It defaults to 3.
  - **Failed Jobs Retained**. Specified by `.spec.failedJobsHistoryLimit` in the manifest file, this field represents the number of failed CronJob executions to retain. This is a pointer to distinguish between explicit zero and not specified. It defaults to 1.
  - **Concurrency Policy**. Specified by `.spec.concurrencyPolicy`, it represents how to treat concurrent executions of a Job:
      - **Run Jobs concurrently** (default): Run CronJobs concurrently.
      - **Skip new Job**: Forbid concurrent runs and skip the next run if the previous run hasn't finished yet.
      - **Skip old Job**: Cancels currently running Job and replaces it with a new one.

{{< notice note >}} 

You can enable **Edit YAML** in the upper-right corner to see the YAML manifest of this CronJob.

{{</ notice >}} 

### Step 3: Strategy settings (Optional)

Please refer to [Jobs](../jobs/#step-3-strategy-settings-optional).

### Step 4: Set a Pod

1. Click **Add Container** in **Containers**, enter `busybox` in the search box, and press **Enter**.

2. Scroll down to **Start Command** and enter `/bin/sh,-c,date; echo "KubeSphere!"` in the box under **Parameters**. 

3. Click **√** to finish setting the image and **Next** to continue.

    {{< notice note >}}

- This example CronJob prints `KubeSphere`. For more information about setting images, see [Container Image Settings](../container-image-settings/).
- For more information about **Restart Policy**, see [Jobs](../jobs/#step-4-set-image).
- You can skip **Volume Settings** and **Advanced Settings** for this tutorial. For more information, see [Mount Volumes](../deployments/#step-4-mount-volumes) and [Configure Advanced Settings](../deployments/#step-5-configure-advanced-settings) in Deployments.

    {{</ notice >}}

### Step 5: Check results

1. In the final step of **Advanced Settings**, click **Create** to finish. A new item will be added to the CronJob list if the creation is successful. Besides, you can also find Jobs under **Jobs** tab.

2. Under the **ConJobs** tab, click this CronJob and go to the **Job Records** tab where you can see the information of each execution record. There are 3 successful CronJob executions as the field **Successful Jobs Retained** is set to 3.

3. Click any of them and you will be directed to the Job details page.

4. In **Resource Status**, you can inspect the Pod status. Click <img src="/images/docs/project-user-guide/application-workloads/cronjobs/down-arrow.png" width="20px" /> on the right and click <img src="/images/docs/project-user-guide/application-workloads/cronjobs/container-log-icon.png" width="20px" /> to check the container log as shown below, which displays the expected output.

## Check CronJob Details

### Operations

On the CronJob detail page, you can manage the CronJob after it is created.

- **Edit Information**: Edit the basic information except `Name` of the CronJob.
- **Pause/Start**: Pause or start the Cronjob. Pausing a CronJob will tell the controller to suspend subsequent executions, which does not apply to executions that already start.
- **Edit YAML**: Edit the CronJob's specification in YAML format.
- **Delete**: Delete the CronJob, and return to the CronJob list page.

### Job records

Click the **Job Records** tab to view the records of the CronJob.

### Metadata

Click the **Metadata** tab to view the labels and annotations of the CronJob.

### Events

Click the **Events** tab to view the events of the CronJob.
