---
title: "离线安装"
keywords: '离线, 安装, KubeSphere'
description: '如何在离线环境安装 KubeSphere。'

linkTitle: "离线安装"
weight: 3130
---

离线安装几乎与在线安装相同，不同之处是您必须创建一个本地仓库来托管 Docker 镜像。本教程演示了如何在离线环境安装 KubeSphere 和 Kubernetes。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/docs-v3.0/%E5%AE%89%E8%A3%85%E4%B8%8E%E9%83%A8%E7%BD%B2_5_%E7%A6%BB%E7%BA%BF%E9%83%A8%E7%BD%B2%E5%A4%9A%E8%8A%82%E7%82%B9KubeSphere%E9%9B%86%E7%BE%A4.mp4">
</video>

## 步骤 1：准备 Linux 主机

请查看下表中对硬件和操作系统的要求。要开始进行多节点安装，您需要按照下列要求准备至少三台主机。

### 系统要求

| 系统                                                   | 最低要求（每个节点）              |
| ------------------------------------------------------ | --------------------------------- |
| **Ubuntu** *16.04, 18.04*                              | CPU: 2 核，内存：4 G，硬盘：100 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 核，内存：4 G，硬盘：100 G |
| **CentOS** *7*.x                                       | CPU: 2 核，内存：4 G，硬盘：100 G |
| **Red Hat Enterprise Linux 7**                         | CPU: 2 核，内存：4 G，硬盘：100 G |
| **SUSE Linux Enterprise Server 15/openSUSE Leap 15.2** | CPU: 2 核，内存：4 G，硬盘：100 G |

{{< notice note >}}

