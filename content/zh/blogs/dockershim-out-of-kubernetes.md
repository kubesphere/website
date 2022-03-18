---
title: 'Docker 出局？你还有 iSula、Containerd、CRI-O'
tag: 'KubeSphere,Kubernetes'
keyword: 'docker, iSula、Containerd、CRI-O, KubeSphere'
createTime: '2020-12-08'
author: '郭峰, 周鹏飞, 徐文涛'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/20201209112458.png'
---

## Docker 真的要被 Kubernetes 社区剔除了吗？

最近，Kubernetes 在 1.20 版本中 的 ChangeLog 提到将在未来的版本中废弃 Docker 作为容器运行时，这个事情在全球都闹得沸沸扬扬。

那么，Kubernetes 要在 v1.20 开始弃用 docker 了？其实是 Kubernetes 弃用 kubelet 中集成的 dockershim 模块，也就是说不再将 docker 作为默认的 Container Runtime，不过 Kubernetes 应该还是可以通过外接方式使用 Docker 的，感兴趣的同学可以通过以下链接了解个中缘由。

- **Dockershim Deprecation FAQ**: https://kubernetes.io/blog/2020/12/02/dockershim-faq
- **Don't Panic: Kubernetes and Docker**: https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker


## 对于已经使用 Docker 的 KubeSphere 用户有没有影响

该消息一出，社区里就有很多用户小伙伴问我们对 KubeSphere 有没有影响，土耳其的合作伙伴也联系我们希望提供一个官方声明。

