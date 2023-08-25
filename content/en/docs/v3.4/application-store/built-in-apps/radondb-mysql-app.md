---
title: "Deploy RadonDB MySQL on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, RadonDB MySQL'
description: 'Learn how to deploy RadonDB MySQL from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy RadonDB MySQL on KubeSphere"
weight: 14293
---

[RadonDB MySQL](https://github.com/radondb/radondb-mysql-kubernetes) is an open source, cloud-native, and highly available cluster solution based on [MySQL](https://MySQL.org) database. With the Raft protocol, RadonDB MySQL enables fast failover without losing any transactions.

This tutorial demonstrates how to deploy RadonDB MySQL from the App Store of KubeSphere.

{{< notice note >}}

The version of RadonDB MySQL in **App Store** is v1.0.0, and is no longer maintained.

We recommend you to use the latest version of RadonDB MySQL. For deployment instructions, please refer to [Deploy RadonDB MySQL Operator and Cluster](../../external-apps/deploy-radondb-mysql/).

{{</ notice >}}

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy RadonDB MySQL from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top-left corner.

2. Find RadonDB MySQL and click **Install** on the **App Information** page.

3. Set a name and select an app version. Make sure RadonDB MySQL is deployed in `demo-project` and click **Next**.

4. In **App Settings**, you can use the default settings or customize the settings by editing the YAML file directly. When you finish, click **Install**.

5. Wait until RadonDB MySQL is up and running.

### Step 2: Access RadonDB MySQL

1. In **Services** under **Application Workloads**, click the Service name of RadonDB MySQL.

2. Under **Pods**, expand the menu to see container details, and then click the **Terminal** icon.

3. In the pop-up window, enter commands in the terminal directly to use the app.

   ![Access RadonDB MySQL](/images/docs/v3.3/appstore/built-in-apps/radondb-mysql-app/radondb-mysql-service-terminal.png)

4. If you want to access RadonDB MySQL outside the cluster, see [the open-source project of RadonDB MySQL](https://github.com/radondb/radondb-mysql-kubernetes) in detail.
