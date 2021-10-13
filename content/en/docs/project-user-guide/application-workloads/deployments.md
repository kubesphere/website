---
title: "Deployments"
keywords: 'KubeSphere, Kubernetes, Deployments, workload'
description: 'Learn basic concepts of Deployments and how to create Deployments in KubeSphere.'
linkTitle: "Deployments"

weight: 10210
---

A Deployment controller provides declarative updates for Pods and ReplicaSets. You describe a desired state in a Deployment object, and the Deployment controller changes the actual state to the desired state at a controlled rate. As a Deployment runs a number of replicas of your application, it automatically replaces instances that go down or malfunction. This is how Deployments make sure app instances are available to handle user requests.

For more information, see the [official documentation of Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/).

## Prerequisites

You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create a Deployment

### Step 1: Open the dashboard

Log in to the console as `project-regular`. Go to **Application Workloads** of a project, select **Workloads**, and click **Create** under the tab **Deployments**.

![deployments](/images/docs/project-user-guide/application-workloads/deployments/deployments.png)

### Step 2: Enter basic information

Specify a name for the Deployment (for example, `demo-deployment`) and click **Next** to continue.

![deployments](/images/docs/project-user-guide/application-workloads/deployments/enter-info.png)

### Step 3: Set an image

1. Before you set an image, define the number of replicated Pods in **Pod Replicas** by clicking <img src="/images/docs/project-user-guide/application-workloads/deployments/plus-icon.png" width="20px" /> or <img src="/images/docs/project-user-guide/application-workloads/deployments/minus-icon.png" width="20px" />, which is indicated by the `.spec.replicas` field in the manifest file.

    {{< notice tip >}}
You can see the Deployment manifest file in YAML format by enabling **Edit Mode** in the upper-right corner. KubeSphere allows you to edit the manifest file directly to create a Deployment. Alternatively, you can follow the steps below to create a Deployment via the dashboard.
    {{</ notice >}}

    ![deployments](/images/docs/project-user-guide/application-workloads/deployments/set-replicas.png)

2. Click **Add Container Image**.

    ![deployments](/images/docs/project-user-guide/application-workloads/deployments/add-container-image.png)

3. Enter an image name from public Docker Hub or from a [private repository](../../configuration/image-registry/) you specified. For example, enter `nginx` in the search bar and press **Enter**.

    ![deployments](/images/docs/project-user-guide/application-workloads/deployments/enter-nginx.png)

    {{< notice note >}}

- Remember to press **Enter** on your keyboard after you enter an image name in the search bar.
- If you want to use your private image repository, you should [create an Image Registry Secret](../../configuration/image-registry/) first in **Secrets** under **Configurations**.

    {{</ notice >}}

