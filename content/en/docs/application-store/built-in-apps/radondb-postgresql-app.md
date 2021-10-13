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

   ![RadonDB PostgreSQL-in-app-store](/images/docs/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql-in-app-store.png)

3. Find RadonDB PostgreSQL and click **Deploy** on the **App Information** page.

   ![deploy-RadonDB PostgreSQL](/images/docs/appstore/built-in-apps/radondb-postgresql-app/deploy-radondb-postgresql.png)

4. Set a name and select an app version. Make sure RadonDB PostgreSQL is deployed in `demo-project` and click **Next**.

   ![confirm-deployment](/images/docs/appstore/built-in-apps/radondb-postgresql-app/confirm-deployment.png)

5. In **App Configurations**, you can use the default configuration or customize the configuration by editing the YAML file. When you finish, click **Deploy**.

   ![set-app-configuration](/images/docs/appstore/built-in-apps/radondb-postgresql-app/set-app-configuration.png)

6. Wait until RadonDB PostgreSQL is up and running.

   ![RadonDB PostgreSQL-running](/images/docs/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql-running.png)

### Step 2: View PostgreSQL Cluster status

1. On the **Overview** page of the project `demo-project`, you can see a list of resource usage in the current project.

   ![project-overview](/images/docs/appstore/built-in-apps/radondb-postgresql-app/project-overview.png)

2. In **Workloads** under **Application Workloads**, click the **StatefulSets** tab and you can see the StatefulSet is up and running.

   ![statefulsets-running](/images/docs/appstore/built-in-apps/radondb-postgresql-app/statefulsets-running.png)

   Click the StatefulSet to go to its detail page. You can see the metrics in line charts over a period of time under the **Monitoring** tab.

   ![statefulset-monitoring](/images/docs/appstore/built-in-apps/radondb-postgresql-app/statefulset-monitoring.png)

3. In **Pods** under **Application Workloads**, you can see all the Pods are up and running.

   ![pods-running](/images/docs/appstore/built-in-apps/radondb-postgresql-app/pods-running.png)

4. In **Volumes** under **Storage**, you can see the PostgreSQL Cluster components are using persistent volumes.

   ![volumes](/images/docs/appstore/built-in-apps/radondb-postgresql-app/volumes.png)

   Volume usage is also monitored. Click a volume item to go to its detail page. Here is an example of one of the data nodes.

   ![volume-status](/images/docs/appstore/built-in-apps/radondb-postgresql-app/volume-status.png)

### Step 3: Access RadonDB PostgreSQL

1. Go to **Pods** under **Application Workloads** and click a Pod to go to its details page.

2. On the **Resource Status** page, click the **Terminal** icon.

   ![RadonDB PostgreSQL-terminal](/images/docs/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql-terminal.png)

3. In the displayed dialog box, run the following command and enter the user password in the terminal to use the app.

   ```bash
   psql -h <Pod name> -p 5432 -U postgres -d postgres
   ```

   ![Access RadonDB PostgreSQL](/images/docs/appstore/built-in-apps/radondb-postgresql-app/radondb-postgresql-service-terminal.png)

4. If you want to access RadonDB PostgreSQL outside the cluster, see [the open-source project of RadonDB PostgreSQL](https://github.com/radondb/radondb-postgresql-kubernetes) in detail.
