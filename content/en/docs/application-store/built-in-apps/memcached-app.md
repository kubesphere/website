---
title: "Deploy Memcached on KubeSphere"
keywords: 'Kubernetes, KubeSphere, Memcached, app-store'
description: 'How to deploy Memcached on KubeSphere through App Store'
linkTitle: "Deploy Memcached on KubeSphere"
weight: 14230
---
[Memcached](https://memcached.org/) is an in-memory key-value store for small chunks of arbitrary data (strings, objects) from results of database calls, API calls, or page rendering. Its API is available for the majority of popular languages.

This tutorial walks you through an example of deploying Memcached from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy Memcached from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top left corner.

   ![in-app-store](/images/docs/appstore/built-in-apps/memcached-app/in-app-store.jpg)

2. Find Memcached and click **Deploy** on the **App Info** page.

   ![memcached-app-store](/images/docs/appstore/built-in-apps/memcached-app/memcached-app-store.jpg)

   ![deploying-memcached](/images/docs/appstore/built-in-apps/memcached-app/deploying-memcached.jpg)

3. Set a name and select an app version. Make sure Memcached is deployed in `demo-project` and click **Next**.

   ![deployment-confirm](/images/docs/appstore/built-in-apps/memcached-app/deployment-confirm.jpg)

4. In **App Config**, you can use the default configuration or customize the configuration by editing the YAML file directly. Click **Deploy** to continue.

   ![edit-config](/images/docs/appstore/built-in-apps/memcached-app/edit-config.jpg)

5. Wait until Memcached is up and running.

   ![memcached-running](/images/docs/appstore/built-in-apps/memcached-app/memcached-running.jpg)

### Step 2: Access Memcached

1. Navigate to **Services**, and click the service name of Memcached.

   ![memcached-service](/images/docs/appstore/built-in-apps/memcached-app/memcached-service.jpg)

2. On the detail page, you can find the port number and Pod IP under **Service Ports** and **Pods** respectively.

   ![memcached-port-pod](/images/docs/appstore/built-in-apps/memcached-app/memcached-port-pod.jpg)

3. As the Memcached service is headless, access it inside the cluster through the Pod IP and port number. The basic syntax of Memcached `telnet` command is `telnet HOST PORT`. For example:

   ```bash
   # telnet 10.10.235.3 11211
   Trying 10.10.235.3...
   Connected to 10.10.235.3.
   Escape character is '^]'.
   set runoob 0 900 9
   memcached
   STORED
   ```

4. For more information, see [Memcached](https://memcached.org/).