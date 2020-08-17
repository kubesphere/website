---
title: "Features and Benefits"
keywords: "kubesphere, kubernetes, docker, helm, jenkins, istio, prometheus"
description: "The document describes the features and benefits of KubeSphere"

linkTitle: "Features"
weight: 1200
---

## Overview

As an open source container platform, KubeSphere provides enterprises with a robust, secure and feature-rich platform, including most common functionalities needed for enterprise adopting Kubernetes, such as workload management, Service Mesh (Istio-based), DevOps projects (CI/CD), Source to Image and Binary to Image, multi-tenancy management, multi-dimensional monitoring, log query and collection, alerting and notification, service and network management, application management, infrastructure management, image registry management, application management. It also supports various open source storage and network solutions, as well as cloud storage services. Meanwhile, KubeSphere provides an easy-to-use web console to ease the learning curve and drive the adoption of Kubernetes.

![Overview](https://pek3b.qingstor.com/kubesphere-docs/png/20200202153355.png)

The following modules elaborate the key features and benefits provided by KubeSphere container platform.

## Provisioning and Maintaining Kubernetes

### Provisioning Kubernetes Cluster

KubeSphere Installer allows you to deploy Kubernetes on your infrastructure out of box, provisioning Kubernetes cluster with high availability. It is recommended that at least three master nodes are configured behind a load balancer for production environment.

### Kubernetes Resource Management

KubeSphere provides graphical interface for creating and managing Kubernetes resources, including Pods and Containers, Workloads, Secrets and ConfigMaps, Services and Ingress, Jobs and CronJobs, HPA, etc. As well as powerful observability including resources monitoring, events, logging, alerting and notification.

### Cluster Upgrade and Scaling

KubeSphere Installer provides ease of setup, installation, management and maintenance. Moreover, it supports rolling upgrades of Kubernetes clusters so that the cluster service is always available while being upgraded. Additionally, it provides the ability to roll back to previous stable version in case of failure. Also, you can add new nodes to a Kubernetes cluster in order to support more workloads by using KubeSphere Installer.

## DevOps Support

KubeSphere provides pluggable DevOps component based on popular CI/CD tools such as Jenkins, and offers automated workflow and tools including binary-to-image (B2I) and source-to-image (S2I) to get source code or binary artifacts into ready-to-run container images. The following are the detailed description of CI/CD pipeline, S2I and B2I.

![DevOps](https://pek3b.qingstor.com/kubesphere-docs/png/20200202220455.png)

### CI/CD Pipeline

- CI/CD pipelines and build strategies are based on Jenkins, which streamlines the creation and automation of development, test and production process, and supports dependency cache to accelerate build and deployment.
- Ship out-of-box Jenkins build strategy and client plugin to create a Jenkins pipeline based on Git repository/SVN. You can define any step and stage in your built-in Jenkinsfile.
- Design a visualized control panel to create CI/CD pipelines, and deliver complete visibility to simplify user interaction.
- Integrate source code quality analysis, also support output and collect logs of each step.

### Source to Image

Source-to-Image (S2I) is a toolkit and automated workflow for building reproducible container images from source code. S2I produces ready-to-run images by injecting source code into a container image and making the container ready to execute from source code.

S2I allows you to publish your service to Kubernetes without writing Dockerfile. You just need to provide source code repository address, and specify the target image registry. All configurations will be stored as different resources in Kubernetes. Your service will be automatically published to Kubernetes, and the image will be pushed to target registry as well.

![S2I](https://pek3b.qingstor.com/kubesphere-docs/png/20200204131749.png)

### Binary to Image

As similar as S2I, Binary to Image (B2I) is a toolkit and automated workflow for building reproducible container images from binary (e.g. Jar, War, Binary package).

You just need to upload your application binary package, and specify the image registry to which you want to push. The rest is exactly same as S2I.

## Istio-based Service Mesh

KubeSphere service mesh is composed of a set of ecosystem projects, including Istio, Envoy and Jaeger, etc. We  design a unified user interface to use and manage these tools. Most features are out-of-box and have been designed from developer's perspective, which means KubeSphere can help you to reduce the learning curve since you do not need to deep dive into those tools individually.

KubeSphere service mesh provides fine-grained traffic management, observability, tracing, and service identity and security for a distributed microservice application, so the developer can focus on core business. With a service mesh management on KubeSphere, users can better track, route and optimize communications within Kubernetes for cloud native apps.

### Traffic Management

- **Canary release** provides canary rollouts, and staged rollouts with percentage-based traffic splits.
- **Blue-green deployment** allows the new version of the application to be deployed in the green environment and tested for functionality and performance. Once the testing results are successful, application traffic is routed from blue to green. Green then becomes the new production.
- **Traffic mirroring** enables teams to bring changes to production with as little risk as possible. Mirroring sends a copy of live traffic to a mirrored service.
- **Circuit breakers** allows users to set limits for calls to individual hosts within a service, such as the number of concurrent connections or how many times calls to this host have failed.

### Visualization

KubeSphere service mesh has the ability to visualize the connections between microservices and the topology of how they interconnect. As we know, observability is extremely useful in understanding cloud-native microservice interconnections.

### Distributed Tracing

Based on Jaeger, KubeSphere service mesh enables users to track how each service interacts with other services. It brings a deeper understanding about request latency, bottlenecks, serialization and parallelism via visualization.

## Multi-tenant Management

- Multi-tenancy: provides unified authentication with fine-grained roles and three-tier authorization system.
- Unified authentication: supports docking to a central enterprise authentication system that is LDAP/AD based protocol. And supports single sign-on (SSO) to achieve unified authentication of tenant identity.
- Authorization system: It is organized into three levels, namely, cluster, workspace and project. We ensure the resource sharing as well as isolation among different roles at multiple levels to fully guarantee resource security.

## Multi-dimensional Monitoring

- Monitoring system is fully visualized, and provides open standard APIs for enterprises to integrate their existing operating platforms such as alerting, monitoring, logging etc. in order to have a unified system for their daily operating work.
- Comprehensive and second-level precision monitoring metrics.
	- In the aspect of infrastructure monitoring, the system provides many metrics including CPU utilization, memory utilization, CPU load average, disk usage, inode utilization, disk throughput, IOPS, network interface outbound/inbound rate, Pod status, ETCD service status, API Server status, etc.
	- In the aspect of application resources, the system provides five monitoring metrics, i.e., CPU utilization, memory consumption, the number of Pods of applications, network outbound/inbound rate of an application. Besides, it supports sorting according to resource consumption, user-defined time range query and quickly locating the place where exception happens.
- Provide resource usage ranking by node, workspace and project.
- Provide service component monitoring for user to quickly locate component failures.

## Alerting and Notification System

- Provide rich alerting rules based on multi-tenancy and multi-dimensional monitoring metrics. Currently, the system supports two types of alerting. One is infrastructure alerting for cluster administrator. The other one is workload alerting for tenants.
- Flexible alerting policy: You can customize an alerting policy that contains multiple alerting rules, and you can specify notification rules and repeat alerting rules.
- Rich monitoring metrics for alerting: Provide alerting for infrastructure and workloads.
- Flexible alerting rules: You can customize the detection period, duration and alerting level of monitoring metrics.
- Flexible notification rules: You can customize the notification delivery period and receiver list. Mail notification is currently supported.
- Custom repeat alerting rules: Support to set the repeat alerting cycle, maximum repeat times, and the alerting level.

## Log Query and Collection

- Provide multi-tenant log management. In KubeSphere log search system, different tenants can only see their own log information.
- Contain multi-level log queries (project/workload/container group/container and keywords) as well as flexible and convenient log collection configuration options.
- Support multiple log collection platforms such as Elasticsearch, Kafka, Fluentd.

## Application Management and Orchestration

- Use open source [OpenPitrix](https://github.com/openpitrix/openpitrix) to set up app store and app repository services which provides full lifecycle of application management.
- Users can easily deploy an application from templates with one click.

## Infrastructure Management

Support storage management, host management and monitoring, resource quota management, image registry management, authorization management.

## Multiple Storage Solutions Support

- Support GlusterFS, CephRBD, NFS, etc., open source storage solutions.
- Provide NeonSAN CSI plug-in to connect QingStor NeonSAN service to meet core business requirements, i.e., low latency, strong resilient, high performance.
- Provide QingCloud CSI plug-in that accesses QingCloud block storage services.

## Multiple Network Solutions Support

- Support Calico, Flannel, etc., open source network solutions.
- A bare metal load balancer plug-in [Porter](https://github.com/kubesphere/porter) for Kubernetes installed on physical machines.
