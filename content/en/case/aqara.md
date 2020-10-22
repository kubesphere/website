---
title: Aqara
description:

css: scss/case-detail.scss

section1:
  title: Aqara
  content: Aqara is owned by Lumi United Technology, headquartered in Shenzhen, China. Currently, we have over 300 Aqara service providers and 300 smart home showrooms across China. Our users include students, families, working professionals and multi-corporations spanning over 158 countries.

section2:
  listLeft:
    - title: Company Introduction
      contentList:
        - content: Five years ago, we set out to create a different kind of smart home solution, one that is reliable, eco-friendly, and available to anyone who wants to improve their homes and simplify their daily lives. We believe that building a smart home should not be complex or cost prohibitive, which is why we have over 200 Aqara R&D team members working tirelessly to make the most innovative and highest quality products we could at an affordable cost.
      image: /images/case/aqara-1.jpg

    - title: Background
      contentList:
        - content: From adopting the traditional approach to operation and maintenance (O&M) to using Docker Swarm, to running microservices of Spring Cloud family on Kubernetes, and finally to embracing KubeSphere, Lumi United has come a long way in its endeavor to build its own IoT platform of microservices based on KubeSphere. It has been running KubeSphere and Kubernetes stably in the production environment for more than half a year. In this regard, Lumi United has acquired considerable expertise in microservice application development and application platform O&M. This article is contributed by Wei Hengjun and Xu Yangbing, both of whom are O&M engineers from Lumi United Technology Co., Ltd. Image assets in the article come from the official website of Aqara (https://www.aqara.com/).
      image:

    - title: Traditional Approach to Container Technology
      contentList:
        - content: As an O&M engineer with multiple years of experience, Wei Hengjun understands the significance of O&M can never be overstated. At the beginning, he shouldered machines himself to the workplace, struggled to use even a cable clamp in his work, and torpidly installed operating systems. Deploying applications and improving services was never an easy job for him as he might suddenly wake up in the middle of a night just for a series of system warns. All of these have made him who he is now, always working just as a great firefighter.
        - content: Rapid technological advances have seen us embrace microservices, virtualization, and containerization and cloud native technologies one after another. O&M has also come a long way from manual operation at the beginning to scripts, platforms and now, containers. Initially, O&M only included tens of machines and it has grown to nearly 1,000 machines operated and maintained all by myself. The traditional way of application deployment requires a large amount of time spent in the preparation of configuration files, caution lists and databases every time it is updated. After that, it has to go through a strict review and approval process before it can finally be released. The whole process can take more than half a month. In this Internet era where speed is highly valued, the conventional approach can no longer serve as an efficient solution. Against this backdrop, container technology has emerged to the spotlight of our time.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200514144227.png

    - title: 'Docker Swarm: Build a Container Orchestration System'
      contentList:
        - content: The traditional way of application deployment has haunted managers for so long as the resource utilization remains at a very low level. Against this background, container technology came to my awareness in 2017 and I tried to develop and test environments in my company, which directly resulted in a 50% increase in the resource utilization in the development and test environment. In 2018, we started to use the Docker container orchestration tool, also known as Docker Swarm, in the production environment, which also greatly improved resource utilization.
        - content: 'There have been twists and turns along the road from the command line to scripts and ultimately to platforms. When I just joined the Lumi family, I found the O&M process was still at a primitive stage. At that time, all I could do was roll up my sleeves to analyze the condition under great pressure. It turned out to me that more than 80% of the microservice architecture was nearly based on memory with low resource utilization, especially CPU and disk storage. The update timeline was also unsatisfactory. All of these were extremely irritating. I determined to truly make a difference. Starting from continuous integration, I built environments with Jenkins and Harbor. I used Docker Swarm for orchestration in testing environments. Ultimately, my efforts paid off as the delivery speed and quality in the testing environment had been greatly improved. Nevertheless, as our business grew exponentially, we noticed that Docker Swarm has some apparent weaknesses:'
        - content: 1. Inefficient cross-platform support;
        - content: 2. Internal communications among services will run overtime in the traffic peak period.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200514150210.png

    - type: 1
      contentList:
        - content: Improved Resource Utilization
        - content: Cross-platform Support
        - content: Efficient Container Orchestration

    - title: 'A Comprehensive Shift: Docker Swarm to Kubernetes'
      contentList:
        - content: The time when the three giants dominated the container orchestration field had past as Kubernetes outpaced Docker Swarm and Mesos as the de facto standard in the area. Therefore, we have steered our business from Docker Swarm to Kubernetes in all respects. In fact, we have been thinking about the shift for several years, especially when we need nearly 1,000 machines for O&M. In this connection, an O&M-friendly and unified container cloud platform is necessary for us in terms of the large-scale deployment of cloud native microservice applications based on Kubernetes.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200514002430.png

    - title: 'Platform Selection: Embrace KubeSphere'
      contentList:
        - content: For the native installation and O&M of Kubernetes, open source solutions from a third party are still required. After careful consideration, Rancher and KubeSphere appeared to be our possible choices.
        - content: KubeSphere is an open source project initiated by QingCloud and co-developed by multiple enterprises. Compared with Rancher, KubeSphere features a neater user interface and a useful wizard for resource creation. With applications as its kernel, KubeSphere focuses more on the management of Kubernetes cluster resources than Rancher. It provides elegant API ports and integrates common components for development and O&M based on Kubernetes, such as Jenkins, Harbor, Prometheus and Apache SkyWalking. Besides, it can be deployed in any infrastructure environment. All of these explain why we have selected the KubeSphere container platform without any hesitation.
        - content: We have deepened our understanding of different modules in Kubernetes amidst our use of KubeSphere which features great compatibility with multiple cloud platforms and plugins. It has also accelerated our path to put container orchestration of Kubernetes into practice for the production environment. Furthermore, KubeSphere has liberated us from repetitive work facing O&M, reducing the entire cost of application maintenance. It is truly a cutting-edge tool for the O&M team and provides tremendous benefits to Internet companies.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200620002443.png


    - title: Deployment Architecture
      contentList:
        - content: Currently, our company is using 7 servers in Tencent Cloud to build the cluster.
        - content: All stateless services are now running in KubeSphere. Besides, we are using Redis, HBase, Flink, Elasticsearch and MySQL in cloud for stateful data storage services.
        - content: Our system has been running for over half a year so far without major issues. As a result, we are planning to transfer all stateful and stateless services in the development, testing and production environment of our company to KubeSphere in recent days.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200513002703.png

    - title: Design Architecture
      contentList:
        - content: Let us take a look at the business architecture of Lumi United. Currently nearly all of its overseas services are running on KubeSphere, including Gateway, message sending and pushing, and IFTTT.
        - content: As our business is mainly based on Java, we provide microservices on the basis of Spring Cloud, manage configurations with Apollo, a distributed system configuration center, and use Eureka for service registration and discovery.
        - content: With Ribbon and Feign, load balancing and service calling is achieved for microservices. At the same time, we use Hystrix thread poop for isolation, circuit breaking, fallback and traffic limit (sentinel). Springcloud-gateway is used for route scheduling and ELK is used for logging solutions. We use Skywalking as the APM tool for Java microservices distributed system.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200514005601.png

    - title:
      contentList:
        - content: We use Tencent Cloud for IaaS. Microservices are mainly included in the platform, where most applications are running on KubeSphere. All the sub-devices are linked to Hub devices (Smart Gateway, Smart Socket Gateway, Cameras, etc.) through the Zigbee protocol. Hub devices are connected to our microservice platform through the PRC protocol and the platform provides data for applications (SaaS). Reversely, applications can call the microservice platform through security authentication, which is how smart home devices are controlled. At the service level, we have plugins for tracing analysis, basic monitoring and CI/CD.
        - content: KubeSphere makes it much easier for us to use Kubernetes, accelerating our step in deploying Kubernetes in the production environment. It has significantly improved our efficiency of business update, making it possible for our R&D engineers to quickly switch among different applications for the deployment and authentication of their features.
      image:


    - type: 2
      content: 'KubeSphere is truly a cutting-edge tool for the O&M team and provides tremendous benefits to Internet companies.'
      author: 'Wei Hengjun'

    - title: Our Future Plan
      contentList:
        - content: The IoT microservice platform has been running in our production environment for over half a year so far without major issues. As a result, we are planning to transfer all stateful and stateless services in the development, testing and production environment of our company to KubeSphere in recent days.
      image:  

  rightPart:
    icon: /images/case/aqara-detail.jpg
    list:
      - title: INDUSTRY
        content: Smart Home
      - title: LOCATION
        content: China
      - title: CLOUD TYPE
        content: Hybrid
      - title: CHALLENGES
        content: Availability, Efficiency, Velocity
      - title: ADOPTED FEATURES
        content: Hosted

---
