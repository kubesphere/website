---
title: "Glossary"
keywords: 'Kubernetes, KubeSphere, devops, docker, helm, jenkins, istio, prometheus, glossary'
description: 'The glossary used in KubeSphere.'
linkTitle: "Glossary"
weight: 17100
version: "v3.3"
---

This glossary includes general terms and technical terms that are specific to KubeSphere.

## General

- **Workspace** <br>
    A logical unit to organize a tenant's workload projects (i.e. Kubernetes namespaces) and DevOps projects. It also features access control of different resources and allows team members to share information.
- **System workspace** <br>A special place to organize system projects of KubeSphere, Kubernetes and optional components such as App Store, service mesh and DevOps.
- **Workspace member** <br>The users that are invited to a workspace who have certain permissions to work in the workspace.
- **Project** <br>
    A project in KubeSphere is a Kubernetes namespace.
- **Multi-cluster project** <br>
    A project whose workloads are deployed across multiple clusters.
- **Project member** <br>
    The users that are invited to a project who have certain permissions to work in the project.
- **Workbench** <br>The landing page for a tenant. It displays authorized resources that the tenant can access such as workspaces and projects.
- **Volume** <br>
    A KubeSphere Volume is a Kubernetes PersistentVolumeClaim (PVC).
- **Public cluster** <br>
    Cluster administrators can set cluster visibility so that a cluster is available to certain workspaces. A public cluster means all platform users can access the cluster, in which they are able to create and schedule resources.
- **KubeKey** <br>
    A brand-new installation tool developed in Go. It is able to install KubeSphere and Kubernetes together or install Kubernetes only. It supports the deployment of cloud-native add-ons (YAML or Chart) as it creates a cluster. It can also be used to scale and upgrade a cluster.
- **ks-installer** <br>
    The package to deploy KubeSphere on existing Kubernetes clusters.

## Applications and Workloads

- **OpenPitrix** <br>
    An open-source system to package, deploy and manage different types of apps.

- **App template** <br>
    A template for a specific application that tenants can use to deploy new application instances.

- **App repository** <br>
    A web accessible repository that hosts different app templates.

- **App Store** <br>
    A public place for different tenants to share various applications.
    
- **Deployment** <br>You use a Deployment to describe a desired state. The Kubernetes Deployment controller changes the actual state to the desired state at a controlled rate. In other words, a Deployment runs multiple replicas of an application and replaces any instances if they fail. For more information, see [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/).

- **StatefulSet** <br>A StatefulSet is the workload object used to manage stateful applications, such as MySQL. For more information, see [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).

- **DaemonSet** <br>A DaemonSet ensures that all (or some) nodes run a copy of a Pod, such as Fluentd and Logstash. For more information, see [DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/).

- **Job** <br>A Job creates one or more Pods and ensures that a specified number of them successfully terminate. For more information, see [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/).

- **CronJob** <br>A CronJob creates Jobs on a time-based schedule. A CronJob object is like one line of a crontab (cron table) file. It runs a Job periodically on a given schedule. For more information, see [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/).

