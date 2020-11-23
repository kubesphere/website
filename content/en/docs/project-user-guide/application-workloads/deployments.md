---
title: "Deployments"
keywords: 'KubeSphere, Kubernetes, Deployments, workload'
description: 'Kubernetes Deployments'
linkTitle: "Deployments"

weight: 2230
---

A Deployment controller provides declarative updates for Pods and ReplicaSets. You describe a desired state in a Deployment object, and the Deployment controller changes the actual state to the desired state at a controlled rate. As a Deployment runs a number of replicas of your application, it automatically replaces instances that go down or malfunction. This is how Deployments make sure app instances are available to handle user requests.

For more information, see the [official documentation of Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/).

## Prerequisites

You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project).

## Create a Deployment

### Step 1: Open Dashboard

Log in the console as `project-regular`. Go to **Application Workloads** of a project, select **Workloads**, and click **Create** under the tab **Deployments**.

![deployments](/images/docs/project-user-guide/workloads/deployments.png)

### Step 2: Input Basic Information

Specify a name for the Deployment (e.g. `demo-deployment`) and click **Next** to continue.

![deployments](/images/docs/project-user-guide/workloads/deployments_form_1.jpg)

### Step 3: Set Image

1. Before you set an image, define the number of replicated Pods in **Pod Replicas** by clicking the **plus** or **minus** icon, which is indicated by the `.spec.replicas` field in the manifest file.

    {{< notice tip >}}
You can see the Deployment manifest file in YAML format by enabling **Edit Mode** in the top right corner. KubeSphere allows you to edit the manifest file directly to create a Deployment. Alternatively, you can follow the steps below to create a Deployment via the dashboard.
    {{</ notice >}}

    ![deployments](/images/docs/project-user-guide/workloads/deployments_form_2.jpg)

2. Click the **Add Container Image** box.

    ![deployments](/images/docs/project-user-guide/workloads/deployments_form_2_container_btn.jpg)

3. Input an image name from public Docker Hub or from a [private repository](../../configuration/image-registry/) you specified. For example, input `nginx` in the search bar and press **Enter**.

    ![deployments](/images/docs/project-user-guide/workloads/deployments_form_2_container_1.jpg)

    {{< notice note >}}

- Remember to press **Enter** on your keyboard after you input an image name in the search bar.
- If you want to use your private image repository, you should [create an Image Registy Secret](../../configuration/image-registry/) first in **Secrets** under **Configurations**.

    {{</ notice >}}

