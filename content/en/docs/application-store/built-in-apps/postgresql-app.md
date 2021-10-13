---
title: "Deploy PostgreSQL on KubeSphere"
keywords: 'Kubernetes, KubeSphere, PostgreSQL, app-store'
description: 'Learn how to deploy PostgreSQL from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy PostgreSQL on KubeSphere"
weight: 14280
---

[PostgreSQL](https://www.postgresql.org/) is a powerful, open-source object-relational database system which is famous for reliability, feature robustness, and performance.

This tutorial walks you through an example of how to deploy PostgreSQL from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy PostgreSQL from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top-left corner.

   ![click-app-store](/images/docs/appstore/built-in-apps/postgresql-app/click-app-store.png)

2. Find PostgreSQL and click **Deploy** on the **App Information** page.

   ![postgresql-in-app-store](/images/docs/appstore/built-in-apps/postgresql-app/postgresql-in-app-store.png)

   ![deploy-postgresql](/images/docs/appstore/built-in-apps/postgresql-app/deploy-postgresql.png)

3. Set a name and select an app version. Make sure PostgreSQL is deployed in `demo-project` and click **Next**.

   ![deploy-postgresql-2](/images/docs/appstore/built-in-apps/postgresql-app/deploy-postgresql-2.png)

4. In **App Configurations**, specify persistent volumes for the app and record the username and the password which will be used later to access the app. When you finish, click **Deploy**.

   ![set-config](/images/docs/appstore/built-in-apps/postgresql-app/set-config.png)

   {{< notice note >}} 

   To specify more values for PostgreSQL, use the toggle switch to see the app’s manifest in YAML format and edit its configurations.

   {{</ notice >}} 

5. Wait until PostgreSQL is up and running.

   ![postgresql-ready](/images/docs/appstore/built-in-apps/postgresql-app/postgresql-ready.png)

### Step 2: Access the PostgreSQL Database

To access PostgreSQL outside the cluster, you need to expose the app through a NodePort first.

1. Go to **Services** and click the service name of PostgreSQL.

   ![access-postgresql](/images/docs/appstore/built-in-apps/postgresql-app/access-postgresql.png)

2. Click **More** and select **Edit Internet Access** from the drop-down menu.

   ![edit-internet-access](/images/docs/appstore/built-in-apps/postgresql-app/edit-internet-access.png)

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

   ![nodeport](/images/docs/appstore/built-in-apps/postgresql-app/nodeport.png)

4. Under **Service Ports**, you can see the port is exposed, which will be used in the next step to access the PostgreSQL database.

   ![port-number](/images/docs/appstore/built-in-apps/postgresql-app/port-number.png)

5. Expand the Pod menu under **Pods** and click the Terminal icon. In the pop-up window, enter commands directly to access the database.

   ![container-terminal](/images/docs/appstore/built-in-apps/postgresql-app/container-terminal.png)

   ![postgresql-output](/images/docs/appstore/built-in-apps/postgresql-app/postgresql-output.png)

   {{< notice note >}}

   You can also use a third-party application such as SQLPro Studio to connect to the database. You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 

6. For more information, see [the official documentation of PostgreSQL](https://www.postgresql.org/docs/).