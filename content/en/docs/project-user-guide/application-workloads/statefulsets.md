---
title: "StatefulSets"
keywords: 'KubeSphere, Kubernetes, StatefulSets, dashboard, service'
description: 'Kubernetes StatefulSets'
linkTitle: "StatefulSets"

weight: 10220
---

As workload API object, a StatefulSet is used to manage stateful applications. It is responsible for the deploying, scaling of a set of Pods, and guarantees the ordering and uniqueness of these Pods.

Like a Deployment, a StatefulSet manages Pods that are based on an identical container specification. Unlike a Deployment, a StatefulSet maintains a sticky identity for each of their Pods. These pods are created from the same specification, but are not interchangeable: each has a persistent identifier that it maintains across any rescheduling.

If you want to use storage volumes to provide persistence for your workload, you can use a StatefulSet as part of the solution. Although individual Pods in a StatefulSet are susceptible to failure, the persistent Pod identifiers make it easier to match existing volumes to the new Pods that replace any that have failed.

StatefulSets are valuable for applications that require one or more of the following.

- Stable, unique network identifiers.
- Stable, persistent storage.
- Ordered, graceful deployment, and scaling.
- Ordered, automated rolling updates.

For more information, see the [official documentation of Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).

## Prerequisites

You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project).

## Create a StatefulSet

In KubeSphere, a **Headless** service is also created when you create a StatefulSet. You can find the headless service in [Services](../services/) under **Application Workloads** in a project.

### Step 1: Open Dashboard

Log in to the console as `project-regular`. Go to **Application Workloads** of a project, select **Workloads**, and click **Create** under the tab **StatefulSets**.

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets.jpg)

### Step 2: Input Basic Information

Specify a name for the StatefulSet (e.g. `demo-stateful`) and click **Next** to continue.

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_1.jpg)

### Step 3: Set Image

1. Before you set an image, define the number of replicated Pods in **Pod Replicas** by clicking the **plus** or **minus** icon, which is indicated by the `.spec.replicas` field in the manifest file.

    {{< notice tip >}}

You can see the StatefulSet manifest file in YAML format by enabling **Edit Mode** in the top right corner. KubeSphere allows you to edit the manifest file directly to create a StatefulSet. Alternatively, you can follow the steps below to create a StatefulSet via the dashboard.

    {{</ notice >}}
    
    ![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_2.jpg)

2. Click the **Add Container Image** box.

    ![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_2_container_btn.jpg)

3. Input an image name from public Docker Hub or from a [private repository](../../configuration/image-registry/) you specified. For example, input `nginx` in the search bar and press **Enter**.

    ![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_2_container_1.jpg)

    {{< notice note >}}

- Remember to press **Enter** on your keyboard after you input an image name in the search bar.
- If you want to use your private image repository, you should [create an Image Registry Secret](../../configuration/image-registry/) first in **Secrets** under **Configurations**.

    {{</ notice >}}

4. Set requests and limits for CPU and memory resources based on your needs. For more information, see [Resource Request and Resource Limit in Container Image Settings](../container-image-settings/#add-container-image).

    ![statefulset-request-limit](/images/docs/project-user-guide/workloads/statefulset-request-limit.jpg)

5. Click **Use Default Ports** for **Service Settings** or you can customize **Protocol**, **Name** and **Container Port**.

6. Select a policy for image pulling from the drop-down menu. For more information, see [Image Pull Policy in Container Image Settings](../container-image-settings/#add-container-image).

7. For other settings (**Health Checker**, **Start Command**, **Environment Variables**, **Container Security Context** and **Sync Host Timezone**), you can configure them on the dashboard as well. For more information, see detailed explanations of these properties in [Container Image Settings](../container-image-settings/#add-container-image). When you finish, click **√** in the bottom right corner to continue.

8. Select an update strategy from the drop-down menu. It is recommended you choose **RollingUpdate**. For more information, see [Update Strategy](../container-image-settings/#update-strategy).

9. Select a deployment mode. For more information, see [Deployment Mode](../container-image-settings/#deployment-mode).

10. Click **Next** to go to the next step when you finish setting the container image.

### Step 4: Mount Volumes

StatefulSets can use the volume template, but you must create it in **Storage** in advance. For more information about volumes, visit [Volumes](../../storage/volumes/#mount-a-volume). When you finish, click **Next** to continue.

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_3.jpg)

### Step 5: Configure Advanced Settings

You can set a policy for node scheduling and add metadata in this section. When you finish, click **Create** to complete the whole process of creating a StatefulSet.

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_4.jpg)

- **Set Node Scheduling Policy**

  You can allow Pod replicas to run on specified nodes. It is specified in the field `nodeSelector`.

- **Add Metadata**

  Additional metadata settings for resources such as **Labels** and **Annotations**.

## Check StatefulSet Details

### Detail Page

1. After a StatefulSet is created, it displays in the list as below. You can click the three dots on the right to select actions from the menu to modify your StatefulSet.

    ![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_list.jpg)

    - **Edit**: View and edit the basic information.
    - **Edit YAMl**: View, upload, download, or update the YAML file.
    - **Redeploy**: Redeploy the StatefulSet.
    - **Delete**: Delete the StatefulSet.

2. Click the name of the StatefulSet and you can go to its detail page.

    ![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_detail.jpg)

3. Click **More** to display what operations about this StatefulSet you can do.

    ![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_detail_operation_btn.png)

    - **Revision Rollback**: Select the revision to roll back.
    - **Edit Service**: Set the port to expose the container image and the service port.
    - **Edit Config Template**: Configure update strategies, containers and volumes.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Redeploy**: Redeploy this StatefulSet.
    - **Delete**: Delete the StatefulSet, and return to the StatefulSet list page.

4. Click the **Resource Status** tab to view the port and Pod information of a StatefulSet.

    ![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_detail_state.png)

    - **Replica Status**: Click the arrow in the image to increase or decrease the number of Pod replicas.
    - **Pod detail**

        ![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_detail_pod.png)

        - The Pod list provides detailed information of the Pod (status, node, Pod IP and resource usage).
        - You can view the container information by clicking a Pod item.
        - Click the container log icon to view output logs of the container.
        - You can view the Pod detail page by clicking the Pod name.

### Revision Records

After the resource template of workload is changed, a new log will be generated and Pods will be rescheduled for a version update. The latest 10 versions will be saved by default. You can implement a redeployment based on the change log.
