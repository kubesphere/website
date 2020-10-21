---
title: "Choose Jenkins Agent" 
keywords: 'kubernetes, docker, devops, jenkins, agent'
description: ''
---

## Intro

The agent section specifies where the entire Pipeline, or a specific stage, will execute in the Jenkins environment depending on where the agent section is placed. The section must be defined at the top-level inside the pipeline block, but stage-level usage is optional.

## Built-in podTemplate

The podTemplate is a template of a pod that will be used to create agents, users can define a podTemplate to use in the kubernetes plugin.

When creating a pipeline, each Pod contains at least the jnlp container for Jenkins Master to communicate with the Jenkins Agent. In addition, users can add containers in the podTemplate to meet their own needs. Users can choose to use the form of their own Pod yaml to flexibly control the runtime, and the container can be switched by the `container` command.

```groovy
pipeline {
  agent {
    kubernetes {
      //cloud 'kubernetes'
      label 'mypod'
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: maven
    image: maven:3.3.9-jdk-8-alpine
    command: ['cat']
    tty: true
"""
    }
  }
  stages {
    stage('Run maven') {
      steps {
        container('maven') {
          sh 'mvn -version'
        }
      }
    }
  }
}
```

At the same time, in order to reduce the user's learning cost, we have built in some podTemplate, so that users can avoid writing yaml files.

In the current version we have built in 4 types of podTemplates, i.e. `base`, `nodejs`, `maven`, `go`, and provide an isolated Docker environment in the Pod.

You can use the built-in podTempalte by specifying the Agent's label. For example, to use the nodejs podTemplate, you can specify label as `nodejs` when creating the Pipeline, as shown in the example below.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190322222702.png)

```groovy
pipeline {
  agent {
    node {
      label 'nodejs'
    }
  }
  
  stages {
    stage('nodejs hello') {
      steps {
        container('nodejs') {
          sh 'yarn -v'
          sh 'node -v'
          sh 'docker version'
          sh 'docker images'
        }
      }
     }
   }
}
```



### podTemplate base

| Name | Type / Version |
| --- | --- |
|Jenkins Agent Label | base |
|Container Name | base |
| OS| centos-7 |
|Docker| 18.06.0|
|Helm | 2.11.0 |
|Kubectl| Stable release|
|Built-in Softwares | unzip、which、make、wget、zip、bzip2、git |


### podTemplate nodejs

| Name | Type / Version |
| --- | --- |
|Jenkins Agent Label | nodejs |
|Container Name | nodejs |
| OS| centos-7 |
|Node  | 9.11.2 |
|Yarn  | 1.3.2 |
| Docker | 18.06.0 |
| Helm | 2.11.0 |
|Kubectl | stable release|
|Built-in Softwares| unzip、which、make、wget、zip、bzip2、git|


### podTemplate maven

| Name | Type / Version |
| --- | --- |
| Jenkins Agent Label | maven |
| Container Name | maven |
| OS| centos-7 |
| Jdk | openjdk-1.8.0 |
| Maven | 3.5.3|
| Docker| 18.06.0 |
| Helm | 2.11.0 |
| Kubectl| stable release |
| Built-in Softwares | unzip、which、make、wget、zip、bzip2、git |


### podTemplate go

| Name | Type / Version |
| --- | --- |
| Jenkins Agent Label | go |
| Container Name | go |
| OS| centos-7 |
| Go |  1.11 |
| GOPATH | /home/jenkins/go |
| GOROOT | /usr/local/go |
| Docker | 18.06.0 |
| Helm | 2.11.0 |
| Kubectl | stable release |
| Built-in Softwares | unzip、which、make、wget、zip、bzip2、git |
