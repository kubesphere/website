---
title: "Compose and Deploy WordPress"
keywords: 'KubeSphere, Kubernetes, app, WordPress'
description: 'Compose and deploy Wordpress.'
linkTitle: "Compose and Deploy WordPress"
weight: 2500
---

## WordPress Introduction

WordPress is a free and open-source content management system written in PHP, allowing users to build their own websites. A complete WordPress application includes the following Kubernetes objects with MySQL serving as the backend database.

![WordPress](/images/docs/quickstart/wordpress-deployment/WordPress.png)

## Objective

This tutorial demonstrates how to create an application (WordPress as an example) in KubeSphere and access it outside the cluster.

## Prerequisites

An account `project-regular` is needed with the role of `operator` assigned in one of your projects (the user has been invited to the project). For more information, see [Create Workspaces, Projects, Accounts and Roles](../create-workspace-and-project/).

## Estimated Time

About 15 minutes.

## Hands-on Lab

### Step 1: Create Secrets

#### Create a MySQL Secret

The environment variable `WORDPRESS_DB_PASSWORD` is the password to connect to the database in WordPress. In this step, you need to create a Secret to store the environment variable that will be used in the MySQL Pod template.

1. Log in to the KubeSphere console using the account `project-regular`. Go to the detail page of `demo-project` and navigate to **Configurations**. In **Secrets**, click **Create** on the right.

   ![create-secrets](/images/docs/quickstart/wordpress-deployment/create-secrets.png)

2. Enter the basic information (e.g. name it `mysql-secret`) and click **Next**. On the next page, select **Default** for **Type** and click **Add Data** to add a key-value pair. Input the Key (`MYSQL_ROOT_PASSWORD`) and Value (`123456`) as below and click **√** in the bottom-right corner to confirm. When you finish, click **Create** to continue.

   ![key-value](/images/docs/quickstart/wordpress-deployment/key-value.png)

#### Create a WordPress Secret

Follow the same steps above to create a WordPress Secret `wordpress-secret` with the key `WORDPRESS_DB_PASSWORD` and value `123456`. Secrets created display in the list as below:

![wordpress-secrets](/images/docs/quickstart/wordpress-deployment/wordpress-secrets.png)

### Step 2: Create a volume

1. Go to **Volumes** under **Storage** and click **Create**.

   ![volumes](/images/docs/quickstart/wordpress-deployment/volumes.png)

2. Enter the basic information of the volume (e.g. name it `wordpress-pvc`) and click **Next**.

3. In **Volume Settings**, you need to choose an available **Storage Class**, and set **Access Mode** and **Volume Capacity**. You can use the default value directly as shown below. Click **Next** to continue.

   ![volume-settings](/images/docs/quickstart/wordpress-deployment/volume-settings.png)

4. For **Advanced Settings**, you do not need to add extra information for this step and click **Create** to finish.

### Step 3: Create an application

#### Add MySQL backend components

1. Navigate to **Applications** under **Application Workloads**, select **Composing App** and click **Create Composing Application**.

   ![composing-app](/images/docs/quickstart/wordpress-deployment/composing-app.png)

2. Enter the basic information (e.g. input `wordpress` for Application Name) and click **Next**.

   ![basic-info](/images/docs/quickstart/wordpress-deployment/basic-info.png)

3. In **Components**, click **Add Service** to set a component in the app.

   ![add-service](/images/docs/quickstart/wordpress-deployment/add-service.png)

4. Define a service type for the component. Select **Stateful Service** here.

5. Enter the name for the stateful service (e.g. **mysql**) and click **Next**.

   ![mysqlname](/images/docs/quickstart/wordpress-deployment/mysqlname.png)

6. In **Container Image**, click **Add Container Image**.

   ![container-image](/images/docs/quickstart/wordpress-deployment/container-image.png)

7. Enter `mysql:5.6` in the search box, press **Enter** and click **Use Default Ports**. After that, do not click **√** in the bottom-right corner as the setting is not finished yet.

   ![add-container](/images/docs/quickstart/wordpress-deployment/add-container.png)

   {{< notice note >}}

In **Advanced Settings**, make sure the memory limit is no less than 1000 Mi or MySQL may fail to start due to a lack of memory.

{{</ notice >}} 

8. Scroll down to **Environment Variables** and click **Use ConfigMap or Secret**. Input the name `MYSQL_ROOT_PASSWORD` and choose the resource `mysql-secret` and the key `MYSQL_ROOT_PASSWORD` created in the previous step. Click **√** after you finish and **Next** to continue.

   ![environment-var](/images/docs/quickstart/wordpress-deployment/environment-var.png)

