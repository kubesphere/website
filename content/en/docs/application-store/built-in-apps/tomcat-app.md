---
title: "Deploy Tomcat"
keywords: 'demploy, tomcat'
description: 'Deploy Tomcat'

linkTitle: "Deploy Tomcat"
weight: 2110
---

This tutorial walks you through an example of how to demploy tomcat.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/). Tomcat will be deployed from the App Store.
- You need to create a workspace, a project, and a user account for this tutorial.  The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-operator` and work in the project `test-project` in the workspace `test-workspace`.

## Hands-on Lab

### Step 1: Deploy Tomcat

Please make sure you are landing on the **Overview** page of the project `test-project`.

1. Go to **App Store**.

![go-to-app-store](1603346676104.jpg)

2. Find **Tomcat** and click **Deploy**.

![find-tomcat](1603346890800.jpg)

![click-deploy](1603346942472.jpg)

3. Make sure MySQL is deployed in `test-project` and click **Next**.

![click-next](1603347045715.jpg)

4. Use the default configuration and click **Deploy**.

![click-demploy](1603347316000.jpg)

5. Wait until Tomcat is up and running.

![check-if-tomcat-is-running](1603347425783.jpg)

### Step 2: Access Tomcat Terminal

1. Go to **Services** and click **tomcat-service-name**.

![click-tomcat-service](tomcat01.jpg)

2. Expand pods information and click **terminal**. You can now use the feature.
![click-container-terminal](tomcat02.png)
![tomcat-container-terminal](tomcat03.png)

3. You can view the deployed projects in `/usr/local/tomcat/webapps`
![view-project](tomcat07.png)

### Step 3: Access the Tomcat project in browser

1. Go to **Services** and click **tomcat-service-name**.

2. click **More** and click **Edit Internet Access**.
![click-edit-internet-access](tomcat03.jpg)

3. select **NodePort** and click **Ok**. ([more](https://v2-1.docs.kubesphere.io/docs/project-setting/project-gateway/))
![select-nodeport](tomcat04.jpg)

4. through the node IP + node port + project path to access the tomcat project in browser. 
![tomcat-port](tomcat05.jpg)
![access-tomcat-browser](tomcat06.png)
