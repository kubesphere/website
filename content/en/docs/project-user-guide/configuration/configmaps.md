---
title: "ConfigMaps"
keywords: 'KubeSphere, Kubernetes, ConfigMaps'
description: 'Learn how to create a ConfigMap in KubeSphere.'
linkTitle: "ConfigMaps"
weight: 10420
---

A Kubernetes [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/) is used to store configuration data in the form of key-value pairs. The ConfigMap resource provides a way to inject configuration data into Pods. The data stored in a ConfigMap object can be referenced in a volume of type `ConfigMap` and then consumed by containerized applications running in a Pod. ConfigMaps are often used in the following cases:

- Set the value of environment variables.
- Set command parameters in containers.
- Create a configuration file in volumes.

This tutorial demonstrates how to create a ConfigMap in KubeSphere.

## Prerequisites

You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create a ConfigMap

1. Log in to the console as `project-regular`. Go to **Configuration** of a project, select **ConfigMaps** and click **Create**.

2. In the displayed dialog box, specify a name for the ConfigMap (for example, `demo-configmap`) and click **Next** to continue.

   {{< notice tip >}}

You can see the ConfigMap manifest file in YAML format by enabling **Edit YAML** in the upper-right corner. KubeSphere allows you to edit the manifest file directly to create a ConfigMap. Alternatively, you can follow the steps below to create a ConfigMap via the dashboard.

{{</ notice >}} 

3. On the **Data Settings** tab, configure values by clicking **Add Data**.

4. Enter a key-value pair. For example:

   {{< notice note >}}

- key-value pairs displays under the field `data` in the manifest.

- On the KubeSphere dashboard, you can only add key-value pairs for a ConfigMap currently. In future releases, you will be able to add a path to a directory containing configuration files to create ConfigMaps directly on the dashboard.

{{</ notice >}} 

5. Click **√** in the lower-right corner to save it and click **Add Data** again if you want to add more key-value pairs.

6. Click **Create** to generate the ConfigMap.

## View ConfigMap Details

1. After a ConfigMap is created, it is displayed on the **ConfigMaps** page. You can click <img src="/images/docs/project-user-guide/configurations/configmaps/three-dots.png" height="20px"> on the right and select the operation below from the drop-down list.

    - **Edit Information**: View and edit the basic information.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Edit Settings**: Modify the key-value pair of the ConfigMap.
    - **Delete**: Delete the ConfigMap.
    
2. Click the name of the ConfigMap to go to its details page. Under the tab **Data**, you can see all the key-value pairs you have added for the ConfigMap.

3. Click **More** to display what operations about this ConfigMap you can do.

    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Edit Settings**: Modify the key-value pair of the ConfigMap.
    - **Delete**: Delete the ConfigMap, and return to the list page.

4. Click **Edit Information** to view and edit the basic information.


## Use a ConfigMap

When you create workloads, [Services](../../../project-user-guide/application-workloads/services/), [Jobs](../../../project-user-guide/application-workloads/jobs/) or [CronJobs](../../../project-user-guide/application-workloads/cronjobs/), you may need to add environment variables for containers. On the **Add Container** page, check **Environment Variables** and click **From secret** to use a ConfigMap from the list.
