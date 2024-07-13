---
title: "Deploy Meshery on KubeSphere"
keywords: 'Kubernetes, KubeSphere, Meshery,Serive Mesh, Layer5, app-store'
description: 'Learn how to deploy Meshery from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy Meshery on KubeSphere"
weight: 14240
version: "v3.4"
---
[Meshery](https://meshery.io/) is the open source, cloud native management plane that enables the adoption, operation, and management of Kubernetes, any service mesh, and their workloads.

This tutorial walks you through an example of deploying Meshery from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy Meshery from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the upper-left corner.
2. Search for **Meshery** in the App Store, and click on the search result to enter the app.

    ![meshery-app](/images/docs/v3.x/appstore/built-in-apps/meshery-app/meshery-app.png)

3. In the **App Information** page, click **Install** on the upper right corner.

    ![meshery-install](/images/docs/v3.x/appstore/built-in-apps/meshery-app/Meshery-install.png)

4. In the App Settings page, set the application **Name**, **Location** (as your Namespace), and App Version, and then click Next on the upper right corner.

    ![meshery-info](/images/docs/v3.x/appstore/built-in-apps/meshery-app/Meshery-info.png)

5. Configure the **values.yaml** file as needed, or click **Install** to use the default configuration.

    ![meshery-yaml](/images/docs/v3.x/appstore/built-in-apps/meshery-app/Meshery-yaml.png)

6. Wait for the deployment to be finished. Upon completion, **Meshery** will be shown as **Running** in KubeSphere.

    ![meshery-app-running](/images/docs/v3.x/appstore/built-in-apps/meshery-app/Meshery-app-running.png)

### Step 2: Access the Meshery Dashboard

1. Go to **Services** and click the service name of Meshery.
2. In the **Resource Status** page, copy the **NodePort** of Meshery.

    ![meshery-service](/images/docs/v3.x/appstore/built-in-apps/meshery-app/Meshery-service.png)

3. Access the Meshery Dashboard by entering **${NodeIP}:${NODEPORT}** in your browser.

    ![meshery-dashboard](/images/docs/v3.x/appstore/built-in-apps/meshery-app/meshery-dashboard.png)

4. For more information about Meshery, refer to [the official documentation of Meshery](https://docs.meshery.io/).