9. Select **Add Volume Template** in **Mount Volumes**. Input the value of **Volume Name** (`mysql`) and **Mount Path** (mode: `ReadAndWrite`, path: `/var/lib/mysql`) as below:

   ![volume-template](/images/docs/quickstart/wordpress-deployment/volume-template.jpg)

   Click **√** after you finish and click **Next** to continue.

10. In **Advanced Settings**, you can click **Add** directly or select other options based on your needs.

    ![advanced-settings](/images/docs/quickstart/wordpress-deployment/advanced-settings.png)

11. The MySQL component has beed added as shown below:

    ![mysql-finished](/images/docs/quickstart/wordpress-deployment/mysql-finished.png)

#### Add the WordPress frontend component

12. Click **Add Service** again and select **Stateless Service** this time. Enter the name `wordpress` and click Next.

    ![name-wordpress](/images/docs/quickstart/wordpress-deployment/name-wordpress.png)

13. Similar to the step above, click **Add Container Image**, enter `wordpress:4.8-apache` in the search box, press **Enter** and click **Use Default Ports**.

    ![container-image-page](/images/docs/quickstart/wordpress-deployment/container-image-page.png)

14. Scroll down to **Environment Variables** and click **Use ConfigMap or Secret**. Two environment variables need to be added here. Enter the values according to the screenshot below.

    - For `WORDPRESS_DB_PASSWORD`, choose `wordpress-secret` and `WORDPRESS_DB_PASSWORD` created in Task 1.

    - Click **Add Environment Variable**, and enter `WORDPRESS_DB_HOST` and `mysql` for the key and value.

    {{< notice warning >}}

For the second environment variable added here, the value must be exactly the same as the name you set for MySQL in step 5. Otherwise, Wordpress cannot connect to the corresponding database of MySQL.

{{</ notice >}}

     ![environment-varss](/images/docs/quickstart/wordpress-deployment/environment-varss.png)
    
    Click **√** to save it and **Next** to continue.

15. In **Mount Volumes**, click **Add Volume** and select **Choose an existing volume**.

    ![add-volume-page](/images/docs/quickstart/wordpress-deployment/add-volume-page.png)

    ![choose-existing-volume](/images/docs/quickstart/wordpress-deployment/choose-existing-volume.png)

16. Select `wordpress-pvc` created in the previous step, set the mode as `ReadAndWrite`, and input `/var/www/html` as its mount path. Click **√** to save it and **Next** to continue.

    ![mount-volume-page](/images/docs/quickstart/wordpress-deployment/mount-volume-page.png)

17. In **Advanced Settings**, you can click **Add** directly or select other options based on your needs.

    ![advanced](/images/docs/quickstart/wordpress-deployment/advanced.png)

18. The frontend component is also set now. Click **Next** to continue.

    ![components-finished](/images/docs/quickstart/wordpress-deployment/components-finished.png)

19. You can set route rules (Ingress) here or click **Create** directly.

    ![ingress-create](/images/docs/quickstart/wordpress-deployment/ingress-create.png)

20. The app will display in the list below after you create it.

    ![application-created](/images/docs/quickstart/wordpress-deployment/application-created.png)

### Step 4: Verify resources

In **Workloads**, check the status of `wordpress-v1` and `mysql-v1` in **Deployments** and **StatefulSets** respectively. If they are running as shown in the image below, it means WordPress has been created successfully.

![wordpress-deployment](/images/docs/quickstart/wordpress-deployment/wordpress-deployment.png)

![mysql-running](/images/docs/quickstart/wordpress-deployment/mysql-running.png)

### Step 5: Access WordPress through NodePort

1. To access the Service outside the cluster, navigate to **Services** first. Click the three dots on the right of `wordpress` and select **Edit Internet Access**.

   ![edit-internet-access](/images/docs/quickstart/wordpress-deployment/edit-internet-access.png)

2. Select `NodePort` for **Access Method** and click **OK**.

   ![access-method](/images/docs/quickstart/wordpress-deployment/access-method.png)

3. Click the Service and you can see the port is exposed.

   ![nodeport-number](/images/docs/quickstart/wordpress-deployment/nodeport-number.png)

4. Access this application at `{Node IP}:{NodePort}` and you can see an image as below:

   ![wordpress-page](/images/docs/quickstart/wordpress-deployment/wordpress-page.png)

   {{< notice note >}}

Make sure the port is opened in your security groups before you access the Service.

{{</ notice >}} 