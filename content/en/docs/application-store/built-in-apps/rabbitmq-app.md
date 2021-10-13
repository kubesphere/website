---
title: "Deploy RabbitMQ on KubeSphere"
keywords: 'KubeSphere, RabbitMQ, Kubernetes, Installation'
description: 'Learn how to deploy RabbitMQ from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy RabbitMQ on KubeSphere"
weight: 14290
---
[RabbitMQ](https://www.rabbitmq.com/) is the most widely deployed open-source message broker. It is lightweight and easy to deploy on premises and in the cloud. It supports multiple messaging protocols. RabbitMQ can be deployed in distributed and federated configurations to meet high-scale, high-availability requirements.

This tutorial walks you through an example of how to deploy RabbitMQ from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy RabbitMQ from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top-left corner.

   ![rabbitmq01](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitmq01.png)

2. Find RabbitMQ and click **Deploy** on the **App Information** page.

   ![find-rabbitmq](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitmq02.png)

   ![click-deploy](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitmq021.png)

3. Set a name and select an app version. Make sure RabbitMQ is deployed in `demo-project` and click **Next**.

   ![rabbitmq03](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitmq03.png)

4. In **App Configurations**, you can use the default configuration directly or customize the configuration either by specifying fields in a form or editing the YAML file. Record the value of **Root Username** and the value of **Root Password**, which will be used later for login. Click **Deploy** to continue.

   ![rabbitMQ11](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitMQ11.png)

   ![rabbitMQ04](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitMQ04.png)

   {{< notice tip >}}

   To see the manifest file, toggle the **YAML** switch.

   {{</ notice >}}

5. Wait until RabbitMQ is up and running.

   ![check-if-rabbitmq-is-running](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitmq05.png)

### Step 2: Access the RabbitMQ Dashboard

To access RabbitMQ outside the cluster, you need to expose the app through a NodePort first.

1. Go to **Services** and click the service name of RabbitMQ.

   ![go-to-services](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitmq06.png)

2. Click **More** and select **Edit Internet Access** from the drop-down menu.

   ![rabbitmq07](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitmq07.png)

3. Select **NodePort** for **Access Method** and click **OK**. For more information, see [Project Gateway](../../../project-administration/project-gateway/). 

   ![rabbitmq08](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitmq08.png)

4. Under **Service Ports**, you can see ports are exposed.

   ![rabbitmq09](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitmq09.png)

5. Access RabbitMQ **management** through `<NodeIP>:<NodePort>`. Note that the username and password are those you set in **Step 1**.
   ![rabbitmq-dashboard](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitmq-dashboard.png)

   ![rabbitma-dashboard-detail](/images/docs/appstore/built-in-apps/rabbitmq-app/rabbitma-dashboard-detail.png)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 

6. For more information about RabbitMQ, refer to [the official documentation of RabbitMQ](https://www.rabbitmq.com/documentation.html).