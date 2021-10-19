---
title: "StatefulSets"
keywords: 'KubeSphere, Kubernetes, StatefulSets, Dashboard, Service'
description: 'Learn basic concepts of StatefulSets and how to create StatefulSets on KubeSphere.'
linkTitle: "StatefulSets"
weight: 10220
---

As a workload API object, a StatefulSet is used to manage stateful applications. It is responsible for the deploying, scaling of a set of Pods, and guarantees the ordering and uniqueness of these Pods.

Like a Deployment, a StatefulSet manages Pods that are based on an identical container specification. Unlike a Deployment, a StatefulSet maintains a sticky identity for each of their Pods. These Pods are created from the same specification, but are not interchangeable: each has a persistent identifier that it maintains across any rescheduling.

If you want to use storage volumes to provide persistence for your workload, you can use a StatefulSet as part of the solution. Although individual Pods in a StatefulSet are susceptible to failure, the persistent Pod identifiers make it easier to match existing volumes to the new Pods that replace any that have failed.

StatefulSets are valuable for applications that require one or more of the following.

- Stable, unique network identifiers.
- Stable, persistent storage.
- Ordered, graceful deployment, and scaling.
- Ordered, automated rolling updates.

For more information, see the [official documentation of Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).

## Prerequisites

You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create a StatefulSet

In KubeSphere, a **Headless** service is also created when you create a StatefulSet. You can find the headless service in [Services](../services/) under **Application Workloads** in a project.

### Step 1: Open the dashboard

Log in to the console as `project-regular`. Go to **Application Workloads** of a project, select **Workloads**, and click **Create** under the **StatefulSets** tab.

### Step 2: Enter basic information

Specify a name for the StatefulSet (for example, `demo-stateful`) and click **Next** to continue.

### Step 3: Set a Pod

1. Before you set an image, define the number of replicated Pods in **Pod Replicas** by clicking <img src="/images/docs/project-user-guide/application-workloads/statefulsets/plus-icon.png" width="20px" /> or <img src="/images/docs/project-user-guide/application-workloads/statefulsets/minus-icon.png" width="20px" />, which is indicated by the `.spec.replicas` field in the manifest file.

    {{< notice tip >}}

You can see the StatefulSet manifest file in YAML format by enabling **Edit YAML** in the upper-right corner. KubeSphere allows you to edit the manifest file directly to create a StatefulSet. Alternatively, you can follow the steps below to create a StatefulSet via the dashboard.

    {{</ notice >}}

2. Click **Add Container**.

3. Enter an image name from public Docker Hub or from a [private repository](../../configuration/image-registry/) you specified. For example, enter `nginx` in the search box and press **Enter**.

    {{< notice note >}}

- Remember to press **Enter** on your keyboard after you enter an image name in the search box.
- If you want to use your private image repository, you should [create an Image Registry Secret](../../configuration/image-registry/) first in **Secrets** under **Configuration**.

    {{</ notice >}}

4. Set requests and limits for CPU and memory resources based on your needs. For more information, see [Resource Request and Resource Limit in Container Image Settings](../container-image-settings/#add-container-image).

5. Click **Use Default Ports** for **Port Settings** or you can customize **Protocol**, **Name** and **Container Port**.

6. Select a policy for image pulling from the drop-down list. For more information, see [Image Pull Policy in Container Image Settings](../container-image-settings/#add-container-image).

7. For other settings (**Health Check**, **Start Command**, **Environment Variables**, **Container Security Context** and **Synchronize Host Timezone**), you can configure them on the dashboard as well. For more information, see detailed explanations of these properties in [Container Image Settings](../container-image-settings/#add-container-image). When you finish, click **√** in the lower-right corner to continue.

8. Select an update strategy from the drop-down menu. It is recommended you choose **Rolling Update**. For more information, see [Update Strategy](../container-image-settings/#update-strategy).

9. Select a Pod scheduling rule. For more information, see [Pod Scheduling Rules](../container-image-settings/#pod-scheduling-rules).

10. Click **Next** to continue when you finish setting the container image.

### Step 4: Mount volumes

StatefulSets can use the volume template, but you must create it in **Storage** in advance. For more information about volumes, visit [Volumes](../../storage/volumes/#mount-a-volume). When you finish, click **Next** to continue.

### Step 5: Configure advanced settings

You can set a policy for node scheduling and add metadata in this section. When you finish, click **Create** to complete the whole process of creating a StatefulSet.

- **Select Nodes**

  Assign Pod replicas to run on specified nodes. It is specified in the field `nodeSelector`.

- **Add Metadata**

  Additional metadata settings for resources such as **Labels** and **Annotations**.

## Check StatefulSet Details

### Detail page

1. After a StatefulSet is created, it will be displayed in the list. You can click <img src="/images/docs/project-user-guide/application-workloads/statefulsets/three-dots.png" width="20px" /> on the right to select options from the menu to modify your StatefulSet.

    - **Edit Information**: View and edit the basic information.
    - **Edit YAMl**: View, upload, download, or update the YAML file.
    - **Re-create**: Re-create the StatefulSet.
    - **Delete**: Delete the StatefulSet.

2. Click the name of the StatefulSet and you can go to its details page.

3. Click **More** to display what operations about this StatefulSet you can do.

    - **Roll Back**: Select the revision to roll back.
    - **Edit Service**: Set the port to expose the container image and the service port.
    - **Edit Settings**: Configure update strategies, containers and volumes.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Re-create**: Re-create this StatefulSet.
    - **Delete**: Delete the StatefulSet, and return to the StatefulSet list page.

4. Click the **Resource Status** tab to view the port and Pod information of a StatefulSet.

    - **Replica Status**: Click <img src="/images/docs/project-user-guide/application-workloads/statefulsets/up-arrow.png" width="20px" /> or <img src="/images/docs/project-user-guide/application-workloads/statefulsets/down-arrow.png" width="20px" /> to increase or decrease the number of Pod replicas.
    - **Pods**

        - The Pod list provides detailed information of the Pod (status, node, Pod IP and resource usage).
        - You can view the container information by clicking a Pod item.
        - Click the container log icon to view output logs of the container.
        - You can view the Pod detail page by clicking the Pod name.

### Revision records

After the resource template of workload is changed, a new log will be generated and Pods will be rescheduled for a version update. The latest 10 versions will be saved by default. You can implement a redeployment based on the change log.

### Metadata

Click the **Metadata** tab to view the labels and annotations of the StatefulSet.

### Monitoring

1. Click the **Monitoring** tab to view the CPU usage, memory usage, outbound traffic, and inbound traffic of the StatefulSet.

2. Click the drop-down menu in the upper-right corner to customize the time range and sampling interval.

3. Click <img src="/images/docs/project-user-guide/application-workloads/statefulsets/start-refresh.png" width="20px" />/<img src="/images/docs/project-user-guide/application-workloads/statefulsets/stop-refresh.png" width="20px" /> in the upper-right corner to start/stop automatic data refreshing.

4. Click <img src="/images/docs/project-user-guide/application-workloads/statefulsets/refresh.png" width="20px" /> in the upper-right corner to manually refresh the data.

### Environment variables

Click the **Environment Variables** tab to view the environment variables of the StatefulSet.

### Events

Click the **Events** tab to view the events of the StatefulSet.

