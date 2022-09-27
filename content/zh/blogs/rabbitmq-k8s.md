---
title: '在 Kubernetes 上部署 RabbitMQ'
tag: 'KubeSphere, Kubernetes, RabbitMQL'
keywords: 'KubeSphere, Kubernetes, RabbitMQ'
description: 'RabbitMQ 单节点安装部署和 RabbitMQ 集群安装部署实战。'
createTime: '2022-09-07'
author: '张延英'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/rabbitmq-k8s-cover.png'
---

## 前言


> **知识点**

- 定级：**入门级**
- RabbitMQ 单节点安装部署
- RabbitMQ 集群安装部署
- GitOps 运维思想

> **演示服务器配置**

|     主机名      |      IP      | CPU  | 内存 | 系统盘 | 数据盘  |                 用途                  |
| :-------------: | :----------: | :--: | :--: | :----: | :-----: | :-----------------------------------: |
|  zdeops-master  | 192.168.9.9  |  2   |  4   |   40   |   200   |         Ansible 运维控制节点          |
| ks-k8s-master-0 | 192.168.9.91 |  4   |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker/Ceph |
| ks-k8s-master-1 | 192.168.9.92 |  4   |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker/Ceph |
| ks-k8s-master-2 | 192.168.9.93 |  4   |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker/Ceph |
| storage-node-0  | 192.168.9.95 |  2   |  8   |   40   | 200+200 |        ElasticSearch/GlusterFS        |
| storage-node-0  | 192.168.9.96 |  2   |  8   |   40   | 200+200 |        ElasticSearch/GlusterFS        |
| storage-node-0  | 192.168.9.97 |  2   |  8   |   40   | 200+200 |        ElasticSearch/GlusterFS        |
|     harbor      | 192.168.9.89 |  2   |  8   |   40   |   200   |                Harbor                 |
|      合计       |      8       |  22  |  84  |  320   |  2800   |                                       |

> **演示环境涉及软件版本信息**

- 操作系统：**CentOS-7.9-x86_64**
- Ansible：**2.8.20**
- KubeSphere：**3.3.0**
- Kubernetes：**v1.24.1**
- Rook：**v1.9.7**
- Ceph： **v16.2.9**
- GlusterFS：**9.5.1**
- ElasticSearch：**7.17.5**
- Harbor：**2.5.1**
- RabbitMQ：**3.9.22**
- RabbitMQ Cluster Operator：**1.14.0**

## 简介

RabbitMQ 单节点如何在 K8s 集群上部署？RabbitMQ 集群如何在 K8s 集群上部署？60分钟带你实战入门。

## 单节点 RabbitMQ 部署

### 思路梳理

- StatefulSet
- Headless Service：内部服务用
- External Service：外部管理用
- Secrets：管理用户名和密码
- Image：DockerHub 官方提供的 rabbitmq:3.9.22-management(带 management 插件)

### 准备离线镜像

此过程为可选项，离线内网环境可用，如果不配置内网镜像，后续的资源配置清单中注意更改容器的 image 为默认值。

在一台能同时访问互联网和内网 Harbor 仓库的服务器上进行下面的操作。

- 下载镜像

```shell
docker pull rabbitmq:3.9.22-management
```

- 重新打 tag

```shell
docker tag rabbitmq:3.9.22-management registry.zdevops.com.cn/library/rabbitmq:3.9.22-management
```

- 推送到私有镜像仓库

```shell
docker push registry.zdevops.com.cn/library/rabbitmq:3.9.22-management
```

- 清理临时镜像

```shell
docker rmi rabbitmq:3.9.22-management
docker rmi registry.zdevops.com.cn/library/rabbitmq:3.9.22-management
```

### 资源配置清单

- **rabbitmq-secret.yaml**

```yaml
---
kind: Secret
apiVersion: v1
metadata:
  name: rabbitmq-secret
  namespace: zdevops
data:
  pass: UEA4OHcwcmQ=
  user: YWRtaW4=
type: Opaque
```

- **rabbitmq-sts.yaml**

