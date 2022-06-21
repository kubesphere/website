---
title: 'Kubernetes 跨 StorageClass 迁移 Persistent Volumes 完全指南'
tag: 'KubeSphere, Kubernetes, 云原生存储'
keywords: 'KubeSphere, Kubernetes, 云原生存储, PV, PVC, 备份容灾'
description: '本文介绍了如何将 Kubernetes 集群中现有 PV 的数据迁移到新的 PV，并创建同名的 PVC 来指向新的 PV，这样就完成了应用的数据迁移而不需要对应用的配置清单做任何更改。'
createTime: '2022-06-17'
author: '米开朗基杨'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202206211210627.png'
---

KubeSphere 3.3.0 （不出意外的话~）下周就要 GA 了，作为一名 KubeSphere 脑残粉，我迫不及待地先安装 [RC 版](https://github.com/kubesphere/kubesphere/releases/tag/v3.3.0-rc.2)尝尝鲜，一顿操作猛如虎开启所有组件，装完之后发现有点尴尬：我用错了持久化存储。

我的 K8s 集群中有两个存储类（StorageClass），一个是 OpenEBS 提供的本地存储，另一个是 [QingCloud CSI](https://github.com/yunify/qingcloud-csi) 提供的分布式存储，而且默认的 StorageClass 是 OpenEBS 提供的 local-hostpath，所以 KubeSphere 的有状态组件默认便使用本地存储来保存数据。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206162226279.png)

失误失误，我本来是想用分布式存储作为默认存储的，但是我忘记将 csi-qingcloud 设置为默认的 StorageClass 了，反正不管怎样，就这么稀里糊涂地搞错了。**虽然重装可以解决 99% 的问题，但作为一名成熟的 YAML 工程师，重装是不可能的，必须在不重装的情况下解决这个问题，才能体现出我的气质！**

事实上不止我一个人遇到过这种情况，很多人都会稀里糊涂地装完一整套产品之后发现 StorageClass 用错了，这时候再想改回去恐怕就没那么容易了。这不巧了么这不是，本文就是来帮助大家解决这个问题的。

## 思路

我们先来思考一下换 StorageClass 需要做哪几件事情。首先需要将应用的副本数缩减为 0，然后创建一个新的 PVC，将旧 PV 的数据复制到新 PV，然后让应用使用新的 PV，并将副本扩展到原来的数量，最后再将旧 PV 删除。在这整个过程中还要防止删除 PVC 时 Kubernetes 将 PV 也删除了。

当然，有些 CSI 驱动或者存储后端可能会有更便利的数据迁移技巧，但是本文提供的是一种更加通用的方案，不管后端是什么存储都可以。

KubeSphere 3.3.0 开启所有组件之后使用的持久卷声明（PVC）如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/202206162257307.jpg)

本文就以 Elasticsearch 为例，演示如何将 Elasticsearch 的存储从本地存储替换为分布式存储。

## 备份 PVC 和 PV

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171525327.png)

首先第一步就是备份 PVC 和 PV，万一后面操作失败了，还有反悔的余地。

```bash
$ kubectl -n kubesphere-logging-system get pvc
NAME                                     STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS     AGE
data-elasticsearch-logging-data-0        Bound    pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9   20Gi       RWO            local-hostpath   28h
data-elasticsearch-logging-data-1        Bound    pvc-0851350a-270e-4d4d-af8d-081132c1775b   20Gi       RWO            local-hostpath   28h
data-elasticsearch-logging-discovery-0   Bound    pvc-8f32fc97-3d6e-471a-8121-655991d945a8   4Gi        RWO            local-hostpath   28h

$ kubectl -n kubesphere-logging-system get pv pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9 -o yaml > pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9.yaml
$ kubectl -n kubesphere-logging-system get pv pvc-0851350a-270e-4d4d-af8d-081132c1775b -o yaml > pvc-0851350a-270e-4d4d-af8d-081132c1775b.yaml

$ kubectl -n kubesphere-logging-system get pvc data-elasticsearch-logging-data-0 -o yaml > data-elasticsearch-logging-data-0.yaml
$ kubectl -n kubesphere-logging-system get pvc data-elasticsearch-logging-data-1 -o yaml > data-elasticsearch-logging-data-1.yaml
```

## 复制数据

不管 PV 的 accessModes 是 [ReadWriteOnce](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) 还是 [ReadWriteMany](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)，在复制数据之前都要将应用的副本数量缩减为 0，因为 ReadWriteOne 模式同时只允许挂载一个 Pod，新 Pod 无法挂载，而 ReadWriteMany 模式如果不将副本数量缩减为 0，在复制数据时可能会有新的数据写入。所以无论如何，都要将副本数量缩为 0 。

