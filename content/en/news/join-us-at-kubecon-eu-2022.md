---
title: 'Kubesphere Team will join the KubeCon Europe 2022 and bring 3 sessions'
keywords: KubeCon, CloudNativeCon, Kubernetes
description: KubeSphere brings 3 sessions in KubeCon Europe 2022
createTime: '2022-03-16'
author: 'Feynman Zhou'
---

![kubecon-eu-banner](/images/news/kubecon-eu/kubecon-eu-2022-banner.png)

Every year, the Cloud-Native Computing Foundation organizes its flagship conference KubeCon and CloudNativeCon, which gathers DevOps, SRE, developers, and technologists to meet leading open source and Cloud-Native communities. This year, KubeCon and CloudNativeCon Europe are just around the corner! KubeSphere Team will bring 3 sessions in KubeCon EU and its co-related event FluentCon in this conference. You can join virtually from 16-20 May 2022. 

## Session 1: Empower Autonomous Driving with Cloud Native Serverless Technologies

### Abstract

For an Autonomous-Driving platform, the complex use cases and numerous modules pose huge challenges to the entire architecture. Taking data-archiving as an example, large amounts of time-sensitive data are generated in the vehicle and cloud every second, scattering in various devices and clusters. Challenges like multi-types of storage media, non-uniform data size, mixed asynchronous operations, steep resource overhead curves all prompt for a more flexible, elastic, and cost-saving architecture.

In this talk, UISEE developers and OpenFunction maintainers will talk about the following topics: 

- Why does Autonomous-Driving need a modern FaaS platform powered by Dapr, Keda, and Knative? 
- Cloud Native FaaS Platform OpenFunction Intro. 
- Why is an asynchronous function a good fit for Autonomous-Driving? 
- How does UISEE use the Asynchronous functions in Autonomous-Driving? 
- The benefits that a modern FaaS platform brings to Autonomous-Driving. 
- OpenFunction updates & roadmap.

### Speakers

**Benjamin Huo - Senior Architect at QingCloud** 

[Benjamin Huo](https://kccnceu2022.sched.com/speaker/benjaminhuo) leads the KubeSphere Observability and Serverless team. He is the creator of FluentBit Operator and the founder of the FaaS project [OpenFunction](https://github.com/OpenFunction/OpenFunction). He is also the author and architect of several observability open source projects such as Kube-Events, Notification Manager, etc. He loves cloud-native and open source technologies and is the contributor of KEDA, Prometheus Operator, Thanos, Loki, Falco.

**Xiuming Lu - Architect of UISEE**

[Xiuming Lu](https://kccnceu2022.sched.com/speaker/xiuming.lu) is the architect of UISEE who is responsible for system architecture and DevOps of the cloud platform in the autonomous-driving industry. He is experienced in cloud native FaaS and observability areas.

## Session 2: Fluent Operator Intro and Deep Dive

**Please note: this session will be hosted as a workshop at FluentCon**
### Abstract

With the support of Fluentd, the original Fluent Bit Operator has been renamed to Fluent Operator. In this session, Fluent Operator maintainers will elaborate on the key features of Fluent Operator as well as its design principles and architecture,  including:

1. From Fluent Bit Operator to Fluent Operator.
2. Fluent Operator design principles.
3. Fluent Operator Architecture.
4. Use Fluent Bit as a light-weight logging agent on Kubernetes.
5. Use Fluentd as a global log forwarding & aggregation layer on Kubernetes.
6. Build a flexible and multi-tenant log processing pipeline for Kubernetes with Fluent Bit and Fluentd.
7. Demo.
8. Community & Roadmap.

### Speakers

**Benjamin Huo - Senior Architect at QingCloud** 

Benjamin Huo led the KubeSphere Observability and Serverless team. He is the creator of FluentBit Operator and the founder of the FaaS project [OpenFunction](https://github.com/OpenFunction/OpenFunction), also the author and architect of several observability open source projects such as Kube-Events, Notification Manager, etc. He loves cloud-native and open source technologies and is the contributor of Prometheus.

**Han Zhu - Senior Software Engineer at QingCloud**

Han is a Fluent operator maintainer and a member of KubeSphere and OpenFunction. He is also a KubeEdge contributor. Han is interested in open source and cloud-native technologies in DevOps, Observability, Serverless, Edge computing areas.

## Session 3: Build a Cloud Native Logging Pipeline on the Edge with Fluent Operator

### Abstract

Fluent Operator, formerly known as Fluentbit Operator, provides great flexibility in building a logging layer based on Fluent Bit and Fluentd. It was created by the KubeSphere community to solve the following problems: 

1. Collect K8s logs through a light-weighted agent like Fluent Bit 
2. Control Fluent Bit via Kubernetes API 
3. Update configuration without rebooting Fluent Bit and Fluentd pods
4. Multi-tenant log isolation
5. Deploy and destroy Fluent Bit DaemonSet and Fluentd StatefulSet automatically.

Fluent Operator has reached its maturity level gradually and released v1.0.0-rc.0, with Fluentd and new plugins supported. It has become the subproject of the Fluent community for several months.  

In this talk, Feynman Zhou will talk about the architecture and new design of Fluent Operator, and demonstrate how to use Fluent Operator on K3s to process logs for the edge and IoT scenarios.

### Speaker

**Feynman Zhou - Senior Community Manager at QingCloud**

[Feynman Zhou](https://kccnceu2022.sched.com/feynman1) is a senior community manager at QingCloud. He is growing and maintaining the KubeSphere community (kubesphere.io), which helps users to widely adopt Kubernetes and reduce the learning curve of using cloud-native technologies. 

Feynman is also a CNCF and CDF ambassador, Fluent member, and InfoQ editor. He is passionate about technical evangelism and outreach. He launched and organized the first-ever Kubernetes Community Days China in 2021.

