---
title: "Monitor MySQL"
keywords: 'monitoring, prometheus, prometheus operator'
description: 'Monitor MySQL'

linkTitle: "Monitor MySQL"
weight: 2110
---
From the [Introduction](../../introduction#indirect-exposing) section, you know it is not feasible to instrument MySQL with Prometheus metrics directly. To expose MySQL metrics in Prometheus format, you need to deploy MySQL exporter instead.

This tutorial walks you through an example of how to monitor MySQL metrics and visualize them.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/). We will deploy MySQL and MySQL exporter from the App Store.
- You need to create a workspace, a project, and a user account for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-operator` and work in the project `demo` in the workspace `my-workspace`.

## Hands-on Lab

### Step 1: Deploy MySQL

To begin with, we deploy MySQL from the App Store and set the root password to `testing`. Please make sure you are landing on the project overview page of `demo`.

- Go to **App Store**

![go-to-app-store](/images/docs/project-user-guide/custom-application-monitoring/go-to-app-store.PNG)

- Find **MySQL** and Click **Deploy**

![find-mysql](/images/docs/project-user-guide/custom-application-monitoring/find-mysql.PNG)

![click-deploy](/images/docs/project-user-guide/custom-application-monitoring/click-deploy.PNG)

- Make sure MySQL is deployed in `demo`

![click-next](/images/docs/project-user-guide/custom-application-monitoring/click-next.PNG)

- Uncomment the `mysqlRootPassword` field and click **Deploy**

![uncomment-mysqlRootPassword](/images/docs/project-user-guide/custom-application-monitoring/uncomment-mysqlRootPassword.PNG)

- Wait until MySQL is up

![check-if-mysql-is-running](/images/docs/project-user-guide/custom-application-monitoring/check-if-mysql-is-running.PNG)


### Step 2: Deploy MySQL exporter

Deploy MySQL exporter in `demo` on the same cluster. MySQL exporter is responsible for querying MySQL status and reports them in Prometheus format.

- Go to **App Store** and find **MySQL exporter**

![find-mysql-exporter](/images/docs/project-user-guide/custom-application-monitoring/find-mysql-exporter.PNG) 

![exporter-click-deploy](/images/docs/project-user-guide/custom-application-monitoring/exporter-click-deploy.PNG)

- Deploy MySQL exporter in `demo` again

![exporter-click-next](/images/docs/project-user-guide/custom-application-monitoring/exporter-click-next.PNG)

- Set `serviceMonitor.enabled` to true

The builtin MySQL exporter sets it true by default, so you don't have to manually modify `serviceMonitor.enabled`.

![set-servicemonitor-to-true](/images/docs/project-user-guide/custom-application-monitoring/set-servicemonitor-to-true.PNG)

{{< notice warning >}}
Don't forget to enable SericeMonitor CRD if you are using external exporter helm charts. Those charts usually disable ServiceMonitor by default and require manual modification.
{{</ notice >}}

- Modify MySQL connection parameters

MySQL exporter needs to connect to the target MySQL. In this tutorial, MySQL is installed with the Service name `mysql-egn701`. Modify `mysql.host` to `mysql-egn701`, `mysql.pass` to `testing`, and `user` to `root` as below. Note that your MySQL Service may be created with **a different name**.

![mysql-conn-params](/images/docs/project-user-guide/custom-application-monitoring/mysql-conn-params.PNG)

- Click **Deploy** and wait until MySQL exporter is up

![exporter-click-deploy-2](/images/docs/project-user-guide/custom-application-monitoring/exporter-click-deploy-2.PNG)

![exporter-is-running](/images/docs/project-user-guide/custom-application-monitoring/exporter-is-running.PNG)

### Step 3: Create Dashboard

After about two minutes, you can create a monitoring dashboard for MySQL and visualize metrics in real time.

- Navigate to **Custom Monitoring** and Click **Create**

![navigate-to-custom-monitoring](/images/docs/project-user-guide/custom-application-monitoring/navigate-to-custom-monitoring.PNG)

- Name the dashboard as `mysql-overview` and choose **MySQL template**

![create-mysql-dashboard](/images/docs/project-user-guide/custom-application-monitoring/create-mysql-dashboard.PNG)

- Save template

![save-mysql-template](/images/docs/project-user-guide/custom-application-monitoring/save-mysql-template.PNG)

![monitor-mysql-done](/images/docs/project-user-guide/custom-application-monitoring/monitor-mysql-done.PNG)