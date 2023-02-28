---
title: 'KubeSphere 与 Jenkins 的集成解析'
tag: 'KubeSphere, Kubernetes'
keywords: 'KubeSphere, Kubernetes, Jenkins'
description: '这篇文章主要介绍了如何将 Kubesphere 和 Jenkins 集成起来，实现 CI/CD 流程的自动化。'
createTime: '2023-02-24'
author: 'gfengwong'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-jenkins-cover-2023.png'
---

> 作者：gfengwong

## KubeSphere 的 DevOps 模块介绍

- KubeSphere 使用可插拔的 DevOps 模块实现 DevOps 功能；
- DevOps 驱动 Jenkins 实现具体的操作，例如流水线等。

DevOps 与 KubeSphere 的关系如下图, 详细的[组件介绍](https://kubesphere.io/docs/v3.3/introduction/architecture/)。

![](https://pek3b.qingstor.com/kubesphere-community/images/20190810073322.png)

## 集成的亮点

DevOps 与 Jenkins 集成紧密且优雅，从构建、部署到使用维护纯云原生方式实现：

- 一键部署；
- 一个参数启用 DevOps 功能；
- 一个 K8s 集群内即可完成从 Jenkins、流水线的全生命周期。

## 具体集成说明

用户使用 KubeSphere 平台的 DevOps 功能时，调用 devops-api 发送请求，DevOps 收到请求后，部分请求直接调用 jenkins 进行操作，部分请求通过更新 devops-controller 监听的资源，通过 devops-controller 来操作 Jenkins。

运行流水线阶段，Jenkins 配置了 K8s 动态 slave：

- Jenkins pod 信息(镜像、卷等)发送给 K8s；
- K8s 启动 Jenkins slave pod 并通过远程协议与 Jenkins master 建立连接；
- 运行流水线；
- 运行完毕之后根据设置删除/保留创建的 pod。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-devops-3-0.png)

### Jenkins 镜像构建

Jenkins 本身是一个 Java 应用，当前也没有提供官方的云原生方案，KubeSphere 通过下面几个项目定制了自己的镜像：

- [custom-war-packager](https://github.com/jenkinsci/custom-war-packager) 定制自己的 Jenkins 并生成 Docker 镜像或者 war 镜像；
- [formulas](https://github.com/jenkins-zh/jenkins-formulas) 通过 formula.yaml 定制自己的 Jenkins，针对中国区优化；
- [ks-jenkins](https://github.com/kubesphere/ks-jenkins/blob/master/formula.yaml) 定制了 KubeSphere 自己的 Jenkins 镜像 使用了 jcli 集成了 cwp。

ks-devops 项目中的 formulas 安装了所有需要的 Jenkins 插件主要有

- Blue Ocean 提供了 Jenkins 的 restful API；
- [kubernetes](https://plugins.jenkins.io/kubernetes/) 提供了动态 slave 能力；
- [kubesphere-token-auth](https://javadoc.jenkins.io/plugin/kubesphere-token-auth/) 集成 KubeSphere 权限体系；
- 其他。

### Jenkins 与 DevOps 的部署

ks-installer（Ansible） 生成环境变量，主要有：

- 要不要使用 ksauth；
- 生成 ksauth 使用的密码；
- 主要环境变量在 https://github.com/kubesphere/ks-installer/blob/master/roles/ks-devops/templates/ks-devops-values.yaml.j2 ;
- helm 部署 DevOps 和 [Jenkins helm 项目](https://github.com/kubesphere-sigs/ks-devops-helm-chart)。

#### ks-devops-helm-chart：

这个项目里面主要有三个 chart。

1. DevOps

部署 devops-apiserver 和 devops-controller。

> 注意 ⚠️ 这里有一个 cronjob 作用为清理执行过的流水线记录，定期执行 `ks pip gc`。

主要部署的资源有：

- deployment
  - devops-apiserver
  - devops-controller
- cronjob
  - devops
- configmap
  - devops-config
  - jenkins-agent-config

2. Jenkins

**Jenkins 配置：**

- Maven 配置 `charts/ks-devops/charts/jenkins/templates/jenkins-agent-config.yaml`

- 配置 Jenkins dynamic slave `charts/ks-devops/charts/jenkins/templates/jenkins-casc-config.yml`
  - 自动化配置 Jenkins Configure Clouds
  - 配置 K8s 认证
  - 配置 pod volume image lable 等
  - 会将上面的 Maven 配置挂在到 Maven 容器中
  
- 将 Maven 配置和 casc 配置以 configmap 的方式挂在到 Jenkins 容器的 `/var/jenkins_home/casc_configs`， 从 helm 的 value 获取

- value.yaml `charts/ks-devops/charts/jenkins/values.yaml` 中定义了：
  - 环境变量 从 value 读出配置到容器中，设置了登陆用的用户名密码
  - 初始化脚本 -- 在 helm 渲染 Jenkins deploy 时挂载到 configmap 中
    - mariler 插件 -- 绑定邮箱
    - K8s 插件 -- 创建 K8s credential
    - RBAC 配置

**Jenkins pod 初始化：**

- K8s 插件配置 `charts/ks-devops/charts/jenkins/templates/config.yaml`
  - config.xml
    - 创建 role `kubesphere-user` 所有资源只读并绑定到`authenticated`用户
    - ladp 配置，对接 kubesphere ladp
    - cloud 配置：pod template container 配置、挂载等等，包括 Maven 配置、Docker sock 等
  - apply_config.sh jenkins 工作目录初始化
    - `slave-to-master-security-kill-switch` 禁用 agent 访问控制机制
    - 拷贝 config.xml 到容器 `/var/jenkins_home`
    - 将用于初始化的 groovy 文件拷贝到 `/var/jenkins_home/init.groovy.d`
      - 初始化用于 cloud 的 credential `Kubernetes service account`
      - Mailer 模块初始化
      - RBAC 初始化：创建 admin 和 kubesphere-user 对应的 role 做绑定
      - Sonarqube 初始化
      - 用户初始化，创建 admin 用户并设置密码

- deployment `charts/ks-devops/charts/jenkins/templates/jenkins-master-deployment.yaml`
  - 设置环境变量
    - jvm 参数
    - admin 用户名密码
    - 超时配置
    - 邮箱配置
  - limit **注意：默认 memory 为 2g，一般是不够用的，跑多个任务就会引起 pod crash，所以至少设置成 4g**
  - initContainer 运行 `/var/jenkins_config/apply_config.sh` 初始化 jenkins 配置，如安装插件、配置 cloud、rbac 等等

到这里 Jenkins pod 就创建出来了，我们可以直接开始使用 Jenkins 运行流水线了。

### Jenkins K8s 动态 slave

#### KubeSphere 内置 Jenkins

**配置：**

KubeSphere 通过 ks-install 和 helm 都配置好了，无需单独配置。

**使用：**

以流水线为例，groovy 中添加以下字段会按照 `'base'` 去匹配 pod 的 lable，匹配到了会使用这个 label 的 pod 模板启动 pod 运行流水线，下面有两个 pipeline 脚本，第一个是选定了 pod 的模板的会启动一个 pod 来执行，第二个 any，如果设置了 master 节点为 `Only build jobs with label expressions matching this node` 将会启动 base pod 来运行，如果选择 `Use this node as much as possible` 则会在 Jenkins 自身的容器/服务器上运行，如果是普通 job 的话，勾选`Restrict where this project can be run` 且填写 `Label Expression` 选择要运行的 label，和 pipeline 类似。

```groovy
pipeline {
    agent {
        node {
            label 'base'
        }
    }
    stages {
        stage('Run shell') {
            steps {
                sh 'echo hello world'
            }
        }
    }
}
```

```groovy
pipeline {
    agent any
    stages {
        stage('Run shell') {
            steps {
                sh 'echo hello world'
            }
        }
    }
}
```

#### 独立部署的 Jenkins

**cloud 配置 K8s：**

Manage Node → Configure Clouds。

- K8s；
- K8s URL：K8s apiserver 地址， 与 KubeSphere 自带的 Jenkins 不同的是使用了集群内部链接；
- K8s Namespace：slave pod 运行的 namespace；
- Credentials：使用 secret file，上传 kubeconfig 与 KubeSphere 自带的 Jenkins 不同的是使用了 `kubernetes service account`；
- 使用 WebSocket 通信 -- 使用 Jenkins tunnel 通信；
- Jenkins URL：Jenkins API 地址；
- 其他：其他的 pod 配置按需配置即可，这里和 KubeSphere 的一样。

## Q & A

### 使用 Maven 构建时，Maven 仓库如何配置？

pod 所使用的 Maven 配置是挂载进去的，可以通过 Jenkins->Configuration->Maven Project Configuration 配置

### KubeSphere → Jenkins → K8s，认证是如何实现的？

KubeSphere 与 Jenkins 的认证：

Jenkins 插件 `kubesphere-token-auth-plugin` 集成 KubeSphere 的认证体系，在 KubeSphere 调用 Jenkins 时，都需要经过 ks-apiserver 进行 token 的 review, 通过之后再调用 Jenkins 执行实际动作

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-devops-auth.png)

Jenkins 使用驱动 K8s 实现动态 slave：

- Jenkins 的 deployment 中声明了 `serviceAccountName` `devops-jenkins`；
- 启动的 pod 会将对应 serviceAccount 的 token 写入 pod 文件系统中 `/var/run/secrets/kubernetes.io/serviceaccount/token`；
- Jenkins K8s 插件会去读 pod 文件系统的 token，这样就可以通过 token 来调度 K8s 资源实现 slave pod 的创建删除。

如果是外置 Jenkins 则无法通过读取 token 来连接 K8s，需要手动创建 serviceAccount、clusterRole、clusterRoleBinding，然后将 token 以 Secret text 或者将 ca 证书以 Secret file 形式或将 kubconfig 以 Secret file 形式写入 credentials。

## 部署使用问题

### 误删 apiserivice

```bash
kubectl delete --all apiservice
```

#### 解决方式

参照：https://github.com/kubernetes/kubernetes/issues/75704

将 `kube-apiserver.yaml` 移到其他文件夹，这时 kube-apiserver 的 pod 会 down 掉。

```bash
mv /etc/kubernetes/manifests/kube-apiserver.yaml /etc/kubernetes/
```

在其他 API 正常的节点删除这个 pod，再将配置文件移回去，即可恢复。

### KubeSphere API 服务无法启动

版本：KubeSphere v3.3.0。

#### 错误描述

> install failed, ks-controller CrashLoopBackOff

```log
E1116 00:55:15.113761 1 notification_controller.go:113] get /, Kind= informer error, no matches for kind "Config" in version "notification.kubesphere.io/v2beta1"
F1116 00:55:15.113806 1 server.go:340] unable to register controllers to the manager: no matches for kind "Config" in version "notification.kubesphere.io/v2beta1"
```

#### 解决方式

参照：[kubectl apply -f https://raw.githubusercontent.com/kubesphere/notification-manager/master/config/bundle.yaml](https://github.com/kubesphere/kubesphere/issues/4447)。

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/notification-manager/master/config/bundle.yaml
```

### JNLP 容器无法启动

JNLP 是 Jenkin 的远程调用协议。

```bash
[root@k8s-1 ~]# kubectl logs -f  -n kubesphere-devops-worker base-w9dpq jnlp
Warning: SECRET is defined twice in command-line arguments and the environment variable
Warning: AGENT_NAME is defined twice in command-line arguments and the environment variable
Sep 14, 2022 11:29:43 AM hudson.remoting.jnlp.Main createEngine
INFO: Setting up agent: base-w9dpq
Sep 14, 2022 11:29:44 AM hudson.remoting.jnlp.Main$CuiListener <init>
INFO: Jenkins agent is running in headless mode.
Sep 14, 2022 11:29:44 AM hudson.remoting.Engine startEngine
INFO: Using Remoting version: 4.10
Sep 14, 2022 11:29:44 AM org.jenkinsci.remoting.engine.WorkDirManager initializeWorkDir
INFO: Using /home/jenkins/agent/remoting as a remoting work directory
Sep 14, 2022 11:29:44 AM org.jenkinsci.remoting.engine.WorkDirManager setupLogging
INFO: Both error and output logs will be printed to /home/jenkins/agent/remoting
Sep 14, 2022 11:29:44 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Locating server among [http://172.16.80.38:8080/]
Sep 14, 2022 11:29:44 AM hudson.remoting.jnlp.Main$CuiListener error
SEVERE: http://172.16.80.38:8080/tcpSlaveAgentListener/ is invalid: 404 Not Found
java.io.IOException: http://172.16.80.38:8080/tcpSlaveAgentListener/ is invalid: 404 Not Found
	at org.jenkinsci.remoting.engine.JnlpAgentEndpointResolver.resolve(JnlpAgentEndpointResolver.java:219)
	at hudson.remoting.Engine.innerRun(Engine.java:724)
	at hudson.remoting.Engine.run(Engine.java:540)
```

```log
Sep 14, 2022 11:33:41 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Locating server among [http://devops-jenkins.kubesphere-devops-system:80/]
Sep 14, 2022 11:33:42 AM org.jenkinsci.remoting.engine.JnlpAgentEndpointResolver resolve
INFO: Remoting server accepts the following protocols: [JNLP4-connect, Ping]
Sep 14, 2022 11:33:42 AM org.jenkinsci.remoting.engine.JnlpAgentEndpointResolver resolve
INFO: Remoting TCP connection tunneling is enabled. Skipping the TCP Agent Listener Port availability check
Sep 14, 2022 11:33:42 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Agent discovery successful
  Agent address: devops-jenkins-agent.kubesphere-devops-system
  Agent port:    50000
  Identity:      13:ea:2b:ab:b5:16:70:70:89:58:d1:66:2b:62:b1:16
Sep 14, 2022 11:33:42 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Handshaking
Sep 14, 2022 11:33:42 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Connecting to devops-jenkins-agent.kubesphere-devops-system:50000
Sep 14, 2022 11:33:42 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Trying protocol: JNLP4-connect
Sep 14, 2022 11:33:42 AM org.jenkinsci.remoting.protocol.impl.BIONetworkLayer$Reader run
INFO: Waiting for ProtocolStack to start.
Sep 14, 2022 11:33:46 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Remote identity confirmed: 13:ea:2b:ab:b5:16:70:70:89:58:d1:66:2b:62:b1:16
Sep 14, 2022 11:33:46 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Connected
Sep 14, 2022 11:33:58 AM org.csanchez.jenkins.plugins.kubernetes.KubernetesSlave$SlaveDisconnector call
INFO: Disabled agent engine reconnects.
```

## 附录：认证备忘

- `ks-installer/roles/ks-core/init-token/tasks/main.yaml` 生成一个随机值 secret；
- 部署 KubeSphere 的时候初始化通过 `ks-installer/roles/ks-core/init-token/files/jwt-script/jwt.sh` 生成了一个 jwt token 入参为上面生成的字符串和 '{"email": "admin@kubesphere.io","username": "admin","token_type": "static_token"}'；
- 通过生成的 token 和 secret 创建 secret 名为 kubesphere-secret；
- 部署 DevOps 的时候将填入 `authentication.jwtSecret devops.password` 通过 helm 部署 DevOps；
- 部署 Jenkin 的密码为写死的"P@ssw0rd"；
- admin password 生成了一个随机的 22 位字符串写入 Jenkins pod 环境变了并通过读取 configmap devops-jenkins 启动 Jenkins。

## 参考资料

- [jcli](https://github.com/jenkins-zh/jenkins-cli)
- [jcli 使用手册](https://www.bookstack.cn/read/jenkins-cli-0.0.29-zh/263348)
- [custom-war-packager](https://github.com/jenkinsci/custom-war-packager)
- [Jenkins Kubernetes 插件](https://plugins.jenkins.io/kubernetes/)
- [KubeSphere DevOps 3.0 流水线开发指南](https://kubesphere.com.cn/forum/d/2393-kubesphere-devops-30)
- [Jenkins 基于 Kubernetes 动态创建 pod](https://blog.csdn.net/qq_34556414/article/details/120623844)
- [Can I use Jenkins kubernetes plugin when Jenkins server is outside of a kubernetes cluster?](https://stackoverflow.com/questions/40197607/can-i-use-jenkins-kubernetes-plugin-when-jenkins-server-is-outside-of-a-kubernet)
- [kubernetes-jenkins-integration](https://stackoverflow.com/questions/48827345/kubernetes-jenkins-integration)
