---
title: "Deploy MinIO on KubeSphere"
keywords: 'Kubernetes, KubeSphere, Minio, app-store'
description: 'Learn how to deploy Minio from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy MinIO on KubeSphere"
weight: 14240
---
[MinIO](https://min.io/) object storage is designed for high performance and the S3 API. It is ideal for large, private cloud environments with stringent security requirements and delivers mission-critical availability across a diverse range of workloads.

This tutorial walks you through an example of deploying MinIO from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy MinIO from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the upper-left corner.

2. Find MinIO and click **Deploy** on the **App Information** page.

3. Set a name and select an app version. Make sure MinIO is deployed in `demo-project` and click **Next**.

4. In **App Settings**, you can use the default configuration or customize the configuration by editing the YAML file directly. Click **Deploy** to continue.

5. Wait until MinIO is up and running.

### Step 2: Access the MinIO browser

To access MinIO outside the cluster, you need to expose the app through a NodePort first.

1. Go to **Services** and click the service name of MinIO.

2. Click **More** and select **Edit External  Access** from the drop-down menu.

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

4. On the **Services** page, click **MinIO**. On the page that appears, under **Ports**, you can see the port is exposed.

5. To access the MinIO browser, you need `accessKey` and `secretKey`, which are specified in the configuration file of MinIO. Go to **Template-Based Apps** in **Apps**, click MinIO, and you can find the value of these two fields under the tab **Chart Files**.

6. Access the MinIO browser through `<NodeIP>:<NodePort>` using `accessKey` and `secretKey`.

   ![minio-browser](/images/docs/appstore/built-in-apps/minio-app/minio-browser.png)

   ![minio-browser-interface](/images/docs/appstore/built-in-apps/minio-app/minio-browser-interface.png)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed.

   {{</ notice >}} 

7. For more information about MinIO, refer to [the official documentation of MinIO](https://docs.min.io/).