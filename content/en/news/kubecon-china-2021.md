---
title: 'KubeSphere Team will join the KueCon China and bring 5 sessions'
keywords: KubeCon, Meetup, Kubernetes
description: KubeSphere brings 4 sessions and participte 1 office hour in KubeCon China2021
createTime: '2021-12-09'
author: 'Feynman, Lindsay'
---
# KubeSphere Team will join the KubeCon China and bring 5 sessions

Every year, the Cloud-Native Computing Foundation organizes its flagship conference KubeCon and CloudNativeCon, which gathers DevOps, SRE, developers, and technologists to meet leading open source and Cloud-Native communities. This year, KubeCon and CloudNativeCon China are coming! KubeSphere Team will bring 4 sessions and participate 1 office hours in this conference, you can join virtually from 9-10 December 2021. 

## Session 1: Kubernetes Multi-cluster and Multi-tenancy Management with RBAC and KubeFed

## Abstract

Soft multi-tenancy is a form of multi-tenancy that does not have strict isolation of the different users, workloads, or applications. When it comes to Kubernetes, soft multi-tenancy is usually isolated by RBAC and namespaces. There are many challenges when cluster administrators implement multi-tenancy across multiple Kubernetes clusters, such as authentication and authorization, resource quota, network policy, security policy, etc. 

In this talk, KubeSphere maintainers will share their experience and best practice in designing the multi-tenancy architecture: how to manage users and authentication across multiple clusters, how to manage resource quotas for tenants in different clusters, the resource isolation mechanism, and how to authorize resources across multiple clusters.

## Speaker
![Wan-hongming](/images/news/kubecon-china-2021/Wan-hongming.png)
Hongming Wan - Senior Software Engineer, QingCloud Technologies.

Hongming is the core contributor of KubeSphere, and leads the KubeSphere Multi-tenancy and Security team. He focuses on open source and cloud-native security areas.

## Session 2: Ship Apps to Multi-cluster Environments from an App-centric Abstraction

## Abstract

Many application definitions and frameworks are emerging from the CNCF landscape. Helm Chart and Operator are the most popular ways to package and manage applications in the Kubernetes ecosystem. From the CNCF Survey 2020, the enterprise architecture represented by multi-cluster and multi-cloud has been a new trend in modern infrastructure. How can we leverage the app-centric concepts to provide self-service to deliver/deploy applications across multiple Kubernetes clusters and clouds? KubeSphere Team is building a unified control plane to enable users to deliver applications and cloud functions with a consistent workflow. In this talk, KubeSphere maintainers will talk about:

- Uncomplicating the Helm Chart and Operator deployment using CRD
- How to propagate a cloud native application across multiple clouds
- How to manage Operator and its CRD across multiple clouds
- How to extend your operator in an elegant interface

## Speaker
![Lai-zhengyi](/images/news/kubecon-china-2021/Lai-zhengyi.png)
Zhengyi Lai - KubeSphere Dev Lead, QingCloud Technologies

Zhengyi Lai is the maintainer of the KubeSphere. He has contributed to helm, virtual-kubelet, grpc-gateway, etc. Zhengyi is also maintaining the application store, network, and pluggable architecture in KubeSphere. His main work focuses on networking, multi-clustering, application delivery and cloud-native technologies such as Artifact Hub.

## Session 3: Build a modern FaaS platform with Cloud Native Serverless technologies

## Abstract

As the core of Serverless, FaaS (Function-as-a-Service) has gained more and more attention. The emerging cloud native serverless technologies make it possible to build a robust modern FaaS platform by replacing the key components of a FaaS platform with more powerful cloud native alternatives. In this talk, OpenFunction maintainers will talk about: 

- The key components that make a FaaS platform, including function framework, function build, function serving, and function event management.
- The advantage of the emerging cloud native serverless technologies in each of the key areas of FaaS including Knative Serving, Cloud Native Buildpacks, Shipwright, Tekton, KEDA, and Dapr.
- How to build a powerful modern FaaS platform with these cloud native technologies by the example of OpenFunction
- Why does event management matter for FaaS? 
- Why OpenFunction create its own event management system "OpenFunction Events" when there're already Knative eventing and Argo Events?

## Speaker
![Huo-Binjie](/images/news/kubecon-china-2021/Huo-binjie.png)
Benjamin Huo - Founder of OpenFunction

Benjamin Huo led the KubeSphere Observability and Serverless team. He is the creator of FluentBit Operator and the founder of the FaaS project [OpenFunction]((https://github.com/OpenFunction/OpenFunction)), also the author and architect of several observability open source projects such as Kube-Events, Notification Manager, etc. He loves cloud-native and open source technologies and is the contributor of Prometheus.

![Lei-Wanjun](/images/news/kubecon-china-2021/Lei-Wanjun.png)
Wanjun Lei - KubeSphere Dev Lead, QingCloud Technologies.

Wanjun Lei is the maintainer of OpenFunction and is responsible for developing OpenFunction. He is also the maintainer of FluentBit Operator, and a member of the KubeSphere Observability team, where he is responsible for the development of Notification Manager. He loves cloud native and open source technologies, and is a contributor to fluent bit and nats.

## Session 4: KubeSphere use case sharing in the OpenEBS Office Hours

![openebs-office-hours](/images/news/kubecon-china-2021/Wan-openebs-office-hours.png)
In cloud-based Kubernetes clusters, persistent storage services are usually provided by cloud providers. When enterprises build an on-premise Kubernetes platform or adopt a Kuberntes distribution in production, persistent storage is the biggest challenge. OpenEBS automates the management of storage attached to the Kubernetes worker nodes and allow the storage to be used for dynamically provisioning OpenEBS PVs or Local PVs. KubeSphere is an open source container platform built on Kubernetes, it integrates OpenEBS as the default persistent storage to provide out-of-the-box persistent storage services for users.

In this talk, Feynman Zhou and Stone Shi from KubeSphere Team will introduce how they leverage OpenEBS and Kubernetes to build a container platform and run stateful workloads on it. 


## Session 5: AWS invited KubeSphere Product Manager to speak at the interview

![AWS-Interview](/images/news/kubecon-china-2021/AWS-Interview.png)


## RSVP

https://www.lfasiallc.com/kubecon-cloudnativecon-open-source-summit-china/register/