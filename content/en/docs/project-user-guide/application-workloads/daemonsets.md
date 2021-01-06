---
title: "DaemonSets"
keywords: 'KubeSphere, Kubernetes, DaemonSet, workload'
description: 'Kubernetes DaemonSets'
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

You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project).

## Create a DaemonSet

### Step 1: Open the dashboard

Log in to the console as `project-regular`. Go to **Application Workloads** of a project, select **Workloads**, and click **Create** under the tab **DaemonSets**.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets.jpg)

### Step 2: Input basic information

Specify a name for the DaemonSet (e.g. `demo-daemonset`) and click **Next** to continue.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_1.jpg)

### Step 3: Set an image

1. Click the **Add Container Image** box.

    ![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_2_container_btn.jpg)

2. Input an image name from public Docker Hub or from a [private repository](../../configuration/image-registry/) you specified. For example, input `fluentd` in the search bar and press **Enter**.

    ![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_2_container_1.jpg)

    {{< notice note >}}

- Remember to press **Enter** on your keyboard after you input an image name in the search bar.
- If you want to use your private image repository, you should [create an Image Registry Secret](../../configuration/image-registry/) first in **Secrets** under **Configurations**.

    {{</ notice >}}

3. Set requests and limits for CPU and memory resources based on your needs. For more information, see [Resource Request and Resource Limit in Container Image Settings](../container-image-settings/#add-container-image).

    ![daemonset-request-limit](/images/docs/project-user-guide/workloads/daemonset-request-limit.jpg)

4. Click **Use Default Ports** for **Port Settings** or you can customize **Protocol**, **Name** and **Container Port**.

5. Select a policy for image pulling from the drop-down menu. For more information, see [Image Pull Policy in Container Image Settings](../container-image-settings/#add-container-image).

6. For other settings (**Health Checker**, **Start Command**, **Environment Variables**, **Container Security Context** and **Sync Host Timezone**), you can configure them on the dashboard as well. For more information, see detailed explanations of these properties in [Container Image Settings](../container-image-settings/#add-container-image). When you finish, click **√** in the bottom right corner to continue.

7. Select an update strategy from the drop-down menu. It is recommended you choose **RollingUpdate**. For more information, see [Update Strategy](../container-image-settings/#update-strategy).

8. Select a deployment mode. For more information, see [Deployment Mode](../container-image-settings/#deployment-mode).

9. Click **Next** to continue when you finish setting the container image.

### Step 4: Mount volumes

You can add a volume directly or mount a ConfigMap or Secret. Alternatively, click **Next** directly to skip this step. For more information about volumes, visit [Volumes](../../storage/volumes/#mount-a-volume).

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_3.jpg)

{{< notice note >}}

DaemonSets can't use a volume template, which is used by StatefulSets.

{{</ notice>}}

### Step 5: Configure advanced settings

You can add metadata in this section. When you finish, click **Create** to complete the whole process of creating a DaemonSet.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_4.jpg)

- **Add Metadata**

  Additional metadata settings for resources such as **Labels** and **Annotations**.

## Check DaemonSet Details

### Detail page

1. After a DaemonSet is created, it displays in the list as below. You can click the three dots on the right and select the operation from the menu to modify a DaemonSet.

    ![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_list.png)

    - **Edit**: View and edit the basic information.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Redeploy**: Redeploy the DaemonSet.
    - **Delete**: Delete the DaemonSet.

2. Click the name of the DaemonSet and you can go to its detail page.

    ![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_detail.jpg)

3. Click **More** to display what operations about this DaemonSet you can do.

    ![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_detail_operation_btn.jpg)

    - **Revision Rollback**: Select the revision to roll back.
    - **Edit Config Template**: Configure update strategies, containers and volumes.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Redeploy**: Redeploy this DaemonSet.
    - **Delete**: Delete the DaemonSet, and return to the DaemonSet list page.

4. Click the **Resource Status** tab to view the port and Pod information of a DaemonSet.

    ![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_detail_state.png)

    - **Replica Status**: You cannot change the number of Pod replicas for a DaemonSet.
    - **Pod detail**

      ![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_detail_pod.png)

      - The Pod list provides detailed information of the Pod (status, node, Pod IP and resource usage).
      - You can view the container information by clicking a Pod item.
      - Click the container log icon to view output logs of the container.
      - You can view the Pod detail page by clicking the Pod name.

### Revision records

After the resource template of workload is changed, a new log will be generated and Pods will be rescheduled for a version update. The latest 10 versions will be saved by default. You can implement a redeployment based on the change log.
