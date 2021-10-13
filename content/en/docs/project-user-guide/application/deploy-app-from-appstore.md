---
title: "Deploy Apps from the App Store"
keywords: 'Kubernetes, Chart, Helm, KubeSphere, Application, App Store'
description: 'Learn how to deploy an application from the App Store.'
linkTitle: "Deploy Apps from the App Store"
weight: 10130
---

The [App Store](../../../application-store/) is also the public app repository on the platform, which means every tenant on the platform can view the applications in the Store regardless of which workspace they belong to. The App Store contains 16 featured enterprise-ready containerized apps and apps released by tenants from different workspaces on the platform. Any authenticated users can deploy applications from the Store. This is different from private app repositories which are only accessible to tenants in the workspace where private app repositories are imported.

This tutorial demonstrates how to quickly deploy [NGINX](https://www.nginx.com/) from the KubeSphere App Store powered by [OpenPitrix](https://github.com/openpitrix/openpitrix) and access its service through a NodePort.

## Prerequisites

- You have enabled [OpenPitrix (App Store)](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user invited to the project with the `operator` role. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy NGINX from the App Store

1. Log in to the web console of KubeSphere as `project-regular` and click **App Store** in the top-left corner.

   {{< notice note >}}

   You can also go to **Apps** under **Application Workloads** in your project, click **Deploy New App**, and select **From App Store** to go to the App Store.

   {{</ notice >}} 

2. Find NGINX and click **Deploy** on the **App Information** page.

   ![nginx-in-app-store](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/nginx-in-app-store.png)

   ![deploy-nginx](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/deploy-nginx.png)

3. Set a name and select an app version. Make sure NGINX is deployed in `demo-project` and click **Next**.

   ![confirm-deployment](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/confirm-deployment.png)

4. In **App Configurations**, specify the number of replicas to deploy for the app and enable Ingress based on your needs. When you finish, click **Deploy**.

   ![edit-config-nginx](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/edit-config-nginx.png)

   ![manifest-file](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/manifest-file.png)

   {{< notice note >}}

   To specify more values for NGINX, use the toggle switch to see the app’s manifest in YAML format and edit its configurations. 

   {{</ notice >}}

5. Wait until NGINX is up and running.

   ![nginx-running](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/nginx-running.png)

### Step 2: Access NGINX

To access NGINX outside the cluster, you need to expose the app through a NodePort first.

1. Go to **Services** and click the service name of NGINX.

   ![nginx-service](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/nginx-service.png)

2. On the Service detail page, click **More** and select **Edit Internet Access** from the drop-down menu.

   ![edit-internet-access](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/edit-internet-access.png)

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

   ![nodeport](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/nodeport.png)

4. Under **Service Ports**, you can see the port is exposed.

   ![exposed-port](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/exposed-port.png)

5. Access NGINX through `<NodeIP>:<NodePort>`.

   ![access-nginx](/images/docs/project-user-guide/applications/deploy-apps-from-app-store/access-nginx.png)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 