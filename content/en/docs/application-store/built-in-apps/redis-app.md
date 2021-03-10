---
title: "Deploy Redis on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, Redis'
description: 'How to deploy Redis from the App Store of KubeSphere'
linkTitle: "Deploy Redis on KubeSphere"
weight: 14291
---

[Redis](https://redis.io/) is an open-source (BSD licensed), in-memory data structure store, used as a database, cache and message broker.

This tutorial walks you through an example of deploying Redis from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy Redis from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top left corner.

   ![app-store](/images/docs/appstore/built-in-apps/redis-app/app-store.jpg)

2. Find Redis and click **Deploy** on the **App Info** page.

   ![redis-in-app-store](/images/docs/appstore/built-in-apps/redis-app/redis-in-app-store.jpg)

   ![deploy-redis](/images/docs/appstore/built-in-apps/redis-app/deploy-redis.jpg)

3. Set a name and select an app version. Make sure Redis is deployed in `demo-project` and click **Next**.

   ![confirm-deployment](/images/docs/appstore/built-in-apps/redis-app/confirm-deployment.jpg)

4. In **App Config**, specify persistent volumes and a password for the app. When you finish, click **Deploy**.

   ![configure-redis](/images/docs/appstore/built-in-apps/redis-app/configure-redis.jpg)

   {{< notice note >}}

   To specify more values for Redis, use the toggle switch to see the app’s manifest in YAML format and edit its configurations.

   {{</ notice >}}

5. Wait until Redis is up and running.

   ![redis-running](/images/docs/appstore/built-in-apps/redis-app/redis-running.jpg)

### Step 2: Access the Redis Terminal

1. Go to **Services** and click the service name of Redis.

   ![access-redis](/images/docs/appstore/built-in-apps/redis-app/access-redis.jpg)

2. Under **Pods**, expand the menu to see container details, and then click the **Terminal** icon.

   ![redis-terminal](/images/docs/appstore/built-in-apps/redis-app/redis-terminal.jpg)

3. In the pop-up window, use the `redis-cli` command in the terminal to use the app.

   ![use-redis](/images/docs/appstore/built-in-apps/redis-app/use-redis.jpg)

4. For more information, see [the official documentation of Redis](https://redis.io/documentation).
