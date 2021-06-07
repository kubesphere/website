---
title: "Image Registries"
keywords: 'KubeSphere, Kubernetes, docker, Secrets'
description: 'Learn how to create an image registry in KubeSphere.'
linkTitle: "Image Registries"
weight: 10430
---

A Docker image is a read-only template that can be used to deploy container services. Each image has a unique identifier (i.e. image name:tag). For example, an image can contain a complete package of an Ubuntu operating system environment with only Apache and a few applications installed. An image registry is used to store and distribute Docker images.

This tutorial demonstrates how to create Secrets for different image registries.

## Prerequisites

You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Create a Secret

When you create workloads, [Services](../../../project-user-guide/application-workloads/services/), [Jobs](../../../project-user-guide/application-workloads/jobs/), or [CronJobs](../../../project-user-guide/application-workloads/cronjobs/), you can select images from your private registry in addition to the public registry. To use images from your private registry, you must create a Secret for it so that the registry can be integrated to KubeSphere.

### Step 1: Open the dashboard

Log in to the web console of KubeSphere as `project-regular`. Go to **Configurations** of a project, choose **Secrets** and click **Create**.

![open-dashboard](/images/docs/project-user-guide/configurations/image-registries/open-dashboard.jpg)

### Step 2: Enter basic information

Specify a name for the Secret (for example, `demo-registry-secret`) and click **Next** to continue.

{{< notice tip >}}

You can see the Secret's manifest file in YAML format by enabling **Edit Mode** in the top-right corner. KubeSphere allows you to edit the manifest file directly to create a Secret. Alternatively, you can follow the steps below to create a Secret via the dashboard.

{{</ notice >}} 

![create-secret](/images/docs/project-user-guide/configurations/image-registries/create-secret.jpg)

### Step 3: Specify image registry information

Select **Image Registry Secret** for **Type**. To use images from your private registry as you create application workloads, you need to specify the following fields.

- **Registry Address**. The address of the image registry that stores images for you to use when creating application workloads.
- **User Name**. The account name you use to log in to the registry.
- **Password**. The password you use to log in to the registry.
- **Email** (Optional). Your email address.

![image-registry-info](/images/docs/project-user-guide/configurations/image-registries/image-registry-info.jpg)

#### Add the Docker Hub registry

1. Before you add your image registry in [Docker Hub](https://hub.docker.com/), make sure you have an available Docker Hub account. On the **Secret Settings** page, enter `docker.io` for **Registry Address** and enter your Docker ID and password for **User Name** and **Password**. Click **Validate** to check whether the address is available. 

   ![validate-registry-address](/images/docs/project-user-guide/configurations/image-registries/validate-registry-address.jpg)

2. Click **Create**. Later, the Secret will appear on the **Secrets** page. For more information about how to edit the Secret after you create it, see [Check Secret Details](../../../project-user-guide/configuration/secrets/#check-secret-details).

#### Add the Harbor image registry

[Harbor](https://goharbor.io/) is an open-source trusted cloud-native registry project that stores, signs, and scans content. Harbor extends the open-source Docker Distribution by adding the functionalities usually required by users such as security, identity and management. Harbor uses http and https to serve registry requests.

**Http**

1. You need to modify the Docker configuration for all nodes within the cluster. For example, if there is an external Harbor registry and its IP address is `http://192.168.0.99`, then you need to add the field `--insecure-registry=192.168.0.99` to `/etc/systemd/system/docker.service.d/docker-options.conf`:

   ```bash
   [Service]
   Environment="DOCKER_OPTS=--registry-mirror=https://registry.docker-cn.com --insecure-registry=10.233.0.0/18 --data-root=/var/lib/docker --log-opt max-size=50m --log-opt max-file=5 \
   --insecure-registry=192.168.0.99"
   ```

   {{< notice note >}} 

   - Replace the image registry address with your own registry address.

   - `Environment` represents [dockerd options](https://docs.docker.com/engine/reference/commandline/dockerd/).

   - `--insecure-registry` is required by the Docker daemon for the communication with an insecure registry. Refer to [docker docs](https://docs.docker.com/engine/reference/commandline/dockerd/#insecure-registries) for its syntax.

   {{</ notice >}}

2. After that, reload the configuration file and restart Docker:

   ```bash
   sudo systemctl daemon-reload
   ```

   ```bash
   sudo systemctl restart docker
   ```

3. Go back to the **Secret Settings** page and select **Image Registry Secret** for **Type**. Enter your Harbor IP address for **Registry Address** and enter the username and password.

   ![harbor-address](/images/docs/project-user-guide/configurations/image-registries/harbor-address.jpg)

   {{< notice note >}} 

   If you want to use the domain name instead of the IP address with Harbor, you may need to configure the CoreDNS and nodelocaldns within the cluster.

   {{</ notice >}} 
   
4. Click **Create**. Later, the Secret will appear on the **Secrets** page. For more information about how to edit the Secret after you create it, see [Check Secret Details](../../../project-user-guide/configuration/secrets/#check-secret-details).

**Https**

For the integration of the https-based Harbor registry, refer to [Harbor Documentation](https://goharbor.io/docs/1.10/install-config/configure-https/). Make sure you use `docker login` to connect to your Harbor registry.

## Use an Image Registry

When you set images, you can select the private image registry if the Secret of it is created in advance. For example, click the arrow on the **Container Image** page to expand the registry list when you create a [Deployment](../../../project-user-guide/application-workloads/deployments/). After you choose the image registry, enter the image name and tag to use the image.

![use-image-registry](/images/docs/project-user-guide/configurations/image-registries/use-image-registry.jpg)