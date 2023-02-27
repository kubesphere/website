---
title: '修复 K8s SSL/TLS 漏洞（CVE-2016-2183）指南'
tag: 'KubeSphere, Kubernetes'
keywords: 'KubeSphere, Kubernetes, 安全漏洞'
description: '生产环境 KubeSphere 3.3.0 部署的 Kubernetes 集群在安全评估的时候发现安全漏洞，其中一项漏洞提示 SSL/TLS 协议信息泄露漏洞 (CVE-2016-2183)。本文详细描述了漏洞产生原因、漏洞修复方案、漏洞修复的操作流程以及注意事项。'
createTime: '2023-02-21'
author: '老 Z'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-k8s-ssl-tls.png'
---

> 作者：老 Z，中电信数智科技有限公司山东分公司运维架构师，云原生爱好者，目前专注于云原生运维，云原生领域技术栈涉及 Kubernetes、KubeSphere、DevOps、OpenStack、Ansible 等。

## 前言

![内容导图](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/image-20230215145009515.png)

### **测试服务器配置**

|     主机名      |      IP      | CPU | 内存 | 系统盘 | 数据盘  |               用途               |
| :-------------: | :----------: | :-: | :--: | :----: | :-----: | :------------------------------: |
|  zdeops-master  | 192.168.9.9  |  2  |  4   |   40   |   200   |       Ansible 运维控制节点       |
| ks-k8s-master-0 | 192.168.9.91 |  4  |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker |
| ks-k8s-master-1 | 192.168.9.92 |  4  |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker |
| ks-k8s-master-2 | 192.168.9.93 |  4  |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker |
| storage-node-0  | 192.168.9.95 |  2  |  8   |   40   | 200+200 |     ElasticSearch/GlusterFS      |
| storage-node-0  | 192.168.9.96 |  2  |  8   |   40   | 200+200 |     ElasticSearch/GlusterFS      |
| storage-node-0  | 192.168.9.97 |  2  |  8   |   40   | 200+200 |     ElasticSearch/GlusterFS      |
|     harbor      | 192.168.9.89 |  2  |  8   |   40   |   200   |              Harbor              |
|      合计       |      8       | 22  |  84  |  320   |  2800   |                                  |

### **测试环境涉及软件版本信息**

- 操作系统：**CentOS-7.9-x86_64**
- Ansible：**2.8.20**
- KubeSphere：**3.3.0**
- Kubernetes：**v1.24.1**
- GlusterFS：**9.5.1**
- ElasticSearch：**7.17.5**
- Harbor：**2.5.1**

## 简介

生产环境 KubeSphere 3.3.0 部署的 Kubernetes 集群在安全评估的时候发现安全漏洞，其中一项漏洞提示 **SSL/TLS 协议信息泄露漏洞 (CVE-2016-2183)**。

本文详细描述了漏洞产生原因、漏洞修复方案、漏洞修复的操作流程以及注意事项。

## 漏洞信息及修复方案

### 漏洞详细信息

漏洞报告中涉及漏洞 **SSL/TLS 协议信息泄露漏洞 (CVE-2016-2183)** 的具体信息如下：

![kubesphere-ssl-tls-0](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/kubesphere-ssl-tls-0.png)

![kubesphere-ssl-tls-1](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/kubesphere-ssl-tls-1.png)

### 漏洞分析

1. 分析漏洞报告信息，我们发现漏洞涉及以下端口和服务：

|  端口号   |      服务       |
| :-------: | :-------------: |
| 2379/2380 |      Etcd       |
|   6443    | kube-apiserver  |
|   10250   |     kubelet     |
|   10257   | kube-controller |
|   10259   | kube-scheduler  |

2. 在漏洞节点 (任意 Master 节点) 查看、确认端口号对应的服务：

