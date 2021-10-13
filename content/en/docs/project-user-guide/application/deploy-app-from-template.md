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
- You have completed the tutorial of [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/). Namely, you must have a workspace, a project and two accounts (`ws-admin` and `project-regular`). `ws-admin` must be granted the role of `workspace-admin` in the workspace and `project-regular` must be granted the role of `operator` in the project.

## Hands-on Lab

### Step 1: Add an app repository

1. Log in to the web console of KubeSphere as `ws-admin`. In your workspace, go to **App Repositories** under **App Management**, and then click **Add**.

   ![add-app-repo](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/add-app-repo.png)

2. In the dialog that appears, enter `test-repo` for the app repository name and `https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/` for the repository URL. Click **Validate** to verify the URL and click **OK** to continue.

   ![input-repo-info](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/input-repo-info.png)

3. Your repository appears in the list after successfully imported to KubeSphere.

   ![repository-list](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/repository-list.png)

   {{< notice note >}}

   For more information about dashboard properties as you add a private repository, see [Import Helm Repository](../../../workspace-administration/app-repository/import-helm-repository/).

   {{</ notice >}} 

### Step 2: Deploy Grafana from app templates

1. Log out of KubeSphere and log back in as `project-regular`. In your project, choose **Apps** under **Application Workloads** and click **Deploy New App**.

   ![create-new-app](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/create-new-app.png)

2. Select **From App Templates** from the pop-up dialog.

   ![select-app-templates](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/select-app-templates.png)

   **From App Store**: Choose built-in apps and apps uploaded individually as Helm charts.

   **From App Templates**: Choose apps from private app repositories and the workspace app pool.

3. Select `test-repo` from the drop-down list, which is the private app repository just uploaded.

   ![private-app-template](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/private-app-template.png)

   {{< notice note >}}

   The option **From workspace** in the list represents the workspace app pool, which contains apps uploaded as Helm charts. They are also part of app templates.

   {{</ notice >}} 

4. Enter `Grafana` in the search bar to find the app, and then click it to deploy it.

   ![search-grafana](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/search-grafana.png)

   {{< notice note >}} 

   The app repository used in this tutorial is synchronized from the Google Helm repository. Some apps in it may not be deployed successfully as their Helm charts are maintained by different organizations.

   {{</ notice >}} 

5. You can view its app information and configuration files. Under **Versions**, select a version number from the list and click **Deploy**.

   ![deploy-grafana](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/deploy-grafana.png)

6. Set an app name and confirm the version and deployment location. Click **Next** to continue.

   ![confirm-info](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/confirm-info.png)
   
7. In **App Configurations**, you can manually edit the manifest file or click **Deploy** directly.

   ![app-config](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/app-config.png)

8. Wait for Grafana to be up and running.

### Step 3: Expose the Grafana Service

To access Grafana outside the cluster, you need to expose the app through a NodePort first.

1. Go to **Services** and click the service name of Grafana.

   ![grafana-services](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/grafana-services.png)

2. Click **More** and select **Edit Internet Access** from the drop-down menu.

   ![edit-access](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/edit-access.png)

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

   ![nodeport](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/nodeport.png)

4. Under **Service Ports**, you can see the port is exposed.

   ![exposed-port](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/exposed-port.png)

### Step 4: Access Grafana

1. To access the Grafana dashboard, you need the username and password. Navigate to **Secrets** and click the item that has the same name as the app name.

   ![grafana-secret](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/grafana-secret.png)

2. On the detail page, click the eye icon and you can see the username and password.

   ![secret-page](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/secret-page.png)

   ![click-eye-icon](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/click-eye-icon.png)

2. Access Grafana through `<Node IP>:<NodePort>`.

   ![grafana-UI](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/grafana-UI.png)

   ![home-page](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/home-page.png)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 