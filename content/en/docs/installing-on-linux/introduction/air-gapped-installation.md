---
title: "Air-gapped Installation"
keywords: 'Air-gapped, installation, KubeSphere'
description: 'Understand how to install KubeSphere and Kubernetes in the air-gapped environment.'

linkTitle: "Air-gapped Installation"
weight: 3140
---

The air-gapped installation is almost the same as the online installation except that you must create a local registry to host Docker images. This tutorial demonstrates how to install KubeSphere and Kubernetes in an air-gapped environment.

In KubeKey v2.1.0, we bring in concepts of manifest and artifact, which provides a solution for air-gapped installation of Kubernetes clusters. A manifest file describes information of the current Kubernetes cluster and defines content in an artifact. Previously, users had to prepare deployment tools, image (.tar) file, and other binaries as the Kubernetes version and image to deploy are different. Now, with KubeKey, air-gapped installation can never be so easy. You simply use a manifest file to define what you need for your cluster in air-gapped environments, and then export the artifact file to quickly and easily deploy image registries and Kubernetes cluster.

Please see the requirements for hardware and operating system shown below. To get started with multi-node installation, you need to prepare at least three hosts according to the following requirements.

### System requirements

1. Run the following commands to download KubeKey v2.1.0.
   {{< tabs >}}

{{< notice note >}}

