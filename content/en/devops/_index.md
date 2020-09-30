---
title: "dev-ops"
layout: "scenario"

css: "scss/scenario.scss"

section1:
  title: KubeSphere DevOps offers end-to-end workflow and integrates popular CI/CD tools to boost delivery.
  content: KubeSphere DevOps provides CI/CD pipeline based on Jenkins, and offers automated workflows including binary-to-image (B2I) and source-to-image (S2I), helps organizations accelerate time to market for their product.
  image: /images/devops/banner.jpg

image: /images/devops/dev-ops.svg

section2:
  title: Automatically Checkout Code, Test, Analyse, Build, Deploy and Release
  list:
    - title: Out-of-box CI/CD Pipeline
      image: /images/devops/CD-pipeline.svg
      contentList:
        - content: <span>Easy to integrate with your SCM,</span> supporting GitLab / GitHub / BitBucket / SVN
        - content: <span>Design a graphical editing panel</span> to create CI/CD pipelines, without writing Jenkinsfile
        - content: <span>Integrate SonarQube</span> to implement source code quality analysis
        - content: <span>Support dependency cache</span> to accelerate build and deployment
        - content: <span>Provide dynamic build agents</span> to automatically spin up Pods as necessary

    - title: Built-in Automated Toolkits
      image: /images/devops/Built-in-automated-toolkits.svg
      contentList:
        - content: <span>Source to Image</span> builds reproducible container images from source code without writing dockerfile
        - content: <span>Binary-to-image</span> is the bridge between your artifact and a runnable image
        - content: <span>Support automatically building and pushing</span> images to any registry, and finally deploy them to Kubernetes
        - content: <span>Provide excellent recoverability and flexibility</span> as you can rebuild and rerun S2I / B2I whenever a patch is needed

    - title: Use GitOps to implement DevOps, not just culture
      image: /images/devops/Clear-insight.svg
      contentList:
        - content: <span>Combine Git with Kubernetes’ convergence, and automates the cloud native Apps delivery</span>
        - content: <span>Designed for teams, offer built-in multitenancy in DevOps project</span>
        - content: <span>Liable to be observable,</span> provide dynamic logs for the S2I / B2I build and pipeline
        - content: Provide audit, alert and notification in pipeline, ensuring issues can be quickly located and solved
        - content: Support adding Git SCM webhooks to trigger a Jenkins build when new commits are submitted to the branch

section3:
  title: See KubeSphere One-stop DevOps Workflow In Action
  videoLink: https://www.youtube.com/embed/c3V-2RX9yGY
  image: /images/service-mesh/15.jpg
  content: Want to get started in action by following the hands-on lab?
  btnContent: Start Hands-on Lab
  link: https://kubesphere.io/docs/pluggable-components/devops/
  bgLeft: /images/service-mesh/3-2.svg
  bgRight: /images/service-mesh/3.svg
---
