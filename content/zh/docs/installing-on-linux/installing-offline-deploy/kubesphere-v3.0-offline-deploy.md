---
title: "kubesphere-v3.0-offline-deploy"


weight: 2200
---




### <center>kubesphere-v3.0.0离线部署</center>

#### 一　新建4台 linux主机（centos7.7）

主机配置

主机名　　　　cpu核心 　　　　　内存　　　　　硬盘

master1　　　　　4 　　　　　　16GB　　　　100GB

node1　　　　　　4　　　　　　16GB　　　　　50GB

node2　　　　　　4　　　　　　16GB　　　　　50GB

说明：master1需要安装镜像库，所以硬盘分100GB



![image-20201023175802071](http://image.z5689.com/blog/20201023180022.png)

每台主机都需要安装依赖软件

```
$ yum install  curl openssl ebtables socat ipset conntrack yum-utils device-mapper-persistent-data lvm2 -y
$ yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
$ yum makecache fast
$ yum -y install docker-ce
```



#### 二　新建自己的私有镜像库


生成自签名证书

```
$ mkdir -p certs
openssl req \
-newkey rsa:4096 -nodes -sha256 -keyout certs/domain.key \
-x509 -days 36500 -out certs/domain.crt
```

生成证书时，需填写对应域名（该域名可自由设定）

![image-20201020100620990](http://image.z5689.com/blog/20201020144553.png)

启动docker registry服务

镜像数据存储到本地/mnt/registry (目录可自定义，如果镜像较多，请确保存储空间足够)

```
$ docker run -d \
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

配置registry（master1，node1，node2都需要添加）

将registry证书域名及对应ip地址配置hosts /etc/hosts

```
$ echo "192.168.0.2    dockerhub.kubesphere.local"   >>  /etc/hosts
```

![image-20201020101405155](http://image.z5689.com/blog/20201020144554.png)

拷贝证书到指定目录，使docker信任该证书（该路径与证书域名有关，请按实际域名创建证书拷贝路径）

```
$ mkdir -p  /etc/docker/certs.d/dockerhub.kubesphere.local
$ cp certs/domain.crt  /etc/docker/certs.d/dockerhub.kubesphere.local/ca.crt
```

验证服务可用性

镜像上传成功

![image-20201020102120727](http://image.z5689.com/blog/20201020144555.png)

下载镜像成功 (node2)

![image-20201020102909853](http://image.z5689.com/blog/20201020144556.png)



#### 三　安装包下载：

提示：由于包含所有组件镜像，该压缩包较大，如果网络不佳，可能会导致下载耗时较长。也可根据文档中的镜像列表将相关镜像导入私有镜像仓库中后使用kubekey自行安装。

```
$ curl -Ok https://kubesphere-installer.pek3b.qingstor.com/offline/v3.0.0/kubesphere-all-v3.0.0-offline-linux-amd64.tar.gz
```



#### 四　安装步骤：

1  创建集群配置文件

安装包解压后进入`kubesphere-all-v3.0.0-offline-linux-amd64`

![image-20201020103855129](http://image.z5689.com/blog/20201020144557.png)

生成配置文件config-sample.yaml

```
./kk create config --with-kubesphere v3.0.0
```

修改配置

hosts 加入主机参数

```
{name: master1, address: 192.168.0.2, internalAddress: 192.168.0.2, user: root, password: Qwe12345}

{name: node1, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Qwe12345}

{name: node2, address: 192.168.0.5, internalAddress: 192.168.0.5, user: root, password: Qwe12345}
```

registry插入私有仓库参数

```
privateRegistry: dockerhub.kubesphere.local
```

修改后的配置文件

```
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: master1, address: 192.168.0.2, internalAddress: 192.168.0.2, user: root, password: Qwe12345}
  - {name: node1, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Qwe12345}
  - {name: node2, address: 192.168.0.5, internalAddress: 192.168.0.5, user: root, password: Qwe12345}
  roleGroups:
    etcd:
    - master1
    master: 
    - master1
    worker:
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
    privateRegistry: dockerhub.kubesphere.local
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

#### 五　导入镜像

进入`kubesphere-all-v3.0.0-offline-linux-amd64/kubesphere-images-v3.0.0`

![image-20201020105923369](http://image.z5689.com/blog/20201020144558.png)

```
$ ./push-images.sh  dockerhub.kubesphere.local
```

导入镜像的时间很长，请耐心等待



#### 六　安装部署

```
$ ./kk create cluster -f config-sample.yaml
```

输入yes

![image-20201020135834106](http://image.z5689.com/blog/20201020144559.png)

然后就是持续的安装步骤

集群安装成功

![image-20201020142113074](http://image.z5689.com/blog/20201020144600.png)

访问kubesphere，需要ACL 防火墙放通30880端口

ACL放通30880端口

![image-20201020142217193](http://image.z5689.com/blog/20201020144602.png)



防火墙放通30880端口

![image-20201020142413590](http://image.z5689.com/blog/20201020163003.png)



访问kubesphere，以admin用户登录

![image-20201020142555566](http://image.z5689.com/blog/20201020144604.png)