4. Set requests and limits for CPU and memory resources based on your needs. For more information, see [Resource Request and Resource Limit in Container Image Settings](../container-image-settings/#add-container-image).

    ![deployments](/images/docs/project-user-guide/workloads/deployments_form_2_container_2.jpg)

5. Click **Use Default Ports** for **Port Settings** or you can customize **Protocol**, **Name** and **Container Port**.

6. Select a policy for image pulling from the drop-down menu. For more information, see [Image Pull Policy in Container Image Settings](../container-image-settings/#add-container-image).

7. For other settings (**Health Checker**, **Start Command**, **Environment Variables**, **Container Security Context** and **Sync Host Timezone**), you can configure them on the dashboard as well. For more information, see detailed explanations of these properties in [Container Image Settings](../container-image-settings/#add-container-image). When you finish, click **√** in the bottom right corner to continue.

8. Select an update strategy from the drop-down menu. It is recommended you choose **RollingUpdate**. For more information, see [Update Strategy](../container-image-settings/#update-strategy).

9. Select a deployment mode. For more information, see [Deployment Mode](../container-image-settings/#deployment-mode).

10. Click **Next** to go to the next step when you finish setting the container image.

### Step 4: Mount Volumes

You can add a volume directly or mount a ConfigMap or Secret. Alternatively, click **Next** directly to skip this step.

![deployments](/images/docs/project-user-guide/workloads/deployments_form_3.jpg)

- **Add Volume**: Support EmptyDir and PersistentVolumeClaim.

  In **Add Volume** there are 3 kinds of volumes:

  - **Existing Volume**: Use *PVC* to mount.

    Persistent storage volumes can be used to save users' persistent data. You need to create volumes in advance so that you can choose an existing volume from the list.

  - **Temporary Volume**: Use *emptyDir* to mount.

    The temporary storage volume represents [emptyDir](https://kubernetes.cn/docs/concepts/storage/volumes/#emptydir), which is first created when a Pod is assigned to a node, and exists as long as that Pod is running on that node. When a Pod is removed from a node for any reason, the data in the emptyDir is deleted forever.

  - **HostPath**: Use *HostPath* to mount.

    A HostPath volume mounts a file or directory from the host node's filesystem into your Pod. This is not something that most Pods will need, but it offers a powerful escape hatch for some applications.

- **Mount ConfigMap or Secret**: Support key-value pairs in ConfigMap or Secret.

  A secret volume is used to pass sensitive information, such as passwords, to Pods. Secret volumes are backed by tmpfs (a RAM-backed filesystem) so they are never written to non-volatile storage.

  A ConfigMap is used to store configuration data in the form of key-value pairs. The ConfigMap resource provides a way to inject configuration data into Pods. The data stored in a ConfigMap object can be referenced in a volume of type ConfigMap and then consumed by containerized applications running in a Pod. ConfigMaps are often used in the following cases:

  - Set the value of the environment variable.
  - Set command parameters in the container.
  - Create a config file in the volume.

For more information about volumes, please visit [Volumes](../../storage/volumes).

{{< notice note >}}

Deployments can't use the volume template, which is used by StatefulSets.

{{</ notice>}}

### Step 5: Configure Advanced Settings

You can set a policy for node scheduling and add metadata in this section. When you finish, click **Create** to complete the whole process of creating a Deployment.

![deployments](/images/docs/project-user-guide/workloads/deployments_form_4.jpg)

- **Set Node Scheduling Policy**

  You can allow Pod replicas to run on specified nodes. It is specified in the field `nodeSelector`.

- **Add Metadata**

  Additional metadata settings for resources such as **Labels** and **Annotations**.

## Check Deployment Details

### Detail Page

1. After a Deployment is created, it displays in the list as below. You can click the three dots on the right and select actions from the menu to modify your Deployment.

    ![deployments](/images/docs/project-user-guide/workloads/deployments_list.png)

    - **Edit**: View and edit the basic information.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Redeploy**: Redeploy the Deployment.
    - **Delete**: Delete the Deployment.

2. Click the name of the Deployment and you can go to its detail page.

    ![deployments](/images/docs/project-user-guide/workloads/deployments_detail.png)

3. Click **More** to display what operations about this Deployment you can do.

    ![deployments](/images/docs/project-user-guide/workloads/deployments_detail_operation_btn.png)

    - **Revision Rollback**: Select the revision to roll back.
    - **Horizontal Pod Autoscaling**: Autoscale the replicas according to CPU and memory usage. If both CPU and memory are specified, replicas are added or deleted if any of the conditions is met.
    - **Edit Config Template**: Configure update strategies, containers and volumes.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Redeploy**: Redeploy this Deployment.
    - **Delete**: Delete the Deployment, and return to the Deployment list page.

4. Click the **Resource Status** tab to view the port and Pod information of the Deployment.

    ![deployments](/images/docs/project-user-guide/workloads/deployments_detail_state.png)

    - **Replica Status**: Click the arrow in the image to increase or decrease the number of Pod replicas.
    - **Pod detail**

        ![deployments](/images/docs/project-user-guide/workloads/deployments_detail_pod.png)

        - The Pod list provides detailed information of the Pod (status, node, Pod IP and resource usage).
        - You can view the container information by clicking a Pod item.
        - Click the container log icon to view output logs of the container.
        - You can view the Pod detail page by clicking the Pod name.

### Revision Records

After the resource template of workload is changed, a new log will be generated and Pods will be rescheduled for a version update. The latest 10 versions will be saved by default. You can implement a redeployment based on the change log.
