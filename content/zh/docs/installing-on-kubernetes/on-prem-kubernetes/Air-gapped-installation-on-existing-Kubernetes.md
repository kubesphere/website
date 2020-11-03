---

title: "Air gapped installation on existing Kubernetes"


weight: 2200

---




### <center>kubernetes离线部署kubesphere-v3.0.0</center>

#### 一　新建3台 linux主机（centos7.7）

主机配置

主机名　　　　cpu核心 　　　　　内存　　　　　硬盘

master1　　　　　4 　　　　　　16GB　　　　100GB

node1　　　　　　4　　　　　　16GB　　　　　50GB

node2　　　　　　4　　　　　　16GB　　　　　50GB

说明：master1需要安装镜像库，所以硬盘分100GB

![image-20201026151924615](http://image.z5689.com/blog/20201028105532.png)

每台主机都需要安装依赖软件

```
$ yum install  curl openssl ebtables socat ipset conntrack yum-utils device-mapper-persistent-data lvm2 git wget  glusterfs-fuse -y
$ yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
$ yum makecache fast
$ yum -y install docker-ce
```

#### 二　安装包下载：

提示：由于包含所有组件镜像，该压缩包较大，如果网络不佳，可能会导致下载耗时较长。也可根据文档中的镜像列表将相关镜像导入私有镜像仓库中后使用kubekey自行安装。

```
$ curl -Ok https://kubesphere-installer.pek3b.qingstor.com/offline/v3.0.0/kubesphere-all-v3.0.0-offline-linux-amd64.tar.gz
```



#### 三  创建k8s集群

1  创建集群配置文件

安装包解压后进入`kubesphere-all-v3.0.0-offline-linux-amd64`

![image-20201020103855129](http://image.z5689.com/blog/20201020144557.png)

生成配置文件config-sample.yaml

```
$ ./kk create config  --with-kubernetes v1.17.9
```

修改配置

hosts 加入主机参数

```
{name: master1, address: 192.168.0.2, internalAddress: 192.168.0.2, user: root, password: Qwe12345}

{name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: Qwe12345}

{name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Qwe12345}
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
  - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: Qwe12345}
  - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Qwe12345}
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
  addons: []
```

执行安装

```
./kk create cluster -f config-sample.yaml
```

输入yes

![image-20201027175940349](http://image.z5689.com/blog/20201028105533.png)

下载需要的镜像，花的时间稍长，请耐心等待

初始化了集群

![image-20201026161433636](http://image.z5689.com/blog/20201028105534.png)

安装成功

![image-20201026161649503](http://image.z5689.com/blog/20201028105535.png)

![image-20201026161735686](http://image.z5689.com/blog/20201028105536.png)



####  四  安装默认存储  openebs

```
kubectl apply -f https://openebs.github.io/charts/openebs-operator-1.9.0.yaml
```

安装完成

![image-20201027181433565](http://image.z5689.com/blog/20201028105537.png)

设置为默认存储

```
kubectl patch storageclass openebs-hostpath -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

```



#### 五  新建镜像库，导入所有镜像到Harbor

下载docker-compose

```
$ curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
$ chmod +x /usr/local/bin/docker-compose
$ docker-compose --version
docker-compose version 1.18.0, build 8dd22a9
```

下载harbor

```
$ wget https://github.com/goharbor/harbor/releases/download/v2.0.0/harbor-offline-installer-v2.0.0.tgz
$ tar zxf harbor-offline-installer-v2.0.0.tgz && cd harbor
$ cp -r  harbor.yml.tmpl  harbor.yml
```

修改配置文件harbor.yml，hostname更改为自己的本地IP，本示例为master1 IP。

注释https功能

```
...
hostname: 192.168.0.2
http:
  port: 80
...
```

![image-20201028105110300](http://image.z5689.com/blog/20201028105538.png)

执行安装Harbor

```
$ ./install.sh
```

安装成功

![image-20201026180933928](http://image.z5689.com/blog/20201028105539.png)

docker默认使用的是https连接，而harbor默认使用http连接，所以需要修改docker配置标志insecure registry不安全仓库的主机！ master1，node1，node2的docker都要添加harbor IP

```
$ vi  /etc/docker/daemon.json
```

只加上insecure-registry这个参数即可。

```
"insecure-registries": ["192.168.0.2:80"]
```

重启docker

```
systemctl daemon-reload && systemctl restart docker.service
```



导入所有镜像到本地docker

```
$ cd kubesphere-all-v3.0.0-offline-linux-amd64/kubesphere-images-v3.0.0/
$ ls
```

![image-20201027094406149](http://image.z5689.com/blog/20201028105540.png)

执行导入

```
for i in **.tar;do docker load < $i;done
```



克隆ks-installer工程，并进入scripts目录

```
$ git clone https://github.com/kubesphere/ks-installer.git
$ cd ks-installer/scripts
```

修改创建项目Harbor脚本

```
$ cd ks-installer/scripts
$ vi create_project_harbor.sh
```

更改url  user  passwd，url填写你自己的主机ip，本示例是填写的是master1的IP。user，passwd填写你自己的，也可以默认。由于harbor安装的是2.0版本，所以需要在api后面添加  /v2.0

修改完成后

```
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

url="http://192.168.0.2"
user="admin"
passwd="Harbor12345"

harbor_projects=(library
    kubesphere
    csiplugin
    openpitrix
    mirrorgitlabcontainers
    google-containers
    istio
    k8scsi
    osixia
    goharbor
    minio
    openebs
    kubernetes-helm
    coredns
    jenkins
    jaegertracing
    calico
    oliver006
    fluent
    kubernetes_ingress_controller
    kibana
    gitlab_org
    coreos
    google_containers
    grafana
    external_storage
    pires
    nginxdemos
    gitlab
    joosthofman
    mirrorgooglecontainers
    wrouesnel
    dduportal
)

for project in "${harbor_projects[@]}"; do
    echo "creating $project"
    curl -u "${user}:${passwd}" -X POST -H "Content-Type: application/json" "${url}/api/v2.0/projects" -d "{ \"project_name\": \"${project}\", \"public\": 1}"
done
```



在Harbor中创建项目

```
./create_project_harbor.sh
```

![image-20201027161621423](http://image.z5689.com/blog/20201028105541.png)

上传本地镜像到harbor镜像库

登录harbor镜像库

```
$ docker login -u admin -p Harbor12345 http://192.168.0.2:80
```

```
$ ./push-image-list.sh 192.168.0.2:80
```

等待上传，花费时间稍长



####  六  安装kubesphere

本示例使用完全安装，安装kubesphere所有功能

```
$ cd  ks-installer/deploy
```

添加本地镜像库设置，默认最小化安装，这里把所有false修改成true

```
$ sed -i  's#false#true#' cluster-configuration.yaml


...

alerting:
  enabled: true
  
local_registry: 192.168.0.2:80

auditing:
  enabled: true

...
```

更改镜像名，改成本地库镜像

```
$ vi kubesphere-installer.yaml
...

- name: installer
   image: 192.168.0.2:80/kubesphere/ks-installer:v3.0.0
   imagePullPolicy: "Always"
   resources:
   
...
```

执行安装

```
$ kubectl apply -f  kubesphere-installer.yaml -f  cluster-configuration.yaml
```

查看安装日志

```
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f

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
https://kubesphere.io             2020-10-28 10:37:40
#####################################################
```

所有组件安装完成

![image-20201028104128917](http://image.z5689.com/blog/20201028105542.png)



