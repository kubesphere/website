---
title: "DaemonSets"
keywords: 'KubeSphere, Kubernetes, DaemonSet, workload'
description: 'Learn basic concepts of DaemonSets and how to create DaemonSets in KubeSphere.'
linkTitle: "DaemonSets"
weight: 10230
---

A DaemonSet manages groups of replicated Pods while it ensures that all (or some) nodes run a copy of a Pod. As nodes are added to the cluster, DaemonSets automatically add Pods to the new nodes as needed.

For more information, see the [official documentation of Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/).

## Use DaemonSets

DaemonSets are very helpful in cases where you want to deploy ongoing background tasks that run on all or certain nodes without any user intervention. For example:

- Run a log collection daemon on every node, such as Fluentd or Logstash.
- Run a node monitoring daemon on every node, such as Prometheus Node Exporter, collectd, and AppDynamics Agent.
- Run a cluster storage daemon and system program on every node, such as Glusterd, Ceph, kube-dns, and kube-proxy.

## Prerequisites

You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create a DaemonSet

### Step 1: Open the dashboard

Log in to the console as `project-regular`. Go to **Application Workloads** of a project, select **Workloads**, and click **Create** under the tab **DaemonSets**.

### Step 2: Enter basic information

Specify a name for the DaemonSet (for example, `demo-daemonset`) and click **Next** to continue.

### Step 3: Set a Pod

1. Click **Add Container**.

2. Enter an image name from public Docker Hub or from a [private repository](../../configuration/image-registry/) you specified. For example, enter `fluentd` in the search box and press **Enter**.

    {{< notice note >}}

- Remember to press **Enter** on your keyboard after you enter an image name in the search box.
- If you want to use your private image repository, you should [create an Image Registry Secret](../../configuration/image-registry/) first in **Secrets** under **Configuration**.

    {{</ notice >}}

3. Set requests and limits for CPU and memory resources based on your needs. For more information, see [Resource Request and Resource Limit in Container Image Settings](../container-image-settings/#add-container-image).

4. Click **Use Default Ports** for **Port Settings** or you can customize **Protocol**, **Name** and **Container Port**.

5. Select a policy for image pulling from the drop-down menu. For more information, see [Image Pull Policy in Container Image Settings](../container-image-settings/#add-container-image).

6. For other settings (**Health Check**, **Start Command**, **Environment Variables**, **Container Security Context** and **Synchronize Host Timezone**), you can configure them on the dashboard as well. For more information, see detailed explanations of these properties in [Pod Settings](../container-image-settings/#add-container-image). When you finish, click **√** in the lower-right corner to continue.

7. Select an update strategy from the drop-down menu. It is recommended you choose **Rolling Update**. For more information, see [Update Strategy](../container-image-settings/#update-strategy).

8. Select a Pod scheduling rule. For more information, see [Pod Scheduling Rules](../container-image-settings/#pod-scheduling-rules).

9. Click **Next** to continue when you finish setting the container image.

### Step 4: Mount volumes

You can add a volume directly or mount a ConfigMap or Secret. Alternatively, click **Next** directly to skip this step. For more information about volumes, visit [Volumes](../../storage/volumes/#mount-a-volume).

{{< notice note >}}

DaemonSets can't use a volume template, which is used by StatefulSets.

{{</ notice>}}

### Step 5: Configure advanced settings

You can add metadata in this section. When you finish, click **Create** to complete the whole process of creating a DaemonSet.

- **Add Metadata**

  Additional metadata settings for resources such as **Labels** and **Annotations**.

## Check DaemonSet Details

### Details page

1. After a DaemonSet is created, it will be displayed in the list. You can click <img src="/images/docs/project-user-guide/application-workloads/daemonsets/three-dots.png" width="20px" /> on the right and select the options from the menu to modify a DaemonSet.

    - **Edit Information**: View and edit the basic information.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Re-create**: Re-create the DaemonSet.
    - **Delete**: Delete the DaemonSet.

2. Click the name of the DaemonSet and you can go to its details page.

3. Click **More** to display what operations about this DaemonSet you can do.

    - **Roll Back**: Select the revision to roll back.
    - **Edit Settings**: Configure update strategies, containers and volumes.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Re-create**: Re-create this DaemonSet.
    - **Delete**: Delete the DaemonSet, and return to the DaemonSet list page.

4. Click the **Resource Status** tab to view the port and Pod information of a DaemonSet.

    - **Replica Status**: You cannot change the number of Pod replicas for a DaemonSet.
    - **Pods**

      - The Pod list provides detailed information of the Pod (status, node, Pod IP and resource usage).
      - You can view the container information by clicking a Pod item.
      - Click the container log icon to view output logs of the container.
      - You can view the Pod details page by clicking the Pod name.

### Revision records

After the resource template of workload is changed, a new log will be generated and Pods will be rescheduled for a version update. The latest 10 versions will be saved by default. You can implement a redeployment based on the change log.

### Metadata

Click the **Metadata** tab to view the labels and annotations of the DaemonSet.

### Monitoring

1. Click the **Monitoring** tab to view the CPU usage, memory usage, outbound traffic, and inbound traffic of the DaemonSet.

2. Click the drop-down menu in the upper-right corner to customize the time range and sampling interval.

3. Click <img src="/images/docs/project-user-guide/application-workloads/daemonsets/start-refresh.png" width="20px" />/<img src="/images/docs/project-user-guide/application-workloads/daemonsets/stop-refresh.png" width="20px" /> in the upper-right corner to start/stop automatic data refreshing.

4. Click <img src="/images/docs/project-user-guide/application-workloads/daemonsets/refresh.png" width="20px" /> in the upper-right corner to manually refresh the data.

### Environment variables

Click the **Environment Variables** tab to view the environment variables of the DaemonSet.

### Events

Click the **Events** tab to view the events of the DaemonSet.