```shell
# ETCD
[root@ks-k8s-master-0 ~]# ss -ntlup | grep Etcd | grep -v "127.0.0.1"
tcp    LISTEN     0      128    192.168.9.91:2379                  *:*                   users:(("Etcd",pid=1341,fd=7))
tcp    LISTEN     0      128    192.168.9.91:2380                  *:*                   users:(("Etcd",pid=1341,fd=5))

# kube-apiserver
[root@ks-k8s-master-0 ~]# ss -ntlup | grep 6443
tcp    LISTEN     0      128    [::]:6443               [::]:*                   users:(("kube-apiserver",pid=1743,fd=7))

# kubelet
[root@ks-k8s-master-0 ~]# ss -ntlup | grep 10250
tcp    LISTEN     0      128    [::]:10250              [::]:*                   users:(("kubelet",pid=1430,fd=24))

# kube-controller
[root@ks-k8s-master-0 ~]# ss -ntlup | grep 10257
tcp    LISTEN     0      128    [::]:10257              [::]:*                   users:(("kube-controller",pid=19623,fd=7))

# kube-scheduler
[root@ks-k8s-master-0 ~]# ss -ntlup | grep 10259
tcp    LISTEN     0      128    [::]:10259              [::]:*                   users:(("kube-scheduler",pid=1727,fd=7))
```

3. 漏洞原因：

相关服务配置文件里使用了 IDEA、DES 和 3DES 等算法。

4. 利用测试工具验证漏洞：

可以使用 Nmap 或是 openssl 进行验证，本文重点介绍 Nmap 的验证方式。

> **注意：**openssl 的方式输出太多且不好直观判断，有兴趣的可以参考命令 `openssl s_client -connect 192.168.9.91:10257 -cipher "DES:3DES"`。

在任意节点安装测试工具 Nmap ，并执行测试命令。

**错误的操作，仅用于说明选择 Nmap 版本很重要，实际操作中不要执行。**

```shell
# 用 CentOS 默认源安装 nmap
yum install nmap

# 执行针对 2379 端口的 ssl-enum-ciphers 检测
nmap --script ssl-enum-ciphers -p 2379 192.168.9.91

# 结果输出如下
Starting Nmap 6.40 ( http://nmap.org ) at 2023-02-13 14:14 CST
Nmap scan report for ks-k8s-master-0 (192.168.9.91)
Host is up (0.00013s latency).
PORT     STATE SERVICE
2379/tcp open  unknown

Nmap done: 1 IP address (1 host up) scanned in 0.30 seconds
```

> **注意：** 分析输出的结果发现并没有任何警告信息。原因是 Nmap 版本过低，需要 7.x 以上才可以。

**正确的操作，实际执行的操作：**

