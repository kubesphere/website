---
title: "Deploy Apps from App Templates"
keywords: 'Kubernetes, chart, helm, KubeSphere, application, app templates'
description: 'How to deploy apps from app templates in a private repository.'
linkTitle: "Deploy Apps from App Templates"

weight: 10120
---

When you deploy an app, you can select the app from the App Store which contains built-in apps of KubeSphere and [apps uploaded as Helm charts](../../../workspace-administration/upload-helm-based-application/). Alternatively, you can use apps from private app repositories added to KubeSphere to provide app templates.

This tutorial demonstrates how to quickly deploy [Grafana](https://grafana.com/) using the app template from a private repository, which is based on QingStor object storage.

## Prerequisites

- You have enabled [OpenPitirx (App Store)](../../../pluggable-components/app-store).
- You have completed the tutorial of [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project/). Namely, you must have a workspace, a project and two user accounts (`ws-admin` and `project-regular`). `ws-admin` must be granted the role of `workspace-admin` in the workspace and `project-regular` must be granted the role of `operator` in the project.

## Hands-on Lab

### Step 1: Add an App Repository

1. Log in the web console of KubeSphere as `ws-admin`. In your workspace, go to **App Repos** under **Apps Management**, and then click **Add Repo**.

   ![add-app-repo](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/add-app-repo.jpg)

2. In the dialogue that appears, enter `test-repo` for the app repository name and `https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/` for the repository URL. Click **Validate** to verify the URL and click **OK** to continue.

   ![input-repo-info](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/input-repo-info.jpg)

3. Your repository displays in the list after successfully imported to KubeSphere.

   ![repository-list](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/repository-list.jpg)

   {{< notice note >}}

   For more information about dashboard properties as you add a private repository, see [Import Helm Repository](../../../workspace-administration/app-repository/import-helm-repository/).

   {{</ notice >}} 

### Step 2: Deploy Grafana from App Templates

1. Log out of KubeSphere and log back in as `project-regular`. In your project, choose **Applications** under **Application Workloads** and click **Deploy New Application**.

   ![create-new-app](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/create-new-app.jpg)

2. Select **From App Templates** from the pop-up dialogue.

   ![select-app-templates](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/select-app-templates.jpg)

   **From App Store**: Choose built-in apps and apps uploaded individually as Helm charts.

   **From App Templates**: Choose apps from private app repositories and the workspace app pool.

3. Select `test-repo` from the drop-down list, which is the private app repository just uploaded.

   ![private-app-template](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/private-app-template.jpg)

   {{< notice note >}}

   The option **From workspace** in the list represents the workspace app pool, which contains apps uploaded as Helm charts. They are also part of app templates.

   {{</ notice >}} 

4. Input `Grafana` in the search bar to find the app, and then click it to deploy it.

   ![search-grafana](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/search-grafana.jpg)

   {{< notice note >}} 

   The app repository used in this tutorial is synchronized from the Google Helm repository. Some apps in it may not be deployed successfully as their Helm charts are maintained by different organizations.

   {{</ notice >}} 

5. You can view its app information and configuration files. Under **Versions**, select a version number from the list and click **Deploy**.

   ![deploy-grafana](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/deploy-grafana.jpg)

6. Set an app name and confirm the version and deployment location. Click **Next** to continue.

   ![confirm-info](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/confirm-info.jpg)
   
7. In **App Config**, you can manually edit the manifest file or click **Deploy** directly.

   ![app-config](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/app-config.jpg)

8. Wait for Grafana to be up and running.

### Step 3: Expose Grafana Service

To access Grafana outside the cluster, you need to expose the app through NodePort first.

1. Go to **Services** and click the service name of Grafana.

   ![grafana-services](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/grafana-services.jpg)

2. Click **More** and select **Edit Internet Access** from the drop-down menu.

   ![edit-access](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/edit-access.jpg)

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/).

   ![nodeport](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/nodeport.jpg)

4. Under **Service Ports**, you can see the port is exposed.

   ![exposed-port](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/exposed-port.jpg)

### Step 4: Access Grafana

1. To access the Grafana dashboard, you need the username and password. Navigate to **Secrets** and click the item that has the same name as the app name.

   ![grafana-secret](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/grafana-secret.jpg)

2. On the detail page, click the eye icon first and you can see the username and password.

   ![secret-page](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/secret-page.jpg)

   ![click-eye-icon](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/click-eye-icon.jpg)

2. Access Grafana through `${Node IP}:${NODEPORT}`.

   ![grafana-UI](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/grafana-UI.jpg)

   ![home-page](/images/docs/project-user-guide/applications/deploy-apps-from-app-templates/home-page.jpg)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 