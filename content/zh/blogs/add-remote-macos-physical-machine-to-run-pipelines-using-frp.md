---
title: '使用 frp 接入远程 macOS 物理机进行流水线构建'
tag: 'KubeSphere,Kubernetes,DevOps'
createTime: '2020-11-26'
author: 'Shaowen Chen'
snapshot: '../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/add-mac-to-jenkins.png'
---

> 本文同样适用于接入 ARM、MIPS 架构，FreeBSD、Windows 系统的物理机，如果 Jenkins 能连上构建机，可以跳过 Frp 部分，直接增加物理节点。

## 遇到的问题

在以 Kubernetes 为基础设施的场景下，Jenkins 构建流水线时，将为每一条流水线单独创建一个 Pod 用于构建。Pod 中的容器环境可以根据需要自定义设置，扩展非常方便，能够满足绝大多数的需求。

其中有一个特例，那就是构建苹果生态链的应用，例如 IOS、macOS 应用。由于没有 macOS 的容器镜像，只能采用物理机进行构建。还有一种方式是，将 macOS 安装在虚拟机中，将虚拟机接入 Jenkins 进行构建，当然也可以直接导入其他人共享的 macOS VM 。

这都会遇到一个问题，那就是 Jenkins Master 无法直接访问 macOS 系统，网络不通，无法添加 macOS 的构建节点。

本篇主要是以 Frp 作为穿透工具，打通网络，对 IOS 应用、macOS 应用提供 Jenkins 流水线构建的解决方案。

## 解决方案

如下图，通过 Frp 可以打通 Jenkins 与物理机之间的网络。

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/add-mac-to-jenkins.png)

- 第一步，需要将 Frp 的 Server 端部署到 Jenkins Master 可以直接访问的环境上，这些环境包括物理机、VM、容器环境。
- 第二步，在 Mac 物理机上运行 Frp Client ，将 macOS 的 SSH 服务暴露在 Frp Server 上。
- 第三步，在 Jenkins 上添加 macOS 节点，使用 Label 选择 Mac 机器进行构建。

## 配置相关组件

### macOS 系统配置

下图是我测试的 macOS 系统版本:

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/osx.png)

- 关闭防火墙

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/osx-firewall.png)

- 在系统设置中，找到【Sharing】，打开 `Remote Login`。

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/osx-ssh.png)

这一步是为了 Jenkins Master 能够远程登录到 macOS 上。这里的 172.31.140.36 是内网的 IP，Jenkins 无法直接访问。

### 搭建并配置 Frp 服务

Frp 服务端和客户端的配置，请参考 https://github.com/fatedier/frp。

下面贴出的是客户端的配置：

```ini
[common]
server_addr = 139.198.120.81
server_port = 5443
token = xxxxxxxxxxxx

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 2222
```

这里将本地的 macOS 的 22 端口映射到公网 139.198.120.81:2222 上。

执行命令启动 Frp 客户端。如果是生产环境，需要托管这个服务。

```bash
./frpc -c ./frpc.ini
```

启动之后，会弹框报错，截图如下：

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/frpc-warnning.png)

需要去系统设置->安全与隐私中，解锁运行权限，再运行 Frp 。下图中，由于已经允许，因此并没有出现 Frp 相关的提示字样。

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/frpc-osx-allow.png)

再次执行 `./frpc -c ./frpc.ini` ，弹框会新增 `Open` 选项。

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/frpc-warnning-2.png)

点击 `Open ` 之后，可以看到 Frp 客户端已经正常运行。

```bash
2020/11/22 08:59:06 [I] [service.go:288] [97da648b05e7e343] login to server success, get run id [97da648b05e7e343], server udp port [0]
2020/11/22 08:59:06 [I] [proxy_manager.go:144] [97da648b05e7e343] proxy added: [ssh]
2020/11/22 08:59:06 [I] [control.go:180] [97da648b05e7e343] [ssh] start proxy success
```

### Jenkins 新增节点配置

Jenkins 中的配置主要分为如下几步：

1. 进入 Jenkins 后台的节点管理页面

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/jenkins-add-node-1.png)

2. 新增 OSX 节点，勾选 `Permanent Agent`

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/jenkins-add-node-2.png)

3. 配置节点信息

如图进行配置，Host 设置为 Frp Server 的地址，点击【高级】，可以配置 SSH 的端口号为 2222 。

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/jenkins-node-config.png)

这里需要添加一个凭证，用于登录 macOS 。为了简便，我直接使用的是账户和密码。如果对安全有较高要求，可以使用 SSH Key 进行认证。

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/jenkins-add-credential-1.png)

4. 启动节点并查看节点列表

上一步完成之后，节点默认会直接启动，也就是初始化节点，运行一个进程，用于与 Master 通信。

在初始化的过程中，在 macOS 系统上，会出现授权的弹框。如下图，点击 `Open` 。

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/jenkins-node-run.png)

返回节点列表页面，将会看到 macOS 节点。

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/jenkins-node-list.png)

5. 查看 Mac 物理机上初始化文件

回到 macOS 上，可以看到工作目录下面，初始化了一系列文件。

```bash
cd /Users/shaowenchen/Downloads

tree -L 3

.
├── remoting
│   ├── jarCache
│   └── logs
│       ├── remoting.log.0
│       └── remoting.log.0.lck
├── remoting.jar
└── support
    └── all_2020-11-22_01.07.11.log
```

## 测试流水线

创建流水线，编辑 Jenkinsfile 粘贴如下内容：

```bash
pipeline {
  agent {
    node {
      label 'osx'
    }

  }
  stages {
    stage('get env info') {
      steps {
        sh 'uname -a'
      }
    }
  stage('upload file') {
        steps {
            sh "echo `date` >> newfile.txt"
        }
   post {
    success {
        archiveArtifacts 'newfile.txt'
      }
    }
    }
  }
}
```

查看到流水线:

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/ks-2.png)

执行完成之后，可以看到如下结果:

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/ks-3.png)

在制品中，可以下载到构建产物

![](../../../images/blogs/add-remote-macos-physical-machine-to-run-pipelines-using-frp/ks-4.png)

在 macOS 的工作目录中，可以查看到相关的工作目录和文件:

```bash
 tree -L 3
.
├── newfile.txt
├── remoting
│   ├── jarCache
│   └── logs
│       ├── remoting.log.0
│       ├── remoting.log.0.1
│       ├── remoting.log.1
│       ├── remoting.log.2
│       └── remoting.log.3
├── remoting.jar
├── support
│   ├── all_2020-11-22_01.07.11.log
│   ├── all_2020-11-22_01.30.36.log
│   └── all_2020-11-22_01.35.10.log
└── workspace
    ├── aaaak2c24
    │   ├── a
    │   └── a@tmp
    ├── osx
    └── osx@tmp
```

从结果看，流水线在 macOS 执行命令之后，归档了构建产物，符合预期。这里如果是 IOS 构建，只需要在 macOS 系统上安装 XCode 工具，在流水线中执行构建，归档之后，同样能下载到 IOS 安装包。