4. Set requests and limits for CPU and memory resources based on your needs. For more information, see [Resource Request and Resource Limit in Container Image Settings](../container-image-settings/#add-container-image).

    ![deployments](/images/docs/project-user-guide/application-workloads/deployments/set-requests-limits.png)

5. Click **Use Default Ports** for **Port Settings** or you can customize **Protocol**, **Name** and **Container Port**.

6. Select a policy for image pulling from the drop-down menu. For more information, see [Image Pull Policy in Container Image Settings](../container-image-settings/#add-container-image).

7. For other settings (**Health Checker**, **Start Command**, **Environment Variables**, **Container Security Context** and **Sync Host Timezone**), you can configure them on the dashboard as well. For more information, see detailed explanations of these properties in [Container Image Settings](../container-image-settings/#add-container-image). When you finish, click **√** in the lower-right corner to continue.

8. Select an update strategy from the drop-down menu. It is recommended that you choose **RollingUpdate**. For more information, see [Update Strategy](../container-image-settings/#update-strategy).

9. Select a deployment mode. For more information, see [Deployment Mode](../container-image-settings/#deployment-mode).

10. Click **Next** to continue when you finish setting the container image.

### Step 4: Mount volumes

You can add a volume directly or mount a ConfigMap or Secret. Alternatively, click **Next** directly to skip this step. For more information about volumes, visit [Volumes](../../storage/volumes/#mount-a-volume).

![deployments](/images/docs/project-user-guide/application-workloads/deployments/mount-volumes.png)

{{< notice note >}}

Deployments can't use a volume template, which is used by StatefulSets.

{{</ notice>}}

### Step 5: Configure advanced settings

You can set a policy for node scheduling and add metadata in this section. When you finish, click **Create** to complete the whole process of creating a Deployment.

![deployments](/images/docs/project-user-guide/application-workloads/deployments/advanced-settings.png)

- **Set Node Scheduling Policy**

  You can allow Pod replicas to run on specified nodes. It is specified in the field `nodeSelector`.

- **Add Metadata**

  Additional metadata settings for resources such as **Labels** and **Annotations**.

## Check Deployment Details

### Detail page

1. After a Deployment is created, it will be displayed in the list as below. You can click <img src="/images/docs/project-user-guide/application-workloads/deployments/three-dots.png" width="20px" /> on the right and select options from the menu to modify your Deployment.

    ![deployments](/images/docs/project-user-guide/application-workloads/deployments/click-to-modify.png)

    - **Edit**: View and edit the basic information.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Redeploy**: Redeploy the Deployment.
    - **Delete**: Delete the Deployment.

2. Click the name of the Deployment and you can go to its detail page.

    ![deployments](/images/docs/project-user-guide/application-workloads/deployments/deploy-details.png)

3. Click **More** to display the operations about this Deployment you can do.

    ![deployments](/images/docs/project-user-guide/application-workloads/deployments/click-more.png)

    - **Revision Rollback**: Select the revision to roll back.
    - **Horizontal Pod Autoscaling**: Autoscale the replicas according to CPU and memory usage. If both CPU and memory are specified, replicas are added or deleted if any of the conditions is met.
    - **Edit Config Template**: Configure update strategies, containers and volumes.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Redeploy**: Redeploy this Deployment.
    - **Delete**: Delete the Deployment, and return to the Deployment list page.

4. Click the **Resource Status** tab to view the port and Pod information of the Deployment.

    ![deployments](/images/docs/project-user-guide/application-workloads/deployments/resource-status.png)

    - **Replica Status**: Click <img src="/images/docs/project-user-guide/application-workloads/deployments/up-arrow.png" width="20px" /> or <img src="/images/docs/project-user-guide/application-workloads/deployments/down-arrow.png" width="20px" /> to increase or decrease the number of Pod replicas.
    - **Pod detail**

        ![deployments](/images/docs/project-user-guide/application-workloads/deployments/pods.png)

        - The Pod list provides detailed information of the Pod (status, node, Pod IP and resource usage).
        - You can view the container information by clicking a Pod item.
        - Click the container log icon to view output logs of the container.
        - You can view the Pod detail page by clicking the Pod name.

### Revision records

After the resource template of workload is changed, a new log will be generated and Pods will be rescheduled for a version update. The latest 10 versions will be saved by default. You can implement a redeployment based on the change log.

### Matadata

Click the **Metadata** tab to view the labels and annotations of the Deployment.

![deployments](/images/docs/project-user-guide/application-workloads/deployments/meta-data.png)

### Monitoring

1. Click the **Monitoring** tab to view the CPU usage, memory usage, outbound traffic, and inbound traffic of the Deployment.

   ![deployments](/images/docs/project-user-guide/application-workloads/deployments/monitoring.png)

2. Click the drop-down menu in the upper-right corner to customize the time range and time interval.

   ![deployments](/images/docs/project-user-guide/application-workloads/deployments/time-interval.png)

3. Click <img src="/images/docs/project-user-guide/application-workloads/deployments/deployments_autorefresh_start.png" width="20px" />/<img src="/images/docs/project-user-guide/application-workloads/deployments/deployments_autorefresh_stop.png" width="20px" /> in the upper-right corner to start/stop automatic data refreshing.

4. Click <img src="/images/docs/project-user-guide/application-workloads/deployments/deployments_refresh.png" width="20px" /> in the upper-right corner to manually refresh the data.

### Environment variables

Click the **Environment Variables** tab to view the environment variables of the Deployment.

![deployments](/images/docs/project-user-guide/application-workloads/deployments/env-variables.png)

### Events

Click the **Events** tab to view the events of the Deployment.

![deployments](/images/docs/project-user-guide/application-workloads/deployments/events.png)