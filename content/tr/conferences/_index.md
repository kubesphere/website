---
title: "page1"


css: "scss/conferences.scss"

viewDetail: View Details

list:
  - name: KubeCon
    content: KUBECON_DESC
    icon: images/conferences/kubecon.svg
    bg: images/conferences/kubecon-bg.svg
    children:
      - name: 'Multi-tenant Management: Creating Accounts, Roles, Workspaces, Projects and DevOps Projects'
        summary: ObjectiveIn this quickstart, as a cluster admin, you will learn how to create workspaces, roles and user accounts, and then invite new users…
        author: xxx
        link: admin-quick-start/
        image:

      - name: Managing Canary Release of Microservice Application on Kubernetes with Istio
        summary: Istio’s service mesh is able to manage traffic distribution with complete independence from deployment scaling, which enables a simpler, yet…
        author: xxx
        link: canary-release/
        image:

      - name: Deploying a Grafana Application to Kubernetes Using Application Template
        summary: ObjectiveThis tutorial shows you how to quickly deploy a Grafana application in KubeSphere via App Template, demonstrating the basic…
        author: xxx
        link: app-template/
        image:

  - name: QCon International Software Development Conference
    content: QCON_DESC
    icon: images/conferences/qcon.svg
    bg: images/conferences/qcon-bg.svg
    children:
      - name: Creating a CI/CD Pipeline to Deploy Spring Boot App to Kubernetes
        summary: ObjectiveThis tutorial shows you how to create a CI/CD Pipeline within DevOps project, which is intended for deploying a Spring Boot sample…
        author: xxx
        link: cicd-jenkinsfile/
        image:

      - name: Creating Horizontal Pod Autoscaler for Deployment
        summary: The Horizontal Pod Autoscaler automatically scales the number of pods in a deployment based on observed CPU utilization or Memory usage. The…
        author: xxx
        link: hpa/
        image:
---