```yaml
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: rabbitmq
  namespace: zdevops
  labels:
    app: rabbitmq
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rabbitmq
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: rabbitmq
    spec:
      volumes:
        - name: host-time
          hostPath:
            path: /etc/localtime
            type: ''
      containers:
        - name: rabbitmq
          image: 'registry.zdevops.com.cn/library/rabbitmq:3.9.22-management'
          ports:
            - name: tcp-5672
              containerPort: 5672
              protocol: TCP
            - name: http-15672
              containerPort: 15672
              protocol: TCP
          env:
            - name: RABBITMQ_DEFAULT_USER
              valueFrom:
                secretKeyRef:
                  name: rabbitmq-secret
                  key: user
            - name: RABBITMQ_DEFAULT_PASS
              valueFrom:
                secretKeyRef:
                  name: rabbitmq-secret
                  key: pass
          resources:
            limits:
              cpu: '2'
              memory: 4000Mi
            requests:
              cpu: 100m
              memory: 500Mi
          volumeMounts:
            - name: host-time
              readOnly: true
              mountPath: /etc/localtime
  serviceName: rabbitmq-headless

---
apiVersion: v1
kind: Service
metadata:
  name: rabbitmq-headless
  namespace: zdevops
  labels:
    app: rabbitmq
spec:
  ports:
    - name: tcp-rabbitmq-5672
      protocol: TCP
      port: 5672
      targetPort: 5672
  selector:
    app: rabbitmq
  clusterIP: None
  type: ClusterIP
```

- **rabbitmq-external.yaml**

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: rabbitmq-external
  namespace: zdevops
  labels:
    app: rabbitmq-external
spec:
  ports:
    - name: http-rabbitmq-external
      protocol: TCP
      port: 15672
      targetPort: 15672
      nodePort: 31672
  selector:
    app: rabbitmq
  type: NodePort
```

### GitOps

**在运维开发服务器上操作**

```shell
# 在已有代码仓库创建 rabbitmq/single 目录
[root@zdevops-master k8s-yaml]# mkdir -p rabbitmq/single

# 编辑资源配置清单
[root@zdevops-master k8s-yaml]# vi rabbitmq/single/rabbitmq-secret.yaml
[root@zdevops-master k8s-yaml]# vi rabbitmq/single/rabbitmq-sts.yaml
[root@zdevops-master k8s-yaml]# vi rabbitmq/single/rabbitmq-external.yaml

# 提交 Git
[root@zdevops-master k8s-yaml]# git add rabbitmq
[root@zdevops-master k8s-yaml]# git commit -am '添加rabbitmq 单节点资源配置清单'
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
[root@zdevops-master k8s-yaml]# kubectl apply -f rabbitmq/single/
```

### 验证

- Secret

```shell
[root@zdevops-master k8s-yaml]# kubectl get secret -n zdevops
NAME              TYPE     DATA   AGE
rabbitmq-secret   Opaque   2      8s
```

- StatefulSet

```shell
[root@zdevops-master k8s-yaml]# kubectl get sts -o wide -n zdevops
NAME       READY   AGE   CONTAINERS   IMAGES
rabbitmq   1/1     25s   rabbitmq     registry.zdevops.com.cn/library/rabbitmq:3.9.22-management
```

- Pods

```shell
[root@zdevops-master k8s-yaml]# kubectl get pods -o wide -n zdevops
NAME         READY   STATUS    RESTARTS   AGE   IP             NODE              NOMINATED NODE   READINESS GATES
rabbitmq-0   1/1     Running   0          26s   10.233.87.13   ks-k8s-master-1   <none>           <none>
```

- Service

```shell
[root@zdevops-master k8s-yaml]# kubectl get svc -o wide -n zdevops
NAME                TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)           AGE   SELECTOR
rabbitmq-external   NodePort    10.233.4.224   <none>        15672:31672/TCP   36s   app=rabbitmq
rabbitmq-headless   ClusterIP   None           <none>        5672/TCP          36s   app=rabbitmq
```

- 图形化管理界面

![rabbitmq-management](https://znotes-1258881081.cos.ap-beijing.myqcloud.com//rabbitmq-management.png)

### 清理资源

- 清理 StatefulSet

```shell
[root@zdevops-master k8s-yaml]# kubectl delete sts rabbitmq -n zdevops
```

- 清理服务

```shell
[root@zdevops-master k8s-yaml]# kubectl delete svc rabbitmq-external rabbitmq-headless -n zdevops
```

## 集群模式 RabbitMQ 部署

### 思路梳理

使用官方提供的 **RabbitMQ Cluster Operator for Kubernetes。**

Open source [RabbitMQ Cluster Kubernetes Operator](https://rabbitmq.com/kubernetes/operator/operator-overview.html) by VMware。

### 官方文档快速部署

官方提供了快速部署的例子，只需要两步，这里我们仅作参考，后面我们参考内网离线镜像部署的方案。

- 部署 RabbitMQ Cluster Operator

```shell
kubectl apply -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml
```

- 部署 RabbitMQ Cluster

```shell
kubectl apply -f https://raw.githubusercontent.com/rabbitmq/cluster-operator/main/docs/examples/hello-world/rabbitmq.yaml
```

### 准备离线镜像

此过程为可选项，离线内网环境可用，如果不配置内网镜像，后续的资源配置清单中注意更改容器的 image 为默认值。

在一台能同时访问互联网和内网 Harbor 仓库的服务器上进行下面的操作。

- 在 Harbor 中创建项目

```shell
curl -u "admin:Harbor12345" -X POST -H "Content-Type: application/json" https://registry.zdevops.com.cn/api/v2.0/projects -d '{ "project_name": "rabbitmqoperator", "public": true}'
```

- 下载镜像

```shell
docker pull rabbitmqoperator/cluster-operator:1.14.0
```

- 重新打 tag

```shell
docker tag rabbitmqoperator/cluster-operator:1.14.0 registry.zdevops.com.cn/rabbitmqoperator/cluster-operator:1.14.0
```

- 推送到私有镜像仓库

```shell
docker push registry.zdevops.com.cn/rabbitmqoperator/cluster-operator:1.14.0
```

- 清理临时镜像

```shell
docker rmi rabbitmqoperator/cluster-operator:1.14.0
docker rmi registry.zdevops.com.cn/rabbitmqoperator/cluster-operator:1.14.0
```

### 资源配置清单

- 通过官网获取 RabbitMQ Cluster Operator 部署资源配置清单「cluster-operator.yml」

```shell
wget https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml
```

- 修改 RabbitMQ Cluster Operator image 为内网镜像

```shell
sed -i 's#rabbitmqoperator#registry.zdevops.com.cn/rabbitmqoperator#g' cluster-operator.yml
```

- RabbitMQ Cluster 部署资源清单「rabbitmq-cluster.yaml」

```shell
apiVersion: rabbitmq.com/v1beta1
kind: RabbitmqCluster
metadata:
  namespace: zdevops
  name: rabbitmq-cluster
  labels:
    app: rabbitmq-cluster
