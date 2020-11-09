---
title: "Deploy MySql on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Installation, MySql'
description: 'How to deploy MySql on KubeSphere through App Store'

link title: "Deploy MySql"
weight: 345
---
[MySql](https://www.mysql.com/) is an open source relational database management system (RDBMS), which USES the most commonly used database management language - Structured Query Language (SQL) for database management.
MySQL is open source, so anyone can download it under the General Public License and modify it to suit their personal needs.
This tutorial walks you through an example of how to deploy MySql on KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/). MySql will be deployed from the App Store.
- You need to create a workspace, a project, and a user account for this tutorial.  The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-operator` and work in the project `test-project` in the workspace `test-workspace`.

## Hands-on Lab

### Step 1: Deploy MySql from App Store

Please make sure you are landing on the **Overview** page of the project `test-project`.

1. Go to **App Store**.

![go-to-app-store](/images/docs/mysql-app/mysql01.png)

2. Find **MySql** and click **Deploy**.

![find-mysql](/images/docs/mysql-app/mysql02.png)

![click-deploy](/images/docs/mysql-app/mysql03.png)

3. Make sure MySQL is deployed in `test-project` and click **Next**.

![click-next](/images/docs/mysql-app/mysql04.png)

4. Uncomment the `mysqlRootPassword` field or modify the password as you want. then click **Deploy**.

![click-demploy](/images/docs/mysql-app/mysql05.png)

5. Wait until MySql is up and running.

![check-if-mysql-is-running](/images/docs/mysql-app/mysql06.png)

### Step 2: Access MySql Terminal

1. Go to **WorkLoads** and click **MySql-Workload-name**.

![click-mysql-Workload](/images/docs/mysql-app/mysql07.png)

2. Expand pods information and click **terminal**. You can now use the feature.
![click-container-terminal](/images/docs/mysql-app/mysql08.png)

3. You can use `mysql -uroot -ptesting`log in mysql database at the terminal.
![login-mysql](/images/docs/mysql-app/mysql09.png)

### Step 3: Access MySql database through the external network

1. Go to **Services** and click **mysql-service-name**.
![click-mysql-service](/images/docs/mysql-app/mysql10.png)

2. Click **More** and click **Edit Internet Access**.
![click-edit-internet-access](/images/docs/mysql-app/mysql11.png)

3. Select **NodePort** and click **Ok**. [Learn More](https://v2-1.docs.kubesphere.io/docs/project-setting/project-gateway/)
![select-nodeport](/images/docs/mysql-app/mysql12.png)

4. Through <font color=green>{$NodeIP} : {$Nodeport} </font>  to access the mysql database. 
![mysql-port](/images/docs/mysql-app/mysql13.png)
![access-mysql-database](/images/docs/mysql-app/mysql14.png)
![access-mysql-database](/images/docs/mysql-app/mysql15.png)

5. If you want to learn more information about MySql please refer to https://dev.mysql.com/doc/.