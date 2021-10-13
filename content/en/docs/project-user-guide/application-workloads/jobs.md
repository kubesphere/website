---
title: "Jobs"
keywords: "KubeSphere, Kubernetes, docker, jobs"
description: "Learn basic concepts of Jobs and how to create Jobs in KubeSphere."
linkTitle: "Jobs"

weight: 10250
---

A Job creates one or more Pods and ensures that a specified number of them successfully terminates. As Pods successfully complete, the Job tracks the successful completions. When a specified number of successful completions is reached, the task (namely, Job) is complete. Deleting a Job will clean up the Pods it created.

A simple case is to create one Job object in order to reliably run one Pod to completion. The Job object will start a new Pod if the first Pod fails or is deleted (for example, due to a node hardware failure or a node reboot). You can also use a Job to run multiple Pods in parallel.

The following example demonstrates specific steps of creating a Job (computing π to 2000 decimal places) on KubeSphere.

## Prerequisites

You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create a Job

### Step 1: Open the dashboard

Log in to the console as `project-regular`. Go to **Jobs** under **Application Workloads** and click **Create**.

![create-job](/images/docs/project-user-guide/application-workloads/jobs/click-create.png)

### Step 2: Enter basic information

Enter the basic information. Refer to the image below as an example.

- **Name**: The name of the Job, which is also the unique identifier.
- **Alias**: The alias name of the Job, making resources easier to identify.
- **Description**: The description of the Job, which gives a brief introduction of the Job.

![job-create-basic-info](/images/docs/project-user-guide/application-workloads/jobs/basic-info.png)

### Step 3: Job settings (optional)

You can set the values in this step as below or click **Next** to use the default values. Refer to the table below for detailed explanations of each field.

![job-create-job-settings](/images/docs/project-user-guide/application-workloads/jobs/job-settings.png)

| Name                    | Definition                   | Description                                                  |
| ----------------------- | ---------------------------- | ------------------------------------------------------------ |
| Back off Limit          | `spec.backoffLimit`          | It specifies the number of retries before this Job is marked failed. It defaults to 6. |
| Completions             | `spec.completions`           | It specifies the desired number of successfully finished Pods the Job should be run with. Setting it to nil means that the success of any Pod signals the success of all Pods, and allows parallelism to have any positive value. Setting it to 1 means that parallelism is limited to 1 and the success of that Pod signals the success of the Job. For more information, see [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/). |
| Parallelism             | `spec.parallelism`           | It specifies the maximum desired number of Pods the Job should run at any given time. The actual number of Pods running in a steady state will be less than this number when the work left to do is less than max parallelism ((`.spec.completions - .status.successful`) < `.spec.parallelism`). For more information, see [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/). |
| Active Deadline Seconds | `spec.activeDeadlineSeconds` | It specifies the duration in seconds relative to the startTime that the Job may be active before the system tries to terminate it; the value must be a positive integer. |

### Step 4: Set an image

1. Select **Never** for **Restart Policy**. You can only specify **Never** or **OnFailure** for **Restart Policy** when the Job is not completed:

   - If **Restart Policy** is set to **Never**, the Job creates a new Pod when the Pod fails, and the failed Pod does not disappear.

   - If **Restart Policy** is set to **OnFailure**, the Job will internally restart the container when the Pod fails, instead of creating a new Pod.

    ![job-container-settings](/images/docs/project-user-guide/application-workloads/jobs/restart-policy.png)

2. Click **Add Container Image** which directs you to the **Add Container** page. Enter `perl` in the image search bar and press **Enter**.

    ![add-container-image-job](/images/docs/project-user-guide/application-workloads/jobs/set-image.png)

3. On the same page, scroll down to **Start Command**. Enter the following commands in the box which computes pi to 2000 places then prints it. Click **√** in the lower-right corner and select **Next** to continue.

    ```bash
    perl,-Mbignum=bpi,-wle,print bpi(2000)
    ```

    ![start-command-job](/images/docs/project-user-guide/application-workloads/jobs/start-command.png)

    {{< notice note >}}For more information about setting images, see [Container Image Settings](../container-image-settings/).{{</ notice >}}