```shell
# 从 Nmap 官网，下载安装新版软件包
rpm -Uvh https://nmap.org/dist/nmap-7.93-1.x86_64.rpm

# 执行针对 2379 端口的 ssl-enum-ciphers 检测
# nmap -sV --script ssl-enum-ciphers -p 2379 192.168.9.91 (该命令输出更为详细也更加耗时，为节省篇幅使用下面简单输出的模式)
nmap --script ssl-enum-ciphers -p 2379 192.168.9.91

# 输出结果如下
Starting Nmap 7.93 ( https://nmap.org ) at 2023-02-13 17:28 CST
Nmap scan report for ks-k8s-master-0 (192.168.9.91)
Host is up (0.00013s latency).

PORT     STATE SERVICE
2379/tcp open  Etcd-client
| ssl-enum-ciphers:
|   TLSv1.2:
|     ciphers:
|       TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA (ecdh_x25519) - C
|       TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256 (ecdh_x25519) - A
|       TLS_RSA_WITH_3DES_EDE_CBC_SHA (rsa 2048) - C
|       TLS_RSA_WITH_AES_128_CBC_SHA (rsa 2048) - A
|       TLS_RSA_WITH_AES_128_GCM_SHA256 (rsa 2048) - A
|       TLS_RSA_WITH_AES_256_CBC_SHA (rsa 2048) - A
|       TLS_RSA_WITH_AES_256_GCM_SHA384 (rsa 2048) - A
|     compressors:
|       NULL
|     cipher preference: client
|     warnings:
|       64-bit block cipher 3DES vulnerable to SWEET32 attack
|_  least strength: C

Nmap done: 1 IP address (1 host up) scanned in 0.66 seconds

# 执行针对 2380 端口的 ssl-enum-ciphers 检测
nmap --script ssl-enum-ciphers -p 2380 192.168.9.91

# 输出结果如下
Starting Nmap 7.93 ( https://nmap.org ) at 2023-02-13 17:28 CST
Nmap scan report for ks-k8s-master-0 (192.168.9.91)
Host is up (0.00014s latency).

PORT     STATE SERVICE
2380/tcp open  Etcd-server
| ssl-enum-ciphers:
|   TLSv1.2:
|     ciphers:
|       TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA (ecdh_x25519) - C
|       TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256 (ecdh_x25519) - A
|       TLS_RSA_WITH_3DES_EDE_CBC_SHA (rsa 2048) - C
|       TLS_RSA_WITH_AES_128_CBC_SHA (rsa 2048) - A
|       TLS_RSA_WITH_AES_128_GCM_SHA256 (rsa 2048) - A
|       TLS_RSA_WITH_AES_256_CBC_SHA (rsa 2048) - A
|       TLS_RSA_WITH_AES_256_GCM_SHA384 (rsa 2048) - A
|     compressors:
|       NULL
|     cipher preference: client
|     warnings:
|       64-bit block cipher 3DES vulnerable to SWEET32 attack
|_  least strength: C

Nmap done: 1 IP address (1 host up) scanned in 0.64 seconds

# 执行针对 6443 端口的 ssl-enum-ciphers 检测（10250/10257/10259 端口扫描结果相同）
nmap --script ssl-enum-ciphers -p 6443 192.168.9.91

# 输出结果如下
Starting Nmap 7.93 ( https://nmap.org ) at 2023-02-13 17:29 CST
Nmap scan report for ks-k8s-master-0 (192.168.9.91)
Host is up (0.00014s latency).

PORT     STATE SERVICE
6443/tcp open  sun-sr-https
| ssl-enum-ciphers:
|   TLSv1.2:
|     ciphers:
|       TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (secp256r1) - A
|       TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256 (secp256r1) - A
|       TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (secp256r1) - A
|       TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA (secp256r1) - A
|       TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA (secp256r1) - A
|       TLS_RSA_WITH_AES_128_GCM_SHA256 (rsa 2048) - A
|       TLS_RSA_WITH_AES_256_GCM_SHA384 (rsa 2048) - A
|       TLS_RSA_WITH_AES_128_CBC_SHA (rsa 2048) - A
|       TLS_RSA_WITH_AES_256_CBC_SHA (rsa 2048) - A
|       TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA (secp256r1) - C
|       TLS_RSA_WITH_3DES_EDE_CBC_SHA (rsa 2048) - C
|     compressors:
|       NULL
|     cipher preference: server
|     warnings:
|       64-bit block cipher 3DES vulnerable to SWEET32 attack
|   TLSv1.3:
|     ciphers:
|       TLS_AKE_WITH_AES_128_GCM_SHA256 (ecdh_x25519) - A
|       TLS_AKE_WITH_AES_256_GCM_SHA384 (ecdh_x25519) - A
|       TLS_AKE_WITH_CHACHA20_POLY1305_SHA256 (ecdh_x25519) - A
|     cipher preference: server
|_  least strength: C

Nmap done: 1 IP address (1 host up) scanned in 0.66 seconds
```

> 注意： 扫描结果中重点关注 `warnings`，`64-bit block cipher 3DES vulnerable to SWEET32 attack`。

### 漏洞修复方案

漏洞扫描报告中提到的修复方案并不适用于 Etcd、Kubernetes 相关服务。

针对于 Etcd、Kubernetes 等服务有效的修复手段是修改服务配置文件，禁用 3DES 相关的加密配置。

