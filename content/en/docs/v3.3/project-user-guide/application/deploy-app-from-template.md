---
title: "Deploy Apps from App Templates"
keywords: 'Kubernetes, Chart, Helm, KubeSphere, Application, App Templates'
description: 'Learn how to deploy an application from a Helm-based template.'
linkTitle: "Deploy Apps from App Templates"
weight: 10120
---

When you deploy an app, you can select the app from the App Store which contains built-in apps of KubeSphere and [apps uploaded as Helm charts](../../../workspace-administration/upload-helm-based-application/). Alternatively, you can use apps from private app repositories added to KubeSphere to provide app templates.

This tutorial demonstrates how to quickly deploy [Grafana](https://grafana.com/) using the app template from a private repository, which is based on QingStor object storage.

## Prerequisites

- You have enabled [OpenPitrix (App Store)](../../../pluggable-components/app-store/).
- You have completed the tutorial of [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/). Namely, you must have a workspace, a project and two users (`ws-admin` and `project-regular`). `ws-admin` must be granted the role of `workspace-admin` in the workspace and `project-regular` must be granted the role of `operator` in the project.

## Hands-on Lab

### Step 1: Add an app repository

1. Log in to the web console of KubeSphere as `ws-admin`. In your workspace, go to **App Repositories** under **App Management**, and then click **Add**.

2. In the displayed dialog box, enter `test-repo` for the app repository name and `https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/` for the repository URL. Click **Validate** to verify the URL, set **Synchronization Interval** based on your needs, and click **OK**.

3. Your repository is displayed in the list after successfully imported to KubeSphere.

   {{< notice note >}}

   For more information about dashboard properties as you add a private repository, see [Import Helm Repository](../../../workspace-administration/app-repository/import-helm-repository/).

   {{</ notice >}} 

### Step 2: Deploy Grafana from app templates

1. Log out of KubeSphere and log back in as `project-regular`. In your project, go to **Apps** under **Application Workloads** and click **Create**.

2. Select **From App Template** in the displayed dialog box.

   **From App Store**: Choose built-in apps and apps uploaded individually as Helm charts.

   **From App Templates**: Choose apps from private app repositories and the workspace app pool.

3. Select `test-repo` from the drop-down list, which is the private app repository just uploaded.

   {{< notice note >}}

   The option **Current workspace** in the list represents the workspace app pool, which contains apps uploaded as Helm charts. They are also part of app templates.

   {{</ notice >}} 

4. Enter `grafana` in the search box to search for the app, and then click it to deploy it.

   {{< notice note >}} 

   The app repository used in this tutorial is synchronized from the Google Helm repository. Some apps in it may not be deployed successfully as their Helm charts are maintained by different organizations.

   {{</ notice >}} 

5. Its app information and configuration files are also displayed. Under **Version**, select a version number from the list and click **Install**.

6. Set an app name and confirm the version and deployment location. Click **Next**.
   
7. In **App Settings**, manually edit the manifest file or click **Install** directly.

8. Wait for Grafana to be up and running.

### Step 3: Expose the Grafana Service

To access Grafana outside the cluster, you need to expose the app through a NodePort first.

1. Go to **Services** and click the service name of Grafana.

2. Click **More** and select **Edit External Access** from the drop-down menu.

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

4. Under **Ports**, view the exposed port.

### Step 4: Access Grafana

1. To access the Grafana dashboard, you need the username and password. Go to **Secrets** under **Configuration** and click the item that has the same name as the app name.

2. On the details page, click the eye icon to view the username and password.

3. Access Grafana through `<Node IP>:<NodePort>`.

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 