### Step 5: Inspect the Job manifest (optional)

1. Enable **Edit Mode** in the upper-right corner which displays the manifest file of the Job. You can see all the values are set based on what you have specified in the previous steps.

    ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
      namespace: demo-project
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
        spec:
          containers:
            - name: container-4rwiyb
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
      completions: 4
      parallelism: 2
      activeDeadlineSeconds: 300
    ```
    
2. You can make adjustments in the manifest directly and click **Create** or disable the **Edit Mode** and get back to the **Create Job** page.

    {{< notice note >}}You can skip **Mount Volumes** and **Advanced Settings** for this tutorial. For more information, see [Mount volumes](../deployments/#step-4-mount-volumes) and [Configure advanced settings](../deployments/#step-5-configure-advanced-settings).{{</ notice >}}

### Step 6: Check the result

1. In the final step of **Advanced Settings**, click **Create** to finish. A new item will be added to the Job list if the creation is successful.

    ![job-list-new](/images/docs/project-user-guide/application-workloads/jobs/job-in-list.png)

2. Click this Job and go to **Execution Records** where you can see the information of each execution record. There are four completed Pods since **Completions** was set to `4` in Step 3.

    ![execution-record](/images/docs/project-user-guide/application-workloads/jobs/exe-records.png)

    {{< notice tip >}}
You can rerun the Job if it fails, the reason of which displays under **Messages**.
    {{</ notice >}}

3. In **Resource Status**, you can inspect the Pod status. Two Pods were created each time as **Parallelism** was set to 2. Click <img src="/images/docs/project-user-guide/application-workloads/jobs/down-arrow.png" width="20px" /> on the right and check the container log as shown below, which displays the expected calculation result.

    ![container-log](/images/docs/project-user-guide/application-workloads/jobs/resource-status.png)

    ![container-log-check](/images/docs/project-user-guide/application-workloads/jobs/log.png)

    {{< notice tip >}}

- In **Resource Status**, the Pod list provides the Pod's detailed information (for example, creation time, node, Pod IP and monitoring data).
- You can view the container information by clicking the Pod.
- Click the container log icon to view the output logs of the container.
- You can view the Pod detail page by clicking the Pod name.

    {{</ notice >}}

## Check Job Details

### Operations

On the Job detail page, you can manage the Job after it is created.

- **Edit Information**: Edit the basic information except `Name` of the Job.
- **Rerun Job**: Rerun the Job, the Pod will restart, and a new execution record will be generated.
- **View YAML**: View the Job's specification in YAML format.
- **Delete**: Delete the Job and return to the Job list page.

![job-operation](/images/docs/project-user-guide/application-workloads/jobs/modify-job.png)

### Execution records

1. Click the **Execution Records** tab to view the execution records of the Job.

   ![execution-records](/images/docs/project-user-guide/application-workloads/jobs/execution-records.png)

2. Click <img src="/images/docs/project-user-guide/application-workloads/jobs/refresh.png" width="20px" /> to refresh the execution records.

### Resource status

1. Click the **Resource Status** tab to view the Pods of the Job.

   ![resource-status](/images/docs/project-user-guide/application-workloads/jobs/res-status.png)

2. Click <img src="/images/docs/project-user-guide/application-workloads/jobs/refresh.png" width="20px" /> to refresh the Pod information, and click <img src="/images/docs/project-user-guide/application-workloads/jobs/display.png" width="20px" />/<img src="/images/docs/project-user-guide/application-workloads/jobs/hide.png" width="20px" /> to display/hide the containers in each Pod.

### Metadata

Click the **Metadata** tab to view the labels and annotations of the Job.

![metadata](/images/docs/project-user-guide/application-workloads/jobs/metadata.png)

### Environment variables

Click the **Environment Variables** tab to view the environment variables of the Job.

![env-variable](/images/docs/project-user-guide/application-workloads/jobs/env-variables.png)

### Events

Click the **Events** tab to view the events of the Job.

![events](/images/docs/project-user-guide/application-workloads/jobs/events.png)