```bash
$ kubectl -n kubesphere-logging-system get sts
NAME                              READY   AGE
elasticsearch-logging-data        2/2     28h
elasticsearch-logging-discovery   1/1     28h

$ kubectl -n kubesphere-logging-system scale sts elasticsearch-logging-data --replicas=0

$ kubectl -n kubesphere-logging-system get sts
NAME                              READY   AGE
elasticsearch-logging-data        0/0     28h
elasticsearch-logging-discovery   1/1     28h
```

创建一个新的 PVC 叫 `new-data-elasticsearch-logging-data-0`，容量和 `data-elasticsearch-logging-data-0` 一样，并将 storageClassName 指定为新的 StorageClass。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206162324135.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202206162325361.png)

创建一个 Deployment，将新 PV 和旧 PV 都挂载进去，然后再将旧 PV 的数据拷贝到新 PV。

在『工作负载』界面点击『创建』，将下面的 YAML 粘贴进去即可。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: kubesphere-logging-system
  labels:
    app: datacopy
  name: datacopy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: datacopy
  template:
    metadata:
      labels:
        app: datacopy
    spec:
      containers:
        - name: datacopy
          image: ubuntu
          command:
            - 'sleep'
          args:
            - infinity
          volumeMounts:
            - name: old-pv
              readOnly: false
              mountPath: /mnt/old
            - name: new-pv
              readOnly: false
              mountPath: /mnt/new
      volumes:
        - name: old-pv
          persistentVolumeClaim:
            claimName: data-elasticsearch-logging-data-0
        - name: new-pv
          persistentVolumeClaim:
            claimName: new-data-elasticsearch-logging-data-0
```

这个 Deployment 将新 PV 和旧 PV 都挂载进去了，稍后我们会将旧 PV 的数据拷贝到新 PV。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171537228.png)

Pod 启动成功后，点击容器的终端图标进入容器的终端。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206162343710.png)

在容器中先验证旧 PV 的挂载点是否包含应用数据，新 PV 的挂载点是否是空的，之后再执行命令 `(cd /mnt/old; tar -cf - .) | (cd /mnt/new; tar -xpf -)`，以确保所有数据的所有权和权限被继承。

执行完成后，验证新 PV 的挂载点是否包含旧 PV 的数据，以及所有权和权限是否被正确继承。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206162351428.png)

到这里复制数据的任务就完成了，现在我们需要将 datacopy 的副本数量缩为 0。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206162357093.png)

## 迁移 PVC

迁移存储的理想状态是使用旧的 PVC，并将其指向新的 PV，这样工作负载的 YAML 配置清单就不需要做任何改变。但 PVC 和 PV 之间的绑定关系是不可更改的，要想让它们解绑，必须先删除旧的 PVC，再创建同名的 PVC，并将旧的 PV 与它绑定。

需要注意的是，默认情况下 PV 的回收策略是 `Delete`，一旦删除 PVC，与之绑定的 PV 和 PV 里的数据都会被删除。这是我们不希望看到的，所以我们需要修改回收策略，以便删除 PVC 时 PV 能够保留下来。

事实上可以[通过 StorageClass 来设置全局的回收策略（reclaimPolicy）](https://kubernetes.io/docs/concepts/storage/storage-classes/#reclaim-policy)，如果不设置，默认就是 `Delete`。可以通过命令 `kubectl describe pv <pv-name>` 来查看 PV 的回收策略（reclaimPolicy）：

```bash
$ kubectl describe pv pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9
Name:              pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9
Labels:            openebs.io/cas-type=local-hostpath
Annotations:       pv.kubernetes.io/provisioned-by: openebs.io/local
Finalizers:        [kubernetes.io/pv-protection]
StorageClass:      local-hostpath
Status:            Bound
Claim:             kubesphere-logging-system/data-elasticsearch-logging-data-0
Reclaim Policy:    Delete
...

$ kubectl describe pv pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e
Name:              pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e
Labels:            <none>
Annotations:       pv.kubernetes.io/provisioned-by: disk.csi.qingcloud.com
Finalizers:        [kubernetes.io/pv-protection external-attacher/disk-csi-qingcloud-com]
StorageClass:      csi-qingcloud
Status:            Bound
Claim:             kubesphere-logging-system/new-data-elasticsearch-logging-data-0
Reclaim Policy:    Delete
...
```

我们可以通过 patch 命令将新旧 PV 的回收策略设置为 `Retain`。

```bash
$ kubectl patch pv pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9 -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
persistentvolume/pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9 patched

