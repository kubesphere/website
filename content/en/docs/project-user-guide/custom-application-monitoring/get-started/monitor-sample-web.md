---
title: "Monitor Sample Web"
keywords: 'monitoring, prometheus, prometheus operator'
description: 'Monitor Sample Web'

linkTitle: "Monitor Sample Web"
weight: 2120
---

This section walks you through monitoring a sample web application. The application is instrumented with Prometheus Golang client in its code. Therefore, it can expose metrics directly without the help of exporters.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account for this tutorial. The account needs to be a platform regular user and to be invited as the workspace self provisioner with the `self-provisioner` role. In this tutorial, you log in as `project-self-provisioner` and work in the project `demo` in the workspace `my-workspace`.

- Knowledge of Helm Chart and [PromQL](https://prometheus.io/docs/prometheus/latest/querying/examples/).

## Hands-on Lab

### Step 1: Prepare Sample Web Application Image

First, prepare the sample web application image. The sample web application exposes a user-defined metric called `myapp_processed_ops_total`. It is a counter type metric that counts the number of operations that have been processed by far. The counter auto increases by one every 2 seconds. 

This sample application exposes application-specific metrics via the endpoint `http://localhost:2112/metrics`.

In this tutorial, we will use the made-ready image `kubespheredev/promethues-example-app`. The source code can be found in [kubesphere/prometheus-example-app](https://github.com/kubesphere/prometheus-example-app). You can also follow [Instrument A Go Application For Prometheus](https://prometheus.io/docs/guides/go-application/) in Prometheus official docs.

### Step 2: Pack the Application into a Helm Chart

In this step, pack the Deployment, Service, and ServiceMonitor YAML template into a helm chat for reuse. In the Deployment and Service template, you define sample web container and the port for the metrics endpoint. ServiceMonitor is a custom resource defined and used by Prometheus Operator. It connects your application and KubeSphere monitoring engine (Prometheus) so that the engine knows where and how to scrape metrics. In the future release, we will provide a graphical user interface for easy operation.

Find the source code in the folder `helm` in [kubesphere/prometheus-example-app](https://github.com/kubesphere/prometheus-example-app). The helm chart package is made ready and is named as `prometheus-example-app-0.1.0.tgz`. Please download the .tgz file and you will use it in the next step.

### Step 3: Upload the Helm Chart

To begin with, you should land on the workspace overview page of `my-workspace`.

- Navigate to **App Templates**

![app-template-create](/images/docs/project-user-guide/custom-application-monitoring/app-template-create.PNG)

- Click **Create** and upload `prometheus-example-app-0.1.0.tgz`

![click-create-app-template](/images/docs/project-user-guide/custom-application-monitoring/click-create-app-template.PNG)

![click-upload-app-template](/images/docs/project-user-guide/custom-application-monitoring/click-upload-app-template.PNG)

![click-upload-app-template-2](/images/docs/project-user-guide/custom-application-monitoring/click-upload-app-template-2.PNG)

![click-upload-app-template-3](/images/docs/project-user-guide/custom-application-monitoring/click-upload-app-template-3.PNG)

![click-upload-app-template-4](/images/docs/project-user-guide/custom-application-monitoring/click-upload-app-template-4.PNG)

![click-upload-app-template-5](/images/docs/project-user-guide/custom-application-monitoring/click-upload-app-template-5.PNG)

![click-upload-app-template-6](/images/docs/project-user-guide/custom-application-monitoring/click-upload-app-template-6.PNG)

### Step 4: Deploy Sample Web Application

You need to deploy the sample web application into `demo`. For demonstration purposes, you can simply run a test deployment.

- Click `prometheus-example-app`

![deploy-sample-web-1](/images/docs/project-user-guide/custom-application-monitoring/deploy-sample-web-1.PNG)

- Expand and Click **Test Deploy**

![deploy-sample-web-2](/images/docs/project-user-guide/custom-application-monitoring/deploy-sample-web-2.PNG)

![deploy-sample-web-3](/images/docs/project-user-guide/custom-application-monitoring/deploy-sample-web-3.PNG)

- Make sure to deploy the sample web application in `demo`

![deploy-sample-web-4](/images/docs/project-user-guide/custom-application-monitoring/deploy-sample-web-4.PNG)

- Enable ServiceMonitor and click **Deploy**

![deploy-sample-web-5](/images/docs/project-user-guide/custom-application-monitoring/deploy-sample-web-5.PNG)

![deploy-sample-web-6](/images/docs/project-user-guide/custom-application-monitoring/deploy-sample-web-6.PNG)

- Wait until the sample web application is up

![create-dashboard-1](/images/docs/project-user-guide/custom-application-monitoring/create-dashboard-1.PNG)

### Step 5: Create Dashboard

This section guides you on how to create a dashboard from scratch. You will create a text chart showing the total number of processed operations and a line chart for displaying the operation rate.

- Navigate to **Custom Monitoring**

![create-dashboard-2](/images/docs/project-user-guide/custom-application-monitoring/create-dashboard-2.PNG)

- Type `sample-web` and click **Create**

![create-dashboard-3](/images/docs/project-user-guide/custom-application-monitoring/create-dashboard-3.PNG)

- Set title to `Sample Web Overview`

![create-dashboard-4](/images/docs/project-user-guide/custom-application-monitoring/create-dashboard-4.PNG)

- Click **plus sign** on the left column to create a text chart

![create-dashboard-5](/images/docs/project-user-guide/custom-application-monitoring/create-dashboard-5.PNG)

- Type PromQL expression `myapp_processed_ops_total` and give chart name `Operation Counts`

![create-dashboard-6](/images/docs/project-user-guide/custom-application-monitoring/create-dashboard-6.PNG)

- Click **Add Monitoring Item** to create a line chart

![create-dashboard-7](/images/docs/project-user-guide/custom-application-monitoring/create-dashboard-7.PNG)

![create-dashboard-8](/images/docs/project-user-guide/custom-application-monitoring/create-dashboard-8.PNG)

- Type PromQL expression `irate(myapp_processed_ops_total[3m])` and give chart name `Operation Rate`

To improve the appearance, you can set the metrics name to `{{service}}`. It will name each line with the value of the metric label `service`. Next, set the decimal places to `2` so that the result will be truncated to two decimal places.

![create-dashboard-9](/images/docs/project-user-guide/custom-application-monitoring/create-dashboard-9.PNG)

- Save template

![create-dashboard-10](/images/docs/project-user-guide/custom-application-monitoring/create-dashboard-10.PNG)