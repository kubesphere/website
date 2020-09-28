---
title: "Jobs"
keywords: "kubesphere, kubernetes, docker, jobs"
description: "Create a Kubernetes Job"

weight: 2260
---

A Job creates one or more Pods and ensures that a specified number of them successfully terminate. As pods successfully complete, the Job tracks the successful completions. When a specified number of successful completions is reached, the task (ie, Job) is complete. Deleting a Job will clean up the Pods it created.

A simple case is to create one Job object in order to reliably run one Pod to completion. The Job object will start a new Pod if the first Pod fails or is deleted (for example due to a node hardware failure or a node reboot).

You can also use a Job to run multiple Pods in parallel.

## Prerequisites

- You need to create a workspace, project and `project-regular` account. Please refer to the [Getting Started with Multi-tenant Management](../../../quick-start/create-workspace-and-project) if not yet.
- You need to sign in with `project-admin` account and invite `project-regular` to enter the corresponding project if not yet. Please refer to [Invite Member](../../../quick-start/create-workspace-and-project#task-3-create-a-project).

## Create a Job

### Step 1. Open Modal

1. Go to **Application Workloads** and click **Jobs**.
2. Click **Create** button to open the modal.

![](/images/docs/job-list.png)

### Step 2. Basic Info

Enter the basic information.

- **Name**: The name of the job, which is also the unique identifier.
- **Alias**: The alias name of the job, making resources easier to identify.

  ![](/images/docs/job-create-basic-info.png)

### Step 3. Job Settings

Enter the job parameters (optional).

![](/images/docs/job-create-job-settings.png)

#### Job Parameters

| Name                    | Definition                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Back of Limit           | `spec.backoffLimit`          | Specifies the number of retries before marking this job failed. Defaults to 6                                                                                                                                                                                                                                                                                                                                                            |
| Completions             | `spec.completions`           | Specifies the desired number of successfully finished pods the job should be run with. Setting to nil means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value. Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/ |
| Parallelism             | `spec.parallelism`           | Specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) < .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/                                         |
| Active Deadline Seconds | `spec.activeDeadlineSeconds` | Specifies the duration in seconds relative to the startTime that the job may be active before the system tries to terminate it; value must be positive integer                                                                                                                                                                                                                                                                           |

### Step 4. Container Image

Set up the **container images**.

![](/images/docs/job-container-settings.png)

- **Restart Policy** can only specify `Never` or `OnFailure`, when the job is not completed:

  - If Restart Policy specifies `Never`, the job creates a new Pod when the Pod fails, and the failed Pod does not disappear.
  - If Restart Policy specifies `OnFailure`, the job will internally restart the container when the Pod fails, instead of creating a new Pod.

- To add a container for the job, please refer to [Pod Containers](../deployments) for details.

### Step 5. Mount Volumes

Refer to [Pod Volumes](../deployments) for details.

### Step 6. Advanced Settings

Refer to [Deployment Advanced Settings](../deployments) for details.

### Step 7. Check Result

If success, a new item will be added the Job list.

![](/images/docs/job-list-new.png)

## Check Job detail

You can check the job's detail via click job's name in the list.

### Job Operations

- **Edit Info**: Editing the basic information except `Name` of the job, .
- **Rerun Job**: Re-run the job, the pod will restart, and a new execution record will be generated.
- **View YAML**: View the job's specification in YAML format.
- **Delete**: Delete the job, and return to the job list page.

  ![](/images/docs/job-actions.png)

### Execution Records

You can check the execution records of the job.

![](/images/docs/job-detail-records.jpg)

### Resource Status

Click **Resource Status** tab to check the pods of the job.

- The pod list provides the pod's detail information(conditions, phase, node, pod ip, monitoring).
- You can view the container info by click the pod item.
- Click the container log icon to view the output logs of the container.
- You can view the pod detail page by click the pod name.

![](/images/docs/job-detail-pods.png)
