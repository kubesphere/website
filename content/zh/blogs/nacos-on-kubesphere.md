---
title: '在 KubeSphere 中快速安装部署 Nacos '
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, Nacos '
description: '本文详细介绍了 Nacos 集群模式在基于 KubeSphere 部署的 K8s 集群上的安装部署方法。同时，介绍了 MySQL 在 K8s 上的安装部署方法。'
createTime: '2023-04-06'
author: '老 Z'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-nacos-cover.png'
---

> 作者：老 Z，中电信数智科技有限公司山东分公司运维架构师，云原生爱好者，目前专注于云原生运维，云原生领域技术栈涉及 Kubernetes、KubeSphere、DevOps、OpenStack、Ansible 等。

## 简介

Nacos 集群如何在 K8s 集群上部署？Nacos 依赖的 MySQL 数据库如何在 K8S 集群上部署？GitOps 在 K8s 集群上是一种什么体验？本文将带你全面了解上述问题。

> **演示服务器配置**

|      主机名      |      IP      | CPU  | 内存 | 系统盘 | 数据盘  |                 用途                  |
| :--------------: | :----------: | :--: | :--: | :----: | :-----: | :-----------------------------------: |
|  zdeops-master   | 192.168.9.9  |  2   |  4   |   40   |   200   |          Ansible 运维控制节点          |
| ks-k8s-master-0  | 192.168.9.91 |  4   |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker/Ceph |
| ks-k8s-master-1  | 192.168.9.92 |  4   |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker/Ceph |
| ks-k8s-master-2  | 192.168.9.93 |  4   |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker/Ceph |
| glusterfs-node-0 | 192.168.9.95 |  2   |  8   |   40   |   200   |               GlusterFS               |
| glusterfs-node-1 | 192.168.9.96 |  2   |  8   |   40   |   200   |               GlusterFS               |
| glusterfs-node-2 | 192.168.9.97 |  2   |  8   |   40   |   200   |               GlusterFS               |
|      harbor      | 192.168.9.89 |  2   |  8   |   40   |   200   |                Harbor                 |
|       合计       |      8       |  22  |  84  |  320   |  2200   |                                       |

> **演示环境涉及软件版本信息**

- 操作系统：**CentOS-7.9-x86_64**
- Ansible：**2.8.20**
- Harbor：**2.5.1**
- Nacos：**v2.1.0**
- MySQL：**5.7.38**

## 前提条件

### 准备离线镜像

此过程为可选项，离线内网环境可用，如果是直连互联网的场景，可以直接使用互联网的镜像。

在一台能同时访问互联网和内网 Harbor 仓库的服务器上进行下面的操作。

- 下载镜像

```shell
docker pull mysql:5.7.38
docker pull nacos/nacos-peer-finder-plugin:1.1
docker pull nacos/nacos-server:v2.1.0
```

- 重新打 tag

```shell
docker tag mysql:5.7.38 registry.zdevops.com.cn/library/mysql:5.7.38
docker tag nacos/nacos-peer-finder-plugin:1.1 registry.zdevops.com.cn/nacos/nacos-peer-finder-plugin:1.1
docker tag nacos/nacos-server:v2.1.0 registry.zdevops.com.cn/nacos/nacos-server:v2.1.0
```

- 推送到私有镜像仓库

```shell
# 需要提前在镜像仓库中创建 Harbor 项目
docker push registry.zdevops.com.cn/library/mysql:5.7.38
docker push registry.zdevops.com.cn/nacos/nacos-peer-finder-plugin:1.1
docker push registry.zdevops.com.cn/nacos/nacos-server:v2.1.0
```

- 清理临时镜像

```shell
docker rmi mysql:5.7.38
docker rmi nacos/nacos-peer-finder-plugin:1.1
docker rmi nacos/nacos-server:v2.1.0
docker rmi registry.zdevops.com.cn/library/mysql:5.7.38
docker rmi registry.zdevops.com.cn/nacos/nacos-peer-finder-plugin:1.1
docker rmi registry.zdevops.com.cn/nacos/nacos-server:v2.1.0
```

