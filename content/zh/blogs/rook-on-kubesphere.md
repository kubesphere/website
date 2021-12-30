---
title: '在 Kubernetes 中使用 Rook 构建云原生存储环境'
tag: '存储'
keywords: 'Rook, KubeSphere, Ceph, Kubernetes'
description: '本文将介绍如何使用 Rook 来创建维护 Ceph 集群，并作为 Kubernetes 的持久化存储。'
createTime: '2021-12-29'
author: '尹珉'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/rook-on-kubesphere.png'
---

## Rook 介绍

Rook 是一个开源的云原生存储编排器，为各种存储解决方案提供平台、框架和支持，以便与云原生环境进行原生集成。

Rook 将分布式存储系统转变为自管理、自扩展、自修复的存储服务。它使存储管理员的部署、引导、配置、配置、扩展、升级、迁移、灾难恢复、监控和资源管理等任务自动化。

简而言之，Rook 就是一组 Kubernetes 的 Operator，它可以完全控制多种数据存储解决方案（例如 Ceph、EdgeFS、Minio、Cassandra）的部署，管理以及自动恢复。

到目前为止，Rook 支持的最稳定的存储仍然是 Ceph，本文将介绍如何使用 Rook 来创建维护 Ceph 集群，并作为 Kubernetes 的持久化存储。

## 环境准备

K8s 环境可以通过安装 KubeSphere 进行部署,我使用的是高可用方案。