Cipher Suites 配置参数的选择，可以参考 [ETCD 官方文档](https://Etcd.io/docs/v3.4/op-guide/configuration/)或是 [IBM 私有云文档](https://www.ibm.com/docs/ru/cloud-private/3.1.2?topic=installation-specifying-tls-ciphers-Etcd-kubernetes)，网上搜到的很多配置都是参考的 IBM 的文档，想省事的可以拿来即用。

对于配置参数的最终选择，我采用了最笨的方法，即把扫描结果列出的 Cipher 值拼接起来。由于不清楚影响范围，所以保守的采用了在原有配置基础上删除 3DES 相关的配置。

下面的内容整理了 Cipher Suites 配置参数的可参考配置。

1. 原始扫描结果中的 **Cipher Suites** 配置：

```yaml
- TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
- TLS_RSA_WITH_3DES_EDE_CBC_SHA
- TLS_RSA_WITH_AES_128_CBC_SHA
- TLS_RSA_WITH_AES_128_GCM_SHA256
- TLS_RSA_WITH_AES_256_CBC_SHA
- TLS_RSA_WITH_AES_256_GCM_SHA384
```

2. 原始扫描结果去掉 3DES 的 **Cipher Suites** 配置：

```shell
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_RSA_WITH_AES_128_CBC_SHA
- TLS_RSA_WITH_AES_128_GCM_SHA256
- TLS_RSA_WITH_AES_256_CBC_SHA
- TLS_RSA_WITH_AES_256_GCM_SHA384
```

使用该方案时必须**严格按照以下顺序配置**，我在测试时发现顺序不一致会导致 Etcd 服务反复重启。

```shell
ETCD_CIPHER_SUITES=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA
```

虽然 CIPHER 配置一样，但是在使用下面的顺序时，Etcd 服务反复重启，我排查了好久也没确定根因。也可能是我写的有问题，但是比对多次也没发现异常，只能暂时是认为是顺序造成的。

```shell
ETCD_CIPHER_SUITES=TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384
```

> 注意： 只有 Etcd 服务受到顺序的影响，kube 相关组件顺序不同也没发现异常。

3. IBM 相关文档中的 **Cipher Suites** 配置：

网上搜到的参考文档使用率最高的配置。实际测试也确实好用，服务都能正常启动，没有发现 Etcd 不断重启的现象。如果没有特殊需求，可以采用该方案，毕竟选择越少出安全漏洞的几率也越小。

```yaml
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
```

## 漏洞修复

建议使用以下顺序修复漏洞：

- Etcd
- kube-apiserver
- kube-controller
- kube-scheduler
- kubelet

上面的操作流程中，重点是将 Etcd 的修复重启放在最前面执行。因为 kube 等组件的运行依赖于 Etcd，我在验证时最后升级的 Etcd，当 Etcd 启动失败后（反复重启），其他服务由于无法连接 Etcd，造成服务异常停止。所以先确保 Etcd 运行正常再去修复其他组件。

本文所有操作仅演示了一个节点的操作方法，多节点存在漏洞时请按组件依次执行，先修复完成一个组件，确认无误后再去修复另一个组件。

**以下操作是我实战验证过的经验，仅供参考，生产环境请一定要充分验证、测试后再执行！**

### 修复 Etcd

1. 编辑 Etcd 配置文件 **/etc/Etcd.env**：

KubeSpere 3.3.0 采用二进制的方式部署的 Etcd，相关配置文件包含 **/etc/systemd/system/Etcd.service** 和 **/etc/Etcd.env**，参数配置保存在 **/etc/Etcd.env**。

```shell
# 在文件最后增加配置(用 cat 命令自动配置)
cat >> /etc/Etcd.env << "EOF"

# TLS CIPHER SUITES settings
ETCD_CIPHER_SUITES=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA
EOF
```

2. 重启 Etcd 服务：

```shell
# 重启服务
systemctl restart Etcd

# 验证服务已启动
ss -ntlup | grep Etcd

# 正确的结果如下
tcp    LISTEN     129    128    192.168.9.91:2379                  *:*                   users:(("Etcd",pid=40160,fd=7))
tcp    LISTEN     0      128    127.0.0.1:2379                  *:*                   users:(("Etcd",pid=40160,fd=6))
tcp    LISTEN     0      128    192.168.9.91:2380                  *:*                   users:(("Etcd",pid=40160,fd=5))

# 持续观测 确保服务没有反复重启
watch -n 1 -d 'ss -ntlup | grep Etcd'
```

> 注意： 如果是多节点模式，一定要所有节点都修改完配置文件，然后，所有节点同时重启 Etcd 服务。重启过程中会造成 Etcd 服务中断，生产环境谨慎操作。

3. 验证漏洞是否修复：

```shell
# 执行扫描命令
nmap --script ssl-enum-ciphers -p 2379 192.168.9.91

# 输出结果如下
Starting Nmap 7.93 ( https://nmap.org ) at 2023-02-14 17:48 CST
Nmap scan report for ks-k8s-master-0 (192.168.9.91)
Host is up (0.00015s latency).

PORT     STATE SERVICE
2379/tcp open  Etcd-client
| ssl-enum-ciphers:
|   TLSv1.2:
|     ciphers:
|       TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA (ecdh_x25519) - A
|       TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (ecdh_x25519) - A
|       TLS_RSA_WITH_AES_128_CBC_SHA (rsa 2048) - A
|       TLS_RSA_WITH_AES_128_GCM_SHA256 (rsa 2048) - A
|       TLS_RSA_WITH_AES_256_CBC_SHA (rsa 2048) - A
|       TLS_RSA_WITH_AES_256_GCM_SHA384 (rsa 2048) - A
|     compressors:
|       NULL
|     cipher preference: client
|_  least strength: A

Nmap done: 1 IP address (1 host up) scanned in 0.64 seconds

# 为了节省篇幅，2380 端口扫描完整输出结果略,实际结果与 2379 端口一致

# 可以执行过滤输出的扫描命令，如果以下命令返回值为空，说明漏洞修复
nmap --script ssl-enum-ciphers -p 2380 192.168.9.91 | grep SWEET32
```

### 修复 kube-apiserver

1. 编辑 kube-apiserver 配置文件 `/etc/kubernetes/manifests/kube-apiserver.yaml`：

```yaml
# 新增配置(在原文件 47 行后面增加一行)
- --tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA

# 新增后的效果如下（不截图了，增加了行号显示用来区分）
46     - --tls-cert-file=/etc/kubernetes/pki/apiserver.crt
47     - --tls-private-key-file=/etc/kubernetes/pki/apiserver.key
48     - --tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_        256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA
```

2. 重启 kube-apiserver：

不需要手动重启，由于是静态 Pod， Kubernetes 会自动重启。

3. 验证漏洞：

```shell
# 执行扫描命令
nmap --script ssl-enum-ciphers -p 6443 192.168.9.91

# 输出结果如下
Starting Nmap 7.93 ( https://nmap.org ) at 2023-02-14 09:22 CST
Nmap scan report for ks-k8s-master-0 (192.168.9.91)
Host is up (0.00015s latency).

PORT     STATE SERVICE
6443/tcp open  sun-sr-https
| ssl-enum-ciphers:
|   TLSv1.2:
|     ciphers:
|       TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (secp256r1) - A
|       TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (secp256r1) - A
|       TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA (secp256r1) - A
|       TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA (secp256r1) - A
|       TLS_RSA_WITH_AES_128_GCM_SHA256 (rsa 2048) - A
|       TLS_RSA_WITH_AES_256_GCM_SHA384 (rsa 2048) - A
|       TLS_RSA_WITH_AES_128_CBC_SHA (rsa 2048) - A
|       TLS_RSA_WITH_AES_256_CBC_SHA (rsa 2048) - A
|     compressors:
|       NULL
|     cipher preference: server
|   TLSv1.3:
|     ciphers:
|       TLS_AKE_WITH_AES_128_GCM_SHA256 (ecdh_x25519) - A
|       TLS_AKE_WITH_AES_256_GCM_SHA384 (ecdh_x25519) - A
|       TLS_AKE_WITH_CHACHA20_POLY1305_SHA256 (ecdh_x25519) - A
|     cipher preference: server
|_  least strength: A

Nmap done: 1 IP address (1 host up) scanned in 0.68 seconds
```

> 注意：对比之前的漏洞告警信息，扫描结果中已经不存在 `64-bit block cipher 3DES vulnerable to SWEET32 attack`，说明修复成功。

### 修复 kube-controller

1. 编辑 kube-controller 配置文件 `/etc/kubernetes/manifests/kube-controller-manager.yaml`：

```yaml
# 新增配置(在原文件 33 行后面增加一行)
- --tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA

# 新增后的效果如下（不截图了，增加了行号显示用来区分）
33     - --use-service-account-credentials=true
34     - --tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_        256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA
```

2. 重启 kube-controller：

不需要手动重启，由于是静态 Pod， Kubernetes 会自动重启。

3. 验证漏洞：

```shell
# 执行完整扫描命令
nmap --script ssl-enum-ciphers -p 10257 192.168.9.91

# 为了节省篇幅，完整输出结果略,实际结果与 kube-apiserver 的一致

# 可以执行过滤输出的扫描命令，如果以下命令返回值为空，说明漏洞修复
nmap --script ssl-enum-ciphers -p 10257 192.168.9.91 | grep SWEET32
```

> 注意：对比之前的漏洞告警信息，扫描结果中已经不存在 `64-bit block cipher 3DES vulnerable to SWEET32 attack`，说明修复成功。

### 修复 kube-scheduler

1. 编辑 kube-scheduler 配置文件 `/etc/kubernetes/manifests/kube-scheduler.yaml`：

```yaml
# 新增配置(在原文件 19 行后面增加一行)
- --tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA

# 新增后的效果如下（不截图了，增加了行号显示用来区分）
19     - --leader-elect=true
20     - --tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_  256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA
```

2. 重启 kube-scheduler：

不需要手动重启，由于是静态 Pod， Kubernetes 会自动重启。

3. 验证漏洞：

```shell
# 执行完整扫描命令
nmap --script ssl-enum-ciphers -p 10259 192.168.9.91

# 为了节省篇幅，完整输出结果略,实际结果与 kube-apiserver 的一致

# 可以执行过滤输出的扫描命令，如果以下命令返回值为空，说明漏洞修复
nmap --script ssl-enum-ciphers -p 10259 192.168.9.91 | grep SWEET32
```

> 注意：对比之前的漏洞告警信息，扫描结果中已经不存在 `64-bit block cipher 3DES vulnerable to SWEET32 attack`，说明修复成功。

### 修复 kubelet

1. 编辑 kubelet 配置文件 `/var/lib/kubelet/config.yaml`：

```yaml
# 在配置文件最后添加
tlsCipherSuites: [TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_  256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA]
```

> 提示： 更多的 cipher suites 配置，请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/)。