### 准备 Nacos 部署资源

- 官方资源配置清单

```shell
# 拉取官方的配置清单，各位参考着进行修改，本文不涉及修改过程
git clone https://github.com/nacos-group/nacos-k8s.git
```

- 初始化数据库文件

```shell
wget https://raw.githubusercontent.com/alibaba/nacos/develop/distribution/conf/nacos-mysql.sql
```

## 部署 MySQL

Nacos 需要使用 MySQL 存储配置数据，由于使用量不大，没有考虑高可用部署，直接在 K8s 上部署。也可以采用已有的 MySQL 数据库。

### 资源配置清单

- mysql-cm.yaml

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: nacos-mysql-config
  namespace: zdevops
data:
  custom.cnf: |-
    [mysqld]
    #performance setttings
    lock_wait_timeout = 3600
    open_files_limit    = 65535
    back_log = 1024
    max_connections = 1024
    max_connect_errors = 1000000
    table_open_cache = 1024
    table_definition_cache = 1024
    thread_stack = 512K
    sort_buffer_size = 4M
    join_buffer_size = 4M
    read_buffer_size = 8M
    read_rnd_buffer_size = 4M
    bulk_insert_buffer_size = 64M
    thread_cache_size = 768
    interactive_timeout = 600
    wait_timeout = 600
    tmp_table_size = 32M
    max_heap_table_size = 32M

```

- mysql-secret.yaml

```yaml
kind: Secret
apiVersion: v1
metadata:
  name: nacos-mysql-secret
  namespace: zdevops
data:
  MYSQL_ROOT_PASSWORD: UEA4OHcwcmQ=
  MYSQL_PASSWORD: UEA4OHcwcmQ=
type: Opaque

```

**MYSQL_ROOT_PASSWORD** 和 **MYSQL_PASSWORD** 是 MySQL 中 root 和 nacos 用户的密码。

密码需要使用 `echo -n "P@88w0rd" | base64` 加密的方式。

- mysql-sts.yaml

```yaml
---
kind: StatefulSet
apiVersion: apps/v1
metadata:
  name: nacos-mysql
  namespace: zdevops
  labels:
    app: nacos-mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nacos-mysql
  template:
    metadata:
      labels:
        app: nacos-mysql
    spec:
      volumes:
        - name: host-time
          hostPath:
            path: /etc/localtime
            type: ''
        - name: config
          configMap:
            name: nacos-mysql-config
            items:
              - key: custom.cnf
                path: custom.cnf
            defaultMode: 420
      containers:
        - name: nacos-mysql
          image: 'registry.zdevops.com.cn/library/mysql:5.7.38'
          ports:
            - name: tcp-3306
              containerPort: 3306
              protocol: TCP
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: nacos-mysql-secret
                  key: MYSQL_ROOT_PASSWORD
            - name: MYSQL_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: nacos-mysql-secret
                  key: MYSQL_PASSWORD
            - name: MYSQL_DATABASE
              value: "nacos"
            - name: MYSQL_USER
              value: "nacos" 
          resources:
            limits:
              cpu: '2'
              memory: 4000Mi
            requests:
              cpu: 100m
              memory: 500Mi
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
            - name: data
              mountPath: /var/lib/mysql
            - name: config
              mountPath: /etc/mysql/conf.d/custom.cnf
              subPath: custom.cnf
  volumeClaimTemplates:
    - metadata:
        name: data
        namespace: zdevops
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 5Gi
        storageClassName: glusterfs
  serviceName: mysql-headless

---
kind: Service
apiVersion: v1
metadata:
  name: nacos-mysql-headless
  namespace: zdevops
  labels:
    app: nacos-mysql
spec:
  ports:
    - name: tcp-3306
      protocol: TCP
      port: 3306
      targetPort: 3306
  selector:
    app: nacos-mysql
  clusterIP: None
  type: ClusterIP

