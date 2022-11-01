---
title: '基于 KubeSphere 的开源微服务开发平台 Pig 最佳实践'
tag: 'Kubernetes'
keywords: 'Kubernetes, KubeSphere, Pig, 微服务 '
description: '本文主要描写了使用 KubeSphere 这款容器云平台和 Pig 这款开源微服务开发平台来解决微服务系统部署、监控的复杂问题。'
createTime: '2022-10-25'
author: '何昌涛'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-pig-practice-cover.png'
---

> 作者：何昌涛，北京北大英华科技有限公司高级 Java 工程师，云原生爱好者。

## 前言

近年来，为了满足越来越复杂的业务需求，我们从传统单体架构系统升级为微服务架构，就是把一个大型应用程序分割成可以独立部署的小型服务，每个服务之间都是松耦合的，通过 RPC 或者是 Rest 协议来进行通信，可以按照业务领域来划分成独立的单元。但是微服务系统相对于以往的单体系统更为复杂，当业务增加时，服务也将越来越多，服务的频繁部署、监控将变得复杂起来，尤其在上了 K8s 以后会更加复杂。那么有没有一款全栈的容器云平台来帮我们解决这些问题哩？那当然是有的，下面我们一起来揭秘一下吧。

## 介绍

### KubeSphere

KubeSphere 是在 Kubernetes 之上构建的开源容器平台，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。

### Pig

[Pig](https://gitee.com/log4j/pig) 是一个基于 Spring Boot 2.7、 Spring Cloud 2021 & Alibaba、 SAS OAuth2 的开源微服务开发平台，也是微服务最佳实践。在国内拥有大量拥护者，同时也有商业版本提供技术支持。

## 环境搭建

- K8s 容器化环境一套，并部署完 KubeSphere v3.3.0 版本，启用 DevOps 插件。
- GitLab 代码仓库管理开源系统一套。
- Harbor 容器镜像开源系统一套。
- SonarQube 开源自动代码审查工具一套。
- 一个更易于构建云原生应用的动态服务发现、配置管理和服务管理的 Nacos 开源平台一套（可选，Pig 已提供 Naocs 服务，即 Register 服务）。
- 高性能的 key-value 数据库 Redis（3.2 +）一套（Pig 需要）。
- 关系型开源数据库管理系统 MySQL 一套（Pig 需要）。
- 高性能对象存储 Minio 一套（Pig 中文件上传需要，可选）。或者阿里云、华为云、腾讯对象存储也可。

## 架构设计

### KubeSphere 架构

KubeSphere 将前端与后端分开，实现了面向云原生的设计，后端的各个功能组件可通过 REST API 对接外部系统。KubeSphere 无底层的基础设施依赖，可以运行在任何 Kubernetes、私有云、公有云、VM 或物理环境（BM）之上。 此外，它可以部署在任何 Kubernetes 发行版上。如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/f23add71-0796-4c31-9a87-7de57dc08851.png)

> 该图来自 KubeSphere 官网架构说明。

### Pig 架构

Pig 平台设计灵活可扩展、可移植、可应对高并发需求。同时兼顾本地化、私有云、公有云部署，支持 SaaS 模式应用。如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/faba1b41-e6b1-459b-8e79-dd0fe8917cbf.png)

> 该图来自 Pig 白皮书中的基础架构图。

### 整体架构图

其实就是将原架构加上一层 Ingress, 在 KubeSphere 中对应的是应用路由（Ingress 路由规则）和项目网关（Ingress Controller）。如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/a9416be1-90cc-4bf1-aa63-139a3cb0c929.png)

### 整体容器化部署流程图

运维人员可通过 KubeSphere 来管理服务，也可以利用 KubeSphere 中的 Jenkins 来发布制品。如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/20d39dca-bc13-423c-9ef2-05687c510c33.png)

## 部署过程

分别创建两条流水线，一条用于构建 Pig 后端 Java 代码，另外一条用于构建基于 Vue 的 Pig-ui 前端代码。

### 创建企业空间

为项目创建一个名称为 pig-workspace 的企业空间 , 企业空间是一个组织您的项目和 DevOps 项目、管理资源访问权限以及在团队内部共享资源等的逻辑单元，可以作为团队工作的独立工作空间。

![](https://pek3b.qingstor.com/kubesphere-community/images/e0aa9fa6-efb8-497a-b6c9-dd39bafb7522.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/abf5e6fb-61a2-4f85-897b-57d0f8ad5ca7.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/2e078216-6117-4e90-b97d-43c9e7773485.png)

### 创建 DevOps 项目

DevOps 项目是一个独立的命名空间，其中定义了一组流水线。用户可以按照自己的方式对流水线进行分组（例如：项目类型、组织类型）。

![](https://pek3b.qingstor.com/kubesphere-community/images/56f5580a-e6d7-4e4f-b7b6-f66c343fced8.png)

### 创建项目

项目用于对资源进行分组管理和控制不同用户的资源管理权限。

![](https://pek3b.qingstor.com/kubesphere-community/images/0bf17611-db4f-4a3a-a5de-453836c74116.png)

### 部署 MySQL

1) 进入应用商店，在应用分类中选择数据库和缓存，找到 MySQL。如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/8eea9d55-9f67-4fbe-a48b-80853c16ada2.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/c1751e21-80be-4c9f-83be-53999d59a7a4.png)

2) 在基本信息中，填写应用名称 pig-MySQL, 并选择位置，进行下一步。如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/8f677cee-3502-4cc5-90ac-d6dc7c31505e.png)

3) 在应用配置中，编辑 yaml 文件 , 将镜像改为 MySQL/MySQL-server:8.0.30，将密码设置为 root。如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/de473208-c31f-4311-8aec-7b40375c1268.png)

> MySQL 镜像采用 pig 项目 db 下 Dockerfile 中的版本，也可自己指定。

4) 点击安装：

![](https://pek3b.qingstor.com/kubesphere-community/images/a6885b2f-e7d3-478e-837f-429d9bdbfa9e.png)

5) 进入 pig-mysql 服务，编辑外部访问 , 从而访问 MySQL 导入 pig 的数据：

