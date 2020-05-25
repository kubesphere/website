---
title: "all-in-one"
weight: 2
---

## All-in-One 模式

对于首次接触 KubeSphere 的用户，想寻找一个最快安装和体验 KubeSphere 的方式，All-in-One 模式支持一键安装 KubeSphere 和 Kubernetes 至一台目标机器。

> 提示：
> - KubeSphere 2.1 已支持 `自定义安装各个功能组件`，默认仅开启`最小化安装`，用户可根据**机器配置选择安装所需要的组件**，参考 [安装说明](https://kubesphere.io/docs/v2.1/zh-CN/installation/intro/#自定义安装可插拔的功能组件) 开启可选组件的安装。
> - 若在云平台使用在线安装，可在安装前 [配置镜像加速器](https://kubesphere.com.cn/forum/d/149-kubesphere-v2-1-0)，或通过调高带宽的方式来加快安装速度。


### 测试

测试h3


## 前提条件

建议关闭机器的防火墙，若未关闭防火墙则需要开放相关端口，参考 [需开放的端口](https://kubesphere.io/docs/v2.1/zh-CN/installation/port-firewall/)。

## 第一步: 准备主机

1. 本文将演示 All-in-One 安装，请准备一台干净的机器（虚拟机或物理机），安装前关闭防火墙，并确保您的机器符合以下的最小要求：


- 机器配置:

    - CPU: 最小化安装需 2 Cores；完整安装需 8 Cores
    - Memory: 最小化安装需 4 GB；完整安装需 16 GB

- 操作系统:

    - CentOS 7.4 ~ 7.7 (64-bit)
    - Ubuntu 16.04/18.04 LTS (64-bit)
    - RHEL 7.4 (64-bit)
    - Debian Stretch 9.5 (64-bit)

> 说明：
> - 若使用 ubuntu 16.04 建议使用其最新的版本 16.04.5；
> - 若使用 ubuntu 18.04，则需要使用 root 用户；
> - 若 Debian 系统未安装 sudo 命令，则需要在安装前使用 root 用户执行 `apt update && apt install sudo` 命令安装 sudo 命令后再进行安装。


## 第二步: 准备安装包

下载 `KubeSphere 2.1.1` 安装包至待安装机器，进入安装目录。

```bash
curl -L https://kubesphere.io/download/stable/v2.1.1 > installer.tar.gz \
&& tar -zxf installer.tar.gz && cd kubesphere-all-v2.1.1/scripts
```

> 注意： Installer 默认仅开启了最小化安装，若需要开启所有组件进行完整安装，请在 `kubesphere-all-v2.1.1/conf/common.yaml` 中将可选功能组件设置为 true，请参考 [完整安装](https://kubesphere.com.cn/docs/v2.1/zh-CN/installation/complete-installation/)，或在最小化安装后再开启可插拔功能组件。

## 第三步: 安装 KubeSphere

> 注意：由于 Kubernetes 集群的 Cluster IP 子网网段默认是 `10.233.0.0/18`，Pod 的子网网段默认是 `10.233.64.0/18`，因此安装 KubeSphere 的节点 IP 地址范围不应与以上两个网段有重复，若遇到地址范围冲突可在配置文件 `conf/vars.yaml` 修改 `kube_service_addresses` 或 `kube_pods_subnet` 的参数。


参考以下步骤开始 all-in-one 安装：

**1.** 建议使用 `root` 用户安装，执行 `install.sh` 脚本：

```bash
$ ./install.sh
```

**2.** 输入数字 `1` 选择第一种即 all-in-one 模式开始安装：

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2020-02-24
################################################
Please input an option: 1

```

**3.** 测试 KubeSphere 单节点安装是否成功：

**(1)** 待安装脚本执行完后，当看到如下 `"Successful"` 界面，则说明 KubeSphere 安装成功。

> 说明：安装时间跟网络情况和带宽、机器配置、安装节点个数等因素有关，已测试过的 all-in-one 模式，在网络良好的情况下以规格列表最小配置安装用时大约为 20 分钟。

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.8:30880
Account: admin
Password: P@88w0rd

NOTE：Please modify the default password after login.
#####################################################
```
> 提示：如需要再次查看以上的界面信息，可在安装包目录下执行 `cat kubesphere/kubesphere_running` 命令查看。


**(2)** 安装成功后，浏览器访问对应的 URL，如 `http://{$IP}:30880`，即可进入 KubeSphere 登录界面，可使用默认的用户名和密码登录 KubeSphere 控制台体验，**登录后请立即修改默认密码**。参阅 [快速入门](https://kubesphere.io/docs/v2.1/zh-CN/quick-start/quick-start-guide/) 帮助您快速上手 KubeSphere。

> 提示：若需要在外网访问，请配置防火墙的端口策略，确保外网流量可以通过 30880 端口。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191020153911.png)

<font color=red>注意：登陆 Console 后请在 "集群状态" 查看服务组件的监控状态，待所有组件启动完成后即可开始使用，通常所有服务组件都将在 10 分钟内启动完成。</font>

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191014095317.png)

若遇到安装问题需要协助支持，请在 [社区论坛](https://kubesphere.com.cn/forum/) 搜索解决方法或发布帖子，社区会尽快跟踪解决。

