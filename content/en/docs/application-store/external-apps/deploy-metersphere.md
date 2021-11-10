---
title: "Deploy MeterSphere on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Applications, MeterSphere'
description: 'Learn how to deploy MeterSphere on KubeSphere.'
linkTitle: "Deploy MeterSphere on KubeSphere"
weight: 14330
---

MeterSphere is an open-source, one-stop, and enterprise-level continuous testing platform. It features test tracking, interface testing, and performance testing.

This tutorial demonstrates how to deploy MeterSphere on KubeSphere.

## Prerequisites

- You need to enable [the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and two user accounts (`ws-admin` and `project-regular`) for this tutorial. The account `ws-admin` must be granted the role of `workspace-admin` in the workspace, and the account `project-regular` must be invited to the project with the role of `operator`. If they are not ready, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Add an app repository

1. Log in to KubeSphere as `ws-admin`. In your workspace, go to **App Repositories** under **App Management**, and then click **Add**.

2. In the dialog that appears, enter `metersphere` for the app repository name and `https://charts.kubesphere.io/test` for the MeterSphere repository URL. Click **Validate** to verify the URL and you will see a green check mark next to the URL if it is available. Click **OK** to continue.

3. Your repository displays in the list after it is successfully imported to KubeSphere.

### Step 2: Deploy MeterSphere

1. Log out of KubeSphere and log back in as `project-regular`. In your project, go to **Apps** under **Application Workloads** and click **Create**.

2. In the dialog that appears, select **From App Template**.

3. Select `metersphere` from the drop-down list, then click **metersphere-chart**.

4. On the **App Information** tab and the **Chart Files** tab, you can view the default configuration from the console. Click **Install** to continue.

5. On the **Basic Information** page, you can view the app name, app version, and deployment location. Click **Next** to continue.

6. On the **App Settings** page, change the value of `imageTag` from `master` to `v1.6`, and then click **Install**.

7. Wait for MeterSphere to be up and running.

8. Go to **Workloads**, and you can see two Deployments and three StatefulSets created for MeterSphere.
   
   {{< notice note >}}
   
   It may take a while before all the Deployments and StatefulSets are up and running.
   
   {{</ notice >}}

### Step 3: Access MeterSphere

1. Go to **Services** under **Application Workloads**, and you can see the MeterSphere Service and its type is set to `NodePort` by default. 

2. You can access MeterSphere through `<NodeIP>:<NodePort>` using the default account and password (`admin/metersphere`).

   ![login-metersphere](/images/docs/appstore/external-apps/deploy-metersphere/login-metersphere.PNG)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed. Make sure you use your own `NodeIP`.

   {{</ notice >}}
