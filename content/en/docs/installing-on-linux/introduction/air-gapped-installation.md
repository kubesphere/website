---
title: "Air-gapped Installation"
keywords: 'Air-gapped, installation, KubeSphere'
description: 'Understand how to install KubeSphere and Kubernetes in the air-gapped environment.'

linkTitle: "Air-gapped Installation"
weight: 3140
---

The air-gapped installation is almost the same as the online installation except that you must create a local registry to host Docker images. This tutorial demonstrates how to install KubeSphere and Kubernetes in an air-gapped environment.

## Step 1: Prepare Linux Hosts

Please see the requirements for hardware and operating system shown below. To get started with multi-node installation, you need to prepare at least three hosts according to the following requirements.

### System requirements

1. Run the following commands to download KubeKey v2.1.0.
   {{< tabs >}}

{{< notice note >}}

- [KubeKey](https://github.com/kubesphere/kubekey) uses `/var/lib/docker` as the default directory where all Docker related files, including images, are stored. It is recommended you add additional storage volumes with at least **100G** mounted to `/var/lib/docker` and `/mnt/registry` respectively. See [fdisk](https://www.computerhope.com/unix/fdisk.htm) command for reference.

   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v2.1.0 sh -
   ```

- [KubeKey](https://github.com/kubesphere/kubekey) uses `/var/lib/docker` as the default directory where all Docker related files, including images, are stored. It is recommended you add additional storage volumes with at least **100G** mounted to `/var/lib/docker` and `/mnt/registry` respectively. See [fdisk](https://www.computerhope.com/unix/fdisk.htm) command for reference.

- Only x86_64 CPUs are supported, and Arm CPUs are not fully supported at present.

{{</ notice >}}

### Node requirements

- It's recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- Ensure your disk of each node is at least **100G**.
- All nodes must be accessible through `SSH`.
- Time synchronization for all nodes.
- `sudo`/`curl`/`openssl` should be used in all nodes.


In KubeKey v2.0.0, we bring in concepts of manifest and artifact, which provides a solution for air-gapped installation of Kubernetes clusters. A manifest file describes information of the current Kubernetes cluster and defines content in an artifact. Previously, users had to prepare deployment tools, image (.tar) file, and other binaries as the Kubernetes version and image to deploy are different. Now, with KubeKey, air-gapped installation can never be so easy. You simply use a manifest file to define what you need for your cluster in air-gapped environments, and then export the artifact file to quickly and easily deploy image registries and Kubernetes cluster.

## Prerequisites

|Host IP| Host Name | Usage      |
| ---------------- | ---- | ---------------- |
|192.168.0.2 | node1    | Online host for packaging the source cluster with Kubernetes v1.21.5 and KubeSphere v3.2.x installed |
|192.168.0.3 | node2    | Control plane node of the air-gapped environment |
|192.168.0.4 | node3    | Image registry node of the air-gapped environment |
## Preparations

1. Run the following commands to download KubeKey v2.0.0.
   {{< tabs >}}

   {{< tab "Good network connections to GitHub/Googleapis" >}}

   Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v2.0.0 sh -
   ```

   {{</ tab >}}

   {{< tab "Poor network connections to GitHub/Googleapis" >}}

   Run the following command first to make sure you download KubeKey from the correct zone.

   ```bash
   export KKZONE=cn
   ```

   Run the following command to download KubeKey:

   ```bash
   openssl req \
   -newkey rsa:4096 -nodes -sha256 -keyout certs/domain.key \
   -x509 -days 36500 -out certs/domain.crt
   ```
   {{</ tab >}}

   {{</ tabs >}}

2. In the source cluster, use KubeKey to create a manifest. The following two methods are supported:

   - (Recommended) In the created cluster, run the following command to create a manifest file:

   ```bash
   ./kk create manifest
   ```

   - Create and compile the manifest file manually according to the template. For more information, see [ manifest-example ](https://github.com/kubesphere/kubekey/blob/master/docs/manifest-example.md).

3. Run the following command to modify the manifest configurations in the source cluster.
   
   ```bash
   vim manifest.yaml
   ```

   ```bash
   cp certs/domain.crt  /etc/docker/certs.d/dockerhub.kubekey.local/ca.crt
   ```
   
   {{< notice note >}}

   The path of the certificate is related to the domain name. When you copy the path, use your actual domain name if it is different from the one set above.

   {{</ notice >}} 

3. To verify whether the private registry is effective, you can copy an image to your local machine first, and use `docker push` and `docker pull` to test it.

   - You can download the ISO files at https://github.com/kubesphere/kubekey/releases/tag/v2.0.0.
   
   {{</ notice >}}
   
4. Export the artifact from the source cluster.
   {{< tabs >}}

   {{< tab "Good network connections to GitHub/Googleapis" >}}

   Run the following command directly:

   ```bash
   ./kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz
   ```

   {{</ tab >}}

   {{< tab "Poor network connections to GitHub/Googleapis" >}}

   Run the following commands:

   ```bash
   export KKZONE=cn
   
   ./kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz
   ```
   {{</ tab >}}

   {{</ tabs >}}

   {{< notice note >}}

   An artifact is a .tgz package containing the image package (.tar) and associated binaries exported from the specified manifest file. You can specify an artifact in the KubeKey commands for initializing the image registry, creating clusters, adding nodes, and upgrading clusters, and then KubeKey will automatically unpack the artifact and use the unpacked file when running the command.

   - Make sure the network connection is working.

   - When exporting artifacts, KubeKey pulls images in the image list of the manifest file one by one. Make sure that the worker nodes have a minimum version of 1.4.9 containerd or that of 18.09 docker installed.

   - KubeKey will resolve image names in the image list. If the image registry requires authentication, you can configure it in **.registry.auths** in the manifest file.
   {{</ notice >}}
## Install Clusters in the Air-gapped Environment

1. Copy the downloaded KubeKey and artifact to nodes in the air-gapped environment using a USB device.

2. Run the following command to create a configuration file for the air-gapped cluster:

   ```bash
   ./kk create config --with-kubesphere v3.2.1 --with-kubernetes v1.21.5 -f config-sample.yaml
   ```

3. Run the following command to modify the configuration file:

   ```bash
   vim config-sample.yaml
   ```

   {{< notice note >}}

   - Modify the node information according to the actual configuration of the air-gapped environment.
   - You must specify the node where the `registry` to deploy (for KubeKey deployment of self-built Harbor registries).
   - In `registry`, the value of `type` must be specified as that of `harbor`. Otherwise, the docker registry is installed by default.
   
   {{</ notice >}}

   ```yaml
   apiVersion: kubekey.kubesphere.io/v1alpha2
   kind: Cluster
   metadata:
     name: sample
   spec:
     hosts:
     - {name: master, address: 192.168.149.133, internalAddress: 192.168.149.133, user: root, password: "Qcloud@123"}
     - {name: node1, address: 192.168.149.134, internalAddress: 192.168.149.134, user: root, password: "Qcloud@123"}
   
     roleGroups:
       etcd:
       - master
       control-plane:
       - master
       worker:
       - node1
       # If you want to use KubeKey to automatically deploy the image registry, set this value. You are advised to separately deploy the registry and the cluster.
       registry:
       - node1
     controlPlaneEndpoint:
       ## Internal loadbalancer for apiservers
       # internalLoadbalancer: haproxy
   
       domain: lb.kubesphere.local
       address: ""
       port: 6443
     kubernetes:
       version: v1.21.5
       clusterName: cluster.local
     network:
       plugin: calico
       kubePodsCIDR: 10.233.64.0/18
       kubeServiceCIDR: 10.233.0.0/18
       ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
       multusCNI:
         enabled: false
     registry:
       # To use KubeKey to deploy Harbor, set the value of this parameter to harbor. If you do not set this parameter and still use KubeKey to create an container image registry, the docker registry is used by default.
       type: harbor
       # If Harbor or other registries deployed by using KubeKey requires login, you can set the auths parameter of the registry. However, if you create a docker registry using KubeKey, you do not need to set the auths parameter.
       # Note: If you use KubeKey to deploy Harbor, do not set this parameter until Harbor is started.
       #auths:
       #  "dockerhub.kubekey.local":
       #    username: admin
       #    password: Harbor12345
       plainHTTP: false
       # Set the private registry to use during cluster deployment.
       privateRegistry: ""
       namespaceOverride: ""
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```


4. Run the following command to install an image registry:

   ```bash
   ./kk init registry -f config-sample.yaml -a kubesphere.tar.gz
   ```
   {{< notice note >}}

   The parameters in the command are explained as follows:

   - **config-sample.yaml**: Specifies the configuration file of the cluster in the air-gapped environment.

   - **kubesphere.tar.gz**: Specifies the image package of the source cluster.

    {{</ notice >}}

   - In **auths**, enter **dockerhub.kubekey.local**, username (**admin**) and password (**Harbor12345**).
   - In **privateRegistry**, enter **dockerhub.kubekey.local**.
   - In **namespaceOverride**, enter **kubesphereio**.

    {{</ notice >}}

   ```yaml
     ...
     registry:
       type: harbor
       auths:
         "dockerhub.kubekey.local":
           username: admin
           password: Harbor12345
       plainHTTP: false
       privateRegistry: "dockerhub.kubekey.local"
       namespaceOverride: "kubesphereio"
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```

### Create an example configuration file

Execute the following command to generate an example configuration file for installation:

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

For example:

   As Harbor adopts the Role-based Access Control (RBAC) mechanism, which means that only specified users can perform certain operations. Therefore, you must create a project before pushing images to Harbor. Harbor supports two types of projects:

   - **Public**: All users can pull images from the project.

   - **Private**: Only project members can pull images from the project.

   The username and password for logging in to Harbor is **admin** and **Harbor12345** by default. The installation file of Harbor is located in **/opt/harbor**, where you can perform O&M of Harbor.


  
    {{</ notice >}}

   Method 1: Run the following commands to create a Harbor project.

   a. Run the following command to download the specified script to initialize the Harbor registry:

      ```bash
      curl -O https://raw.githubusercontent.com/kubesphere/ks-installer/master/scripts/create_project_harbor.sh
      ```

   b. Run the following command to modify the script configuration file:

      ```bash
      vim create_project_harbor.sh
      ```

      ```yaml
      #!/usr/bin/env bash
      
      # Copyright 2018 The KubeSphere Authors.
      #
      # Licensed under the Apache License, Version 2.0 (the "License");
      # you may not use this file except in compliance with the License.
      # You may obtain a copy of the License at
      #
      #     http://www.apache.org/licenses/LICENSE-2.0
      #
      # Unless required by applicable law or agreed to in writing, software
      # distributed under the License is distributed on an "AS IS" BASIS,
      # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      # See the License for the specific language governing permissions and
      # limitations under the License.
      
      url="https://dockerhub.kubekey.local"  #Change the value of url to https://dockerhub.kubekey.local.
      user="admin"
      passwd="Harbor12345"
      
      harbor_projects=(library
          kubesphereio
          kubesphere
          calico
          coredns
          openebs
          csiplugin
          minio
          mirrorgooglecontainers
          osixia
          prom
          thanosio
          jimmidyson
          grafana
          elastic
          istio
          jaegertracing
          jenkins
          weaveworks
          openpitrix
          joosthofman
          nginxdemos
          fluent
          kubeedge
      )
      
      for project in "${harbor_projects[@]}"; do
          echo "creating $project"
          curl -u "${user}:${passwd}" -X POST -H "Content-Type: application/json" "${url}/api/v2.0/projects" -d "{ \"project_name\": \"${project}\", \"public\": true}" -k #Add -k at the end of the curl command.
      done
      
      ```

   {{< notice note >}}

   - Change the value of **url** to **https://dockerhub.kubekey.local**.

   - The project name of the registry must be the same as that of the image list.

   - Add **-k** at the end of the **curl** command.

   {{</ notice >}}

   c. Run the following commands to create a Harbor project:
   
      ```bash
      chmod +x create_project_harbor.sh
      ```
   
      ```bash
      ./create_project_harbor.sh
      ```
   
   Method 2: Log in to Harbor and create a project. Set the project to **Public**, so that any user can pull images from this project. For more information, please refer to [Create Projects]( https://goharbor.io/docs/1.10/working-with-projects/create-projects/).
   
   ![harbor-login](/images/docs/appstore/built-in-apps/harbor-app/harbor-login.jpg)
   
6. Run the following command again to modify the cluster configuration file：

   ```bash
   vim config-sample.yaml
   ```

   {{< notice note >}}

   - In **auths**, add **dockerhub.kubekey.local** and the username and password.
   - In **privateRegistry**, add **dockerhub.kubekey.local**.

    {{</ notice >}}

   ```yaml
     ...
     registry:
       type: harbor
       auths:
         "dockerhub.kubekey.local":
           username: admin
           password: Harbor12345
       plainHTTP: false
       privateRegistry: "dockerhub.kubekey.local"
       namespaceOverride: "kubesphereio"
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```
   {{< notice note >}}

   - In **auths**, enter **dockerhub.kubekey.local**, username (**admin**) and password (**Harbor12345**).
   - In **privateRegistry**, enter **dockerhub.kubekey.local**.
   - In **namespaceOverride**, enter **kubesphereio**.

    {{</ notice >}}
7. Run the following command to install a KubeSphere cluster:

   ```bash
   ./kk create cluster -f config-sample1.yaml -a kubesphere.tar.gz --with-packages
   ```

   The parameters are explained as follows：

   - **config-sample.yaml**: Specifies the configuration file for the cluster in the air-gapped environment.
   - **kubesphere.tar.gz**: Specifies the  tarball image from which the source cluster is packaged.
   - **--with-packages**: This parameter is required if you want to install the ISO dependencies.

8. Run the following command to view the cluster status:

   ```bash
   $ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
   ```

   After the installation is completed, the following information is displayed:

   ```bash
   **************************************************
   #####################################################
   ###              Welcome to KubeSphere!           ###
   #####################################################
   
   Console: http://192.168.149.133:30880
   Account: admin
   Password: P@88w0rd
   
   NOTES：
   1. After you log into the console, please check the
   monitoring status of service components in
   the "Cluster Management". If any service is not
   ready, please wait patiently until all components
   are up and running.
   1. Please change the default password after login.
   
   #####################################################
   https://kubesphere.io             2022-02-28 23:30:06
   #####################################################
   ```

9.  Access KubeSphere's web console at `http://{IP}:30880` using the default account and password `admin/P@88w0rd`.

   ![login](/images/docs/installing-on-kubernetes/introduction/overview/login.png)

   {{< notice note >}}

   To access the console, make sure that port 30880 is enabled in your security group.
   
   {{</ notice >}}