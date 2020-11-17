---
title: "Project User Guide"
description: "Help you to better manage resources in a KubeSphere project"
layout: "single"

linkTitle: "Project User Guide"
weight: 4300

icon: "/images/docs/docs.svg"
---

In KubeSphere, project users with necessary permissions are able to perform a series of tasks, such as creating different kinds of workloads, configuring volumes, secrets, and ConfigMaps, setting various release strategies, monitoring app metrics, and creating alerting policies. As KubeSphere features great flexibility and compatibility without any code hacking into native Kubernetes, it is very convenient for users to get started with any feature required for their testing, development and production environments.

## Application

### [Deploy Applications from App Store](../project-user-guide/application/deploy-app-from-appstore/)

Learn how to deploy an application from the app store.

### [Deploy Applications from App Template](../project-user-guide/application/deploy-app-from-template/)

Learn how to deploy an application from an Helm-based template.

### [Deploy Applications from Repository](../project-user-guide/application/deploy-app-from-repo/)

Learn how to deploy an application from a repository.

### [Compose a Microservice Application](../project-user-guide/application/compose-app/)

Learn how to compose a mcroservice-based application from scratch.

## Application Workloads

### [Deployments](../project-user-guide/application-workloads/deployments/)

Learn basic concepts of Deployments and how to create Deployments in KubeSphere.

### [StatefulSets](../project-user-guide/application-workloads/statefulsets/)

Learn basic concepts of StatefulSets and how to create StatefulSets in KubeSphere.

### [DaemonSets](../project-user-guide/application-workloads/daemonsets/)

Learn basic concepts of DaemonSets and how to create DaemonSets in KubeSphere.

### [Services](../project-user-guide/application-workloads/services/)

Learn basic concepts of Services and how to create Services in KubeSphere.

### [Jobs](../project-user-guide/application-workloads/jobs/)

Learn basic concepts of Jobs and how to create Jobs in KubeSphere.

### [CronJobs](../project-user-guide/application-workloads/cronjob/)

Learn basic concepts of CronJobs and how to create CronJobs in KubeSphere.

### [Routes](../project-user-guide/application-workloads/ingress/)

Learn basic concepts of Routes (i.e. Ingress) and how to create Routes in KubeSphere.

### [Container Image Settings](../project-user-guide/application-workloads/container-image-settings/)

Learn different properties on the dashboard in detail as you set container images for your workload.

## ConfigMap and Secrets

### [ConfigMaps](../project-user-guide/configuration/configmaps/)

Introduce the steps to create configmap in KubeSphere.

### [Secrets](../project-user-guide/configuration/secrets/)

Learn how to manage secret in KubeSphere.

### [Image Registry](../project-user-guide/configuration/image-registry/)

Learn how to create an image registry in KubeSphere.

## Custom Application Monitoring

### [Introduction](../project-user-guide/custom-application-monitoring/introduction/)

Introduce the KubeSphere custom monitoring feature and metric exposing, including exposing methods and ServiceMonitor CRD.

### Examples

#### [Monitor MySQL](../project-user-guide/custom-application-monitoring/examples/monitor-mysql/)

Deploy MySQL and MySQL Exporter and create a dashboard to monitor the app.

#### [Monitor Sample Web](../project-user-guide/custom-application-monitoring/examples/monitor-sample-web/)

Use a Helm chart to deploy a sample web app and create a dashboard to monitor the app.

### Visualization

#### [Overview](../project-user-guide/custom-application-monitoring/visualization/overview/)

Understand the general steps of creating a monitoring dashboard as well as its layout.

#### [Panels](../project-user-guide/custom-application-monitoring/visualization/panel/)

Explore dashboard properties and chart metrics.

#### [Querying](../project-user-guide/custom-application-monitoring/visualization/querying/)

Learn how to specify monitoring metrics.

## Grayscale Release

### [Overview](../project-user-guide/grayscale-release/overview/)

Understand the basic concept of grayscale release.

### [Blue-green Deployment](../project-user-guide/grayscale-release/blue-green-deployment/)

Learn how to release a blue-green deployment in KubeSphere.

### [Canary Release](../project-user-guide/grayscale-release/canary-release/)

Learn how to rolling deploy a canary service in KubeSphere.

### [Traffic Mirroring](../project-user-guide/grayscale-release/traffic-mirroring/)

Learn how to conduct a traffic mirroring job in KubeSphere.

## Volume Management

### [Volumes](../project-user-guide/storage/volumes/)

Learn how to create, edit, attach a volume in KubeSphere.

### [Volume Snapshots](../project-user-guide/storage/volume-snapshots/)

Learn how to manage a snapshot of a persistent volume in KubeSphere.

## Alerting

### [Alerting Policy (Workload Level)](../project-user-guide/alerting/alerting-policy/)

Learn how to set alerting policies for workloads.

### [Alerting Message (Workload Level)](../project-user-guide/alerting/alerting-message/)

Learn how to view alerting policies for workloads.