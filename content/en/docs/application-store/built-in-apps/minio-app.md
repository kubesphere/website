---
title: "Deploy MinIO on KubeSphere"
keywords: 'Kubernetes, KubeSphere, Minio, app-store'
description: 'How to deploy Minio on KubeSphere from the App Store of KubeSphere'
linkTitle: "Deploy MinIO on KubeSphere"
weight: 14240
---
[MinIO](https://min.io/) object storage is designed for high performance and the S3 API. It is ideal for large, private cloud environments with stringent security requirements and delivers mission-critical availability across a diverse range of workloads.

This tutorial walks you through an example of deploying MinIO from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy MinIO from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top left corner.

   ![minio-app](/images/docs/appstore/built-in-apps/minio-app/minio-app.jpg)

2. Find MinIO and click **Deploy** on the **App Info** page.

   ![minio-in-app-store](/images/docs/appstore/built-in-apps/minio-app/minio-in-app-store.jpg)

   ![deploy-minio](/images/docs/appstore/built-in-apps/minio-app/deploy-minio.jpg)

3. Set a name and select an app version. Make sure MinIO is deployed in `demo-project` and click **Next**.

   ![minio-deploy](/images/docs/appstore/built-in-apps/minio-app/minio-deploy.jpg)

4. In **App Config**, you can use the default configuration or customize the configuration by editing the YAML file directly. Click **Deploy** to continue.

   ![deloy-minio-2](/images/docs/appstore/built-in-apps/minio-app/deloy-minio-2.jpg)

5. Wait until MinIO is up and running.

   ![minio-in-list](/images/docs/appstore/built-in-apps/minio-app/minio-in-list.jpg)

### Step 2: Access the MinIO Browser

To access MinIO outside the cluster, you need to expose the app through NodePort first.

1. Go to **Services** and click the service name of MinIO.

   ![minio-detail](/images/docs/appstore/built-in-apps/minio-app/minio-detail.jpg)

2. Click **More** and select **Edit Internet Access** from the drop-down menu.

   ![edit-internet-access](/images/docs/appstore/built-in-apps/minio-app/edit-internet-access.jpg)

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

   ![nodeport](/images/docs/appstore/built-in-apps/minio-app/nodeport.jpg)

4. Under **Service Ports**, you can see the port is exposed.

   ![port-exposed](/images/docs/appstore/built-in-apps/minio-app/port-exposed.jpg)

5. To access the MinIO browser, you need `accessKey` and `secretKey`, which are specified in the configuration file of MinIO. Go to **App Templates** in **Applications**, click MinIO, and you can find the value of these two fields under the tab **Configuration Files**.

   ![template-list](/images/docs/appstore/built-in-apps/minio-app/template-list.jpg)

   ![config-file](/images/docs/appstore/built-in-apps/minio-app/config-file.jpg)

6. Access the MinIO browser through `{$NodeIP}:{$Nodeport}` using `accessKey` and `secretKey`.

   ![minio-browser](/images/docs/appstore/built-in-apps/minio-app/minio-browser.jpg)

   ![minio-browser-interface](/images/docs/appstore/built-in-apps/minio-app/minio-browser-interface.jpg)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 

7. For more information about MinIO, refer to [the official documentation of MinIO](https://docs.min.io/).