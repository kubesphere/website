---
title: "Deploy NGINX on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, NGINX'
description: 'Learn how to deploy NGINX from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy NGINX on KubeSphere"
weight: 14270
---

[NGINX](https://www.nginx.com/) is an open-source software application for web serving, reverse proxying, caching, load balancing, media streaming, and more.

This tutorial walks you through an example of deploying NGINX from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy NGINX from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top-left corner.

   ![app-store](/images/docs/appstore/built-in-apps/nginx-app/app-store.png)

2. Find NGINX and click **Deploy** on the **App Information** page.

   ![nginx-in-app-store](/images/docs/appstore/built-in-apps/nginx-app/nginx-in-app-store.png)

   ![deploy-nginx](/images/docs/appstore/built-in-apps/nginx-app/deploy-nginx.png)

3. Set a name and select an app version. Make sure NGINX is deployed in `demo-project` and click **Next**.

   ![confirm-deployment](/images/docs/appstore/built-in-apps/nginx-app/confirm-deployment.png)

4. In **App Configurations**, specify the number of replicas to deploy for the app and enable Ingress based on your needs. When you finish, click **Deploy**.

   ![edit-config-nginx](/images/docs/appstore/built-in-apps/nginx-app/edit-config-nginx.png)

   ![manifest-file](/images/docs/appstore/built-in-apps/nginx-app/manifest-file.png)

   {{< notice note >}}

   To specify more values for NGINX, use the toggle switch to see the app’s manifest in YAML format and edit its configurations. 

   {{</ notice >}}

5. Wait until NGINX is up and running.

   ![nginx-running](/images/docs/appstore/built-in-apps/nginx-app/nginx-running.png)

### Step 2: Access NGINX

To access NGINX outside the cluster, you need to expose the app through a NodePort first.

1. Go to **Services** and click the service name of NGINX.

   ![nginx-service](/images/docs/appstore/built-in-apps/nginx-app/nginx-service.png)

2. On the service detail page, click **More** and select **Edit Internet Access** from the drop-down menu.

   ![edit-internet-access](/images/docs/appstore/built-in-apps/nginx-app/edit-internet-access.png)

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

   ![nodeport](/images/docs/appstore/built-in-apps/nginx-app/nodeport.png)

4. Under **Service Ports**, you can see the port is exposed.

   ![exposed-port](/images/docs/appstore/built-in-apps/nginx-app/exposed-port.png)

5. Access NGINX through `<NodeIP>:<NodePort>`.

   ![access-nginx](/images/docs/appstore/built-in-apps/nginx-app/access-nginx.png)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 

6. For more information, see [the official documentation of NGINX](https://docs.nginx.com/?_ga=2.48327718.1445131049.1605510038-1186152749.1605510038).
