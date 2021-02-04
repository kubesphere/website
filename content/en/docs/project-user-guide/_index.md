---
title: "Project User Guide"
description: "Help you to better manage resources in a KubeSphere project"
layout: "single"

linkTitle: "Project User Guide"
weight: 10000

icon: "/images/docs/docs.svg"
---

In KubeSphere, project users with necessary permissions are able to perform a series of tasks, such as creating different kinds of workloads, configuring volumes, Secrets, and ConfigMaps, setting various release strategies, monitoring app metrics, and creating alerting policies. As KubeSphere features great flexibility and compatibility without any code hacking into native Kubernetes, it is very convenient for users to get started with any feature required for their testing, development and production environments.

## Applications

### [App Templates](../project-user-guide/application/app-template/)

Understand the concept of app templates and how they can help to deploy applications within enterprises.

### [Deploy Apps from App Templates](../project-user-guide/application/deploy-app-from-template/)

Learn how to deploy an application from a Helm-based template.

### [Deploy Apps from the App Store](../project-user-guide/application/deploy-app-from-appstore/)

Learn how to deploy an application from the App Store.

### [Compose a Microservice App](../project-user-guide/application/compose-app/)

Learn how to compose a microservice-based application from scratch.

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

## Volume Management

### [Volumes](../project-user-guide/storage/volumes/)

Learn how to create, edit, and mount a volume in KubeSphere.

### [Volume Snapshots](../project-user-guide/storage/volume-snapshots/)

Learn how to manage a snapshot of a persistent volume in KubeSphere.

## Configurations

### [Secrets](../project-user-guide/configuration/secrets/)

Learn how to create a Secret in KubeSphere.

### [ConfigMaps](../project-user-guide/configuration/configmaps/)

Learn how to create a ConfigMap in KubeSphere.

### [Image Registries](../project-user-guide/configuration/image-registry/)

Learn how to create an image registry in KubeSphere.

## Grayscale Release

### [Overview](../project-user-guide/grayscale-release/overview/)

Understand the basic concept of grayscale release.

### [Blue-green Deployment](../project-user-guide/grayscale-release/blue-green-deployment/)

Learn how to release a blue-green deployment in KubeSphere.

### [Canary Release](../project-user-guide/grayscale-release/canary-release/)

Learn how to deploy a canary service in KubeSphere.

### [Traffic Mirroring](../project-user-guide/grayscale-release/traffic-mirroring/)

Learn how to conduct a traffic mirroring job in KubeSphere.

## Image Builder

### [Source to Image: Publish an App without a Dockerfile](../project-user-guide/image-builder/source-to-image/)

Use S2I to import a Java sample project in KubeSphere, create an image and publish it to Kubernetes.

### [Binary to Image: Publish an Artifact to Kubernetes](../project-user-guide/image-builder/binary-to-image/)

Use B2I to import an artifact and push it to a target repository.

## Alerting

### [Alerting Policy (Workload Level)](../project-user-guide/alerting/alerting-policy/)

Learn how to set alerting policies for workloads.

### [Alerting Message (Workload Level)](../project-user-guide/alerting/alerting-message/)

Learn how to view alerting policies for workloads.

## Custom Application Monitoring

### [Introduction](../project-user-guide/custom-application-monitoring/introduction/)

Introduce the KubeSphere custom monitoring feature and metric exposing, including exposing methods and ServiceMonitor CRD.

### Examples

#### [Monitor MySQL](../project-user-guide/custom-application-monitoring/examples/monitor-mysql/)

Deploy MySQL and MySQL Exporter and create a dashboard to monitor the app.

#### [Monitor a Sample Web Application](../project-user-guide/custom-application-monitoring/examples/monitor-sample-web/)

Use a Helm chart to deploy a sample web app and create a dashboard to monitor the app.

### Visualization

#### [Overview](../project-user-guide/custom-application-monitoring/visualization/overview/)

Understand the general steps of creating a monitoring dashboard as well as its layout.

#### [Charts](../project-user-guide/custom-application-monitoring/visualization/panel/)

Explore dashboard properties and chart metrics.

#### [Querying](../project-user-guide/custom-application-monitoring/visualization/querying/)

Learn how to specify monitoring metrics.
