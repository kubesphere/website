---
title: "选择 Jenkins Agent" 
keywords: 'Kubernetes, KubeSphere, Docker, DevOps, Jenkins, Agent'
description: '指定 Jenkins agent 并为流水线使用内置的 podTemplate。'
linkTitle: "选择 Jenkins Agent"
weight: 11250
---

`agent` 部分指定整个流水线或特定阶段 (Stage) 将在 Jenkins 环境中执行的位置，具体取决于该 `agent` 部分的放置位置。该部分必须在 `pipeline` 块的顶层进行定义，但是阶段级别的使用为可选。有关更多信息，请参见 [Jenkins 官方文档](https://www.jenkins.io/zh/doc/book/pipeline/syntax/#代理)。

## 内置 podTemplate

podTemplate 是一种 Pod 模板，该 Pod 用于创建 Agent。用户可以定义在 Kubernetes 插件中使用的 podTemplate。

当流水线运行时，每个 Jenkins Agent Pod 必须具有一个名为 `jnlp` 的容器，用于 Jenkins Controller 和 Jenkins Agent 之间进行通信。另外，用户可以在 podTemplate 中添加容器以满足自己的需求。用户可以选择使用自己的 Pod YAML 来灵活地控制运行时环境 (Runtime)，并且可以通过 `container` 命令来切换容器。请参见以下示例。

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

同时，KubeSphere 内置了一些 podTemplate，用户无需编写 YAML 文件，极大降低学习成本。

在目前版本中，KubeSphere 内置了 4 种类型的 podTemplate：`base`、`nodejs`、`maven` 和 `go`，并且在 Pod 中提供隔离的 Docker 环境。

您可以通过指定 Agent 的标签来使用内置 podTempalte。例如，要使用 nodejs 的 podTemplate，您可以在创建流水线时指定标签为 `nodejs`，具体参见以下示例。

![Jenkins Agent](/images/docs/zh-cn/devops-user-guide/use-devops/choose-jenkins-agent/jenkins-agent.PNG)

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
|Jenkins Agent 标签 | base |
|容器名称 | base |
| 操作系统 | centos-7 |
|Docker| 18.06.0|
|Helm | 2.11.0 |
|Kubectl| 稳定版 |
|内置工具 | unzip、which、make、wget、zip、bzip2、git |


### podTemplate nodejs

| 名称 | 类型 / 版本 |
| --- | --- |
|Jenkins Agent 标签 | nodejs |
|容器名称 | nodejs |
| 操作系统 | centos-7 |
|Node  | 9.11.2 |
|Yarn  | 1.3.2 |
| Docker | 18.06.0 |
| Helm | 2.11.0 |
|Kubectl | 稳定版 |
|内置工具| unzip、which、make、wget、zip、bzip2、git |


### podTemplate maven

| 名称 | 类型 / 版本 |
| --- | --- |
| Jenkins Agent 标签 | maven |
| 容器名称 | maven |
| 操作系统 | centos-7 |
| Jdk | openjdk-1.8.0 |
| Maven | 3.5.3|
| Docker| 18.06.0 |
| Helm | 2.11.0 |
| Kubectl| 稳定版 |
| 内置工具 | unzip、which、make、wget、zip、bzip2、git |


### podTemplate go

| 名称 | 类型 / 版本 |
| --- | --- |
| Jenkins Agent 标签 | go |
| 容器名称 | go |
| 操作系统 | centos-7 |
| Go |  1.11 |
| GOPATH | /home/jenkins/go |
| GOROOT | /usr/local/go |
| Docker | 18.06.0 |
| Helm | 2.11.0 |
| Kubectl | 稳定版 |
| 内置工具 | unzip、which、make、wget、zip、bzip2、git |
