---
title: "Deploy Tomcat on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, Tomcat'
description: 'Learn how to deploy Tomcat from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy Tomcat on KubeSphere"
weight: 14292
version: "v3.3"
---
[Apache Tomcat](https://tomcat.apache.org/index.html) powers numerous large-scale, mission-critical web applications across a diverse range of industries and organizations. Tomcat provides a pure Java HTTP web server environment in which Java code can run.

This tutorial walks you through an example of deploying Tomcat from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy Tomcat from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the upper-left corner.

2. Find Tomcat and click **Install** on the **App Information** page.

1. Set a name and select an app version. Make sure Tomcat is deployed in `demo-project` and click **Next**.

2. In **App Settings**, you can use the default settings or customize the settings by editing the YAML file directly. Click **Install** to continue.

3. Wait until Tomcat is up and running.

### Step 2: Access the Tomcat terminal

1. Go to **Services** and click the service name of Tomcat.

2. Under **Pods**, expand the menu to see container details, and then click the **Terminal** icon.

3. You can view deployed projects in `/usr/local/tomcat/webapps`.

   ![view-project](/images/docs/v3.x/appstore/built-in-apps/tomcat-app/view-project.png)

### Step 3: Access a Tomcat project from your browser

To access a Tomcat project outside the cluster, you need to expose the app through a NodePort first.

1. Go to **Services** and click the service name of Tomcat.

2. Click **More** and select **Edit External Access** from the drop-down list.

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

4. Under **Ports**, you can see the port is exposed.

5. Access the sample Tomcat project through `<NodeIP>:<NodePort>/sample` in your browser. 

   ![access-tomcat-browser](/images/docs/v3.x/appstore/built-in-apps/tomcat-app/access-tomcat-browser.png)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed.

   {{</ notice >}} 

6. For more information about Tomcat, refer to [the official documentation of Tomcat](https://tomcat.apache.org/index.html).