---
title: 'KubeSphere DevOps 流水线入门指南'
tag: 'KubeSphere, Kubernetes, DevOps'
keywords: 'KubeSphere, Kubernetes, DevOps'
description: '本文首先将介绍 DevOps 是什么，随后尝试利用 KubeSphere 集成的功能来实现 DevOps。'
createTime: '2022-10-27'
author: '赵海亮'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-devops-pipeline-cover.png'
---
> 作者：赵海亮，浙江大学计算机专业四年级在读博士生，研究方向为云计算、边缘计算、分布式系统等。

虽然 KubeSphere 能够将我们从 yaml 文件的编写中解放出来，但是项目上云仍然十分繁琐。 此外，一旦项目源代码发生更替（如发布新功能或去除 bug 等），所有组件都需要重新经历 “源码打包 --> 制作镜像 --> 启动容器” 这个流程。 这意味着，项目运维人员不得不从事大量重复性劳动。为了提高项目发布的效率，工业界引入了 DevOps 的概念。

本文首先将介绍 DevOps 是什么，随后尝试利用 KubeSphere 集成的功能来实现 DevOps。

## 什么是 DevOps

目前绝大多数互联网公司将开发和系统管理划分成不同的部门。 开发部门的驱动力通常是 “频繁交付新特性”，而运维部门则更关注 IT 服务的可靠性和 IT 成本投入的效率。 两者目标的不匹配，因而存在鸿沟，从而减慢了 IT 交付业务价值的速度。 为了解决这个问题，DevOps（Development 和 Operations 的组合词）被提出。 DevOps 的目的是在企业内部搭建一个自动化 “软件交付” 和“架构变更”的流程，来使得构建、测试、发布软件能够更加地快捷、频繁和可靠。

实现 DevOps 通常需要多个软件和工具的密切配合。 如图 1 所示，DevOps 将软件的交付流程依次划分为 Plan、Code、Build、Test、Release、Deploy、Operate 以及 Monitor 这些阶段。 当需求变更时，将会从 Monitor 重新平滑过渡至 Plan 阶段。每个阶段都有一系列的软件和工具可供选择。 对于任意项目，我们只需要基于这些软件和工具  **搭建一条自动化流水线** ，再设置类似于 “一旦代码变更就自动执行” 这样的钩子函数，整个项目即可自动实现“持续集成 / 持续交付（CI/CD）”，这将大大减少重复劳动。

