---
title: "Configure a Booster for Installation"
keywords: 'KubeSphere, booster, installation, faq'
description: 'How to configure a booster for installation'
linkTitle: "Configure a Booster for Installation"
weight: 16200
---

If you have trouble downloading images from `dockerhub.io`, it is highly recommended that you configure a registry mirror (i.e. booster) beforehand to speed up downloads. You can refer to the [official documentation of Docker](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon) or follow the steps below.

## Get a Booster URL

To configure the booster, you need a registry mirror address. See the following example to see how you can get a booster URL from Alibaba Cloud.

1. Log in the console of Alibaba Cloud and enter "container registry" in the search bar. Click **Container Registry** in the drop-down list as below.

   ![container-registry](/images/docs/installing-on-linux/faq/configure-booster/container-registry.png)

2. Click **Image Booster**.

   ![image-booster](/images/docs/installing-on-linux/faq/configure-booster/image-booster.png)

3. You can find the **Booster URL** in the image below as well as the official guide from Alibaba Cloud to help you configure the booster.

   ![booster-url](/images/docs/installing-on-linux/faq/configure-booster/booster-url.png)

## Set the Registry Mirror

You can configure the Docker daemon directly or use KubeKey to set the configuration.

### Configure the Docker daemon

{{< notice note >}}

Docker needs to be installed in advance for this method.

{{</ notice >}} 

1. Execute the following commands:

   ```bash
   sudo mkdir -p /etc/docker
   ```

   ```bash
   sudo vi /etc/docker/daemon.json
   ```

2. Add the `registry-mirrors` key and value to the file.

   ```json
   {
     "registry-mirrors": ["https://<my-docker-mirror-host>"]
   }
   ```

   {{< notice note >}} 

   Make sure you replace the address within the quotation mark above with your own Booster URL.

   {{</ notice >}} 

3. Save the file and reload Docker by executing the following commands so that the change can take effect.

   ```bash
   sudo systemctl daemon-reload
   ```

   ```bash
   sudo systemctl restart docker
   ```

### Use KubeKey to set the registry mirror

1. After you create a `config-sample.yaml` file with KubeKey before installation, navigate to `registry` in the file.

   ```yaml
   registry:
       registryMirrors: [] # For users who need to speed up downloads
       insecureRegistries: [] # Set an address of insecure image registry. See https://docs.docker.com/registry/insecure/
       privateRegistry: "" # Configure a private image registry for air-gapped installation (e.g. docker local registry or Harbor)
   ```

2. Input the registry mirror address above and save the file. For more information about the installation process, see [Multi-Node Installation](../../../installing-on-linux/introduction/multioverview/). 

{{< notice note >}}

If you adopt [All-in-One Installation](../../../quick-start/all-in-one-on-linux/), refer to the first method because a `config-sample.yaml` file is not needed for this mode.

{{</ notice >}} 