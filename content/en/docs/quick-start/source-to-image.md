---
title: "Source to Image: Publish Your App without Dockerfile"
keywords: 'kubesphere, kubernetes, docker, jenkins, s2i, source to image'
description: 'Publish your application using source to image'

linkTitle: "7"
weight: 3070
---

## What is Source to Image

As [Features and Benefits](../../introduction/features) elaborates, Source-to-Image (S2I) is a toolkit and workflow for building reproducible container images from source code. S2I produces ready-to-run images by injecting source code into a container image and letting the container prepare that source code for execution. KubeSphere integrates S2I to enable automatically building images and publishing to Kubernetes without writing Dockerfile.

## Objective

This tutorial will use S2I to import source code of a Java sample project into KubeSphere, build a docker image and push to a target registry, finally publish to Kubernetes and expose the service to outside.

![S2I Process](https://pek3b.qingstor.com/kubesphere-docs/png/20200207162613.png)

## Prerequisites

- You need to enable [KubeSphere DevOps system](../../installation/install-devops).
- You need to create [GitHub](https://github.com/) and [DockerHub](http://www.dockerhub.com/) accounts. GitLab and Harbor are also supported. We will use GitHub and DockerHub in this tutorial.
- You need to create a workspace, a project and `project-regular` account with the role of operator, see [Getting Started with Multi-tenant Management](/../../quick-start/admin-quick-start).
- Set CI dedicated node for building images, please refer to [Set CI Node for Dependency Cache](../../devops/devops-ci-node). This is not mandatory but recommended for development and production environment since it caches code dependency.

## Estimated Time

20-30 minutes

## Hands-on Lab

### Step 1: Create Secrets

Log in KubeSphere with the account `project-regular`. Go to your project and create the secrets for DockerHub and GitHub. Please reference [Creating Common-used Secrets](../../configuration/secrets#create-common-used-secrets).

> Note you may not need to create GitHub Secret if your forked project below is open to public.

### Step 2: Fork Project

Log in GitHub and fork the GitHub repository [devops-java-sample](https://github.com/kubesphere/devops-java-sample) to your personal GitHub account.

![Fork Project](https://pek3b.qingstor.com/kubesphere-docs/png/20200210174640.png)

### Step 3: Create Service

#### Fill in Basic Information

3.1 Navigate to **Application Workloads → Services**, click **Create Service**.

![Create Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200210180908.png)

3.2 Choose **Java** under **Build a new service from source code repository**, then name it `s2i-demo` and click **Next**.

#### Build Settings

3.3. Now we need go to GitHub and copy the URL of the forked repository first.

![GitHub](https://pek3b.qingstor.com/kubesphere-docs/png/20200210215006.png)

3.4. Paste the URL in **Code URL**, enter `<dockerhub_username>/<image_name>` into **imageName**, e.g. `pengfeizhou/s2i-sample` in this demo. As for **secret** and **Target image repository**, you need to choose the secrets created in step 1, let's say `dockerhub-id` and `github-id` respectively.

> Note: KubeSphere has built in common S2I templates for Java, Node.js and Python. It allows you to [customize S2I template](../../developer/s2i-template) for other languages.

![Build Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200210220057.png)

3.5. Click **Next** to **Container Setting** tab. In the **Service Settings** part, name the service `http-port` for example. **Container Port** and **Service Port** are both `8080`.

![Container Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200226173052.png)

3.6. Scroll down to **Health Checker**, check it and click `Add Container ready check`, fill in the contents as follows:

- Port: enter `8080`; it maps to the service port that we need to check.
- Initial Delay(s): `30`; number of seconds after the container has started before liveness or readiness probes are initiated.
- Timeout(s): `10`; number of seconds after the probe times out. Default is 1 second.

![Health Checker](https://pek3b.qingstor.com/kubesphere-docs/png/20200210223047.png)

Then click `√` to save it when you are done, and click **Next**.

#### Create S2I Deployment

Click **Next** again to skip **Mount Volumes**. Check **Internet Access**, then choose **NodePort** to expose S2I service through `<NodeIP>:<NodePort>`. Now click **Create** to start the S2I process.

![Internet Access](https://pek3b.qingstor.com/kubesphere-docs/png/20200210223251.png)

### Step 4: Verify Build Progress

Choose **Image Builder**, drill into the new generated S2I build.

![Build Progress](https://pek3b.qingstor.com/kubesphere-docs/png/20200210224618.png)

You will be able to inspect the logs by expanding **Job Records**. Normally you can see it outputs "Build completed successfully" in the end.

![Build Logs](https://pek3b.qingstor.com/kubesphere-docs/png/20200210225006.png)

So far this S2I build has created corresponding Job, Deployment and Service accordingly, We can verify each resource object as follows.

#### Job

![Job](https://pek3b.qingstor.com/kubesphere-docs/png/20200210230158.png)

#### Deployment

![Deployment](https://pek3b.qingstor.com/kubesphere-docs/png/20200210230217.png)

#### Service

![Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200210230239.png)

### Step 5: Access S2I Service

Go into S2I service detailed page, access this service through either `Endpoints`, or `<ClusterIP>:<Service Port>`, or `<NodeIP>:<NodePort>`.

![Access Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200210230444.png)

```bash
$ curl 10.233.90.126:8080
Really appreciate your star, that is the power of our life.
```

> Tip: If you need to access to this service externally, make sure the traffic can pass through the NodePort. You may configure firewall and port forward according to your environment.

### Step 6: Verify Image Registry

Since you set DockerHub as the target registry, you can log in to your personal DockerHub to check if the sample image has been pushed by the S2I job.

![Image in DockerHub](https://pek3b.qingstor.com/kubesphere-docs/png/20200210231552.png)

Congratulation! You have been familiar with S2I tool.
