---
title: 'Curve 分布式存储在 KubeSphere 中的实践'
tag: 'Curve'
keywords: 'KubeSphere, Kubernetes, Curve, CSI, CurveFS, Curveadm'
description: '本文介绍了如何在 KubeSphere 中集成并使用 Curve'
createTime: '2022-12-29'
author: '尹珉'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202301051303579.jpg'
---

## Curve 介绍

Curve 是网易开发的现代存储系统，目前支持文件存储 (CurveFS) 和块存储 (CurveBS)。现在它作为一个沙盒项目托管在 CNCF。
Curve 是一个高性能、轻量级操作、本地云的开源分布式存储系统。Curve 可以应用于 : 

1) 主流云本地基础设施平台 OpenStack 和 Kubernetes; 
2) 云本地数据库的高性能存储 ; 
3) 使用与 s3 兼容的对象存储作为数据存储的云存储中间件。

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051306995.png)

## 实现效果
通过部署 CurveFS 集群、Helm 部署 Curve-csi 插件创建 SC 来达到声明 PVC 时自动创建 PV 的效果

## 开始部署

K8s 环境可以通过安装 KubeSphere 进行部署 , 我使用的是高可用方案。
在公有云上安装 KubeSphere 参考文档：[多节点安装](https://v3-1.docs.kubesphere.io/zh/docs/installing-on-linux/public-cloud/install-kubesphere-on-huaweicloud-ecs/ "多节点安装")

```bash
[root@k8s-master ~]# kubectl get node
NAME         STATUS   ROLES                  AGE   VERSION
k8s-master   Ready    control-plane,master   79d   v1.23.8
k8s-node1    Ready    worker                 79d   v1.23.8
k8s-node2    Ready    worker                 79d   v1.23.8
k8s-node3    Ready    worker                 79d   v1.23.8
```

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051306259.png)

## 使用 Curveadm 工具部署 CurveFS

CurveAdm 是 Curve 团队为提高系统易用性而设计的工具，其主要用于快速部署和运维 CurveBS/CurveFS 集群。

硬件环境需求：

|  宿主机   | 系统    | IP 地址    |    
| --- | --- | --- |
|   Curve（控制节点）  |   Centos7.9  |  192.168.149.169   |
|    Curve1（服务节点） |   Centos7.9  |   192.168.149.177  |

每台服务器都需要安装 docker：

```bash
[root@curve ~]# yum install -y yum-utils
[root@curve ~]# yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
[root@curve ~]# yum install docker-ce docker-ce-cli containerd.io
[root@curve ~]# systemctl start docker
```
控制节点安装 Curveadm：

```bash
[root@curve ~]# bash -c "$(curl -fsSL https://curveadm.nos-eastchina1.126.net/script/install.sh)"
```

### 主机管理

主机模块用来统一管理用户主机，以减少用户在各配置文件中重复填写主机 SSH 连接相关配置。（此操作在控制节点进行）

准备主机列表：

```yaml
global:
  user: root
  ssh_port: 22
  private_key_file: /root/.ssh/id_rsa

hosts:
  - host: curve1
    hostname: 192.168.149.169
  - host: curve
    hostname: 192.168.149.177
    forward_agent: true
    become_user: root
    labels:
      - client
```
说明：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051307115.png)

创建 SSH 秘钥：
```bash
[root@curve ~]# ssh-keygen #一路回车即可
[root@curve ~]# ssh-copy-id -i root@192.168.149.177
#发送私钥到服务节点
```
导入主机列表：
```bash
[root@curve ~]#curveadm hosts commit hosts.yaml
```
查看主机列表：
```bash
[root@curve ~]# curveadm hosts ls
```

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051307886.png)

### CuveFS 集群拓扑

集群拓扑文件用来描述哪些服务部署在哪些机器上，以及每一个服务实例的配置。
（目前集群拓扑分为单机部署、多机部署本教程只演示单机部署）

**准备单机部署文件：**

说明：此文件只需要修改一处，target 的值改成服务节点的 hostname，其他全默认不需要修改。
```yaml
kind: curvefs
global:
  report_usage: true
  data_dir: ${home}/curvefs/data/${service_role}${service_host_sequence}
  log_dir: ${home}/curvefs/logs/${service_role}${service_host_sequence}
  container_image: opencurvedocker/curvefs:latest
  variable:
    home: /tmp
    target: curve1 #这里需要改成服务节点的hostname

etcd_services:
  config:
    listen.ip: ${service_host}
    listen.port: 2380${service_host_sequence}         # 23800,23801,23802
    listen.client_port: 2379${service_host_sequence}  # 23790,23791,23792
  deploy:
    - host: ${target}
    - host: ${target}
    - host: ${target}

mds_services:
  config:
    listen.ip: ${service_host}
    listen.port: 670${service_host_sequence}        # 6700,6701,6702
    listen.dummy_port: 770${service_host_sequence}  # 7700,7701,7702
  deploy:
    - host: ${target}
    - host: ${target}
    - host: ${target}

metaserver_services:
  config:
    listen.ip: ${service_host}
    listen.port: 680${service_host_sequence}           # 6800,6801,6802
    listen.external_port: 780${service_host_sequence}  # 7800,7801,7802
    global.enable_external_server: true
    metaserver.loglevel: 0
    # whether commit filesystem caches of raft wal to disk.
    # it should be true iff you wants data NEVER lost,
    # of course, it will leads some performance skew.
    braft.raft_sync: false
  deploy:
    - host: ${target}
    - host: ${target}
    - host: ${target}
      config:
        metaserver.loglevel: 0
```

### 部署预检