```

**MYSQL_DATABASE** 和 **MYSQL_USER** 是 MySQL 初始化时创建的 Nacos 数据库名称和 Nacos 用户名称。

- mysql-external.yaml

```yaml
kind: Service
apiVersion: v1
metadata:
  name: nacos-mysql-external
  namespace: zdevops
  labels:
    app: nacos-mysql-external
spec:
  ports:
    - name: tcp-mysql-external
      protocol: TCP
      port: 3306
      targetPort: 3306
      nodePort: 31006
  selector:
    app: nacos-mysql
  type: NodePort

```

### GitOps

**在运维开发服务器上操作：**

```shell
# 创建新分支
[root@zdevops-master k8s-yaml]# git checkout -b main-nacos-062401 main
Switched to a new branch 'main-nacos-062401'

# 在已有代码仓库创建 nacos 目录
[root@zdevops-master k8s-yaml]# mkdir nacos

# 编辑资源配置清单
[root@zdevops-master k8s-yaml]# vi nacos/mysql-cm.yaml
[root@zdevops-master k8s-yaml]# vi nacos/mysql-secret.yaml
[root@zdevops-master k8s-yaml]# vi nacos/mysql-sts.yaml
[root@zdevops-master k8s-yaml]# vi nacos/mysql-external.yaml

# 提交 Git
[root@zdevops-master k8s-yaml]# git add nacos
[root@zdevops-master k8s-yaml]# git commit -am '添加 nacos mysql部署资源配置清单'

# 分支合并
[root@zdevops-master k8s-yaml]# git checkout main
Switched to branch 'main'
Your branch is up to date with 'origin/main'.

[root@zdevops-master k8s-yaml]# git merge main-nacos-062401
Updating e60e3e3..2d51a5a
Fast-forward
 nacos/mysql-cm.yaml       | 27 +++++++++++++++++++++++
 nacos/mysql-external.yaml | 17 ++++++++++++++
 nacos/mysql-secret.yaml   |  9 ++++++++
 nacos/mysql-sts.yaml      | 98 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 nodeport.md               |  2 +-
 5 files changed, 152 insertions(+), 1 deletion(-)
 create mode 100644 nacos/mysql-cm.yaml
 create mode 100644 nacos/mysql-external.yaml
 create mode 100644 nacos/mysql-secret.yaml
 create mode 100644 nacos/mysql-sts.yaml
 
 # 删除临时分支
[root@zdevops-master k8s-yaml]# git branch -d  main-nacos-062401

 # 推送到远程仓库 
 [root@zdevops-master k8s-yaml]# git push
```

### 部署资源

**在运维管理服务器上操作：**

- 更新镜像仓库代码

```shell
[root@zdevops-master k8s-yaml]# git pull
```

- 部署资源

```shell
[root@zdevops-master k8s-yaml]# kubectl apply -f nacos/mysql-cm.yaml
[root@zdevops-master k8s-yaml]# kubectl apply -f nacos/mysql-secret.yaml
[root@zdevops-master k8s-yaml]# kubectl apply -f nacos/mysql-sts.yaml
[root@zdevops-master k8s-yaml]# kubectl apply -f nacos/mysql-external.yaml
```

### 验证

- 查看资源状态

```shell
[root@zdevops-master k8s-yaml]# kubectl get cm,secrets,pvc,sts,pods -n zdevops -o wide
NAME                             DATA   AGE
configmap/nacos-mysql-config     1      3h10m

NAME                           TYPE                                  DATA   AGE
secret/nacos-mysql-secret      Opaque                                2      3h10m

NAME                                       STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE     VOLUMEMODE
persistentvolumeclaim/data-nacos-mysql-0   Bound    pvc-13bec5c5-33e2-46df-bcdc-dc216c17f88a   5Gi        RWO            glusterfs      3h10m   Filesystem

NAME                           READY   AGE     CONTAINERS    IMAGES
statefulset.apps/nacos-mysql   1/1     3h10m   nacos-mysql   registry.zdevops.com.cn/library/mysql:5.7.38

