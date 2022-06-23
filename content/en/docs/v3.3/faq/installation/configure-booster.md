---
title: "Configure a Booster for Installation"
keywords: 'KubeSphere, booster, installation, faq'
description: 'Set a registry mirror to speed up image downloads during installation.'
linkTitle: "Configure a Booster for Installation"
weight: 16200
---

If you have trouble downloading images from `dockerhub.io`, it is highly recommended that you configure a registry mirror (i.e. booster) beforehand to speed up downloads. You can refer to the [official documentation of Docker](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon) or follow the steps below.

## Get a Booster URL

To configure the booster, you need a registry mirror address. See how you can [get a booster URL from Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/60750.htm?spm=a2c63.p38356.b99.18.4f4133f0uTKb8S).

## Set the Registry Mirror

You can configure the Docker daemon directly or use KubeKey to set the configuration.

### Configure the Docker daemon

{{< notice note >}}

Docker needs to be installed in advance for this method.

{{</ notice >}} 

1. Run the following commands:

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
     registryMirrors: []
     insecureRegistries: []
     privateRegistry: ""
   ```

   {{< notice note >}}

   For more information about each parameter under the `registry` section, see [Kubernetes Cluster Configurations](../../../installing-on-linux/introduction/vars/).

   {{</ notice >}} 

2. Provide the registry mirror address as the value of `registryMirrors` and save the file. For more information about installation, see [Multi-node Installation](../../../installing-on-linux/introduction/multioverview/). 

{{< notice note >}}

If you adopt [All-in-One Installation](../../../quick-start/all-in-one-on-linux/), refer to the first method because a `config-sample.yaml` file is not needed for this mode.

{{</ notice >}} 