![](https://pek3b.qingstor.com/kubesphere-community/images/ecb1db00-df40-47b8-a071-82e2af035892.png)

KubeSphere DevOps 基于 Kubernetes Jenkins Agent 实现。 和传统的 Jenkins Controller-Agent 架构不同的是，在 KubeSphere 中，Jenkins Agent 可以动态扩缩容，从而降低 CI/CD 对集群资源的盲目占用。 KubeSphere 的 DevOps 用户指南参见 https://kubesphere.io/zh/docs/devops-user-guide/。 本文将依照该指南将一个开源项目上云。

## 基于 DevOps 的项目部署

### 项目介绍

本次实验要部署的项目叫做尚医通，这是一个基于 Spring-Boot 实现的预约挂号统一平台。 该项目一共包含三个子部分，分别为 `yygh-parent`、`yygh-site` 和 `yygh-admin`。 在架构上，该项目依赖的数据层中间件有 mysql、redis、mongodb 以及 rabbitmq，依赖的流量治理中间件有 sentinel 和 nacos。

接下来，我们约定项目根目录为 `his`，然后分别从开源地址 https://gitee.com/leifengyang/yygh-parent、https://gitee.com/leifengyang/yygh-site 和 https://gitee.com/leifengyang/yygh-admin 拉取源代码：

```bash
(base) ➜  his lsa
total 0
drwxr-xr-x   5 hliangzhao  staff   160B Nov 15 10:33 .
drwxr-xr-x@ 42 hliangzhao  staff   1.3K Nov 15 10:33 ..
drwxr-xr-x  24 hliangzhao  staff   768B Nov 15 10:33 yygh-admin
drwxr-xr-x  15 hliangzhao  staff   480B Nov 15 10:33 yygh-parent
drwxr-xr-x  24 hliangzhao  staff   768B Nov 15 10:34 yygh-site
```

依次查看三个项目的文件布局：

```bash
(base) ➜  his cd yygh-parent
(base) ➜  yygh-parent git:(master) tree -L 2
.
├── common                      # 通用模块
│   ├── common-util
│   ├── pom.xml
│   ├── rabbit-util
│   └── service-util
├── data                        # 项目演示数据
│   ├── json
│   └── sql
├── hospital-manage             # 医院后台
│   ├── Dockerfile
│   ├── deploy
│   ├── pom.xml
│   ├── src
├── model                       # 数据模型
│   ├── pom.xml
│   └── src
├── pom.xml
├── server-gateway              # 网关
│   ├── Dockerfile
│   ├── deploy
│   ├── pom.xml
│   └── src
├── service                     # 微服务层
│   ├── pom.xml
│   ├── service-cmn             # 公共服务
│   ├── service-hosp            # 医院数据服务
│   ├── service-order           # 预约下单服务
│   ├── service-oss             # 对象存储服务
│   ├── service-sms             # 短信服务
│   ├── service-statistics      # 统计服务
│   ├── service-task            # 定时服务
│   └── service-user            # 会员服务
└── service-client
    ├── pom.xml
    ├── service-cmn-client
    ├── service-hosp-client
    ├── service-order-client
    └── service-user-client

30 directories, 12 files
(base) ➜  yygh-parent git:(master) cd ../yygh-admin
(base) ➜  yygh-admin git:(master) tree -L 1        # 医院挂号后台（前端 UI）
.
├── Dockerfile
├── LICENSE
├── build
├── config
├── deploy
├── favicon.ico
├── index.html
├── package.json
├── src
└── static

5 directories, 9 files
(base) ➜  yygh-site git:(master) tree -L 1        # 用户挂号前台（前端 UI）
.
├── Dockerfile
├── api
├── assets
├── components
├── deploy
├── layouts
├── middleware
├── nuxt.config.js
├── package-lock.json
├── package.json
├── pages
├── plugins
├── static
├── store
└── utils

11 directories, 7 files
```

对于本项目，我们需要部署如下内容：

```bash
yygh-parent/hospital-manage         # 医院管理
yygh-parent/server-gateway          # 网关
# 8 个微服务
yygh-parent/service/service-cmn
yygh-parent/service/service-hosp
yygh-parent/service/service-order
yygh-parent/service/service-oss
yygh-parent/service/service-sms
yygh-parent/service/service-statistics
yygh-parent/service/service-task
yygh-parent/service/service-user
# 2 个前端
yygh-admin
yygh-site
```

以上 12 个待部署的子项目将以独立 Pod 的形式在集群中部署。 每一个子项目根目录需要具有一个 Dockerfile 文件以及一个名为 `deploy` 的文件夹。 前者是本子项目的镜像制作文件，后者是本子项目的资源清单文件 `*.yaml`（用于在集群中部署）。 以 `service-cmn` 为例，其文件布局如下：

```bash
(base) ➜  service-cmn git:(master) tree -L 2
.
├── Dockerfile        # 将本子项目构建为镜像的 Dockerfile
├── deploy            # 存放用于部署本子项目的资源清单文件
│   └── deploy.yml
├── pom.xml           # 项目依赖
├── src               # 源代码
│   └── main
└── target            # maven 打包后自动创建
```

遵循上的一篇文章 [使用 KubeSphere 部署 Ruoyi-Cloud · KS 实践 02](https://hliangzhao.cn/articles/000001636890936aa648c32c5484364aae34e9f41e6225e000 "使用 KubeSphere 部署 Ruoyi-Cloud · KS 实践 02") 中所述的部署流程，我们首先需要将中间件上云。然后，我们将三个项目以流水线的方式上云。

### 部署中间件

本项目所使用的中间件除了 Sentinel 和 MongoDB，其他均已在前文中部署。 接下里依次部署这两个中间件。

对于 Sentinel，我们直接使用雷丰阳已经制作好的镜像 `leifengyang/sentinel:1.8.2`，然后暴露一个 NodePort 类型的 Service，端口号为 `32636`。 访问 `http://192.168.23.160:32636`，以默认用户 `sentinel` 和默认密码 `sentinel` 登录，可以进入 Sentinel 控制台。 如果一切顺利，应该可以看到类似的页面：

![](htts://pek3b.qingstor.com/kubesphere-community/images/70909f56-0452-4dbc-b716-c47431a53404.png)

对于 MongoDB，我们直接通过应用模版部署它（不勾选登录认证）：

![](https://pek3b.qingstor.com/kubesphere-community/images/87e3debf-5831-4c94-913d-76900c767287.png)

为 MongoDB 应用暴露一个 NodePort 类型的 Service，端口号为 `31801`，然后在本机通过 MongoDB Compass 连接它（`192.168.23.160:31801`）：

![](https://pek3b.qingstor.com/kubesphere-community/images/219fd8bd-0424-4ab9-9bb5-d6d6fd3a497e.png)

如果可以连上，则一切正常。

### 导入初始数据

使用 DataGrip 将位于 `his/yygh-parent/data/sql` 目录下的全部演示数据（一共有 5 个 sql 文件需要执行，会创建 5 个 `yygh` 打头的数据库）导入集群中的 MySQL 实例：

![](https://pek3b.qingstor.com/kubesphere-community/images/651ecb64-8826-4a19-82ba-a36b6a640cbb.png)

MongoDB 的演示数据将在项目启动后导入。

### 在 Nacos 中创建微服务的启动配置

观察每一个子项目的 Dockerfile，以 `service-cmn` 为例：

```dockerfile
# service-cmn 的 Dockerfile
FROM openjdk:8-jdk
LABEL maintainer=leifengyang

# 启动 prod 环境，以 service-cmn-prod.yml 作为启动配置
ENV PARAMS="--server.port=8080 --spring.profiles.active=prod --spring.cloud.nacos.server-addr=his-nacos.his:8848 --spring.cloud.nacos.config.file-extension=yml"
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone

COPY target/*.jar /app.jar
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-c","java -Dfile.encoding=utf8  -Djava.security.egd=file:/dev/./urandom -jar /app.jar ${PARAMS}"]
```

这意味着该子项目在启动时，会激活 `prod` 环境，并从 Nacos 中读取 `service-cmn-prod.yml` 文件作为启动配置。 因此，我们首先需要在 Nacos 中创建其生产环境配置文件 `service-cmn-prod.yml`，然后将 `子项目路径 / src/main/resources/application-dev.yml` 的内容复制进去，在其基础上修改。 需要修改的内容主要是中间件的访问地址。 以 `service-cmn` 为例，它的配置文件被命名为 `service-cmn-prod.yml`，其最终内容如下：

```yaml
# service-cmn-prod.yml
server:
  port: 8080
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  mapper-locations: classpath:mapper/*.xml
  global-config:
    db-config:
      logic-delete-value: 1
      logic-not-delete-value: 0
spring:
  cloud:
    sentinel:
      transport:
        # 修改 sentinel 访问地址
        dashboard: http://his-sentinel-nodeport.his:8080
  redis:
    # 修改 redis 访问地址
    host: his-redis-nodeport.his
    port: 6379
    database: 0
    timeout: 1800000
    password:
    lettuce:
      pool:
        max-active: 20      # 最大连接数
        max-wait: -1        # 最大阻塞等待时间 (负数表示没限制)
        max-idle: 5         # 最大空闲
        min-idle: 0         # 最小空闲
  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    driver-class-name: com.mysql.jdbc.Driver
    # 修改 mysql 访问地址和连接凭证
    url: jdbc:mysql://his-mysql-nodeport.his:3306/yygh_cmn?characterEncoding=utf-8&useSSL=false
    username: root
    password: 123456
    hikari:
      connection-test-query: SELECT 1
      connection-timeout: 60000
      idle-timeout: 500000
      max-lifetime: 540000
      maximum-pool-size: 12
      minimum-idle: 10
      pool-name: GuliHikariPool
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
```

如图 6 所示，除了 `hospitla-manage`，其余所有 9 个 Spring-Boot 子项目均需要按照上述规则编写对应的配置文件。 `hospitla-manage` 的启动不依赖 Nacos，因此不需要。

![](https://pek3b.qingstor.com/kubesphere-community/images/4cc0f08f-0374-44b6-82c2-250eba012f2d.png)

### 创建微服务部署流水线

流水线表示应用从代码编译、测试、打包和部署的过程，KubeSphere 的流水线管理使用了业界常用的 Jenkinsfile 来表述一组 CI/CD 流程。 Jenkinsfile 是一个文本文件，使用了 Jenkins 提供的 DSL（Domain-Specific Language）语法。 KubeSphere 提供了可视化编辑器，用户只需在页面上输入少量配置信息，接口自动组装完成 Jenkinsfile。 当然，也可直接编辑 Jenkinsfile。

流水线涉及如下几个概念：

- Stage：阶段，一个 Pipeline 可以划分为若干个 Stage，每个 Stage 代表一组操作。Stage 是一个逻辑分组的概念，可以跨多个 Node。
- Node：节点，一个 Node 就是一个 Jenkins 节点，或者是 Master，或者是 Agent，是执行 Step 的具体运行时环境。
- Step：步骤，Step 是最基本的操作单元，小到创建一个目录，大到构建一个 Docker 镜像，由各类 Jenkins Plugin 提供。

KubeSphere 默认提供的 Agent 有 base、go、maven 和 nodejs。它们分别适用于不同编程语言开发的项目的打包构建。 因为我们即将部署的 10 个子项目均是 Spring-Boot 应用，因此我们选择 maven 作为启动流水线的 agent。

我们可以直接编写流水线的 Jenkinsfile，也可以通过 KubeSphere 提供的可视化页面编辑流水线。 通常，流水线的第一步是**下载项目源代码** [4](https://hliangzhao.cn/articles/000001637123225376d9e01cc3841cb9c4fa467de7aaf83000#fn:4 "4")，我们在 UI 上直接添加相关命令：

![](https://pek3b.qingstor.com/kubesphere-community/images/6d7add0f-de92-4ea6-8ffa-b173398d6052.png)

KubeSphere 会自动生成这次编辑的 Jenkinsfile 代码片段：

```groovy
stage('clone code') {
  agent none
  steps {
    // 拉取代码并展示代码文件布局
    container('maven') {
      git(url: 'https://gitee.com/leifengyang/yygh-parent', branch: 'master', changelog: true, poll: false)
      sh 'ls -al'
    }
  }
}
```

流水线的第二个阶段通常是**项目的打包与编译**。 默认情况下，Maven 从官方仓库下载项目依赖，如果想要修改默认镜像仓库，需要修改集群中名为 `ks-devops-agent` 的 ConfigMap，它拥有一个叫做 `MavenSetting` 的键：

```bash
k8s@ubuntu:~$ k get cm -A | grep devops
his-devopsqxxv7                   istio-ca-root-cert                                           1      24h
his-devopsqxxv7                   kube-root-ca.crt                                             1      24h
kubesphere-devops-system          devops-config                                                1      5d7h
kubesphere-devops-system          devops-jenkins                                               9      5d7h
kubesphere-devops-system          istio-ca-root-cert                                           1      5d7h
kubesphere-devops-system          jenkins-agent-config                                         1      5d7h
kubesphere-devops-system          jenkins-casc-config                                          2      5d7h
kubesphere-devops-system          kube-root-ca.crt                                             1      5d7h
kubesphere-devops-worker          istio-ca-root-cert                                           1      5d7h
kubesphere-devops-worker          ks-devops-agent                                              1      5d7h
kubesphere-devops-worker          kube-root-ca.crt                                             1      5d7h
k8s@ubuntu:~$ k describe cm ks-devops-agent -n kubesphere-devops-worker
Name:         ks-devops-agent
Namespace:    kubesphere-devops-worker
Labels:       app.kubernetes.io/managed-by=Helm
Annotations:  meta.helm.sh/release-name: devops
              meta.helm.sh/release-namespace: kubesphere-devops-system

Data
====
MavenSetting:
----
<?xml version="1.0" encoding="UTF-8"?>
...
<!--
 | This is the configuration file for Maven. It can be specified at two levels:
...
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
...
```

我们需要修改 `MavenSetting` 文件，在其中添加国内镜像仓库地址：

![](https://pek3b.qingstor.com/kubesphere-community/images/8231db2a-b71b-4ed6-a4c4-5f274d2a96e7.png)

我们通过命令 `mvn clean package -Dmaven.test.skip=true` 进行项目打包编译。由此，流水线的第二阶段需要执行的命令如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/b78aead1-e8a0-417e-8082-8f040ecc1e70.png)

相应地，在 Jenkinsfile 中也会自动生成第二步的代码：

```groovy
stage('project compilation') {
  agent none
  steps {
    container('maven') {
      sh 'mvn clean package -Dmaven.test.skip=true'
    }
  }
}
```

流水线的第三个阶段是**制作镜像**。我们在章节 2.1 说过，每个子项目的根目录有一个 Dockerfile，并且在章节 2.4 展示过 Dockerfile 的内容。 因此，对于单体应用 `hospitla-manage`，它的镜像构建命令为 `docker build -t hospital-manage -f hospital-manage/Dockerfile hospital-manage/`；对于网关子项目 `server-gateway`，它的镜像构建命令为 `docker build -t server-gateway/Dockerfile server-gateway/`；其余 8 个微服务的构建命令则是 `docker build -t service/service-xxx service/service-xxx/`。这里的 `xxx` 被替换为具体的微服务名称。 在上述构建命令中，尤其需要注意的是 Dockerfile 相对于项目根目录 `yygh-parent` 所在的位置以及镜像构建上下文的相对位置。

因为上述 10 个镜像的构建相互之间独立，因此可以**并行化执行**。我们可以很轻易地在 KubeSphere 中做到这一点：

![](https://pek3b.qingstor.com/kubesphere-community/images/532f6d99-5d4e-4ccf-8ca9-5d04ef301686.png)

相应地，Jenkinsfile 中增加了如下内容：

```groovy
stage('default-2') {
  parallel {    // 并行构建 10 个镜像
    stage('build hospital-manage') {
      agent none
      steps {
        container('maven') {
          sh 'docker build -t hospital-manage -f hospital-manage/Dockerfile hospital-manage/'
        }
      }
    }
    stage('build server-gateway') {
      ...
    }
    stage('build service-cmn') {
      ...
    }
    ...
  }
}
```

流水线的第四个阶段是**镜像推送**。在企业内部，构建好的镜像通常会被推送到企业的私有仓库中。 笔者采用阿里云给个人开发者免费提供的镜像仓库作为推送目标。因为目标仓库是一个私有仓库，因此需要提供账户和密码作为凭证（credential）。 如何在 KubeSphere 中为镜像推送命令提供凭证呢？ 我们可以在 DevOps 的项目设置中创建：

![](https://pek3b.qingstor.com/kubesphere-community/images/eb3c1913-ae02-4393-9b2e-0f30b96c6356.png)

上图中，笔者创建一个名为 `aliyun-docker-hub` 的凭证，用户名是我的阿里云账户名，密码则是申请容器镜像服务所创建的密码。 读者需要替换成自己的账户密码：

![](https://pek3b.qingstor.com/kubesphere-community/images/28781e75-908e-47b1-a59e-f58e9206ac8d.png)

基于该凭证，我们在 Jenkinsfile 中编写镜像推送的代码如下：

```groovy
steps {
  container('maven') {
    // 使用'aliyun-docker-registry'这个凭证登录私有仓库并将镜像推送至其中
    withCredentials([usernamePassword(credentialsId: 'aliyun-docker-registry', passwordVariable: 'ALIYUN_REG_PWD', usernameVariable : 'ALIYUN_REG_USER' ,)]) {
      sh 'echo"$ALIYUN_REG_PWD"| docker login $REGISTRY -u"$ALIYUN_REG_USER"--password-stdin'
      sh 'docker tag hospital-manage:latest $REGISTRY/$DOCKERHUB_NAMESPACE/hospital-manage:SNAPSHOT-$BUILD_NUMBER'
      sh 'docker push $REGISTRY/$DOCKERHUB_NAMESPACE/hospital-manage:SNAPSHOT-$BUILD_NUMBER'
    }
  }
}
...
environment {
  ...
  REGISTRY = 'registry.cn-hangzhou.aliyuncs.com'
  DOCKERHUB_NAMESPACE = 'hliangzhao-private'
  ...
}
```

同样地，上述过程也以并行的方式执行。最终，Jenkinsfile 中被添加了如下代码：

```groovy
stage('default-3') {
  parallel {   // 并行推送 10 个镜像
    stage('push hospital-manage') {
      agent none
      steps {
        container('maven') {
          withCredentials([usernamePassword(credentialsId : 'aliyun-docker-registry' ,passwordVariable : 'ALIYUN_REG_PWD' ,usernameVariable : 'ALIYUN_REG_USER' ,)]) {
            sh 'echo"$ALIYUN_REG_PWD"| docker login $REGISTRY -u"$ALIYUN_REG_USER"--password-stdin'
            sh 'docker tag hospital-manage:latest $REGISTRY/$DOCKERHUB_NAMESPACE/hospital-manage:SNAPSHOT-$BUILD_NUMBER'
            sh 'docker push $REGISTRY/$DOCKERHUB_NAMESPACE/hospital-manage:SNAPSHOT-$BUILD_NUMBER'
          }
        }
      }
    }
    stage('push server-gateway') {
      ...
    }
    stage('push service-cmn') {
      ...
    }
    ...
  }
}
```

测试一下到目前为止的流水线，一切运行顺利：

![](https://pek3b.qingstor.com/kubesphere-community/images/202210271659626.jpg)

流水线的最后阶段是**部署到开发环境和生产环境**。因为这一阶段需要和 Kubernetes API Server 打交道，所以需要指定 Kubernetes 上下文 [5](https://hliangzhao.cn/articles/000001637123225376d9e01cc3841cb9c4fa467de7aaf83000#fn:5 "5")。 KubeSphere 自动为我们创建了名为 `demo-kubeconfig` 的凭证，该凭证提供了形如 `.kube/config` 的文件，使得我们可以根据凭证发起 `kubectl apply` 命令。 与此同时，我们还需要指定待部署的资源清单文件的位置。 以子项目 `hospital-manage` 为例，它的资源清单文件在 `yygh-parent/hospital-manage/deploy/` 目录下。 观察该目录下的 `deploy.yaml` 文件，可以发现它要求集群从阿里云私有镜像仓库拉取镜像，需要我们提供 `imagePullSecrets` 字段：

![](https://pek3b.qingstor.com/kubesphere-community/images/f5dd3704-7a33-4e68-88ba-c3889e70cb92.png)

这意味着我们需要在 his 项目中创建名为 aliyun-docker-hub 的 Secret。 注意，这里是在为 his 项目创建 Secret，而先前是在 DevOps 的项目设置中创建 Credential。二者的服务对象是不同的。 对于部署这个操作，我们可以直接在 UI 上选择 “添加 kubernetesDeploy”：

![](https://pek3b.qingstor.com/kubesphere-community/images/766d0837-047b-4e30-99f2-de23de55bc80.png)

由此生成的 Jenkinsfile 代码为

```groovy
stage('deploy hospital-manage to dev') {
  agent none
  steps {
    container('maven') {
      kubernetesDeploy(enableConfigSubstitution: true,
        deleteResource: false,
        kubeconfigId: 'demo-kubeconfig',          // 存储了 kubeconfig 上下文信息的文件
        configs: 'hospital-manage/deploy/**'      // 资源清单文件所在位置
      )
    }
  }
}
```

我们尝试运行一下现在的流水线，诡异的事情却发生了。在项目部署阶段产生了如下错误：

```bash
Starting Kubernetes deployment
Loading configuration: /home/jenkins/agent/workspace/his-devopsqxxv7/yygh-parent-devops/hospital-manage/deploy/deploy.yml
ERROR: ERROR: java.lang.RuntimeException: io.kubernetes.client.openapi.ApiException: Bad Request
hudson.remoting.ProxyException: java.lang.RuntimeException: io.kubernetes.client.openapi.ApiException: Bad Request
  at com.microsoft.jenkins.kubernetes.wrapper.ResourceManager.handleApiExceptionExceptNotFound(ResourceManager.java:180)
  ...
Api call failed with code 400, detailed message: {
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {
  },
  "status": "Failure",
  "message": "the export parameter, deprecated since v1.14, is no longer supported",
  "reason": "BadRequest",
  "code": 400
}
Kubernetes deployment ended with HasError
```

观察报错内容，似乎是负责执行流水线的 Jenkins Agent 版本太老所导致的。 经过查阅，笔者发现 KubeSphere 的官方维护人员已经提交了相关 issue（https://github.com/kubesphere/website/issues/2096）来说明此事。根据说明，报错的根源在于 Jenkins 的官方插件 [kubernetes-cd-plugin](https://github.com/jenkinsci/kubernetes-cd-plugin "kubernetes-cd-plugin") “年久失修”，我所安装的 Kubernetes 的 API 版本是 v1.22，而 Jenkins 的 kubernetes-cd-plugin 却已经停摆两年。 对于这个问题，KubeSphere 官方提供的解决方案是以 shell 命令 `kubectl apply -f your-crd-file.yaml` 的方式进行部署，而非在 UI 上添加 `kubernetesDeploy`。

幸运的是，在笔者撰写此文的 40 分钟前，KubeSphere 官方发起了一个针对此问题的临时解决方案：https://github.com/kubesphere/website/pull/2098。 在该 Pull request 中，贡献者提供了一种提供 kubeconfig 验证的写法：

```groovy
stage('deploy hospital-manage to dev') {
  agent none
  steps {
    container('maven') {
      // 如果不提供 kubeconfigFile，则 kubectl 上下文找不到
      withCredentials([kubeconfigFile(credentialsId: env.KUBECONFIG_CREDENTIAL_ID, variable: 'KUBECONFIG')]) {
        sh 'kubectl apply -f hospital-manage/deploy/**'
      }
    }
  }
}
```

实验证明，该方法有效。同样地，10 个子项目可以并行化部署到 dev 环境。相应的 Jenkins 代码就不再展示了。 部署到 prod 环境的操作类似。此外，还可以添加部署条件，例如，只有获得相关管理员授权之后部署操作才会启动。

### 创建前端项目部署流水线

接下来，还剩两个前端项目 `yygh-site` 和 `yygh-admin` 需要部署。 前端项目的部署服从相似的步骤：首先下载源码，然后需要通过 Node.js 之类的工具为项目安装依赖并构建（产生 `dist` 目录），最后是镜像构建、推送和部署。 以 `yygh-site` 为例，它最终的 Jenkinsfile 如下所示：

```groovy
pipeline {
    agent {
        node {
            label 'nodejs'
        }
    }
    stages {
        stage('拉取代码') {
            agent none
            steps {
                container('nodejs') {
                  git(url: 'https://gitee.com/leifengyang/yygh-site', branch: 'master', changelog: true, poll: false)
                  sh 'ls -al'
                }
            }

        }
        stage('项目编译') {
            agent none
            steps {
                container('nodejs') {
                    sh 'ls'
                    sh 'npm install --registry=https://registry.npm.taobao.org'
                    sh 'npm run build'
                }
            }
        }
        stage('构建镜像') {
            agent none
            steps {
                container('nodejs') {
                    sh 'ls'
                    sh 'docker build -t yygh-site:latest -f Dockerfile  .'
                }

            }
        }
        stage('推送镜像') {
            agent none
            steps {
                container('nodejs') {
                    withCredentials([usernamePassword(credentialsId: 'aliyun-docker-registry', usernameVariable: 'DOCKER_USER_VAR', passwordVariable: 'DOCKER_PWD_VAR',)]) {
                        sh 'echo"$DOCKER_PWD_VAR"| docker login $REGISTRY -u"$DOCKER_USER_VAR"--password-stdin'
                        sh 'docker tag yygh-site:latest $REGISTRY/$DOCKERHUB_NAMESPACE/yygh-site:SNAPSHOT-$BUILD_NUMBER'
                        sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/yygh-site:SNAPSHOT-$BUILD_NUMBER'
                    }
                }
            }
        }
        stage('部署到 dev 环境') {
            agent none
            steps {
                kubernetesDeploy(configs: 'deploy/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
            }
        }
        // 1、配置全系统的邮件：                   全系统的监控
        // 2、修改 ks-jenkins 的配置，里面的邮件；   流水线发邮件
        stage('发送确认邮件') {
            agent none
            steps {
                mail(to: 'someone@test.com', subject: 'yygh-site 构建结果', body: "成功构建 $BUILD_NUMBER")
            }
        }
    }
    environment {
      ...
    }
}
```

此处不再展示更多细节。

## 总结

KubeSphere 为我们提供了 Jenkins 流水线的编辑页面，在一定程度上可以简化操作。

## 参考

本文参考了雷丰阳的视频课程 [云原生 Java 架构师的第一课 K8s+Docker+KubeSphere+DevOps](https://www.bilibili.com/video/BV13Q4y1C7hS "云原生 Java 架构师的第一课 K8s+Docker+KubeSphere+DevOps")。 如果想全面而深入地自主实践，推荐观看原视频。