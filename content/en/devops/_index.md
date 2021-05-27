---
title: "DevOps With Kubernetes And KubeSphere"
layout: "scenario"

css: "scss/scenario.scss"

section1:
  title: KubeSphere DevOps offers end-to-end workflows and integrates popular CI/CD tools to boost delivery.
  content: KubeSphere DevOps provides CI/CD pipelines based on Jenkins with automated workflows including Binary-to-Image (B2I) and Source-to-Image (S2I). It helps organizations accelerate the time to market for products.
  image: /images/devops/banner.jpg

image: /images/devops/dev-ops.png

section2:
  title: Automatically Checkout Code, Test, Analyse, Build, Deploy and Release
  list:
    - title: Out-of-box CI/CD Pipelines
      image: /images/devops/CD-pipeline.png
      contentList:
        - content: <span>Easy to integrate with your SCM,</span> supporting GitLab / GitHub / BitBucket / SVN
        - content: <span>Design graphical editing panels</span> to create CI/CD pipelines without writing any Jenkinsfile
        - content: <span>Integrate SonarQube</span> to implement source code quality analysis
        - content: <span>Support dependency cache</span> to accelerate build and deployment
        - content: <span>Provide dynamic build agents</span> to automatically spin up Pods as necessary

    - title: Built-in Automated Toolkits
      image: /images/devops/Built-in-automated-toolkits.png
      contentList:
        - content: <span>Source-to-Image</span> builds reproducible container images from source code without writing any Dockerfile
        - content: <span>Binary-to-Image</span> is the bridge between your artifact and a runnable image
        - content: <span>Support automatically building and pushing</span> images to any registry, and finally deploying them to Kubernetes
        - content: <span>Provide excellent recoverability and flexibility</span> as you can rebuild and rerun S2I / B2I whenever a patch is needed

    - title: Use GitOps to Implement DevOps
      image: /images/devops/Clear-insight.png
      contentList:
        - content: <span>Combine Git with Kubernetes, automating cloud-native app delivery</span>
        - content: <span>Designed for DevOps teamwork on the basis of the multi-tenant system of KubeSphere</span>
        - content: <span>Powerful observability,</span> providing dynamic logs for S2I / B2I builds and pipelines
        - content: Provide auditing, alerting and notifications in pipelines, ensuring issues can be quickly located and solved
        - content: Support adding Git SCM webhooks to trigger a Jenkins build when new commits are submitted to the branch

section3:
  title: See KubeSphere One-stop DevOps Workflow In Action
  videoLink: https://www.youtube.com/embed/c3V-2RX9yGY
  image: /images/service-mesh/15.jpg
  content: Want to get started in action by following the hands-on lab?
  btnContent: Start Hands-on Lab
  link: docs/pluggable-components/devops/
  bgLeft: /images/service-mesh/3-2.svg
  bgRight: /images/service-mesh/3.svg
---
