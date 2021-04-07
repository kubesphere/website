---
title: "CI/CD Practice for Spring Cloud Microservices based on Kubesphere"
tag: 'Spring Cloud, Kubernetes, KubeSphere, Pig'
createTime: '2020-10-24'
author: 'Zack & Roland'
snapshot: '../../../images/blogs/spring-cloud-on-kubesphere/0.springcloud.png'
---

This tutorial uses Pig as an example to introduce how to publish a CI/CD project based on Spring Cloud microservices on KubeSphere.

## Introduction

### Pig

[Pig](http://pig4cloud.cn/) is an open source microservice development platform based on Spring Cloud and it also serves as a microservices best practice. This platform, which has a large number of domestic supporters, provides technical support with its commercial version.

### KubeSphere

[KubeSphere](https://kubesphere.io/) is an application-centric multi-tenant container platform with [Kubernetes](https://kubernetes.io/) as its kernel. It is a fully open source platform that supports multi-cloud and multi-cluster management and provides full-stack automated IT operation and streamlined DevOps workflows. It also provides developer-friendly wizard web UI, helping enterprises to quickly build out a robust and feature-rich platform.

With KubeSphere, the Pig project can be deployed to Kubernetes in a concise way, so that the Ops team can easily perform the operation and maintenance tasks of Spring Cloud.

### Prerequisites

- You need to acquire the basic knowledge of Spring Cloud and Pig.
- You need to have a basic understanding of Jenkins (optional).
- You need to install KubeSphere v3.0.0 and enable DevOps.

> For more information about how to deploy KubeSphere, refer to [Installing on Kubernetes](https://kubesphere.com.cn/en/docs/installing-on-kubernetes/).

## Architecture

Spring Cloud has an abundant and complete plug-in system to implement various runtime concepts as part of the application stack. Therefore, these microservices have their library and runtime agents to perform client service discovery, configuration management, load balancing, circuit breaking, monitoring, service tracking, and other functions. Since this tutorial focuses on how to quickly establish a CI/CD operation and maintenance system, the deep integration of Spring Cloud and Kubernetes will not be further discussed. We will continue to use these underlying capabilities of Spring Cloud while using Kubernetes to implement functions such as rolling upgrades, health checks, and automatic service restoration.

As shown below, each microservice in Spring Cloud will be deployed using a Deployment. After the Pod is running, it will automatically register with Nacos and obtain the Spring Cloud configuration file. Redis and MySQL will also be published in the Headless service mode in Kubernetes, and each microservice will discover them through CoreDNS. Finally, all traffic will enter the background static website and the microservice gateway (Spring Cloud Gateway) through the Ingress gateway.

![0.springcloud](/images/blogs/en/spring-cloud-on-kubesphere/0.springcloud.png)

## Deployment

Enterprises will select different source code branching models and deployment strategies according to the characteristics of the project during its development. Since the branching models and deployment strategies will not be discussed in this tutorial, we choose the simplest development and deployment process:

**Pull cource code** -> **Build source code** -> **Create and pull image** -> **Deploy a project**

We will create two pipelines, one for building the Pig backend Java code, and the other for the Vue-based Pig-ui frontend code.

### Java Backend Pipelines

> Tasks performed in each stage:
> 1. Pull source code from the registry: https://gitee.com/log4j/pig.git.
> 2. Build backend Java code using Maven.
> 3. Build an image and push it to Docker Hub with the tag `SNAPSHOT-$BUILD_NUMBER`, the `$BUILD_NUMBER` of which is the record serial number in the pipeline's activity list.
> 4. Deploy the project to the development environment. It requires review in this stage. An email will be sent after the Deployment is successful.

### Vue Frontend Pipelines
Creating frontend pipeline is similar to the backend one, except that you should:
> 1. Pull source code from the registry: https://gitee.com/log4j/pig-ui.git.
> 2. Build frontend Javascript code using Node.

## Hands-on Lab

### Create a project

DevOps is a plug-and-play component in KubeSphere, providing CI/CD Pipeline, Binary-to-image, Source-to-image, and other functions. In the DevOps project, we will create the pipeline in a visualized way. In addition to this project, we will also need a KubeSphere project to publish microservices for Pig. Since the open-source version of Pig does not provide a YAML template for Kubernetes, all services that Pig depends on will be published in a visualized way.

1. Log in to the KubeSphere Web console using an account with Workspace adminstration permission.
2. Create a Workspace `pig-workspace`. All resources used in this example will be created in this Workspace.
2. Create a DevOps project `pig-ops` for CI/CD pipeline management.
3. Create a project (namespace) `pig-dev` for deploying Spring Cloud microservices.

> For more infomation, refer to [Graphical CI/CD Pipeline without Jenkinsfile](https://v2-1.docs.kubesphere.io/docs/quick-start/jenkinsfile-out-of-scm/).

### Create credentials

When creating a pipeline, you need to access a DockerHub credential and a Kubernetes credential (KubeConfig is used to deploy microservices to a Kubernetes cluster).

1. Log in to KubeSphere as `admin` and navigate to your DevOps project `pig-ops`.
2. Choose **Credentials** on the left menu and click **Create**.
3. Select **Account Credentials** for Type. Imput your DockerHub username and password, and name the Credential ID `dockerhub-id`. Click **OK**.
4. Click **Create** again. Select **kubeconfig** for type and copy your kubeconfig. Name the Credential ID `kubeconfig-id` and click **OK**.

![Credentials](/images/blogs/en/spring-cloud-on-kubesphere/Credentials.png)

### Create a Pipeline

Refer to the following steps to create and run a complete pipeline.

#### Step 1: Provide the basic information

1. In your DevOps project, choose **Pipelines** on the left menu, and then click **Create**.

   ![Pipeline](/images/blogs/en/spring-cloud-on-kubesphere/Pipeline.png)

2. Enter the basic information of the pipeline in the dialog that appears and then click **Next**.

  - Name: A concise and clear name for the pipeline, which is convient for users to identify, such as `pig-pipeline`.

  - Descrption: A brief introduction of the pipeline for users to further understand its function.

  - Code Repository: You do not need to select code repository in this tutorial.

    ![Pipeline-Basic](/images/blogs/en/spring-cloud-on-kubesphere/Pipeline-Basic.png)


#### Step 2: Advanced Settings

On the **Advanced Settings** page, click **Add Parameter** to add three string parameters as follows. These parameters will be used in the Docker command of the pipeline. Click **Create** when you finish adding.

Parameter Type | Name | Default Value | Description 
---|---|---|---
String | REGISTRY | This is the image registry address. This example uses `docker.io`. | Image Registry
String | DOCKERHUB_NAMESPACE | You Docker Hub account or the organization name under the account.	| DockerHub Namespace
String | PROJECT | The KubeSphere project name `pig-dev`. | Image Registry

![Pipeline Advanced](/images/blogs/en/spring-cloud-on-kubesphere/Pipeline-Advanced.png)

### Visualized Editing of Pipelines - Java Backend Pipelines

The visualization of pipelines consists of four stages. The steps and tasks performed in each stage are explained as follows.

#### Stage 1: Pull source code (Checkout SCM)

The visualized editing page is divided into a structure editing area and a content editing area.  Users do not need to learn the syntax of Jenkinsfile as KubeSphere will automatically generate one based on each stage and step of editing the pipeline, which is very convenient. Besides, the platform also supports the manual editing of Jenkinsfile. Pipelines include [declarative pipelines](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline) and [scripted pipelines](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline). You can create declarative pipelines through the panel. For more information about pipeline syntax, see [Jenkins Documentation](https://jenkins.io/doc/book/pipeline/syntax/).

1. On the graphical editing panel, select **node** from the **Type** drop-down list and input `maven` for **label**.

   > `agent` is used to define the execution environment. The `agent` directive tells Jenkins where and how to execute the pipeline. For more information, see [Choose Jenkins Agent](https://kubesphere.io/docs/devops-user-guide/how-to-use/choose-jenkins-agent/).

   ![Git-step-1](/images/blogs/en/spring-cloud-on-kubesphere/Git-step-1.png)

2. Click the `+` icon on the left to add a stage. Click the box above the **Add Step** area and set a name (for example, `Checkout SCM`) for the stage in the field **Name** on the right.

   ![Git step 2](/images/blogs/en/spring-cloud-on-kubesphere/Git-step-2.png)

3. Click **Add Step**. Select **git** from the list as the example code is pulled from GitHub. In the dialog that appears, fill in the required field.

  - Url: Enter the GitHub repository address `https://gitee.com/log4j/pig.git`.

  - Credential ID: You do not need to enter the credential ID for this tutorial (If it is a private registry such as Gitlab, you need to create it in advance and enter its credential ID).

  - Branch: It defaults to the master branch if you leave it blank.

  - Click **OK** to finish. You can see the first stage of creating a pipeline.

    ![Git step 3](/images/blogs/en/spring-cloud-on-kubesphere/Git-step-3.png)

#### Stage 2: Create Java code

1. Click the `+` icon on the right of  `Checkout SCM` stage to add a new stage to create Java code. Name it `Maven Build`.

   ![Maven step 1](/images/blogs/en/spring-cloud-on-kubesphere/Maven-step-1.png)


2. Click **Add Step** and select **container** from the list. Name it `maven` and then click **OK**.

   ![Maven step 2](/images/blogs/en/spring-cloud-on-kubesphere/Maven-step-2.png)

3. Click **Add nesting steps** and then select **shell** from the list. Enter the following command in the command line and click **OK** to save it.

   ```bash
   mvn clean install
   ```

   ![Maven step 3](/images/blogs/en/spring-cloud-on-kubesphere/Maven-step-3.png)


#### Stage 3: Create and pull image

Pig is composed of seven microservices as well as components such as Redis and MySql. We can use concurrent tasks to create all service images at the same time.

Service Name | Dockerfile Path | Description 
---|---|---
pig-mysql | ./db | It is based on the official image and contains the initialization db script. 
pig-redis | / | You don't have to build this image as it is an official one. 
pig-job | ./pig-visual/pig-xxl-job-admin | XXL jobadmin is not a necessary one. 
pig-register | ./pig-register | It is based on the service discovery and configuration management of Nacos. 
pig-gateway | ./pig-gateway | Spring Cloud gateway. 
pig-auth | ./pig-auth | The Oauth service is used for user authentication. 
pig-upms | ./pig-upms/pig-upms-biz | Background API management. 
pig-monitor | ./pig-visual/pig-monitor | Monitoring. 
pig-sentinel | ./pig-visual/pig-sentinel-dashboard | Sentinel Dashboard. 
pig-codegen | ./pig-visual/pig-codegen | Code Generator API. 

First, we use `pig-register` as an example to demonstrate the steps of creating and pushing image. Other services can also be set according to the following steps.

1. Click `+` on the right of  `Maven Build` stage to add a new stage to create and push image to DockerHub. Name it  `Build Register`.

2. Click **Add Step** and select container from the list. Name it  `maven` and then click **OK**.

3. Click **Add nesting steps** on the right and then select **shell** from the list. Enter the following command to build a Docker image based on the Dockerfile in the registry. Click **OK** to save it.

   ```bash
   docker build -f ./pig-register/Dockerfile -t $REGISTRY/$DOCKERHUB_NAMESPACE/pig-register:SNAPSHOT-$BUILD_NUMBER ./pig-register
   ```

4. Click **Add nesting steps** again and then select **withCredentials** on the list. Imput the following information and click **OK** to confirm.

   > Note: For security reasons, the account information displays as variables in the script.


- **Credential ID**: Select the Docker Hub credentials you created, such as `dockerhub-id`.

  - **Password Variable**: Enter `DOCKER_PASSWORD`.

  - **Username Variable**: Enter `DOCKER_USERNAME`.

    ![Docker step 4](/images/blogs/en/spring-cloud-on-kubesphere/Docker-step-4.png)


5. Click **Add nesting steps** in the **withCredentials** step created above. Select **shell** and enter the following command in the pop-up window, which is used to log in to Docker Hub. Click **OK** to confirm.

   ```bash
   echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
   ```


6. Click **Add nesting steps** in the **withCredentials** step. Select **shell** and enter the following command to push the SNAPSHOT image to Docker Hub. Click **OK** to finish.

   ```bash
   docker push $REGISTRY/$DOCKERHUB_NAMESPACE/pig-register:SNAPSHOT-$BUILD_NUMBER
   ```

   ![Docker step 6](/images/blogs/en/spring-cloud-on-kubesphere/Docker-step-6.png)


7. You can select **Add Parallel Stage** and repeat the above steps to add other microservices.

#### Stage 4: Rolling Updates

1. Click the `+` icon on the right of `Build Registry` stage to add a new stage to upgrade the development environment. Name it `Deploy`.

2. Click **Add Step** and select **shell** on the list. Enter the following command to download kubectl.

   ```
     curl -LO https://kubernetes-release.pek3b.qingstor.com/release/1.18.3/bin/linux/amd64/kubectl && chmod +x ./kubectl
   ```
3. Click **Add Step** and celect **withCredentials**. Select Kubernetes credential and imput the variable `KUBECONFIG`. Click **OK** to confirm.

4. Click **Add nesting steps** under **withCredentials** and select **shell** on the list. Imput the following command to keep the kubeconfig file.

   ```
   cat > kubeconfig << EOF 
   $KUBECONFIG
   EOF
   ```

5. Click **Add nesting steps** again. Select **shell** to use kubectl command to update image file.

   ```bash
   ./kubectl -n $PROJECT set image deployment pig-register-v1 *=pig-register:SNAPSHOT-$BUILD_NUMBER --kubeconfig=./kubeconfig
   ```

### Visualized Ediitng of Pipelines - Vue Frontend Pipelines

The visualization of Vue backend pipelines is similar to the above steps, except that you should use nodejs container in **Stage 2** and use the following command to create Vue.

```bash
npm install && npm run build:docker
```

### Run the Pipeline

1. You should manually run the pipeline that is created through the graphical editing panel. Click **Run** and you can see three string parameters defined before. You don't have to modify these parameters. Click **OK** to run the pipeline.

   ![Run pipeline](/images/blogs/en/spring-cloud-on-kubesphere/Run-pipeline.png)

2. You can see the status of the pipeline under the **Activity** tab. Click the task status to see the details of the pipeline activity.

3. Click the serial number `1` under the **Run** tab to check the detail page of the pipline running status.

### Visualized Creating of Microservices

Pig does not provide with necessary YAML files for Kubernetes deployment, therefore, microservices can not be deployed immediately after the first time of creating a pipeline. You can use the service deployment function provided by KubeSphere to initialize all microservices.

#### Deploy Stateful Services MySQL and Redis from the App Store

KubeSphere integrates [OpenPitrix](https://github.com/openpitrix/openpitrix), an open-source multi-cloud application management platform, to set up the App Store, managing applications throughout their entire lifecycle. This platform has a set of out-of-box middleware and we will deploy MySQL and Redis from the App Store of KubeSphere in this tutorial.

**Deploy Redis**

1. Log in to KubeSphere Web console and select pig-dev project.

2. Go to **Applications** under **Application Workloads** and click **Deploy New Application **.

   ![Redis](/images/blogs/en/spring-cloud-on-kubesphere/Redis.png)


3. Find Redis and click **Deploy** on the **App Info** page.

4. Under **Basic Info**, imput the application name **pig-redis** and click **Next**.

  ![Redis-deploy](/images/blogs/en/spring-cloud-on-kubesphere/Redis-deploy.png)

5. Pig uses passwordless mode by default. You can leave it blank for now.

> Note: It is NOT recommended to set no password for a production environment.

**Deploy MySQL**

1. Go to the App Store again and find MySQL.

2. Under **Basic Info**, imput the application name **pig-mysql** and click **Next**.

3. Edit the YAML file under **App Config**. Replace the `image` and `imageTag` field with the Docker Image in the previous step and set the password to root.

   ![MySql](/images/blogs/en/spring-cloud-on-kubesphere/MySql.png)

4. Click **Deploy** to continue.

> Note: Flyway is often used for database initialization scripts and upgrade management for a general production environment while Pig database images are suitable for a learning environment.

> For more information, refer to [One Click Deploy](https://v2-1.docs.Kubesphere.io/docs/quick-start/one-click-deploy/).

#### Create a Pig Backend Stateless Service

The backend microservices that Pig depends on are stateless services. You can use the KubeSphere Service to create wizards and deploy these microservices.

1. Log in to KubeSphere and go to your `pig-dev` project. Select **Services** under **Application Workloads** and click **Create**.

   ![Service step 1](/images/blogs/en/spring-cloud-on-kubesphere/Service-step-1.png)

2. Click **Stateless Service**. You can refer to the Basic Info as follows. Click **Next** to continue.

- **Name**: Required. Imput `pig-register`. Other services use the service name `pig-register` to identify and regiser the Nacos service, so the register name cannot be changed.

- **Alias**: Optional. It makes resources easier to identify (e.g. imput Pig service discovery).

- **Description**: A Briefly introduction of this workload, making it easier for users to understand.

  ![Service step 2](/images/blogs/en/spring-cloud-on-kubesphere/Service-step-2.png)

3. Click the **Add Container Image** box and imput `yourhub/pig-register:SNAPSHOT-1`. Press **Enter** and click **Use Default Ports**. Click **√** and select **Next** to continue.

  ![Service step 3](/images/blogs/en/spring-cloud-on-kubesphere/Service-step-3.PNG)

4. You can click **Next** directly to skip the **Mount Volume** step. Use the default settings for **Advanced Settings** and click **Create**. You can see that the `pig-register` service has been successfully created. The above steps will create a Service and a Deployment in the form of stateless service.

   ![Service step 4](/images/blogs/en/spring-cloud-on-kubesphere/Service-step-4.png)

5. You can repeat the above steps to create services such as pig-gateway, pig-auth, pig-upms, pig-monitor, pig-sentinel and pig-codegen respectively.

#### Create a pig-ui Frontend Stateless Service

Pig-ui is a background management framework based on Vue. In addition to hosting UI static code, pig-ui images also provide reverse proxy to backend services.

1. Refer to the above steps to create a stateless service named pig-ui.

2. Click **Add Container Image** under the Container Image tab. Imput `yourhub/pig-ui:SNAPSHOT-1` and press **Enter**. And then click **Use Default Ports**. The other steps are the same as the above steps. A service and a deployment of pig-ui will be created.

#### Create a pig-ingress Route

1. Go to **Routes** under **Application Workloads** and click **Create** to create a route.

2. Imput the name `pig-ingress`. Click **Next** and then click **Add Route Rule**.

3. Select **Auto Generate**.

4. Imput **/** , select the **pig-ui** service and imput port 80 as the service port under the **Paths** field.

   ![ingress](/images/blogs/en/spring-cloud-on-kubesphere/ingress.png)

5. After finishing the Route rules configuration, click **√**, and click **Next**. You will see that the pig-ingress has been successfully created.
6. Go to the detail page of the Route, click **Click to visit** to access the pig background managment page.

## Summary

This tutorial demonstrates the entire process of creating and deploying a Spring Cloud project using Pig as an example, which can guide production practices in a certain degree. However, due to the large number of Spring Cloud components, the deployment method may vary accordingly (for example, integrating Spring Cloud Kubernetes), so this tutorial cannot cover all scenarios. In addition to the above CI/CD process, KubeSphere can also be deeply integrated with Spring Cloud to perform more functions, such as health check, log management, traffic management and more.