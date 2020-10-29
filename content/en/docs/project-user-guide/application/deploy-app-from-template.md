---
title: "Deploy Applications from App Template"
keywords: 'kubernetes, chart, helm, KubeSphere, application'
description: 'Deploy Applications from App Template'


weight: 2210
---

## Objective

This tutorial shows you a simple example about how to quickly deploy a [Nginx](https://nginx.org/) application using templates from KubeSphere application store sponsored by [OpenPitrix](https://github.com/openpitrix/openpitirx). The demonstration includes one-click deploying apps within a workspace and exposing service by NodePort.

## Prerequisites

- You have enabled [KubeSphere App Store](../../pluggable-components/app-store)
- You have completed the tutorial in [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/)

## Hands-on Lab

### Step 1: Browse App Templates

1.1. Switch to use `project-regular` account to log in, then enter into `demo-project`.

1.2. Click **Application Workloads → Applications**, click **Deploy New Application**.

![App List](/images/application-templates/20200106161804.png)

1.3. Choose **From App Store** and enter into app store.

![App Templates](/images/application-templates/20201028180736.png)

![App Store](/images/application-templates/20201028180853.png)

1.4. Search `Nginx` and click into Nginx App. We will demonstrate how to one-click deploying Nginx to Kubernetes.

### Step 2: One-click Deploy Nginx Application

2.1. Click **Deploy** on the right. Generally you do not need to change any configuration, just click **Deploy**.

![View Nginx](/images/application-templates/20201028181426.png)

2.2. Wait for two minutes, then you will see the application `nginx` showing `active` on the application list.

![Deploy Nginx](/images/application-templates/20201028181614.png)

### Step 3: Expose Nginx Web Service

3.1. Click into Nginx application, and then enter into its service page.

![View Nginx Detail](/images/application-templates/20201028181834.png)

3.2. In this page, make sure its deployment and Pod are running, then click **More → Edit Internet Access**, and select **NodePort** in the dropdown list, click **OK** to save it.

![Edit Internet Access for Nginx Web Service](/images/application-templates/20201028181957.png)

3.3. At this point, you will be able to access Nginx web service from outside of the cluster.

![Nginx Service Endpoint](/images/application-templates/20201028182251.png)