预检模块用来提前检测那些可能导致用户部署失败的因素，以提高用户部署的成功率。

添加自定义命名集群，并指定拓扑文件：

```bash
[root@curve ~]# curveadm cluster add curve -f topology.yaml
```

切换 curve 集群为当前管理集群：

```bash
 [root@curve ~]# curveadm cluster checkout curve                   
```

执行预检：

```bash
[root@curve ~]# curveadm precheck
```

查看执行结果：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051307505.png)

### 使用 CurveAdm 部署 CurveFS 集群

```bash
[root@curve ~]# curveadm deploy
如果部署成功，将会输出类似 Cluster 'curve' successfully deployed ^_^. 的字样
```

查看集群运行情况：

```bash
[root@curve ~]#curveadm status
```
```bash
[root@localhost curve]# curveadm status
Get Service Status: [OK]  

cluster name      : curve
cluster kind      : curvefs
cluster mds addr  : 192.168.149.177:6700,192.168.149.177:6701,192.168.149.177:6702
cluster mds leader: 192.168.149.177:6701 / f339fd5e7f3e

Id            Role        Host    Replicas  Container Id  Status       
--            ----        ----    --------  ------------  ------       
724fe98710d0  etcd        curve1  1/1       e3d86591f2dc  Up 50 seconds
d5b08fe05a81  etcd        curve1  1/1       da7932929055  Up 50 seconds
963664e175dd  etcd        curve1  1/1       134d4445542a  Up 50 seconds
83fa9fc656af  mds         curve1  1/1       1f7429cd9822  Up 48 seconds
f339fd5e7f3e  mds         curve1  1/1       2983a89adecf  Up 49 seconds
3d7201165a57  mds         curve1  1/1       b6135408346b  Up 49 seconds
875d7fd126f2  metaserver  curve1  1/1       1983afeed590  Up 44 seconds
9d5fb31b2bd9  metaserver  curve1  1/1       fe920d6b7343  Up 44 seconds
1344d99579c4  metaserver  curve1  1/1       875cb4e5c14d  Up 44 seconds
[root@localhost curve]# curveadm status
Get Service Status: [OK]  

cluster name      : curve
cluster kind      : curvefs
cluster mds addr  : 192.168.149.177:6700,192.168.149.177:6701,192.168.149.177:6702
cluster mds leader: 192.168.149.177:6701 / f339fd5e7f3e

Id            Role        Host    Replicas  Container Id  Status    
--            ----        ----    --------  ------------  ------    
724fe98710d0  etcd        curve1  1/1       e3d86591f2dc  Up 2 hours
d5b08fe05a81  etcd        curve1  1/1       da7932929055  Up 2 hours
963664e175dd  etcd        curve1  1/1       134d4445542a  Up 2 hours
83fa9fc656af  mds         curve1  1/1       1f7429cd9822  Up 2 hours
f339fd5e7f3e  mds         curve1  1/1       2983a89adecf  Up 2 hours
3d7201165a57  mds         curve1  1/1       b6135408346b  Up 2 hours
875d7fd126f2  metaserver  curve1  1/1       1983afeed590  Up 2 hours
9d5fb31b2bd9  metaserver  curve1  1/1       fe920d6b7343  Up 2 hours
1344d99579c4  metaserver  curve1  1/1       875cb4e5c14d  Up 2 hours
```

## KubeSphere 平台部署 minio

### 添加 minio 应用仓库

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051307219.png)

添加仓库地址：`charts.min.io/`。

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051308903.png)

### 从应用模板创建 minio 服务

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051308194.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051308585.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051309686.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051309273.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051309077.png)

自定义 root 账号和密码：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051309897.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051309839.png)

访问 minio 界面并设置：

> 说明：登录的 URL 是集群宿主机的 IP+NodePort 端口，可以在 service 中查看对应端口号

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051309769.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051310306.png)

点击新建 Bucket：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051310833.png)

自定义 Bucket 名称：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051310955.png)

创建 Policies：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051310707.png)

自定义 Policy Name：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051310551.png)

创建规则：

> 说明 : 此规则是全局 Bucket 都可以访问，生产环境不建议这么配置

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:GetBucketLocation",
                "s3:GetObject",
                "s3:ListAllMyBuckets",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::*"
            ]
        }
    ]
}
```
创建 Users：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051310622.png)

创建 AKSK：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051311191.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051311115.png)

自定义账号名称并勾选刚才设置好的规则（也可以全选）：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051311028.png)

创建 Group：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051311460.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051311262.png)

## KubeSphere 平台部署 Cruvefs-csi 插件

创建应用：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051311316.png)

选择应用商店：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051311460.png)

选择 Curvefs-csi 应用进行安装：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051312493.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051312267.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051312586.png)

填写 parameters 信息。字段说明 :

1. mdsAddr 地址可以通过 Curveadm status 输出后查看
2. s3Endpoint 可以通过 K8s 集群的 service 里查看到（要填写 minio 服务对应的 NodePort，不要填写 console 的 Nodeport）
3. AKSK 可以通过刚才 minio 上创建时保存的查看
4. s3Bucket 可以通过刚才创建的 Bucket 查看

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051312494.png)

## 通过 Curve-sc 创建 PV 和 PVC 进行挂载

创建持久卷声明：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051312574.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051312664.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051313628.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051313392.png)

创建工作负载使用存储卷：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051313114.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051313216.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051313953.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051313981.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051314176.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051314987.png)

进入容器终端：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051314597.png)

切换目录到 /data 并写入测试数据：

```bash
cd /data
mkdir curve
echo 1111 > curve.txt
```

验证查看 minio 数据：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301051314230.png)