[KubeKey](https://github.com/kubesphere/kubekey) 使用 `/var/lib/docker` 作为默认路径来存储所有 Docker 相关文件（包括镜像）。建议您添加附加存储卷，分别给 `/var/lib/docker` 和 `/mnt/registry` 挂载至少 **100G**。请参见 [fdisk](https://www.computerhope.com/unix/fdisk.htm) 的参考命令。

{{</ notice >}}

### 节点要求

- 建议您使用干净的操作系统（不安装任何其他软件），否则可能会有冲突。
- 请确保每个节点的硬盘至少有 **100G**。
- 所有节点必须都能通过 `SSH` 访问。
- 所有节点时间同步。
- 所有节点都应使用 `sudo`/`curl`/`openssl`。
- 请您务必在离线环境中安装 `docker`。


KubeKey 能够同时安装 Kubernetes 和 KubeSphere。根据要安装的 Kubernetes 版本，需要安装的依赖项可能会不同。您可以参考下方列表，查看是否需要提前在您的节点上安装相关依赖项。

| 依赖项      | Kubernetes 版本 ≥ 1.18 | Kubernetes 版本 < 1.18 |
| ----------- | ---------------------- | ---------------------- |
| `socat`     | 必须                   | 可选但建议             |
| `conntrack` | 必须                   | 可选但建议             |
| `ebtables`  | 可选但建议             | 可选但建议             |
| `ipset`     | 可选但建议             | 可选但建议             |

{{< notice note >}}

- 在离线环境中，您可以使用私有包、RPM 包（适用于 CentOS）或者 Deb 包（适用于 Debian）来安装这些依赖项。
- 建议您事先创建一个操作系统镜像文件，并且安装好所有相关依赖项。这样，您便可以直接使用该镜像文件在每台机器上安装操作系统，提高部署效率，也不用担心任何依赖项问题。

{{</ notice >}} 

### 网络和 DNS 要求

- 请确保 `/etc/resolv.conf` 中的 DNS 地址可用，否则可能会导致集群中的 DNS 出问题。
- 如果您的网络配置使用防火墙或者安全组，请务必确保基础设施组件能够通过特定端口相互通信。建议您关闭防火墙。有关更多信息，请参考[端口要求](../port-firewall/)。

### 示例机器

本示例包含三台主机，如下所示，主节点充当任务机。

| 主机 IP     | 主机名称 | 角色         |
| ----------- | -------- | ------------ |
| 192.168.0.2 | master   | master, etcd |
| 192.168.0.3 | node1    | worker       |
| 192.168.0.4 | node2    | worker       |

## 步骤 2：准备一个私有镜像仓库

您可以使用 Harbor 或者其他任意私有镜像仓库。本教程以 Docker 仓库作为示例，并使用[自签名证书](https://docs.docker.com/registry/insecure/#use-self-signed-certificates)（如果您有自己的私有镜像仓库，可以跳过这一步）。

### 使用自签名证书

1. 执行以下命令生成您自己的证书：

   ```bash
   mkdir -p certs
   ```

   ```bash
   openssl req \
   -newkey rsa:4096 -nodes -sha256 -keyout certs/domain.key \
   -x509 -days 36500 -out certs/domain.crt
   ```

2. 当您生成自己的证书时，请确保在字段 `Common Name` 中指定一个域名。例如，本示例中该字段被指定为 `dockerhub.kubekey.local`。

   ![自签名证书](/images/docs/zh-cn/installing-on-linux/introduction/air-gapped-installation/self-signed-cert.jpg)

### 启动 Docker 仓库

执行以下命令启动 Docker 仓库：

```
docker run -d \
  --restart=always \
  --name registry \
  -v "$(pwd)"/certs:/certs \
  -v /mnt/registry:/var/lib/registry \
  -e REGISTRY_HTTP_ADDR=0.0.0.0:443 \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  -p 443:443 \
  registry:2
```

### 配置仓库

1. 在 `/etc/hosts` 中添加一个条目，将主机名（即仓库域名；在本示例中是 `dockerhub.kubekey.local`）映射到您机器的私有 IP 地址，如下所示。

   ```bash
   # docker registry
   192.168.0.2 dockerhub.kubekey.local
   ```

2. 执行以下命令，复制证书到指定目录，并使 Docker 信任该证书。

   ```bash
   mkdir -p  /etc/docker/certs.d/dockerhub.kubekey.local
   ```

   ```bash
   cp certs/domain.crt  /etc/docker/certs.d/dockerhub.kubekey.local/ca.crt
   ```

   {{< notice note >}}

   证书的路径与域名相关联。当您复制路径时，如果与上面设置的路径不同，请使用实际域名。

   {{</ notice >}} 

3. 要验证私有仓库是否有效，您可以先复制一个镜像到您的本地机器，然后使用 `docker push` 和 `docker pull` 来测试。


## 步骤 3：下载 KubeKey

与在 Linux 上在线安装 KubeSphere 相似，您也需要事先[下载 KubeKey](https://github.com/kubesphere/kubekey/releases)。下载 `tar.gz` 文件，将它传输到充当任务机的本地机器上进行安装。解压文件后，执行以下命令，使 `kk` 可执行。

```bash
chmod +x kk
```

## 步骤 4：准备安装镜像

当您在 Linux 上安装 KubeSphere 和 Kubernetes 时，需要准备一个包含所有必需镜像的镜像包，并事先下载 Kubernetes 二进制文件。

1. 使用以下命令从能够访问互联网的机器上下载镜像清单文件 `images-list.txt`：

   ```bash
   curl -L -O https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/images-list.txt
   ```

   {{< notice note >}}

   该文件根据不同的模块列出了 `##+modulename` 下的镜像。您可以按照相同的规则把自己的镜像添加到这个文件中。要查看完整文件，请参见[附录](../air-gapped-installation/#kubesphere-v300-镜像清单)。

   {{</ notice >}} 

2. 下载 `offline-installation-tool.sh`。

   ```bash
   curl -L -O https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/offline-installation-tool.sh
   ```

3. 使 `.sh` 文件可执行。

   ```bash
   chmod +x offline-installation-tool.sh
   ```

4. 您可以执行命令 `./offline-installation-tool.sh -h` 来查看如何使用脚本：

   ```bash
   root@master:/home/ubuntu# ./offline-installation-tool.sh -h
   Usage:
   
     ./offline-installation-tool.sh [-l IMAGES-LIST] [-d IMAGES-DIR] [-r PRIVATE-REGISTRY] [-v KUBERNETES-VERSION ]
   
   Description:
     -b                     : save kubernetes' binaries.
     -d IMAGES-DIR          : the dir of files (tar.gz) which generated by `docker save`. default: ./kubesphere-images
     -l IMAGES-LIST         : text file with list of images.
     -r PRIVATE-REGISTRY    : target private registry:port.
     -s                     : save model will be applied. Pull the images in the IMAGES-LIST and save images as a tar.gz file.
     -v KUBERNETES-VERSION  : download kubernetes' binaries. default: v1.17.9
     -h                     : usage message
   ```

5. 下载 Kubernetes 二进制文件。

   ```bash
   ./offline-installation-tool.sh -b -v v1.17.9 
   ```

   如果您无法访问 Google 的对象存储服务，请运行以下命令添加环境变量以变更来源。

   ```bash
   export KKZONE=cn;./offline-installation-tool.sh -b -v v1.17.9 
   ```

   {{< notice note >}}

   - 您可以根据自己的需求变更下载的 Kubernetes 版本。支持的版本：v1.15.12、v1.16.13、v1.17.9（默认） 以及 v1.18.6。

   - 运行脚本后，会自动创建一个文件夹 `kubekey`。请注意，您稍后创建集群时，该文件和 `kk` 必须放在同一个目录下。

   {{</ notice >}} 

6. 在 `offline-installation-tool.sh` 中拉取镜像。

   ```bash
   ./offline-installation-tool.sh -s -l images-list.txt -d ./kubesphere-images
   ```

   {{< notice note >}}

   您可以根据需要选择拉取的镜像。例如，如果已经有一个 Kubernetes 集群了，您可以在 `images-list.text` 中删除 `##k8s-images` 和在它下面的相关镜像。

   {{</ notice >}} 

## 步骤 5：推送镜像至私有仓库

将打包的镜像文件传输至您的本地机器，并运行以下命令把它推送至仓库。

```bash
./offline-installation-tool.sh -l images-list.txt -d ./kubesphere-images -r dockerhub.kubekey.local
```

{{< notice note >}}

命令中的域名是 `dockerhub.kubekey.local`。请确保使用您**自己仓库的地址**。

{{</ notice >}} 

## 步骤 6：创建集群

本教程中，KubeSphere 安装在多个节点上，因此您需要指定一个配置文件以添加主机信息。此外，离线安装时，请务必将 `.spec.registry.privateRegistry` 设置为**您自己的仓库地址**。有关更多信息，请参见下面的[完整 YAML 文件](../air-gapped-installation/#编辑配置文件)。

### 创建示例配置文件

执行以下命令生成示例配置文件用于安装：

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

例如：

```bash
./kk create config --with-kubesphere -f config-sample.yaml
```

{{< notice note >}}

- 请确保 Kubernetes 版本和您下载的版本一致。

- 如果您在这一步的命令中不添加标志 `--with-kubesphere`，则不会部署 KubeSphere，只能使用配置文件中的 `addons` 字段安装，或者在您后续使用 `./kk create cluster` 命令时再次添加这个标志。

{{</ notice >}}

### 编辑配置文件

编辑生成的配置文件 `config-sample.yaml`。请参考以下示例：

{{< notice warning >}} 

离线安装时，您必须指定 `privateRegistry`，在本示例中是 `dockerhub.kubekey.local`。

{{</ notice >}}

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Qcloud@123}
  - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, password: Qcloud@123}
  - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, password: Qcloud@123}
  roleGroups:
    etcd:
    - master
    master:
    - master
    worker:
    - master
    - node1
    - node2
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: "6443"
  kubernetes:
    version: v1.17.9
    imageRepo: kubesphere
    clusterName: cluster.local
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
  registry:
    registryMirrors: []
    insecureRegistries: []
    privateRegistry: dockerhub.kubekey.local  # Add the private image registry address here. 
  addons: []

---
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  name: ks-installer
  namespace: kubesphere-system
  labels:
    version: v3.0.0
spec:
  local_registry: ""
  persistence:
    storageClass: ""
  authentication:
    jwtSecret: ""
  etcd:
    monitoring: true
    endpointIps: localhost
    port: 2379
    tlsEnable: true
  common:
    es:
      elasticsearchDataVolumeSize: 20Gi
      elasticsearchMasterVolumeSize: 4Gi
      elkPrefix: logstash
      logMaxAge: 7
    mysqlVolumeSize: 20Gi
    minioVolumeSize: 20Gi
    etcdVolumeSize: 20Gi
    openldapVolumeSize: 2Gi
    redisVolumSize: 2Gi
  console:
    enableMultiLogin: false  # enable/disable multi login
    port: 30880
  alerting:
    enabled: false
  auditing:
    enabled: false
  devops:
    enabled: false
    jenkinsMemoryLim: 2Gi
    jenkinsMemoryReq: 1500Mi
    jenkinsVolumeSize: 8Gi
    jenkinsJavaOpts_Xms: 512m
    jenkinsJavaOpts_Xmx: 512m
    jenkinsJavaOpts_MaxRAM: 2g
  events:
    enabled: false
    ruler:
      enabled: true
      replicas: 2
  logging:
    enabled: false
    logsidecarReplicas: 2
  metrics_server:
    enabled: true
  monitoring:
    prometheusMemoryRequest: 400Mi
    prometheusVolumeSize: 20Gi
  multicluster:
    clusterRole: none  # host | member | none
  networkpolicy:
    enabled: false
  notification:
    enabled: false
  openpitrix:
    enabled: false
  servicemesh:
    enabled: false
```

{{< notice info >}}

有关这些参数的更多信息，请参见[多节点安装](../../../installing-on-linux/introduction/multioverview/#2-编辑配置文件)和 [Kubernetes 集群配置](../../../installing-on-linux/introduction/vars/)。要在 `config-sample.yaml` 中启用可插拔组件，请参考启用[可插拔组件](../../../pluggable-components/)中的更多详情。

{{</ notice >}}


## 步骤 7：开始安装

确定完成上面所有步骤后，您可以执行以下命令。

```bash
./kk create cluster -f config-sample.yaml
```

{{< notice warning >}}

将可执行文件 `kk` 和包含 Kubernetes 二进制文件的文件夹 `kubekey` 传输至任务机机器用于安装后，必须将它们放在相同目录中，然后再执行上面的命令。

{{</ notice >}}

## 步骤 8：验证安装

安装完成后，您会看到以下内容：

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.2:30880
Account: admin
Password: P@88w0rd

NOTES：
  1. After logging into the console, please check the
     monitoring status of service components in
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are ready.
  2. Please modify the default password after login.

#####################################################
https://kubesphere.io             20xx-xx-xx xx:xx:xx
#####################################################
```

现在，您可以通过 `http://{IP}:30880` 使用默认帐户和密码 `admin/P@88w0rd` 访问 KubeSphere 的 Web 控制台。

{{< notice note >}}

要访问控制台，请确保在您的安全组中打开端口 30880。

{{</ notice >}}

![登录 kubesphere](/images/docs/zh-cn/installing-on-linux/introduction/air-gapped-installation/kubesphere-login.PNG)

## 附录

### KubeSphere v3.0.0 镜像清单

```txt
##k8s-images
kubesphere/kube-apiserver:v1.17.9          
kubesphere/kube-scheduler:v1.17.9          
kubesphere/kube-proxy:v1.17.9              
kubesphere/kube-controller-manager:v1.17.9 
kubesphere/kube-apiserver:v1.18.6          
kubesphere/kube-scheduler:v1.18.6          
kubesphere/kube-proxy:v1.18.6              
kubesphere/kube-controller-manager:v1.18.6 
kubesphere/kube-apiserver:v1.16.13         
kubesphere/kube-scheduler:v1.16.13         
kubesphere/kube-proxy:v1.16.13             
kubesphere/kube-controller-manager:v1.16.13
kubesphere/kube-apiserver:v1.15.12         
kubesphere/kube-scheduler:v1.15.12         
kubesphere/kube-proxy:v1.15.12             
kubesphere/kube-controller-manager:v1.15.12
kubesphere/pause:3.1                       
kubesphere/pause:3.2                       
kubesphere/etcd:v3.3.12                    
calico/kube-controllers:v3.15.1            
calico/node:v3.15.1                        
calico/cni:v3.15.1                         
calico/pod2daemon-flexvol:v3.15.1          
coredns/coredns:1.6.9                      
kubesphere/k8s-dns-node-cache:1.15.12      
kubesphere/node-disk-manager:0.5.0         
kubesphere/node-disk-operator:0.5.0        
kubesphere/provisioner-localpv:1.10.0      
kubesphere/linux-utils:1.10.0
kubesphere/nfs-client-provisioner:v3.1.0-k8s1.11

##ks-core-images
kubesphere/ks-apiserver:v3.0.0                  
kubesphere/ks-console:v3.0.0                    
kubesphere/ks-controller-manager:v3.0.0         
kubesphere/ks-installer:v3.0.0                  
kubesphere/etcd:v3.2.18                         
kubesphere/kubectl:v1.0.0
kubesphere/ks-upgrade:v3.0.0
kubesphere/ks-devops:flyway-v3.0.0                       
redis:5.0.5-alpine                              
alpine:3.10.4                                   
haproxy:2.0.4                                   
mysql:8.0.11                                    
nginx:1.14-alpine                               
minio/minio:RELEASE.2019-08-07T01-59-21Z        
minio/mc:RELEASE.2019-08-07T23-14-43Z           
mirrorgooglecontainers/defaultbackend-amd64:1.4 
kubesphere/nginx-ingress-controller:0.24.1      
osixia/openldap:1.3.0                           
csiplugin/snapshot-controller:v2.0.1            
kubesphere/kubefed:v0.3.0                       
kubesphere/tower:v0.1.0                         
kubesphere/prometheus-config-reloader:v0.38.3   
kubesphere/prometheus-operator:v0.38.3          
prom/alertmanager:v0.21.0                       
prom/prometheus:v2.20.1                         
kubesphere/node-exporter:ks-v0.18.1             
jimmidyson/configmap-reload:v0.3.0              
kubesphere/notification-manager-operator:v0.1.0 
kubesphere/notification-manager:v0.1.0          
kubesphere/metrics-server:v0.3.7                
kubesphere/kube-rbac-proxy:v0.4.1               
kubesphere/kube-state-metrics:v1.9.6

##ks-logging-images                 
kubesphere/elasticsearch-oss:6.7.0-1      
kubesphere/elasticsearch-curator:v5.7.6 
kubesphere/fluentbit-operator:v0.2.0       
kubesphere/fluentbit-operator:migrator     
kubesphere/fluent-bit:v1.4.6             
elastic/filebeat:6.7.0  
kubesphere/kube-auditing-operator:v0.1.0   
kubesphere/kube-auditing-webhook:v0.1.0    
kubesphere/kube-events-exporter:v0.1.0     
kubesphere/kube-events-operator:v0.1.0     
kubesphere/kube-events-ruler:v0.1.0        
kubesphere/log-sidecar-injector:1.1
docker:19.03

##istio-images
istio/citadel:1.4.8                         
istio/galley:1.4.8                          
istio/kubectl:1.4.8                         
istio/mixer:1.4.8                           
istio/pilot:1.4.8                           
istio/proxyv2:1.4.8                         
istio/sidecar_injector:1.4.8                
jaegertracing/jaeger-agent:1.17             
jaegertracing/jaeger-collector:1.17         
jaegertracing/jaeger-operator:1.17.1        
jaegertracing/jaeger-query:1.17
jaegertracing/jaeger-es-index-cleaner:1.17.1

##ks-devops-images
jenkins/jenkins:2.176.2                     
jenkins/jnlp-slave:3.27-1                   
kubesphere/jenkins-uc:v3.0.0                
kubesphere/s2ioperator:v2.1.1               
kubesphere/s2irun:v2.1.1                    
kubesphere/builder-base:v2.1.0              
kubesphere/builder-nodejs:v2.1.0            
kubesphere/builder-maven:v2.1.0             
kubesphere/builder-go:v2.1.0                
kubesphere/s2i-binary:v2.1.0                
kubesphere/tomcat85-java11-centos7:v2.1.0   
kubesphere/tomcat85-java11-runtime:v2.1.0   
kubesphere/tomcat85-java8-centos7:v2.1.0    
kubesphere/tomcat85-java8-runtime:v2.1.0    
kubesphere/java-11-centos7:v2.1.0           
kubesphere/java-8-centos7:v2.1.0            
kubesphere/java-8-runtime:v2.1.0            
kubesphere/java-11-runtime:v2.1.0           
kubesphere/nodejs-8-centos7:v2.1.0          
kubesphere/nodejs-6-centos7:v2.1.0          
kubesphere/nodejs-4-centos7:v2.1.0          
kubesphere/python-36-centos7:v2.1.0         
kubesphere/python-35-centos7:v2.1.0         
kubesphere/python-34-centos7:v2.1.0         
kubesphere/python-27-centos7:v2.1.0
kubesphere/notification:flyway_v2.1.2       
kubesphere/notification:v2.1.2              
kubesphere/alert-adapter:v3.0.0             
kubesphere/alerting-dbinit:v3.0.0           
kubesphere/alerting:v2.1.2

##openpitrix-images
openpitrix/generate-kubeconfig:v0.5.0       
openpitrix/openpitrix:flyway-v0.5.0         
openpitrix/openpitrix:v0.5.0                
openpitrix/release-app:v0.5.0

##example-images
kubesphere/examples-bookinfo-productpage-v1:1.13.0
kubesphere/examples-bookinfo-reviews-v1:1.13.0
kubesphere/examples-bookinfo-reviews-v2:1.13.0
kubesphere/examples-bookinfo-reviews-v3:1.13.0
kubesphere/examples-bookinfo-details-v1:1.13.0
kubesphere/examples-bookinfo-ratings-v1:1.13.0
busybox:1.31.1
joosthofman/wget:1.0
kubesphere/netshoot:v1.0
nginxdemos/hello:plain-text
wordpress:4.8-apache
mirrorgooglecontainers/hpa-example:latest
java:openjdk-8-jre-alpine
fluent/fluentd:v1.4.2-2.0
perl:latest

##csi-images
csiplugin/csi-neonsan:v1.2.0 
csiplugin/csi-neonsan-ubuntu:v1.2.0
csiplugin/csi-neonsan-centos:v1.2.0
csiplugin/csi-provisioner:v1.5.0
csiplugin/csi-attacher:v2.1.1
csiplugin/csi-resizer:v0.4.0
csiplugin/csi-snapshotter:v2.0.1
csiplugin/csi-node-driver-registrar:v1.2.0
csiplugin/csi-qingcloud:v1.2.0
```









