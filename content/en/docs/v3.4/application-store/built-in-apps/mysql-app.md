---
title: "Deploy MySQL on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, MySQL'
description: 'Learn how to deploy MySQL from the App Store of KubeSphere and access its service.'

link title: "Deploy MySQL"
weight: 14260
version: "v3.4"
---
[MySQL](https://www.mysql.com/) is an open-source relational database management system (RDBMS), which uses the most commonly used database management language - Structured Query Language (SQL) for database management. It provides a fully managed database service to deploy cloud-native applications using the world's most popular open-source database.

This tutorial walks you through an example of deploying MySQL from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy MySQL from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the upper-left corner.

2. Find MySQL and click **Install** on the **App Information** page.

3. Set a name and select an app version. Make sure MySQL is deployed in `demo-project` and click **Next**.

4. In **App Settings**, uncomment the `mysqlRootPassword` field and customize the password. Click **Install** to continue.

5. Wait until MySQL is up and running.

### Step 2: Access the MySQL terminal

1. Go to **Workloads** and click the workload name of MySQL.

2. Under **Pods**, expand the menu to see container details, and then click the **Terminal** icon.

3. In the terminal, execute `mysql -uroot -ptesting` to log in to MySQL as the root user.

   ![log-in-mysql](/images/docs/v3.x/appstore/built-in-apps/mysql-app/log-in-mysql.png)

### Step 3: Access the MySQL database outside the cluster

To access MySQL outside the cluster, you need to expose the app through a NodePort first.

1. Go to **Services** and click the service name of MySQL.

2. Click **More** and select **Edit External Access** from the drop-down list.

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

4. Under **Ports**, you can see the port is exposed. The port and public IP address will be used in the next step to access the MySQL database.

5. To access your MySQL database, you need to use the MySQL client or install a third-party application such as SQLPro Studio for the connection. The following example demonstrates how to access the MySQL database through SQLPro Studio.

   ![login](/images/docs/v3.x/appstore/built-in-apps/mysql-app/login.png)

   ![access-mysql-success](/images/docs/v3.x/appstore/built-in-apps/mysql-app/access-mysql-success.png)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed.

   {{</ notice >}} 

6. For more information about MySQL, refer to [the official documentation of MySQL](https://dev.mysql.com/doc/).
