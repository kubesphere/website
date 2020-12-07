---
title: "Glossary"
keywords: 'kubernetes, kubesphere, devops, docker, helm, jenkins, istio, prometheus'
description: 'KubeSphere Glossary documentation'


weight: 17200
---

This glossary includes technical terms that are specific to KubeSphere, as well as more general terms that provide useful context.

## General

- **Workspace** <br>
    A logical unit to organize a tenant's workload projects / Kubernetes namespaces, DevOps projects, manage resource access and share information within the team.

- **System Workspace** <br>
    The special place to organize system projects from KubeSphere, Kubernetes and optional components such as OpenPitrix, Istio, monitorng etc.

- **Workspace member** <br>
    The users that are invited into the workspace who have certain priviledge to work in the workspace.

- **Project** <br>
    A project in KubeSphere is a Kubernetes namespace

- **Multi-cluster Project** <br>
    A project whose workload is deployed into multiple clusters.

- **Project memeber** <br>
    The users that are invited into the project who have certain priviledge to access the project.

- **Workbench** <br>
    The landing page for a tenant where contains authorized resources to access including workspaces, App Store, etc.

- **Volume** <br>
    A KubeSphere Volume is a Kubernetes Persistent Volume Claim (PVC)

- **Public Cluster** <br>
    Platform admin can set the cluster visibility, meaning who can access the cluster. A public cluster means all platform users can access the cluster, in which they are able to create and schedule resources.

- **KubeKey** <br>
    A brand-new installation tool developed in Go. It can install KubeSphere and Kubernetes separately or install them at one time.

- **ks-installer** <br>
    The package to deploy KubeSphere on existing Kubernetes clusters.

## Application

- **OpenPitirx** <br>
    An open-source system to package, deploy and manage different types of apps.

- **App Template** <br>
    A template for a specific application that other users can deploy new application instances based on the template.

- **App Repo** <br>
    A web accessible repo that hosts a bunch of application templates.

- **App Store** <br>
    A public place for different users to share various applications.

## DevOps

- **DevOps Project** <br>
    A project specific for DevOps where you can manage your pipelines and related information.

- **SCM** <br>
    Source Control Management, such as GitHub, Gitlab, etc.

- **In-SCM** <br>
    The pipeline based on a Jenkinsfile that is hosted in SCM.

- **Out-of-SCM** <br>
    The pipeline created by using graphical editing panel, which means no Jenkinsfile needed.

- **CI Node** <br>
    The specific node for pipeline or S2I, B2I. Generally, applications often need to pull a lot of dependencies during the build process. It might cause some issues like long pulling time, or unstable network causing failure. In order to make build robust, and to speed up the build by using cache, we recommend you configure one or a set of CI nodes which the system schedules the task of CI/CD pipelines or S2I/B2I builds running on.

- **B2I** <br>
    Binary to Image. As similar as S2I, B2I is a toolkit and automated workflow for building reproducible container images from binary (e.g. Jar, War, Binary package).

## Logging, Events and Auditing

- **Exact Query** <br>
    The query method that exactly matches the keywords you type to search

- **Fuzzy Query** <br>
    The query method that partially matches the keywords you type to search

- **Audit Policy** <br>
    Audit Policy defines a set of rules about what events should be recorded and what data they should include.

- **Audit Rule** <br>
    An auditing rule defines how to process auditing logs.

- **Audit Webhook** <br>
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

- **Disk Log Collection** <br>
    The capability to collect disk logs in a container and export to stdout, which will then be collected by the system log collector.

- **Notification Receiver** <br>
    The channel to receive notification, such as email, wechat work, slack, webhook, etc.

## Router

- **Route** <br>
    A KubeSphere Route is a Kubernetes Ingress.

- **Gateway** <br>
    Before creating a route, you need to enable the Internet access gateway which forwards the request to the corresponding backend service.

## Service Mesh

- **Canary Release** <br>
    A graceful applicaiton release method that introduces a new version of a service and test it by sending a small percentage of traffic to it. At the same time, the old version is responsible for handling the rest of the traffic. If everything goes well, you can gradually increase the traffic sent to the new version, while simultaneously phasing out the old version. In the case of any occurring issues, it allows you to roll back to the previous version as you change the traffic percentage.

- **Blue Green Release** <br>
   A zero downtime application deployment in that the new version can be deployed with the old one preserved. At any time, only one of the versions is active serving all the traffic, while the other one remains idle. If there is a problem with running, you can quickly roll back to the old version.

- **Traffic Mirroring** <br>
    A risk-free method of testing your app versions as it sends a copy of live traffic to a service that is being mirrored. It is also called shadowing.

- **Application Governance** <br>
    A switch to control the tracing of your application within a project.

## Multi Cluster

- **Host Cluster** <br>
    The cluster used to manage member clusters. The multi-cluster control plane is deployed on the host cluster.

- **Member Cluster** <br>
    A cluster as a member of the group of the multiple clusters.

- **Direct Connection** <br>
    The connection method between host cluster and member cluster when the kube-apiserver address of the member cluster is accessible on any node of the host cluster.

- **Agent Connection** <br>
    The connection method between host cluster and member cluster when the host cluster cannot access the member cluster.

- **jwtSecret** <br>
    The secret needed for host cluster and member cluster to communicate with each other.

- **Tower** <br>
    When using agent connection, there is a proxy component installed on host cluster and agent installed on member cluster. A tower consists of the proxy and the agent.

- **Proxy Service Address** <br>
    The communication service address of the host cluster required by the tower agent in member cluster when using agent connection.
