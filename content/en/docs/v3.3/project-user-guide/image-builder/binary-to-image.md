---
title: "Binary to Image: Publish an Artifact to Kubernetes"
keywords: "KubeSphere, Kubernetes, Docker, B2I, Binary-to-Image"
description: "Use B2I to import an artifact and push it to a target repository."
linkTitle: "Binary to Image: Publish an Artifact to Kubernetes"
weight: 10620
---

Binary-to-Image (B2I) is a toolkit and workflow for building reproducible container images from binary executables such as Jar, War, and binary packages. More specifically, you upload an artifact and specify a target repository such as Docker Hub or Harbor where you want to push the image. If everything runs successfully, your image will be pushed to the target repository and your application will be automatically deployed to Kubernetes if you create a Service in the workflow.

In a B2I workflow, you do not need to write any Dockerfile. This not only reduces learning costs but improves release efficiency, which allows users to focus more on business.

This tutorial demonstrates two different ways to build an image based on an artifact in a B2I workflow. Ultimately, the image will be released to Docker Hub.

For demonstration and testing purposes, here are some example artifacts you can use to implement the B2I workflow:

| Artifact Package                                             | GitHub Repository                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [b2i-war-java8.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war) | [spring-mvc-showcase](https://github.com/spring-projects/spring-mvc-showcase) |
| [b2i-war-java11.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java11.war) | [springmvc5](https://github.com/kubesphere/s2i-java-container/tree/master/tomcat/examples/springmvc5) |
| [b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary) | [devops-go-sample](https://github.com/runzexia/devops-go-sample) |
| [b2i-jar-java11.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java11.jar) | [ java-maven-example](https://github.com/kubesphere/s2i-java-container/tree/master/java/examples/maven) |
| [b2i-jar-java8.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java8.jar) | [devops-maven-sample](https://github.com/kubesphere/devops-maven-sample) |

## Prerequisites

- You have enabled the [KubeSphere DevOps System](../../../pluggable-components/devops/).
- You need to create a [Docker Hub](http://www.dockerhub.com/) account. GitLab and Harbor are also supported.
- You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- Set a CI dedicated node for building images. This is not mandatory but recommended for the development and production environment as it caches dependencies and reduces build time. For more information, see [Set a CI Node for Dependency Caching](../../../devops-user-guide/how-to-use/devops-settings/set-ci-node/).

## Create a Service Using Binary-to-Image (B2I)

The steps below show how to upload an artifact, build an image and release it to Kubernetes by creating a Service in a B2I workflow.

![service-build](/images/docs/v3.3/project-user-guide/image-builder/b2i-publish-artifact-to-kubernetes/service-build.png)

### Step 1: Create a Docker Hub Secret

You must create a Docker Hub Secret so that the Docker image created through B2I can be push to Docker Hub. Log in to KubeSphere as `project-regular`, go to your project and create a Secret for Docker Hub. For more information, see [Create the Most Common Secrets](../../../project-user-guide/configuration/secrets/#create-the-most-common-secrets).

### Step 2: Create a Service

1. In the same project, navigate to **Services** under **Application Workloads** and click **Create**.

2. Scroll down to **Create Service from Artifact** and select **WAR**. This tutorial uses the [spring-mvc-showcase](https://github.com/spring-projects/spring-mvc-showcase) project as a sample and uploads a war artifact to KubeSphere. Set a name, such as `b2i-war-java8`, and click **Next**.

3. On the **Build Settings** page, provide the following information accordingly and click **Next**.

   **Service Type**: Select **Stateless Service** for this example. For more information about different Services, see [Service Type](../../../project-user-guide/application-workloads/services/#service-type).

   **Artifact File**: Upload the war artifact ([b2i-war-java8](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war)).

   **Build Environment**: Select **kubesphere/tomcat85-java8-centos7:v2.1.0**.

   **Image Name**: Enter `<DOCKERHUB_USERNAME>/<IMAGE NAME>` or `<HARBOR-PROJECT_NAME>/<IMAGE NAME>` as the image name.

   **Image Tag**: The image tag. Enter `latest`.

   **Target Image Registry**: Select the Docker Hub Secret as the image is pushed to Docker Hub.
   
4. On the **Pod Settings** page, scroll down to **Port Settings** to set the access policy for the container. Select **HTTP** for **Protocol**, customize the name (for example, `http-port`), and enter `8080` for both **Container Port** and **Service Port**. Click **Next** to continue.

   {{< notice note >}}

   For more information about how to set other parameters on the **Container Settings** page, see [Pod Settings](../../../project-user-guide/application-workloads/container-image-settings/).

   {{</ notice >}} 

5. On the **Storage Settings** page, you can add a volume for the container. For more information, see [Volumes](../../../project-user-guide/storage/volumes/). Click **Next** to continue.

6. On the **Advanced Settings** page, select **External Access** and choose **NodePort** as the access method. Click **Create** to finish the whole process.

7. Click **Image Builders** from the navigation bar and you can see that the example image is being built.

### Step 3: Check results

1. Wait for a while and you can see the status of the image builder has reached **Successful**.

2. Click this image to go to its details page. Under **Job Records**, click <img src="/images/docs/v3.3/project-user-guide/image-builder/b2i-publish-artifact-to-kubernetes/down-arrow.png" width="20px" alt="icon" /> on the right of a record to see building logs. You can see `Build completed successfully` at the end of the log if everything runs normally.

3. Go back to the **Services**, **Deployments**, and **Jobs** page, and you can see the corresponding Service, Deployment, and Job of the image have been all created successfully.

4. In your Docker Hub repository, you can see that KubeSphere has pushed the image to the repository with the expected tag.

### Step 4: Access the B2I Service

1. On the **Services** page, click the B2I Service to go to its details page, where you can see the port number has been exposed.

2. Access the Service at `http://<Node IP>:<NodePort>/<Binary-Package-Name>/`.

   {{< notice note >}}

   You may need to open the port in your security groups and configure port forwarding rules depending on your deployment environment.

   {{</ notice >}} 

## Use the Image Builder to build an image

The example above implements the entire workflow of B2I by creating a Service. Alternatively, you can use the Image Builder directly to build an image based on an artifact while this method will not publish the image to Kubernetes.

![build-binary](/images/docs/v3.3/project-user-guide/image-builder/b2i-publish-artifact-to-kubernetes/build-binary.png)

{{< notice note >}}

Make sure you have created a Secret for Docker Hub. For more information, see [Create the Most Common Secrets](../../../project-user-guide/configuration/secrets/#create-the-most-common-secrets).

{{</ notice >}} 

### Step 1: Upload an artifact

1. Log in to KubeSphere as `project-regular` and go to your project.

2. Select **Image Builders** from the navigation bar and click **Create**.

3. In the displayed dialog box, select **Binary** and click **Next**.

4. On the **Build Settings** page, provide the following information accordingly and click **Create**.

   **Artifact File**: Download [b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary) and upload it to KubeSphere.

   **Build Environment**: Select **kubesphere/s2i-binary:v2.1.0**.

   **Image Name**: Customize an image name.

   **Image Tag**: The image tag. Enter `latest`.

   **Target Image Registry**: Select the Docker Hub Secret as the image is pushed to Docker Hub.

5. On the **Image Builder** page, you can see that the image is being built.

### Step 2: Check results

1. Wait for a while and you can see the status of the image builder has reached **Successful**.

2. Click this image builder to go to its details page. Under **Job Records**, click <img src="/images/docs/v3.3/project-user-guide/image-builder/b2i-publish-artifact-to-kubernetes/down-arrow.png" width="20px" alt="icon" /> on the right of a record to see building logs. You can see `Build completed successfully` at the end of the log if everything runs normally.

3. Go to the **Jobs** page, and you can see the corresponding Job of the image has been created successfully.

4. In your Docker Hub repository, you can see that KubeSphere has pushed the image to the repository with the expected tag.

