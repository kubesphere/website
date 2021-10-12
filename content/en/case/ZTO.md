---
title: ZTO Express
description:

css: scss/case-detail.scss

section1:
  title: ZTO Express
  content: Shared by Yang Xiaofei, head of R&D of ZTO Express’s Cloud Platform, this article mainly introduces the development and deployment of KubeSphere on production environment, as well as application scenarios of ZTO Express.

section2:
  listLeft:
    - title: Company Introduction
      contentList:
        - content: ZTO is both a key enabler and a direct beneficiary of China’s fast-growing e-commerce market, and has established itself as one of the largest express delivery service providers for millions of online merchants and consumers transacting on leading Chinese e-commerce platforms, such as Alibaba and JD.com. Globally, ZTO provides delivery services in key overseas markets through its business partners as it expands coverage of international express delivery by collaborating with international industry players.
      image:/images/case/ZTO/ZTO1.jpg

    - title: Background
      contentList:
        - content: For further development, five prominent challenges were waiting to be addressed. 
        - content: First, different versions were required to adapt to different environments. However, as multiple versions were carried out, we could not effectively respond to resources through virtual machines. 
        - content: Second, frequent upgrading called for quick environment initialization, and new versions were proposed frequently even every week. 
        - content: Third, resource application and environment initialization were over-complex. We used conventional approaches for resource application in 2019, when trouble tickets were required for environment initialization delivery. It was troublesome and low efficient for testers as they needed to apply for resources first and release those resources after testing. 
        - content: Fourth, low utilization of existing virtual resource was another problem. Staff turnovers and changes in positions sent abundant resources into zombies, especially on development and testing environment. 
        - content: Fifth, we lacked horizontal extension capacity. Resources were scarce on important shopping days such as “6.18” and “double 11”. To address this problem, we used to prepare resources in advance and take them back after the events. This proved to be outdated. 
        - content: Confronting all those challenges, we discussed with developers and decided to embark on cloudification.
    - title: Cloudification on Production Environment
      contentList:
        - content: Our cloudification includes three steps, namely, cloud-based, cloud-ready and cloud-native.
      image: /images/case/ZTO/ZTO2.jpg
    
    - title:
      contentList:
        - content: Based on Dubbo framework, our micro-service completed transformation in an early date. However, the micro-service was carried out through virtual machine, when the emergence of Salts led to troubles. Therefore, we needed to make transformations on IaaS and container.
      image: /images/case/ZTO/ZTO3.jpg

    - title: KubeSphere Development and Deployment
      contentList:
        - content: We decided to apply KubeSphere as the construction scheme of our container management platform, ZKE, and as an upper container PaaS platform for running micro-services.
      image: /images/case/ZTO/ZTO4.jpg

      - title: Construction Direction
        contentList:
          - content: In line with the reality, we took KubeSphere as the container platform for running our stateless service, Kubernetes observability, and infrastructure resource monitoring, while stateful service like middlewares are provided in Iaas.
          image: /images/case/ZTO/ZTO5.jpg

      - title: Small Clusters with a Single Tenant
        contentList:
          - content: After the selection of KubeSphere, we encountered another problem: should we choose small clusters with a single tenant or a large cluster with multi-tenants?  After consulting the KubeSphere team and evaluating our own demands, we picked up small clusters with single tenant. In accordance with business scenarios (such as middle desk business, and scanning business) and resource applications (such as big data, edge), we created different clusters. 
          - content: Based on multi-cluster design, we made cloud transformation in line with KubeSphere v2.0. Each cluster on development, testing and production environment were deployed with a set of KubeSphere, while public components are drawn out, such as monitor and log.
    - title: Secondary Development Based on KubeSphere
      contentList:
        - content: For realizing some customized features to meet our demand, we integrated our business scenarios to KubeSphere. Here is the integration took place between the summer of 2019 and October of 2020.
      - title: Super-Resolution
        contentList:
          - content: We applied super-resolution. Hence, once the limit is set, requests could be quickly computed and integrated. On production environment, the super-resolution ratio for CPU is 10 and memory 1.5.
      - title: CPU Cluster Monitoring
        contentList:
          - content: In this part, we merely applied CPU cluster monitoring for demonstrating the data we monitored.
      - title: HPA Horizontal Scaling
        contentList:
          - content: We held high expectation in HPA Horizontal Scaling. As KubeSphere resource allocation supports horizontal scaling, we set the horizontal scaling independently and integrated it with super-resolution, thus to facilitate the measurement of the super-resolution ratio.
          - content: Based on HPA and clear interface of KubeSphere, we have almost been free from operation and maintenance of some core businesses. In addition, demand in emergency scenarios can be quickly responded. For example, when it comes to upstream consumption backlogs, we can quickly increase replication and give a instant response.
      - title: Batch Restart
        contentList:
          - content: As abundant deployments might be restarted under extreme conditions, we set an exclusive module in particular. Hence, what we need is only one click to get instant restart and quick response of clusters or deployments under one Namespace.
      - title: Affinity of Container
        contentList:
          - content: In terms of affinity of container, we applied the soft anti-affinity, as some applications found their resource usage mutually exclusive. In addition, we also added some features and affinity settings in this part.
      - title: Scheduling Strategy
        contentList:
          - content: In terms of scheduling strategy, the features of specifying a host group and exclusive host stood out.  As some of our businesses needed to access to the internet port, we put all those businesses within one host group and provided it with access to the internet. We also applied exclusive host to run big data applications in the early hours of morning, because the service was idle at that moment.
      - title: Gateway
        contentList:
          - content: Each Namespace in KubeSphere held an independent gateway. Independent gateway met our production requirement, while we also needed pan-gateway in development and testing, thus to achieve quicker responses to servers. Hence, we set both pan-gateway and independent gateway, and had access to all development and testing through pan-domain name. After configuration, our services could be directly accessed through KubeSphere interface.
      - title: Log Collection
        contentList:
          - content: We used to apply Fluent-Bit for log collection, while since there were some mistakes made in resources upgrading or parameters, it always failed as businesses kept increasing. Therefore, we turned to Sidecar. Services based on Java all set an independent Sidecar, and pushed logs to centers like ElasticSearch through Logkit, a small agent. We continued to use Fluent-agent to collect logs  under development and testing environment, while for production scenarios that require complete logs, we took further steps to ensure that logs were persistently stored at disks. All logs of containers were collected through four approaches: console log, Fluent-agent console log, /data Sldercar-logkit and /data NFS.
      - title: Event Tracing
        contentList:
          - content: In term of Event Tracing, we made transformation on the basis of Kube-eventer, and added event tracing to KubeSphere, where configurated information could be sent to Ding Talk. As for changes in businesses that were highly concerned under production environment, we could send them to work group of Ding Talk through customized configuration.
    - title: Future Planning
      contentList:
        - content: In the future, we would like to make some improvements in several aspects. First of all, service plate will ensure that all individuals, including operators, maintainers as well as developers, can understand the framework of the services provided, the middlewares and data bases relied on,as well as the running status. Second, it is expected that status quo of all PODS, including changes in color and resources allocation can be seen from the perspective of the whole cluster. Third, we hope that edge computing can be applied for uploading scanned statistics of transferred expresses, automatic recognition of violate practice of operator, the wisdom park project and other purposes.
        - content: In addition, we also encounter some difficulties in the management of abundant edge nodes, stability and high availability of KubeEdge, and deployment and automatic operation and maintenance of edge nodes. We are exploring more uncharted areas with the pursuit of breakthroughs.

  rightPart:
    icon: /images/case/ZTO/ZTO6.jpg
    list:
      - title: INDUSTRY
        content: Delivery
      - title: LOCATION
        content: China
      - title: CLOUD TYPE
        content: On-premises
      - title: CHALLENGES
        content: Multi-clusters, HA, Microservice Migration, Unifying Container and VM Networking
      - title: ADOPTED FEATURES
        content: HPA, DevOps, Grayscale Release, Monitoring and Alerting

---