NAME                READY   STATUS    RESTARTS   AGE   IP               NODE              NOMINATED NODE   READINESS GATES
pod/nacos-mysql-0   1/1     Running   0          32m   10.233.116.189   ks-k8s-master-2   <none>           <none>
```

- MySQL 登录验证

```shell
# 进入 MySQL POD
[root@zdevops-master k8s-yaml]# kubectl exec -it nacos-mysql-0 -n zdevops -- /bin/bash

# 在 MySQL POD 内部以 root 用户连接 MySQL 服务器，并列出数据库
root@nacos-mysql-0:/# mysql -u root -pP@88w0rd
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 4
Server version: 5.7.38 MySQL Community Server (GPL)

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| nacos              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.01 sec)

mysql> quit
Bye

# 在 MySQL POD 内部以 nacos 用户连接 MySQL 服务器，并列出数据库
root@nacos-mysql-0:/# mysql -u nacos -pP@88w0rd
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 5.7.38 MySQL Community Server (GPL)

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| nacos              |
+--------------------+
2 rows in set (0.00 sec)

mysql> quit
Bye
```

### 导入 Nacos 初始化数据

本文采用将 SQL 文件复制到容器内部执行的方式导入数据。实际使用中，可以直接在集群外部使用 MySQL 客户端连接 MySQL 的 NodePort 管理数据库并导入数据。

- 获取初始化数据库文件

```shell
# 官方
wget https://raw.githubusercontent.com/alibaba/nacos/develop/distribution/conf/nacos-mysql.sql

# Gitee备用
# wget https://gitee.com/zdevops/k8s-yaml/raw/main/nacos/nacos-mysql.sql
```

- 将 SQL 文件复制到 MySQL 容器内部

```shell
# 拷贝文件
[root@zdevops-master k8s-yaml]# cd nacos
[root@zdevops-master nacos]# kubectl cp nacos-mysql.sql -n zdevops nacos-mysql-0:home/

# 确认文件成功拷贝
[root@zdevops-master nacos]# kubectl exec -it nacos-mysql-0 -n zdevops -- ls /home
```

- 登录容器内部，导入数据

```shell
# 进入 MySQL POD
[root@zdevops-master k8s-yaml]# kubectl exec -it nacos-mysql-0 -n zdevops -- /bin/bash

# 导入数据， 需要输入 nacos 用户的密码
root@nacos-mysql-0:/# mysql -u nacos -p nacos < /home/nacos-mysql.sql 
Enter password: 

```

## 集群模式 Nacos 部署

### 资源配置清单

- nacos-cm.yaml

```shell
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: nacos-config
  namespace: zdevops
data:
  mysql.host: "nacos-mysql-external.zdevops"
  mysql.db.name: "nacos"
  mysql.port: "3306"
  mysql.user: "nacos"
  mysql.password: "P@88w0rd"

```

- nacos-sts.yaml

```yaml
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: nacos
  namespace: zdevops
