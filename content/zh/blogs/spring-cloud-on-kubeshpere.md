---
title: "基于 KubeSphere 的 Spring Could 微服务 CI/CD 实践"
tag: 'Spring Cloud , Kubernetes, KubeSphere, Pig'
createTime: '2020-10-24'
author: 'Zack & Roland'
snapshot: '../../../images/blogs/spring-cloud-on-kubesphere/0.springcloud.png'
---

本文以 Pig 为例介绍如何在 KubeSphere 上发布一个基于 Spring Cloud 微服务的 CI/CD 项目。

## 背景简介

### Pig

Pig (http://pig4cloud.cn/) 是一个基于 Spring Cloud 的开源微服务开发平台，也是微服务最佳实践。在国内拥有大量拥护者。同时也有商业版本提供技术支持。

### KubeSphere

KubeSphere (https://Kubesphere.io) 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，完全开源，支持多云与多集群管理，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。

通过 KubeSphere 我们可以以简洁的方式将 Pig 项目部署至 Kubernetes 中。运维人员可以轻松的完成 Spring Cloud 运维任务。

### 前提条件

具备 Spring Cloud 及 Pig 基础知识

Jenkins 基础知识（非必备）

KubeSphere 3.0 集群环境一套，并启用 DevOps 插件

> 搭建 KubeSphere 集群不再本文覆盖范围，根据您的环境参考相关部署文档: https://KubeSphere.com.cn/docs/installing-on-kubernetes/

## 架构设计

Spring Cloud 有一个丰富、完备的插件体系，以实现各种运行时概念，作为应用栈的一部分。因此，这些微服务自身有库和运行时代理，来做客户端的服务发现，配置管理，负载均衡，熔断，监控，服务跟踪等功能。由于本篇重点在于如何快速建立 CI/CD 运维体系，因此对 Spring Cloud 与 Kubernetes 的深度整合不做过多讨论。我们将继续使用 Spring Cloud 底层的这些能力，同时利用 Kubernetes 实现滚动升级，健康检查，服务自动恢复等缺失的功能。

如图所示， Spring Cloud 中的各个微服务将以 Deployment 方式部署，Pod 启动后会自动向 Nacos 注册，并获取 Spring Cloud 的配置文件。Redis 与 MySQL 也在 Kubernetes 中以 Headless 服务模式发布，各个微服务通过 CoreDNS 发现它们。最后所有流量统一通过 Ingress 网关进入后台静态网站以及微服务网关 (Spring Cloud Gateway)。

![Spring Cloud](../../../images/blogs/spring-cloud-on-kubesphere/0.springcloud.png)

## 部署过程

一般企业开发过程中会根据项目的特性选择不同的源码分支模型和部署策略。分支模型和部署策略不在本文讨论范文内。因此我们选择了一个最简单的的开发部署过程：

**拉取源码** -> **构建源码** -> **构建并推送镜像** -> **部署项目**

我们将创建两条流水线，一条用于构建 Pig 后端 Java 代码，另外一条用于构建基于 Vue 的 Pig-ui 前端代码。

### Java 后端流水线

> 每个阶段所执行的任务：
> 1. 从仓库拉取代码：https://gitee.com/log4j/pig.git 。
> 2. 使用 Maven 构建后端 Java 代码。
> 3. 构建镜像，并将 tag 为 SNAPSHOT-$BUILD_NUMBER 推送至 DockerHub （其中 $BUILD_NUMBER 为 pipeline 活动列表的运行序号）。
> 4. 将项目部署到开发环境，此阶段需要预先审核，若部署成功后则发送邮件。

### Vue 前端流水线
前端流水线跟后端过程相似,除:
> 1. 从仓库拉取代码：https://gitee.com/log4j/pig-ui.git 。
> 2. 使用 Node 构建前端 Javascript 代码。

## 开始

### 创建项目

DevOps 项目是 KubeSphere 中的一个即插即用组件，提供了 CI/CD Pipleline, Binary-to-image， Source-to-image等功能。在 DevOps 项目中，我们将使用图形化的方式创建流水线。除 DevOps 项目外，我们还需要一个 KubeSphere Project 用于发布 Pig 的微服务。由于开源版本 Pig 未提供 Kubernetes 的 yaml 模板，我们同样会使用到图形化的方式发布 Pig 所依赖的所有服务。

1. 使用具有 Workspace 管理权限的账户登录 KubeSphere 控制台。
2. 创建企业空间 `pig-workspace`，本示例中所有使用的相关资源将在本 Workspace 中创建。
2. 创建 DevOps 项目 `pig-ops`，用于 CI/CD 流水线管理。
3. 创建 project 项目 (namespace) `pig-dev`，用于部署 Spring Cloud 相关微服务。

> 参考： https://v2-1.docs.Kubesphere.io/docs/zh-CN/quick-start/jenkinsfile-out-of-scm

### 创建凭证

创建流水线时需要访问 DockerHub、Kubernetes （KubeConfig 用于部署微服务到 Kubernetes 集群） 等两个凭证。

1. 登录 KubeSphere 后进入`pig-ops` DevOps 工程。
2. 在`凭证`页面中点击`创建`。
3. 选择`用户名和密码`类型，输入 DockerHub 用户名与密码，并将凭证命名为 dockerhub-id。
4. 再次点击`创建`，并设置为`kubeconfig`类型, 拷贝您的 kubeconfig，并将凭证命名为 kubeconfig-id。

![Credentials](../../../images/blogs/spring-cloud-on-kubesphere/1.Credentials.PNG)

### 创建流水线

参考以下步骤，创建并运行一个完整的流水线。

#### 第一步：填写基本信息

1. 在 DevOps 工程中，选择左侧 `流水线`，然后点击 `创建`。

![Pipeline](../../../images/blogs/spring-cloud-on-kubesphere/2.createpipline.PNG)

2. 在弹出的窗口中，输入流水线的基本信息，完成后点击 `下一步`。

  - 名称：为流水线起一个简洁明了的名称，便于理解和搜索，例如 pig-pipeline
  - 描述信息：简单介绍流水线的主要特性，帮助进一步了解流水线的作用
  - 代码仓库：此处不选择代码仓库

![Pipeline Basic](../../../images/blogs/spring-cloud-on-kubesphere/3.pipeline.PNG)


#### 第二步：高级设置

1、点击 `添加参数`，如下添加 3 个 `字符串参数`，流水线的 Docker 命令中会使用该参数。完成后点击`确定`。

参数类型 | 名称 | 	默认值 | 描述信息
---|---|---|---
字符串参数 (string) | REGISTRY | 仓库地址，本示例使用 docker.io | Image Registry
字符串参数 (string) | DOCKERHUB_NAMESPACE | 填写您的 DockerHub 账号 （它也可以是账户下的 Organization 名称）	| DockerHub Namespace
字符串参数 (string) | PROJECT | KubeSphere项目名 pig-dev | Image Registry

![Pipeline Advanced](../../../images/blogs/spring-cloud-on-kubesphere/4.pipeline.PNG)

### 可视化编辑流水线 - Java 后端流水线

可视化流水线共包含 4 个阶段 (stage)，以下依次说明每个阶段中分别执行了哪些步骤和任务。

#### 阶段一：拉取源代码 (Checkout SCM)

可视化编辑页面，分为结构编辑区域和内容编辑区域。通过构建流水线的每个阶段 (stage) 和步骤 (step) 即可自动生成 Jenkinsfile，用户无需学习 Jenkinsfile 的语法，非常方便。当然，平台也支持手动编辑 Jenkinsfile 的方式，流水线分为 “声明式流水线” 和 “脚本化流水线”，可视化编辑支持声明式流水线。Pipeline 语法参见 Jenkins 官方文档。

1. 如下，此处代理的类型选择 `node`，label 填写 `maven`。

> 说明：代理 (Agent) 部分指定整个 Pipeline 或特定阶段将在 Jenkins 环境中执行的位置，具体取决于该 Agent 部分的放置位置，详见 Jenkins Agent 说明。

![Git step 1](../../../images/blogs/spring-cloud-on-kubesphere/5.design.PNG)

2. 在图形化构建流水线的界面，点击左侧结构编辑区域的 `+` 号，增加一个阶段 (Stage)，点击界面中的 `添加步骤`，在右侧输入框将其命名为 `Checkout SCM`。

![Git step 2](../../../images/blogs/spring-cloud-on-kubesphere/6.design.PNG)

3. 然后在此阶段下点击 `添加步骤`。右侧选择 `git`，此阶段通过 Git 拉取仓库的代码，弹窗中填写的信息如下：

  - Url: 填写 Git 示例仓库的 URL https://gitee.com/log4j/pig.git
  - 凭证 ID: 无需填写 （若是私有仓库，如 Gitlab 则需预先创建并填写其凭证 ID）
  - 分支：此处无需填写分支名，不填则默认为 master 分支
  - 完成后点击`确定`保存，可以看到构建的流水线的第一个阶段。

![Git step 3](../../../images/blogs/spring-cloud-on-kubesphere/7.design.PNG)

#### 阶段二：构建 Java 代码

1. 在 `Checkout SCM` 阶段右侧点击 “+” 继续增加一个阶段用于构建 Java 代码，并命名为 `Maven Build`。

![Maven step 1](../../../images/blogs/spring-cloud-on-kubesphere/8.design.PNG)


2. 点击`添加步骤选择`指定容器，命名为 `maven`，完成后点击`确定`。

![Maven step 2](../../../images/blogs/spring-cloud-on-kubesphere/9.design.PNG)

3. 在右侧点击`添加嵌套步骤`，右侧选择 `Shell`，在弹窗中如下输入以下命令：

```bash
mvn clean install
```

![Maven step 3](../../../images/blogs/spring-cloud-on-kubesphere/10.design.PNG)


#### 阶段三：构建并推送镜像

Pig 默认由 7 个微服务，以及 Redis、MySql 等组件构成, 我们可以利用并发任务同时构建所有服务镜像。

服务名称 | Dockerfile 路径 | 说明
---|---|---
pig-mysql | ./db | 基于官方镜像，并包含初始化db脚本
pig-redis | 无 | 官方镜像，无需构建
pig-job | ./pig-visual/pig-xxl-job-admin | XXL jobadmin 非必须
pig-register | ./pig-register | 基于 Nacos 的服务发现与配置管理
pig-gateway | ./pig-gateway |  Spring Cloud 网关
pig-auth | ./pig-auth | 用于用户认证的 Oauth 服务
pig-upms | ./pig-upms/pig-upms-biz | 后台管理 API 服务
pig-monitor | ./pig-visual/pig-monitor | 监控
pig-sentinel | ./pig-visual/pig-sentinel-dashboard | Sentinel Dashboard
pig-codegen | ./pig-visual/pig-codegen | 代码生成器API 

首先,我们以 `pig-register` 为例演示构建和推送的步骤，其他服务按照以下步骤依次设置即可。

1. 在 `Maven Build` 阶段右侧点击 “+” 继续增加一个阶段用于构建并推送镜像至 DockerHub，名称为 `Build Register`。

2. 点击 `添加步骤选择` 指定容器，命名为 `maven`，完成后点击 `确定`。

3. 右侧继续点击 `添加嵌套步骤`，选择 `Shell`，在弹窗中如下输入以下命令基于仓库中的 Dockerfile 构建 Docker 镜像，完成后点击确认保存：

```bash
docker build -f ./pig-register/Dockerfile -t $REGISTRY/$DOCKERHUB_NAMESPACE/pig-register:SNAPSHOT-$BUILD_NUMBER ./pig-register
```
4. 点击 `添加嵌套步骤`，右侧选择 `添加凭证`，在弹窗中填写如下信息，完成后点击 `确定`保存信息：

> 说明：因为考虑到用户信息安全，账号类信息都不以明文出现在脚本中，而以变量的方式。

  - 凭证 ID：选择之前创建的 DockerHub 凭证，如 dockerhub-id
  - 密码变量：DOCKER_PASSWORD
  - 用户名变量：DOCKER_USERNAME

![Docker step 4](../../../images/blogs/spring-cloud-on-kubesphere/11.design.PNG)


5. 在 `添加凭证`步骤中点击 `添加嵌套步骤`，右侧选择 `Shell`，在弹窗中如下输入以下命令登录 Docker Hub：

```bash
echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
```

6. 同上，继续点击 `添加嵌套步骤`添加 `Shell` 输入一条命令推送 SNAPSHOT 镜像至 Docker Hub：

```bash
docker push $REGISTRY/$DOCKERHUB_NAMESPACE/pig-register:SNAPSHOT-$BUILD_NUMBER
```

![Docker step 6](../../../images/blogs/spring-cloud-on-kubesphere/12.design.PNG)


7. 选择添加 `添加并行阶段`， 重复以上步骤添加其他微服务。

#### 阶段四：滚动升级

1. 在 `Build Register` 阶段右侧点击 “+” 继续增加一个阶段用于升级开发环境，名称为 `Deploy`。

2. 右侧继续点击 `添加嵌套步骤`，选择 `Shell`，在弹窗中如下输入以下命令用户下载 kubectl。
```
  curl -LO https://kubernetes-release.pek3b.qingstor.com/release/1.18.3/bin/linux/amd64/kubectl && chmod +x ./kubectl
```
3. 点击 `添加嵌套步骤`，右侧选择 `添加凭证`，在弹窗中选择 Kubernetes 凭证，并填写变量名 `KUBECONFIG`，完成后点击 `确定`保存信息：

4. 在 `添加凭证`步骤中点击 `添加嵌套步骤`，右侧选择 `Shell`，输入以下命令用于保持 kubeconfig 文件。

```
cat > kubeconfig << EOF 
$KUBECONFIG
EOF
```

5. 同上，继续点击 `添加嵌套步骤`添加 `Shell` 使用 kubectl 命令更新镜像文件

```bash
./kubectl -n $PROJECT set image deployment pig-register-v1 *=pig-register:SNAPSHOT-$BUILD_NUMBER --kubeconfig=./kubeconfig
```

### 可视化编辑流水线 - Vue 前端流水线

Vue 后端流水线创建步骤基本一致，除 **阶段二** 中，需要使用 nodejs 容器，并使用以下命令构建 Vue：

```bash
npm install && npm run build:docker
```

### 运行流水

1. 手动构建的流水线在平台中需要手动运行，点击 `运行`，输入参数弹窗中可看到之前定义的三个字符串参数，此处暂无需修改，点击 确定，流水线将开始运行。

![Run pipeline](../../../images/blogs/spring-cloud-on-kubesphere/13.run.PNG)

2. 在 `活动` 列表中可以看到流水线的运行状态，点击 `活动`可查看其运行活动的具体情况。

3. 在活动列表点击运行序号 1，进入序号 `1` 的活动详情页查看流水线的具体运行情况。

### 图形化建微服务

由于 Pig 未提供 Kubernetes 部署所需的 yaml 文件。因此第一次构建流水线后，还不能立即部署微服务。我们可以利用 KubeSphere 提供的服务部署功能进行初始化所有微服务。

#### 使用应用商店部署 Mysql 及 Redis 有状态服务

KubeSphere 基于 OpenPitrix 项目构建了应用商店与应用的生命周期管理。平台中内置了一系列开箱即用的中间件，我们将使用应用商店中的的 MySql 与 Redis 应用。

**部署 Redis**

1. 登录 KubeSphere 后，选择 pig-dev 项目。
2. 进入`应用负载`->`应用` 页面下，选择`部署新应用`

![Redis](../../../images/blogs/spring-cloud-on-kubesphere/14.deploy.PNG)


3. 在`应用商店`中查找 Redis，进入详情页面中点击 `部署` 按钮
4. 在基本信息中，填写应用名称 `pig-redis`, 并`下一步`
![Redis](../../../images/blogs/spring-cloud-on-kubesphere/15.deploy.PNG)
5. Pig 中默认使用无密码模式，因此可以暂时留空。 

> 注:生产环境不推荐将密码设置为空

**部署 MySql**

1. 再次进入应用商店，选择 MySql
2. 在基本信息中，填写应用名称 `pig-mysql`, 并`下一步`
3. 在应用配置中，编辑 yaml 文件。替换 image 与 tag 名称为上一步 build 中的 docker image。并将密码设置为 root

![MySql](../../../images/blogs/spring-cloud-on-kubesphere/16.deploy.PNG)

4. 点击`部署`继续

> 注:一般生产环境使用 flyway 进行数据库初始化脚本及升级管理。Pig 数据库镜像一般适用学习环境。

> 参考: https://v2-1.docs.Kubesphere.io/docs/zh-CN/quick-start/one-click-deploy/

#### 创建 Pig 后端无状态服务

Pig 所依赖的后端微服务为无状态服务。利用 KubeSphere 服务创建向导，我们可以部署这些微服务。

1. 登录 KubeSphere ，进入 `pig` 项目后，选择`应用负载` ->`服务`，点击`创建服务`。

![Service step 1](../../../images/blogs/spring-cloud-on-kubesphere/17.service.PNG)

2. 选择 `无状态服务`，基本信息参考如下，完成后点击 `下一步`。

- 名称：必填，填写 pig-register，其他服务使用 `pig-register` 服务名发现 Nacos 服务并注册，因此 register 服务名不可更改；
- 别名：可选，支持中文帮助更好的区分资源，例如填写 Pig 服务发现；
- 描述信息：简单介绍该工作负载，方便用户进一步了解。

![Service step 2](../../../images/blogs/spring-cloud-on-kubesphere/18.service.PNG)

3. 点击 `添加容器镜像`，镜像为 yourhub/pig-register:SNAPSHOT-1（输入后敲回车键确认），然后点击 `使用默认端口`。
完成后点击 `√`，选择 `下一步`。

![Service step 3](../../../images/blogs/spring-cloud-on-kubesphere/19.service.PNG)

4. 无需设置存储卷，点击 `下一步`。高级设置保留默认，点击 `创建`，即可看到 pig-register 服务已创建成功。上述步骤以创建无状态服务的形式，最终将创建一个 Service 和 Deployment。

![Service step 4](../../../images/blogs/spring-cloud-on-kubesphere/20.service.PNG)

5. 重复以上步骤分别创建 pig-gateway，pig-auth，pig-upms，pig-monitor，pig-sentinel，pig-codegen 等服务。

#### 创建 pig-ui 前端无状态服务

pig-ui 是基于 Vue 的后台管理框架，pig-ui 镜像中除托管UI静态代码外，还提供了反向代理到后端服务。

1. 同上，点击`创建`，参考以上步骤创建一个名为 pig-ui 的无状态服务。

2. 在容器镜像中，点击 `添加容器镜像`，镜像为 yourhub/pig-ui:SNAPSHOT-1（输入后敲回车键确认），然后点击 `使用默认端口`。其它步骤均与上一步一致，最终会再创建一个 pig-ui 的 Service 和 Deployment。

#### 创建应用路由 pig-ingress

1. 选择 `应用负载` -> `应用路由`，点击 `创建应用路由`。
2. 输入名称 pig-ingress，点击 `下一步`，点击 `添加路由规则`。
3. 选择 `自动生成`。
4. `路径` 中输入 /，选择 `pig-ui` 服务，选择 80 端口作为服务端口。 

![ingress](../../../images/blogs/spring-cloud-on-kubesphere/21.ingress.PNG)

5. 完成路由规则设置后点击`√`，选择 `下一步`，点击 `创建`，pig-ingress 创建成功。
6. 进入应用路由详情页面，点击`点击访问`即可打开pig后台管理页面。

## 总结

本文以 Pig 为例演示了 Spring Cloud 项目构建和部署的全过程。在生产实践中具有一定的指导意义，但是由于 Spring Cloud 组件众多，部署方式也会产生相应变化（如集成 Spring Cloud Kubernetes），因此不能覆盖所有场景。除上述 CI/CD 过程外，KubeSphere 还可与 Spring Cloud 进行深度整合，如健康检查，日志管理，流量治理等，更多功能有待进一步挖掘。