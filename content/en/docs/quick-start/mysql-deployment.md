---
title: 'Deploying a MySQL Stateful Application'
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''

_build:
    render: false
---

## Objective

Take the setting up of a Statefulset for an example. Here is a presentation of how to use the mirroring deployment, `mysql:5.6`, to set up a stateful MySQL app as the [Wordpress](https://wordpress.org/) website's backend. It will show you how to use Statefulset. The MySQL initial password for this example will be created and saved as [Secret](../configuration/secrets/). For presenting, here will only demonstrate processes. For relevant parameters and fields' detailed explanation, please refer to the [Secret](../configuration/secrets/) and [StatefulSets](../workload/statefulsets/)

## Prerequisites

- The workspace, projects and the general user account `project-regular` should be created. If not, please refer to [Quick Start Guide of Multi-tenant Management](../quick-start/admin-quick-start/)
- Use `project-admin` to invite `project regular` to the project and grant it with the role of `operator`. Please refer to [Quick Start Guide of Multi-tenant Management-Inviting Members](../quick-start/admin-quick-start/)

## Estimated Time

- About 10 minutes

## Hands-on Lab

## Deploy MySQL

### Step 1: Create the Password

MySQL's Enviromental variable `MYSQL_ROOT_PASSWORD`, namely the root user's password, is private informsation. It's inappropriate to show the password in steps. Therefore, here we use the password creation to replace the environmental variable. The created password will be keyed in as the environmental variable when setting up the MySQL container group.

1.1. Log in KubeSphere as the `project-regular`. Select **Secret** in the **Configuration Center → Secrets**, then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716180335.png#alt=)

1.2. Fill in the password's basic information,then click **Next**.

- Name: The environmenal variables in the MySQL container can have customized names, such as `mysql-secret`.
- Nickname: Nickname can be a mix of characters for you to differenciate resources, such as `MySQL Secret`.
- Information Description: Simply introduce the password, such as `MySQL Initial password`.

  1.3. Fill in the following information into the secret setting page. Then click **Create**.

- Type: Select `default`(Opaque).
- Data: Fill in `MYSQL_ROOT_PASSWORD` and `123456`for the data key-value pair.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716180525.png#alt=)

### Step 2: Create a StatefulSet

Navigate to **Workload → StatefulSets**, then click **Create StatefulSet**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716180714.png#alt=)

### Step 3: Fill in Basic Information

Fill in the following information and then click **Next**.

- Name:(Necessary) A simple name can help with user brpwsing and researching, such as `wordpress-mysql`.
- Nickname: (Optional) Chinese can help with better resource differentiation, such as `MySQL Database`.
- Information description: Simply introduce the workload for users' understanding.

### Step 4: Container Group Template

4.1. Click **Add Container** to fill in the container group seeing. The name is customizable. Fill in the mirror with `mysql:5.6` (specific mirror edition number is needed). There is no limitation for CPU and storage. They will be used as the default reqest value when creating the project.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716193052.png#alt=)

4.2 Set up the **Service Setting** and the **Environmental Variable**. Leave others unchanged. Then click **Save**.

- Port: It can be named as Port. Select `TCP` protocol. Fill in `3306` at MySQL's container port.
- Environmental Variables: Check the box and click **Reference Configuration Center**. Key in `MYSQL_ROOT_PASSWORD`for name and select the secret set in the first step `mysql-secret` and `MYSQL_ROOT_PASSWORD`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716193727.png#alt=)

4.3. Click **Save** and then click **Next**.

### Step 5: Add Storage Volume Template

Complete the container group template then click **Next**. Lick **Add Storage Volume Template** in the template. Stateful data should be saved in persistent storage volume. Thus, you need to add storage volume to realize the data persistency. Please refer to the storage volume information as follows.

- Volume Name: `mysql-pvc`
- Storage Type: Select existing storage type, such as `Local`.
- Capacity: Set `10 Gi` by default and set access mode as `ReadWriteOnce` by default.
- Mount Path: Find the storage volume's mount path in the container. Select `Read and Write` and set pasth as `/var/lib/mysql`.

Click **Save** when you're done. Then click **Next**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716194134.png#alt=)

### Step 6. Service Configuration

If you need to reveal the MySQL application to other applications and servers, you need to create the service. Complete the parameter setting by refering the picture below. Then click **Next**.

- Service Name: `mysql-service` (Attention: The Service Name will be associated with Wordpress so use this name when you add environmental variables.)
- Conversation affinity: None by default
- Ports: The name is customizable. Select TCP protocol. Fill `3306` for both of the MySQL service port and the target port. The first port the service port that needs to be exposed. The second port (target port) is the container port.

> Note: If there is a requirement for conversation affinity, you can select "ClientIP" in the drop-down box or set the value of service.spec.sessionAffinity as "ClientIP" ("None" by default) in the code mode. This configuration can forward access request from the same IP address to the same rear end Pod.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716194331.png#alt=)

### Step 7: Tag Setting

Keep the tag as default setting `app: wordpress-mysql`. You can use the specific container group adjust the next node selector to the expected node. Do not set it for now. Click **Create**.

### Inspect the MySQL Application

You can see the MySQL StatefulSet displays "updating" since this process requires a series of operations, such as pulling a Docker image creating a container, and initializing the database. It will show `ContainerCreating`.  Normally, it will change to "running" at around 1 min. Click this you can access to the StateSet page including the Resource Status, Version Control, Monitoring, Environmental Variable and Events.

**Resource Status**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716195604.png#alt=)

**Monitoring Data**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716195732.png#alt=)

**Events List**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716200230.png#alt=)

So far, MySQL Stateful application has been created successfully, it will be served as the backend database of the WordPress application.

It's recommended to follow with [Quick Start - Wordpress Deployment Guide](../wordpress-deployment) to deploy the blog website, then you will be able to access the web service.