spec:
  serviceName: nacos-headless
  replicas: 3
  template:
    metadata:
      labels:
        app: nacos
      annotations:
        pod.alpha.kubernetes.io/initialized: "true"
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: "app"
                    operator: In
                    values:
                      - nacos
              topologyKey: "kubernetes.io/hostname"
      initContainers:
        - name: peer-finder-plugin-install
          image: registry.zdevops.com.cn/nacos/nacos-peer-finder-plugin:1.1
          imagePullPolicy: Always
          volumeMounts:
            - mountPath: /home/nacos/plugins/peer-finder
              name: data
              subPath: peer-finder
      containers:
        - name: nacos
          imagePullPolicy: Always
          image: registry.zdevops.com.cn/nacos/nacos-server:v2.1.0
          resources:
            limits:
              cpu: '2'
              memory: 4Gi
            requests:
              cpu: "100m"
              memory: "1Gi"
          ports:
            - containerPort: 8848
              name: client-port
            - containerPort: 9848
              name: client-rpc
            - containerPort: 9849
              name: raft-rpc
            - containerPort: 7848
              name: old-raft-rpc
          env:
            - name: NACOS_REPLICAS
              value: "3"
            - name: SERVICE_NAME
              value: "nacos-headless"
            - name: DOMAIN_NAME
              value: "cluster.local"
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
            - name: MYSQL_SERVICE_HOST
              valueFrom:
                configMapKeyRef:
                  name: nacos-config
                  key: mysql.host
            - name: MYSQL_SERVICE_DB_NAME
              valueFrom:
                configMapKeyRef:
                  name: nacos-config
                  key: mysql.db.name
            - name: MYSQL_SERVICE_PORT
              valueFrom:
                configMapKeyRef:
                  name: nacos-config
                  key: mysql.port
            - name: MYSQL_SERVICE_USER
              valueFrom:
                configMapKeyRef:
                  name: nacos-config
                  key: mysql.user
            - name: MYSQL_SERVICE_PASSWORD
              valueFrom:
                configMapKeyRef:
                  name: nacos-config
                  key: mysql.password
            - name: NACOS_SERVER_PORT
              value: "8848"
            - name: NACOS_APPLICATION_PORT
              value: "8848"
            - name: PREFER_HOST_MODE
              value: "hostname"
          volumeMounts:
            - name: data
              mountPath: /home/nacos/plugins/peer-finder
              subPath: peer-finder
            - name: data
              mountPath: /home/nacos/data
              subPath: data
            - name: data
              mountPath: /home/nacos/logs
              subPath: logs
  volumeClaimTemplates:
    - metadata:
        name: data
        namespace: zdevops
      spec:
        accessModes: [ "ReadWriteMany" ]
        storageClassName: "glusterfs"
        resources:
          requests:
            storage: 5Gi
  selector:
    matchLabels:
      app: nacos
---
apiVersion: v1
kind: Service
metadata:
  name: nacos-headless
  namespace: zdevops
  labels:
    app: nacos
  annotations:
    service.alpha.kubernetes.io/tolerate-unready-endpoints: "true"
spec:
  ports:
    - port: 8848
      name: server
      targetPort: 8848
    - port: 9848
      name: client-rpc
      targetPort: 9848
    - port: 9849
      name: raft-rpc
      targetPort: 9849
    ## 兼容1.4.x版本的选举端口
    - port: 7848
      name: old-raft-rpc
      targetPort: 7848
  clusterIP: None
  selector:
    app: nacos

```

**DOMAIN_NAME** 要改成实际的 K8s 的集群域名。

- nacos-external.yaml

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: nacos-external
  namespace: zdevops
  labels:
    app: external
spec:
  type: NodePort
  ports:
    - name: tcp-nacos-external
      protocol: TCP
      port: 8848
      targetPort: 8848
      nodePort: 31848
  selector:
    app: nacos

```

### GitOps

**在运维开发服务器上操作：**

```shell
# 创建新分支
[root@zdevops-master k8s-yaml]# git checkout -b main-nacos-062402 main
Switched to a new branch 'main-nacos-062402'

# 编辑资源配置清单
[root@zdevops-master k8s-yaml]# vi nacos/nacos-cm.yaml
[root@zdevops-master k8s-yaml]# vi nacos/nacos-sts.yaml
[root@zdevops-master k8s-yaml]# vi nacos/nacos-external.yaml

# 提交 Git
[root@zdevops-master k8s-yaml]# git add nacos
[root@zdevops-master k8s-yaml]# git commit -am '添加nacos部署资源配置清单'

# 分支合并
[root@zdevops-master k8s-yaml]# git checkout main
[root@zdevops-master k8s-yaml]# git merge main-nacos-062402

# 删除临时分支
[root@zdevops-master k8s-yaml]# git branch -d  main-nacos-062402
 
 # 推送到远程仓库 
 [root@zdevops-master k8s-yaml]# git push
```