![](https://pek3b.qingstor.com/kubesphere-community/images/0bff01a8-ab1c-4c52-8734-c04b808184a5.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/29ea5a30-322c-47fa-9774-68e1051a3964.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/6e3eeadd-0ebe-4cad-a94d-d7c0853d19ce.png)

6) 进入 MySQL 容器，调整帐号允许从远程登陆：

![](https://pek3b.qingstor.com/kubesphere-community/images/69fcb1b4-8400-4ce6-8182-34ce8b3e075c.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/9cbc4ac0-d041-477b-881c-4323b6acf0a1.png)

登录 MySQL 进行授权操作：

```bash
$ MySQL -uroot -proot
$ use MySQL;
$ update user set host='%' where user='root';
$ flush privileges;
$ ALTER USER 'root'@'%' IDENTIFIED WITH MySQL_native_password BY 'root';
$ flush privileges;
```

7) 利用 Navicat 客户端连接 pig-mysql 服务，导入数据：

![](https://pek3b.qingstor.com/kubesphere-community/images/8f4915d9-95bc-4b7c-8f9f-0ba003e39fc7.png)

## 部署 Redis

1) 进入应用商店，在应用分类中选择数据库和缓存，找到 Redis。如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/587567d1-4a45-4b52-8f0c-f883302d8095.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/ba56795b-4a30-42cd-a709-9fa6cf2cd112.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/cea14892-5f08-4e75-93f8-91d4d2774ad8.png)

> 注：Pig 中默认使用无密码模式，因此可以暂时留空。生产环境不推荐将密码设置为空。

2) 安装成功后，如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/3f11873d-f435-44c9-98b7-205d697c81a1.png)

## 创建凭证

Pig 所依赖的后端微服务为无状态服务。利用 KubeSphere 服务创建 DevOps 流水线项目来部署这些微服务。

1) 创建 kubeconfig 凭证 , 如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/c12fe912-8b1e-404a-9618-c1490ae34e37.png)

> 名称自定义，需要和 Jenkinsfile 中的一致即可，内容默认或者去 /root/.kube 下复制。

2) 创建 Harbor 凭证 , 如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/f9ef91cd-054d-4576-8f45-8f416659c29a.png)

> 名称自定义，需要和 Jenkinsfile 中的一致即可。

3) 创建 gitlab 凭证 , 如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/ac939576-7201-4fd2-bb12-8f051ed8a930.png)

> 名称自定义，需要和 Jenkinsfile 中的一致即可。

全部凭证如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/c2731a18-018e-4fbb-8b58-9141254885d8.png)

## 设置 harbor 镜像仓库

新建一个 pig-dev 项目 , 如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/48bd9cce-d8c1-4be9-9d85-936930ee14d3.png)

## 部署 Pig 后端无状态服务

1) 新建 pig 后端流水线 , 如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/634e9271-bf37-459b-8c7a-efe52850c421.png)

选择代码仓库：

