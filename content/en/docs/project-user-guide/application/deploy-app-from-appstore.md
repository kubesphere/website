---
title: "Deploy Application from App Store"
keywords: 'kubernetes, chart, helm, kubesphere, application'
description: 'Deploy Application from App Store'


weight: 2220
---

## Objective

This tutorial shows you a simple example about how to quickly deploy a [Nginx](https://nginx.org/) application from KubeSphere App Store sponsored by [OpenPitrix](https://github.com/openpitrix/openpitirx). The App Store is also the public application repository in the platform, which means anybody can view the applications in the store, and any authenticated users can deploy applications from the store. This is typically different than the private application repositories only accessible within tenant's workspaces. The demonstration includes one-click deploying apps from the App Store and exposing service by NodePort.

## Prerequisites

- You have enabled [KubeSphere App Store](../../pluggable-components/app-store).
- You have completed the tutorial in [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Browse App Store

1.1. Switch to use `project-regular` account to log in, then enter into `demo-project`.

1.2. Click **Application Workloads → Applications**, click **Deploy New Application**.

![App List](/images/application-templates/20200106161804.png)

1.3. Choose **From App Store** and enter into the list page.

![App Templates](/images/application-templates/20201028180736.png)

![App Store](/images/application-templates/20201028180853.png)

1.4. Search `Nginx` and click into Nginx App. We will demonstrate how to deploy Nginx to Kubernetes with one-click.

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



