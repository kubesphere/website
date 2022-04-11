---
title: "Air-gapped Installation"
keywords: 'Air-gapped, installation, KubeSphere'
description: 'Understand how to install KubeSphere and Kubernetes in the air-gapped environment.'

linkTitle: "Air-gapped Installation"
weight: 3140
---

KubeKey is an open-source, lightweight tool for deploying Kubernetes clusters. It allows you to install Kubernetes/K3s only, both Kubernetes/K3s and KubeSphere, and other cloud-native plugins in a flexible, fast, and convenient way. Additionally, it is an effective tool for scaling and upgrading clusters.

In KubeKey v2.0.0, we bring in concepts of manifest and artifact, which provides a solution for air-gapped installation of Kubernetes clusters. A manifest file describes information of the current Kubernetes cluster and defines content in an artifact. Previously, users had to prepare deployment tools, image (.tar) file, and other binaries as the Kubernetes version and image to deploy are different. Now, with KubeKey, air-gapped installation can never be so easy. You simply use a manifest file to define what you need for your cluster in air-gapped environments, and then export the artifact file to quickly and easily deploy image registries and Kubernetes cluster.

## Prerequisites

|Item| Quantity | Usage      |
| ---------------- | ---- | ---------------- |
|KubeSphere 3.2.x| 1    | For packaging the source cluster. |
|Servers| 2    | For air-gapped deployment. |

## Preparations

1. Run the following commands to download and decompress KubeKey v2.0.0.

   ```bash
   $ wget https://github.com/kubesphere/kubekey/releases/download/v2.0.0/kubekey-v2.0.0-linux-amd64.tar.gz
   ```

   ```bash
   $ tar -zxvf kubekey-v2.0.0-linux-amd64.tar.gz
   ```

