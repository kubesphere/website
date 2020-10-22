---
title: "Project User Guide"
description: "Help you to better manage resources in a KubeSphere project"
layout: "single"

linkTitle: "Project User Guide"
weight: 4300

icon: "/images/docs/docs.svg"
---

In KubeSphere, project users with necessary permissions are able to perform a series of tasks, such as creating different kinds of workloads, configuring volumes, secrets, and ConfigMaps, setting various release strategies, monitoring app metrics, and creating alerting policies. As KubeSphere features great flexibility and compatibility without any code hacking into native Kubernetes, it is very convenient for users to get started with any feature required for their testing, development and production environments.

## Application Workloads

### [Deployments](../project-user-guide/application-workloads/deployments/)

Learn basic concepts of Deployments and how to create Deployments in KubeSphere.

### [StatefulSets](../project-user-guide/application-workloads/statefulsets/)

Learn basic concepts of StatefulSets and how to create StatefulSets in KubeSphere.

### [DaemonSets](../project-user-guide/application-workloads/daemonsets/)

Learn basic concepts of DaemonSets and how to create DaemonSets in KubeSphere.

### [Jobs](../project-user-guide/application-workloads/jobs/)

Learn basic concepts of Jobs and how to create Jobs in KubeSphere.

### [CronJobs](../project-user-guide/application-workloads/cronjob/)

Learn basic concepts of CronJobs and how to create CronJobs in KubeSphere.

### [Services](../project-user-guide/application-workloads/services/)

Learn basic concepts of Services and how to create Services in KubeSphere.

### [Ingress](../project-user-guide/application-workloads/ingress/)

Learn basic concepts of Routes (i.e. Ingress) and how to create Routes in KubeSphere.

### [Container Image Settings](../project-user-guide/application-workloads/container-image-settings/)

Learn different properties on the dashboard in detail as you set container images for your workload.

## Custom Application Monitoring

### [Introduction](../project-user-guide/custom-application-monitoring/introduction/)

Introduce the KubeSphere custom monitoring feature and metric exposing, including exposing methods and ServiceMonitor CRD.

### Get Started

#### [Monitor MySQL](../project-user-guide/custom-application-monitoring/get-started/monitor-mysql/)

Deploy MySQL and MySQL Exporter and create a dashboard to monitor the app.

#### [Monitor Sample Web](../project-user-guide/custom-application-monitoring/get-started/monitor-sample-web/)

Use a Helm chart to deploy a sample web app and create a dashboard to monitor the app.

### Visualization

#### [Overview](../project-user-guide/custom-application-monitoring/visualization/overview/)

Understand the general steps of creating a monitoring dashboard as well as its layout.

#### [Panels](../project-user-guide/custom-application-monitoring/visualization/panel/)

Explore dashboard properties and chart metrics.

#### [Querying](../project-user-guide/custom-application-monitoring/visualization/querying/)

Learn how to specify monitoring metrics.

## Alerting

### [Alerting Policy (Workload Level)](../project-user-guide/alerting/alerting-policy/)

Learn how to set alerting policies for workloads.

### [Alerting Message (Workload Level)](../project-user-guide/alerting/alerting-message/)

Learn how to view alerting policies for workloads.