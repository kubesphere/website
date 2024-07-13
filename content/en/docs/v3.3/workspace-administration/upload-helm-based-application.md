---
title: "Upload Helm-based Applications"
keywords: "Kubernetes, Helm, KubeSphere, OpenPitrix, Application"
description: "Learn how to upload a Helm-based application as an app template to your workspace."
linkTitle: "Upload Helm-based Applications"
weight: 9200
version: "v3.3"
---

KubeSphere provides full lifecycle management for applications. Among other things, workspace administrators can upload or create new app templates and test them quickly. Furthermore, they publish well-tested apps to the [App Store](../../application-store/) so that other users can deploy them with one click. To develop app templates, workspace administrators need to upload packaged [Helm charts](https://helm.sh/) to KubeSphere first.

This tutorial demonstrates how to develop an app template by uploading a packaged Helm chart.

## Prerequisites

- You need to enable the [KubeSphere App Store (OpenPitrix)](../../pluggable-components/app-store/).
- You need to create a workspace and a user (`project-admin`). The user must be invited to the workspace with the role of `workspace-self-provisioner`. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../quick-start/create-workspace-and-project/).

## Hands-on Lab

1. Log in to KubeSphere as `project-admin`. In your workspace, go to **App Templates** under **App Management**, and click **Create**. 

2. In the dialog that appears, click **Upload**. You can upload your own Helm chart or download the [Nginx chart](/files/application-templates/nginx-0.1.0.tgz) and use it as an example for the following steps.

3. After the package is uploaded, click **OK** to continue.

4. You can view the basic information of the app under **App Information**. To upload an icon for the app, click **Upload Icon**. You can also skip it and click **OK** directly.
    
    {{< notice note >}}

Maximum accepted resolutions of the app icon: 96 x 96 pixels.

{{</ notice >}}

5. The app appears in the template list with the status **Developing** after successfully uploaded, which means this app is under development. The uploaded app is visible to all members in the same workspace.

6. Click the app and the page opens with the **Versions** tab selected. Click the draft version to expand the menu, where you can see options including **Delete**, **Install**, and **Submit for Release**.

7. For more information about how to release your app to the App Store, refer to [Application Lifecycle Management](../../application-store/app-lifecycle-management/#step-2-upload-and-submit-application).