![](https://pek3b.qingstor.com/kubesphere-community/images/0f0f00c3-96b0-48aa-a513-04ccf40a4d90.png)

编辑设置：

![](https://pek3b.qingstor.com/kubesphere-community/images/620044ab-92bd-459c-8725-b4aa26893b58.png)

2) 代码中创建 Jenkinsfile 文件：

![](https://pek3b.qingstor.com/kubesphere-community/images/5634357b-c0bb-4738-b99d-78e25b2a469a.png)

内容如下：

```groovy
pipeline {
    agent {
        label 'maven'
    }

    parameters {
        choice(choices: ['dev', 'test', 'pre', 'pre2','prod'], name: 'Environments', description: '请选择要发布的环境：dev开发环境、test测试环境、pre预发布环境、pre2灰度环境、prod 生产环境')
        choice(choices: ['pig-gateway', 'pig-auth', 'pig-register', 'pig-upms-biz','pig-codegen', 'pig-monitor', 'pig-sentinel-dashboard', 'pig-xxl-job-admin','all'], name: 'ServicesDeploy', description: '请选择要构建的服务,支持单个服务发布或全部服务发布')
        choice(choices: ['no', 'yes'], name: 'sonarQube', description: '是否进行sonarQube代码质量检查,默认为no')
        string(name: 'MultiServicesBuild', defaultValue: 'no', description: '自由组合发布服务,如填写pig-gateway,pig-auth等,默认此项不生效,和ServicesDeploy只能选其一')
    }

    environment {
        HARBOR_CREDENTIAL_ID = 'harbor-id'
        GITLAB_CREDENTIAL_ID = 'gitlab'
        KUBECONFIG_CREDENTIAL_ID = 'pig-kubeconfig'
        REGISTRY = 'ip:端口'//harbor镜像仓库
        HARBOR_NAMESPACE = 'pig-dev'
        K8s_NAMESPACE = 'pig-dev'
    }

    stages {

        stage ('拉取代码') {
            steps {
                checkout(scm)
            }
        }

		stage('初始化变量') {
		  agent none
		  steps {
			container('maven') {
			  script {
				//自由组合发布
				if("${params.MultiServicesBuild}".trim() != "no") {
				  ServicesBuild = "${params.MultiServicesBuild}".split(",")
				  for (service in ServicesBuild) {
					println "now got ${service}"
				  }
				}else if("${params.ServicesDeploy}".trim() == "all"){
					ServicesBuildStr = 'pig-gateway,pig-auth,pig-register,pig-upms-biz,pig-codegen,pig-monitor,pig-sentinel-dashboard,pig-xxl-job-admin'
					ServicesBuild = "${ServicesBuildStr}".split(",")
				}else if("${params.ServicesDeploy}".trim() != "all"){
					ServicesBuild = "${params.ServicesDeploy}".split(",")
				}
			  }
			}
		  }
	    }
        stage('sonarQube代码质量检查') {
            steps {
                script {
                    if("${params.sonarQube}".trim() == "yes") {
                       for (service in ServicesBuild) {
                          def workspace = "pig-"
                          println "当前进行代码质量检查是：${service}"
                          if("${service}".trim() == "pig-gateway" || "${service}".trim() == "pig-auth" || "${service}".trim() == "pig-register"){
                              workspace = "${workspace}" + "${service}".trim().split("-")[1]
                           }
                          if("${service}".trim() == "pig-codegen" || "${service}".trim() == "pig-monitor" || "${service}".trim() == "pig-sentinel-dashboard" || "${service}".trim() == "pig-xxl-job-admin"){
                              workspace = "pig-visual/" + "${service}".trim()
                          }
                           if("${service}".trim() == "pig-upms-biz"){
                               workspace = "pig-upms/" + "${service}".trim()
                           }
                           //定义当前Jenkins的SonarQubeScanner工具
                           scannerHome = tool 'sonar-scanner'
                           //引用当前JenkinsSonarQube环境
                           withSonarQubeEnv('sonarqube9.4') {
                               sh """
                               cd ${workspace}
                               ${scannerHome}/bin/sonar-scanner
                           """
                           }
                       }
                    }else{
                        println "是no，跳过sonarQube代码质量检查"
                    }
                }
            }
        }

		stage('打包') {
			agent none
			steps {
				container('maven') {
				  script {
                    sh "mvn -Dmaven.test.skip=true clean package -P${params.Environments}"
				  }
				}
			}
		}

		stage('构建镜像') {
			agent none
			steps {
				container('maven') {
				  script {
                    for (service in ServicesBuild) {
                      def workspace = "pig-"
                      println "当前构建的镜像是：${service}"
                      stage ("build ${service}") {
                          if("${service}".trim() == "pig-gateway" || "${service}".trim() == "pig-auth" || "${service}".trim() == "pig-register"){
                              workspace = "${workspace}" + "${service}".trim().split("-")[1]
                           }
                          if("${service}".trim() == "pig-codegen" || "${service}".trim() == "pig-monitor" || "${service}".trim() == "pig-sentinel-dashboard" || "${service}".trim() == "pig-xxl-job-admin"){
                              workspace = "pig-visual/" + "${service}".trim()
                          }
                           if("${service}".trim() == "pig-upms-biz"){
                               workspace = "pig-upms/" + "${service}".trim()
                           }
                        sh "cd ${workspace} && docker build -f Dockerfile -t $REGISTRY/$HARBOR_NAMESPACE/${service}:$BUILD_NUMBER ."
                      }
                    }
				  }
				}
			}
		}

		stage('镜像推送') {
			agent none
			steps {
				container('maven') {
				  script {
					for (service in ServicesBuild) {
					  println "当前推送的镜像是：${service}"
					  stage ("push ${service}") {
						withCredentials([usernamePassword(passwordVariable : 'HARBOR_PASSWORD' ,usernameVariable : 'HARBOR_USERNAME' ,credentialsId : "$HARBOR_CREDENTIAL_ID" ,)]) {
							sh 'echo "$HARBOR_PASSWORD" | docker login $REGISTRY -u "$HARBOR_USERNAME" --password-stdin'
							sh "docker push  $REGISTRY/$HARBOR_NAMESPACE/${service}:$BUILD_NUMBER"
						}
					  }
					}
				  }
				}
			}
		}

		stage('推送镜像之latest') {
			agent none
			steps {
				container('maven') {
				  script {
					for (service in ServicesBuild) {
					  println "当前推送的latest镜像是：${service}"
					  stage ("pushLatest ${service}") {
						sh "docker tag  $REGISTRY/$HARBOR_NAMESPACE/${service}:$BUILD_NUMBER $REGISTRY/$HARBOR_NAMESPACE/${service}:latest"
						sh "docker push  $REGISTRY/$HARBOR_NAMESPACE/${service}:latest"
					  }
					}
				  }
				}
			}
		}

		stage('部署到dev环境') {
			 steps {
				 container ('maven') {
				   script {
					 for (service in ServicesBuild) {
                       //自定义的全局变量,也就是整个流水线可以去使用
                       env.APP_NAME = "${service}"
                       if("${service}".trim() == "pig-gateway") {
                          env.NODEPORT = 31201
                          env.PORT = 9999
                        }
                       if("${service}".trim() == "pig-auth") {
                          env.NODEPORT = 31202
                          env.PORT = 3000
                        }
                       if("${service}".trim() == "pig-register") {
                          env.NODEPORT = 31203
                          env.PORT = 8848
                        }
                       if("${service}".trim() == "pig-upms-biz") {
                          env.NODEPORT = 31204
                          env.PORT = 4000
                        }
                       if("${service}".trim() == "pig-codegen") {
                          env.NODEPORT = 31205
                          env.PORT = 5002
                        }
                       if("${service}".trim() == "pig-monitor") {
                          env.NODEPORT = 31206
                          env.PORT = 5001
                        }
                       if("${service}".trim() == "pig-sentinel-dashboard") {
                          env.NODEPORT = 31207
                          env.PORT = 5003
                        }
                       if("${service}".trim() == "pig-xxl-job-admin") {
                          env.NODEPORT = 31208
                          env.PORT = 5004
                        }

					   stage ("deploy ${service}") {
						println "即将部署的服务是 $APP_NAME"
						   withCredentials([
							   kubeconfigFile(
							   credentialsId: env.KUBECONFIG_CREDENTIAL_ID,
							   variable: 'KUBECONFIG')
							   ]) {
                                   if("${service}".trim() == "pig-register") {
                                       sh "envsubst < deploy/${params.Environments}/nacos-devops.yaml | kubectl apply -f -"
                                   }else{
                                       sh "envsubst < deploy/${params.Environments}/devops.yaml | kubectl apply -f -"
                                   }
						   }
					   }
					 }
				   }
				 }
			 }
		}


	}

}
```

> 通过 ${service} 来判断最终选择哪个 deploy 来部署。

3) 代码中创建 devops.yaml 部署文件：

![](https://pek3b.qingstor.com/kubesphere-community/images/bbbda9e8-06f4-40e8-960e-c0cf5544d77b.png)

内容如下：

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: $APP_NAME
  name: $APP_NAME
  namespace: $K8s_NAMESPACE
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  selector:
    matchLabels:
      app: $APP_NAME
  template:
    metadata:
      labels:
        app: $APP_NAME
    spec:
      containers:
        - image: $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:$BUILD_NUMBER
          imagePullPolicy: Always
          name: $APP_NAME
          ports:
            - containerPort: $PORT
              protocol: TCP
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: $APP_NAME
  name: $APP_NAME
  namespace: $K8s_NAMESPACE
spec:
  ports:
    - name: http
      port: $PORT
      protocol: TCP
      targetPort: $PORT
      nodePort: $NODEPORT
  selector:
    app: $APP_NAME
  sessionAffinity: None
  type: NodePort
```

4) 代码中创建 nacos-devops.yaml 部署文件：

由于 pig-register 服务是 nacos 服务，其 K8s 的 yaml 部署应该和其他服务不同，采用 StatefulSet 来部署且副本数为 3，, 并添加相对应的端口。

内容如下：

```yaml
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app: $APP_NAME
  name: $APP_NAME
  namespace: $K8s_NAMESPACE
spec:
  serviceName: $APP_NAME
  replicas: 3
  selector:
    matchLabels:
      app: $APP_NAME
  template:
    metadata:
      labels:
        app: $APP_NAME
      annotations:
        pod.alpha.kubernetes.io/initialized: "true"
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: "app"
                    operator: In
                    values:
                      - nacos
              topologyKey: "kubernetes.io/hostname"
      containers:
        - image: $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:$BUILD_NUMBER
          imagePullPolicy: Always
          name: $APP_NAME
          ports:
            - containerPort: 8848
              name: client-port
            - containerPort: 9848
              name: client-rpc
            - containerPort: 9849
              name: raft-rpc
            - containerPort: 7848
              name: old-raft-rpc
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Always
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: $APP_NAME
  name: $APP_NAME
  namespace: $K8s_NAMESPACE
  annotations:
    service.alpha.kubernetes.io/tolerate-unready-endpoints: "true"
spec:
  ports:
    - port: 8848
      protocol: TCP
      name: server
      targetPort: 8848
      nodePort: $NODEPORT
    - port: 9848
      name: client-rpc
      targetPort: 9848
    - port: 9849
      name: raft-rpc
      targetPort: 9849
    ### 兼容1.4.x版本的选举端口
    - port: 7848
      name: old-raft-rpc
      targetPort: 7848
  selector:
    app: $APP_NAME
  sessionAffinity: None
  type: NodePort
```

> 后续这些文件都可可采用共享仓库来统一管理。

5) 发布

由于 pig-gateway、pig-auth 和 pig-upms-biz 等其它服务都是依赖 nacos(pig-register) 服务的，所以我们先发布 pig-register 服务。

进入 DevOps 项目 -> pig-dev -> pig-backend-dev -> 运行。

![](https://pek3b.qingstor.com/kubesphere-community/images/f39d7356-3a60-47c5-9fa8-a80a18832c71.png)

> 这里 KubeSphere3.3.0 版本中有个 bug，choice 类型的还是识别为 string，所以暂时只能手动输入。此 bug 将会在 3.3.1 版本修复。

![](https://pek3b.qingstor.com/kubesphere-community/images/04898bd6-11d6-4275-b309-239a178d9a0f.png)

查看任务状态：

![](https://pek3b.qingstor.com/kubesphere-community/images/5343ffc0-697f-477a-b72b-33ba709ddd19.png)

查看日志：

![](https://pek3b.qingstor.com/kubesphere-community/images/92bba4cb-d49b-4c5b-94c8-4e1e59a24693.png)

在项目 -> 应用负载 -> 服务下查看刚发布的 pig-register 服务：

![](https://pek3b.qingstor.com/kubesphere-community/images/ad6a86ae-14c6-43e5-8c48-a62ae0f884e7.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/7f9892f1-545a-4c11-a10a-c389b0547854.png)

进入 DevOps 项目 -> pig-dev -> pig-backend-dev -> 运行 -> 选择自由组合发布：

![](https://pek3b.qingstor.com/kubesphere-community/images/f3cd8d56-db90-4819-9cd0-b67974a0a0f4.png)

发布完成查看服务：

![](https://pek3b.qingstor.com/kubesphere-community/images/253edbb2-212c-48be-aa18-46b9eef45908.png)

> 至此已经完成 Pig 后端无状态服务的部署。

## 部署 Pig 前端无状态服务

1) 新建 pig 前端流水线 , 如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/83ee947b-a951-4fbc-8cd1-95481ba50303.png)

选择代码仓库：

![](https://pek3b.qingstor.com/kubesphere-community/images/3e0305e6-610e-464d-baf2-f83afa86c507.png)

编辑设置：

![](https://pek3b.qingstor.com/kubesphere-community/images/55c1d451-a031-454a-aff0-abf4c62bf9de.png)

2) 代码中创建 Jenkinsfile 文件：

![](https://pek3b.qingstor.com/kubesphere-community/images/eb803dba-adba-4037-8894-e0d30752f9bc.png)

内容如下：

```groovy
pipeline {
  agent {
    node {
      label 'nodejs'
    }
  }

    parameters {
        choice(choices: ['dev', 'test', 'pre', 'pre2','prod'], name: 'Environments', description: '请选择要发布的环境：dev开发环境、test测试环境、pre预发布环境、pre2灰度环境、prod 生产环境')
        choice(choices: ['no', 'yes'], name: 'sonarQube', description: '是否进行sonarQube代码质量检查,默认为no')
    }

    environment {
        HARBOR_CREDENTIAL_ID = 'harbor-id'
        GITLAB_CREDENTIAL_ID = 'gitlab'
        KUBECONFIG_CREDENTIAL_ID = 'pig-kubeconfig'
        REGISTRY = 'ip:端口'//harbor镜像仓里
        HARBOR_NAMESPACE = 'pig-dev'
        APP_NAME = 'pig-front'
        K8s_NAMESPACE = 'pig-dev'
    }

    stages {
        stage ('拉取代码') {
            steps {
                container('nodejs') {
                   checkout(scm)
                }
            }
        }

        stage('sonarQube代码质量检查') {
            steps {
                script {
                    if("${params.sonarQube}".trim() == "yes") {
                       println "当前进行代码质量检查是：${APP_NAME}"
                       //定义当前Jenkins的SonarQubeScanner工具
                       scannerHome = tool 'sonar-scanner'
                       //引用当前JenkinsSonarQube环境
                       withSonarQubeEnv('sonarqube9.4') {
                           sh """
                           cd .
                           ${scannerHome}/bin/sonar-scanner
                       """
                       }
                    }else{
                        println "是no，跳过sonarQube代码质量检查"
                    }
                }
            }
        }

        stage('项目编译') {
            agent none
            steps {
                container('nodejs') {
                    sh 'node -v'
                    sh 'npm -v'
                    sh 'npm install'
                    sh 'npm run build:docker'
                    sh 'ls'
                }

            }
        }

        stage('构建镜像') {
            agent none
            steps {
                container('nodejs') {
                    sh 'ls'
                    sh 'cd ./docker && docker  build  -t $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:$APP_NAME-$BUILD_NUMBER .'
                }

            }
        }

        stage('镜像推送') {
            agent none
            steps {
                container('nodejs') {
                    withCredentials([usernamePassword(passwordVariable : 'HARBOR_PASSWORD' ,usernameVariable : 'HARBOR_USERNAME' ,credentialsId : "$HARBOR_CREDENTIAL_ID" ,)]) {
                        sh 'echo "$HARBOR_PASSWORD" | docker login $REGISTRY -u "$HARBOR_USERNAME" --password-stdin'
                        sh 'docker push  $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:$APP_NAME-$BUILD_NUMBER'
                    }
                }

            }
        }

        stage('推送镜像之latest') {
            agent none
            steps {
                container('nodejs') {
                  sh 'docker tag  $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:$APP_NAME-$BUILD_NUMBER $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:latest '
                  sh 'docker push  $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:latest '

                }

            }
        }

         stage('部署到dev环境') {
              steps {
                  container ('nodejs') {
                       withCredentials([
                           kubeconfigFile(
                           credentialsId: env.KUBECONFIG_CREDENTIAL_ID,
                           variable: 'KUBECONFIG')
                           ]) {
                           sh "envsubst < deploy/${params.Environments}/devops.yaml | kubectl apply -f -"
                       }
                  }
              }
         }
    }
}

```

3) 代码中创建 devops.yaml 部署文件：

![](https://pek3b.qingstor.com/kubesphere-community/images/bc576a7b-4ef8-4e10-ab69-dbd3bd4ff4fb.png)

内容如下：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: $APP_NAME
  name: $APP_NAME
  namespace: $K8s_NAMESPACE
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  selector:
    matchLabels:
      app: pig-front
  strategy:
    rollingUpdate:
      maxSurge: 50%
      maxUnavailable: 50%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: pig-front
    spec:
      containers:
        - image: $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:$APP_NAME-$BUILD_NUMBER
          imagePullPolicy: Always
          name: pig-front-end
          ports:
            - containerPort: 80
              protocol: TCP
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: $APP_NAME
  name: $APP_NAME
  namespace: $K8s_NAMESPACE
spec:
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 80
      nodePort: 31200
  selector:
    app: $APP_NAME
  sessionAffinity: None
  type: NodePort
```

> 后续这些文件都可可采用共享仓库来统一管理。

4) 发布：

![](https://pek3b.qingstor.com/kubesphere-community/images/78390f9f-be17-4205-8d75-a9f63745585c.png)

> 这里 KubeSphere3.3.0 版本中有个 bug，choice 类型的还是识别为 string，此 bug 将会在 3.3.1 版本修复。

![](https://pek3b.qingstor.com/kubesphere-community/images/4d5a28e1-4176-430d-9101-a8d723a95333.png)

查看任务状态：

![](https://pek3b.qingstor.com/kubesphere-community/images/25565d31-311d-4432-aa25-51692599a687.png)

查看日志：

![](https://pek3b.qingstor.com/kubesphere-community/images/1f9e7421-127d-403f-8bb2-175327e85513.png)

在项目 -> 应用负载 -> 服务下查看刚发布的 pig-front 服务。

![](https://pek3b.qingstor.com/kubesphere-community/images/73125a61-53fa-477a-b0ec-cea99cc396f3.png)

至此所有的服务均已发布完成。

![](https://pek3b.qingstor.com/kubesphere-community/images/b17e2d0b-707c-4316-bff8-73471915102e.png)

### 利用 KubeSphere 中的 Jenkins 发布

访问 `ip:30180`（账号：admin，密码：P@88w0rd）：

![](https://pek3b.qingstor.com/kubesphere-community/images/826b327e-afba-4213-b25b-25988c02fe8c.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/4b51e14f-4e77-41c3-a260-b04e70adb29d.png)

可以打开 Blue Ocean 查看状态：

![](https://pek3b.qingstor.com/kubesphere-community/images/47a07a33-9831-4ac3-b6bf-4ec161ce0130.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/a5324900-d31a-42b8-b772-61c4a9e34751.png)

## 通过 NodePort 方式暴露集群内部容器服务

NodePort 设计之初就不建议用于生产环境暴露服务，所以默认端口都是一些大端口，如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/8747dd92-3fca-449e-8e0f-5ed8adcc0deb.png)

输入 node ip + 31200 访问：

![](https://pek3b.qingstor.com/kubesphere-community/images/d4499704-061d-4a91-8a38-66b207e5c44c.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/f7ef0f6a-b4b1-4537-8856-9d232eaa81d8.png)

## 优化和改进

### 通过探针优雅的解决部署过程中服务平滑过渡问题

若是只有一个副本的情况下，新的 Pod 启动成功时，开始停掉旧的 Pod, 但是我们看到的 running 状态，并不以为着我们的服务是正常的。若是这个时候杀死旧的 Pod, 那么将有新的 Pod 接受请求，这个时候会出现服务短暂不可用状态，所以需要增加探来确保我们的服务已经正常了，可以接收并处理用户请求。我们常用的探针如下：

#### livenessProbe：存活性探测

许多应用程序经过长时间运行，最终过渡到无法运行的状态，除了重启，无法恢复。通常情况下，K8s 会发现应用程序已经终止，然后重启应用程序 pod。有时应用程序可能因为某些原因（后端服务故障等）导致暂时无法对外提供服务，但应用软件没有终止，导致 K8s 无法隔离有故障的 pod，调用者可能会访问到有故障的 pod，导致业务不稳定。K8s 提供 livenessProbe 来检测容器是否正常运行，并且对相应状况进行相应的补救措施。

#### readinessProbe：就绪性探测

在没有配置 readinessProbe 的资源对象中，pod 中的容器启动完成后，就认为 pod 中的应用程序可以对外提供服务，该 pod 就会加入相对应的 service，对外提供服务。但有时一些应用程序启动后，需要较长时间的加载才能对外服务，如果这时对外提供服务，执行结果必然无法达到预期效果，影响用户体验。比如使用 tomcat 的应用程序来说，并不是简单地说 tomcat 启动成功就可以对外提供服务的，还需要等待 spring 容器初始化，数据库连接上等等。

**1) SpringBoot 的 actuator**

其实 actuator 是用来帮助用户监控和操作 SprinBoot 应用的，这些监控和操作都可以通过 http 请求实现，如下图，http://localhost:7777/actuator/health 地址返回的是应用的健康状态。

![](https://pek3b.qingstor.com/kubesphere-community/images/20091db7-a6c4-4d0a-a77c-6372b894554e.png)

需引以下 maven:

```xml
<!-- 引入Actuator监控依赖 -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

> 在 SpringBoot-2.3 版本中，actuator 新增了两个地址：/actuator/health/liveness 和 /actuator/health/readiness，前者用作 Kubernetes 的存活探针，后者用作 Kubernetes 的就绪探针 , 需要先在配置文件中开启，如下：

```yaml
management:
  endpoint:
    health:
      probes:
        enabled: true
  health:
    livenessstate:
      enabled: true
    readinessstate:
      enabled: true
```

> /actuator/health/ 和 /actuator/health/ 是默认开启的。

![](https://pek3b.qingstor.com/kubesphere-community/images/babcd72f-6e6d-46c3-a93d-d87b9a847d1f.png)

利用 SpringBoot 的接口来作为容器探针的健康检测 , 按照如下就可以：

```yaml
readinessProbe:
initialDelaySeconds: 20
periodSeconds: 10
timeoutSeconds: 5
failureThreshold: 6
httpGet:
  scheme: HTTP
  port: 9999
  path: /actuator/health/readiness
livenessProbe:
initialDelaySeconds: 30
periodSeconds: 10
timeoutSeconds: 5
failureThreshold: 6
httpGet:
  scheme: HTTP
  port: 9999
  path: /actuator/health/liveness
```

**2) pig 后端项目增加探针**

pig 项目全局所有的模块都会引入 Actuator 监控依赖，如下：

```xml
<!--监控-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

调整 pig 项目后端 devops.yaml, 增加以下内容：

```yaml
...
          readinessProbe:
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            httpGet:
              scheme: HTTP
              port: $PORT
              path: /actuator/health
          livenessProbe:
            initialDelaySeconds: 40
            periodSeconds: 10
            timeoutSeconds: 5
            httpGet:
              scheme: HTTP
              port: $PORT
              path: /actuator/health
...

```

完整 devops.yaml 内容如下：

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: $APP_NAME
  name: $APP_NAME
  namespace: $K8s_NAMESPACE
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  selector:
    matchLabels:
      app: $APP_NAME
  template:
    metadata:
      labels:
        app: $APP_NAME
    spec:
      containers:
        - image: $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:$BUILD_NUMBER
          imagePullPolicy: Always
          name: $APP_NAME
          ports:
            - containerPort: $PORT
              protocol: TCP
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          readinessProbe:
            initialDelaySeconds: 90
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
            httpGet:
              scheme: HTTP
              port: $PORT
              path: /actuator/health
          livenessProbe:
            initialDelaySeconds: 100
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
            httpGet:
              scheme: HTTP
              port: $PORT
              path: /actuator/health
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: $APP_NAME
  name: $APP_NAME
  namespace: $K8s_NAMESPACE
spec:
  ports:
    - name: http
      port: $PORT
      protocol: TCP
      targetPort: $PORT
      nodePort: $NODEPORT
  selector:
    app: $APP_NAME
  sessionAffinity: None
  type: NodePort
```

> 注： /actuator/health/readiness 和 /actuator/health/liveness 也可以用，需在配置文件中开启。若是内存、CPU 限制过低，需要调整 initialDelaySeconds 时间，否则会出现还未启动成功，就开始探测，会进入循环，直到探测失败（就是 failureThreshold 定义的次数），要掌握好这个时间的度。

重新发布 pig-geteway 测试：

![](https://pek3b.qingstor.com/kubesphere-community/images/ebea2b43-16a0-4d60-b1c3-b1b8a06e504c.png)

正在进行探测：

![](https://pek3b.qingstor.com/kubesphere-community/images/ee68567a-983e-4b29-b8ea-2661d8d72b29.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/a8bb2922-77d2-4e93-9bc6-92a2f7d3096c.png)

探测成功，新的 Pod 可用，旧的 Pod 删除：

![](https://pek3b.qingstor.com/kubesphere-community/images/17f70f57-b232-41cc-b68d-f8b205c333f1.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/aa6a123b-6d53-42c6-a1c9-70bff246ab19.png)

**3) pig 前端项目增加探针**

前端项目我们直接探测 Nginx 的端口即可。调整 devops.yaml, 增加如下内容：

```yaml
          readinessProbe:
            initialDelaySeconds: 20
            periodSeconds: 10
            timeoutSeconds: 5
            httpGet:
              scheme: HTTP
              port: 80
              path: /
          livenessProbe:
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            httpGet:
              scheme: HTTP
              port: 80
              path: /
```

完整 devops.yaml 如下：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: $APP_NAME
  name: $APP_NAME
  namespace: $K8s_NAMESPACE
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  selector:
    matchLabels:
      app: pig-front
  strategy:
    rollingUpdate:
      maxSurge: 50%
      maxUnavailable: 50%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: pig-front
    spec:
      containers:
        - image: $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:$APP_NAME-$BUILD_NUMBER
          imagePullPolicy: Always
          name: pig-front-end
          ports:
            - containerPort: 80
              protocol: TCP
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          readinessProbe:
            initialDelaySeconds: 20
            periodSeconds: 10
            timeoutSeconds: 5
            httpGet:
              scheme: HTTP
              port: 80
              path: /
          livenessProbe:
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            httpGet:
              scheme: HTTP
              port: 80
              path: /
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: $APP_NAME
  name: $APP_NAME
  namespace: $K8s_NAMESPACE
spec:
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 80
      nodePort: 31200
  selector:
    app: $APP_NAME
  sessionAffinity: None
  type: NodePort
```

![](https://pek3b.qingstor.com/kubesphere-community/images/aa026e83-71fb-4866-ba02-29664cc91c78.png)

### 通过探针优雅的解决服务部署过程中注册中心服务平滑过渡问题

我们后端采用 Spring Cloud（Spring Cloud Alibaba）微服务结构技术路线进行开发，采用 Nacos 作为注册中心。而服务注册到 Nacos 是需要时间的。而一般的容器探测只是探测服务是否达到了可用的状态，没有考虑到注册到注册中心的服务是否可用，其实在多副本的情况下只要控制好滚动更新策略，应该不会出现这种情况的。在 Nacos 中也是有负载均衡的，Nacos 实现负载均衡是通过内置的 Ribbon 实现的。像 Gateway 网关服务尤其重要，因为它还要负责服务转发。所以保证这种服务的可用性也变得尤为重要。

例如单副本 Gateway 网关服务，若是在开始探测时，网关服务并没有及时注册到注册中心里，这个时候开始测探，服务本身是可用的，那么探测成功后，新的 Pod 变成了 running 状态，便停掉了第一个 Pod，而注册中心中的服务其实并不可用，会出现短暂服务不可用。

其实健康探测我们还可以往前走一步，把服务成功注册到注册中心中作为服务可用的状态。

**自己编写容器探针接口：**

```java
/**
 * @author 小盒子
 * @version 1.0
 * @description: 容器探针接口，用来进行探测服务是否注册进入注册中心
 * @date 2022/10/22 10:58
 */
@Slf4j
@RestController
@RequestMapping("nacos")
public class HealthController {
    @Autowired
    private DiscoveryClient discoveryClient;

    @GetMapping("/health/{services}")
    public ResponseEntity<Object> getService(@PathVariable("services")String services) throws NacosException {
        //从nacos中根据serverId获取实例 方法一（采用此方法，DiscoveryClient 代表的就是：服务发现操作对象）
        if (StringUtils.isBlank(services)){
            return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
        }
        List<ServiceInstance> instances = discoveryClient.getInstances(services);
        Map<String, Integer> ipMap = new HashMap<>();
        if (instances.size() > 0){
            instances.forEach(key ->{
                ipMap.put(key.getHost(), key.getPort());
            });
        }
        //从nacos中根据serverId获取实例 方法二 采用nacos的java的SDK
//        Properties properties = new Properties();
//        properties.put("serverAddr", "192.168.4.25:8849");
//        properties.put("namespace", "caseretrieval-dev");
//        NamingService naming = NamingFactory.createNamingService(properties);
//        List<Instance> instancesList = naming.selectInstances("case-gateway", true);
        //从nacos中根据serverId获取实例 方法三，采用nacos的OPEN-api
        //http://192.168.4.25:8849/nacos/v1/ns/instance/list?serviceName=case-gateway&namespaceId=caseretrieval-dev
        //获取本机IP地址
        String hostAddress = "127.0.0.1";
        try {
            InetAddress localHost = InetAddress.getLocalHost();
            hostAddress = localHost.getHostAddress();
            log.info("当前服务本机ip是："+hostAddress);
        } catch (UnknownHostException e) {
            log.error(e.getMessage(), e);
        }
        //查看本机服务是否已经注册到nacos中
        if (ipMap.containsKey(hostAddress)){
            return new ResponseEntity<Object>(HttpStatus.OK);
        }else {
            return new ResponseEntity<Object>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
```

> 其实正常情况下，合理的滚动更新策略，加上就绪性探测、存活性探测或者启动探测就能达到目标了，也不必这么麻烦。

### 通过 Ingress 方式暴露集群内部容器服务

如果需要从集群外部访问服务，即将服务暴露给用户使用，KubernetesService 本身提供了两种方式，一种是 NodePort ，另外一种是 LoadBalancer 。另外 Ingress 也是一种常用的暴露服务的方式。

KubeSphere 的项目网关就是 IngressController ，是一个七层负载均衡调度器，客户端的请求先到达这个七层负载均衡调度器，KubeSphere 中的应用路由就是 Ingress ，是定义规则的。数据包走向如下图流程所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/a189e6ef-74b8-4da4-b5a0-88c763eefd54.png)

#### 开启项目网关

对项目中的外网访问网关以及服务治理等配置进行设置和管理。

![](https://pek3b.qingstor.com/kubesphere-community/images/d831cda1-e47f-45e8-808c-814350f20e57.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1ac36a74-00d1-4386-bb99-ad37433c4706.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/d95bd4ff-96bc-4b1b-b264-bcea278628e1.png)

> KubeSphere 中的项目网关，开启后会自动安装 IngressController。

对应在 K8s 集群中 svc 如下图所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/dbea48f5-edee-4ca7-817b-bcf80bd457bd.png)

KubeSphere 中应用路由是需要手动创建的，如下图所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/8c87a631-6886-476f-83a8-6c7efdadd973.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/347ddd41-fbac-41c8-9f8b-93d3fee6554b.png)

#### 设置路由规则

![](https://pek3b.qingstor.com/kubesphere-community/images/f4d7f58a-20a6-4259-aefe-e036974cd99a.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/6ab8c2dc-d103-4996-85d5-34a71a53332d.png)

> 指定自定义域名并通过本地 hosts 文件或 DNS 服务器将域名解析为网关 IP 地址。

#### 访问 http://pig.com:32576/

![](https://pek3b.qingstor.com/kubesphere-community/images/f0146856-95b8-4b8e-b11d-0eb14942889f.png)

### 将 SonarQube 集成到流水线

SonarQube 是一种主流的代码质量持续检测工具。您可以将其用于代码库的静态和动态分析。SonarQube 集成到 KubeSphere(Jenkins) 流水线后，如果在运行的流水线中检测到问题，您可以直接在仪表板上查看常见代码问题，例如 Bug 和漏洞。

在日常开发中 SonarQube 往往是基于现有的 Gitlab、Jenkins 集成配合使用的，以便在项目拉取代码后进行代码审查。若是存在多套环境的情况下，例如有开发环境、测试环境、生产环境等，我是不建议在生产环境中去进行代码审查的，一来进行重复的代码审查没有意义，二来比较浪费时间，所以建议只在开发环境开启代码审查即可。

#### 在 Jenkins 中集成 SonarQube

微服务项目中需要在每个项目下都建立 sonar-project.properties 文件，在 Jenkins 的脚本中需要循环去 checking 每个微服务。

1) 在 sonarQube 中生成 token

![](https://pek3b.qingstor.com/kubesphere-community/images/ab423df8-5450-445f-9edb-ef3ea2e53217.png)

2) 在 Jenkins 中安装 SonarQube Scanner 插件

![](https://pek3b.qingstor.com/kubesphere-community/images/3fe3869f-e90c-490a-8b6f-73d7c0e03314.png)

3) 在 Jenkins 中添加 SonarQube 凭证

![](https://pek3b.qingstor.com/kubesphere-community/images/e102fcef-fc0a-4542-83c8-99a8c7349924.png)
> 选择 Secret text 作为凭证类型。

完成后如下所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/eff5d0da-fd37-4e5c-8ab7-c9c23c97fab4.png)

4) 在 Jenkins 系统配置中配置 SonarQube

![](https://pek3b.qingstor.com/kubesphere-community/images/e4dbeda3-0139-4d6b-b95a-1af85dec03a7.png)

5) 在 Jenkins 全工具中安装 SonarQube Scanner 

![](https://pek3b.qingstor.com/kubesphere-community/images/eb9c41a4-37bf-4e49-aba1-fee590083e4b.png)
> sonar-scanner 名称自定义，在 jenkinsfile 中要保持一直。

6) 关闭审查结果上传 SCM 功能

![](https://pek3b.qingstor.com/kubesphere-community/images/45cc3cba-7f94-41b7-aaee-e73226bf2bc4.png)

#### 后端代码审查

1) 调整 Jenkins 脚本

微服务项目中需要在每个项目下都建立 sonar-project.properties 文件，在 Jenkins 的脚本中需要循环去 checking 每个微服务。

如以下示例：

```groovy
        stage('sonarQube代码质量检查') {
            steps {
                script {
                    if("${params.sonarQube}".trim() == "yes") {
                       for (service in ServicesBuild) {
                          def workspace = "pig-"
                          println "当前进行代码质量检查是：${service}"
                          if("${service}".trim() == "pig-gateway" || "${service}".trim() == "pig-auth" || "${service}".trim() == "pig-register"){
                              workspace = "${workspace}" + "${service}".trim().split("-")[1]
                           }
                          if("${service}".trim() == "pig-codegen" || "${service}".trim() == "pig-monitor" || "${service}".trim() == "pig-sentinel-dashboard" || "${service}".trim() == "pig-xxl-job-admin"){
                              workspace = "pig-visual/" + "${service}".trim()
                          }
                           if("${service}".trim() == "pig-upms-biz"){
                               workspace = "pig-upms/" + "${service}".trim()
                           }
                           //定义当前Jenkins的SonarQubeScanner工具
                           scannerHome = tool 'sonar-scanner'
                           //引用当前JenkinsSonarQube环境
                           withSonarQubeEnv('sonarqube9.4') {
                               sh """
                               cd ${workspace}
                               ${scannerHome}/bin/sonar-scanner
                           """
                           }
                       }
                    }else{
                        println "是no，跳过sonarQube代码质量检查"
                    }
                }
            }
        }
```
> 注：sonar-scanner 和 sonarqube9.4 名称需和 Jenkins 中配置的一致。

2) 新建 sonar-project.properties 文件

以 pig-gateway 为例，在 pig 项目中新增 sonar-project.properties 文件。

![](https://pek3b.qingstor.com/kubesphere-community/images/855b6cf6-fd5d-433e-8aac-79083d89df0d.png)

内容如下：

```toml
#项目的key(自定义)
sonar.projectKey=pig-gateway
#项目名称
sonar.projectName=pig-gateway
#项目版本号
sonar.projectVersion=1.0

#需要分析的源码的目录，多个目录用英文逗号隔开
sonar.sources=.
#需要忽略的目录
sonar.exclusions=**/test/**,**/target/**
## 字节码文件所在位置
sonar.java.binaries=.

sonar.java.source=1.8
sonar.java.target=1.8
#sonar.java.libraries=**/target/classes/**

## Encoding of the source code. Default is default system encoding
sonar.sourceEncoding=UTF-8
```

发布测试：

![](https://pek3b.qingstor.com/kubesphere-community/images/ed6b41c7-2cb7-4fa3-9c14-ccc77ec20bd9.png)

在 Jenkins 中查看：

![](https://pek3b.qingstor.com/kubesphere-community/images/f207282b-3fea-47c5-951f-06e7e177cf20.png)

在 SonarQube 中查看代码检测情况：

![](https://pek3b.qingstor.com/kubesphere-community/images/a7c9824c-446e-4fda-8e99-a9de4f895101.png)
> pig-gateway 的代码质量还是很错的，不过有一个漏洞哦。

#### 前端代码审查

1) 调整 Jenkins 脚本

```groovy
        stage('sonarQube代码质量检查') {
            steps {
                script {
                    if("${params.sonarQube}".trim() == "yes") {
                       println "当前进行代码质量检查是：${APP_NAME}"
                       //定义当前Jenkins的SonarQubeScanner工具
                       scannerHome = tool 'sonar-scanner'
                       //引用当前JenkinsSonarQube环境
                       withSonarQubeEnv('sonarqube9.4') {
                           sh """
                           cd .
                           ${scannerHome}/bin/sonar-scanner
                       """
                       }
                    }else{
                        println "是no，跳过sonarQube代码质量检查"
                    }
                }
            }
        }
```

2) 新建 sonar-project.properties 文件

![](https://pek3b.qingstor.com/kubesphere-community/images/bb601e1f-492e-4598-853b-085edfee25b0.png)

内容如下：

```toml
sonar.projectKey=pig_ui
sonar.projectName=pig_ui
sonar.projectVersion=1.0
sonar.sources=.
```

发布测试：

![](https://pek3b.qingstor.com/kubesphere-community/images/4733f5bc-e0b6-40a6-965c-ad5494c20f9e.png)

在 Jenkins 中查看：

![](https://pek3b.qingstor.com/kubesphere-community/images/723a6c74-66ce-41d2-9929-38f0e452f9de.png)

在 SonarQube 中查看代码检测情况：

![](https://pek3b.qingstor.com/kubesphere-community/images/8cf60ee9-5aca-45cb-b1f0-5a0ab1902655.png)