### 部署资源

**在运维管理服务器上操作**

- 更新镜像仓库代码

```shell
[root@zdevops-master k8s-yaml]# git pull
```

- 部署资源

```shell
[root@zdevops-master k8s-yaml]# kubectl apply -f nacos/nacos-cm.yaml
[root@zdevops-master k8s-yaml]# kubectl apply -f nacos/nacos-sts.yaml
[root@zdevops-master k8s-yaml]# kubectl apply -f nacos/nacos-external.yaml
```

### 验证

- 资源验证

```shell
# sts
[root@zdevops-master k8s-yaml]# kubectl get sts -n zdevops -o wide
NAME          READY   AGE     CONTAINERS    IMAGES
nacos         3/3     3h13m   nacos         registry.zdevops.com.cn/nacos/nacos-server:v2.1.0
nacos-mysql   1/1     26h     nacos-mysql   registry.zdevops.com.cn/library/mysql:5.7.38

# pods
[root@zdevops-master k8s-yaml]# kubectl get pods -n zdevops -o wide
NAME            READY   STATUS    RESTARTS   AGE     IP               NODE              NOMINATED NODE   READINESS GATES
nacos-0         1/1     Running   0          3h12m   10.233.116.220   ks-k8s-master-2   <none>           <none>
nacos-1         1/1     Running   0          3h12m   10.233.117.101   ks-k8s-master-0   <none>           <none>
nacos-2         1/1     Running   0          3h12m   10.233.87.14     ks-k8s-master-1   <none>           <none>
nacos-mysql-0   1/1     Running   0          23h     10.233.116.189   ks-k8s-master-2   <none>           <none>

# svc
[root@zdevops-master k8s-yaml]# kubectl get svc -n zdevops -o wide
NAME                                                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                               AGE     SELECTOR
glusterfs-dynamic-13bec5c5-33e2-46df-bcdc-dc216c17f88a   ClusterIP   10.233.48.177   <none>        1/TCP                                 26h     <none>
glusterfs-dynamic-39795af9-8307-408c-ba2a-d0648f658f1b   ClusterIP   10.233.31.22    <none>        1/TCP                                 3h12m   <none>
glusterfs-dynamic-cc4be907-9ef3-4a69-92d7-1875f7051e36   ClusterIP   10.233.34.82    <none>        1/TCP                                 3h12m   <none>
glusterfs-dynamic-e73324a8-3f97-4697-a7dc-67576863f21a   ClusterIP   10.233.27.2     <none>        1/TCP                                 3h12m   <none>
nacos-external                                           NodePort    10.233.63.221   <none>        8848:30848/TCP                        3h12m   app=nacos
nacos-headless                                           ClusterIP   None            <none>        8848/TCP,9848/TCP,9849/TCP,7848/TCP   3h12m   app=nacos
nacos-mysql-external                                     NodePort    10.233.12.228   <none>        3306:31006/TCP                        23h     app=nacos-mysql
nacos-mysql-headless                                     ClusterIP   None            <none>        3306/TCP                              26h     app=nacos-mysql
```

- 登录 Nacos 管理控制台

在浏览器中输入 **http:// 任意节点 IP:30848**，输入默认的用户名和密码，**nacos**。

![kubesphere-nacos-0](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/kubesphere-nacos-0.png)

![kubesphere-nacos-1](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/kubesphere-nacos-1.png)

![kubesphere-nacos-2](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/kubesphere-nacos-2.png)

### 初始化配置

- 修改默认密码

![kubesphere-nacos-3](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/kubesphere-nacos-3.png)

![kubesphere-nacos-4](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/kubesphere-nacos-4.png)

- 后续配置



## 总结

本文详细介绍了 Nacos 集群模式在基于 KubeSphere 部署的 K8s 集群上的安装部署方法。同时，介绍了 MySQL 在 K8s 上的安装部署方法。

本文的配置方案可直接用于开发测试环境，对于生产环境也有一定的借鉴意义。


