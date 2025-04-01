---
title: 'A Container Platform: What is the Value of KubeSphere'
keywords: Kubernetes, KubeSphere, DevOps, Container
description: KubeSphere is a multi-tenant container platform built on Kubernetes with applications at its core. It is capable of full stack IT automated operation and maintenance, streamlining the DevOps workflow for enterprises.
tag: 'KubeSphere, Introduction'
createTime: '2020-04-10'
author: 'Feynman, Ray, Sherlock'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200410130334.png'
---

## A Promising Newcomer

As **a promising newcomer** of the cloud native family, KubeSphere has gained widespread recognition among its users and developers since it joined the open source community nearly two years ago. This article illustrates the position and value of KubeSphere from scratch in a straightforward way and sheds light on why different teams have chosen KubeSphere.

## For Enterprises

KubeSphere is a **multi-tenant** [container platform built on Kubernetes](https://kubesphere.io/) with applications at its core. It is capable of full stack IT automated operation and maintenance, streamlining the DevOps workflow for enterprises. KubeSphere not only helps enterprises quickly establish a Kubernetes cluster in public cloud or private data center, but also provides a set of multi-functional wizard interfaces.

KubeSphere enables enterprises to build a feature-rich container platform equipped with the great flexibility and agile deployment of Kubernetes. The platform also offers outstanding solutions to storage, network and stability, creating the same user experience as IaaS. For example, KubeSphere 2.1.1 supports the integration of Alibaba Cloud and Tencent Cloud block storage plugin. In this version, public cloud storage can be mounted to Pod, providing more stable and persistent storage for stateful applications.

![What does KubeSphere mean for enterprises](https://pek3b.qingstor.com/kubesphere-docs/png/20200410133408.png)

In daily operation, maintenance and development, we might need to utilize and manage a wealth of open source tools, while frequently switching between the GUI and CLI of different tools. Users need to be trained for the installation, usage, operation and maintenance of every single tool, while KubeSphere offers a coordinated solution to the management of all these tools, creating a consistent user experience. That means the production efficiency of development, operation and maintenance teams within an enterprise can be greatly improved as we are freed from multiple threads of execution between control panels and command line terminals of various open source components.

![Unified Management Tool](https://pek3b.qingstor.com/kubesphere-docs/png/20200410133506.png)

## For Developers

KubeSphere is commonly known as "A Cloud Native Melting Pot" to many users. This is understandable as KubeSphere entails a package of solutions. We have designed a complete set of management interface with a unified platform for development, operation and maintenance. As such, users can easily install and manage their most commonly used cloud native tools, enjoying a consistent user experience with lower complexity in their business. Components at the lowest level of Kubernetes feature great flexibility as all of them are pluggable, making it possible for users to install the components based on their needs.

![What does KubeSphere mean for developers](https://pek3b.qingstor.com/kubesphere-docs/png/20200410133832.png)

KubeSphere offers an app store based on OpenPitrix and Helm. Internally, it can be conducive to sharing middleware, big data, APM and business applications among teams within an enterprise, helping developers in rapid application deployment to Kubernetes. Externally, it can serve as a standard app store for the wider industry, underlying the delivery standard, delivery process and application life cycle management for different industry characteristics. It can meet the demand in various business scenarios. Metering will be supported in the 3.x version, enabling enterprises to manage the cost of applications and cluster resources.

![KubeSphere App Store](https://pek3b.qingstor.com/kubesphere-docs/png/20200410133902.png)

## For Operation and Maintenance

Observability represents an essential part of container platforms. In a narrow sense, it mainly entails monitoring, logging and tracking; in a board sense, it includes alerting, events and audit logs. For operation and maintenance staff of Kubernetes, in general, an entire set of observable technical architecture needs to be put in place, such as Prometheus + Grafana + AlertManager and EFK. Besides, enterprises need to provide solutions to multi-tenant isolation in terms of the data they can see, such as monitoring, logging, events and audit logs. That means the cost of operation and maintenance will increase to meet the needs with higher complexity for enterprises.

KubeSphere is capable of quickly creating a set of technical architectures on the basis of Kubernetes for operation and maintenance staff. It meets the standard of cloud native systems for observability. It offers a unified platform for the coordination and management of internal components while also supporting the integration of external ones that already exist. With KubeSphere, multi-dimensional logging and monitoring can be achieved across the levels from the infrastructure to microservices of the container in a set of management interfaces. Abnormal resources can be located as the system drills them down level by level. The need for multi-tenant isolation can also be met. The 3.0 version will see a further improvement in its observability with a better performance in the visual management of events and audit logs.

![What does KubeSphere mean for operation and maintenance](https://pek3b.qingstor.com/kubesphere-docs/png/20200410133938.png)

## For DevOps Teams

A DevOps team is responsible for the operation, maintenance and management of a variety of open source toolchains in its daily work in addition to the development of automation tools. DevOps itself, broadly speaking, represents a methodology while it can also be seen as a culture. As many DevOps teams strive to carry out their work, they may find themselves overwhelmed by excessive CI/CD tools and complex processes while struggling to deal with different personalities and adjust to various environments.

![What does KubeSphere mean for a DevOps team](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134006.png)

We have chosen to empower DevOps to plays its part with KubeSphere as a tool product. The CI/CD pipeline of the KubeSphere DevOps system has been built with Jenkins, which is abundant in plugins. On top of that, Jenkins also provides an enabling environment for extension development, making it possible for the DevOps team to work smoothly across the whole process (developing, testing, building, deploying, monitoring, logging, notifying, etc.) in a unified platform. KubeSphere has created a container-based end-to-end application delivery platform for the DevOps team, with a closed-loop process in place for all segments, including project management, application development, continuous integration, unit testing, artifact generation and application delivery.

![KubeSphere DevOps](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134030.png)

On the basis of Kubernetes, KubeSphere DevOps has taken full advantage of Kubernetes which is dynamically extensible. For example, we use the dynamic agent of Jenkins on Kubernetes in a built-in DevOps system. Namely, dynamic Kubernetes slaves are all used by default. This solution is much more flexible and faster than Jenkins in legacy virtual machines. Besides, agent types that are most used by users are also embedded in KubeSphere DevOps, such as Maven, Node.js and Go. Agent types customized and extended by users are also supported.

![KubeSphere DevOps](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134046.png)

The KubeSphere account can also be used for the built-in Jenkins, meeting the demand of enterprises for multi-tenant isolation of CI/CD pipelines and unified authentication. In addition, KubeSphere DevOps supports two forms of pipelines: InSCM and OutOfSCM. This has created great compatibility with the existing Jenkinsfile and editing pipelines graphically has been made much easier.

Business developers can use built-in automation CD tools in KubeSphere (e.g. Binary to Image and Source to Image) even without a thorough understanding of how Docker and Kubernetes work. Users only need to submit a registry address or upload binary files (e.g. JAR/WAR/Binary), after which the artifact will be packed as a Docker image and released to the image registry. Ultimately, the service will be released to Kubernetes automatically without any coding in a Dockerfile. Meanwhile, dynamic logs will be generated in automated building, which can help developers quickly locate any issue in service creation and release.

![Binary/Source to Image](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134220.png)

## For Operation

Usually, the operation team needs to bring in some traffic for grayscale testing of a new product version before its release. Grayscale release is conducive to the stability of the whole system as the new version will be tested during the initial release. Issues can be found with adjustments made at this stage, serving as a way for product feasibility test with user feedback collected as well.

![KubeSphere Grayscale Release](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134244.png)

Three grayscale strategies are provided by KubeSphere based on Istio: blue-green deployment, canary release and traffic mirroring. Without any hacking into the service code of applications, users can have access to microservice governance features such as grayscale and traffic management, tracing, traffic monitoring and service dependency analysis. That means product updates can be tested in an online environment according to different grayscale strategies. Besides, network issues in request communications among microservices can be found through service topology and tracing.

![KubeSphere service mesh](https://pek3b.qingstor.com/kubesphere-docs/png/20200410134326.png)

## KubeSphere Installation

KubeSphere can be deployed and run on any infrastructure, including public clouds, private clouds, virtual machines, bare metals and Kubernetes. It can be installed either online or offline. For more information, refer to [Installing on Linux](https://kubesphere.io/docs/installing-on-linux/) and [Installing on Kubernetes](https://kubesphere.io/docs/installing-on-kubernetes/).
