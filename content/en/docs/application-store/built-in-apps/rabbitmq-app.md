---
title: "Deploy RabbitMQ on KubeSphere"
keywords: 'KubeSphere, RabbitMQ, Kubernetes, Installation'
description: 'How to deploy RabbitMQ on KubeSphere through App Store'

link title: "Deploy RabbitMQ"
weight: 251
---
[RabbitMQ](https://www.rabbitmq.com/) is the most widely deployed open source message broker. and it's lightweight and easy to deploy on premises and in the cloud. It supports multiple messaging protocols. RabbitMQ can be deployed in distributed and federated configurations to meet high-scale, high-availability requirements.
This tutorial walks you through an example of how to deploy RabbitMQ on KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/). RabbitMQ will be deployed from the App Store.
- You need to create a workspace, a project, and a user account for this tutorial.  The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-operator` and work in the project `test-project` in the workspace `test-workspace`.

## Hands-on Lab

### Step 1: Deploy RabbitMQ from App Store

Please make sure you are landing on the **Overview** page of the project `test-project`.

1. Go to **App Store**.

![go-to-app-store](/images/docs/rabbitmq-app/rabbitmq01.jpg)

2. Find **RabbitMQ** and click **Deploy**.

![find-rabbitmq](/images/docs/rabbitmq-app/rabbitmq02.jpg)

![click-deploy](/images/docs/rabbitmq-app/rabbitmq021.jpg)

3. Make sure RabbitMQ is deployed in `test-project` and click **Next**.

![click-next](/images/docs/rabbitmq-app/rabbitmq03.jpg)

4. Use the default configuration or change the account and password as you want. then click **Deploy**.

![click-demploy](/images/docs/rabbitmq-app/rabbitMQ04.jpg)

5. Wait until RabbitMQ is up and running.

![check-if-rabbitmq-is-running](/images/docs/rabbitmq-app/rabbitmq05.jpg)

### Step 2: Access RabbitMQ Dashboard

1. Go to **Services**.and click  **rabbiitmq-service-name**.

![go-to-services](/images/docs/rabbitmq-app/rabbitmq06.jpg)

2. Click **More** and click **Edit Internet Access**.

![click-internet](/images/docs/rabbitmq-app/rabbitmq07.jpg)

3. Select **NodePort** and click **Ok**. [Learn More](https://v2-1.docs.kubesphere.io/docs/project-setting/project-gateway/)
![select-nodeport](/images/docs/rabbitmq-app/rabbitmq08.jpg)

4. Through <font color=green>{$NodeIP} : {$Nodeport}</font> to access RabbitMQ management.
![access-rabbitmq](/images/docs/rabbitmq-app/rabbitmq09.png)

5. Log in RabbitMQ management.
![log-in-rabbitmq](/images/docs/rabbitmq-app/rabbitmq10.png)

6. If you want to learn more information about RabbitMQ please refer to https://www.rabbitmq.com/documentation.html.
