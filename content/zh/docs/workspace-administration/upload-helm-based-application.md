---
title: "Upload Helm-based Application"
keywords: "kubernetes, helm, kubesphere, openpitrix, application"
description: "Upload Helm-based Application"

linkTitle: "Upload Helm-based Application"
weight: 10200
---

KubeSphere provides full lifecycle management for applications. You can upload or create new app templates and test them quickly. In addition, you can publish your apps to [App Store](../../application-store/) so that other users can deploy with one click. You can upload [Helm Chart](https://helm.sh/) to develop app templates.

## Prerequisites

You need to create a workspace and `project-admin` account. Please refer to the [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/) if not yet.

## Hands-on Lab

1. Sign in with `project-admin` account. Go to the workspace, open `Apps Management` and go to `App Templates`, then click the `Create` button.

    ![Create App Template](/images/application-templates/create-app.png)

2. Click the `Upload` button.

    ![Upload](/images/application-templates/upload-app1.png)

3. Assuming you've already developed a Helm chart locally, or you can download the example [Nginx package](/files/application-templates/nginx-0.1.0.tgz) here.

    ![Upload Nginx](/images/application-templates/upload-app2.png)

4. Select the Helm chart file you have finished developing locally and click `OK` to proceed to the next step.

    ![Upload Nginx](/images/application-templates/upload-app3.png)

    ![Upload Nginx](/images/application-templates/upload-app4.png)

5. Now that you have successfully uploaded a Helm package, you can click on its name to go to its detail page.

    ![App list](/images/application-templates/app-list.png)

6. On the versions list tab, you can click on the corresponding version to test the deployment.

    ![App detail page](/images/application-templates/app-detail-test-deploy.png)

You can also publish your application to App Store by following the [tutorial](../../application-store/app-lifecycle-management/) once you've fully tested your application.
