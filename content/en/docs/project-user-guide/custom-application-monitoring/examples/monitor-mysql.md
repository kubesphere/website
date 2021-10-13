---
title: "Monitor MySQL"
keywords: 'monitoring, Prometheus, MySQL, MySQL Exporter'
description: 'Deploy MySQL and MySQL Exporter and create a dashboard to monitor the app.'
linkTitle: "Monitor MySQL"
weight: 10812
---
From the [Introduction](../../introduction#indirect-exposing) section, you know it is not feasible to instrument MySQL with Prometheus metrics directly. To expose MySQL metrics in Prometheus format, you need to deploy MySQL Exporter first.

This tutorial demonstrates how to monitor and visualize MySQL metrics.

## Prerequisites

- You need to [enable the App Store](../../../../pluggable-components/app-store/). MySQL and MySQL Exporter will be deployed from the App Store.
- You need to create a workspace, a project, and a user (`project-regular`) for this tutorial. The account needs to be invited to the project with the `operator` role. For more information, see [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

## Step 1: Deploy MySQL

To begin with, you need to [deploy MySQL from the App Store](../../../../application-store/built-in-apps/mysql-app/).

1. Go to your project and click **App Store** in the top-left corner.

2. Click **MySQL** to go to its product detail page and click **Deploy** on the **App Information** tab.

    {{< notice note >}}

MySQL is a built-in app in the KubeSphere App Store, which means it can be deployed and used directly once the App Store is enabled.

{{</ notice >}} 

3. Under **Basic Information**, set an **App Name** and select an **App Version**. Select the project where the app will be deployed under **Deployment Location** and click **Next**.

4. Under **App Configurations**, set a root password by uncommenting the `mysqlRootPassword` field and click **Deploy**.

    ![mysql-root-password](/images/docs/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-root-password.png)

5. Wait until MySQL is up and running.

    ![mysql-ready](/images/docs/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-ready.png)

## Step 2: Deploy MySQL Exporter

You need to deploy MySQL Exporter in the same project on the same cluster. MySQL Exporter is responsible for querying the status of MySQL and reports the data in Prometheus format.

1. Go to **App Store** and click **MySQL Exporter**.

2. On the product detail page, click **Deploy**.

3. Under **Basic Information**, set an **App Name** and select an **App Version**. Select the same project where MySQL is deployed under **Deployment Location** and click **Next**.

4. Make sure `serviceMonitor.enabled` is set to `true`. The built-in MySQL Exporter sets it to `true` by default, so you don't need to manually change the value of `serviceMonitor.enabled`.

    {{< notice warning >}}
You must enable the ServiceMonitor CRD if you are using external exporter Helm charts. Those charts usually disable ServiceMonitors by default and require manual modification.
    {{</ notice >}}

5. Modify MySQL connection parameters. MySQL Exporter needs to connect to the target MySQL. In this tutorial, MySQL is installed with the service name `mysql-dh3ily`. Navigate to `mysql` in the configuration file, and set `host` to `mysql-dh3ily`, `pass` to `testing`, and `user` to `root` as below. Note that your MySQL service may be created with **a different name**.

    ![mysql-app-configurations](/images/docs/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-app-configurations.png)

    Click **Deploy**.

6. Wait until MySQL Exporter is up and running.

    ![mysql-exporter-ready](/images/docs/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-exporter-ready.png)

## Step 3: Create a Monitoring Dashboard

You can create a monitoring dashboard for MySQL and visualize real-time metrics.

1. In the same project, go to **Custom Monitoring** under **Monitoring & Alerting** in the sidebar and click **Create**.

2. In the dialog that appears, set a name for the dashboard (for example, `mysql-overview`) and select the MySQL template. Click **Next** to continue.

3. Save the template by clicking **Save Template** in the top-right corner. A newly-created dashboard will appear on the **Custom Monitoring Dashboards** page.

    ![mysql-dashboards](/images/docs/project-user-guide/custom-application-monitoring/examples/monitor-mysql/mysql-dashboards.png)

    {{< notice note >}}

- The built-in MySQL template is provided by KubeSphere to help you monitor MySQL metrics. You can also add more metrics on the dashboard as needed.

- For more information about dashboard properties, see [Visualization](../../../../project-user-guide/custom-application-monitoring/visualization/overview/).
      {{</ notice >}}