spec:
  replicas: 3
  image: registry.zdevops.com.cn/library/rabbitmq:3.9.22-management
  resources:
    limits:
      cpu: 2
      memory: 4Gi
    requests:
      cpu: 100m
      memory: 500Mi
  rabbitmq:
    additionalConfig: |
      default_user=admin
      default_pass=P@88w0rd
```

> 更多配置参数和配置示例，请参考 [官方文档](https://www.rabbitmq.com/kubernetes/operator/using-operator.html)

- 管理页面的外部访问服务 **rabbitmq-cluster-external.yaml**

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: rabbitmq-cluster-external
  namespace: zdevops
  labels:
    app: rabbitmq-cluster-external
spec:
  ports:
    - name: management
      protocol: TCP
      port: 15672
      targetPort: 15672
      nodePort: 31672
  selector:
    app.kubernetes.io/name: rabbitmq-cluster
  type: NodePort
```

### GitOps

**在运维开发服务器上操作**

```shell
# 在已有代码仓库创建 rabbitmq/cluster 目录
[root@zdevops-master k8s-yaml]# mkdir -p rabbitmq/cluster

# 编辑资源配置清单
[root@zdevops-master k8s-yaml]# vi rabbitmq/cluster/cluster-operator.yml
[root@zdevops-master k8s-yaml]# vi rabbitmq/cluster/rabbitmq-cluster.yaml
[root@zdevops-master k8s-yaml]# vi rabbitmq/cluster/rabbitmq-cluster-external.yaml

# 提交 Git
[root@zdevops-master k8s-yaml]# git add rabbitmq/cluster
[root@zdevops-master k8s-yaml]# git commit -am '添加 rabbitmq 集群模式部署资源配置清单'
[root@zdevops-master k8s-yaml]# git push
```

### 部署资源

**在运维管理服务器上操作**

