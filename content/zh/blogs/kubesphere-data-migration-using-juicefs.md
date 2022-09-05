---
title: '基于 JuiceFS 的 KubeSphere DevOps 项目数据迁移方案'
tag: 'KubeSphere, DevOps, JuiceFS'
keywords: 'KubeSphere, DevOps, Kubernetes, JuiceFS'
description: '本教程使用开源项目 juiceFS-CSI 且后端依托 OSS 作为后端存储实现数据迁移。'
createTime: '2022-08-04'
author: '尹珉'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202209051504283.jpg'
---

## 方案背景和目的

KubeSphere 自发布以来已有 2 年之久，从 2.1.0 版本至目前最新版本 3.3。开发人员的编译构建都基于环境平台的 DevOps 功能（底层是 jenkins）实现，如果 DevOps 项目较多产生的流水线记录数据也会比较多，记录的数据存储方式默认是基于 Openebs 去做的，存储介质依赖于 ECS 宿主机 local 本地磁盘的风险是比较大的考虑到宿主机硬盘的不可靠性，随时会发生宕机导致流水线记录数据丢失造成严重影响。本教程经过本地研发平台测试通过了使用开源项目 juiceFS-CSI 且后端依托 OSS 作为后端存储实现数据迁移的检验。

### 前提条件：

1. 已经安装好 KubeSphere 平台（本教程使用 KubeSphere 3.2.1、K8s 版本 1.21.5）。安装方式请参考官网：[https://kubesphere.com.cn/docs/v3.3/](https://kubesphere.com.cn/docs/v3.3/)
2. 已经安装好 juiceFS-CSI 插件并且挂载好 OSS 后端、确认创建 PVC 时通过 SC 自动创建 PV 并绑定。
安装方式请参考官网 : [https://www.juicefs.com/docs/zh/community/introduction/](https://www.juicefs.com/docs/zh/community/introduction/)
**（以上两者缺一不可）**

### 方案实施过程

#### 1. 找到 KubeSphere 平台的 Jenkins 使用的 PV

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041549714.png)

#### 2. 确认目前 Local 磁盘保存的 Jenkins 路径（在 node1 节点上）

```bash
/var/openebs/local/pvc-2143c5a8-9593-4e2a-8eb5-2f3a0c98219a
```

#### 3. 下载 JuiceFS 客户端

获取最新的版本号。

```bash
$ JFS_LATEST_TAG=$(curl -s https://api.github.com/repos/juicedata/juicefs/releases/latest | grep 'tag_name' | cut -d '"' -f 4 | tr -d 'v')
```

下载客户端到当前目录。

```bash
$ wget "https://github.com/juicedata/juicefs/releases/download/v${JFS_LATEST_TAG}/juicefs-${JFS_LATEST_TAG}-linux-amd64.tar.gz"
```

解压安装包。

```bash
$ tar -zxf "juicefs-${JFS_LATEST_TAG}-linux-amd64.tar.gz"
```

安装客户端。

```bash
$ install juicefs /usr/local/bin
```

挂载 JuiceFS。

```bash
$ juicefs mount -d redis://10.233.106.62:6379/1 /mnt/jfs
```

+ `redis://` 后面跟的是 Redis 服务的内网地址；
+ `/mnt/jfs` 是自定义的目录。

#### 4. 创建新的 PVC

打开管理后台-找到【存储】--【存储卷】--【kubesphere-devops-system】打开【创建】

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041550644.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041550879.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041550595.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041550275.png)

通过 PVC 的名字在宿主机上查看创建结果

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041616556.png)

#### 5. 停止 DevOps 服务（至关重要的一步）

找到 devops-jenkins 的服务将副本数降为 0。

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041616265.png)

将 Local 本地对应的 devops-jenkins 的数据拷贝至刚才创建新的 PVC 里面（等待时间较长）。

注意：拷贝的时候建议是写目录的绝对路径。

```bash
$ cp -r /var/openebs/local/pvc-a2e60bcb-440e-4820-9330-921584bbabf3/* /mnt/jfs/pvc-bf8f2f7c-cfd1-45fd-94c8-39726aa364a5/
```

确认数据已达到目的数据 PVC 后替换 devops-jenkins 数据参数将原有 PVC 解除绑定，绑定新的 PVC。

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041617434.png)

找到原有的存储卷进行修改绑定。

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041617493.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041617669.png)

确认服务已正常启动。

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041617922.png)

确认数据是否正确。

```bash
$ df- h
$ ls /挂载点
```

## 验证

创建一条新的流水线。

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041618708.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041618835.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041619780.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202208041619808.png)

### 友情提示

1. 目前此教程尚未经过生产环境验证，如在生产上使用请一定要做好备份在尝试以便及时回滚。
2. 迁移后的数据不支持直接从后端介质直接查看（比如后端是 OSS），因为数据都是打散的且保存方式以 JuiceFS 格式保存，要查看需要安装 JuiceFS 客户端或者直接进入 PVC 绑定的容器中。
3. kubesphere-GitHub 地址：[https://github.com/kubesphere/kubesphere](https://github.com/kubesphere/kubesphere)。
4. JuiceFS-GitHub 地址：[https://github.com/juicedata/juicefs](https://github.com/juicedata/juicefs)。