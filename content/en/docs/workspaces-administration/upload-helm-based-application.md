---
title: "Upload Helm-based Application"
keywords: "kubernetes, helm, kubesphere, openpitrix, application"
description: "Upload Helm-based Application"

linkTitle: "Upload Helm-based Application"
weight: 50
---

KubeSphere provides full lifecycle management for applications. You can upload or create new app templates and test them quickly. In addition, you can publish your apps to App Store so that other users can deploy with one click. You can upload [Helm Chart](https://helm.sh/) to develop app templates.

## Prerequisites

- You need to create a workspace and `project-admin` account. Please refer to the [Getting Started with Multi-tenant Management](../../../quick-start/create-workspace-and-project) if not yet.
- You need to sign in with `project-admin` account.

## Hands-on Lab

Go to the workspace, open `Apps Management` and go to `App Templates`, then click the `Create` button.

![Create App Template](/images/application-templates/create-app.png)

Click the `Upload` button.

![Upload](/images/application-templates/upload-app1.png)

Assuming you've already developed a Helm chart locally, or you can download the [Helm package](/files/application-templates/nginx-0.1.0.tgz) here.

![Upload](/images/application-templates/upload-app2.png)

Select the Helm chart file you have finished developing locally and click `OK` to proceed to the next step.

![Upload](/images/application-templates/upload-app3.png)

![Upload](/images/application-templates/upload-app4.png)

Now that you have successfully uploaded a Helm package, you can click on its name to go to its detail page.

![App list](/images/application-templates/app-list.png)

On the versions list tab, you can click on the corresponding version to test the deployment.

![App detail page](/images/application-templates/app-detail-test-deploy.png)
