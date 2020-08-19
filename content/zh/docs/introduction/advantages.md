---
title: "Advantages"
keywords: "kubesphere, kubernetes, docker, helm, jenkins, istio, prometheus, service mesh, advantages"
description: "KubeSphere advantages"

weight: 1400
---

## Vision

{{< notice note >}} 
### This is a simple note. 
{{</ notice >}}

{{< notice tip >}} 
This is a simple tip. 
{{</ notice >}}

{{< notice info >}} 
This is a simple info. 
{{</ notice >}}

{{< notice warning >}} 
This is a simple warning. 
{{</ notice >}}

{{< tabs >}}

{{< tab "first" >}} 
### Why KubeSphere
{{</ tab >}}

{{< tab "second" >}} 
```
console.log('test')
```
{{</ tab >}}

{{< tab "third" >}} 
this is third tab 
{{</ tab >}} 

{{</ tabs >}}

KubeSphere is a distributed operating system that provides full stack system services and a pluggable framework for third-party software integration for enterprise-critical containerized workloads running in data center.

Kubernetes has now become the de facto standard for deploying containerized applications at scale in private, public and hybrid cloud environments. However, many people easily get confused when they start to use Kubernetes as it is complicated and has many additional components to manage, some of which need to be installed and deployed by users themselves, such as storage service and network service. At present, Kubernetes only provides open source solutions or projects, which may be difficult to install, maintain and operate to some extent. For users, learning costs and barrier to entry are both high. In a word, it is not easy to get started quickly.

If you want to deploy your cloud-native applications on the cloud, it is a good practice to adopt KubeSphere to help you run Kubernetes since KubeSphere already provides rich and required services for running your applications successfully so that you can focus on your core business. More specifically, KubeSphere provides application lifecycle management, infrastructure management, CI/CD pipeline, service mesh, observability such as monitoring, logging, alerting, events and notification. In another word, Kubernetes is a wonderful open-source platform. KubeSphere steps further to make the container platform more user-friendly and powerful not only to ease the learning curve and drive the adoption of Kubernetes, but also to help users deliver cloud-native applications faster and easier.

## Why KubeSphere

KubeSphere provides high-performance and scalable container service management for enterprise users, It aims to help enterprises accomplish the digital transformation driven by the new generation of Internet technology, and accelerate the speed of iteration and delivery of business to meet the ever-changing business needs of enterprises.

## Awesome User Experience and Wizard UI

- KubeSphere provides user-friendly web console for developing, testing and operating. With the wizard UI, users greatly reduce the learning and operating cost of Kubernetes.
- Users can deploy an enterprise application with one click from template, and use the application lifecycle management service to deliver their products in the console.

## High Reliability and Availability

- Automatic elastic scaling: Deployment is able to scale the number of Pods horizontally, and Pod is able to scale vertically based on observed metrics such as CPU utilization when user requests change, which guarantees applications keep running without crash because of resource pressure.
- Health check service: Supporting visually setting health check probes for containers to ensure the reliability of business.

## Containerized DevOps Delivery

- Easy-to-use pipeline: CI/CD pipeline management is visualized without user configuring, also the system ships many built-in pipeline templates.
- Source to Image (S2I)：Through S2I, users do not need to write Dockerfile. The system can get source code from code repository and build the image automatically, deploy the workload into Kubernetes environment and push it to image registry automatically as well.
- Binary to Image (B2I)：exactly same as S2I except the input is binary artifacts instead of source code which is much useful for developers without Docker skills or legacy applications dockerized.
- End-to-end pipeline configuration: supports end-to-end pipeline configuration from pulling source code from repository such as GitHub, SVN and Git, to compiling code, to packaging image, to scanning image in terms of security, then to pushing image to registry, and to releasing the application.
- Source code quality management: supports static analysis scanning for code quality for the application in DevOps project.
- Logging: Logs all steps of CI/CD pipeline.

## Out-of-Box Microservice Governance

- Flexible micro-service framework: provides visual micro-service governance capabilities based on Istio micro-service framework, and divides Kubernetes services into finer-grained services to support non-intrusive micro-service governance.
- Comprehensive governance services: offers excellent microservice governance such as grayscale releasing, circuit break, traffic monitoring, traffic control, rate limit, tracing, intelligent routing, etc.

## Multiple Persistent Storage Support

- Support GlusterFS, CephRBD, NFS, etc., open source storage solutions.
- Provide NeonSAN CSI plug-in to connect commercial QingStor NeonSAN service to meet core business requirements, i.e., low latency, strong resilient, high performance.
- Provide QingCloud CSI plug-in that accesses commercial QingCloud block storage services.

## Flexible Network Solution Support

- Support open-source network solutions such as Calico and Flannel.
- A bare metal load balancer plug-in [Porter](https://github.com/kubesphere/porter) for Kubernetes installed on physical machines.

## Multi-tenant and Multi-dimensional Monitoring and Logging

- Monitoring system is fully visualized, and provides open standard APIs for enterprises to integrate their existing operating platforms such as alerting, monitoring, logging etc. in order to have a unified system for their daily operating work.
- Multi-dimensional and second-level precision monitoring metrics.
- Provide resource usage ranking by node, workspace and project.
- Provide service component monitoring for user to quickly locate component failures.
- Provide rich alerting rules based on multi-tenancy and multi-dimensional monitoring metrics. Currently, the system supports two types of alerting. One is infrastructure alerting for cluster administrator. The other one is workload alerting for tenants.
- Provide multi-tenant log management. In KubeSphere log search system, different tenants can only see their own log information.
