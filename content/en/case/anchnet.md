---
title: Anchnet
description:

css: scss/case-detail.scss

section1:
  title: Anchnet
  content: Anchnet is a leading Next-generation Cloud Managed Service Provider (Cloud MSP) in China.

section2:
  listLeft:
    - title: Company and Platform Introduction
      contentList:
        - content: As a customer-driven business, Anchnet provides cloud native technologies and digital solutions for enterprise customers on the basis of Tencent Cloud. More specifically, we enable our customers to build next-generation cloud infrastructure and technology architectures, and to develop modern cloud native apps. We also provide them with comprehensive hosting services, intelligent cloud operations and management services. This is how we work to create great user experiences for our customers in accessing, managing and using the cloud. Ultimately, we are committed to building a bridge between new ecosystems in the IT industry and industrial Internet.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180506.png

    - title: Transfer Platform
      contentList:
        - content: SmartAnt is a one-stop, lightweight transfer platform that helps users to transfer their business to the cloud in a rapid and convenient fashion. With visualized interfaces, SmartAnt supports one-click data transfer (e.g. host, database, and object storage), which has fundamentally solved the problem in the traditional ways of cloud transfer.
      image:

    - title: Basic Architecture Development
      contentList:
        - content: The basic architecture has evolved continuously along the road from a tool to a unimodule entity, a multi-module entity and finally a microservices architecture. Initially, high availability architecture deployment was achieved by servers in IDC machine rooms and now it is made possible by cloud servers. LB provided in public clouds and other SaaS products were used for high availability architecture before while the container orchestration tool Kubernetes is now used instead, which has seen technological advances one after another to satisfy different needs in the market. The process of microservice transformation is never an easy job, which covers infrastructure, declarative API, microservices and service network.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180616.png

    - title: High Availability Infrastructure
      contentList:
        - content: We are using KubeSphere to create high availability architectures on the back of LB in public or private clouds. This open source platform features one-click deployment of high availability architectures in a convenient and efficient way. Nodes can be added dynamically after the deployment without the complexity of infrastructure deployment on Kubernetes.
        - content: Ceph clusters will be created through cloud storage as KubeSphere provides a variety of storage plugins. Data can be easily integrated into the storage class of Kubernetes, providing consistent storage services.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180633.png

    - type: 1
      contentList:
        - content: Smooth User Experience
        - content: Cross-platform Support
        - content: High Availability

    - title: Access Control in Different Environments
      contentList:
        - content: Based on RBAC of native Kubernetes, KubeSphere provides the access control function for workspaces, with more detailed assignment of users, roles and access. For example, the Dev environment is for business development and developers can be authorized to access container logs. A test environment is for feature testing and a prod environment represents the official online environment, which can only be maintained by administrators.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180719.png

    - title: CI/CD in KubeSphere
      contentList:
        - content: Currently, the Dev environment is for collaborative development. With GitLab CI and GitOPS, automatic deployment can be achieved from end to end. Meanwhile, the [DevOps](https://kubesphere.io/devops/) pipeline of KubeSphere for the official environment makes it possible to release apps without any scaling.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180737.png

    - title: Introduce Argo CD, looking forward to Tekton
      contentList:
        - content: In the DevOps pipeline, the Jenkinsfile can be created with a simple Web configuration, which is convenient and efficient. We are also using Argo CD for part of our applications and we will try Tekton going forward.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611180838.png

    - type: 2
      content: 'KubeSphere offers a whole package of cloud native solutions, including high availability infrastructure deployment, CI/CD, service governance, access control, monitoring, logging and alerting.'
      author: 'Anchnet'

    - title: Service Governance
      contentList:
        - content: For north-south traffic, we use the open source platform Kong to provide the same API gateway. We offer Kubernetes infrastructure, black and white lists, and authentication and authorization features. For east-west traffic, Istio is used for service governance, load balancing, traffic monitoring, tracing analysis, circuit breaking and fallback. Fortunately, KubeSphere is an excellent platform for service governance, where we only need to submit Helm charts of our business apps to the platform as it features one-click deployment.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611182110.png

    - title: Grayscale Release
      contentList:
        - content: For frequently updated apps, we use Istio for governance in the case of a grayscale release. As canary release is also supported, it is very convenient for us to release app components of different versions by dragging and dropping in KubeSphere.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611182140.png

    - title: Monitoring and Alerting
      contentList:
        - content: Different types of alerting are supported for monitoring at different levels. Currently, the built-in monitoring feature of KubeSphere is used for Kubernetes and we are looking forward to more alerting solutions in the future.
        - content: Other features, such as log management and app release, are all conducive to our quick transformation of cloud native apps.
      image: 

    - title: Looking Forward
      contentList:
        - content: The SaaS version of SmartAnt is completely free for enterprises and individual users. The private custom version now supports the seamless transfer of OpenStack and Any to Image. Ultimately, images will be imported in other private or public platforms. Besides, our company is committed to multi-cloud management with a self-developed cloud management platform SmartOps, helping enterprises to better manage their clouds.
        - content: KubeSphere enables SmartAnt to devote more energy to the logic business development of our transfer platform. It offers a whole package of cloud native solutions, including high availability infrastructure deployment, CI/CD, Microservice governance, access control, monitoring, logging and alerting. With smooth user experiences, KubeSphere represents an open source platform and a vibrant community, where like-minded people can gather together and discuss their respective cloud native road that best suits their business.
      image:

  rightPart:
    icon: /images/case/section6-anchnet.jpg
    list:
      - title: INDUSTRY
        content: Cloud Computing
      - title: LOCATION
        content: China
      - title: CLOUD TYPE
        content: Private
      - title: CHALLENGES
        content: High Availability, Microservice Migration, Consistency
      - title: ADOPTED FEATURES
        content: DevOps, Grayscale Release, Monitoring and Alerting

---
