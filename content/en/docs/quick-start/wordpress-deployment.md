---
title: "Compose and Deploy WordPress"
keywords: 'KubeSphere, Kubernetes, app, WordPress'
description: 'Learn the entire process of deploying an example application in KubeSphere, including credential creation, volume creation, and component settings.'
linkTitle: "Compose and Deploy WordPress"
weight: 2500
---

## WordPress Introduction

WordPress is a free and open-source content management system written in PHP, allowing users to build their own websites. A complete WordPress application includes the following Kubernetes objects with MySQL serving as the backend database.

![WordPress](/images/docs/quickstart/wordpress-deployment/WordPress.png)

## Objective

This tutorial demonstrates how to create an application (WordPress as an example) in KubeSphere and access it outside the cluster.

## Prerequisites

An account `project-regular` is needed with the role of `operator` assigned in one of your projects (the user has been invited to the project). For more information, see [Create Workspaces, Projects, Users and Roles](../create-workspace-and-project/).

## Estimated Time

About 15 minutes.

## Hands-on Lab

### Step 1: Create Secrets

#### Create a MySQL Secret

The environment variable `WORDPRESS_DB_PASSWORD` is the password to connect to the database in WordPress. In this step, you need to create a Secret to store the environment variable that will be used in the MySQL Pod template.

1. Log in to the KubeSphere console using the account `project-regular`. Go to the detail page of `demo-project` and navigate to **Configuration**. In **Secrets**, click **Create** on the right.

2. Enter the basic information (for example, name it `mysql-secret`) and click **Next**. On the next page, select **Default** for **Type** and click **Add Data** to add a key-value pair. Enter the Key (`MYSQL_ROOT_PASSWORD`) and Value (`123456`) and click **√** in the lower-right corner to confirm. When you finish, click **Create** to continue.

#### Create a WordPress Secret

Follow the same steps above to create a WordPress Secret `wordpress-secret` with the key `WORDPRESS_DB_PASSWORD` and value `123456`. Secrets created display in the list.

### Step 2: Create a volume

1. Go to **Volumes** under **Storage** and click **Create**.

2. Enter the basic information of the volume (for example, name it `wordpress-pvc`) and click **Next**.

3. In **Volume Settings**, you need to choose an available **Storage Class**, and set **Access Mode** and **Volume Capacity**. You can use the default value directly. Click **Next** to continue.

4. For **Advanced Settings**, you do not need to add extra information for this step and click **Create** to finish.

### Step 3: Create an application

#### Add MySQL backend components

1. Navigate to **Apps** under **Application Workloads**, select **Composed Apps** and click **Create**.

2. Enter the basic information (for example, `wordpress` for **Name**) and click **Next**.

3. In **Service Settings**, click **Create Service** to create a service in the app.

4. Select **Stateful Service** to define the service type.

5. Enter the name for the stateful service (for example, **mysql**) and click **Next**.

6. In **Containers**, click **Add Container**.

7. Enter `mysql:5.6` in the search box, press **Enter** and click **Use Default Ports**. After that, do not click **√** in the lower-right corner as the setting is not finished yet.

   {{< notice note >}}

In **Advanced Settings**, make sure the memory limit is no less than 1000 Mi or MySQL may fail to start due to a lack of memory.

{{</ notice >}} 

1. Scroll down to **Environment Variables** and click **Use ConfigMap or Secret**. Enter the name `MYSQL_ROOT_PASSWORD` and choose the resource `mysql-secret` and the key `MYSQL_ROOT_PASSWORD` created in the previous step. Click **√** after you finish and **Next** to continue.

2. Click **Add Volume Template** under **Volume Templates**. Enter the value of **Volume Name** (`mysql`) and **Mount Path** (mode: `ReadAndWrite`, path: `/var/lib/mysql`).

   Click **√** after you finish and click **Next** to continue.

3.  In **Advanced Settings**, you can click **Create** directly or set other options based on your needs.

#### Add the WordPress frontend component

12. In **Services** under **Application Workloads**, click **Create** again and select **Stateless Service** this time. Enter the name `wordpress` and click **Next**.

13. Similar to previous steps, click **Add Container**, enter `wordpress:4.8-apache` in the search box, press **Enter** and click **Use Default Ports**.

14. Scroll down to **Environment Variables** and click **Use ConfigMap or Secret**. Two environment variables need to be added here. Enter the values as follows.

    - For `WORDPRESS_DB_PASSWORD`, choose `wordpress-secret` and `WORDPRESS_DB_PASSWORD` created in Task 1.

    - Click **Add Environment Variable**, and enter `WORDPRESS_DB_HOST` and `mysql` for the key and value.

    {{< notice warning >}}

For the second environment variable added here, the value must be the same as the name you set for MySQL in step 5. Otherwise, WordPress cannot connect to the corresponding database of MySQL.

{{</ notice >}}
    
    Click **√** to save it and **Next** to continue.

1.  Under **Volumes**, click **Mount Volume**, and then click **Select Volume**.

2.  Select `wordpress-pvc` created in the previous step, set the mode as `ReadAndWrite`, and enter `/var/www/html` as its mount path. Click **√** to save it, and then click **Next** to continue.

3.  In **Advanced Settings**, you can click **Create** directly or set other options based on your needs.

4.  The frontend component is also set now. Click **Next** to continue.

5.  You can set route rules (Ingress) here or click **Create** directly.

6.  The app will display in the list after you create it.

### Step 4: Verify resources

In **Workloads**, check the status of `wordpress-v1` and `mysql-v1` in **Deployments** and **StatefulSets** respectively. If they are running properly, it means WordPress has been created successfully.

### Step 5: Access WordPress through a NodePort

1. To access the Service outside the cluster, navigate to **Services** first. Click the three dots on the right of `wordpress` and select **Edit External Access**.

2. Select `NodePort` for **Access Method** and click **OK**.

3. Click the Service and you can see the port is exposed.

4. Access this application at `{Node IP}:{NodePort}`.

   {{< notice note >}}

Make sure the port is opened in your security groups before you access the Service.

{{</ notice >}} 