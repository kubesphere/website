---
title: "ConfigMaps"
keywords: 'KubeSphere, Kubernetes, ConfigMaps'
description: 'Learn how to create a ConfigMap in KubeSphere.'
linkTitle: "ConfigMaps"
aliases: 
    - "/docs/project-user-guide/configuration/configmaps/"
weight: 10420
---

A Kubernetes [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/) is used to store configuration data in the form of key-value pairs. The ConfigMap resource provides a way to inject configuration data into Pods. The data stored in a ConfigMap object can be referenced in a volume of type `ConfigMap` and then consumed by containerized applications running in a Pod. ConfigMaps are often used in the following cases:

- Set the value of environment variables.
- Set command parameters in containers.
- Create a configuration file in volumes.

This tutorial demonstrates how to create a ConfigMap in KubeSphere.

## Prerequisites

You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Create a ConfigMap

### Step 1: Open the dashboard

Log in to the console as `project-regular`. Go to **Configurations** of a project, choose **ConfigMaps** and click **Create**.

![create-configmap](/images/docs/project-user-guide/configurations/configmaps/create-configmap.jpg)

### Step 2: Input basic information

Specify a name for the ConfigMap (e.g. `demo-configmap`) and click **Next** to continue.

{{< notice tip >}}

You can see the ConfigMap manifest file in YAML format by enabling **Edit Mode** in the top right corner. KubeSphere allows you to edit the manifest file directly to create a ConfigMap. Alternatively, you can follow the steps below to create a ConfigMap via the dashboard.

{{</ notice >}} 

![set-basic-info](/images/docs/project-user-guide/configurations/configmaps/set-basic-info.jpg)

### Step 3: Input configuration values

1. Under the tab **ConfigMap Settings**, configure values by clicking **Add Data**.

   ![add-data](/images/docs/project-user-guide/configurations/configmaps/add-data.jpg)

2. Input a key-value pair. For example:

   ![key-value](/images/docs/project-user-guide/configurations/configmaps/key-value.jpg)

   {{< notice note >}}

   - key-value pairs displays under the field `data` in the manifest.

   - On the KubeSphere dashboard, you can only add key-value pairs for a ConfigMap currently. In future releases, you will be able to add a path to a directory containing configuration files to create ConfigMaps directly on the dashboard.

   {{</ notice >}} 

3. Click **√** in the bottom right corner to save it and click **Add Data** again if you want to add more key-value pairs.

   ![finish-creating](/images/docs/project-user-guide/configurations/configmaps/finish-creating.jpg)

4. When you finish, click **Create** to generate the ConfigMap.

## Check ConfigMap Details

1. After a ConfigMap is created, it displays in the list as below. You can click the three dots on the right and select the operation from the menu to modify it.

    ![configmap-list](/images/docs/project-user-guide/configurations/configmaps/configmap-list.jpg)

    - **Edit**: View and edit the basic information.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Modify Config**: Modify the key-value pair of the ConfigMap.
    - **Delete**: Delete the ConfigMap.

2. Click the name of the ConfigMap and you can go to its detail page. Under the tab **Detail**, you can see all the key-value pairs you have added for the ConfigMap.

    ![detail-page](/images/docs/project-user-guide/configurations/configmaps/detail-page.jpg)

3. Click **More** to display what operations about this ConfigMap you can do.

    ![configmap-dropdown-menu](/images/docs/project-user-guide/configurations/configmaps/configmap-dropdown-menu.jpg)

    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Modify Config**: Modify the key-value pair of the ConfigMap.
    - **Delete**: Delete the ConfigMap, and return to the list page.

4. Click the **Edit Info** to view and edit the basic information.

    ![edit-configmap-info](/images/docs/project-user-guide/configurations/configmaps/edit-configmap-info.jpg)
    

## Use a ConfigMap

When you create workloads, [Services](../../../project-user-guide/application-workloads/services/), [Jobs](../../../project-user-guide/application-workloads/jobs/) or [CronJobs](../../../project-user-guide/application-workloads/cronjob/), you may need to add environment variables for containers. On the **Container Image** page, check **Environment Variables** and click **Use ConfigMap or Secret** to use a ConfigMap from the list.

![use-configmap](/images/docs/project-user-guide/configurations/configmaps/use-configmap.jpg)