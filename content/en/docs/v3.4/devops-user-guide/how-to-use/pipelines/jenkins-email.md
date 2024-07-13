---
title: "Set the Email Server for KubeSphere Pipelines"
keywords: 'KubeSphere, Kubernetes, notification, jenkins, devops, ci/cd, pipeline, email server'
description: 'Set the email server to receive notifications of your Jenkins pipelines.'
linkTitle: "Set Email Server for KubeSphere Pipelines"
Weight: 11218
version: "v3.4"
---


The built-in Jenkins cannot share the same email configuration with the platform notification system. Thus, you need to configure email server settings for KubeSphere DevOps pipelines separately.

## Prerequisites

- You need to enable the [KubeSphere DevOps System](../../../../pluggable-components/devops/).
- You need a user granted a role including the **Cluster Management** permission. For example, you can log in to the console as `admin` directly or create a new role with the permission and assign it to a user.

## Set the Email Server

1. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. If you have enabled the [multi-cluster feature](../../../../multicluster-management/) with member clusters imported, you can select a specific cluster to view its nodes. If you have not enabled the feature, refer to the next step directly.

3. Go to **Workloads** under **Application Workloads**, and select the project **kubesphere-devops-system** from the drop-down list. Click <img src="/images/docs/v3.x/common-icons/three-dots.png" height="15" alt="icon" /> on the right of `devops-jenkins` and select **Edit YAML** to edit its YAML.

4. Scroll down to the fields in the image below which you need to specify. Click **OK** when you finish to save changes.

   {{< notice warning >}}

   Once you modify the Email server in the `devops-jenkins` Deployment, it will restart itself. Consequently, the DevOps system will be unavailable for a few minutes. Please make such modification at an appropriate time.

   {{</ notice >}}

   ![set-jenkins-email](/images/docs/v3.x/devops-user-guide/using-devops/jenkins-email/set-jenkins-email.png)

   | Environment Variable Name | Description                      |
   | ------------------------- | -------------------------------- |
   | EMAIL\_SMTP\_HOST         | SMTP server address              |
   | EMAIL\_SMTP\_PORT         | SMTP server port (for example, 25)       |
   | EMAIL\_FROM\_ADDR         | Email sender address             |
   | EMAIL\_FROM\_NAME         | Email sender name                |
   | EMAIL\_FROM\_PASS         | Email sender password            |
   | EMAIL\_USE\_SSL           | SSL configuration enabled or not |
