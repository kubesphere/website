---
title: "Jobs"
keywords: "KubeSphere, Kubernetes, docker, jobs"
description: "Create a Kubernetes Job"

weight: 2260
---

A Job creates one or more Pods and ensures that a specified number of them successfully terminate. As pods successfully complete, the Job tracks the successful completions. When a specified number of successful completions is reached, the task (ie, Job) is complete. Deleting a Job will clean up the Pods it created.

A simple case is to create one Job object in order to reliably run one Pod to completion. The Job object will start a new Pod if the first Pod fails or is deleted (for example due to a node hardware failure or a node reboot). You can also use a Job to run multiple Pods in parallel.

The following example demonstrates specific steps of creating a Job (computing π to 2000 decimal places) in KubeSphere.

## Prerequisites

- You need to create a workspace, project and `project-regular` account. Please refer to [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project) if they are not ready yet.
- You need to sign in with `project-admin` account first and invite `project-regular` to the corresponding project. If it is not ready yet, please [invite a member](../../../quick-start/create-workspace-and-project#task-3-create-a-project) first.

## Create a Job

### Step 1. Open Modal

1. Log in the console as `project-regular`. Go to **Application Workloads** and click **Jobs**.
2. Click **Create** button to open the modal.

![create-job](/images/docs/project-user-guide/application-workloads/jobs/create-job.jpg)

### Step 2. Basic Info

Enter the basic information. Refer to the image below as an example.

- **Name**: The name of the job, which is also the unique identifier.
- **Alias**: The alias name of the job, making resources easier to identify.
- **Description**: The description of the job, which gives a brief introduction of the job.

![job-create-basic-info](/images/docs/project-user-guide/application-workloads/jobs/job-create-basic-info.png)

### Step 3. Job Settings (Optional)

You can set the values in this step as below or click **Next** to skip it directly. Refer to the table below for detailed explanations of each field.

![job-create-job-settings](/images/docs/project-user-guide/application-workloads/jobs/job-create-job-settings.png)

| Name                    | Definition                   | Description                                                  |
| ----------------------- | ---------------------------- | ------------------------------------------------------------ |
| Back off Limit          | `spec.backoffLimit`          | It specifies the number of retries before this job is marked failed. It defaults to 6. |
| Completions             | `spec.completions`           | It specifies the desired number of successfully finished pods the job should be run with. Setting it to nil means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value. Setting it to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. For more information, see [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/). |
| Parallelism             | `spec.parallelism`           | It specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in a steady state will be less than this number when the work left to do is less than max parallelism ((`.spec.completions - .status.successful`) < `.spec.parallelism`). For more information, see [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/). |
| Active Deadline Seconds | `spec.activeDeadlineSeconds` | It specifies the duration in seconds relative to the startTime that the job may be active before the system tries to terminate it; the value must be a positive integer. |

### Step 4. Container Image

1. Select **Never** for **Restart Policy**. You can only specify **Never** or **OnFailure** for **Restart Policy** when the job is not completed:

   - If **Restart Policy** is set to **Never**, the job creates a new Pod when the Pod fails, and the failed Pod does not disappear.

   - If **Restart Policy** is set to **OnFailure**, the job will internally restart the container when the Pod fails, instead of creating a new Pod.

![job-container-settings](/images/docs/project-user-guide/application-workloads/jobs/job-container-settings.png)

2. Click **Add Container Image** which directs you to the **Add Container** page. Enter `perl` in the image search bar and press the **Return** key.

![add-container-image-job](/images/docs/project-user-guide/application-workloads/jobs/add-container-image-job.png)

3. On the same page, scroll down to **Start Command**. Input the following commands in the box which computes pi to 2000 places then prints it. Click **√** in the bottom right corner and select **Next** to continue.

```bash
perl,-Mbignum=bpi,-wle,print bpi(2000)
```

![start-command-job](/images/docs/project-user-guide/application-workloads/jobs/start-command-job.jpg)

### Step 5. Inspect Job Manifest (Optional)

1. Enable **Edit Mode** in the top right corner which displays the manifest file of the job. You can see all the values are set based on what you have specified in the previous steps.

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

2. You can make adjustments in the manifest directly and click **Create** or disable the **Edit Mode** and get back to the **Create Job** page.

{{< notice note >}} 

You can skip **Mount Volumes** and **Advanced Settings** for this tutorial. For more information, see [Pod Volumes](../deployments) and [Deployment Advanced Settings](../deployments).

{{</ notice >}}

### Step 6. Check Result

1. In the final step of **Advanced Settings**, click **Create** to finish. A new item will be added the Job list if the creation is successful.

![job-list-new](/images/docs/project-user-guide/application-workloads/jobs/job-list-new.png)

2. Click this job and go to **Execution Records** tab where you can see the information of each execution record. There are four completed Pods since **Completions** was set to `4` in Step 3.

![execution-record](/images/docs/project-user-guide/application-workloads/jobs/execution-record.jpg)

{{< notice tip >}}

You can rerun the job if it fails, the reason of which displays under **Messages**.

{{</ notice >}}

3. In **Resource Status**, you can inspect the Pod status. Two pods were created each time as **Parallelism** was set to 2. Click the arrow on the right and check the container log as shown below, which displays the expected calculation result.

![container-log](/images/docs/project-user-guide/application-workloads/jobs/container-log.jpg)

![container-log-check](/images/docs/project-user-guide/application-workloads/jobs/container-log-check.jpg)

{{< notice tip >}}

- In **Resource Status**, the pod list provides the pod's detailed information (e.g. creation time, node, pod IP and monitoring data).
- You can view the container information by clicking the pod.
- Click the container log icon to view the output logs of the container.
- You can view the pod detail page by clicking the pod name.

{{</ notice >}} 

## Job Operations

On the job detail page, you can manage the job after it is created.

- **Edit Info**: Edit the basic information except `Name` of the job.
- **Rerun Job**: Rerun the job, the pod will restart, and a new execution record will be generated.
- **View YAML**: View the job's specification in YAML format.
- **Delete**: Delete the job and return to the job list page.

![job-operation](/images/docs/project-user-guide/application-workloads/jobs/job-operation.jpg)