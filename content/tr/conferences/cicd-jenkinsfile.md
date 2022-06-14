---
title: 'Creating a CI/CD Pipeline to Deploy Spring Boot App to Kubernetes'

author: 'xxx'
---

## Objective

This tutorial shows you how to create a CI/CD Pipeline within DevOps project, which is intended for deploying a Spring Boot sample application to Kubernetes.

## Overview

Based on the existing Jenkinsfile in the sample GitHub repository, we can create a pipeline to build and complete the stages and steps (e.g. unit test, sonarqube analysis), which totally consists of eight stages as shown below.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190719005547.png)

## Prerequisites

You've completed all steps in [Tutorial 1](admin-quick-start.md).

## Hands-on Lab

### Step 1: Create Credentials

To get started, we need to create 3 credentials, i.e. DockerHub、GitHub and kubeconfig.

1.1. Sign in with `project-regular` account and enter into the `demo-devops`, navigate to **Credentials**, then click on the **Create Credentials**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190719010621.png)

| Credential ID   | Type                | Username/Password/Secret                                             | Content |
| --------------- | ------------------- | -------------------------------------------------------------------- | ------- |
| dockerhub-id    | Username and password | Enter your personal DockerHub account information                    | \|      |
| github-id       | Username and password | Enter your personal GitHub account information                       | \|      |
| kube-config     |
| demo-kubeconfig | kubeconfig          | \|It will be automatically filled with the kubeconfig of the cluster |
| sonar-token     | Access token         | You can get secret by creating SonarQube token                       | \       |
