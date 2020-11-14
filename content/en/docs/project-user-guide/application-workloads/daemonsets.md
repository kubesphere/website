---
title: "DaemonSets"
keywords: 'KubeSphere, Kubernetes, DaemonSet, workload'
description: 'Kubernetes DaemonSets'

weight: 2250
---

A DaemonSet manages groups of replicated Pods while it ensures that all (or some) nodes run a copy of a Pod. As nodes are added to the cluster, DaemonSets automatically add Pods to the new nodes as needed.

For more information, see the [official documentation of Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/).

## Use DaemonSets

DaemonSets are very helpful in cases where you want to deploy ongoing background tasks that run on all or certain nodes without any user intervention. For example:

- Run a log collection daemon on every node, such as Fluentd or Logstash.
- Run a node monitoring daemon on every node, such as Prometheus Node Exporter, collectd, and AppDynamics Agent.
- Run a cluster storage daemon and system program on every node, such as Glusterd, Ceph, kube-dns, and kube-proxy.

## Prerequisites

- You need to create a workspace, a project and an account (`project-regular`). Please refer to [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project) if they are not ready yet.

- You need to sign in with the `project-admin` account and invite `project-regular` to the corresponding project. Please refer to [the steps to invite a member](../../../quick-start/create-workspace-and-project#task-3-create-a-project).

## Create a DaemonSet

### Step 1: Open Dashboard

Log in the console as `project-regular`. Go to **Application Workloads** of a project, select **Workloads**, and click **Create** under the tab **DaemonSets**.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets.jpg)

### Step 2: Input Basic Information

Specify a name for the DaemonSet (e.g. `demo-daemonset`) and click **Next** to continue.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_1.jpg)

### Step 3: Set Image

1. Click the **Add Container Image** box.

    ![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_2_container_btn.jpg)

2. Input an image name from public Docker Hub or from a [private repository](../../configuration/image-registry/) you specified. For example, input `fluentd` in the search bar and press **Enter**.

    ![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_2_container_1.jpg)

    {{< notice note >}}

- Remember to press **Enter** on your keyboard after you input an image name in the search bar.
- If you want to use your private image repository, you should [create an image secret](../../configuration/image-registry/) first in **Secrets** under **Configurations**.

    {{</ notice >}}

3. Set requests and limits for CPU and memory resources based on your needs. For more information, see [Resource Request and Resource Limit in Container Image Settings](../container-image-settings/#add-container-image).

    ![daemonset-request-limit](/images/docs/project-user-guide/workloads/daemonset-request-limit.jpg)

4. Click **Use Default Ports** for **Port Settings** or you can customize **Protocol**, **Name** and **Container Port**.

5. Select a policy for image pulling from the drop-down menu. For more information, see [Image Pull Policy in Container Image Settings](../container-image-settings/#add-container-image).

6. For other settings (**Health Checker**, **Start Command**, **Environment Variables**, **Container Security Context** and **Sync Host Timezone**), you can configure them on the dashboard as well. For more information, see detailed explanations of these properties in [Container Image Settings](../container-image-settings/#add-container-image). When you finish, click **√** in the bottom right corner to continue.

7. Select an update strategy from the drop-down menu. It is recommended you choose **RollingUpdate**. For more information, see [Update Strategy](../container-image-settings/#update-strategy).

8. Select a deployment mode. For more information, see [Deployment Mode](../container-image-settings/#deployment-mode).

9. Click **Next** to go to the next step when you finish setting the container image.

### Step 4: Mount Volumes

You can add a volume directly or mount a ConfigMap or Secret. Alternatively, click **Next** directly to skip this step.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_3.jpg)

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

### Step 5: Configure Advanced Settings

You can add metadata in this section. When you finish, click **Create** to complete the whole process of creating a DaemonSet.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_4.jpg)

- **Add Metadata**

  Additional metadata settings for resources such as **Labels** and **Annotations**.

## Check DaemonSet Details

### Detail Page

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

### Revision Records

After the resource template of workload is changed, a new log will be generated and Pods will be rescheduled for a version update. The latest 10 versions will be saved by default. You can implement a redeployment based on the change log.
