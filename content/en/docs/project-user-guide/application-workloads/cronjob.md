---
title: "CronJobs"
keywords: "kubesphere, kubernetes, jobs, cronjobs"
description: "Create a Kubernetes CronJob"

weight: 2260
---

CronJobs are useful for creating periodic and recurring tasks, like running backups or sending emails. CronJobs can also schedule individual tasks for a specific time, such as scheduling a Job for when your cluster is likely to be idle.

## Prerequisites

- You need to create a workspace, project and `project-regular` account. Please refer to the [Getting Started with Multi-tenant Management](../../../quick-start/create-workspace-and-project) if not yet.
- You need to sign in with `project-admin` account and invite `project-regular` to enter the corresponding project if not yet. Please refer to [Invite Member](../../../quick-start/create-workspace-and-project#task-3-create-a-project).

## Create a CronJob

### Step 1. Open Modal

1. Go to **Application Workloads** and click **CronJobs**.
2. Click **Create** button to open the modal.

![](/images/docs/cronjob-list.jpg)

### Step 2. Basic Info

Enter the basic information.

- **Name**: The name of the cronjob, which is also the unique identifier.
- **Alias**: The alias name of the cronjob, making resources easier to identify.
- **Schedule**: It runs a job periodically on a given time-based schedule. Please see [CRON](https://en.wikipedia.org/wiki/Cron) for grammar reference.

  > Some preset CRON statements are provided in kubesphere to simplify the input.
  >
  > | Type        | CRON        |
  > | ----------- | ----------- |
  > | Every Hour  | `0 * * * *` |
  > | Every Day   | `0 0 * * *` |
  > | Every Week  | `0 0 * * 0` |
  > | Every Month | `0 0 1 * *` |

- **Excution Parameters**
  - **_staringDeadlineSeconds_**  
    Optional deadline in seconds for starting the job if it misses scheduled time for any reason. Missed jobs executions will be counted as failed ones.
  - **_successfulJobsHistoryLimit_**  
    The number of successful finished jobs to retain. This is a pointer to distinguish between explicit zero and not specified. Defaults to 3.
  - **_failedJobsHistoryLimit_**  
    The number of failed finished jobs to retain. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.
  - **_concurrencyPolicy_**  
    Specifies how to treat concurrent executions of a Job. Valid values are:
      - **Allow** (default): allows CronJobs to run concurrently;
      - **Forbid**: forbids concurrent runs, skipping next run if previous run hasn't finished yet;
      - **Replace**: cancels currently running job and replaces it with a new one.

![](/images/docs/cronjob-create-basic-info.png)

### Step 3. CronJob Settings & Others

Please Refer to [Job Guide](../jobs#step-3-job-settings).

### Step 4. Check Result

If success, a new item will be added the Job list.

![](/images/docs/cronjob-list-new.png)

## Check CronJob detail

You can check the cronjob's detail via click cronjob's name in the list.

### CronJob Operations

- **Edit Info**: Edit the basic information except `Name` of the cronjob.
- **Pause | Start**: Pause or start the cronjob. Pause a cronjob will tell the controller to suspend subsequent executions, it does not apply to already started executions.
- **Edit YAML**: Edit the cronjob's specification in YAML format.
- **Delete**: Delete the cronjob, and return to the cronjob list page.

  ![](/images/docs/cronjob-actions.png)

### Execution Records

You can check the execution records of the job.

- Click the job name to view the job detail.

![](/images/docs/cronjob-detail-records.png)
