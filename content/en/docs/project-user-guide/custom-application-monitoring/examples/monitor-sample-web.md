---
title: "Monitor a Sample Web Application"
keywords: 'monitoring, prometheus, prometheus operator'
description: 'Use a Helm chart to deploy a sample web app and create a dashboard to monitor the app.'
linkTitle: "Monitor a Sample Web Application"
weight: 10813
---

This section walks you through monitoring a sample web application. The application is instrumented with Prometheus Go client in its code. Therefore, it can expose metrics directly without the help of exporters.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account for this tutorial. For more information, see [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/). The account needs to be a platform regular user and to be invited to the workspace with the `self-provisioner` role. Namely, create a user `workspace-self-provisioner` of the `self-provisioner` role, and use this account to create a project (for example, `test`). In this tutorial, you log in as `workspace-self-provisioner` and work in the project `test` in the workspace `demo-workspace`.

- Knowledge of Helm charts and [PromQL](https://prometheus.io/docs/prometheus/latest/querying/examples/).

## Hands-on Lab

### Step 1: Prepare the image of a sample web application

The sample web application exposes a user-defined metric called `myapp_processed_ops_total`. It is a counter type metric that counts the number of operations that have been processed. The counter increases automatically by one every 2 seconds.

This sample application exposes application-specific metrics via the endpoint `http://localhost:2112/metrics`.

In this tutorial, you use the made-ready image `kubespheredev/promethues-example-app`. The source code can be found in [kubesphere/prometheus-example-app](https://github.com/kubesphere/prometheus-example-app). You can also follow [Instrument A Go Application For Prometheus](https://prometheus.io/docs/guides/go-application/) in the official documentation of Prometheus.

### Step 2: Pack the application into a Helm chart

Pack the Deployment, Service, and ServiceMonitor YAML template into a Helm chart for reuse. In the Deployment and Service template, you define the sample web container and the port for the metrics endpoint. A ServiceMonitor is a custom resource defined and used by Prometheus Operator. It connects your application and KubeSphere monitoring engine (Prometheus) so that the engine knows where and how to scrape metrics. In future releases, KubeSphere will provide a graphical user interface for easy operation.

Find the source code in the folder `helm` in [kubesphere/prometheus-example-app](https://github.com/kubesphere/prometheus-example-app). The Helm chart package is made ready and is named `prometheus-example-app-0.1.0.tgz`. Please download the .tgz file and you will use it in the next step.

### Step 3: Upload the Helm chart

1. Go to the workspace **Overview** page of `demo-workspace` and navigate to **App Templates** under **App Management**.

2. Click **Create** and upload `prometheus-example-app-0.1.0.tgz`.

### Step 4: Deploy the sample web application

You need to deploy the sample web application into `test`. For demonstration purposes, you can simply run a test deployment.

1. Click `prometheus-example-app`.

2. Expand the menu and click **Install**.

3. Make sure you deploy the sample web application in `test` and click **Next**.

4. Make sure `serviceMonitor.enabled` is set to `true` and click **Install**.

5. In **Workloads** of the project `test`, wait until the sample web application is up and running.

### Step 5: Create a monitoring dashboard

This section guides you on how to create a dashboard from scratch. You will create a text chart showing the total number of processed operations and a line chart for displaying the operation rate.

1. Navigate to **Custom Monitoring Dashboards** and click **Create**.

2. Set a name (for example, `sample-web`) and click **Next**.

3. Enter a title in the upper-left corner (for example, `Sample Web Overview`).

4. Click <img src="/images/docs/project-user-guide/custom-application-monitoring/examples/monitor-sample-app/plus-icon.png" height="16px" width="20px" /> on the left column to create a text chart.

5. Type the PromQL expression `myapp_processed_ops_total` in the field **Monitoring Metric** and give a chart name (for example, `Operation Count`). Click **√** in the lower-right corner to continue.

6. Click **Add Monitoring Item**, select **Line Chart**, and click **OK**.

7. Enter the PromQL expression `irate(myapp_processed_ops_total[3m])` for **Monitoring Metric** and name the chart `Operation Rate`. To improve the appearance, you can set **Metric Name** to `{{service}}`. It will name each line with the value of the metric label `service`. Next, set **Decimal Places** to `2` so that the result will be truncated to two decimal places. Click **√** in the lower-right corner to continue.

8. Click **Save Template** to save it.