2. In the source cluster, use KubeKey to create a manifest. The following two methods are supported:

   - (Recommended) In the created cluster, run the following command to create a manifest file:

   ```bash
   $ ./kk create manifest
   ```

   - Create and compile the manifest file manually according to the template. For more information, see [ manifest-example ](https://github.com/kubesphere/kubekey/blob/master/docs/manifest-example.md).

3. Run the following command to modify the manifest configurations in the source cluster.
   
   ```bash
   $ vim manifest.yaml
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
           localPath: /mnt/sdb/kk2.0-rc/kubekey/centos-7-amd64-rpms.iso
           url: #Enter the downloading address.
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
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.22.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.22.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.22.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.22.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.21.5
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.21.5
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.21.5
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.21.5
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.20.10
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.20.10
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.20.10
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.20.10
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.19.9
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.19.9
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.19.9
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.19.9
     - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.5
     - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.4.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.8.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/cni:v3.20.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.20.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.20.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol:v3.20.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/typha:v3.20.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/flannel:v0.12.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv:2.10.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/linux-utils:2.10.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.3
     - registry.cn-beijing.aliyuncs.com/kubesphereio/nfs-subdir-external-provisioner:v4.0.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.15.12
     - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer:v3.2.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver:v3.2.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console:v3.2.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager:v3.2.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.21.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.20.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kubefed:v0.8.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/tower:v0.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z
     - registry.cn-beijing.aliyuncs.com/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z
     - registry.cn-beijing.aliyuncs.com/kubesphereio/snapshot-controller:v4.0.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/nginx-ingress-controller:v0.48.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-amd64:1.4
     - registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/redis:5.0.14-alpine
     - registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.0.25-alpine
     - registry.cn-beijing.aliyuncs.com/kubesphereio/alpine:3.14
     - registry.cn-beijing.aliyuncs.com/kubesphereio/openldap:1.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/netshoot:v1.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/cloudcore:v1.7.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/edge-watcher:v0.1.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/edge-watcher-agent:v0.1.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/gatekeeper:v3.5.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/openpitrix-jobs:v3.2.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-apiserver:v3.2.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-controller:v3.2.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-tools:v3.2.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.2.0-2.249.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/jnlp-slave:3.27-1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-base:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-nodejs:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-python:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-base:v3.2.0-podman
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-nodejs:v3.2.0-podman
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0-podman
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-python:v3.2.0-podman
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0-podman
     - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0-podman
     - registry.cn-beijing.aliyuncs.com/kubesphereio/s2ioperator:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/s2irun:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/s2i-binary:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java11-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java11-runtime:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java8-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java8-runtime:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/java-11-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/java-8-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/java-8-runtime:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/java-11-runtime:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/nodejs-8-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/nodejs-6-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/nodejs-4-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/python-36-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/python-35-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/python-34-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/python-27-centos7:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/configmap-reload:v0.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus:v2.26.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-config-reloader:v0.43.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-operator:v0.43.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.8.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-state-metrics:v1.9.7
     - registry.cn-beijing.aliyuncs.com/kubesphereio/node-exporter:v0.18.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-prometheus-adapter-amd64:v0.6.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/alertmanager:v0.21.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/thanos:v0.18.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/grafana:7.4.3
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.8.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager-operator:v1.4.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager:v1.4.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-tenant-sidecar:v3.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/elasticsearch-curator:v5.7.6
     - registry.cn-beijing.aliyuncs.com/kubesphereio/elasticsearch-oss:6.7.0-1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/fluentbit-operator:v0.11.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/docker:19.03
     - registry.cn-beijing.aliyuncs.com/kubesphereio/fluent-bit:v1.8.3
     - registry.cn-beijing.aliyuncs.com/kubesphereio/log-sidecar-injector:1.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/filebeat:6.7.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-operator:v0.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-exporter:v0.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-ruler:v0.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-auditing-operator:v0.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-auditing-webhook:v0.2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/pilot:1.11.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/proxyv2:1.11.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-operator:1.27
     - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-agent:1.27
     - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-collector:1.27
     - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-query:1.27
     - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-es-index-cleaner:1.27
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kiali-operator:v1.38.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kiali:v1.38
     - registry.cn-beijing.aliyuncs.com/kubesphereio/busybox:1.31.1
     - registry.cn-beijing.aliyuncs.com/kubesphereio/nginx:1.14-alpine
     - registry.cn-beijing.aliyuncs.com/kubesphereio/wget:1.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/hello:plain-text
     - registry.cn-beijing.aliyuncs.com/kubesphereio/wordpress:4.8-apache
     - registry.cn-beijing.aliyuncs.com/kubesphereio/hpa-example:latest
     - registry.cn-beijing.aliyuncs.com/kubesphereio/java:openjdk-8-jre-alpine
     - registry.cn-beijing.aliyuncs.com/kubesphereio/fluentd:v1.4.2-2.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/perl:latest
     - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-productpage-v1:1.16.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-reviews-v1:1.16.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-reviews-v2:1.16.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-details-v1:1.16.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-ratings-v1:1.16.3
     registry:
       auths: {}
   ```
   
   {{< notice note >}}
   
   - In the registry, you need to specify the dependent ISO package of the server. To do this, you can fill in the download address in `url`or download the ISO package in advance and fill in the local path in **localPath** and delete the `url` configuration item.
   
   - You need to enable **harbor** and **docker-compose** configuration items, which will be used when you use KubeKey to build a Harbor registry for pushing images.
   
   - By default, the list of images in the created manifest is obtained from **docker.io**.
   
   - You can customize the **manifest-sample.yaml** file to export the desired artifact file.
   
   {{</ notice >}}
   
4. Export the artifact from the source cluster.
   
   If you are able to access GitHub and Googleapis, run the following command:

   ```bash
   $ ./kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz
   ```
   If you are unable to access GitHub and Googleapis, run the following commands:

   ```bash
   export KKZONE=cn
   
   $ ./kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz
   ```

   {{< notice note >}}

   The artifact is a .tgz package containing the image package (.tar) and associated binaries exported from the specified manifest file. You can specify an artifact in the KubeKey commands for initializing the image registry, creating clusters, adding nodes, and upgrading clusters, and then KubeKey will automatically unpack the artifact and use the unpacked file when running the command.

   - Make sure the network connection is working.

   - When exporting artifacts, KubeKey pulls images in the image list of the manifest file one by one. Make sure that the worker nodes have containerd or a minimum version of 18.09 docker installed.

   - KubeKey will resolve image names in the image list. If the image registry requires authentication, you can configure it in **.registry.auths** in the manifest file.
   {{</ notice >}}
## Install a Kubernetes Cluster in the Air-gapped Environment

1. Copy the downloaded KubeKey and artifact to nodes in the air-gapped environment using a USB device.

2. Run the following command to create a configuration file for the air-gapped cluster:

   ```bash
   $./kk create config --with-kubesphere v3.2.1 --with-kubernetes v1.21.5 -f config-sample.yaml
   ```

3. Run the following command to modify the configuration file:

   ```bash
   $ vim config-sample.yaml
   ```

   {{< notice note >}}

   - Modify the node information according to the actual configuration of the air-gapped environment.
   - You must specify the node where the `registry` to deploy (for KubeKey deployment of self-built Harbor registries).
   - In `registry`, the value of `type` must be specified as `harbor`. Otherwise, the docker registry is installed by default.
   
   {{</ notice >}}

   ```yaml
   apiVersion: kubekey.kubesphere.io/v1alpha2
   kind: Cluster
   metadata:
     name: sample
   spec:
     hosts:
     - {name: master, address: 192.168.149.133, internalAddress: 192.168.149.133, user: root, password: "Supaur@2022"}
     - {name: node1, address: 192.168.149.134, internalAddress: 192.168.149.134, user: root, password: "Supaur@2022"}
   
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
       privateRegistry: "dockerhub.kubekey.local"
       namespaceOverride: ""
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```


4. Run the following command to install an image registry:

   ```bash
   $ ./kk init registry -f config-sample.yaml -a kubesphere.tar.gz
   ```
   {{< notice note >}}

   The parameters in the command are explained as follows:

   - **config-sample.yaml**: Specifies the configuration file of the cluster in the air-gapped environment.

   - **kubesphere.tar.gz**: Specifies the image package of the source cluster.

     The installation file of Harbor is located in **/opt/harbor**, where you can perform O&M of Harbor.
   
    {{</ notice >}}

5. Create a Harbor project.

   Method 1: Run the following commands to create a Harbor project.

   a. Run the following command to download the specified script to initialize the Harbor registry:

      ```bash
      $ curl https://github.com/kubesphere/ks-installer/blob/master/scripts/create_project_harbor.sh
      ```

   b. Run the following command to modify the script configuration file:

      ```bash
      $ vim create_project_harbor.sh
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
          kubesphereio  #The project name of the registry must be the same as that of the image list.
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
      $ chmod +x create_project_harbor.sh
      ```
   
      ```bash
      $ ./create_project_harbor.sh
      ```
   
   Method 2: Log in to Harbor and create a project. Set the project to **Public**, so that any user can pull images from this project.
   
   ![harbor-login](/images/docs/appstore/built-in-apps/harbor-app/harbor-login.jpg)
   
6. Run the following command again to modify the cluster configuration file：

   ```bash
   $ vim config-sample.yaml
   ```

   {{< notice note >}}

   - In **auths**, add **dockerhub.kubekey.local** and the username and password.
   - In **privateRegistry**, add **dockerhub.kubekey.local**.
   - In **namespaceOverride**, add **kubesphereio** (matches the newly created project in the repository).

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

7. Run the following command to install a KubeSphere cluster:

   ```bash
   $ ./kk create cluster -f config-sample1.yaml -a kubesphere.tar.gz --with-kubernetes v1.21.5 --with-kubesphere v3.2.1 --with-packages
   ```


   The parameters are explained as follows：

   - **config-sample.yaml**: Specifies the configuration file for the cluster in the air-gapped environment.
   - **kubesphere.tar.gz**: Specifies the  tarball image from which the source cluster is packaged.
   - **-with-kubesphere**: Specifies the  KubepShere version.
   - **--with-kubernetes**: Specifies the  Kubernetes version.
   - **--with-packages**: This parameter is mandatory. If it is not added, installing the ISO dependency would fail.

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

9. Access KubeSphere's web console at `http://{IP}:30880` using the default account and password `admin/P@88w0rd`.

   ![login](/images/docs/installing-on-kubernetes/introduction/overview/login.png)

   {{< notice note >}}

   To access the console, make sure that port 30880 is enabled in your security group.
   
   {{</ notice >}}