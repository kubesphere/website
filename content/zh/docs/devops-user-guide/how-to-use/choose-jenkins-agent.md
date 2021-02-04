---
title: "选择 Jenkins Agent" 
keywords: 'Kubernetes, KubeSphere, docker, devops, jenkins, agent'
description: '本教程介绍了 Jenkins Agent 和 KubeSphere 中的内置 podTemplates。'
linkTitle: "选择 Jenkins Agent"
weight: 11250
---

`Agent` 部分指定整个流水线或特定阶段将在 Jenkins 环境中执行的位置，具体取决于 Agent 部分的放置位置。该部分必须在流水线的顶层定义，但是阶段级别的用法是可选的。有关更多信息，请参阅 [Jenkins 的官方文档。](https://www.jenkins.io/doc/book/pipeline/syntax/#agent)

## 内置的 podTemplate 

podTemplate 是用于创建 agent Pod 的模板。 用户可以定义在 Kubernetes 插件中使用的 podTemplate。

当流水线运行时，每个 Jenkins agent Pod 必须具有一个名为 `jnlp` 的容器用以在 Jenkins 主服务器和 Jenkins agent 之间进行通信。 另外，用户可以在 podTemplate 中添加容器以满足自己的需求。 他们可以选择使用自己的 Pod YAML 来灵活地控制 runtime，并且可以通过 `container` 命令来切换容器。 请看下面的例子。

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

同时为了减少降低用户的使用成本，KubeSphere 内置了一些 podTemplate，使用户可以避免 YAML 文件的编写。

在目前版本当中 KubeSphere 内置了 4 种类型的 podTemplate : `base`、`nodejs`、`maven`、`go`，并且在 Pod 中提供了隔离的 Docker 环境。

可以通过指定 Agent 的 label 使用内置的 podTempalte，例如要使用 nodejs 的 podTemplate，可以在创建流水线时指定 label 为 `nodejs`，如下给出示例。

![jenkins-agent](/images/docs/devops-user-guide/using-devops/jenkins-agent/jenkins-agent.jpg)

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

| 名称 | 类型 / 版本 |
| --- | --- |
|Jenkins Agent Label | base |
| 容器名称 | base |
| 操作系统 | centos-7 |
|Docker| 18.06.0|
|Helm | 2.11.0 |
|Kubectl| Stable release|
|内置工具 | unzip, which, make, wget, zip, bzip2, git |


### podTemplate nodejs

| 名称 | 类型 / 版本 |
| --- | --- |
|Jenkins Agent Label | nodejs |
| 容器名称 | nodejs |
| 操作系统 | centos-7 |
|Node  | 9.11.2 |
|Yarn  | 1.3.2 |
| Docker | 18.06.0 |
| Helm | 2.11.0 |
|Kubectl | Stable release|
|内置工具| unzip, which, make, wget, zip, bzip2, git |


### podTemplate maven

| 名称 | 类型 / 版本 |
| --- | --- |
| Jenkins Agent Label | maven |
| 容器名称 | maven |
| 操作系统| centos-7 |
| Jdk | openjdk-1.8.0 |
| Maven | 3.5.3|
| Docker| 18.06.0 |
| Helm | 2.11.0 |
| Kubectl| Stable release |
| 内置工具 | unzip, which, make, wget, zip, bzip2, git |


### podTemplate go

| 名称 | 类型 / 版本 |
| --- | --- |
| Jenkins Agent Label | go |
| 容器名称 | go |
| 操作系统| centos-7 |
| Go |  1.11 |
| GOPATH | /home/jenkins/go |
| GOROOT | /usr/local/go |
| Docker | 18.06.0 |
| Helm | 2.11.0 |
| Kubectl | Stable release |
| 内置工具 | unzip, which, make, wget, zip, bzip2, git |