$ kubectl patch pv pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
persistentvolume/pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9 patched
```

> ⚠️注意：该命令对 PV 的稳定性和可用性没有任何影响，可以随时执行。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171548486.png)

现在可以将新旧 PVC 全部删除，PV 不会受到任何影响。

```bash
$ kubectl -n kubesphere-logging-system delete pvc data-elasticsearch-logging-data-0 new-data-elasticsearch-logging-data-0
persistentvolumeclaim "data-elasticsearch-logging-data-0" deleted
persistentvolumeclaim "new-data-elasticsearch-logging-data-0" deleted
```

在创建最终的 PVC 之前，我们必须要确保新创建的 PVC 能够被绑定到新的 PV 上。通过以下命令可以看到新 PV 目前处于释放状态，不能被新 PVC 绑定：

```bash
$ kubectl describe pv pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e
Name:              pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e
Labels:            <none>
Annotations:       pv.kubernetes.io/provisioned-by: disk.csi.qingcloud.com
Finalizers:        [kubernetes.io/pv-protection external-attacher/disk-csi-qingcloud-com]
StorageClass:      csi-qingcloud
Status:            Released
Claim:             kubesphere-logging-system/new-data-elasticsearch-logging-data-0
Reclaim Policy:    Retain
Access Modes:      RWO
VolumeMode:        Filesystem
Capacity:          20Gi
...
```

这是因为 PV 在 `spec.claimRef` 中仍然引用了已经被删除的 PVC：

```yaml
$ kubectl get pv pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e -o yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  ...
  name: pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e
  ...
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 20Gi
  claimRef:
    apiVersion: v1
    kind: PersistentVolumeClaim
    name: new-data-elasticsearch-logging-data-0
    namespace: kubesphere-logging-system
    resourceVersion: "657019"
    uid: f4e96f69-b3be-4afe-bb52-1e8e728ca55e
  ...
  persistentVolumeReclaimPolicy: Retain
  storageClassName: csi-qingcloud
  volumeMode: Filesystem
```

为了解决这个问题，可以直接通过命令 `kubectl edit pv <pv-name>` 编辑 PV，将 `claimRef` 的内容全部删除。然后再查看 PV 已经处于可用状态（Available）：

```bash
$ kubectl describe pv pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e
Name:              pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e
Labels:            <none>
Annotations:       pv.kubernetes.io/provisioned-by: disk.csi.qingcloud.com
Finalizers:        [kubernetes.io/pv-protection external-attacher/disk-csi-qingcloud-com]
StorageClass:      csi-qingcloud
Status:            Available
Claim:
Reclaim Policy:    Retain
Access Modes:      RWO
VolumeMode:        Filesystem
Capacity:          20Gi
```

最终我们需要创建与旧 PVC 同名的新 PVC，而且要尽可能保证与旧 PVC 的参数相同：

+ 新 PVC 的名字和旧 PVC 的名字相同；
+ `spec.volumeName` 指向新 PV；
+ 新 PVC 的 `metadata.annotations` 和 `metadata.labels` 和旧 PVC 保存相同，因为这些值可能会影响到应用部署（比如 Helm chart 等）。

最终 PVC 内容如下：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  labels:
    app: elasticsearch
    component: data
    release: elasticsearch-logging
    role: data
  name: data-elasticsearch-logging-data-0
  namespace: kubesphere-logging-system
spec:
  storageClassName: csi-qingcloud
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  volumeMode: Filesystem
  volumeName: pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e
```

在『存储卷声明』页面点击『创建』：

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171028955.png)

选择『编辑 YAML』，将上面的 YAML 内容复制粘贴进去，然后点击『创建』：

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171036258.png)

最终可以看到新的 PVC 和 PV 全部都是 Bound 状态：

```bash
$ kubectl -n kubesphere-logging-system get pvc data-elasticsearch-logging-data-0
NAME                                STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
data-elasticsearch-logging-data-0   Bound    pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e   20Gi       RWO            csi-qingcloud   64s

$ kubectl get pv pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                                         STORAGECLASS    REASON   AGE
pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e   20Gi       RWO            Retain           Bound    kubesphere-logging-system/data-elasticsearch-logging-data-0   csi-qingcloud            11h
```

## 再来一遍

到目前为止，我们只迁移了 `data-elasticsearch-logging-data-0` 的数据，对于 `data-elasticsearch-logging-data-1`，按照上面的步骤再重复一遍就行了，记得将 datacopy 中的 PVC 改为 `data-elasticsearch-logging-data-1` 和 `new-data-elasticsearch-logging-data-0`，其他地方的配置内容也要修改为新的。

## 恢复工作负载

现在所有的存储都迁移完成，PVC 名称保持不变，PV 使用的是新的存储。

