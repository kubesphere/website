---
title: "Deploy RabbitMQ"
keywords: 'demploy, RabbitMQ'
description: 'Deploy RabbitMQ'

linkTitle: "Deploy RabbitMQ"
weight: 2110
---

This tutorial walks you through an example of how to demploy RabbitMQ.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/). Tomcat will be deployed from the App Store.
- You need to create a workspace, a project, and a user account for this tutorial.  The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-operator` and work in the project `test-project` in the workspace `test-workspace`.

## Hands-on Lab

### Step 1: Deploy RabbitMQ

Please make sure you are landing on the **Overview** page of the project `test-project`.

1. Go to **App Store**.

![go-to-app-store](1603346676104.jpg)

2. Find **RabbitMQ** and click **Deploy**.

![find-tomcat](rabbitmq01.jpg)

![click-deploy](rabbitMQ02.jpg)

3. Make sure RabbitMQ is deployed in `test-project` and click **Next**.

![click-next](rabbitmq03.jpg)

4. Use the default configuration or change the account and  password as you want. then click **Deploy**.

![click-demploy](rabbitMQ04.jpg)

5. Wait until RabbitMQ is up and running.

![check-if-rabbitmq-is-running](rabbitmq05.jpg)

### Step 2: Access RabbitMQ Dashboard

1. Go to **Services**.and click  **rabbiitmq-service-name**

![go-to-services](rabbitmq06.jpg)

2. click **More** and click **Edit Internet Access**.

![click-internet](rabbitmq07.jpg)

3. select **NodePort** and click **Ok**. ([more](https://v2-1.docs.kubesphere.io/docs/project-setting/project-gateway/))
![select-nodeport](rabbitmq08.jpg)

4. through the node IP + node port to access rabbitmq management.
![access-rabbitmq](rabbitmq09.png)

5. Log in RabbitMQ management.
![log-in-rabbitmq](rabbitmq10.png)