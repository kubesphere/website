---
title: '三步搞定 ARM64 离线部署 Kubernetes + KubeSphere'
tag: 'Kubernetes,KubeSphere,arm'
keywords: 'Kubernetes, KubeSphere, ARM64, 信创'
description: 'KubeSphere 作为一款深受国内外开发者所喜爱的开源容器平台，也将积极参与并探索在 ARM 架构下的应用与创新。本文将主要介绍如何在 ARM64 环境下部署 Kubernetes 和 KubeSphere。'
createTime: '2021-03-29'
author: '郭峰'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/arm.png'
---

### 背景

由于 ARM 架构具有低功耗和并行好的特点，其应用也将会越来越广泛。KubeSphere 作为一款深受国内外开发者所喜爱的开源容器平台，也将积极参与并探索在 ARM 架构下的应用与创新。本文将主要介绍如何在 ARM64 环境下部署 Kubernetes 和 KubeSphere。

### 环境准备
#### 节点
KubeSphere 支持的操作系统包括：
- Ubuntu 16.04, 18.04
- Debian Buster, Stretch
- CentOS/RHEL 7
- SUSE Linux Enterprise Server 15
- openEuler

这里以一台 openEuler 20.09  64bit 为例：
|name|ip|role|
|---|---|---|
|node1|172.169.102.249|etcd, master, worker|

确保机器已经安装所需依赖软件（sudo curl openssl ebtables socat ipset conntrack docker）

[具体环境要求参见](https://github.com/kubesphere/kubekey/tree/release-1.0#requirements-and-recommendations)

关于多节点安装请参考 [KubeSphere 官方文档](https://kubesphere.com.cn/docs/installing-on-linux/introduction/multioverview/)。

> 建议：可将安装了所有依赖软件的操作系统制作成系统镜像使用，避免每台机器都安装依赖软件，即可提升交付部署效率，又可避免依赖问题的发生。


> 提示：如使用 centos7.x、ubuntu18.04，则可以选择使用 kk 命令对机器进行初始化。
> 解压安装包，并创建好配置文件之后（创建方法请看下文），可执行如下命令对节点进行初始化：
>  `./kk init os -s ./dependencies -f config-example.yaml`
>  如使用该命令遇到依赖问题，可自行安装相关依赖软件。

#### 镜像仓库
可使用 harbor 或其他第三方镜像仓库。

> 提示：可使用 kk 命令自动创建测试用自签名镜像仓库。注意，请确保当前机器存在`registry:2`，如没有，可从解压包 kubesphere-images-v3.0.0/registry.tar 中导入，导入命令：`docker load < registry.tar`。
> 创建测试用自签名镜像仓库：
> `./kk init os -f config-example.yaml  --add-images-repo`
> 注意：由 kk 启动的镜像仓库端口为443，请确保所有机器均可访问当前机器443端口。镜像数据存储到本地/mnt/registry (建议单独挂盘)。

### 安装包下载：
> 提示：该安装包仅包含 Kubernetes + KubeSphere-core 镜像，如需更多组件 arm64 镜像，可自行编译构建。

```
# md5: 3ad57823faf2dfe945e2fe3dcfd4ace9
curl -Ok https://kubesphere-installer.pek3b.qingstor.com/offline/v3.0.0/kubesphere-core-v3.0.0-offline-linux-arm64.tar.gz
```
### 安装步骤：
#### 1. 创建集群配置文件
安装包解压后进入`kubesphere-core-v3.0.0-offline-linux-arm64`
```
./kk create config
```
根据实际环境信息修改生成的配置文件`config-sample.yaml`，也可使用-f参数自定义配置文件路径。kk 详细用法可参考：https://github.com/kubesphere/kubekey

> 注意填写正确的私有仓库地址`privateRegistry`（如已准备好私有仓库可设置为已有仓库地址，若使用 kk 创建私有仓库，则该参数设置为：dockerhub.kubekey.local）

```
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  # 注意指定节点 arch 为 arm64
  - {name: node1, address: 172.169.102.249, internalAddress: 172.169.102.249, password: Qcloud@123, arch: arm64}
  roleGroups:
    etcd:
    - node1
    control-plane:
    - node1
    worker:
    - node1
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: 6443
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
    privateRegistry: dockerhub.kubekey.local
  addons: []

```
#### 2. 导入镜像
进入`kubesphere-all-v3.0.0-offline-linux-arm64/kubesphere-images-v3.0.0`
使用 offline-installation-tool.sh 将镜像导入之前准备的仓库中：
```
# 脚本后镜像仓库地址请填写真实仓库地址
./offline-installation-tool.sh -l images-list-v3.0.0.txt -d kubesphere-images -r dockerhub.kubekey.local
```

#### 3. 执行安装
```
# 以上准备工作完成且再次检查配置文件无误后，执行安装。
./kk create cluster -f config-sample.yaml --with-kubesphere
```

### 查看结果

![](https://pek3b.qingstor.com/kubesphere-community/images/firstresult.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/secondresult.png)



