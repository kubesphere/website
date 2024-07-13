---
title: "Deploy Redis on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, Redis'
description: 'Learn how to deploy Redis from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy Redis on KubeSphere"
weight: 14291
version: "v3.3"
---

[Redis](https://redis.io/) is an open-source (BSD licensed), in-memory data structure store, used as a database, cache and message broker.

This tutorial walks you through an example of deploying Redis from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy Redis from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the upper-left corner.

2. Find Redis and click **Install** on the **App Information** page.

3. Set a name and select an app version. Make sure Redis is deployed in `demo-project` and click **Next**.

4. In **App Settings**, specify persistent volumes and a password for the app. When you finish, click **Install**.

   {{< notice note >}}

   To specify more values for Redis, use the toggle switch to see the app's manifest in YAML format and edit its settings.

   {{</ notice >}}

5. Wait until Redis is up and running.

### Step 2: Access the Redis terminal

1. Go to **Services** and click the service name of Redis.

2. Under **Pods**, expand the menu to see container details, and then click the **Terminal** icon.

3. In the pop-up window, use the `redis-cli` command in the terminal to use the app.

   ![use-redis](/images/docs/v3.x/appstore/built-in-apps/redis-app/use-redis.png)

4. For more information, see [the official documentation of Redis](https://redis.io/documentation).
