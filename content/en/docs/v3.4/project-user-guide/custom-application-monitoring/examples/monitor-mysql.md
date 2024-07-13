---
title: "Monitor MySQL"
keywords: 'monitoring, Prometheus, MySQL, MySQL Exporter'
description: 'Deploy MySQL and MySQL Exporter and create a dashboard to monitor the app.'
linkTitle: "Monitor MySQL"
weight: 10812
version: "v3.4"
---
From the [Introduction](../../introduction#indirect-exposing) section, you know it is not feasible to instrument MySQL with Prometheus metrics directly. To expose MySQL metrics in Prometheus format, you need to deploy MySQL Exporter first.

This tutorial demonstrates how to monitor and visualize MySQL metrics.

## Prerequisites

- You need to [enable the App Store](../../../../pluggable-components/app-store/). MySQL and MySQL Exporter are available in the App Store.
- You need to create a workspace, a project, and a user (`project-regular`) for this tutorial. The user needs to be invited to the project with the `operator` role. For more information, see [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

## Step 1: Deploy MySQL

To begin with, you need to [deploy MySQL from the App Store](../../../../application-store/built-in-apps/mysql-app/).

1. Go to your project and click **App Store** in the upper-left corner.

2. Click **MySQL** to go to its details page and click **Install** on the **App Information** tab.

    {{< notice note >}}

MySQL is a built-in app in the KubeSphere App Store, which means it can be deployed and used directly once the App Store is enabled.

{{</ notice >}} 

3. Under **Basic Information**, set a **Name** and select a **Version**. Select the project where the app is deployed under **Location** and click **Next**.

4. Under **App Settings**, set a root password by uncommenting the `mysqlRootPassword` field and click **Install**.

5. Wait until MySQL is up and running.

## Step 2: Deploy MySQL Exporter

You need to deploy MySQL Exporter in the same project on the same cluster. MySQL Exporter is responsible for querying the status of MySQL and reports the data in Prometheus format.

1. Go to **App Store** and click **MySQL Exporter**.

2. On the details page, click **Install**.

3. Under **Basic Information**, set a **Name** and select a **Version**. Select the same project where MySQL is deployed under **Location** and click **Next**.

4. Make sure `serviceMonitor.enabled` is set to `true`. The built-in MySQL Exporter sets it to `true` by default, so you don't need to manually change the value of `serviceMonitor.enabled`.

    {{< notice warning >}}
You must enable the ServiceMonitor CRD if you are using external exporter Helm charts. Those charts usually disable ServiceMonitors by default and require manual modification.
    {{</ notice >}}

5. Modify MySQL connection parameters. MySQL Exporter needs to connect to the target MySQL. In this tutorial, MySQL is installed with the service name `mysql-dh3ily`. Navigate to `mysql` in the configuration file, and set `host` to `mysql-dh3ily`, `pass` to `testing`, and `user` to `root`. Note that your MySQL service may be created with **a different name**. After you finish editing the file, click **Install**.

6. Wait until MySQL Exporter is up and running.

## Step 3: Create a Monitoring Dashboard

You can create a monitoring dashboard for MySQL and visualize real-time metrics.

1. In the same project, go to **Custom Monitoring** under **Monitoring & Alerting** in the sidebar and click **Create**.

2. In the displayed dialog box, set a name for the dashboard (for example, `mysql-overview`) and select the MySQL template. Click **Next** to continue.

3. Save the template by clicking **Save Template** in the upper-right corner. A newly-created dashboard is displayed on the **Custom Monitoring Dashboards** page.

    {{< notice note >}}

- The built-in MySQL template is provided by KubeSphere to help you monitor MySQL metrics. You can also add more metrics on the dashboard as needed.

- For more information about dashboard properties, see [Visualization](../../../../project-user-guide/custom-application-monitoring/visualization/overview/).
      {{</ notice >}}