- `更新镜像仓库代码

```shell
[root@zdevops-master k8s-yaml]# git pull
```

- 部署 RabbitMQ Cluster Operator

```shell
[root@zdevops-master k8s-yaml]# kubectl apply -f rabbitmq/cluster/cluster-operator.yml
```

- 部署 RabbitMQ Cluster

```shell
[root@zdevops-master k8s-yaml]# kubectl apply -f rabbitmq/cluster/rabbitmq-cluster.yaml
```

- 部署管理页面外部访问服务

```shell
[root@zdevops-master k8s-yaml]# kubectl apply -f rabbitmq/cluster/rabbitmq-cluster-external.yaml
```

### 验证

- RabbitMQ Cluster Operator Deployment

```shell
[root@zdevops-master k8s-yaml]# kubectl get deployments -n rabbitmq-system -o wide
NAME                        READY   UP-TO-DATE   AVAILABLE   AGE    CONTAINERS   IMAGES                                                             SELECTOR
rabbitmq-cluster-operator   1/1     1            1           107m   operator     registry.zdevops.com.cn/rabbitmqoperator/cluster-operator:1.14.0   app.kubernetes.io/name=rabbitmq-cluster-operator
```

- RabbitmqClusters

```shell
[root@zdevops-master k8s-yaml]# kubectl get rabbitmqclusters -n zdevops
NAME               ALLREPLICASREADY   RECONCILESUCCESS   AGE
rabbitmq-cluster   False              Unknown            23s
```

- StatefulSet

```shell
[root@zdevops-master k8s-yaml]# kubectl get sts -o wide -n zdevops
NAME                      READY   AGE   CONTAINERS   IMAGES
rabbitmq-cluster-server   3/3     74s   rabbitmq     registry.zdevops.com.cn/library/rabbitmq:3.9.22-management
```

- Pods

```shell
[root@zdevops-master k8s-yaml]# kubectl get pods -o wide -n zdevops
NAME                        READY   STATUS    RESTARTS   AGE   IP              NODE              NOMINATED NODE   READINESS GATES
rabbitmq-cluster-server-0   1/1     Running   0          84s   10.233.116.26   ks-k8s-master-2   <none>           <none>
rabbitmq-cluster-server-1   1/1     Running   0          83s   10.233.117.28   ks-k8s-master-0   <none>           <none>
rabbitmq-cluster-server-2   1/1     Running   0          82s   10.233.87.31    ks-k8s-master-1   <none>           <none>
```

- Services

```shell
[root@zdevops-master k8s-yaml]# kubectl get svc -n zdevops -o wide
NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                        AGE    SELECTOR
rabbitmq-cluster            ClusterIP   10.233.56.153   <none>        15692/TCP,5672/TCP,15672/TCP   107s   app.kubernetes.io/name=rabbitmq-cluster
rabbitmq-cluster-external   NodePort    10.233.63.84    <none>        15672:31672/TCP                74m    app.kubernetes.io/name=rabbitmq-cluster
rabbitmq-cluster-nodes      ClusterIP   None            <none>        4369/TCP,25672/TCP             107s   app.kubernetes.io/name=rabbitmq-cluster
```

- 图形化管理界面

![rabbitmq-management-cluster](https://znotes-1258881081.cos.ap-beijing.myqcloud.com//rabbitmq-management-cluster.png)

> **从管理界面中可以看到一个三节点的集群**

### 清理资源

- 清理 RabbitmqClusters

```shell
[root@zdevops-master k8s-yaml]# kubectl delete rabbitmqclusters rabbitmq-cluster -n zdevops
```

- 清理管理页面外部服务

```shell
[root@zdevops-master k8s-yaml]# kubectl delete svc rabbitmq-cluster-external -n zdevops
```

## 结束语

本系列文档是我在云原生技术领域的学习和运维实践的手记，**用输出倒逼输入**是一种高效的学习方法，能够快速积累经验和提高技术，只有把学到的知识写出来并能够让其他人理解，才能说明真正掌握了这项知识。

> **本系列文档内容涵盖 (但不限于) 以下技术领域：**

- **KubeSphere**
- **Kubernetes**
- **Ansible**
- **自动化运维**
- **CNCF 技术栈**

**如果你喜欢本文，请分享给你的小伙伴！**

> **Get 文档**

- Github： https://github.com/devops/z-notes
- Gitee： https://gitee.com/zdevops/z-notes
- 知乎： https://www.zhihu.com/people/zdevops/

> **Get 代码**

- Github： https://github.com/devops/ansible-zdevops
- Gitee： https://gitee.com/zdevops/ansible-zdevops

> **Get 视频 B 站**

- [老 Z 手记](https://space.bilibili.com/1039301316) https://space.bilibili.com/1039301316

