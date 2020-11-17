---
title: "ConfigMaps"
keywords: 'kubesphere, kubernetes, docker, ConfigMaps'
description: 'Create a KubeSphere ConfigMap'

linkTitle: "ConfigMaps"
weight: 2110
---

A Kubernets [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/) is used to store configuration data in the form of key-value pairs. The ConfigMap resource provides a way to inject configuration data into Pods. The data stored in a ConfigMap object can be referenced in a volume of type ConfigMap and then consumed by containerized applications running in a Pod. ConfigMaps are often used in the following cases:

- Set the value of the environment variable.
- Set command parameters in the container.
- Create a config file in the volume.

## Prerequisites

- You need to create a workspace, a project and an account (`project-regular`). Please refer to [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project) if they are not ready yet.
- You need to sign in with the `project-admin` account and invite `project-regular` to the corresponding project. Please refer to [the steps to invite a member](../../../quick-start/create-workspace-and-project#task-3-create-a-project).

## Create a Configmap

### Step 1: Open Dashboard

Log in the console as `project-regular`. Go to **Configurations** of a project, choose **ConfigMaps** and click **Create**.

![configmap](/images/docs/project-user-guide/workloads/deployments.png)

### Step 2: Input Basic Information

Specify a name for the ConfigMap (e.g. `demo-cm`) and click **Next** to continue.

![basic-info](/images/docs/project-user-guide/workloads/deployments_form_1.jpg)

### Step 3: Input Configuration Values

Under the tab **ConfigMap Settings**, configure values by clicking **Add Data** and input a key-value pair. Click **√** in the bottom right corner and continue adding data if needed.

![add-data](/images/docs/project-user-guide/workloads/deployments_form_1.jpg)

When finished, click **Create** to generate the ConfigMap.

## Check ConfigMap Details

### Detail Page

1. After a ConfigMap is created, it displays in the list as below. You can click the three dots on the right and select the operation from the menu to modify it.

    ![configmaps](/images/docs/project-user-guide/workloads/deployments_list.png)

    - **Edit**: View and edit the basic information.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Modify Config**: Modify the key-value pairs of the ConfigMap.
    - **Delete**: Delete the ConfigMap.

2. Click the name of the ConfigMap and you can go to its detail page.

    ![configmap-detail](/images/docs/project-user-guide/workloads/deployments_detail.png)

3. Click **More** to display what operations about this ConfigMap you can do.

    ![configmap-dropdown-menu](/images/docs/project-user-guide/workloads/deployments_detail_operation_btn.png)

    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Modify Config**: Modify the key-value pairs of the ConfigMap.
    - **Delete**: Delete the ConfigMap, and return to the list page.

4. Click the **Eidt Info** to view and edit the basic information.

    ![edit-configmap](/images/docs/project-user-guide/workloads/deployments_detail_state.png)
