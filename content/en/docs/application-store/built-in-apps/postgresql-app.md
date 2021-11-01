---
title: "Deploy PostgreSQL on KubeSphere"
keywords: 'Kubernetes, KubeSphere, PostgreSQL, app-store'
description: 'Learn how to deploy PostgreSQL from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy PostgreSQL on KubeSphere"
weight: 14280
---

[PostgreSQL](https://www.postgresql.org/) is a powerful, open-source object-relational database system, which is famous for reliability, feature robustness, and performance.

This tutorial walks you through an example of how to deploy PostgreSQL from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy PostgreSQL from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the upper-left corner.

2. Find PostgreSQL and click **Deploy** on the **App Information** page.

3. Set a name and select an app version. Make sure PostgreSQL is deployed in `demo-project` and click **Next**.

4. In **App Settings**, specify persistent volumes for the app and record the username and the password, which will be used later to access the app. When you finish, click **Deploy**.

   {{< notice note >}} 

   To specify more values for PostgreSQL, use the toggle switch to see the app's manifest in YAML format and edit its configurations.

   {{</ notice >}} 

5. Wait until PostgreSQL is up and running.

### Step 2: Access the PostgreSQL database

To access PostgreSQL outside the cluster, you need to expose the app through a NodePort first.

1. Go to **Services** and click the service name of PostgreSQL.

2. Click **More** and select **Edit External Access** from the drop-down list.

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

4. Under **Ports**, you can see the port is exposed, which will be used in the next step to access the PostgreSQL database.

5. Expand the Pod menu under **Pods** and click the **Terminal** icon. In the pop-up window, enter commands directly to access the database.

   ![postgresql-output](/images/docs/appstore/built-in-apps/postgresql-app/postgresql-output.png)

   {{< notice note >}}

   You can also use a third-party application such as SQLPro Studio to connect to the database. You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed.

   {{</ notice >}} 

6. For more information, see [the official documentation of PostgreSQL](https://www.postgresql.org/docs/).