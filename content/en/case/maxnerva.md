---
title: Maxnerva
description:

css: scss/case-detail.scss

section1:
  title: Maxnerva Technology Services
  content: Maxnerva establishes the core services of “IaaS + PaaS + SaaS” to promote “Smart Manufacturing”, “Smart City”, and “Operation and Maintenance Services”. With technology services at our core, we strive to provide excellent IT services and solutions. We are also fully committed to promoting the development of IoT and Made in China 2025.

section2:
  listLeft:
    - title: Company Introduction
      contentList:
        - content: Maxnerva Technology Services, HK.0103 is affiliated and invested by Foxconn Technology Group, who is rated by Fortune Magazine as one of the 500 strongest corporations. With 20 years of IT experience in the 3C industry (Cloud, Mobile, IoT, Big Data, Intelligent, Network + Robot), Maxnerva Technology Services successfully incorporates Foxconn’s industrialization and information development with innovative technology to create an experienced and professional team.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611184404.png

    - title: Background
      contentList:
        - content: 'In accordance with the 2019 Digital Transformation Strategy of Foxconn (Made in China 2025, Industry 4.0), our operation team is faced with the following challenges:'
        - content: 'Technologically, we need to:'
        - content: 1. Support private cloud, public cloud and hybrid cloud.
        - content: 2. Manage hundreds of microservices and support nearly 700 old SLA services.
        - content: 3. Support big data architectures from edge computing to data analysis.
        - content: 4. Support extensive data storage and data analysis.
        - content: 'However, the current architecture cannot meet the demands above with existing issues listed below:'
        - content: 1. All of our services are orchestrated based on Docker Compose. With serious single node failures, we cannot guarantee the high availability of our services.
        - content: 2. Low resource utilization.
        - content: 3. Inconvenient operations for developers.
        - content: 4. Slow update cycle of multiple microservices.
        - content: Before we comprehensively moved to cloud native technology stacks, all of our services were based on Docker and Docker Compose with different services deployed on different hosts or clusters. In order to meet the demands and solve existing issues, we have selected Kubernetes, Prometheus and in-built cloud native tools of KubeSphere to face the challenge. The greatest benefit that these tools can offer is that we can provide our clients with a digital transformation strategy in manufacturing that features low cost and high efficiency.
      image:

    - title: Why KubeSphere
      contentList:
        - content: Based on our needs and challenges, we have implemented POC for different solutions, including Rancher, BlueKing and native Kubernetes. Ultimately, KubeSphere, an [open source container platform](https://kubesphere.io/), stands out to be our preferred choice. We have selected KubeSphere because it offers a holistic end-to-end delivery chain. It enables us to deploy Kubernetes clusters in the new environment in the most convenient way. Furthermore, it provides seamless integration with our internal system environment.
        - content: With a series of cloud native tools packed by KubeSphere, we are able to deploy new services within minutes and upgrade our business system within seconds. Developers only need to push their code, which will be automatically released to the production environment within about 10 minutes. As a result, our resource utilization has doubled and delivery efficiency has increased more than tenfold.
        - content: The biggest advantage that KubeSphere has brought us is that the release in all environments can now be operated by developers directly without the involvement of the Ops team for the whole process. This has greatly reduced our communication cost and workload. Based on KubeSphere, we have built our AIOps platform, tightly integrate with our existing system services and components.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611185811.png

    - title: KubeSphere Deployment Architecture
      contentList:
        - content: KubeSphere provides us with hybrid cloud deployment in multiple machine rooms, making it possible for us to build an IIOT platform. As Foxconn factories are located in countries/regions around the world, we have independent machines rooms in different areas for the deployment of our business system. This has helped us meet our business needs. As we only have one development environment, we are using tags to control resources in different areas for local programming, local storage and local deployment. This is how we work to achieve rapid application delivery.
        - content: Due to our internal requirement for data security and protection, cluster resources do not have access to external network by default. Only when the security audit server approves can they have normal access. Likewise, cluster resources also need to be approved by the audit server.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611184525.png

    - type: 1
      contentList:
        - content: Reduced Learning Cost
        - content: DevOps Customization
        - content: Improved Delivery Efficiency

    - title: Storage and Network Solution
      contentList:
        - content: We adopted Calico for our first deployment as the cluster network solution. In our test, we noticed high latency across nodes. This is because Calico entails specific requirements for BGP while our network deployment is too complicated to allow us to make any change. We then turned to Flannel and adjusted deployment configurations, using hostgw in the same network segment and VXLan otherwise. Ultimately, we saw a considerable improvement in network performance in the test.
        - content: We are using GlusterFS cluster and NFS storage as solutions to persistent storage for clusters. GlusterFS mainly provides persistent mounting for storage volumes while NFS is used for data backup.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611185626.png

    - title: Logging and Monitoring Solution
      contentList:
        - content: We are using our existing monitoring system, including Zabbix, ELK and Prometheus. This has reduced deployment costs and helped us integrate KubeSphere with our existing environment.
        - content: As the main users of KubeSphere, our developers can check internal deployment and resource information on the KubeSphere platform to monitor any abnormalities at application level. For our Ops team, they can check more detailed information on resource usage in the cluster, pre-handling any possible issues.
      image:

    - type: 2
      content: 'We have selected KubeSphere because it offers a holistic end-to-end delivery chain. It enables us to deploy Kubernetes clusters in the new environment in the most convenient way.'
      author: 'Maxnerva'

    - title: KubeSphere DevOps Customization
      contentList:
        - content: We have also found ourself in a difficult position as we use KubeSphere. The business systems developed have overwhelmed our professional Ops team. Besides, the release of new environments is highly dependent on our Ops team as they need to make preparations for them. Furthermore, the Ops team also needs to assist developers with the initial deployment of middleware and pipeline for the whole process. In short, due to limited human resources of the Ops team, we have encountered a new challenge restricting the continuous release process of our business.
        - content: The compilation of Jenkinsfile that is necessary to pipeline creation is relatively difficult for developers technologically and entails learning costs. Fortunately, as a completely open source platform, KubeSphere allows us to conduct custom development and packaging on the basis of its existing features. More specifically, we have created a new function of rapid creation, meeting the demand of our developers for DevOps projects and CI/CD pipelines in their creation or update.
        - content: On the back of various, comprehensive features of KubeSphere, we have successfully empowered our Ops team to handle enormous workload with limited human resource costs.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611190317.png

    - title: Prospect
      contentList:
        - content: 'Suggestions or needs for KubeSphere:'
        - content: 1. More detailed monitoring information.
        - content: 2. Coordinated and unified project management.
        - content: 3. An elegant in-built service ticket system.
        - content: 4. Windows node management.
      image:

  rightPart:
    icon: /images/case/section6-maxnerva.jpg
    list:
      - title: INDUSTRY
        content: IT Services
      - title: LOCATION
        content: China
      - title: CLOUD TYPE
        content: Hybrid
      - title: CHALLENGES
        content: DevOps, Efficiency, Limited Human Resources
      - title: ADOPTED FEATURES
        content: CI/CD, Logging, Monitoring

---
