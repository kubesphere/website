---
title: "Deploy Applications from App Repository"
keywords: 'kubernetes, chart, helm, KubeSphere, application'
description: 'Deploy Applications from App Repository'


weight: 2211
---

## Objective

This tutorial shows you how to quickly deploy a [Grafana](https://grafana.com/) application using templates from KubeSphere application store sponsored by [OpenPitrix](https://github.com/openpitrix/openpitirx). The demonstration includes importing application repository, sharing and deploying apps within a workspace.

## Prerequisites

- You have enabled [KubeSphere App Store](../../pluggable-components/app-store)
- You have completed the tutorial in [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/)

## Hands-on Lab

### Step 1: Add an Application Repository

> Note: The application repository can be hosted by either object storage, e.g. [QingStor Object Storage](https://www.qingcloud.com/products/qingstor/), [AWS S3](https://aws.amazon.com/what-is-cloud-object-storage/), or by [GitHub Repository](https://github.com/). The packages are composed of Helm Chart template files of the applications. Therefore, before adding an application repository to KubeSphere, you need to create an object storage bucket and upload Helm packages in advance. This tutorial prepares a demo repository based on QingStor Object Storage.

1.1. Sign in with `ws-admin` account, click **View Workspace** and navigate to **Workspace Settings → App Repos**, then click **Create App Repository**.

![Add App Repo](/images/application-templates/create-app-repo.png)

1.2. Fill in the basic information, name it `demo-repo` and input the URL `https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/`. You can validate if this URL is available, and choose **OK** when you have done.

> Note: It will automatically import all of the applications from the Helm repository into KubeSphere. You can browse those app templates in each project.

![Add App Repo](/images/application-templates/validate-repo2.png)

### Step 2: Browse App Templates

2.1. Switch to use `project-regular` account to log in, then enter into `demo-project`.

2.2. Click **Application Workloads → Applications**, click **Deploy New Application**.

![App List](/images/application-templates/20200106161804.png)

2.3. Choose **From App Templates** and select `demo-repo` from the dropdown list.

![App Templates](/images/application-templates/20200106162219.png)

2.4. Search `Grafana` and click into Grafana App. We will demonstrate deploying Grafana to Kubernetes as an example.

> Note: The applications of this demo repository are synchronized from the Google Helm repo. Some applications may not be able to be deployed successfully, since the helm charts were maintained by different organizations.

### Step 3: Deploy Grafana Application

3.1. Click **Deploy** on the right. Generally you do not need to change any configuration, just click **Deploy**.

![View Grafana](/images/application-templates/20200106171747.png)

3.2. Wait for two minutes, then you will see the application `grafana` showing `active` on the application list.

![Deploy Grafana](/images/application-templates/20200106172151.png)

### Step 4: Expose Grafana Service

4.1. Click into Grafana application, and then enter into its service page.

![View Grafana Detail](/images/application-templates/20200106172416.png)

4.2. In this page, make sure its deployment and Pod are running, then click **More → Edit Internet Access**, and select **NodePort** in the dropdown list, click **OK** to save it.

![Edit Internet Access for Grafana Service](/images/application-templates/20200106172532.png)

4.3. At this point, you will be able to access Grafana service from outside of the cluster.

![Grafana Service Endpoint](/images/application-templates/20200106172837.png)

### Step 5: Access the Grafana Service

In this step, we can access Grafana service using `${Node IP}:${NODEPORT}`, e.g. `http://192.168.0.54:31407`, or click the button **Click to visit** to access the Grafana dashboard.

5.1. Note you have to obtain the account and password from the grafana secret in advance. Navigate to **Configuration Center → Secrets**, click into **grafana-l47bmc** with Type Default.

![Grafana Secret](/images/application-templates/20200106173434.png)

5.2. Click the eye button to display the secret information, then copy and paste the values of **admin-user** and **admin-password** respectively.

![Grafana Credentials](/images/application-templates/20200106173531.png)

5.3. Open the Grafana login page, sign in with the **admin** account.

![Grafana Login Page](/images/application-templates/20190717152831.png)

![Grafana Dashboard](/images/application-templates/20190717152929.png)