---
title: "Deploy MongoDB on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, MongoDB'
description: 'Learn how to deploy MongoDB from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy MongoDB on KubeSphere"
weight: 14250
---

[MongoDB](https://www.mongodb.com/) is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.

This tutorial walks you through an example of deploying MongoDB from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy MongoDB from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the upper-left corner.

2. Find MongoDB and click **Install** on the **App Information** page.

3. Set a name and select an app version. Make sure MongoDB is deployed in `demo-project` and click **Next**.

4. In **App Settings**, specify persistent volumes for the app and record the username and the password which will be used to access the app. When you finish, click **Install**.

   {{< notice note >}}

   To specify more values for MongoDB, use the toggle switch to see the app's manifest in YAML format and edit its configurations.

   {{</ notice >}}

5. Wait until MongoDB is up and running.

### Step 2: Access the MongoDB Terminal

1. Go to **Services** and click the service name of MongoDB.

2. Under **Pods**, expand the menu to see container details, and then click the **Terminal** icon.

3. In the pop-up window, enter commands in the terminal directly to use the app.

   ![mongodb-service-terminal](/images/docs/appstore/built-in-apps/mongodb-app/mongodb-service-terminal.jpg)

   {{< notice note >}}

   If you want to access MongoDB outside the cluster, click **More** and select **Edit External Access**. In the dialog that appears, select **NodePort** as the access mode. Use the port number to access MongoDB after it is exposed. You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed.

   {{</ notice >}} 

4. For more information, see [the official documentation of MongoDB](https://docs.mongodb.com/manual/).
