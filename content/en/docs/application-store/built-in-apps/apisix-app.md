---
title: "Deploy APISIX on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, APISIX'
description: 'How to deploy APISIX from the App Store of KubeSphere'
linkTitle: "Deploy APISIX on KubeSphere"
weight: 14270
---

[Apache APISIX](https://apisix.apache.org/) is a Dynamic High-performance Cloud-Native API Gateway

This tutorial walks you through an example of deploying APISIX from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy APISIX from the App Store (KubeSphere 3.1)

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top left corner.

   ![app-store](/images/docs/appstore/built-in-apps/nginx-app/app-store.jpg)

2. Find APISIX and click **Deploy** on the **App Info** page.

   ![apisix-in-app-store](/images/docs/appstore/built-in-apps/nginx-app/nginx-in-app-store.jpg)

   ![deploy-apisix](/images/docs/appstore/built-in-apps/nginx-app/deploy-nginx.jpg)

3. Set a name and select an app version. Make sure NGINX is deployed in `demo-project` and click **Next**.

   ![confirm-deployment](/images/docs/appstore/built-in-apps/nginx-app/confirm-deployment.jpg)

4. In **App Config**, specify the number of replicas to deploy for the app and enable Ingress based on your needs. When you finish, click **Deploy**.

   ![edit-config-apisix](/images/docs/appstore/built-in-apps/nginx-app/edit-config-nginx.jpg)

   ![manifest-file](/images/docs/appstore/built-in-apps/nginx-app/manifest-file.jpg)

   {{< notice note >}}

   To specify more values for NGINX, use the toggle switch to see the app’s manifest in YAML format and edit its configurations. 

   {{</ notice >}}

5. Wait until APISIX&ETCD is up and running.

   ![apisix-running](/images/docs/appstore/built-in-apps/nginx-app/nginx-running.jpg)

### Step 2: Access APISIX

To access APISIX outside the cluster, you need to expose the app through NodePort first.

1. Go to **Services** and click the service name of APISIX.

   ![apisix-service](/images/docs/appstore/built-in-apps/nginx-app/nginx-service.jpg)

2. On the service detail page, click **More** and select **Edit Internet Access** from the drop-down menu.

   ![edit-internet-access](/images/docs/appstore/built-in-apps/nginx-app/edit-internet-access.jpg)

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

   ![nodeport](/images/docs/appstore/built-in-apps/nginx-app/nodeport.jpg)

4. Under **Service Ports**, you can see the port is exposed.

   ![exposed-port](/images/docs/appstore/built-in-apps/nginx-app/exposed-port.jpg)

5. Access APISIX through `{$NodeIP}:{$Nodeport}`.

   ![access-apisix](/images/docs/appstore/built-in-apps/nginx-app/access-nginx.jpg)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 

6. For more information, see [the official documentation of APISIX](https://github.com/apache/apisix/blob/master/doc/README.md).
