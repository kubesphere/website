---
title: "Set Email Server for KubeSphere Pipelines"
keywords: 'KubeSphere, Kubernetes, notification, jenkins, devops, ci/cd, pipeline, email server'
description: 'Set Email server for KubeSphere CI/CD pipelines'
linkTitle: "Set Email Server for KubeSphere Pipelines"
Weight: 400
---


The built-in Jenkins cannot share the same email configuration with the platform notification system. Thus, you need to configure email server settings for KubeSphere DevOps pipelines separately.

## Prerequisites

- You need to enable [KubeSphere DevOps System](../../../pluggable-components/devops/).
- You need an account granted a role including the authorization of **Clusters Management**. For example, you can log in the console as `admin` directly or create a new role with the authorization and assign it to an account.

## Set Email Server

1. Click **Platform** in the top left corner and select **Clusters Management**.

![clusters-management](/images/docs/devops-user-guide/set-ci-node-for-dependency-cache/clusters-management.jpg)

2. If you have enabled the [multi-cluster feature](../../../multicluster-management) with member clusters imported, you can select a specific cluster to view its nodes. If you have not enabled the feature, refer to the next step directly.
3. Go to **Workloads** under **Application Workloads**, and choose the project **kubesphere-devops-system** from the drop-down list. Click the three dots on the right of **ks-jenkins** to edit its YAML.

![workloads-list](/images/docs/devops-user-guide/jenkins-email/workloads-list.jpg)

4. Scroll down to the fields in the image below which you need to specify. Click **Update** when you finish to save changes.

{{< notice warning >}}

Once you modify the Email server in the `ks-jenkins` Deployment, it will restart itself. Consequently, the DevOps system will be unavailable for a few minutes. Please make such modification at an appropriate time.

{{</ notice >}}

![set-jenkins-email-3](/images/docs/devops-user-guide/jenkins-email/set-jenkins-email-3.jpg)

| Environment Variable Name | Description |
|---|---|
|EMAIL\_SMTP\_HOST | SMTP server address |
|EMAIL\_SMTP\_PORT | SMTP server port (e.g. 25)  |
|EMAIL\_FROM\_ADDR |  Email sender address |
|EMAIL\_FROM\_NAME | Email sender name |
|EMAIL\_FROM\_PASS | Email sender password |
|EMAIL\_USE\_SSL | SSL configuration enabled or not |
