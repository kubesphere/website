---
title: 'NetApp 存储在 KubeSphere 上的实践'
tag: 'NetApp,存储'
createTime: '2019-09-12'
author: 'Forest Li'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20190930151339.png'
---

[NetApp](https://www.netapp.com/cn/index.aspx) 是向目前的数据密集型企业提供统一存储解决方案的居世界最前列的公司，其 Data ONTAP是全球首屈一指的存储操作系统。NetApp 的存储解决方案涵盖了专业化的硬件、软件和服务，为开放网络环境提供了无缝的存储管理。
**Ontap**数据管理软件支持高速闪存、低成本旋转介质和基于云的对象存储等存储配置，为通过块或文件访问协议读写数据的应用程序提供统一存储。
**Trident**是一个由NetApp维护的完全支持的开源项目。以帮助您满足容器化应用程序的复杂**持久性**需求。
[KubeSphere](https://github.com/kubesphere) 是一款开源项目，在目前主流容器调度平台 Kubernetes 之上构建的企业级分布式多租户**容器管理平台**，提供简单易用的操作界面以及向导式操作方式，在降低用户使用容器调度平台学习成本的同时，极大降低开发、测试、运维的日常工作的复杂度。


## 整体方案

在 VMware Workstation 环境下安装 ONTAP; ONTAP 系统上创建 SVM(Storage Virtual Machine) 且对接 nfs 协议；在已有 k8s 环境下部署 Trident,Trident 将使用 ONTAP 系统上提供的信息（svm、managementLIF 和 dataLIF）作为后端来提供卷；在已创建的 k8s 和StorageClass 卷下部署 KubeSphere。

## 版本信息

- Ontap: 9.5
- Trident: v19.07
- k8s: 1.15
- kubesphere: 2.0.2

## 步骤

主要描述ontap搭建及配置、Trident搭建和配置和kubesphere搭建及配置等方面。

## OnTap 搭建及配置

在 VMware Workstation 上 `Simulate_ONTAP_9.5P6_Installation_and_Setup_Guide` 运行，Ontap 启动之后，按下面操作配置，其中以 `cluster base license`、`feature licenses for the non-ESX build` 配置证书、e0c、ip address：`192.168.*.20、netmask:255.255.255.0`、**集群名: cluster1、密码**等信息。

`https://IP address`,

以上设置的 IP 地址，用户名和密码：

![netapp.png](https://ww1.sinaimg.cn/large/006bbiLEgy1g6t9q3s4kkj30yf0l8qsj.jpg)

## Trident搭建及配置

* 下载安装包trident-installer-19.07.0.tar.gz，解压进入trident-installer目录，执行trident安装指令:

```bash
$ ./tridentctl install -n trident
```

* 结合ontap的提供的参数创建第一个后端vi backend.json。

```json
{
    "version": 1,
    "storageDriverName": "ontap-nas",
    "backendName": "customBackendName",
    "managementLIF": "10.0.0.1",
    "dataLIF": "10.0.0.2",
    "svm": "trident_svm",
    "username": "cluster-admin",
    "password": "password"
}
```

* 生成后端卷

```bash
$ ./tridentctl -n trident create backend -f backend.json
```

* 创建 StorageClass

**storage-class-ontapnas.yaml**

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ontapnasudp
provisioner: netapp.io/trident
mountOptions: ["rw", "nfsvers=3", "proto=udp"]
parameters:
  backendType: "ontap-nas"
```
创建 StorageClass 指令`kubectl create -f storage-class-ontapnas.yaml`

## KubeSphere 的安装及配置

* 在 Kubernetes 集群中创建名为 `kubesphere-system` 和 `kubesphere-monitoring-system` 的 namespace。

```bash
$ cat <<EOF | kubectl create -f -
---
apiVersion: v1
kind: Namespace
metadata:
    name: kubesphere-system
---
apiVersion: v1
kind: Namespace
metadata:
    name: kubesphere-monitoring-system
EOF
```

* 创建 Kubernetes 集群 CA 证书的 Secret。

```bash
$ kubectl -n kubesphere-system create secret generic kubesphere-ca  \
--from-file=ca.crt=/etc/kubernetes/pki/ca.crt  \
--from-file=ca.key=/etc/kubernetes/pki/ca.key
```

* 若 etcd 已经配置过证书，则参考如下创建（以下命令适用于 Kubeadm 创建的 Kubernetes 集群环境）：

```bash
$ kubectl -n kubesphere-monitoring-system create secret generic kube-etcd-client-certs  \
--from-file=etcd-client-ca.crt=/etc/kubernetes/pki/etcd/ca.crt  \
--from-file=etcd-client.crt=/etc/kubernetes/pki/etcd/healthcheck-client.crt  \
--from-file=etcd-client.key=/etc/kubernetes/pki/etcd/healthcheck-client.key
```

* 修改kubesphere.yaml中存储的设置参数和对应的参数即可。

```bash
kubectl apply -f kubesphere.yaml
```

* 访问 KubeSphere UI 界面，默认帐密：`admin/P@88w0rd`。

![kubesphere](https://pek3b.qingstor.com/kubesphere-docs/png/20190912002602.png)

## 参考文档

- https://docs.netapp.com/ontap-9/index.jsp?lang=zh_CN
- https://netapp-trident.readthedocs.io/en/stable-v19.07/introduction.html
- https://github.com/kubesphere/ks-installer/blob/master/README_zh.md
