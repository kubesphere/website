---
title: "DevOps With Kubernetes And KubeSphere"
description: KubeSphere DevOps offers powerful CI/CD features with excellent scalability and observability on top of Kubernetes for DevOps-oriented teams.

layout: "scenario"

css: "scss/scenario.scss"

section1:
  title: "KubeSphere DevOps: A Powerful CI/CD Platform Built on Top of Kubernetes for DevOps-oriented Teams."
  content: KubeSphere DevOps integrates popular CI/CD tools, provides CI/CD pipelines based on Jenkins, offers automation toolkits including Binary-to-Image (B2I) and Source-to-Image (S2I), and boosts continuous delivery across Kubernetes clusters.
  content2: With the container orchestration capability of Kubernetes, KubeSphere DevOps scales Jenkins Agents dynamically, improves CI/CD workflow efficiency, and helps organizations accelerate the time to market for products.
  image: /images/devops/banner.png
  showDownload: false
  inCenter: true


image: /images/devops/dev-ops.png

section2:
  title: Run CI/CD Pipelines in Kubernetes Clusters to Implement Automated Code Checkout, Testing, Code Analysis, Building, Deploying and Releasing
  list:
    - title: Out-of-the-Box CI/CD Pipelines
      image: /images/devops/CD-pipeline.png
      contentList:
        - content: <span>Easy integration with SCM</span> including GitLab/GitHub/BitBucket/SVN to simplify continuous integration
        - content: <span>Graphical editing panels</span> designed to visualize and simplify CI/CD pipeline creation without writing any Jenkinsfile
        - content: <span>Easy SonarQube Integration</span> to implement source code quality analysis and view results on the KubeSphere console
        - content: <span>Dependency cache available</span> for tools like Maven running in Kubernetes Pods to accelerate image building and workloads deployment across Kubernetes Clusters

    - title: Built-in Automation Toolkits for DevOps with Kubernetes
      image: /images/devops/Built-in-automated-toolkits.png
      contentList:
        - content: <span>Source-to-Image</span> builds reproducible container images from source code without writing any Dockerfile and deploys workloads to Kubernetes clusters
        - content: <span>Binary-to-Image</span> builds your artifacts into runnable images and deploys workloads to Kubernetes clusters
        - content: <span>Automating image building and pushing</span> to any registry and achieving continuous deployment to Kubernetes clusters
        - content: <span>Excellent resiliency and recoverability</span> as you can copy pipelines and run them concurrently as well as rebuild and rerun S2I/B2I whenever a patch is needed

    - title: Use Jenkins Pipelines to Implement DevOps on Top of Kubernetes
      image: /images/devops/Clear-insight.png
      contentList:
        - content: <span>Kubernetes combined with Git</span> to facilitate continuous integration with code repositories and boost continuous delivery of cloud-native applications
        - content: <span>Efficient DevOps teamwork</span> through the KubeSphere multi-tenant system on the basis of Kubernetes RBAC to achieve better access control in CI/CD workflows
        - content: <span>Powerful DevOps observability</span> with dynamic logs for S2I/B2I builds and pipelines to help you manage Kubernetes DevOps resources with ease
        - content: <span>Auditing, alerting and notifications</span> available for pipelines to ensure quick identification and resolution of issues throughout CI/CD workflows
        - content: <span>Git webhooks for SCM pipelines</span> to automatically trigger a Jenkins build when new commits are submitted to a branch

section3:
  title: See KubeSphere One-stop DevOps Workflow In Action
  videoLink: https://www.youtube.com/embed/c3V-2RX9yGY
  image: /images/service-mesh/15.jpg
  showDownload: false
  content: Want to get started in action by following the hands-on lab?
  btnContent: Start Hands-on Lab
  link: docs/pluggable-components/devops/
  bgLeft: /images/service-mesh/3-2.svg
  bgRight: /images/service-mesh/3.svg
---