在公有云上安装 KubeSphere 参考文档：[多节点安装](https://v3-1.docs.kubesphere.io/zh/docs/installing-on-linux/public-cloud/install-kubesphere-on-huaweicloud-ecs/ "多节点安装")

⚠️ 注意：kube-node(5,6,7)的节点上分别有两块数据盘。

```bash
kube-master1   Ready    master   118d   v1.17.9
kube-master2   Ready    master   118d   v1.17.9
kube-master3   Ready    master   118d   v1.17.9
kube-node1     Ready    worker   118d   v1.17.9
kube-node2     Ready    worker   118d   v1.17.9
kube-node3     Ready    worker   111d   v1.17.9
kube-node4     Ready    worker   111d   v1.17.9
kube-node5     Ready    worker   11d    v1.17.9
kube-node6     Ready    worker   11d    v1.17.9
kube-node7     Ready    worker   11d    v1.17.9
```

安装前请确保 node 节点都安装上了 lvm2，否则会报错。

## 部署安装 Rook、Ceph 集群

**1.克隆 Rook 仓库到本地**

```bash
$ git clone -b release-1.4 https://github.com/rook/rook.git
```

**2.切换目录**

```bash
$ cd /root/ceph/rook/cluster/examples/kubernetes/ceph
```

**3.部署 Rook，创建 CRD 资源**

```bash
$ kubectl create -f common.yaml -f operator.yaml
# 说明：
# 1.comm.yaml里面主要是权限控制以及CRD资源定义
# 2.operator.yaml是rook-ceph-operator的deloyment
```

**4.创建 Ceph 集群**

```
$ kubectl create -f cluster.yaml
# 重要说明:
# 演示不做定制化操作，Ceph集群默认会动态去识别node节点上未格式化的全新空闲硬盘，自动会对这些盘进行OSD初始化（至少是需要3个节点，每个节点至少一块空闲硬盘）
```

**5.检查 pod 状态**

```bash
$ kubectl get pod -n rook-ceph -o wide
NAME                                                   READY   STATUS      RESTARTS   AGE   IP               NODE         NOMINATED NODE   READINESS GATES
csi-cephfsplugin-5fw92                                 3/3     Running     6          12d   192.168.0.31     kube-node7   <none>           <none>
csi-cephfsplugin-78plf                                 3/3     Running     0          12d   192.168.0.134    kube-node1   <none>           <none>
csi-cephfsplugin-bkdl8                                 3/3     Running     3          12d   192.168.0.195    kube-node5   <none>           <none>
csi-cephfsplugin-provisioner-77f457bcb9-6w4cv          6/6     Running     0          12d   10.233.77.95     kube-node4   <none>           <none>
csi-cephfsplugin-provisioner-77f457bcb9-q7vxh          6/6     Running     0          12d   10.233.76.156    kube-node3   <none>           <none>
csi-cephfsplugin-rqb4d                                 3/3     Running     0          12d   192.168.0.183    kube-node4   <none>           <none>
csi-cephfsplugin-vmrfj                                 3/3     Running     0          12d   192.168.0.91     kube-node3   <none>           <none>
csi-cephfsplugin-wglsw                                 3/3     Running     3          12d   192.168.0.116    kube-node6   <none>           <none>
csi-rbdplugin-4m8hv                                    3/3     Running     0          12d   192.168.0.91     kube-node3   <none>           <none>
csi-rbdplugin-7wt45                                    3/3     Running     3          12d   192.168.0.195    kube-node5   <none>           <none>
csi-rbdplugin-bn5pn                                    3/3     Running     3          12d   192.168.0.116    kube-node6   <none>           <none>
csi-rbdplugin-hwl4b                                    3/3     Running     6          12d   192.168.0.31     kube-node7   <none>           <none>
csi-rbdplugin-provisioner-7897f5855-7m95p              6/6     Running     0          12d   10.233.77.94     kube-node4   <none>           <none>
csi-rbdplugin-provisioner-7897f5855-btwt5              6/6     Running     0          12d   10.233.76.155    kube-node3   <none>           <none>
csi-rbdplugin-qvksp                                    3/3     Running     0          12d   192.168.0.183    kube-node4   <none>           <none>
csi-rbdplugin-rr296                                    3/3     Running     0          12d   192.168.0.134    kube-node1   <none>           <none>
rook-ceph-crashcollector-kube-node1-64cf6f49fb-bx8lz   1/1     Running     0          12d   10.233.101.46    kube-node1   <none>           <none>
rook-ceph-crashcollector-kube-node3-575b75dc64-gxwtp   1/1     Running     0          12d   10.233.76.149    kube-node3   <none>           <none>
rook-ceph-crashcollector-kube-node4-78549d6d7f-9zz5q   1/1     Running     0          8d    10.233.77.226    kube-node4   <none>           <none>
rook-ceph-crashcollector-kube-node5-5db8557476-b8zp6   1/1     Running     1          11d   10.233.81.239    kube-node5   <none>           <none>
rook-ceph-crashcollector-kube-node6-78b7946769-8qh45   1/1     Running     0          8d    10.233.66.252    kube-node6   <none>           <none>
rook-ceph-crashcollector-kube-node7-78c97898fd-k85l4   1/1     Running     1          8d    10.233.111.33    kube-node7   <none>           <none>
rook-ceph-mds-myfs-a-86bdb684b6-4pbj7                  1/1     Running     0          8d    10.233.77.225    kube-node4   <none>           <none>
rook-ceph-mds-myfs-b-6697d66b7d-jgnkw                  1/1     Running     0          8d    10.233.66.250    kube-node6   <none>           <none>
rook-ceph-mgr-a-658db99d5b-jbrzh                       1/1     Running     0          12d   10.233.76.162    kube-node3   <none>           <none>
rook-ceph-mon-a-5cbf5947d8-vvfgf                       1/1     Running     1          12d   10.233.101.44    kube-node1   <none>           <none>
rook-ceph-mon-b-6495c96d9d-b82st                       1/1     Running     0          12d   10.233.76.144    kube-node3   <none>           <none>
rook-ceph-mon-d-dc4c6f4f9-rdfpg                        1/1     Running     1          12d   10.233.66.219    kube-node6   <none>           <none>
rook-ceph-operator-56fc54bb77-9rswg                    1/1     Running     0          12d   10.233.76.138    kube-node3   <none>           <none>
rook-ceph-osd-0-777979f6b4-jxtg9                       1/1     Running     1          11d   10.233.81.237    kube-node5   <none>           <none>
rook-ceph-osd-10-589487764d-8bmpd                      1/1     Running     0          8d    10.233.111.59    kube-node7   <none>           <none>
rook-ceph-osd-11-5b7dd4c7bc-m4nqz                      1/1     Running     0          8d    10.233.111.60    kube-node7   <none>           <none>
rook-ceph-osd-2-54cbf4d9d8-qn4z7                       1/1     Running     1          10d   10.233.66.222    kube-node6   <none>           <none>
rook-ceph-osd-6-c94cd566-ndgzd                         1/1     Running     1          10d   10.233.81.238    kube-node5   <none>           <none>
rook-ceph-osd-7-d8cdc94fd-v2lm8                        1/1     Running     0          9d    10.233.66.223    kube-node6   <none>           <none>
rook-ceph-osd-prepare-kube-node1-4bdch                 0/1     Completed   0          66m   10.233.101.91    kube-node1   <none>           <none>
rook-ceph-osd-prepare-kube-node3-bg4wk                 0/1     Completed   0          66m   10.233.76.252    kube-node3   <none>           <none>
rook-ceph-osd-prepare-kube-node4-r9dk4                 0/1     Completed   0          66m   10.233.77.107    kube-node4   <none>           <none>
rook-ceph-osd-prepare-kube-node5-rbvcn                 0/1     Completed   0          66m   10.233.81.73     kube-node5   <none>           <none>
rook-ceph-osd-prepare-kube-node5-rcngg                 0/1     Completed   5          10d   10.233.81.98     kube-node5   <none>           <none>
rook-ceph-osd-prepare-kube-node6-jc8cm                 0/1     Completed   0          66m   10.233.66.109    kube-node6   <none>           <none>
rook-ceph-osd-prepare-kube-node6-qsxrp                 0/1     Completed   0          11d   10.233.66.109    kube-node6   <none>           <none>
rook-ceph-osd-prepare-kube-node7-5c52p                 0/1     Completed   5          8d    10.233.111.58    kube-node7   <none>           <none>
rook-ceph-osd-prepare-kube-node7-h5d6c                 0/1     Completed   0          66m   10.233.111.110   kube-node7   <none>           <none>
rook-ceph-osd-prepare-kube-node7-tzvp5                 0/1     Completed   0          11d   10.233.111.102   kube-node7   <none>           <none>
rook-ceph-osd-prepare-kube-node7-wd6dt                 0/1     Completed   7          8d    10.233.111.56    kube-node7   <none>           <none>
rook-ceph-tools-64fc489556-5clvj                       1/1     Running     0          12d   10.233.77.118    kube-node4   <none>           <none>
rook-discover-6kbvg                                    1/1     Running     0          12d   10.233.101.42    kube-node1   <none>           <none>
rook-discover-7dr44                                    1/1     Running     2          12d   10.233.66.220    kube-node6   <none>           <none>
rook-discover-dqr82                                    1/1     Running     0          12d   10.233.77.74     kube-node4   <none>           <none>
rook-discover-gqppp                                    1/1     Running     0          12d   10.233.76.139    kube-node3   <none>           <none>
rook-discover-hdkxf                                    1/1     Running     1          12d   10.233.81.236    kube-node5   <none>           <none>
rook-discover-pzhsw                                    1/1     Running     3          12d   10.233.111.36    kube-node7   <none>           <none>

```

以上是所有组件的 pod 完成后的状态，其中 rook-ceph-osd-prepare 开头的 pod 是自动感知集群新挂载硬盘的，只要有新硬盘挂载到集群自动会触发 OSD。

**6.配置 Ceph 集群 dashboard**

Ceph Dashboard 是一个内置的基于 Web 的管理和监视应用程序，它是开源 Ceph 发行版的一部分。通过 Dashboard 可以获取 Ceph 集群的各种基本状态信息。

默认的 ceph 已经安装的 ceph-dashboard，其 SVC 地址是 service clusterIP，并不能被外部访问，需要创建 service 服务

```bash
$ kubectl apply -f dashboard-external-http.yaml
```

```bash
apiVersion: v1
kind: Service
metadata:
  name: rook-ceph-mgr-dashboard-external-https
  namespace: rook-ceph # namespace:cluster
  labels:
    app: rook-ceph-mgr
    rook_cluster: rook-ceph # namespace:cluster
spec:
  ports:
    - name: dashboard
      port: 7000
      protocol: TCP
      targetPort: 7000
  selector:
    app: rook-ceph-mgr
    rook_cluster: rook-ceph
  sessionAffinity: None
  type: NodePort
```

**说明**：由于 8443 是 https 访问端口需要配置证书，本教程只展示 http 访问 port 上只配置了 7000

**7.查看 svc 状态**

```bash
$ kubectl get svc -n rook-ceph
NAME                                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
csi-cephfsplugin-metrics                 ClusterIP   10.233.3.172    <none>        8080/TCP,8081/TCP   12d
csi-rbdplugin-metrics                    ClusterIP   10.233.43.23    <none>        8080/TCP,8081/TCP   12d
rook-ceph-mgr                            ClusterIP   10.233.63.85    <none>        9283/TCP            12d
rook-ceph-mgr-dashboard                  ClusterIP   10.233.20.159   <none>        7000/TCP            12d
rook-ceph-mgr-dashboard-external-https   NodePort    10.233.56.73    <none>        7000:31357/TCP      12d
rook-ceph-mon-a                          ClusterIP   10.233.30.222   <none>        6789/TCP,3300/TCP   12d
rook-ceph-mon-b                          ClusterIP   10.233.55.25    <none>        6789/TCP,3300/TCP   12d
rook-ceph-mon-d                          ClusterIP   10.233.0.206    <none>        6789/TCP,3300/TCP   12d

```

**8.验证访问 dashboard**

打开 KubeSphere 平台开启外网服务

![](https://pek3b.qingstor.com/kubesphere-community/images/7ca284ce-49d9-4ba4-ba10-8ffbaacac98c.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/d9a616b7-44f6-4a5c-85c8-e37ac9e00576.png)

访问方式：

```bash
http://{master1-ip:31357}
```

用户名获取方法：

```bash
$ kubectl -n rook-ceph get secret rook-ceph-dashboard-password -o jsonpath="{['data']['password']}"|base64 --decode && echo
```

![](https://pek3b.qingstor.com/kubesphere-community/images/5f1f856f-6bf8-42ed-9d2a-c2ef1c88f8e8.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/72082e58-7a68-4e07-80d7-34f05d34e03f.png)

**说明**：dashboard 显示 HEALTH_WARN 警告可以通过 seelog 的方式查看具体的原因，一般是 osd down、pg 数量不够等

**9.部署 rook 工具箱**

Rook 工具箱是一个包含用于 Rook 调试和测试的常用工具的容器

```bash
$ kubectl apply -f toolbox.yaml
```

进入工具箱查看 Ceph 集群状态

```bash
$ kubectl -n rook-ceph exec -it $(kubectl -n rook-ceph get pod -l "app=rook-ceph-tools" -o jsonpath='{.items[0].metadata.name}') -- bash
```

```bash
$ ceph -s
  cluster:
    id:     1457045a-4926-411f-8be8-c7a958351a38
    health: HEALTH_WARN
            mon a is low on available space
            2 osds down
            Degraded data redundancy: 25/159 objects degraded (15.723%), 16 pgs degraded, 51 pgs undersized
            3 daemons have recently crashed

  services:
    mon: 3 daemons, quorum a,b,d (age 9d)
    mgr: a(active, since 4h)
    mds: myfs:1 {0=myfs-b=up:active} 1 up:standby-replay
    osd: 12 osds: 6 up (since 8d), 8 in (since 8d); 9 remapped pgs

  data:
    pools:   5 pools, 129 pgs
    objects: 53 objects, 37 MiB
    usage:   6.8 GiB used, 293 GiB / 300 GiB avail
    pgs:     25/159 objects degraded (15.723%)
             5/159 objects misplaced (3.145%)
             69 active+clean
             35 active+undersized
             16 active+undersized+degraded
             9  active+clean+remapped

```

工具箱相关查询命令

```bash
ceph status
ceph osd status
ceph df
rados df
```

## 部署 StorageClass

**1.rbd 块存储简介**

Ceph 可以同时提供对象存储 RADOSGW、块存储 RBD、文件系统存储 Ceph FS。 RBD 即 RADOS Block Device 的简称，RBD 块存储是最稳定且最常用的存储类型。RBD 块设备类似磁盘可以被挂载。 RBD 块设备具有快照、多副本、克隆和一致性等特性，数据以条带化的方式存储在 Ceph 集群的多个 OSD 中。

![](https://pek3b.qingstor.com/kubesphere-community/images/499b9863-ea8e-4244-b092-21a728833fe1.png)

**2.创建 StorageClass**

```bash
[root@kube-master1 rbd]# kubectl  apply -f storageclass.yaml
```

**3.查看 StorageClass 部署状态**

![](https://pek3b.qingstor.com/kubesphere-community/images/c47bf4ea-d371-4714-b07a-b3ecefeb40db.png)

**4.创建 pvc**

```bash
$ kubectl apply -f pvc.yaml
```

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: rbd-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
  storageClassName: rook-ceph-block
~
```

**5.创建带有 pvc 的 pod**

```bash
$ kubectl apply -f pod.yaml
```

```bash
apiVersion: v1
kind: Pod
metadata:
  name: csirbd-demo-pod
spec:
  containers:
    - name: web-server
      image: nginx
      volumeMounts:
        - name: mypvc
          mountPath: /var/lib/www/html
  volumes:
    - name: mypvc
      persistentVolumeClaim:
        claimName: rbd-pvc
        readOnly: false

```

**6.查看 pod、pvc、pv 状态**

![](https://pek3b.qingstor.com/kubesphere-community/images/c47bf4ea-d371-4714-b07a-b3ecefeb40db.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/b5695378-a271-4389-933f-4808d472fceb.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/668ec96d-c099-4482-b0d2-73300b0803ef.png)

## 总结

对于首次接触 rook+Ceph 部署体验的同学来说需要了解的内容较多，遇到的坑也会比较的多。希望通过以上的部署过程记录可以帮助到大家。

**1.Ceph 集群一直提示没有可 osd 的盘**

答：这里遇到过几个情况，查看下挂载的数据盘是不是以前已经使用过虽然格式化了但是以前的 raid 信息还存在？可以使用一下脚本进行清理后在格式化在进行挂载。

```bash
#!/usr/bin/env bash
DISK="/dev/vdc"  #按需修改自己的盘符信息

# Zap the disk to a fresh, usable state (zap-all is important, b/c MBR has to be clean)

# You will have to run this step for all disks.
sgdisk --zap-all $DISK

# Clean hdds with dd
dd if=/dev/zero of="$DISK" bs=1M count=100 oflag=direct,dsync

# Clean disks such as ssd with blkdiscard instead of dd
blkdiscard $DISK

# These steps only have to be run once on each node
# If rook sets up osds using ceph-volume, teardown leaves some devices mapped that lock the disks.
ls /dev/mapper/ceph-* | xargs -I% -- dmsetup remove %

# ceph-volume setup can leave ceph-<UUID> directories in /dev and /dev/mapper (unnecessary clutter)
rm -rf /dev/ceph-*
rm -rf /dev/mapper/ceph--*

# Inform the OS of partition table changes
partprobe $DISK
~
```

**2.Ceph 支持哪些存储类型？**

答：rdb 块存储、cephfs 文件存储、s3 对象存储等

**3.部署中出现各种坑应该怎么排查？**

答：强烈建议通过 rook、ceph 官网去查看相关文档进行排错

- https://rook.github.io/docs/rook/
- https://docs.ceph.com/en/pacific/

**4.访问 dashboard 失败**

答：如果是公有云搭建的 KubeSphere 或 K8s 请把 nodeport 端口在安全组里放行即可
