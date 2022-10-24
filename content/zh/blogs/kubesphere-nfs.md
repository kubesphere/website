---
title: 'KubeSphere 集群配置 NFS 存储解决方案'
tag: 'KubeSphere'
keywords: 'KubeSphere, NFS, Kubernetes, 存储'
description: '不建议您在生产环境中使用 NFS 存储（特别是 Kubernetes 1.20 或以上版本）。'
createTime: '2022-10-20'
author: '申红磊'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-nfs-cover.png'
---

> 作者：申红磊，QingCloud 容器解决方案架构师，开源项目爱好者，KubeSphere Member

在正式阅读本文之前，先友情提醒一下：不建议您在生产环境中使用 NFS 存储（特别是 Kubernetes 1.20 或以上版本），原因如下：

- selfLink was empty 在 K8s 集群 v1.20 之前都存在，在 v1.20 之后被删除问题。
- 还有可能引起 failed to obtain lock 和 input/output error 等问题，从而导致 Pod CrashLoopBackOff。此外，部分应用不兼容 NFS，例如 Prometheus 等。

### 安装 NFS Server

```bash
#安装 NFS 服务器端
$ sudo apt-get update #执行以下命令确保使用最新软件包
$ sudo apt-get install nfs-kernel-server
#安装 NFS 客户端
$ sudo apt-get install nfs-common

# yum
$ yum install -y nfs-utils
```

### 创建共享目录

先查看配置文件 /etc/exports：

```bash
$ cat /etc/exports
# /etc/exports: the access control list for filesystems which may be exported
#		to NFS clients.  See exports(5).
#
# Example for NFSv2 and NFSv3:
# /srv/homes       hostname1(rw,sync,no_subtree_check) hostname2(ro,sync,no_subtree_check)
#
# Example for NFSv4:
# /srv/nfs4        gss/krb5i(rw,sync,fsid=0,crossmnt,no_subtree_check)
# /srv/nfs4/homes  gss/krb5i(rw,sync,no_subtree_check)
```

创建共享目标并赋权：

```bash
#目录ksha3.2
$ mkdir /ksha3.2
$ chmod 777 /ksha3.2
#目录demo
$ mkdir /demo
$ chmod 777 /demo
#目录/home/ubuntu/nfs/ks3.1
$ mkdir /home/ubuntu/nfs/ks3.1
$ chmod 777 /home/ubuntu/nfs/ks3.1
```

添加到配置文件中 /etc/exports：

```bash
$ vi /etc/exports
....
/home/ubuntu/nfs/ks3.1 *(rw,sync,no_subtree_check)
/mount/ksha3.2 *(rw,sync,no_subtree_check)
/mount/demo *(rw,sync,no_subtree_check)
#/mnt/ks3.2 139.198.186.39(insecure,rw,sync,anonuid=500,anongid=500)
#/mnt/demo 139.198.167.103(rw,sync,no_subtree_check)
#此文件的配置格式为：<输出目录> [客户端1 选项（访问权限,用户映射,其他）] [客户端2 选项（访问权限,用户映射,其他）]
```

注意：如果共享目录创建无效或者遗漏创建，使用时会报异常如下：

```bash
$ mount.nfs: access denied by server while mounting 139.198.168.114:/mnt/demo1
#客户端挂载 nfs 共享目录的时候提示 mount.nfs: access denied by server while mounting。
#问题原因：服务器端的共享目录没有设置允许其他人访问的权限，或者客户端挂载的目录没有权限。
#解决办法：在服务器端修改共享目录的权限，成功连接。
```

### 验证

```bash
#更新配置文件,重新加载 /etc/exports 的配置：
$ exportfs -rv
#在 nfs server 上测试 查看本机共享的目录：
$ showmount -e 127.0.0.1
$ showmount -e localhost

$ showmount -e 127.0.0.1
Export list for 127.0.0.1:
/mount/demo            *
/mount/ksha3.2         *
/home/ubuntu/nfs/ks3.1 *
```

### 使用

在其它网络通的机器上，使用 NFS 共享目录。

安装客户端

