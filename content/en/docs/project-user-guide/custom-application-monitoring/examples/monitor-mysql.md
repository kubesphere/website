---
title: "Monitor MySQL"
keywords: 'monitoring, prometheus, prometheus operator'
description: 'Monitor MySQL'

linkTitle: "Monitor MySQL"
weight: 10812
---
From the [Introduction](../../introduction#indirect-exposing) section, you know it is not feasible to instrument MySQL with Prometheus metrics directly. To expose MySQL metrics in Prometheus format, you need to deploy MySQL exporter instead.

This tutorial walks you through an example of how to monitor MySQL metrics and visualize them.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/). MySQL and MySQL exporter will be deployed from the App Store.
- You need to create a workspace, a project, and a user account for this tutorial. For more information, see [Create Workspace, Project, Account and Role](../../../../quick-start/create-workspace-and-project/). The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-operator` and work in the project `demo` in the workspace `demo-workspace`.

## Hands-on Lab

### Step 1: Deploy MySQL

To begin with, you [deploy MySQL from the App Store](../../../../application-store/built-in-apps/mysql-app/) and set the root password to `testing`. Please make sure you are landing on the **Overview** page of the project `demo`.

1. Go to **App Store**.

    ![go-to-app-store](/images/docs/project-user-guide/custom-application-monitoring/go-to-app-store.jpg)

2. Find **MySQL** and click **Deploy**.

    ![find-mysql](/images/docs/project-user-guide/custom-application-monitoring/find-mysql.jpg)

    ![click-deploy](/images/docs/project-user-guide/custom-application-monitoring/click-deploy.jpg)

3. Make sure MySQL is deployed in `demo` and click **Next**.

    ![click-next](/images/docs/project-user-guide/custom-application-monitoring/click-next.jpg)

4. Uncomment the `mysqlRootPassword` field and click **Deploy**.

    ![uncomment-mysqlRootPassword](/images/docs/project-user-guide/custom-application-monitoring/uncomment-mysqlRootPassword.jpg)

5. Wait until MySQL is up and running.

    ![check-if-mysql-is-running](/images/docs/project-user-guide/custom-application-monitoring/check-if-mysql-is-running.jpg)

### Step 2: Deploy MySQL exporter

You need to deploy MySQL exporter in `demo` on the same cluster. MySQL exporter is responsible for querying MySQL status and reports the data in Prometheus format.

1. Go to **App Store** and find **MySQL exporter**.

    ![find-mysql-exporter](/images/docs/project-user-guide/custom-application-monitoring/find-mysql-exporter.jpg) 

    ![exporter-click-deploy](/images/docs/project-user-guide/custom-application-monitoring/exporter-click-deploy.jpg)

2. Deploy MySQL exporter in `demo` again.

    ![exporter-click-next](/images/docs/project-user-guide/custom-application-monitoring/exporter-click-next.jpg)

3. Make sure `serviceMonitor.enabled` is set to `true`. The built-in MySQL exporter sets it to `true` by default, so you don't have to manually modify `serviceMonitor.enabled`.

    ![set-servicemonitor-to-true](/images/docs/project-user-guide/custom-application-monitoring/set-servicemonitor-to-true.jpg)

    {{< notice warning >}}
Don't forget to enable the SericeMonitor CRD if you are using external exporter helm charts. Those charts usually disable ServiceMonitor by default and require manual modification.
    {{</ notice >}}

4. Modify MySQL connection parameters. MySQL exporter needs to connect to the target MySQL. In this tutorial, MySQL is installed with the service name `mysql-a8xgvx`. Set `mysql.host` to `mysql-a8xgvx`, `mysql.pass` to `testing`, and `user` to `root` as below. Note that your MySQL service may be created with **a different name**.

    ![mysql-conn-params](/images/docs/project-user-guide/custom-application-monitoring/mysql-conn-params.jpg)

5. Click **Deploy** and wait until MySQL exporter is up and running.

    ![exporter-click-deploy-2](/images/docs/project-user-guide/custom-application-monitoring/exporter-click-deploy-2.jpg)

    ![exporter-is-running](/images/docs/project-user-guide/custom-application-monitoring/exporter-is-running.jpg)

### Step 3: Create Dashboard

After about two minutes, you can create a monitoring dashboard for MySQL and visualize metrics in real time.

1. Navigate to **Custom Monitoring** under **Monitoring  & Alerting** and click **Create**.

    ![navigate-to-custom-monitoring](/images/docs/project-user-guide/custom-application-monitoring/navigate-to-custom-monitoring.jpg)

2. In the dialogue that appears, name the dashboard as `mysql-overview` and choose **MySQL template**. Click **Create** to continue.

    ![create-mysql-dashboard](/images/docs/project-user-guide/custom-application-monitoring/create-mysql-dashboard.jpg)

3. Save the template by clicking **Save Template** in the top right corner. A newly-created dashboard displays in the dashboard list as below.

    ![save-mysql-template](/images/docs/project-user-guide/custom-application-monitoring/save-mysql-template.jpg)

    ![monitor-mysql-done](/images/docs/project-user-guide/custom-application-monitoring/monitor-mysql-done.jpg)

    {{< notice tip >}}
For more information about dashboard strings, see [Visualization](../../../../project-user-guide/custom-application-monitoring/visualization/overview/).
    {{</ notice >}}