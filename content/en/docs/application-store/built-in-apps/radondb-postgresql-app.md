---
title: "Deploy RadonDB PostgreSQL on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, RadonDB PostgreSQL'
description: 'Learn how to deploy RadonDB PostgreSQL from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy RadonDB PostgreSQL on KubeSphere"
weight: 14294
---

[RadonDB PostgreSQL](https://github.com/radondb/radondb-postgresql-kubernetes) is an open source, cloud-native, and highly available cluster solution based on [PostgreSQL](https://postgresql.org) database system.

This tutorial demonstrates how to deploy RadonDB PostgreSQL from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy RadonDB PostgreSQL from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the upper-left corner.

2. Click **Database & Cache** under **Categories**.

3. Find RadonDB PostgreSQL and click **Install** on the **App Information** page.

4. Set a name and select an app version. Make sure RadonDB PostgreSQL is deployed in `demo-project` and click **Next**.

5. In **App Settings**, you can use the default settings or customize the settings by editing the YAML file. When you finish, click **Install**.

6. Wait until RadonDB PostgreSQL is up and running.

### Step 2: View PostgreSQL cluster status

1. On the **Overview** page of the project `demo-project`, you can see a list of resource usage in the current project.

2. In **Workloads** under **Application Workloads**, click the **StatefulSets** tab, and then you can see the StatefulSet is up and running.

   Click the StatefulSet to go to its detail page. You can see the metrics in line charts over a period of time under the **Monitoring** tab.

3. In **Pods** under **Application Workloads**, you can see all the Pods are up and running.

4. In **Persistent Volume Claims** under **Storage**, you can see the PostgreSQL Cluster components are using persistent volumes.

   Usage of the persistent volume is also monitored. Click a persistent volume to go to its detail page.

### Step 3: Access RadonDB PostgreSQL

1. Go to **Pods** under **Application Workloads** and click a Pod to go to its details page.

2. On the **Resource Status** page, click the **Terminal** icon.

3. In the displayed dialog box, run the following command and enter the user password in the terminal to use the app.

   ```bash
   psql -h <Pod name> -p 5432 -U postgres -d postgres
   ```

   ![Access RadonDB PostgreSQL](/images/docs/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql-service-terminal.png)

4. If you want to access RadonDB PostgreSQL outside the cluster, see [the open-source project of RadonDB PostgreSQL](https://github.com/radondb/radondb-postgresql-kubernetes) in detail.
