---
title: "Air-gapped Installation"
keywords: 'Air-gapped, Installation, KubeSphere'
description: 'How to install KubeSphere in an air-gapped environment.'

linkTitle: "Air-gapped Installation"
weight: 2113
---

The air-gapped installation is almost the same as the online installation except it creates a local registry to host the Docker images. We will demonstrate how to install KubeSphere and Kubernetes on air-gapped environment.

## Step 1: Prepare Linux Hosts

Please see the requirements for hardware and operating system shown below. To get started with multi-node installation, you need to prepare at least three hosts according to the following requirements.

### System Requirements

| Systems                                                | Minimum Requirements (Each node)            |
| ------------------------------------------------------ | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                              | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **CentOS** *7*.x                                       | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Red Hat Enterprise Linux 7**                         | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **SUSE Linux Enterprise Server 15/openSUSE Leap 15.2** | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |

{{< notice note >}}

Installer will use `/var/lib/docker` as the default directory where all Docker related files, including the images, are stored. We recommend you to add additional storage to a disk with at least **100G** mounted at `/var/lib/docker` and `/mnt/registry` respectively. See [fdisk](https://www.computerhope.com/unix/fdisk.htm) command for reference.

{{</ notice >}}

### Node Requirements

**Important**

- It's recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- Ensure your disk of each node is at least **100G**.
- All nodes must be accessible through `SSH`.
- Time synchronization for all nodes.
- `sudo`/`curl`/`openssl` should be used in all nodes.
- `docker` must be installed by yourself in an offline environment.


KubeKey can install Kubernetes and KubeSphere together. The dependency that needs to be installed may be different based on the Kubernetes version to be installed. You can refer to the list below to see if you need to install relevant dependencies on your node in advance.

| Dependency  | Kubernetes Version ≥ 1.18 | Kubernetes Version < 1.18 |
| ----------- | ------------------------- | ------------------------- |
| `socat`     | Required                  | Optional but recommended  |
| `conntrack` | Required                  | Optional but recommended  |
| `ebtables`  | Optional but recommended  | Optional but recommended  |
| `ipset`     | Optional but recommended  | Optional but recommended  |

### Network and DNS Requirements

- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in clusters.
- If your network configuration uses Firewall or Security Group, you must ensure infrastructure components can communicate with each other through specific ports. It's recommended that you turn off the firewall or follow the guide [Network Access](https://github.com/kubesphere/kubekey/blob/master/docs/network-access.md).

### Example Machines

This example includes three hosts as below with the master node serving as the taskbox.

| Host IP     | Host Name | Role         |
| ----------- | --------- | ------------ |
| 192.168.0.2 | master    | master, etcd |
| 192.168.0.3 | node1     | worker       |
| 192.168.0.4 | node2     | worker       |

## Step 2: Prepare a Private Image Registry

You can use Harbor or any other private image registries, we take Docker registry as an example, using [self-signed certificates](https://docs.docker.com/registry/insecure/) (If you have your own private image registry, you can skip this step).

### Use Self-signed certificates

Generate your own certificate:

```bash
mkdir -p certs
```

```bash
openssl req \
-newkey rsa:4096 -nodes -sha256 -keyout certs/domain.key \
-x509 -days 36500 -out certs/domain.crt
```

Be sure to specify a domain name in the field **Common Name** when you are generating your own certificate, for example, we use `dockerhub.kubesphere.local` in this example:

![Use self-signed certificates](/images/docs/air-gapped/self-signed-cert.png)

### Start Docker Registry

Run the following command to start the Docker registry:

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

### Configure Registry 

Please add the mapping configuration into the server where it requires to access the docker registry. Put the registry domain name and IP into `etc/hosts`:

![Configure Registry](/images/docs/air-gapped/docker-registry.png)

Copy the certificate to the specified directory so that Docker trusts the certificate 

The path of the certificate is related to the certificate domain name, please create a certificate copy path based on the actual domain name).

```
mkdir -p  /etc/docker/certs.d/dockerhub.kubesphere.local
```

```
cp certs/domain.crt  /etc/docker/certs.d/dockerhub.kubesphere.local/ca.crt
```

Then validate if the docker registry is able to use. 

![validate-registry](/images/docs/air-gapped/validate-registry.png)


## Download Air-gapped Installer

Execute the following command to dowloand the air-gapped Installer

```
curl -Ok https://kubesphere-installer.pek3b.qingstor.com/offline/v3.0.0/kubesphere-all-v3.0.0-offline-linux-amd64.tar.gz 
```

> The installer md5: `65e9a1158a682412faa1166c0cf06772`

Unpack it:

```bash
tar -zxf kubesphere-all-v3.0.0-offline-linux-amd64.tar.gz
```

Enter into the installation catalogue:

```bash
cd kubesphere-all-v3.0.0-offline-linux-amd64
```

## Pre-configuration before Installation

### Create an Example Configuration File

Execute the command to generate an example configuration file for installation:

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

**Example**

```bash
./kk create config --with v1.17.9 --with-kubesphere v3.0.0 
```

{{< notice info >}}

Supported Kubernetes versions: *v1.15.12*, *v1.16.13*, *v1.17.9* (default), *v1.18.6*.

{{</ notice >}}

### Edit the Configuration File

Edit the generated configuration file `config-sample.yaml` refer to the following sample template:

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: master, address: 192.168.6.17, internalAddress: 192.168.6.17, password: Qcloud@123}
  - {name: node1, address: 192.168.6.18, internalAddress: 192.168.6.18, password: Qcloud@123}
  - {name: node2, address: 192.168.6.19, internalAddress: 192.168.6.19, password: Qcloud@123}
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
    privateRegistry: dockerhub.kubekey.local  # Add the private image registry address here 
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

