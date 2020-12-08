---
title: "Air-Gapped Upgrade with KubeKey"
keywords: "Air-Gapped, kubernetes, upgrade, kubesphere, v3.0.0"
description: "Air-Gapped Upgrade Kubernetes and KubeSphere"

linkTitle: "Air-Gapped Upgrade with KubeKey"
weight: 7400
---
Air-gapped upgrade with KubeKey is recommended for users whose KubeSphere and Kubernetes were both deployed by [All-in-One Installation](https://v2-1.docs.kubesphere.io/docs/installation/all-in-one/) or [Multi-node Installation](https://v2-1.docs.kubesphere.io/docs/installation/multi-node/). If your Kubernetes cluster was provisioned by yourself or cloud providers, please refer to [Air-Gapped Upgrade with ks-installer](../air-gapped-upgrade-with-ks-installer/).

## Prerequisites

1. You need to have a KubeSphere cluster running version 2.1.1.

   {{< notice warning >}}

   If your KubeSphere version is v2.1.0 or earlier, please upgrade to v2.1.1 first.

   {{</ notice >}}

2. Docker Registry

   You need to have a harbor or other Docker registry.

   {{< notice tip >}}

   You can [Prepare a Private Image Registry](../../installing-on-linux/introduction/air-gapped-installation/#step-2-prepare-a-private-image-registry)

   {{</ notice >}}

3. Make sure every node can push and pull images from the Docker Registry.

4. Make sure you read [Release Notes For 3.0.0](../../release/release-v300/) carefully.

   {{< notice warning >}}

   In v3.0.0, KubeSphere refactors many of its components such as Fluent Bit Operator and IAM. Make sure you back up any important components in case you heavily customized them but not from console.

   {{</ notice >}}

5. Make your upgrade plan. Two upgrading scenarios are documented below.

## Air-Gapped Upgrade KubeSphere and Kubernetes

Upgrading steps are different for single-node clusters (all-in-one) and multi-node clusters.

{{< notice info >}}

- Air-gapped upgrading with Kubernetes will cause helm to be upgraded from v2 to v3. If you want to continue using helm2, please back up it: `cp /usr/local/bin/helm /usr/local/bin/helm2`
- When upgrading Kubernetes, KubeKey will upgrade from one MINOR version to the next MINOR version until the target version. For example, you may see the upgrading process going from 1.16 to 1.17 and to 1.18, instead of directly jumping to 1.18 from 1.16.

{{</ notice >}}




### System Requirements

| Systems                                                         | Minimum Requirements (Each node)            |
| --------------------------------------------------------------- | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                                       | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Debian** *Buster, Stretch*                                    | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **CentOS** *7.x*                                                | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Red Hat Enterprise Linux** *7*                                | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **SUSE Linux Enterprise Server** *15* **/openSUSE Leap** *15.2* | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |

{{< notice note >}}

[KubeKey](https://github.com/kubesphere/kubekey) uses `/var/lib/docker` as the default directory where all Docker related files, including images, are stored. It is recommended you add additional storage volumes with at least **100G** mounted to `/var/lib/docker` and `/mnt/registry` respectively. See [fdisk](https://www.computerhope.com/unix/fdisk.htm) command for reference.

{{</ notice >}}


### Step 1: Download KubeKey

Similar to installing KubeSphere on Linux in an online environment, you also need to [download KubeKey](https://github.com/kubesphere/kubekey/releases) first. Download the `tar.gz` file, and transfer it to your local machine which serves as the taskbox for installation. After you uncompress the file, execute the following command to make `kk` executable:

```bash
chmod +x kk
```

### Step 2: Prepare Installation Images

As you install KubeSphere and Kubernetes on Linux, you need to prepare an image package containing all the necessary images and download the Kubernetes binary file in advance.

1. Download the image list file `images-list.txt` from a machine that has access to the Internet through the following command:

   ```bash
   curl -L -O https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/images-list.txt
   ```

   {{< notice note >}}

   This file lists images under `##+modulename` based on different modules. You can add your own images to this file following the same rule. To view the complete file, see [Appendix](../air-gapped-installation/#image-list-of-kubesphere-v300).

   {{</ notice >}} 

2. Download `offline-installation-tool.sh`.

   ```bash
   curl -L -O https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/offline-installation-tool.sh
   ```

3. Make the `.sh` file executable.

   ```bash
   chmod +x offline-installation-tool.sh
   ```

4. You can execute the command `./offline-installation-tool.sh -h` to see how to use the script:

   ```bash
   root@master:/home/ubuntu# ./offline-installation-tool.sh -h
   Usage:
   
     ./offline-installation-tool.sh [-l IMAGES-LIST] [-d IMAGES-DIR] [-r PRIVATE-REGISTRY] [-v KUBERNETES-VERSION ]
   
   Description:
     -b                     : save kubernetes' binaries.
     -d IMAGES-DIR          : the dir of files (tar.gz) which generated by `docker save`. default: /home/ubuntu/kubesphere-images
     -l IMAGES-LIST         : text file with list of images.
     -r PRIVATE-REGISTRY    : target private registry:port.
     -s                     : save model will be applied. Pull the images in the IMAGES-LIST and save images as a tar.gz file.
     -v KUBERNETES-VERSION  : download kubernetes' binaries. default: v1.17.9
     -h                     : usage message
   ```

5. Download the Kubernetes binary file.

   ```bash
   ./offline-installation-tool.sh -b -v v1.17.9 
   ```

   If you cannot access the object storage service of Google, run the following command instead to add the environment variable to change the source.

   ```bash
   export KKZONE=cn;./offline-installation-tool.sh -b -v v1.17.9 
   ```

   {{< notice note >}}

   - You can change the Kubernetes version downloaded based on your needs. Supported versions: v1.15.12, v1.16.13, v1.17.9 (default) and v1.18.6.

   - You can upgrade Kubernetes from v1.16.13 to v1.17.9 by download the v1.17.9 Kubernetes binary file, but for cross-version upgrades, all intermediate version also needs to be downloaded in advance, such as if you want upgrade Kubernetes from v1.15.12 to v1.18.6, you need to download the Kubernetes v1.16.13, v1.17.9 and v1.18.6 binary file.

   - After you run the script, a folder `kubekey` is automatically created. Note that this file and `kk` must be placed in the same directory when you create the cluster later.

   {{</ notice >}} 

6. Pull images in `offline-installation-tool.sh`.

   ```bash
   ./offline-installation-tool.sh -s -l images-list.txt -d ./kubesphere-images
   ```

   {{< notice note >}}

   You can choose to pull images as needed. For example, you can delete `##k8s-images` and related images under it in `images-list.text` if you already have a Kubernetes cluster.

   {{</ notice >}} 

### Step 3: Push Images to Private Registry

   Transfer your packaged image file to your local machine and execute the following command to push it to the registry.

```bash
./offline-installation-tool.sh -l images-list.txt -d ./kubesphere-images -r dockerhub.kubekey.local
```

   {{< notice note >}}

   The domain name is `dockerhub.kubekey.local` in the command. Make sure you use your **own registry address**.

   {{</ notice >}} 

### Air-Gapped Upgrade All-in-one Cluster

#### Example Machine
| Host Name |  IP        |           Role       |   Port  |          URL            |
| --------- | ---------- | -------------------- | ------- | ----------------------- |
|   master  | 192.168.1.1|  Docker Registry     |   5000  | http://192.168.1.1:5000 |
|   master  | 192.168.1.1|  master, etcd, worker|         |                         |

#### Versions

|       | Kubernetes |  KubeSphere |
|------ | ---------- | ----------- |
| Befor |  v1.16.13  |   v2.1.1    |
| After |  v1.17.9   |   v3.0.0    |

#### Upgrade a Cluster

   In this tutorial, KubeSphere is installed on multiple nodes, so you need to specify a configuration file to add host information. Besides, for air-gapped installation, pay special attention to `.spec.registry.privateRegistry`, which must be set to **your own registry address**. See the [complete YAML file](../air-gapped-installation/#2-edit-the-configuration-file) below for more information.

#### Create an Example Configuration File

   Execute the following command to generate an example configuration file for installation:

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

   For example:

```bash
./kk create config --with-kubernetes v1.17.9  --with-kubesphere v3.0.0 -f config-sample.yaml
```

{{< notice note >}}

Make sure the Kubernetes version is the one you downloaded.

{{</ notice >}}

#### Edit the Configuration File

  Edit the generated configuration file `config-sample.yaml`. Here is [an example for your reference](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md)

   {{< notice warning >}} 

   For air-gapped installation, you must specify `privateRegistry`, which is `dockerhub.kubekey.local` in this example.

   {{</ notice >}}

   Set the `hosts` of your `config-sample.yaml` file:

```yaml
  hosts:
  - {name: ks.master, address: 192.168.1.1, internalAddress: 192.168.1.1, user: root, password: Qcloud@123}
  roleGroups:
    etcd:
    - ks.master
    master:
    - ks.master
    worker:
    - ks.master
```

Set the `privateRegistry` value of your `config-sample.yaml` file:
```yaml
  registry:
    registryMirrors: []
    insecureRegistries: []
    privateRegistry: dockerhub.kubekey.local
```

#### Upgrades your single-node cluster to KubeSphere v3.0.0 and Kubernetes v1.17.9 (default)

```bash
./kk upgrade -f config-sample.yaml
```

To upgrade Kubernetes to a specific version, please explicitly provide the version after the flag `--with-kubernetes`. Available versions are:

- v1.15.12
- v1.16.8, v1.16.10, v1.16.12, v1.16.13
- v1.17.0, v1.17.4, v1.17.5, v1.17.6, v1.17.7, v1.17.8, v1.17.9
- v1.18.3, v1.18.5, v1.18.6


### Air-Gapped Upgrade Multi-node Cluster

#### Example Machine
| Host Name |  IP        |           Role       |   Port  |          URL            |
| --------- | ---------- | -------------------- | ------- | ----------------------- |
|   master  | 192.168.1.1|  Docker Registry     |   5000  | http://192.168.1.1:5000 |
|   master  | 192.168.1.1|  master, etcd        |         |                         |
|   slave1  | 192.168.1.2|  worker              |         |                         |
|   slave1  | 192.168.1.3|  worker              |         |                         |


#### Versions

|       | Kubernetes |  KubeSphere |
|------ | ---------- | ----------- |
| Befor |  v1.16.13  |   v2.1.1    |
| After |  v1.17.9   |   v3.0.0    |

#### Upgrade a Cluster

   In this tutorial, KubeSphere is installed on multiple nodes, so you need to specify a configuration file to add host information. Besides, for air-gapped installation, pay special attention to `.spec.registry.privateRegistry`, which must be set to **your own registry address**. See the [complete YAML file](../air-gapped-installation/#2-edit-the-configuration-file) below for more information.

#### Create an Example Configuration File

   Execute the following command to generate an example configuration file for installation:

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

   For example:

```bash
./kk create config --with-kubernetes v1.17.9  --with-kubesphere v3.0.0 -f config-sample.yaml
```

{{< notice note >}}

Make sure the Kubernetes version is the one you downloaded.

{{</ notice >}}

#### Edit the Configuration File

  Edit the generated configuration file `config-sample.yaml`. Here is [an example for your reference](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md)

   {{< notice warning >}} 

   For air-gapped installation, you must specify `privateRegistry`, which is `dockerhub.kubekey.local` in this example.

   {{</ notice >}}

   Set the `hosts` of your `config-sample.yaml` file:

```yaml
  hosts:
  - {name: ks.master, address: 192.168.1.1, internalAddress: 192.168.1.1, user: root, password: Qcloud@123}
  - {name: ks.slave1, address: 192.168.1.2, internalAddress: 192.168.1.2, user: root, privateKeyPath: "/root/.ssh/kp-qingcloud"}
  - {name: ks.slave2, address: 192.168.1.3, internalAddress: 192.168.1.3, user: root, privateKeyPath: "/root/.ssh/kp-qingcloud"}
  roleGroups:
    etcd:
    - ks.master
    master:
    - ks.master
    worker:
    - ks.slave1
    - ks.slave2
```
Set the `privateRegistry` value of your `config-sample.yaml` file:
```yaml
  registry:
    registryMirrors: []
    insecureRegistries: []
    privateRegistry: dockerhub.kubekey.local
```

#### Upgrades your single-node cluster to KubeSphere v3.0.0 and Kubernetes v1.17.9 (default)

```bash
./kk upgrade -f config-sample.yaml
```

To upgrade Kubernetes to a specific version, please explicitly provide the version after the flag `--with-kubernetes`. Available versions are:

- v1.15.12
- v1.16.8, v1.16.10, v1.16.12, v1.16.13
- v1.17.0, v1.17.4, v1.17.5, v1.17.6, v1.17.7, v1.17.8, v1.17.9
- v1.18.3, v1.18.5, v1.18.6

