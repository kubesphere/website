---
title: "Deploy MongoDB on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, MongoDB'
description: 'How to deploy MongoDB from the App Store of KubeSphere'
linkTitle: "Deploy MongoDB on KubeSphere"
weight: 261
---

[MongoDB](https://www.mongodb.com/) is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.

This tutorial walks you through an example of deploying MongoDB from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy MongoDB from App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top left corner.

   ![app-store](/images/docs/appstore/built-in-apps/mongodb-app/app-store.jpg)

2. Find MongoDB and click **Deploy** on the **App Info** page.

   ![mongodb-in-app-store](/images/docs/appstore/built-in-apps/mongodb-app/mongodb-in-app-store.jpg)

   ![deploy-mongodb](/images/docs/appstore/built-in-apps/mongodb-app/deploy-mongodb.jpg)

3. Set a name and select an app version. Make sure MongoDB is deployed in `demo-project` and click **Next**.

   ![confirm-deployment](/images/docs/appstore/built-in-apps/mongodb-app/confirm-deployment.jpg)

4. In **App Config**, specify persistent volumes for the app and record the username and the password which will be used to access the app. When you finish, click **Deploy**.

   ![set-app-configuration](/images/docs/appstore/built-in-apps/mongodb-app/set-app-configuration.jpg)

   {{< notice note >}}

   To specify more values for MongoDB, use the toggle switch to see the app’s manifest in YAML format and edit its configurations.

   {{</ notice >}}

5. Wait until MongoDB is up and running.

   ![mongodb-running](/images/docs/appstore/built-in-apps/mongodb-app/mongodb-running.jpg)

### Step 2: Access MongoDB Terminal

1. Go to **Services** and click the service name of MongoDB.

   ![mongodb-service](/images/docs/appstore/built-in-apps/mongodb-app/mongodb-service.jpg)

2. Under **Pods**, expand the menu to see container details, and then click the **Terminal** icon.

   ![mongodb-terminal](/images/docs/appstore/built-in-apps/mongodb-app/mongodb-terminal.jpg)

3. In the pop-up window, enter commands in the terminal directly to use the app.

   ![mongodb-service-terminal](/images/docs/appstore/built-in-apps/mongodb-app/mongodb-service-terminal.jpg)

   {{< notice note >}}

   If you want to access MongoDB outside the cluster, click **More** and select **Edit Internet Access**. In the dialogue that appears, select **NodePort** as the access mode. Use the port number to access MongoDB after it is exposed. You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 

4. For more information, see [the official documentation of MongoDB](https://docs.mongodb.com/manual/).