Please see detailed definitions of parameters above from [Multi-node Installation](../multioverview), [Kubernetes Cluster Configuration](../vars). You can also enable the pluggable components in the `config-sample.yaml` as you want, refer to [Enable Pluggle Components](../../../pluggable-components) for more details.

{{</ notice >}}


### Load Docker Images into Registry

Enter into the folder `kubesphere-all-v3.0.0-offline-linux-amd64/kubesphere-images-v3.0.0`.

![Load Images](/images/docs/air-gapped/load-image.png)

Execute the following script to push all image packages to the target image registry, we use `dockerhub.kubekey.local` as an example in this guide, please replace the domain with your private registry domain. 

```
./push-images.sh  dockerhub.kubekey.local
```

{{< notice info >}}

You can find the script `push-image.sh` from [GitHub](https://github.com/kubesphere/ks-installer/blob/master/scripts/push-image-list.sh).

{{</ notice >}}


## Start Installation

You can execute the following command after you make sure that all steps above are completed.

```bash
./kk create cluster -f config-sample.yaml
```

## Verify the installation

When the installation finishes, you can see the content as follows:

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

Now, you will be able to access the web console of KubeSphere at `http://{IP}:30880` (e.g. you can use the EIP) with the account and password `admin/P@88w0rd`.

{{< notice note >}}

To access the console, you may need to forward the source port to the intranet port of the intranet IP depending on the platform of your cloud providers. Please also make sure port 30880 is opened in the security group.

{{</ notice >}}

![kubesphere-login](https://ap3.qingstor.com/kubesphere-website/docs/login.png)

## Appendix

### Image List for KubeSphere v3.0.0

```
# k8s (Choose one the K8s versions to use) ：
kubesphere/kube-apiserver:v1.16.13
kubesphere/kube-scheduler:v1.16.13
kubesphere/kube-proxy:v1.16.13
kubesphere/kube-controller-manager:v1.16.13
kubesphere/kube-apiserver:v1.15.12
kubesphere/kube-scheduler:v1.15.12
kubesphere/kube-proxy:v1.15.12
kubesphere/kube-controller-manager:v1.15.12
kubesphere/kube-apiserver:v1.17.9
kubesphere/kube-scheduler:v1.17.9
kubesphere/kube-proxy:v1.17.9
kubesphere/kube-controller-manager:v1.17.9
kubesphere/pause:3.1
kubesphere/pause:3.2  (K8s version should be higher than v1.18)
kubesphere/etcd:v3.3.12
calico/kube-controllers:v3.15.1
calico/node:v3.15.1
calico/cni:v3.15.1
calico/pod2daemon-flexvol:v3.15.1
coredns/coredns:1.6.9
kubesphere/k8s-dns-node-cache:1.15.12

# localVolume：
kubesphere/node-disk-manager:0.5.0
kubesphere/node-disk-operator:0.5.0
kubesphere/provisioner-localpv:1.10.0
kubesphere/linux-utils:1.10.0

# kubesphere minimal：
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
kubesphere/ks-upgrade:v3.0.0                      
kubesphere/ks-devops:flyway-v3.0.0

# monitoring：
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

# logging:
kubesphere/elasticsearch-oss:6.7.0-1
kubesphere/fluentbit-operator:v0.2.0
kubesphere/fluentbit-operator:migrator
kubesphere/fluent-bit:v1.4.6    
kubesphere/kube-auditing-operator:v0.1.0
kubesphere/kube-auditing-webhook:v0.1.0
kubesphere/kube-events-exporter:v0.1.0
kubesphere/kube-events-operator:v0.1.0
kubesphere/kube-events-ruler:v0.1.0
kubesphere/log-sidecar-injector:1.1
docker:19.03

# service-mesh：
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

# devops：
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

# notification&&alerting:
kubesphere/notification:flyway_v2.1.2
kubesphere/notification:v2.1.2   
kubesphere/alert-adapter:v3.0.0
kubesphere/alerting-dbinit:v3.0.0
kubesphere/alerting:v2.1.2

# multicluster:
kubesphere/kubefed:v0.3.0
kubesphere/tower:v0.1.0

# openpitrix(app store)：
openpitrix/generate-kubeconfig:v0.5.0
openpitrix/openpitrix:flyway-v0.5.0
openpitrix/openpitrix:v0.5.0
openpitrix/release-app:v0.5.0
```

### How to Manually Load the Images to Registry

If you would to like to load the docker images of KubeSphere to a target registry, you need to retag it at first. We use `kubesphere/kube-apiserver:v1.17.9` as an example:

```bash
docker tag kubesphere/kube-apiserver:v1.17.9 dockerhub.kubesphere.local/kubesphere/kube-apiserver:v1.17.9
```







