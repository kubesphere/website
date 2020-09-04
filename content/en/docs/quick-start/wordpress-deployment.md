---
title: "Compose and Deploy Wordpress"
keywords: 'KubeSphere, Kubernetes, app, Wordpress'
description: 'Compose and deploy Wordpress.'

linkTitle: "Compose and Deploy Wordpress"
weight: 3050
---

## WordPress Introduction

WordPress is a free and open-source content management system written in PHP, allowing users to build their own websites. A complete Wordpress application includes the following Kubernetes objects with MySQL serving as the backend database.

![WordPress](https://pek3b.qingstor.com/kubesphere-docs/png/20200105181908.png)

## Objective

This tutorial demonstrates how to create an application (WordPress as an example) in KubeSphere and access it outside the cluster.

## Prerequisites

An account `project-regular` is needed with the role `operator` assigned in one of your projects (the user has been invited to the project). For more information, see [Create Workspace, Project, Account and Role](../create-workspace-and-project/).

## Estimated Time

About 15 minutes.

## Hands-on Lab

### Task 1: Create Secrets

#### Create a MySQL Secret

The environment variable `WORDPRESS_DB_PASSWORD` is the password to connect to the database in WordPress. In this step, you need to create a ConfigMap to store the environment variable that will be used in MySQL pod template.

1. Log in KubeSphere console using the account `project-regular`. Go to the detailed page of `demo-project` and navigate to **Configurations**. In **Secrets**, click **Create** on the right.

![create-secret](https://ap3.qingstor.com/kubesphere-website/docs/20200903154611.png)

2. Enter the basic information (e.g. name it `mysql-secret`) and click **Next**. In the next page, select **Default** for **Type** and click **Add Data** to add a key-value pair. Input the Key (`MYSQL_ROOT_PASSWORD`) and Value (`123456`) as below and click `√` at the bottom right corner to confirm. When you finish, click **Create** to continue.

![key-value](https://ap3.qingstor.com/kubesphere-website/docs/20200903155603.png)

#### Create a WordPress Secret

Follow the same steps above to create a WordPress secret `wordpress-secret` with the key `WORDPRESS_DB_PASSWORD` and value `123456`. Secrets created display in the list as below:

![wordpress-secrets](https://ap3.qingstor.com/kubesphere-website/docs/20200903160809.png)

### Task 2: Create a Volume

1. Go to **Volumes** under **Storage** and click **Create**.

![create-volume](https://ap3.qingstor.com/kubesphere-website/docs/20200903162343.png)

2. Enter the basic information of the volume (e.g. name it `wordpress-pvc`) and click **Next**.
3. In **Volume Settings**, you need to choose an available **Storage Class**, and set **Access Mode** and **Volume Capacity**. You can use the default value directly as shown below. Click **Next** to continue.

![volume-settings](https://ap3.qingstor.com/kubesphere-website/docs/20200903163419.png)

4. For **Advanced Settings**, you do not need to add extra information for this task and click **Create** to finish.

### Task 3: Create an Application

#### Add MySQL backend component

1. Navigate to **Applications** under **Application Workloads**, select **Composing App** and click **Create Composing Application**.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200903164227.png)

2. Enter the basic information (e.g. input `wordpress` for Application Name) and click **Next**.

![basic-info](https://ap3.qingstor.com/kubesphere-website/docs/basic-info.png)

3. In **Components**, click **Add Service** to set a component in the app.

![add-service](https://ap3.qingstor.com/kubesphere-website/docs/20200903173210.png)

4. Define a service type for the component. Select **Stateful Service** here.
5. Enter the name for the stateful service (e.g. **mysql**) and click **Next**.

![mysql-name](https://ap3.qingstor.com/kubesphere-website/docs/mysqlname.png)

6. In **Container Image**, click **Add Container Image**.

![container-image](https://ap3.qingstor.com/kubesphere-website/docs/container-image.png)

7. Enter `mysql:5.6` in the search box, press **Enter** and click **Use Default Ports**. After that, do not click `√` at the bottom right corner as the setting is not finished yet.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200903174120.png)

{{< notice note >}}

In **Advanced Settings**, make sure the memory limit is no less than 1000 Mi or MySQL may fail to start due to a lack of memory.

{{</ notice >}} 

8. Scroll down to **Environment Variables** and click **Use ConfigMap or Secret**. Input the name `MYSQL_ROOT_PASSWORD` and choose the resource `mysql-secret` and the key `MYSQL_ROOT_PASSWORD` created in the previous step. Click `√` after you finish and **Next** to continue.

![environment-var](https://ap3.qingstor.com/kubesphere-website/docs/20200903174838.png)

9. Select **Add Volume Template** in **Mount Volumes**. Input the value of **Volume Name** (`mysql`) and **Mount Path** (mode: `ReadAndWrite`, path: `/var/lib/mysql`) as below:

![volume-template](https://ap3.qingstor.com/kubesphere-website/docs/vol11.jpg)

Click `√` after you finish and click **Next** to continue.

10. In **Advanced Settings**, you can click **Add** directly or select other options based on your needs.

![advanced-setting](https://ap3.qingstor.com/kubesphere-website/docs/20200903180415.png)

11. At this point, the MySQL component has beed added as shown below:

![mysql-done](https://ap3.qingstor.com/kubesphere-website/docs/20200903180714.png)

#### Add WordPress frontend component

12. Click **Add Service** again and select **Stateless Service** this time. Enter the name `wordpress` and click Next.

![](https://ap3.qingstor.com/kubesphere-website/docs/name-wordpress.png)

13. Similar to the step above, click **Add Container Image**, enter `wordpress:4.8-apache` in the search box, press **Enter** and click **Use Default Ports**.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200903171416.png)

14. Scroll down to **Environment Variables** and click **Use ConfigMap or Secret**. Two environment variables need to be added here. Enter the values according to the screenshot below.

- For `WORDPRESS_DB_PASSWORD`, choose `wordpress-secret` and `WORDPRESS_DB_PASSWORD` created in Task 1.
- Click **Add Environment Variable**, and enter `WORDPRESS_DB_HOST` and `mysql` for the key and value.

{{< notice warning >}}

For the second environment variable added here, the value must be exactly the same as the name you set for MySQL in step 5. Otherwise, Wordpress cannot connect to the corresponding database of MySQL.

{{</ notice >}}

![environment-varss](https://ap3.qingstor.com/kubesphere-website/docs/20200903171658.png)

Click `√` to save it and **Next** to continue.

15. In **Mount Volumes**, click **Add Volume** and select **Choose an existing volume**.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200903171819.png)



![choose-existing](https://ap3.qingstor.com/kubesphere-website/docs/20200903171906.png)

16. Select `wordpress-pvc` created in the previous step, set the mode as `ReadAndWrite`, and input `/var/www/html` as its mount path. Click `√` to save it and **Next** to continue.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200903172021.png)

17. In **Advanced Settings**, you can click **Add** directly or select other options based on your needs.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200903172144.png)

18. The frontend component is also set now. Click **Next** to continue. 

![two-components-done](https://ap3.qingstor.com/kubesphere-website/docs/20200903172222.png)

19. You can set route rules (Ingress) here or click **Create** directly.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200903184009.png)

20. The app will display in the list below after you create it.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200903184151.png)

### Task 4: Verify the Resources

In **Workloads**, check the status of `wordpress-v1` and `mysql-v1` in **Deployments** and **StatefulSets** respectively. If they are running as shown in the image below, it means WordPress has been created successfully.

![wordpress-deployment](https://ap3.qingstor.com/kubesphere-website/docs/20200903203217.png)

![wordpress-statefulset](https://ap3.qingstor.com/kubesphere-website/docs/20200903203638.png)

### Task 5: Access WordPress through NodePort

1. To access the service outside the cluster, navigate to **Services** first. Click the three dots on the right of `wordpress` and select **Edit Internet Access**.

![edit-internet-access](https://ap3.qingstor.com/kubesphere-website/docs/20200903204414.png)

2. Select `NodePort` for **Access Method** and click **OK**.

![access-method](https://ap3.qingstor.com/kubesphere-website/docs/20200903205135.png)

3. Click the service and you can see the port exposed.

![nodeport-number](https://ap3.qingstor.com/kubesphere-website/docs/20200903205423.png)

4. Access this application via `{Node IP}:{NodePort}` and you can see an image as below:

![wordpress](https://ap3.qingstor.com/kubesphere-website/docs/20200903200408.png)

{{< notice note >}}

Make sure the port is opened in your security groups before you access the service.

{{</ notice >}} 