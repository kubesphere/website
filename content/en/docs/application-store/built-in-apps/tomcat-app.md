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

![go-to-app-store](/images/docs/tomcat-app/tomcat-app01.jpg)

2. Find **Tomcat** and click **Deploy**.

![find-tomcat](/images/docs/tomcat-app/tomcat-app02.jpg)

![click-deploy](/images/docs/tomcat-app/tomcat-app03.jpg)

3. Make sure MySQL is deployed in `test-project` and click **Next**.

![click-next](/images/docs/tomcat-app/tomcat-app04.jpg)

4. Use the default configuration and click **Deploy**.

![click-demploy](/images/docs/tomcat-app/tomcat-app05.jpg)

5. Wait until Tomcat is up and running.

![check-if-tomcat-is-running](/images/docs/tomcat-app/tomcat-app06.jpg)

### Step 2: Access Tomcat Terminal

1. Go to **Services** and click **tomcat-service-name**.

![click-tomcat-service](/images/docs/tomcat-app/tomcat-app07.jpg)

2. Expand pods information and click **terminal**. You can now use the feature.
![click-container-terminal](/images/docs/tomcat-app/tomcat-app08.jpg)
![tomcat-container-terminal](/images/docs/tomcat-app/tomcat-app09.jpg)

3. You can view the deployed projects in `/usr/local/tomcat/webapps`
![view-project](/images/docs/tomcat-app/tomcat-app10.jpg)

### Step 3: Access the Tomcat project in browser

1. Go to **Services** and click **tomcat-service-name**.

2. click **More** and click **Edit Internet Access**.
![click-edit-internet-access](/images/docs/tomcat-app/tomcat-app11.jpg)

3. select **NodePort** and click **Ok**. ([more](https://v2-1.docs.kubesphere.io/docs/project-setting/project-gateway/))
![select-nodeport](/images/docs/tomcat-app/tomcat-app12.jpg)

4. through the node IP + node port + project path to access the tomcat project in browser. 
![tomcat-port](/images/docs/tomcat-app/tomcat-app13.jpg)
![access-tomcat-browser](/images/docs/tomcat-app/tomcat-app14.jpg)
