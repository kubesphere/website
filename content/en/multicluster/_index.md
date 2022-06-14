---
title: "Kubernetes Multi-cluster Management"
description: KubeSphere DevOps offers powerful CI/CD features with excellent scalability and observability on top of Kubernetes for DevOps-oriented teams.

layout: "scenario"

css: "scss/scenario.scss"

section1:
  title: "Build Kubernetes multi-cluster and Multi-cloud Strategy to Scale Your Business With Ease"
  content: Enterprises are increasingly deploying applications to multiple Kubernetes clusters to ensure high availability, isolation and scalability. KubeSphere is a central control plane for Kubernetes multi-cluster management and operation.
  image: /images/devops/banner.png
  showDownload: true
  inCenter: true


image: /images/multicluster/mul-ops.png

section2:
  title: Manage Your Kubernetes Cluster Across Cloud, Data Center and Edge
  list:
    - title: Deploy Application in Multiple K8s Clusters
      image: /images/multicluster/deploy-application.png
      contentList:
        - content: <span>Easy to integrate with your SCM</span>, support GitLab / GitHub / BitBucket / SVN
        - content: <span>Provide built-in graphical editing panel</span> to create CI/CD pipelines without writing Jenkinsfile
        - content: <span>Integrate SonarQube</span> to implement code quality analysis, ensuring the security and compliance standards are met
        - content: <span>Support dependency cache</span> to accelerate build and deployment
        - content: <span>Provide dynamic build agents</span> to automatically spin up Pods as necessary

    - title: Strong Isolation and Multi-tenancy, Built for Teams
      image: /images/multicluster/strong-isolation.png
      contentList:
        - content: <span>Source to Image,</span> building reproducible container images from source code, without writing dockerfile
        - content: <span>Binary-to-image</span> is the bridge between your artifact and a runnable image
        - content: <span>Support automatically build and push</span> image to any registry, finally deploy Apps to Kubernetes
        - content: <span>Good recoverability and flexibility,</span> you can rebuild and rerun S2I / B2I whenever a patch is needed

    - title: Multi-cluster CI/CD Pipeline and Observability
      image: /images/multicluster/CICD-Pipeline.png
      contentList:
        - content: <span>Combine Git with Kubernetes’ convergence, and automates the cloud native Apps delivery</span>
        - content: <span>Designed for teams, offer built-in multitenancy in DevOps project</span>
        - content: <span>Liable to be observable,</span> provide dynamic logs for the S2I / B2I build and pipeline
        - content: Provide audit, alert and notification in pipeline, ensuring quickly locate and solve issues.
        - content: Support add Git SCM webhooks to trigger a Jenkins build when new commints to the branch

section3:
  title: See KubeSphere One-stop DevOps Workflow In Action
  videoLink: https://www.youtube.com/embed/dQ3sm40Hr18
  image: /images/service-mesh/15.jpg
  showDownload: true
  content: Want to get started in action by following the hands-on lab?
  btnContent: Start Hands-on Lab
  link: docs/pluggable-components/devops/
  bgLeft: /images/service-mesh/3-2.svg
  bgRight: /images/service-mesh/3.svg
---