![社区用户提问](https://ap3.qingstor.com/kubesphere-website/docs/20201208233955.png)

dockershim 一直都是 Kubernetes 社区为了能让 Docker 成为其支持的容器运行时，所维护的一个兼容程序。本次所谓的废弃，也仅仅是 Kubernetes 要放弃对现在 Kubernetes 代码仓库中的 dockershim 的维护支持。 以便其可以像开始时计划的那样，仅负责维护其 CRI ，任何兼容 CRI 的运行时，皆可作为 Kubernetes 的 runtime，例如 Isula、CRI-O、Containerd 等。

目前，KubeSphere 容器平台默认使用 Docker 作为 Kubernetes 的容器运行时，同时也支持任何兼容 CRI 接口的具体实现。对于已经使用的 KubeSphere 用户来说，这一事件对用户已有系统的运行不会有任何影响，也不会对将来的集群部署和业务产生影响，用户可以根据需求选择继续使用已被大规模验证过的 Docker，或是选择目前比较流行的 Isula、Containerd、CRI-O 等新的容器运行时。

## 下一代容器运行时 Isula、Containerd 和 CRI-O 

![下一代容器运行时 Isula、Containerd 和 CRI-O](https://ap3.qingstor.com/kubesphere-website/docs/20201209112458.png)

### iSula

iSula （https://openeuler.org/zh/docs/20.09/docs/Container/iSula）是由 openEuler 社区开源的容器引擎，iSula 相比 Docker 是一种新的容器解决方案，提供统一的架构设计来满足 CT 和 IT 领域的不同需求。相比 Golang 编写的 Docker，轻量级容器使用 C/C++ 实现，具有轻、灵、巧、快的特点，不受硬件规格和架构的限制，底噪开销更小，可应用领域更为广泛。

### Containerd

Containerd（https://containerd.io）是一个 CNCF 毕业项目，目前也是工业级标准的容器运行时，它极为简单、健壮并且具备可移植性。Containerd 可以在宿主机中管理完整的容器生命周期。

### CRI-O

CRI-O （https://cri-o.io）是由红帽发布的一款容器运行时，是面向 Kubernetes 的 OCI（Open Container Initiative）的容器运行时，CRI-O 能够让 Kubernetes 使用任意兼容 OCI 的运行时作为运行 Pod 的容器运行时。

## 部署 iSula、Containerd 和 CRI-O 

首先部署 Container-runtime、Containerd、CRI-O、iSula 任选其一，注意集群中所有节点container-runtime 应保持一致。

## 部署 Container-runtime

### Containerd

1.  安装 runc。

```shell
$ curl -OL https://github.com/opencontainers/runc/releases/download/v1.0.0-rc92/runc.amd64
```

```shell
$ mv runc.amd64 /usr/local/bin/runc && chmod +x /usr/local/bin/runc
```

2. 安装 Containerd。

下载 Containerd 安装包

```shell
$ curl -OL https://github.com/containerd/containerd/releases/download/v1.4.3/containerd-1.4.3-linux-amd64.tar.gz

$ tar -zxvf containerd-1.4.3-linux-amd64.tar.gz -C /usr/local

$ curl -o /etc/systemd/system/containerd.service https://raw.githubusercontent.com/containerd/cri/master/contrib/systemd-units/containerd.service
```

3. 配置 Containerd。

```shell
$ mkdir -p /etc/containerd

$ cat > /etc/containerd/config.toml << EOF
[plugins]
  [plugins."io.containerd.grpc.v1.cri"]
    sandbox_image = "kubesphere/pause:3.2"
    [plugins."io.containerd.grpc.v1.cri".registry]
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          endpoint = ["https://registry-1.docker.io"]     ## 这里可替换成dockerhub的镜像加速器
EOF

$ systemctl enable containerd && systemctl restart containerd
```

> 如果`containerd config dump |grep sandbox_image`仍是显示`k8s.gcr.io/pause:xxx`，请将`version = 2`添加到`/etc/containerd/config.toml`开头并执行`systemctl restart containerd`。

4. 安装 crictl。

```shell
$ VERSION="v1.19.0"

$ curl -OL https://github.com/kubernetes-sigs/cri-tools/releases/download/$VERSION/crictl-$VERSION-linux-amd64.tar.gz

$ sudo tar zxvf crictl-$VERSION-linux-amd64.tar.gz -C /usr/local/bin

$ rm -f crictl-$VERSION-linux-amd64.tar.gz
```

5. 配置 crictl。

```shell
$ cat > /etc/crictl.yaml << EOF
runtime-endpoint: unix:///run/containerd/containerd.sock
image-endpoint: unix:///run/containerd/containerd.sock
timeout: 2
debug: false
pull-image-on-create: false
EOF
```


### 安装 CRI-O


1. 安装 CRI-O。

```shell
$ yum install git make

$ curl -OL https://github.com/cri-o/cri-o/releases/download/v1.18.4/crio-v1.18.4.tar.gz
tar -zxf crio-v1.18.4.tar.gz

$ cd crio-v1.18.4

$ mkdir -p /etc/crio /opt/cni/bin /usr/local/share/oci-umount/oci-umount.d /usr/local/lib/systemd/system

$ make install

$ echo "fs.may_detach_mounts=1" >> /etc/sysctl.conf

$ sysctl -p
```

2. 配置 CRI-O。

```shell
$ vi /etc/crio/crio.conf 
```

找到如下参数进行修改

```
pause_image = "kubesphere/pause:3.2"
registries = [
  "docker.io"       ## 这里可替换成dockerhub的镜像加速器
]
```

3. 启动 CRI-O。

```shell
$ systemctl enable crio && systemctl restart crio 
```

### 安装 iSula（操作系统使用 openEuler 20.09）

1. 安装 iSula。

```shell
$ yum install iSulad -y
```

2. 配置 iSula。

```shell
$ vim /etc/isulad/daemon.json
```

3. 对如下参数进行修改。

```
"registry-mirrors": [
    "docker.io"           ## 这里可替换成dockerhub的镜像加速器
 ]
"pod-sandbox-image": "kubesphere/pause:3.2"
"network-plugin": "cni"
"cni-bin-dir": "/opt/cni/bin"
"cni-conf-dir": "/etc/cni/net.d"
```

4. 启动isula。

```shell
$ systemctl enable isulad && systemctl restart isulad
```

## KubeKey 部署 Kubernetes + KubeSphere

这里使用 KubeKey 来部署 Kubernetes 集群。

## 下载 KubeKey

这里暂时使用 `kubekey v1.1.0-alpha.1` 部署 Kubernetes 集群，该版本为预览版，支持多container-runtime 也会包含在后续的正式版本中。

```shell
$ curl -OL https://github.com/kubesphere/kubekey/releases/download/v1.1.0-alpha.1/kubekey-v1.1.0-alpha.1-linux-amd64.tar.gz

$ tar -zxvf  kubekey-v1.1.0-alpha.1-linux-amd64.tar.gz
```

2. 创建配置文件。

```shell
./kk create config # 默认在同级目录下生成 config-sample.yaml   
```

3. 根据真实环境信息修改配置文件。

```shell
vi config-sample.yaml  
```

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
···
  kubernetes:
    version: v1.17.9
    imageRepo: kubesphere
    clusterName: cluster.local
    containerManager: containerd    ## 这里填入之前部署的 container-runtime：containerd / crio / isula
···
```

4. 一键部署集群。

```shell
./kk create cluster -f config-sample.yaml  --with-kubesphere v3.2.1
```

## 查看部署结果

KubeSphere 集群部署完成后，可登录 KubeSphere 控制台查看集群节点所使用的 Container-runtime。

##### Containerd

![Containerd](../../../images/blogs/dockershim-out-of-kubernetes/containerd.png)

##### CRI-O

![CRI-O](../../../images/blogs/dockershim-out-of-kubernetes/cri-o.png)

##### iSula on openEuler 20.09

![iSula on openEuler 20.09](../../../images/blogs/dockershim-out-of-kubernetes/isula.png)
