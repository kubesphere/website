---
title: "Binary to Image - Publish Artifacts to Kubernetes"
keywords: "kubesphere, kubernetes, docker, B2I, binary to image, jenkins"
description: "Deploy Artifacts to Kubernetes Using Binary to Image"

linkTitle: "8"
weight: 3080
---

## What is Binary to Image

As similar as [Source to Image (S2I)](../source-to-image), Binary to Image (B2I) is a toolkit and workflow for building reproducible container images from binary executables like Jar, War, binary package, etc. All you need to do is to upload your artifact, and specify the image repository such as DockerHub or Harbor to where you want to push. After you run a B2I process, your image will be pushed to the target repository and your application will be automatically deployed to Kubernetes as well.

## How does B2I Improve CD Efficiency

From the introduction above we can see B2I bridges your binary executables to cloud native services with no complicated configurations or coding which is extremely useful for legacy applications and the users who are not familiar with Docker and Kubernetes. Moreover, with B2I tool, as said, you do not need to write Dockerfile, it not only reduces learning costs but improves publishing efficiency, which enables developers to focus on business itself. In a word, B2I can greatly empower enterprises for continuous delivery that is one of the keys to digital transformation.

The following figure describes the step-by-step process of B2I. B2I has instrumented and streamlined the steps, so it takes few clicks to complete in KubeSphere console.

![B2I Process](https://pek3b.qingstor.com/kubesphere-docs/png/20200108144952.png)

> - ① Create B2I in KubeSphere console and upload artifact or binary package
> - ② B2I will create K8s Job, Deployment and Service based on the uploaded binary
> - ③ Automatically package the artifact into Docker image
> - ④ Push image to DockerHub or Harbor
> - ⑤ B2I Job will pull the image from registry for Deployment created in the second step
> - ⑥ Automatically publish the service to Kubernetes
>
> Note: In the process, the B2I Job also reports status in the backend.

In this document, we will walk you through how to use B2I in KubeSphere. For more testing purposes on your own, we provide five artifact packages that you can download from the sites in the following tables.

|Artifact Package (Click to download) | GitHub Repository|
| ---  |  ---- |
| [b2i-war-java8.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war)| [Spring-MVC-Showcase](https://github.com/spring-projects/spring-mvc-showcase)|
|[b2i-war-java11.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java11.war)| [SpringMVC5](https://github.com/kubesphere/s2i-java-container/tree/master/tomcat/examples/springmvc5)
|[b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary)| [DevOps-go-sample](https://github.com/runzexia/devops-go-sample) |
|[b2i-jar-java11.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java11.jar) |[java-maven-example](https://github.com/kubesphere/s2i-java-container/tree/master/java/examples/maven) |
|[b2i-jar-java8.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java8.jar) | [devops-java-sample](https://github.com/kubesphere/devops-java-sample) |

## Prerequisites

- You have installed [KubeSphere DevOps System](../../installation/install-devops).
- You have created a workspace, a project and a `project-regular` account. Please see [Get Started with Multi-tenant Management](../admin-quick-start).
- Set CI dedicated node for building images, please refer to [Set CI Node for Dependency Cache](../../devops/devops-ci-node). This is not mandatory but recommended for development and production environment since it caches artifacts dependency.

## Hands-on Lab

In this lab, we will learn how to use B2I by creating service in KubeSphere, and how to automatically complete six steps described in the workflow graph above.

### Step 1: Create a Secret

We need to create a secret since B2I Job will push the image to DockerHub. If you have finished [S2I lab](../source-to-image), you already have the secret created. Otherwise, log in KubeSphere with the account `project-regular`. Go to your project and create the secret for DockerHub. Please reference [Creating Common-used Secrets](../../configuration/secrets#create-common-used-secrets).

### Step 2: Create a Service

2.1. Select **Application Workloads → Services**, then click **Create** to create a new service through the artifact.

![Create Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200108170544.png)

2.2. Scroll down to **Build a new service through the artifact** and choose **war**. We will use the [Spring-MVC-Showcase](https://github.com/spring-projects/spring-mvc-showcase) project as a sample by uploading the WAR artifact ([b2i-war-java8](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war)) to KubeSphere.

2.3. Enter service name `b2i-war-java8`, click **Next**.

2.4. Refer to the following instructions to fill in **Build Settings**.

- Upload `b2i-war-java8.war` to KubeSphere.
- Choose `tomcat85-java8-centos7:latest` as the build environment.
- Enter `<DOCKERHUB_USERNAME>/<IMAGE NAME>` or `<HARBOR-PROJECT_NAME>/<IMAGE NAME>` as image name.
- Tag the image, for instance, `latest`.
- Select `dockerhub-secret` that we created in previous step as target image repository: .

![Build Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200108175747.png)

2.5. Click **Next** to the **Container Settings** and configure the basic info as shown in the figure below.

![Container Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200108175907.png)

2.6. Click **Next** and continue to click **Next** to skip **Mount Volumes**.

2.7. Check **Internet Access** and choose **NodePort**, then click **Create**.

![Internet Access](https://pek3b.qingstor.com/kubesphere-docs/png/20200108180015.png)

### Step 3: Verify B2I Build Status

3.1. Choose **Image Builder** and click into **b2i-war-java8-xxx** to inspect B2I building status.

![Image Builder](https://pek3b.qingstor.com/kubesphere-docs/png/20200108181100.png)

3.2. Now it is ready to verify the status. You can expand the Job records to inspect the rolling logs. Normally, it will execute successfully in 2~4 minutes.

![Job Records](https://pek3b.qingstor.com/kubesphere-docs/png/20200108181133.png)

### Step 4: Verify the resources created by B2I

#### Service

![Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200108182649.png)

#### Deployment

![Deployment](https://pek3b.qingstor.com/kubesphere-docs/png/20200108182707.png)

#### Job

![Job](https://pek3b.qingstor.com/kubesphere-docs/png/20200108183640.png)

Alternatively, if you want to use command line to inspect those resources, you can use web kubectl from the Toolbox at the bottom right of console. Note it requires cluster admin account to open the tool.

![Web Kubectl](https://pek3b.qingstor.com/kubesphere-docs/png/20200108184829.png)

### Step 5: Access the Service

Click into service **b2i-war-java8**. We can get the NodePort and Endpoints. Thereby we can access the **Spring-MVC-Showcase** service via Endpoints within cluster, or browse the web service externally using `http://{$Node IP}:{$NodePort}/{$Binary-Package-Name}/`.

![Resource Info](https://pek3b.qingstor.com/kubesphere-docs/png/20200108185210.png)

For the example above, enter **http://139.198.111.111:30182/b2i-war-java8/** to access **Spring-MVC-Showcase**. Make sure the traffic can pass through the NodePort.

![Access the Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200108190256.png)

### Step 6: Verify Image in DockerHub

Sign in DockerHub with your account, you can find the image was successfully pushed to DockerHub with tag `latest`.

 ![Image in DockerHub](https://pek3b.qingstor.com/kubesphere-docs/png/20200108191311.png)

Congratulation! Now you know how to use B2I to package your artifacts into Docker image, however, without learning Docker.
