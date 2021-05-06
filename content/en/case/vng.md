---
title: VNG
description:

css: scss/case-detail.scss

section1:
  title: VNG
  content: VNG corporation is a leading Internet and technology company in Vietnam. In 2014, we were recognized as the only 1-billion dollar startup in the country. Many key products developed by VNG have attracted hundreds of millions of users, such as Zalo, ZaloPay and Zing.
  image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619222719.png

section2:
  listLeft:
    - title: ZaloPay Introduction
      contentList:
        - content: Launched in 2017, ZaloPay is built on top of Zalo, equipped with many conveniences from Zalo’s ecosystem. There is already an ecosystem at Zalo, boasting a significant volume of Zalo's users (~100 million-active-user). It is relatively competitive compared to MoMo, GrabPay by Moca, ViettelPay, etc.
        - content: Similar to AliPay which is one of three tenets of the “iron triangle” (aka e-commerce and logistics), GrabPay is an enabler of the Grab ecosystem and WeChat Pay is on a social media platform. ZaloPay ranked as the 3rd payment application of the year at the 2018 Tech Awards ceremony held by VnExpress, the most common newspaper in Vietnam. While the competitor MoMo took the top spot, followed by Viettel Pay, the rising players of GrabPay by Moca, VinID powered by VinGroup and AirPay by SEA have also joined the market, making the game even more intense.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619222719.png

    - title: We are Enthusiastic about New Technologies
      contentList:
        - content: VNG is a big company, working in a wide range of business. We are committed to using cutting-edge frameworks, technologies, and programming languages to develop our products and build infrastructure.
        - content: Building and developing software applications that rely on the outdated architecture will cause various problems in scalability, resilience, observability, etc. For example, for the traditional monolithic architecture, it is very difficult to implement changes in such a large and complicated application that is tightly coupled. Besides, the monolithic architecture features terrible scalability with high technology barriers. That means it may postpone your go-to-market strategy and slow the update cycle of your products. However, the fact is that what we want is the fast development and delivery in our business and services need to respond quickly to changes.
        - content: Docker and Kubernetes are undoubtedly the best technical architecture tailored for our business needs. I probably don't need to say much about containerization and the benefits. Componentization also allows you to develop faster and more reliably; and Kubernetes automates rollouts and rollbacks, monitoring the health of your apps with probes.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619223445.png

    - title: Adopting Kubernetes and KubeSphere
      contentList:
        - content: At the end of 2018, we adopted Kubernetes as the container orchestration solution. Kubernetes helps us to declaratively manage our cluster, allowing our apps to be version controlled and easily replicated. However, the learning curve of Kubernetes is high as there are a series of solutions we need to consider, including logging, monitoring, DevOps and middleware. Actually, we have investigated the most popular tools. For example, we use EFK for logging management and adopt Jenkins as the CI/CD engine for business update. Redis and Kafka are also used in our environment.
        - content: These popular tools help us improve development and operation efficiency. Nevertheless, the biggest challenge facing us is that developers need to learn and maintain these different tools; and we need to spend more time switching back and forth between different terminals and dashboards. Hence, we started to research a centralized solution which can bring the cloud native stack within a unified web console. We compared a couple of solutions (e.g. Rancher and native Kubernetes) and KubeSphere has proven to be the most convenient one among them.
        - content: We install [KubeSphere Container Platform](https://kubesphere.io/) on our existing Kubernetes cluster, and we have two Kubernetes clusters for sandbox and production respectively. For data privacy, our clusters are all deployed on bare metal machines. We install the highly available cluster using HAProxy to balance the traffic load.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619223626.png

    - title: Why We Choose KubeSphere
      contentList:
        - content: Thanks to the developer-friendly web console provided by KubeSphere, we can easily monitor the resource consumption range from infrastructure to applications. Hence, we've been running merchant platform of ZaloPay on KubeSphere very steadily for half a year. KubeSphere also offers a portfolio which integrates and packages the cloud native stack, and provides out-of-box application lifecycle management, monitoring, logging, multi-tenancy, alerting and notification. As each feature and component is pluggable, we can enable them based on our needs.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619224814.png

    - type: 1
      contentList:
        - content: Developer-friendly Web Console
        - content: Multi-dimensional Monitoring Capabilities
        - content: Feature-rich and Pluggable

    - title: How We Implement DevOps
      contentList:
        - content: We implement the CI/CD pipeline in a typical and straightforward way, running the merchant platform in ZaloPay. As you can see from the figure below, we run CI/CD pipeline using KubeSphere, stitching GitLab, SonarQube, Docker, Kubernetes, and docker registry. In the first stage, the pipeline will initialize some necessary environments for the entire pipeline. Next, the pipeline will pull the source code from Gitlab by using the environment conditions (like checkout branch, deploy env, tag version). In the third stage, it will build the Golang project and trigger SonarQube to analyze the source code and check the quality. If there is nothing special or significant issue in the code, the pipeline will jump to next stage.
        - content: When everything runs smoothly, the pipeline will pack the project using Docker in the fourth stage. Then it pushes the docker image to the Docker Registry. The fifth stage is used to deploy the docker image to the desired environment, including sandbox and production. Then it cleans the pipeline garbage and sends an email notification to our team with the running result of pipeline.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619225121.png

    - title: Code Quality in SonarQube
      contentList:
        - content: We use SonarQube for static code quality analysis. The screenshot below is an example of our service analytic result from SonarQube. It helps us to quickly locate the bug and vulnerability in our code.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200619225841.png

    - type: 2
      content: 'KubeSphere allows ZaloPay Ops Team to devote more time and efforts automating management and workflow.'
      author: 'Tan To Nguyen Duy'

    - title: Issues We Meet and Solutions
      contentList:
        - content: When we installed KubeSphere, several CRDs were created. Due to testing or something, I reinstalled, and deleted some resources. API server panicked handling requests for a CRD with OpenAPI validation with x-kubernetes-int-or-string; etcd also panicked and crashed looply.
        - content: This bug appears in Kubernetes versions smaller than v1.16.2; it is not secure to upgrade Kubernetes API version and it inevitably causes downtime. Otherwise it will not be possible to access the API; and kubectl or any controller will be terminated.
        - content: Bugs are fixed in versions from v1.16.2 +. Please notice and carefully play with production.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200620000210.png

    - title: Testimonial
      contentList:
        - content: To meet the needs of centralized management of cloud native stack, we choose to use KubeSphere to strengthen the observability on top of Kubernetes. Now we are able to deploy new microservices and allocate resources within minutes. It also helps developers accelerate the time to market.
        - content: KubeSphere allows ZaloPay Ops Team to devote more time and efforts automating management and workflow. It provides smooth user experiences and features a developer-friendly web console which shields the complicated underlying logic, making it easier to manipulate infrastructure resources. KubeSphere represents a fast-growing open source community in the world. KubeSphere community helps a large number of companies and organizations to easily run their business using cloud native technologies, and solve the pain points of Kubernetes itself.
        - content: I am a big fan of open source. Open source brings developers closer in the world as we can discuss our proposals and solve our problems in a public and active community. I believe open source is the future of software and I am trying to contribute to the community. I hope KubeSphere can grow the open source community and provide a better product for it.
      image:

  rightPart:
    icon: /images/case/vng.jpg
    list:
      - title: INDUSTRY
        content: Internet and technology
      - title: LOCATION
        content: Vietnam
      - title: CLOUD TYPE
        content: Private
      - title: CHALLENGES
        content: High Availability, Security, Observability
      - title: ADOPTED FEATURES
        content: DevOps, Logging, Monitoring
      - title: AUTHOR
        content: Tan To Nguyen Duy

---
