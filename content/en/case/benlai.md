---
title: Benlai
description:

css: scss/case-detail.scss

section1:
  title: Benlai
  content: Founded in 2012, Benlai is an e-commerce website focused on food, including fruits and vegetables.

section2:
  listLeft:
    - title: Company Introduction
      contentList:
        - content: We work closely with select food providers and supply bases. We are committed to improving food safety in China as we strive to provide cold chain delivery services and direct home delivery services from our bases. This is how we work to become a quality food provider in China.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611182545.png

    - title: 'Technology Condition: Infrastructure'
      contentList:
        - content: Deployed in IDC
        - content: Over 100 physical machines
        - content: Virtualized deployment
      image:

    - title: Existing Issues
      contentList:
        - content: Occupancy rate of physical machines is over 95%
        - content: Many idle resources
        - content: Application scaling up process is relatively slow
      image:

    - title: Embrace DevOps and Kubernetes
      contentList:
        - content: 'We have three main objectives as we embark on the road of DevOps:'
        - content: 1. Improve resource utilization
        - content: 2. Enhance release efficiency
        - content: 3. Reduce the working cost of O&M
        - content: The most important part is cost efficiency. Here is how we work to update our business toward DevOps.
      image:

    - type: 1
      contentList:
        - content: Improved Resource Utilization
        - content: Enhanced Release Efficiency
        - content: Reduced Working Costs

    - title: 'Level 1: DevOps Tool Selection'
      contentList:
        - content: As we began to learn [DevOps](https://kubesphere.io/devops/), an open-source platform KubeSphere had come to our awareness. KubeSphere is an [enterprise-grade container platform](https://kubesphere.io/) built on Kubernetes with applications as its kernel. It supports multiple business scenarios, including agile development and automated O&M, DevOps, microservices governance, grayscale release, multi-tenant management, monitoring and alerting, log query and collection, application store, storage management and network management.
        - content: The Jenkins-based DevOps pipeline built in KubeSphere is very appropriate for us to use as it provides all necessary cloud native tools across the whole ecosystem for O&M.
        - content: Therefore, we began to create a proper CI/CD process by learning the operation, grammar and plugins related to KubeSphere and Jenkins. With the support of KubeSphere container platform, our level 1 CI/CD process had taken shape.
        - content: At Level 1, we successfully achieved some processes, such as code pulling, application programming, pushing images to a local repository and deploying them to a Kubernetes cluster.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611182621.png

    - title: Gaining Expertise
      contentList:
        - content: With a general CI/CD process in place, we continued to work on the pipeline. For example, we succeeded in the dynamical generation of application information after we studied how to customize a Jenkins pipeline. A large part of the reason why Jenkins becomes a major enterprise-grade CI/CD application is that it features an abundant plugin ecosystem. This has driven us to continue to work on Jenkins plugins, achieving a series of processes in the pipeline, such as FTP uploading, dynamic deployment of ConfigMap with commands and storage deployment.
      image: https://pek3b.qingstor.com/kubesphere-docs/png/20200611182839.png

    - type: 2
      content: 'The Jenkins-based DevOps pipeline built in KubeSphere is very appropriate for us to use as it provides all necessary cloud native tools across the whole ecosystem for O&M.'
      author: 'Yang Yang'

    - title: 'Level 2: Improve the Pipeline'
      contentList:
        - content: We had upgraded our CI/CD process to Level 2 as we learned more about the Jenkinsfile grammar and plugins. We added more elements in the pipeline, such as configuration deployment, storage deployment and CND uploading.
        - content: Based on our business, our CI/CD process needs to be divided into varied types for release with different parameters for each type. At the beginning, we tried to use “when” first followed by “Input” to provide different parameters. However, the running order did not come the way we expected. Alternatively, we were aware of another kind of Input grammar to serve as a perfect solution to our issue.
      image:

    - title: 'Level 3: Rollback'
      contentList:
        - content: After our struggle with the dynamic parameter, we had upgraded our CI/CD process to Level 3 where dynamic parameters could be generated for different types of tasks.
        - content: For a rollback, the application and ConfigMap must both be included in the rollback while the ConfigMap version controlling feature is not supported in Kubernetes, which poses a great challenge for management. In this connection, we have to acquire the ConfigMap from the configuration center every time an application is released. When a ConfigMap is generated, the version number will be added following its name. This is how we work to perform a rollback for both the application and ConfigMap.
      image:

    - title: Standardized Process
      contentList:
        - content: We have learned from our previous lessons and wondered whether we can standardize the whole process once we have a well-placed CI/CD process. That means all applications can go through the same process before they are released. This serves as a more efficient way than to write the CI/CD process into the pipeline of every application. This is because it will be quite difficult to change the process of various applications once the CI/CD process needs to be modified.
        - content: We searched for related information of standardization and finally found Shared Libraries of Jenkins, which helped us to divide the CI/CD process into two parts. Now, we only need to input parameters in the Jenkins pipeline of each application and call the method to execute the process. What’s more, the code of the Jenkins pipeline for each application has decreased from over 500 lines to less than 30 lines.
      image:

    - title: 'Level 9: One-click Deployment'
      contentList:
        - content: Through our unremitting efforts, we have developed great expertise all the way up to Level 9, as the CI/CD process sees a considerable improvement.
        - content: For future releases, we only need to select the release type and environment and perhaps a cup of coffee ☕️, waiting for the service to be released by KubeSphere all with one click.
      image:

  rightPart:
    icon: /images/case/section6-benlai.jpg
    list:
      - title: INDUSTRY
        content: E-Business
      - title: LOCATION
        content: China
      - title: CLOUD TYPE
        content: Private
      - title: CHALLENGES
        content: Resources Utilization, Delivery Efficiency, Costs
      - title: ADOPTED FEATURES
        content: CI/CD, DevOps, Jenkins

---