2. 重启 kubelet：

```shell
systemctl restart kubelet
```

> 重启有风险，操作需谨慎！

3. 验证漏洞：

```shell
# 执行完整扫描命令
nmap --script ssl-enum-ciphers -p 10250 192.168.9.91

# 为了节省篇幅，完整输出结果略,实际结果与 kube-apiserver 的一致

# 可以执行过滤输出的扫描命令，如果以下命令返回值为空，说明漏洞修复
nmap --script ssl-enum-ciphers -p 10250 192.168.9.91 | grep SWEET32
```

> 注意： 对比之前的漏洞告警信息，扫描结果中已经不存在 `64-bit block cipher 3DES vulnerable to SWEET32 attack`，说明修复成功。

## 常见问题

### Etcd 启动失败

#### 报错信息：

```shell
Feb 13 16:17:41 ks-k8s-master-0 Etcd: Etcd Version: 3.4.13
Feb 13 16:17:41 ks-k8s-master-0 Etcd: Git SHA: ae9734ed2
Feb 13 16:17:41 ks-k8s-master-0 Etcd: Go Version: go1.12.17
Feb 13 16:17:41 ks-k8s-master-0 Etcd: Go OS/Arch: linux/amd64
Feb 13 16:17:41 ks-k8s-master-0 Etcd: setting maximum number of CPUs to 4, total number of available CPUs is 4
Feb 13 16:17:41 ks-k8s-master-0 Etcd: the server is already initialized as member before, starting as Etcd member...
Feb 13 16:17:41 ks-k8s-master-0 Etcd: unexpected TLS cipher suite "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256"
Feb 13 16:17:42 ks-k8s-master-0 systemd: Etcd.service: main process exited, code=exited, status=1/FAILURE
Feb 13 16:17:42 ks-k8s-master-0 systemd: Failed to start Etcd.
Feb 13 16:17:42 ks-k8s-master-0 systemd: Unit Etcd.service entered failed state.
Feb 13 16:17:42 ks-k8s-master-0 systemd: Etcd.service failed.
```

