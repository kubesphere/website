---
title: "KubeSphere-以应用为中心的开源容器平台"
description: "KubeSphere 是在 Kubernetes 之上构建的以应用为中心的开源容器平台，支持部署和运行在任何基础设施之上，帮助企业轻松应对敏捷开发、自动化运维、应用快速交付、微服务治理、多租户管理、监控日志告警、服务与网络管理等业务场景"


css: "scss/index.scss"

section1:
  title: KubeSphere Container Platform
  topic: The Kubernetes Platform, tailored to the hybrid cloud
  content: KubeSphere is a distributed operating system providing cloud native stack with Kubernetes as its kernel, and aims to be plug-and-play architecture for third-party applications seamless integration to boost its ecosystem.
  btnContent1: Install on Kubernetes
  btnContent2: Install on Linux

section2: 
  title: One Platform for full-stack solutions
  content: KubeSphere is also a multi-tenant enterprise-grade container platform with full-stack automated IT operation and streamlined DevOps workflows. It provides developer-friendly wizard web UI, helping enterprises to build out a more robust and feature-rich platform, which includes most common functionalities needed for enterprise Kubernetes strategy.，
  children: 
    - name: Open Source
      icon: /images/home/open-source.svg
      content: A CNCF certified Kubernetes platform, 100% open source, built and improved by the community

    - name: Easy to Run
      icon: /images/home/easy-to-run.svg
      content: Can be deployed on a Kubernetes cluster or Linux machines, supports online and air-gapped installation

    - name: Feature-rich
      icon: /images/home/feature-rich.svg
      content: Delivers DevOps, service mesh, observability, application management, multi-tenancy, storage and networking management in an unified platform

    - name: Modular & Pluggable
      icon: /images/home/modular-pluggable.svg
      content: These functionalities are loosely coupled with the platform since they are pluggable and optional. Other tools are easy to integrate and play



section3:
  title: Benefits to different teams
  content: Multi-tenancy makes different teams to securely deploy and maintain containerized applications from the cloud to the edge.  It allows developers to deploy code via several clicks on intuitive console, brings centralized observability and powerful DevOps strategy for Ops team, helps Infra team to install and maintain Kubernetes cluster with flexible network and solution solutions, avoid locking team in to a single vendor eco-system.
  children:
    - name: Infra Team
      content: Building one-stop enterprise-grade DevOps framework
      icon: /images/home/7.svg
      children:
        - content: Improve your environment utilization and reduce internal infrastructure costs
        - content: Support multi-cluster and multi-cloud Kubernetes management, avoiding vendor lock-in
        - content: Provides security enhancements, supports multiple storage and network solutions
        - content: Fully trusted, delivers a certified Kubernetes platform and distribution

    - name: Developers
      content: Focus on your bussiness, others are run in automated tools
      icon: /images/home/74.png
      children:
        - content: Smooth user experience, reduce the learning curve of the cloud native stack
        - content: Provide toolkits and deployment automation tailored to any application environment
        - content: Out-of-box logging, monitoring and multi-tenancy, improving development efficiency
        - content: Support application lifecycle management, accelerating time to market

    - name: Ops Team
      content: Building one-stop enterprise-grade DevOps framework
      icon: /images/home/71.svg
      children:
        - content: Centralized log collection, monitoring and alerting from infrastructure to applications.
        - content: Streamlined continuous deploy, test, release, upgrade and scale
        - content: Better track, route and optimize communications within Kubernetes for cloud native apps
        - content: Easy-to-use web terminal and graphical panel, satisfying the habits of different users 

section4:
  title: Key Features
  content: If you want to use an open source project, but act like a commercial product, KubeSphere is your choice. The Roadmap listed the planning features, you can raise a proposal to submit your ideas with us.
  children:
    - name: Provisioning Kubernetes 
      icon: /images/home/provisioning-kubernetes.svg
      content: Deploy Kubernetes on any infrastructure out of box, including online and air-gapped installation, support add GPU node 

    - name: K8s Resource Management
      icon: /images/home/k-8-s-resource-management.svg
      content: Provide web console for creating and managing Kubernetes resources, with powerful observability

    - name: Multi-tenant Management 
      icon: /images/home/multi-tenant-management.svg
      content: Provide unified authentication with fine-grained roles and three-tier authorization system, supports AD/LDAP authentication
  
  features:
    - name: Application Store 
      icon: /images/home/store.svg
      content: Provide application store for Helm-based applications, and offers application lifecycle management
      color: grape

    - name: Service Mesh (Istio-based)
      icon: /images/home/service.svg
      content: Provide fine-grained traffic management, observability and tracing, and offers visualization for traffic topology 
      color: red

    - name: Rich Observability
      icon: /images/home/rich.svg
      content: Multi-dimensional monitoring metrics, multi-tenant log query and collection, support alerting and notification
      color: green

    - name: DevOps System
      icon: /images/home/dev-ops.svg
      content: Out-of-box CI/CD based on Jenkins, and offers automated workflow tools including S2I & B2I
      color: orange

    - name: Multiple Storage Solutions
      icon: /images/home/multiple.svg
      content: Support GlusterFS, CephRBD, NFS, LocalPV solutions, provide CSI plugins to consume storage from multiple cloud providers
      color: grape

    - name: Multiple Network Solutions 
      icon: /images/home/network.svg
      content: Support Calico and Flannel, provides load balancer plug-in Porter for Kubernetes installed on physical machines
      color: green

    - name: Multi-cluster management 
      icon: /images/home/management.svg
      content: Distribute applications across multiple clusters and cloud providers, and provides the disaster recovery and cross-cluster discovery.
      color: orange

section5:
  title: KubeSphere with its cloud native architecture
  frontEnd:
    title: Front end
    project: KubeSphere Console
    children:
      - icon: /images/home/mobx.jpg
      - icon: /images/home/koa.jpg
      - icon: /images/home/react.png

  backEnd:
    title: Back end （REST API）
    project: KubeSphere System
    group:
      - name: API Server
      - name: API Gateway
      - name: Controller Manager
      - name: Account Service
    

section6:
  title: Who uses KubeSphere
  content: The Case Studies listed more detailed user cases and their cloud native transformation stories. </br>Various enterprises and organizations use KubeSphere Container Platform for research, production and commercial products.
  children:
    - icon: /images/home/section6-1.jpg
    - icon: /images/home/section6-2.jpg
    - icon: /images/home/section6-3.jpg
    - icon: /images/home/section6-4.jpg
    - icon: /images/home/section6-5.jpg
    - icon: /images/home/section6-6.jpg
    - icon: /images/home/section6-7.jpg
    - icon: /images/home/section6-8.jpg
    - icon: /images/home/section6-9.jpg
    - icon: /images/home/section6-10.jpg
  btnContent: Case Studies
  btnLink:
  link:
  linkContent: Want your logo up there? Just submit a pull request →
  image: /images/home/certification.jpg
---