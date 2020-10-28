---
title: "Deploy Tomcat on KubeSphere"
keywords: 'KubeSphere,Kubernetes, Installation, Tomcat'
description: 'How to deploy Tomcat on KubeSphere through App Store'

linkTitle: "Deploy Tomcat"
weight: 261
---
[Apache Tomcat](https://tomcat.apache.org/index.html) software powers numerous large-scale, mission-critical web applications across a diverse range of industries and organizations.
This tutorial walks you through an example of how to demploy Tomcat on KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/). Tomcat will be deployed from the App Store.
- You need to create a workspace, a project, and a user account for this tutorial.  The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-operator` and work in the project `test-project` in the workspace `test-workspace`.

## Hands-on Lab

### Step 1: Deploy Tomcat from App Store

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

3. You can view the deployed projects in `/usr/local/tomcat/webapps`.
![view-project](/images/docs/tomcat-app/tomcat-app10.jpg)

### Step 3: Access the Tomcat project in browser

1. Go to **Services** and click **tomcat-service-name**.

2. Click **More** and click **Edit Internet Access**.
![click-edit-internet-access](/images/docs/tomcat-app/tomcat-app11.jpg)

3. Select **NodePort** and click **Ok**. [More information](https://v2-1.docs.kubesphere.io/docs/project-setting/project-gateway/)
![select-nodeport](/images/docs/tomcat-app/tomcat-app12.jpg)

4. Through <font color=green>{$NodeIP} : {$Nodeport} / {$Project path}</font>  to access the tomcat project in browser. 
![tomcat-port](/images/docs/tomcat-app/tomcat-app13.jpg)
![access-tomcat-browser](/images/docs/tomcat-app/tomcat-app14.jpg)

5. If you want to learn more information about Tomcat please refer to https://tomcat.apache.org/index.html.