#### 解决方案：

删除配置文件中的 `TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256` 字段，至于原因没有深入研究。

### Etcd 服务不断重启

#### 报错信息 (省略掉了一部分)：

修改配置文件后，重新启动 Etcd，启动的时候命令执行没有报错。但是，启动后查看 status 有异常，且 `/var/log/messages` 中有如下信息

```shell
Feb 13 16:25:55 ks-k8s-master-0 systemd: Etcd.service holdoff time over, scheduling restart.
Feb 13 16:25:55 ks-k8s-master-0 systemd: Stopped Etcd.
Feb 13 16:25:55 ks-k8s-master-0 systemd: Starting Etcd...
Feb 13 16:25:55 ks-k8s-master-0 Etcd: recognized and used environment variable ETCD_ADVERTISE_CLIENT_URLS=https://192.168.9.91:2379
Feb 13 16:25:55 ks-k8s-master-0 Etcd: [WARNING] Deprecated '--logger=capnslog' flag is set; use '--logger=zap' flag instead
Feb 13 16:25:55 ks-k8s-master-0 Etcd: [WARNING] Deprecated '--logger=capnslog' flag is set; use '--logger=zap' flag instead
Feb 13 16:25:55 ks-k8s-master-0 Etcd: recognized and used environment variable ETCD_AUTO_COMPACTION_RETENTION=8
.....（省略）

Feb 13 16:25:58 ks-k8s-master-0 systemd: Started Etcd.
Feb 13 16:25:58 ks-k8s-master-0 Etcd: serving client requests on 192.168.9.91:2379
Feb 13 16:25:58 ks-k8s-master-0 Etcd: serving client requests on 127.0.0.1:2379
Feb 13 16:25:58 ks-k8s-master-0 Etcd: accept tcp 127.0.0.1:2379: use of closed network connection
Feb 13 16:25:58 ks-k8s-master-0 systemd: Etcd.service: main process exited, code=exited, status=1/FAILURE
Feb 13 16:25:58 ks-k8s-master-0 systemd: Unit Etcd.service entered failed state.
Feb 13 16:25:58 ks-k8s-master-0 systemd: Etcd.service failed.
```

#### 解决方案：

在实际测试中遇到了两种场景都产生了类似上面的报错信息：

第一种，在多节点 Etcd 环境中，需要先修改所有节点的 Etcd 配置文件，然后，同时重启所有节点的 Etcd 服务。

第二种，Etc Cipher 参数顺序问题，不断尝试确认了最终顺序后（具体配置参考正文），反复重启的问题没有再现。