- **Service** <br>A Kubernetes Service is an abstraction object which defines a logical set of Pods and a policy by which to access them - sometimes called a microservice. For more information, see [Service](https://kubernetes.io/docs/concepts/services-networking/service/).

## DevOps

- **DevOps project** <br>
    A specific project for DevOps where you manage pipelines and credentials.

- **SCM** <br>
    Source Control Management, such as GitHub and Gitlab.

- **In-SCM** <br>
    The pipeline based on a Jenkinsfile that is hosted in SCM.

- **Out-of-SCM** <br>
    The pipeline created through graphical editing panels without a Jenkinsfile.

- **CI node** <br>
    A specific node for pipelines, S2I jobs or B2I jobs. Generally, applications often need to pull various dependencies during the building process. It might cause some issues like long pulling time, or unstable network causing failure. To build robust pipelines and speed up the building by using caches, you configure one or a set of CI nodes to which KubeSphere schedules the tasks of CI/CD pipelines and S2I/B2I.

- **B2I** <br>
    Binary-to-Image. B2I is a toolkit and workflow for building reproducible container images from binary executables such as Jar, War, and binary packages.
    
- **S2I** <br>Source-to-Image. S2I is a toolkit and workflow for building reproducible container images from source code. S2I produces ready-to-run images by injecting source code into a container image and letting the container prepare that source code for execution.
  

## Logging, Events and Auditing

- **Exact query** <br>
    The method to search results that perfectly match the keyword entered.

- **Fuzzy query** <br>The method to search results that partially match the keyword entered.
  
- **Audit policy** <br>An audit policy defines a set of rules about what events should be recorded and what data they should include.
  
- **Audit rule** <br>
    An auditing rule defines how to process auditing logs.

- **Audit webhook** <br>
    The webhook that the Kubernetes auditing logs will be sent to.

## Monitoring, Alert and Notification

- **Cluster Status Monitoring** <br>
    The monitoring of related metrics such as node status, component status, CPU, memory, network, and disk of the cluster.

- **Application Resource Monitoring** <br>
    The monitoring of application resources across the platform, such as the number of projects and DevOps projects, as well as the number of workloads and services of a specific type.

- **Allocated CPU** <br>
    The metric is calculated based on the total CPU requests of Pods, for example, on a node. It represents the amount of CPU reserved for workloads on this node, even if workloads are using fewer CPU resources.

- **Allocated Memory** <br>
    The metric is calculated based on the total memory requests of Pods, for example, on a node. It represents the amount of memory reserved for workloads on this node, even if workloads are using fewer memory resources.

- **Log Collection** <br>
    The Log Collection function allows the system to collect container logs saved on volumes and send the logs to standard output.

- **Notification Receiver** <br>
    The channel to receive notifications, such as email, DingTalk, WeCom, Slack, and webhook.

## Network

- **Route** <br>
    A KubeSphere Route is a Kubernetes Ingress.

- **Gateway** <br>
    Before creating a route, you need to enable the Internet access gateway which forwards requests to the corresponding backend service.

## Service Mesh

- **Canary release** <br>
    A graceful application release method that introduces a new version of a service and tests it by sending a small percentage of traffic to it. At the same time, the old version is responsible for handling the rest of the traffic. If everything goes well, you can gradually increase the traffic sent to the new version, while simultaneously phasing out the old version. In the case of any occurring issues, it allows you to roll back to the previous version as you change the traffic percentage.

- **Blue-green release/deployment** <br>
   A zero downtime application deployment where the new version can be deployed with the old one preserved. At any time, only one of the versions is active serving all the traffic, while the other one remains idle. If there is a problem with running, you can quickly roll back to the old version.

- **Traffic mirroring** <br>
    A risk-free method of testing your app versions as it sends a copy of live traffic to a service that is being mirrored. It is also called shadowing.

- **Application governance** <br>
    A switch to control the tracing of your application within a project.

## Multi-cluster Management

- **Host Cluster** **(H Cluster)** <br>
    The cluster that manages Member Clusters. The multi-cluster control plane is deployed on the Host Cluster.

- **Member Cluster** **(M Cluster)** <br>
    A cluster serving as a member managed by the Host Cluster in a multi-cluster architecture.

- **Direct connection** <br>
    A way to connect the Host Cluster and the Member Cluster when the kube-apiserver address of the Member Cluster is accessible on any node of the Host Cluster.

- **Agent connection** <br>
    A way to connect the Host Cluster and the Member Cluster when the Host Cluster cannot access the Member Cluster directly.

- **jwtSecret** <br>
    The secret needed for the Host Cluster and the Member Cluster to communicate with each other.

- **Tower** <br>
    When you use agent connection, there is a proxy component installed on the Host Cluster and agent installed on the Member Cluster. Tower consists of both the proxy and the agent.

- **Proxy service address** <br>
    The communication service address of the Host Cluster required by the tower agent in the Member Cluster when agent connection is adopted.
