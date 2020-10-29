---
title: "Set Email Server for KubeSphere Pipeline"
keywords: 'kubesphere, kubernetes, notification, jenkins, devops, ci/cd, pipeline'
description: 'Set Email Server for KubeSphere CI/CD pipeline'
---


The built-in Jenkins cannot share the same email configuration with platform notification system. Thus we need to set email server for KubeSphere DevOps pipeline separately.

> Note: Please be aware that the modification of the email server in `ks-jenkins` deployment below will restart the deployment itself. Consequently, the DevOps system will be unavailable for a few minutes. Please make such modification at an appropriate time.
> Prerequisites: You need to enable KubeSphere DevOps System.

1. Log in KubeSphere by using `admin` account, navigate to **Platform**.

![View Platform](/images/devops/set-jenkins-email-1.png)

2. Then go to **Application Workloads → Workloads**, choose namespace and drill into **kubesphere-devops-system**. Then choose **ks-jenkins** to **Edit Yaml**. 

![Go to Deployment](/images/devops/set-jenkins-email-2.png)

Scroll down the panel you will see the following environments that you need to configure. Finally click **Update** to save the changes.

![Set the value](/images/devops/set-jenkins-email-3.png)

| Environment variable name | Description |
|---|---|
|EMAIL\_SMTP\_HOST | SMTP server address |
|EMAIL\_SMTP\_PORT | SMTP server port (e.g. 25)  |
|EMAIL\_FROM\_ADDR |  Email sender address |
|EMAIL\_FROM\_NAME | Email sender name |
|EMAIL\_FROM\_PASS | Email sender password |
|EMAIL\_USE\_SSL | whether to open SSL configuration |