如果不安装客户端会报：bad option; for several filesystems (e.g. nfs, cifs) you might need a /sbin/mount. helper program.

```bash
#apt-get
$ apt-get install nfs-common
#yum
$ yum install nfs-utils
```

在用户机器上进行测试：

```bash
#本机创建挂载目录
#目录ksha3.2
$ mkdir /root/aa
$ chmod 777 /root/aa

#使用 nfs client 上测试，将 /root/aa 目录挂载到远端 139.198.168.114 的共享存储目录/mount/ksha3.2上
$ mount -t nfs 139.198.168.114:/mount/ksha3.2 /root/aa
```

查看：

```bash
#使用 df -h 查看
$ df -h | grep aa
139.198.168.114:/mount/ksha3.2  146G  5.3G  140G   4% /root/aa
```

解绑：

```bash
$ umount -t nfs 139.198.168.114:/mnt/ksha3.2 /root/aa
#如果卸载的时候提示：umount:/mnt:device is busy；解决方法：需要退出挂载目录再进行卸载，或者是否 NFS server 宕机了
#需要强制卸载：mount –lf /mnt 
#此命令也可以：fuser –km /mnt 不建议用
```

## KubeSphere 对接 NFS 动态分配器

可安装 NFS 客户端程序，为了方便用户对接 NFS 服务端，KubeSphere 可安装 [NFS 动态分配器](https://github.com/helm/charts/tree/master/stable/nfs-client-provisioner "NFS 动态分配器")，支持动态分配存储卷，分配和回收存储卷过程简便，可对接一个或者多个 NFS 服务端。

> 当然也可以使用 [Kubernetes 官方方法对接 NFS 服务端](https://kubernetes.io/docs/concepts/storage/volumes/#nfs "Kubernetes 官方方法对接 NFS 服务端")，这是一种静态分配存储卷方法，分配和回收存储卷过程复杂，可对接多个 NFS 服务端。

### 前提条件

用户对接 NFS 服务端时应确保 KubeSphere 各节点有权限挂载 NFS 服务端文件夹。

### 操作步骤

以下步骤示例中，NFS 服务端 IP 为 139.198.168.114，NFS 共享文件夹为 /mnt/ksha3.2。

#### 安装 NFS 动态分配器

首先[请在这里下载 rbac.yaml](https://raw.githubusercontent.com/kubernetes-incubator/external-storage/master/nfs-client/deploy/rbac.yaml "请在这里下载 rbac.yaml")，或者直接执行命令：

```bash
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-incubator/external-storage/master/nfs-client/deploy/rbac.yaml
serviceaccount/nfs-client-provisioner created
clusterrole.rbac.authorization.k8s.io/nfs-client-provisioner-runner created
clusterrolebinding.rbac.authorization.k8s.io/run-nfs-client-provisioner created
role.rbac.authorization.k8s.io/leader-locking-nfs-client-provisioner created
rolebinding.rbac.authorization.k8s.io/leader-locking-nfs-client-provisioner created
```

然后[下载官方的 nfs provisoner 用途的 deployment](https://raw.githubusercontent.com/Kubernetes-incubator/external-storage/master/nfs-client/deploy/deployment.yaml "下载官方的 nfs provisoner 用途的 deployment")。deployment 文件中有几处，请根据自己的情况做修改：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nfs-client-provisioner
  labels:
    app: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: nfs-client-provisioner
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: quay.io/external_storage/nfs-client-provisioner:latest
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: nfs/provisioner-229
            - name: NFS_SERVER
              value: 139.198.168.114
            - name: NFS_PATH
              value: /mount/ksha3.2
      volumes:
        - name: nfs-client-root
          nfs:
            server: 139.198.168.114
            path: /mount/ksha3.2
```

执行创建：

```bash
$ kubectl apply -f deployment.yaml
deployment.apps/nfs-client-provisioner created
```

接下来[下载官方的 class.yaml](https://raw.githubusercontent.com/Kubernetes-incubator/external-storage/master/nfs-client/deploy/class.yaml "下载官方的 class.yaml")，然后创建 StorageClass，需要根据实际情况修改参数：

```bash
#请根据上方deployment部署时候的provisioner_name做对应的修改，或者没有修改，就不用动
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: managed-nfs-storage
  annotations:
    "storageclass.kubernetes.io/is-default-class": "false"
provisioner: nfs/provisioner-229 # or choose another name, must match deployment's env PROVISIONER_NAME'
parameters:
  archiveOnDelete: "false"
```

执行创建：`kubectl apply -f storageclass.yaml`。

如果想让这个 NFS 作为默认的 Provisioner, 那么就添加如下的 annotation：

```bash
annotations:
  "storageclass.kubernetes.io/is-default-class": "true"
```

或者[标记一个 StorageClass 为默认的 StorageClass](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/change-default-storage-class/#改变默认-storageclass "标记一个 StorageClass 为默认的 StorageClass"), 你需要添加 / 设置注解 `storageclass.kubernetes.io/is-default-class=true`。

```bash
$ kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

# 检查集群中是否已存在 default Storage Class
$ kubectl get sc
NAME                         PROVISIONER                   AGE
glusterfs (default)         kubernetes.io/glusterfs        3d4h
```

#### 验证安装结果

执行以下命令，查看 NFS 动态分配器容器组是否正常运行。

```bash
$ kubectl get po -A | grep nfs-client
default                        nfs-client-provisioner-7d69b9f45f-ks94m                           1/1     Running     0          9m3s
```

#### 查看 NFS 存储类型

```bash
$ kubectl get sc managed-nfs-storage
NAME                  PROVISIONER           RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
managed-nfs-storage   nfs/provisioner-229   Delete          Immediate           false                  6m28s
```

#### 创建和挂载 NFS 存储卷

现在可以通过动态创建 NFS 存储卷和工作负载挂载 NFS 存储卷了。

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: demo4nfs
  namespace: ddddd
  annotations:
    kubesphere.io/creator: admin
    volume.beta.kubernetes.io/storage-provisioner: nfs/provisioner-229
  finalizers:
    - kubernetes.io/pvc-protection
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: managed-nfs-storage
  volumeMode: Filesystem
```

### unexpected error getting claim reference: selfLink was empty, can’t make reference

#### 问题现象

使用 NFS 创建 PV 时，PVC 一直是处于 Pending 状态。

查看 PVC：

```bash
$ kubectl get pvc -n ddddd
NAME       STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
demo4nfs   Bound    pvc-a561ce85-fc0d-42af-948e-6894ac000264   10Gi       RWO            managed-nfs-storage   32m
```

查看详细信息：

```bash
#查看当前 pvc 的状态信息,发现是在等待 volume 的创建
$ kubectl get pvc -n ddddd
```

查看 nfs-client-provisioner 的日志，是 seltlink was empty 的问题，selfLink was empty 在 K8s 集群 v1.20 之前都存在，在 v1.20 之后被删除，需要在 `/etc/kubernetes/manifests/kube-apiserver.yaml` 中添加参数。

```bash
$ kubectl get pod -n default
NAME                                      READY   STATUS    RESTARTS   AGE
nfs-client-provisioner-7d69b9f45f-ks94m   1/1     Running   0          27m

$ kubectl logs -f nfs-client-provisioner-7d69b9f45f-ks94m
I0622 09:41:33.606000       1 leaderelection.go:185] attempting to acquire leader lease  default/nfs-provisioner-229...
E0622 09:41:33.612745       1 event.go:259] Could not construct reference to: '&v1.Endpoints{TypeMeta:v1.TypeMeta{Kind:"", APIVersion:""}, ObjectMeta:v1.ObjectMeta{Name:"nfs-provisioner-229", GenerateName:"", Namespace:"default", SelfLink:"", UID:"e8f19e28-f17f-4b22-9bb8-d4cbe20c796b", ResourceVersion:"23803580", Generation:0, CreationTimestamp:v1.Time{Time:time.Time{wall:0x0, ext:63791487693, loc:(*time.Location)(0x1956800)}}, DeletionTimestamp:(*v1.Time)(nil), DeletionGracePeriodSeconds:(*int64)(nil), Labels:map[string]string(nil), Annotations:map[string]string{"control-plane.alpha.kubernetes.io/leader":"{\"holderIdentity\":\"nfs-client-provisioner-7d69b9f45f-ks94m_8081b417-f20f-11ec-bff3-f64a9f402fda\",\"leaseDurationSeconds\":15,\"acquireTime\":\"2022-06-22T09:41:33Z\",\"renewTime\":\"2022-06-22T09:41:33Z\",\"leaderTransitions\":0}"}, OwnerReferences:[]v1.OwnerReference(nil), Initializers:(*v1.Initializers)(nil), Finalizers:[]string(nil), ClusterName:""}, Subsets:[]v1.EndpointSubset(nil)}' due to: 'selfLink was empty, can't make reference'. Will not report event: 'Normal' 'LeaderElection' 'nfs-client-provisioner-7d69b9f45f-ks94m_8081b417-f20f-11ec-bff3-f64a9f402fda became leader'
I0622 09:41:33.612829       1 leaderelection.go:194] successfully acquired lease default/nfs-provisioner-229
I0622 09:41:33.612973       1 controller.go:631] Starting provisioner controller nfs/provisioner-229_nfs-client-provisioner-7d69b9f45f-ks94m_8081b417-f20f-11ec-bff3-f64a9f402fda!
I0622 09:41:33.713170       1 controller.go:680] Started provisioner controller nfs/provisioner-229_nfs-client-provisioner-7d69b9f45f-ks94m_8081b417-f20f-11ec-bff3-f64a9f402fda!
I0622 09:53:33.461902       1 controller.go:987] provision "ddddd/demo4nfs" class "managed-nfs-storage": started
E0622 09:53:33.464213       1 controller.go:1004] provision "ddddd/demo4nfs" class "managed-nfs-storage": unexpected error getting claim reference: selfLink was empty, can't make reference
I0622 09:56:33.623717       1 controller.go:987] provision "ddddd/demo4nfs" class "managed-nfs-storage": started
E0622 09:56:33.625852       1 controller.go:1004] provision "ddddd/demo4nfs" class "managed-nfs-storage": unexpected error getting claim reference: selfLink was empty, can't make reference
```

#### 解决办法

在 kube-apiserver.yaml 文件中添加参数 `- --feature-gates=RemoveSelfLink=false`。

![](https://pek3b.qingstor.com/kubesphere-community/images/0e05700bef146.png)

```bash
#使用命令查找一下 kube-apiserver.yaml的位置
$ find / -name kube-apiserver.yaml
/data/kubernetes/manifests/kube-apiserver.yaml
#在文件中添加 - --feature-gates=RemoveSelfLink=false ，如下图
$ cat /data/kubernetes/manifests/kube-apiserver.yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: 192.168.100.25:6443
  creationTimestamp: null
  labels:
    component: kube-apiserver
    tier: control-plane
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - command:
    - kube-apiserver
    - --feature-gates=RemoveSelfLink=false
    - --advertise-address=0.0.0.0
    - --allow-privileged=true
    - --authorization-mode=Node,RBAC
    - --client-ca-file=/etc/kubernetes/pki/ca.crt
    - --enable-admission-plugins=NodeRestriction

#添加之后使用kubeadm部署的集群会自动加载部署 Pod
#kubeadm 安装的 apiserver 是 Static Pod，它的配置文件被修改后，立即生效。
#Kubelet 会监听该文件的变化，当您修改了 /etc/kubenetes/manifest/kube-apiserver.yaml 文件之后，kubelet 将自动终止原有的 #kube-apiserver-{nodename} 的 Pod，并自动创建一个使用了新配置参数的 Pod 作为替代。
#如果您有多个 Kubernetes Master 节点，您需要在每一个 Master 节点上都修改该文件，并使各节点上的参数保持一致。
#这里需注意如果 api-server 启动失败 需重新在执行一遍
$ kubectl apply -f /etc/kubernetes/manifests/kube-apiserver.yaml
```

#### GitHub 官方 ISSUES

+ [unexpected error getting claim reference: selfLink was empty, can’t make reference](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner/issues/25 "unexpected error getting claim reference: selfLink was empty, can’t make reference")