```bash
$ kubectl get pv -A|grep elasticsearch-logging-data
pvc-0851350a-270e-4d4d-af8d-081132c1775b   20Gi       RWO            Retain           Released   kubesphere-logging-system/data-elasticsearch-logging-data-1        local-hostpath            40h
pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9   20Gi       RWO            Retain           Released   kubesphere-logging-system/data-elasticsearch-logging-data-0        local-hostpath            40h
pvc-d0acd2e7-ee1d-47cf-8506-69147fe25563   20Gi       RWO            Retain           Bound      kubesphere-logging-system/data-elasticsearch-logging-data-1        csi-qingcloud             9m53s
pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e   20Gi       RWO            Retain           Bound      kubesphere-logging-system/data-elasticsearch-logging-data-0        csi-qingcloud             11h

$ kubectl -n kubesphere-logging-system get pvc|grep elasticsearch-logging-data
data-elasticsearch-logging-data-0        Bound    pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e   20Gi       RWO            csi-qingcloud    27m
data-elasticsearch-logging-data-1        Bound    pvc-d0acd2e7-ee1d-47cf-8506-69147fe25563   20Gi       RWO            csi-qingcloud    3m49s
```

将工作负载的副本恢复到之前的数量：

```bash
$ kubectl -n kubesphere-logging-system scale sts elasticsearch-logging-data --replicas=2
statefulset.apps/elasticsearch-logging-data scaled

$ kubectl -n kubesphere-logging-system get pod -l app=elasticsearch,component=data
NAME                           READY   STATUS    RESTARTS   AGE
elasticsearch-logging-data-0   1/1     Running   0          4m12s
elasticsearch-logging-data-1   1/1     Running   0          3m42s
```

完美！

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171552496.png)

最后还有一点收尾工作，我们需要将所有新 PV 的回收策略重新设置为 `Delete`：

```bash
$ kubectl patch pv pvc-d0acd2e7-ee1d-47cf-8506-69147fe25563 -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}'
persistentvolume/pvc-d0acd2e7-ee1d-47cf-8506-69147fe25563 patched

$ kubectl patch pv pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}'
persistentvolume/pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e patched

$ kubectl get pv -A|grep elasticsearch-logging-data
pvc-0851350a-270e-4d4d-af8d-081132c1775b   20Gi       RWO            Retain           Released   kubesphere-logging-system/data-elasticsearch-logging-data-1        local-hostpath            40h
pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9   20Gi       RWO            Retain           Released   kubesphere-logging-system/data-elasticsearch-logging-data-0        local-hostpath            40h
pvc-d0acd2e7-ee1d-47cf-8506-69147fe25563   20Gi       RWO            Delete           Bound      kubesphere-logging-system/data-elasticsearch-logging-data-1        csi-qingcloud             15m
pvc-f4e96f69-b3be-4afe-bb52-1e8e728ca55e   20Gi       RWO            Delete           Bound      kubesphere-logging-system/data-elasticsearch-logging-data-0        csi-qingcloud             11h
```

最后的最后，就可以将旧 PV 全部删除了：

```bash
$ kubectl delete pv pvc-0851350a-270e-4d4d-af8d-081132c1775b
persistentvolume "pvc-0851350a-270e-4d4d-af8d-081132c1775b" deleted

$ kubectl delete pv pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9
persistentvolume "pvc-9aed3d1b-09a6-4fe3-8adc-9195a2bbb2b9" deleted
```

## 更简单的方案

上面的方案虽然完美解决了问题，但步骤比较繁琐，有没有更简洁的方法呢？

可以试试青云推出的[云原生备份容灾 SaaS 服务](https://kubesphere.cloud/self-service/disaster-recovery/)，无需部署、维护本地备份基础架构，即可轻松完成多云异构环境下数据的自由迁移，从而实现多地、按需的数据保护与应用的高可用。而且价格比较亲民，对白嫖党友好，**提供了 100GB 的免费存储**，迁移几个 PV 完全够用了。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171720715.jpg)

使用起来非常简单，先[注册账户](https://kubesphere.cloud/sign-up/)，然后导入 Kubernetes 集群。如果选择通过代理连接 Kubernetes 集群，需要执行红色方框内命令在 Kubernetes 集群中安装代理。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171729462.jpg)

然后新建托管仓库。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171735108.png)

接下来直接创建备份计划，选择**直接复制**。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171736564.png)

备份成功之后，将集群中的 PVC 和 PV 删除，并将工作负载的副本数缩减为 0。最后创建恢复计划，注意将源存储类型名称为 `local-hostpath` 的目标存储类型名称设置为你想迁移的存储，这样恢复后的 PV 使用的就是新的 StorageClass。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206171739581.png)

完了。

## 总结

本文介绍了如何将 Kubernetes 集群中现有 PV 的数据迁移到新的 PV，并创建同名的 PVC 来指向新的 PV，这样就完成了应用的数据迁移而不需要对应用的配置清单做任何更改。最后还介绍了如何通过云原生备份容灾 SaaS 服务来简化迁移过程。