- [KubeKey](https://github.com/kubesphere/kubekey) uses `/var/lib/docker` as the default directory where all Docker related files, including images, are stored. It is recommended you add additional storage volumes with at least **100G** mounted to `/var/lib/docker` and `/mnt/registry` respectively. See [fdisk](https://www.computerhope.com/unix/fdisk.htm) command for reference.

   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v2.1.0 sh -
   ```

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
   curl -sfL https://get-kk.kubesphere.io | VERSION=v2.1.0 sh -
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
   
   ```yaml
   ---
   apiVersion: kubekey.kubesphere.io/v1alpha2
   kind: Manifest
   metadata:
     name: sample
   spec:
     arches:
     - amd64
     operatingSystems:
     - arch: amd64
       type: linux
       id: centos
       version: "7"
       repository:
         iso:
           localPath: ""
           url: "https://github.com/kubesphere/kubekey/releases/download/v2.1.0/centos-7-amd64-rpms.iso"
     kubernetesDistributions:
     - type: kubernetes
       version: v1.21.5
     components:
       helm:
         version: v3.6.3
       cni:
         version: v0.9.1
       etcd:
         version: v3.4.13
       ## For now, if your cluster container runtime is containerd, KubeKey will add a docker 20.10.8 container runtime in the below list.
       ## The reason is KubeKey creates a cluster with containerd by installing a docker first and making kubelet connect the socket file of containerd which docker contained.
       containerRuntimes:
       - type: docker
         version: 20.10.8
       crictl:
         version: v1.22.0
       ##
       # docker-registry:
       #   version: "2"
       harbor:
         version: v2.4.1
       docker-compose:
         version: v2.2.2
     images:
     - docker.io/kubesphere/kube-apiserver:v1.21.5
     - docker.io/kubesphere/kube-controller-manager:v1.21.5
     - docker.io/kubesphere/kube-proxy:v1.21.5
     - docker.io/kubesphere/kube-scheduler:v1.21.5
     - docker.io/kubesphere/pause:3.5
     - docker.io/kubesphere/pause:3.4.1
     - docker.io/coredns/coredns:1.8.0
     - docker.io/calico/cni:v3.20.0
     - docker.io/calico/kube-controllers:v3.20.0
     - docker.io/calico/node:v3.20.0
     - docker.io/calico/pod2daemon-flexvol:v3.20.0
     - docker.io/calico/typha:v3.20.0
     - docker.io/kubesphere/flannel:v0.12.0
     - docker.io/openebs/provisioner-localpv:2.10.1
     - docker.io/openebs/linux-utils:2.10.0
     - docker.io/kubesphere/nfs-subdir-external-provisioner:v4.0.2
     - docker.io/kubesphere/k8s-dns-node-cache:1.15.12
     - docker.io/kubesphere/ks-installer:v3.2.1
     - docker.io/kubesphere/ks-apiserver:v3.2.1
     - docker.io/kubesphere/ks-console:v3.2.1
     - docker.io/kubesphere/ks-controller-manager:v3.2.1
     - docker.io/kubesphere/kubectl:v1.21.0
     - docker.io/kubesphere/kubefed:v0.8.1
     - docker.io/kubesphere/tower:v0.2.0
     - docker.io/minio/minio:RELEASE.2019-08-07T01-59-21Z
     - docker.io/minio/mc:RELEASE.2019-08-07T23-14-43Z
     - docker.io/csiplugin/snapshot-controller:v4.0.0
     - docker.io/kubesphere/nginx-ingress-controller:v0.48.1
     - docker.io/mirrorgooglecontainers/defaultbackend-amd64:1.4
     - docker.io/kubesphere/metrics-server:v0.4.2
     - docker.io/library/redis:5.0.14-alpine
     - docker.io/library/haproxy:2.0.25-alpine
     - docker.io/library/haproxy:2.3
     - docker.io/library/alpine:3.14
     - docker.io/osixia/openldap:1.3.0
     - docker.io/kubesphere/netshoot:v1.0
     - docker.io/kubeedge/cloudcore:v1.7.2
     - docker.io/kubesphere/edge-watcher:v0.1.1
     - docker.io/kubesphere/edge-watcher-agent:v0.1.0
     - docker.io/kubesphere/openpitrix-jobs:v3.2.1
     - docker.io/kubesphere/devops-apiserver:v3.2.1
     - docker.io/kubesphere/devops-controller:v3.2.1
     - docker.io/kubesphere/devops-tools:v3.2.1
     - docker.io/kubesphere/ks-jenkins:v3.2.0-2.249.1
     - docker.io/jenkins/jnlp-slave:3.27-1
     - docker.io/kubesphere/builder-base:v3.2.0
     - docker.io/kubesphere/builder-nodejs:v3.2.0
     - docker.io/kubesphere/builder-maven:v3.2.0
     - docker.io/kubesphere/builder-python:v3.2.0
     - docker.io/kubesphere/builder-go:v3.2.0
     - docker.io/kubesphere/builder-base:v3.2.0-podman
     - docker.io/kubesphere/builder-nodejs:v3.2.0-podman
     - docker.io/kubesphere/builder-maven:v3.2.0-podman
     - docker.io/kubesphere/builder-python:v3.2.0-podman
     - docker.io/kubesphere/builder-go:v3.2.0-podman
     - docker.io/kubesphere/s2ioperator:v3.2.0
     - docker.io/kubesphere/s2irun:v3.2.0
     - docker.io/kubesphere/s2i-binary:v3.2.0
     - docker.io/kubesphere/tomcat85-java11-centos7:v3.2.0
     - docker.io/kubesphere/tomcat85-java11-runtime:v3.2.0
     - docker.io/kubesphere/tomcat85-java8-centos7:v3.2.0
     - docker.io/kubesphere/tomcat85-java8-runtime:v3.2.0
     - docker.io/kubesphere/java-11-centos7:v3.2.0
     - docker.io/kubesphere/java-8-centos7:v3.2.0
     - docker.io/kubesphere/java-8-runtime:v3.2.0
     - docker.io/kubesphere/java-11-runtime:v3.2.0
     - docker.io/kubesphere/nodejs-8-centos7:v3.2.0
     - docker.io/kubesphere/nodejs-6-centos7:v3.2.0
     - docker.io/kubesphere/nodejs-4-centos7:v3.2.0
     - docker.io/kubesphere/python-36-centos7:v3.2.0
     - docker.io/kubesphere/python-35-centos7:v3.2.0
     - docker.io/kubesphere/python-34-centos7:v3.2.0
     - docker.io/kubesphere/python-27-centos7:v3.2.0
     - docker.io/jimmidyson/configmap-reload:v0.3.0
     - docker.io/prom/prometheus:v2.26.0
     - docker.io/kubesphere/prometheus-config-reloader:v0.43.2
     - docker.io/kubesphere/prometheus-operator:v0.43.2
     - docker.io/kubesphere/kube-rbac-proxy:v0.8.0
     - docker.io/kubesphere/kube-state-metrics:v1.9.7
     - docker.io/prom/node-exporter:v0.18.1
     - docker.io/kubesphere/k8s-prometheus-adapter-amd64:v0.6.0
     - docker.io/prom/alertmanager:v0.21.0
     - docker.io/thanosio/thanos:v0.18.0
     - docker.io/grafana/grafana:7.4.3
     - docker.io/kubesphere/kube-rbac-proxy:v0.8.0
     - docker.io/kubesphere/notification-manager-operator:v1.4.0
     - docker.io/kubesphere/notification-manager:v1.4.0
     - docker.io/kubesphere/notification-tenant-sidecar:v3.2.0
     - docker.io/kubesphere/elasticsearch-curator:v5.7.6
     - docker.io/kubesphere/elasticsearch-oss:6.7.0-1
     - docker.io/kubesphere/fluentbit-operator:v0.11.0
     - docker.io/library/docker:19.03
     - docker.io/kubesphere/fluent-bit:v1.8.3
     - docker.io/kubesphere/log-sidecar-injector:1.1
     - docker.io/elastic/filebeat:6.7.0
     - docker.io/kubesphere/kube-events-operator:v0.3.0
     - docker.io/kubesphere/kube-events-exporter:v0.3.0
     - docker.io/kubesphere/kube-events-ruler:v0.3.0
     - docker.io/kubesphere/kube-auditing-operator:v0.2.0
     - docker.io/kubesphere/kube-auditing-webhook:v0.2.0
     - docker.io/istio/pilot:1.11.1
     - docker.io/istio/proxyv2:1.11.1
     - docker.io/jaegertracing/jaeger-operator:1.27
     - docker.io/jaegertracing/jaeger-agent:1.27
     - docker.io/jaegertracing/jaeger-collector:1.27
     - docker.io/jaegertracing/jaeger-query:1.27
     - docker.io/jaegertracing/jaeger-es-index-cleaner:1.27
     - docker.io/kubesphere/kiali-operator:v1.38.1
     - docker.io/kubesphere/kiali:v1.38
     - docker.io/library/busybox:1.31.1
     - docker.io/library/nginx:1.14-alpine
     - docker.io/joosthofman/wget:1.0
     - docker.io/nginxdemos/hello:plain-text
     - docker.io/library/wordpress:4.8-apache
     - docker.io/mirrorgooglecontainers/hpa-example:latest
     - docker.io/library/java:openjdk-8-jre-alpine
     - docker.io/fluent/fluentd:v1.4.2-2.0
     - docker.io/library/perl:latest
     - docker.io/kubesphere/examples-bookinfo-productpage-v1:1.16.2
     - docker.io/kubesphere/examples-bookinfo-reviews-v1:1.16.2
     - docker.io/kubesphere/examples-bookinfo-reviews-v2:1.16.2
     - docker.io/kubesphere/examples-bookinfo-details-v1:1.16.2
     - docker.io/kubesphere/examples-bookinfo-ratings-v1:1.16.3
     - docker.io/weaveworks/scope:1.13.0
     registry:
       auths: {}
   ```
   
   {{< notice note >}}

   The path of the certificate is related to the domain name. When you copy the path, use your actual domain name if it is different from the one set above.

   - You can download the ISO files at https://github.com/kubesphere/kubekey/releases/tag/v2.1.0.
   
   {{</ notice >}}
   
4. Export the artifact from the source cluster.
   {{< tabs >}}

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
       namespaceOverride: ""
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```

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