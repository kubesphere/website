---
title: '修复 KubeSphere 内置 Jenkins 的 Apache Log4j2 漏洞'
tag: 'KubeSphere, Kubernetes, Log4j2'
keywords: 'KubeSphere, Kubernetes, Log4j2, Jenkins'
description: '本文以修复 Jenkins 存在的 Apache Log4j2 漏洞为背景，介绍了修复该漏洞的两种解决方案。并且，初步探究了在 KubeSphere 中集成的 Jenkins 如何自定义构建镜像以及如何升级更新。'
createTime: '2023-02-10'
author: '老 Z'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-jenkins-log4j2-cover.png'
---

> 作者：老 Z，中电信数智科技有限公司山东分公司运维架构师，云原生爱好者，目前专注于云原生运维，云原生领域技术栈涉及 Kubernetes、KubeSphere、DevOps、OpenStack、Ansible 等。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20230210141327867.png)

## 简介

生产环境 KubeSphere 3.3.0 部署的 Kubernetes 集群在安全评估的时候发现安全漏洞，其中一项漏洞提示**目标可能存在 Apache Log4j2 远程代码执行漏洞 (CVE-2021-44228)**。

本文记录了该漏洞修复的全部过程，文中介绍了修复该漏洞的两种解决方案，其中涉及自定义构建 KubeSphere 适用的 Jenkins Image 的详细操作。

## 漏洞修复方案

### 漏洞详细信息

漏洞报告中涉及漏洞 **目标可能存在 Apache Log4j2 远程代码执行漏洞 (CVE-2021-44228)** 的具体信息如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20230208151708221.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20230208110325840.png)

### 漏洞分析

1. 分析漏洞报告信息，发现对应的服务端口为 **30180**，对应的服务为 **Jenkins**。使用 Curl 访问服务端口，查看返回头信息。

```bash
[root@ks-k8s-master-0 ~]# curl -I http://192.168.9.91:30180
HTTP/1.1 403 Forbidden
Date: Thu, 09 Feb 2023 00:36:45 GMT
X-Content-Type-Options: nosniff
Set-Cookie: JSESSIONID.b1c3bc24=node084x6l5z2ss0ghsb2t9tde2gl16558.node0; Path=/; HttpOnly
Expires: Thu, 01 Jan 1970 00:00:00 GMT
Content-Type: text/html;charset=utf-8
X-Hudson: 1.395
X-Jenkins: 2.319.1
X-Jenkins-Session: 1fde6067
Content-Length: 541
Server: Jetty(9.4.43.v20210629)
```

> **说明：** 从结果中可以看到 KubeSphere 3.3.0 采用的 Jenkins 使用的 Jetty 版本为 **9.4.43.v20210629**，跟漏扫报告中的结果一致。

2. 在 K8s 中查看 Jenkins 服务使用的 Image 版本。

```bash
[root@ks-k8s-master-0 ~]# kubectl get deploy  devops-jenkins -n kubesphere-devops-system -o wide
NAME             READY   UP-TO-DATE   AVAILABLE   AGE    CONTAINERS       IMAGES                                                                    SELECTOR
devops-jenkins   1/1     1            1           101d   devops-jenkins   registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.3.0-2.319.1   component=devops-jenkins-master
```

> **说明：** 从结果中可以看到 KubeSphere 3.3.0 采用的 Jenkins 版本为 **2.319.1**，跟漏扫报告中的结果一致。

3. 在 K8s 中确认 Jenkins 哪些组件用到了跟 Log4j 有关的 JAR 包。

- 查找 Jenkins 服务对应的 Pod。

```bash
[root@ks-k8s-master-0 ~]# kubectl get pod -n kubesphere-devops-system -o wide
NAME                                 READY   STATUS      RESTARTS        AGE    IP               NODE              NOMINATED NODE   READINESS GATES
devops-27930510-52tck                0/1     Completed   0               87m    10.233.116.224   ks-k8s-master-2   <none>           <none>
devops-27930540-6b7cz                0/1     Completed   0               57m    10.233.116.225   ks-k8s-master-2   <none>           <none>
devops-27930570-t5k6b                0/1     Completed   0               27m    10.233.116.226   ks-k8s-master-2   <none>           <none>
devops-apiserver-6b468c95cb-grx4j    1/1     Running     2 (4h30m ago)   101d   10.233.116.211   ks-k8s-master-2   <none>           <none>
devops-controller-667f8449d7-w8mvf   1/1     Running     2 (4h37m ago)   101d   10.233.117.173   ks-k8s-master-0   <none>           <none>
devops-jenkins-67fbd685bf-4jmn4      1/1     Running     7 (4h23m ago)   101d   10.233.117.162   ks-k8s-master-0   <none>           <none>
s2ioperator-0                        1/1     Running     2 (4h36m ago)   101d   10.233.87.33     ks-k8s-master-1   <none>           <none>
```

- 进入 Jenkins Pod 的命令行控制台

```bash
[root@ks-k8s-master-0 ~]# kubectl exec -it devops-jenkins-67fbd685bf-4jmn4 -n kubesphere-devops-system -- bash
Defaulted container "devops-jenkins" out of: devops-jenkins, copy-default-config (init)
root@devops-jenkins-67fbd685bf-4jmn4:/# 
```

- 在 Jenkins 挂载的主目录中查找跟 Log4j 有关的 JAR 包 (所有操作都是在容器内部)。

```bash
# 进入 Jenkins 数据主目录
root@devops-jenkins-67fbd685bf-4jmn4:~# cd  /var/jenkins_home

# 查找带 log4j 关键字带所有 jar 包
root@devops-jenkins-67fbd685bf-4jmn4:/var/jenkins_home# find ./ -name "*log4j*"
./war/WEB-INF/lib/log4j-over-slf4j-1.7.32.jar
./plugins/ssh-slaves/WEB-INF/lib/log4j-over-slf4j-1.7.26.jar
./plugins/prometheus/WEB-INF/lib/log4j-over-slf4j-1.7.30.jar
```

> **说明：** 并没有搜到到 log4j 的核心包，但是搜索到了 **log4j-over-slf4j**，该软件包并不属于 log4j [官方 MAVEN 仓库](https://repo.maven.apache.org/maven2/org/apache/logging/log4j/)（也可能是我没有找到），而且居然有 3 个不同版本，Jenkins 自己用了一个版本，还有两个插件也用了两个不同的版本。
>
> 百度了一下 **log4j-over-slf4j** 是用来把日志框架的 Log4j API 桥接到 SLF4J API，实际上底层使用的 SLF4J，细节我并没有深究，也没有去研究漏洞扫描工具是如何判断的。
>
> 但是由于搜索不到其他的 log4j 相关的 JAR 包，初步判定是由于 **log4j-over-slf4j** 包引起的漏洞。

4. 漏洞原因

- **log4j-over-slf4j** 包引起的漏洞
- Jenkins 服务运行环境使用的 **Jetty** 版本过低。
- 以上二者均有。

### 漏洞修复方案

1. **方案一：** 替换查找到的所有 log4j-over-slf4j 相关的 jar 包

- 只考虑 Log4j 是造成该漏洞信息的主要原因，应该是 Jenkins 程序调用的  log4j-over-slf4j 引起的，可以只换这一个，但是为了安全起见，我把 3 个都替换了。
- 硬替 jar 包的方式可能引起某些特殊场景的异常，一定要备份好之前的 jar 包，便于回滚。
- 解决方案可能并不彻底，只是根据 **Log4j** 的相关修复建议，替换了有关的 JAR 包，但是并不符合 Jetty 版本要求，目前版本为 **9.4.43.v20210629** 需要升级到不低于 **11.0.7** 的版本。
- **如果没有特殊需求，建议首选这种修复方案，虽然没有解决根本，但是胜在简单，回滚方便，整体出问题的可能性更小。**

> **说明：** 该方案已经验证， 替换 jar 包后重启 devops-jenkins，重新执行漏洞扫描，该漏洞没再次发现。
>
> 重启后也执行过相应的流水线任务，目前看来功能也都正常。毕竟没有完全充分测试，所以不排除某些特殊场景可能存在问题。

2. **方案二：** 升级 Jenkins 和相应的插件到比较新的版本 

- 升级比较彻底， Jetty 和 Log4j 都升级到新的版本。
- 需要考虑版本兼容性问题，是否与 KubeSphere 适配，没在官网找到相关介绍，只能升级尝试。
- 自己打包比较麻烦，需要有一定的动手能力，需要自己重新构建 **ks-jenkins** 使用的 Image。
- 官方的打包项目文档比较简单，需要有一定的基础。
- 利用重新构建的 Image 重启已有的 Jenkins 服务后，**原有数据配置是否丝毫不受影响**？还需要进一步深层次验证。
- 升级 Jenkins 和插件还有一个简单方法，直接在 Jenkins 的管理界面把提示升级的组件都升级了，这些更简单便捷的解决了版本兼容性的问题，有兴趣的可以自己尝试。
- 如果选全升级的解决方案，一定要自己做充分的验证测试，才可以在生产环境升级。毕竟，未知的永远是可怕的。
- 本文在实验过程中遇到了很多插件版本兼容性问题，后面文档中的内容都是不断摸索、试错整理的，而且最终也没有完美解决。
- **再次强调，除非明确的知道你在做什么，能搞定所有变动带来对风险，否则不要轻易的在生产环境用该方案！！！**

> **说明：** 为了 get 一个新的技巧，本文后面的内容重点介绍手动自定义构建 **ks-jenkins Image** 的实战操作。

## 自定义构建 Jenkins 镜像

KubeSphere 使用的 Jenkins Image 是采用 GitHub 中 [ks-jenkins](https://github.com/kubesphere/ks-jenkins) 项目下的相关工具和配置进行打包的，该项目底层工具使用的是 jcli，具体说明可以查看项目介绍。

项目文档比较简单，没有一定的代码开发基础，实战起来还是比较困难的，我也是根据自己的理解和搜索引擎整理了操作过程，有些细节知识点并没有深入了解，目前也仅仅是解决了能打包的需求。

重新构建的镜像思路和方法是对的，但是整体的功能性与兼容性，并没有进行过充分测试，而且实战过程中也遇到了很多没有解决的问题，后续操作的价值仅限于参考。**生产环境使用请慎重。**

### 配置开发环境

1. 安装 Java 

从 Oracle [官网下载](https://www.oracle.com/java/technologies/downloads/#java8)软件包 **jdk-8u361-linux-x64.tar.gz**，这个需要自己注册账户才能下载。大家也可以使用自己习惯的方式配置 安装配置 JAVA 环境。

```bash
# 创建工具存放目录，并解压 jdk 软件包
mkdir /data/tools
tar xvf jdk-8u361-linux-x64.tar.gz -C /data/tools

# 配置 java profile
cat >> /etc/profile << "EOF"

# java environment
export JAVA_HOME=/data/tools/jdk1.8.0_361
export CLASSPATH=.:${JAVA_HOME}/jre/lib/rt.jar:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar
export PATH=$PATH:${JAVA_HOME}/bin
EOF

# 验证 Java
source /etc/profile
java -version

# 输出信息如下，表示 Java 安装成功
java version "1.8.0_361"
Java(TM) SE Runtime Environment (build 1.8.0_361-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.361-b09, mixed mode)
```

2. 安装 Maven

```bash
# 下载 并解压 Maven
wget https://archive.apache.org/dist/maven/maven-3/3.8.7/binaries/apache-maven-3.8.7-bin.tar.gz
tar xvf apache-maven-3.8.7-bin.tar.gz -C /data/tools/

# 配置 maven profile
cat >> /etc/profile << "EOF"

# maven environment
export M2_HOME=/data/tools/apache-maven-3.8.7
export PATH=$PATH:$M2_HOME/bin
EOF

# 验证 Maven
source /etc/profile
mvn -version

# 输出信息如下，表示 Maven 安装成功
Apache Maven 3.8.6 (84538c9988a25aec085021c365c560670ad80f63)
Maven home: /data/tools/apache-maven
Java version: 1.8.0_361, vendor: Oracle Corporation, runtime: /data/tools/jdk1.8.0_361/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "3.10.0-1160.83.1.el7.x86_64", arch: "amd64", family: "unix"
```

3. 安装 jcli

```bash
cd /tmp
curl -L https://github.com/jenkins-zh/jenkins-cli/releases/latest/download/jcli-linux-amd64.tar.gz | tar xzv
mv jcli /usr/local/bin/
```

> **说明：** 受限于网络原因，可能需要多次操作，最好是使用其他方式提前下载并传送到服务器。

4. 安装 Git（可选项）

安装 Git 的目的是从 GitHub 上拉取代码，也可以不使用 Git，直接在 GitHub 上下载打包好的代码文件。考虑 GitOps 配置管理及以后的扩展需求，本文重点介绍 Git 的方式。

CentOS 系统自带的 Git 版本比较老，在某些场景使用时会有版本兼容性问题。因此，选择了第三方的软件源安装新版的 Git。

```bash
# CentOS 7 安装 ius 软件源
curl https://setup.ius.io | sh

# 安装新版本 Git
yum install git236

# 验证 Git
git version

# 输出信息如下，表示 Git 安装成功
git version 2.36.4
```

5. 安装 Docker

构建镜像的过程中会直接生成 Jenkins Docker 镜像。因此，需要打包服务器安装 Docker 运行环境。

```bash
# 配置 Docker 安装源
cat >> /etc/yum.repos.d/docker.repo << "EOF"
[docker-ce-stable]
name=Docker CE Stable - $basearch
baseurl=https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/$releasever/$basearch/stable
enabled=1
gpgcheck=1
gpgkey=https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/gpg
EOF

# 安装 Docker
yum install docker-ce

# 配置 Docker
mkdir /etc/docker
cat >> /etc/docker/daemon.json << "EOF"
{
  "data-root": "/data/docker",
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com"
  ]
}
EOF

# 启动 Docker
systemctl start docker --now

# 验证 Docker
docker version

# 输出信息如下，表示安装成功
Client: Docker Engine - Community
 Version:           23.0.0
 API version:       1.42
 Go version:        go1.19.5
 Git commit:        e92dd87
 Built:             Wed Feb  1 17:49:02 2023
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          23.0.0
  API version:      1.42 (minimum version 1.12)
  Go version:       go1.19.5
  Git commit:       d7573ab
  Built:            Wed Feb  1 17:46:49 2023
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.16
  GitCommit:        31aa4358a36870b21a992d3ad2bef29e1d693bec
 runc:
  Version:          1.1.4
  GitCommit:        v1.1.4-0-g5fd4c4d
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0

# 安装 docker-compose，使用国内的镜像，官方 GitHub 上下载实在是太慢了。
curl -L https://get.daocloud.io/docker/compose/releases/download/v2.15.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod u+x /usr/local/bin/docker-compose

# 验证 docker-compose
docker-compose version

# 输出信息如下，表示安装成功
Docker Compose version v2.15.1
```

### 自定义构建镜像

1. 升级版本规划

- Jenkins：**2.375.3**，使用 LTS 最新版，具体版本信息查询 [入口](https://www.jenkins.io/download/)。
- Jenkins 2.375.3 镜像地址：**jenkins/jenkins:2.375.3**，具体 Image tag 信息查询 [入口](https://hub.docker.com/r/jenkins/jenkins/tags?page=1&name=375.3)。
- Plugins ssh-slaves：**1.834.v622da_57f702c**，插件版本及需要的 Jenkins 最低版本等详细信息查询 [入口](https://plugins.jenkins.io/ssh-slaves/)。
- Plugins prometheus：**2.1.1**，插件版本及需要的 Jenkins 最低版本等详细信息查询 [入口](https://plugins.jenkins.io/prometheus/)。

> **说明：** 初步只更新 Jenkins 版本和有关联的两个 Plugins 的版本，其他 Plugins 由于不清楚依赖关系及影响，暂时不动。
>
> 这也是一个试错的过程，在后续的测试中发现，仅仅修改两个插件的版本号是远远不够的。

2. 下载 ks-jenkins 代码

```bash
mkdir /data/build
cd /data/build
git clone https://github.com/kubesphere/ks-jenkins.git
```

> **说明：** 受限于网络原因，可能需要多次操作。

3. 创建一个新的代码分支

```bash
# 根据 Master 分支创建新分支，命名方式参考的已有分支
cd ks-jenkins
git checkout -b v3.3.0-2.375.3
```

4. 根据规划修改配置文件 **formula.yaml**

主要修改 jenkins 基础镜像的版本，插件 ssh-slaves 和 prometheus 的版本，同时因为依赖关系更新了这两个插件依赖的其他插件的版本。

> **说明：** 这个梳理插件之间的版本依赖关系的过程比较麻烦，我目前也没有找到更好的办法，都是在管理界面根据提示的需求修改的。

同时，还修改了 build 的一些参数，具体原因请查看常见问题。

修改后的主要内容大致如下：

```yaml
buildSettings:
  docker:
    base: jenkins/jenkins:2.375.3
    tag: {{.tag}}
    outputDir: {{.output}}
    build: true
war:
  groupId: org.jenkins-ci.main
  artifactId: jenkins-war
  source:
    version: 2.375.3
plugins:
  ......
  - groupId: org.jenkins-ci.plugins
    artifactId: ssh-slaves
    source:
      version: 1.834.v622da_57f702c
  - groupId: org.jenkins-ci.plugins
    artifactId: prometheus
    source:
      version: "2.1.1"
  - groupId: org.jenkins-ci.plugins
    artifactId: metrics
    source:
      version: 4.1.6.1
  - groupId: org.jenkins-ci.plugins.pipeline-stage-view
    artifactId: pipeline-rest-api
    source:
      version: "2.21"
  - groupId: org.jenkins-ci.plugins
    artifactId: trilead-api
    source:
      version: 1.57.v6e90e07157e1
  - groupId: org.jenkins-ci.plugins
    artifactId: credentials
    source:
      version: 1139.veb_9579fca_33b_
  - groupId: org.jenkins-ci.plugins
    artifactId: ssh-credentials
    source:
      version: 291.v8211e4f8efb_c
  - groupId: io.jenkins
    artifactId: configuration-as-code
    source:
      version: "1569.vb_72405b_80249"
```

> **注意：** 上面的配置文件只列出了部分插件的变更信息，并不是完整的，并没有实现完整的效果，仅供参考。

5. 修改构建配置文件 **Makefile**

主要修改 build 相关的内容

```makefile
build:
	jcli cwp --install-artifacts --config-path formula.yaml \
            --value-set output=tmp \
            --value-set tag=kubesphere/ks-jenkins:v3.3.0-2.375.3
```

6. 制作 Image

```bash
# 执行构建命令
make build

# 正确的构建会有类似下面的输出
[root@zdevops-main ks-jenkins]# make build
jcli cwp --install-artifacts --config-path formula.yaml \
            --value-set output=tmp \
            --value-set tag=kubesphere/ks-jenkins:v3.3.0-2.375.3
Feb 09, 2023 2:31:00 PM io.jenkins.tools.warpackager.lib.impl.Builder buildIfNeeded
INFO: Component org.jenkins-ci.main:jenkins-war:2.375.3: no build required
Feb 09, 2023 2:31:00 PM io.jenkins.tools.warpackager.lib.impl.Builder buildIfNeeded
INFO: Component io.jenkins:configuration-as-code:1.53: no build required
....

Feb 09, 2023 2:31:00 PM io.jenkins.tools.warpackager.lib.impl.Builder checkoutIfNeeded
INFO: Will checkout bundle-plugins from local directory: remove-bundle-plugins.groovy
[INFO] Scanning for projects...
[INFO] 
[INFO] ------------------< io.github.ks-jenkins:ks-jenkins >-------------------
[INFO] Building ks-jenkins 1.0-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
Downloading from repo.jenkins-ci.org: https://repo.jenkins-ci.org/public/org/jenkins-ci/main/jenkins-war/2.375.3/jenkins-war-2.375.3.pom
Downloaded from repo.jenkins-ci.org: https://repo.jenkins-ci.org/public/org/jenkins-ci/main/jenkins-war/2.375.3/jenkins-war-2.375.3.pom (6.4 kB at 625 B/s)
Downloading from incrementals: https://repo.jenkins-ci.org/incrementals/com/microsoft/azure/azure-client-runtime/maven-metadata.xml
...

INFO: Discovered hooks: init.groovy.d
Feb 09, 2023 4:14:50 PM io.jenkins.tools.warpackager.lib.util.DockerfileBuilder build
INFO: Generating Dockerfile
Feb 09, 2023 4:14:50 PM io.jenkins.tools.warpackager.lib.util.DockerfileBuilder build
INFO: Building Docker image kubesphere/ks-jenkins:v3.3.0-2.375.3
[+] Building 329.0s (7/7) FINISHED                                                               
 => [internal] load .dockerignore                                                           0.6s
 => => transferring context: 2B                                                             0.0s
 => [internal] load build definition from Dockerfile                                        0.8s
 => => transferring dockerfile: 295B                                                        0.0s
 => [internal] load metadata for docker.io/jenkins/jenkins:2.375.3                        126.8s
 => [internal] load build context                                                           2.3s
 => => transferring context: 334.65MB                                                       2.2s
 => [1/2] FROM docker.io/jenkins/jenkins:2.375.3@sha256:8656eb80548f7d9c7be5d1f4c367ef43  177.5s
 => => resolve docker.io/jenkins/jenkins:2.375.3@sha256:8656eb80548f7d9c7be5d1f4c367ef432f  0.2s
 => => sha256:f16216f97fcb99c68e03372f08859d8efd86e075e8bc22a0707d991b05 13.12kB / 13.12kB  0.0s
 => => sha256:8656eb80548f7d9c7be5d1f4c367ef432f2dd62f81efa86795c915525801 2.36kB / 2.36kB  0.0s
 => => sha256:ed0d0b4f22e27ee95718f7e701f5e189b58f8a4ffbc60b9769124ccabfb1 2.77kB / 2.77kB  0.0s
 => => sha256:699c8a97647f5789e5850bcf1a3d5afe9730edb654e1ae0714d5bd198 55.03MB / 55.03MB  47.3s
 => => sha256:656837bc63c37068f9786473270235ab4830753280df7f0350ad09fb0 51.63MB / 51.63MB  47.7s
 => => sha256:81ba850015575dd93d4b7b63eb5cb6a1aea458b325242ab10531b482cba 8.93MB / 8.93MB  34.5s
 => => sha256:f565cdb160feddd496a91f8857376382ff4e1b48333c1c0f994a1765bf3 1.24kB / 1.24kB  66.2s
 => => extracting sha256:699c8a97647f5789e5850bcf1a3d5afe9730edb654e1ae0714d5bd198a67a3ed   2.2s
 => => extracting sha256:656837bc63c37068f9786473270235ab4830753280df7f0350ad09fb0374f1ee   1.9s
 => => extracting sha256:81ba850015575dd93d4b7b63eb5cb6a1aea458b325242ab10531b482cba6d2f1   0.2s
 => => extracting sha256:f565cdb160feddd496a91f8857376382ff4e1b48333c1c0f994a1765bf3dd519   0.0s
 => => sha256:7f0db80857b0730f0a39ac7c71449bb1166d945c66bb6a1ea0fd6d75190e250 189B / 189B  79.0s
 => => extracting sha256:7f0db80857b0730f0a39ac7c71449bb1166d945c66bb6a1ea0fd6d75190e2505   0.0s
 => => sha256:b113c3f8acf6fadd7bf46f1085836b609f006c6582857c849361969394 5.68MB / 5.68MB  112.4s
 => => sha256:a02b1ab95401fafdd2c8a936bba450cdebe3182ffddb7d6ca8a319e52a8f3f5 199B / 199B  96.8s
 => => sha256:b51e09c8a0bdd4feb08358353f7214e20375f292d3e18ce11dabb77e 94.02MB / 94.02MB  112.3s
 => => sha256:90c616f07a2df86bef2ad9cc09ca44f34c9d0bc5e7bf6463c53037c7 76.93MB / 76.93MB  150.1s
 => => extracting sha256:b51e09c8a0bdd4feb08358353f7214e20375f292d3e18ce11dabb77e3b21a2a2   0.6s
 => => extracting sha256:a02b1ab95401fafdd2c8a936bba450cdebe3182ffddb7d6ca8a319e52a8f3f53   0.0s
 => => extracting sha256:b113c3f8acf6fadd7bf46f1085836b609f006c6582857c849361969394671a06   0.2s
 => => sha256:32fdd8eaf030672618b17bb89dfd41e06b48b4e5698b5d749b7df02ceb 1.17kB / 1.17kB  143.6s
 => => sha256:22b92623028315e2f81b64231e48c1e8cc5656c2d95b4d43dbea67f1ff 1.93kB / 1.93kB  143.6s
 => => sha256:e04af8aa1a0565689acfc84c92700ee9726771b3e9f2fb14139c382dce6f39 374B / 374B  174.7s
 => => sha256:3938fe646b557890e41807ff23870f648fd4eed439d13bc617f3d1f267e56a 269B / 269B  174.9s
 => => extracting sha256:90c616f07a2df86bef2ad9cc09ca44f34c9d0bc5e7bf6463c53037c786653ee2   2.0s
 => => extracting sha256:22b92623028315e2f81b64231e48c1e8cc5656c2d95b4d43dbea67f1ff8b7fb4   0.0s
 => => extracting sha256:32fdd8eaf030672618b17bb89dfd41e06b48b4e5698b5d749b7df02ceba2d8db   0.0s
 => => extracting sha256:e04af8aa1a0565689acfc84c92700ee9726771b3e9f2fb14139c382dce6f3979   0.0s
 => => extracting sha256:3938fe646b557890e41807ff23870f648fd4eed439d13bc617f3d1f267e56ae4   0.0s
 => [2/2] ADD target/ks-jenkins-1.0-SNAPSHOT.war /usr/share/jenkins/jenkins.war            21.8s
 => exporting to image                                                                      2.0s
 => => exporting layers                                                                     1.9s
 => => writing image sha256:23c59911c9309bb8436716797ab488e80b3d7dbeea0135c9b8c9faa230d24f  0.0s
 => => naming to docker.io/kubesphere/ks-jenkins:v3.3.0-2.375.3
```

> **注意：** 构建过程会通过 Maven 下载很多依赖包，具体时长视网络和机器配置而定。

### 镜像验证

镜像构建完成后，我们需要验证镜像是否可用，新的镜像是否符合安全需求。

1. 查看构建的 Image

```bash
[root@zdevops-main ks-jenkins]# docker images
REPOSITORY              TAG              IMAGE ID       CREATED              SIZE
kubesphere/ks-jenkins   v3.3.0-2.375.3   23c59911c930   About a minute ago   801MB
```

2. 验证 Image 是否可用

一定要验证构建的 Image 是否能创建 Jenkins，并正常使用。

在开发服务器上使用 Docker 启动一个 Jenkins。

```bash
# 创建容器运行目录（个人习惯）
mkdir -p /data/containers/jenkins/volumes/jenkins_home
cd /data/containers/jenkins/
chown 1000:1000 volumes/jenkins_home/

# 创建 docker-compose.yml
cat >> docker-compose.yml << "EOF"
version: '3'
services:
  jenkins:
    image: 'kubesphere/ks-jenkins:v3.3.0-2.375.3'
    container_name: jenkins
    privileged: true
    restart: always
    ports:
      - '8080:8080'
      - '50000:50000'
    volumes:
      - './volumes/jenkins_home:/var/jenkins_home'
EOF

# 运行 Jenkins
docker-compose up -d

# 运行结果正常如下
[+] Running 2/2
 ⠿ Network jenkins_default  Created                                                                    0.1s
 ⠿ Container jenkins        Started                                                                    0.7s

# 查看容器是否成功启动
[root@zdevops-main jenkins]# docker-compose ps
NAME                IMAGE                                  COMMAND                  SERVICE             CREATED              STATUS              PORTS
jenkins             kubesphere/ks-jenkins:v3.3.0-2.375.3   "tini -- /usr/local/…"   jenkins             About a minute ago   Up About a minute   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp, 0.0.0.0:50000->50000/tcp, :::50000->50000/tcp
```

3. 验证 Jenkins 是否正常

登录 Jenkins 管理控制台，需要输入系统初始化密码 `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`。

登录后，跳过系统初始化，直接进「系统管理」即可（截图略）。

> **注意：** 实际操作中，插件管理里有很多**红色**的警告，我也是根据警告不断的调整不同插件的版本，再次打包再次验证。
>
> 简单的方案是在界面把所有存在问题的插件告警都处理完，然后根据最终结果，整理配置文件中插件版本号，然后再次打包。

4. 验证漏洞是否修复

> 检查请求响应头，发现 **Jetty** 版本依旧**不符合**要求的 **11.0.7**。

```bash
[root@zdevops-main ~]# curl -I 192.168.9.10:8080
HTTP/1.1 403 Forbidden
Date: Fri, 10 Feb 2023 02:43:37 GMT
X-Content-Type-Options: nosniff
Set-Cookie: JSESSIONID.cb5c1002=node0qid22cxyj1f81jjc8verbvj5e2.node0; Path=/; HttpOnly
Expires: Thu, 01 Jan 1970 00:00:00 GMT
Content-Type: text/html;charset=utf-8
X-Hudson: 1.395
X-Jenkins: 2.375.3
X-Jenkins-Session: d2fd27f1
Content-Length: 541
Server: Jetty(10.0.12)
```

> 检查 log4j 相关的 jar 包，只存在一个 log4j-over-slf4j 的包且已经是比较新的版本

```bash
[root@zdevops-main jenkins_home]# find ./ -name "log4j*"
./war/WEB-INF/lib/log4j-over-slf4j-2.0.3.jar
```

5. 验证结论

新构建的镜像 Jetty 版本并不符合安全要求，log4j 相关的包符合要求。

根据配置文件构建的镜像测试效果并不完美，很多插件无法使用，主要问题在于插件的兼容性问题。这个也确实是我们测试之前担心的，暂时我也没有更好的解决办法。

如果有强烈的更新需求，建议使用新版的 Jenkins 构建镜像，部署完成后从插件管理里解决插件依赖问题。

## 替换 KubeSphere 使用的 Jenkins Image

鉴于自定义构建 Jenkins Image 的结果并不完美。因此，本节后面的操作，**切记不要轻易在生产环境直接使用**！仅把思路和操作方法提供给各位，作为参考。如果要在生产环境使用，一定要经过充分的测试验证。

### 将自定义的 Jenkins 镜像传送到服务

如果使用离线镜像自定义域名部署的集群，推送镜像到内网 Harbor 仓库 (此过程略)。

如果用的在线互联网的镜像，比如我的环境就是使用的 **registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.3.0-2.319.1**。 手工推送镜像到服务器并修改 tag 名字。

```bash
# 在打包服务器导出自定义构建的 Image
docker tag kubesphere/ks-jenkins:v3.3.0-2.375.3 registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.3.0-2.375.3
docker save registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.3.0-2.375.3 -o ks-jenkins-v3.3.0-2.375.3.tar

# 上传到 devops-jenkins 所在的服务器（过程略）

# 在 devops-jenkins 服务器导入, 没有 docker 命令，只能用 ctr 命令
ctr -n k8s.io image import ks-jenkins-v3.3.0-2.375.3.tar

# 验证镜像是否导入
ctr -n k8s.io image ls |grep jenkins
```

### 修改 Deployment devops-jenkins 的配置

如果采用的在线互联网镜像的模式，需要更改两个配置项，**image** 和 **imagePullPolicy**，默认的 imagePullPolicy 为 Always，需要修改为 **IfNotPresent**。

有条件的尽量使用自建的镜像仓库，只需要修改 Image 配置即可。

```bash
# 执行修改命令
kubectl edit deploy devops-jenkins -n kubesphere-devops-system

# 修改的主要内容如下（一共有两处相同的内容需要修改）
# 原始内容
image: registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.3.0-2.319.1
imagePullPolicy: Always

# 修改后
image: registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.3.0-2.375.3
imagePullPolicy: IfNotPresent
```

> **注意：** 修改完成后保存退出，Deploy 会发现配置变更自动重建 Pod。

### 验证状态

1. 查看 deployment

```bash

[root@ks-k8s-master-0 ~]# kubectl get  deploy -n kubesphere-devops-system -o wide
NAME                READY   UP-TO-DATE   AVAILABLE   AGE    CONTAINERS       IMAGES                                                                    SELECTOR
devops-apiserver    1/1     1            1           102d   ks-devops        registry.cn-beijing.aliyuncs.com/kubesphereio/devops-apiserver:v3.3.0     app.kubernetes.io/instance=devops,app.kubernetes.io/name=ks-devops,devops.kubesphere.io/component=apiserver
devops-controller   1/1     1            1           102d   ks-devops        registry.cn-beijing.aliyuncs.com/kubesphereio/devops-controller:v3.3.0    app.kubernetes.io/instance=devops,app.kubernetes.io/name=ks-devops,devops.kubesphere.io/component=controller
devops-jenkins      1/1     1            1           102d   devops-jenkins   registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.3.0-2.375.3   component=devops-jenkins-master
```

2. 验证 Pod

```bash
# 查看 pod
[root@ks-k8s-master-0 ~]# kubectl get  pod -n kubesphere-devops-system -o wide
NAME                                 READY   STATUS      RESTARTS      AGE     IP               NODE              NOMINATED NODE   READINESS GATES
devops-27932190-njblk                0/1     Completed   0             88m     10.233.116.37    ks-k8s-master-2   <none>           <none>
devops-27932220-xrgnj                0/1     Completed   0             58m     10.233.116.38    ks-k8s-master-2   <none>           <none>
devops-27932250-rvl2r                0/1     Completed   0             28m     10.233.116.39    ks-k8s-master-2   <none>           <none>
devops-apiserver-6b468c95cb-grx4j    1/1     Running     2 (32h ago)   102d    10.233.116.211   ks-k8s-master-2   <none>           <none>
devops-controller-667f8449d7-w8mvf   1/1     Running     2 (32h ago)   102d    10.233.117.173   ks-k8s-master-0   <none>           <none>
devops-jenkins-56d7d75d9-zj7lh       1/1     Running     0             4m34s   10.233.117.177   ks-k8s-master-0   <none>           <none>
s2ioperator-0                        1/1     Running     2 (32h ago)   102d    10.233.87.33     ks-k8s-master-1   <none>           <none>
```

> **注意：** 启动过程较慢，需要多刷新几次，确保状态 READY 值为 1/1

3. 登录 Jenkins 管理界面

   确保能正常登录系统。

   系统管理里没有明显报错。

   原有的 Jenkins 项目都能查看。

4. 验证原有的流水线任务

   执行原有的流水线任务，检查任务是否能正常执行，并且结果符合预期。

## 常见问题

### 采用默认配置文件时 build 失败

- 报错信息

```bash
[root@zdevops-main ks-jenkins]# make build
jcli cwp --install-artifacts --config-path formula.yaml \
            --value-set output=load \
            --value-set tag=kubespheredev/ks-jenkins:test \
            --value-set platform=linux/amd64
Exception in thread "main" com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException: Unrecognized field "output" (class io.jenkins.tools.warpackager.lib.config.DockerBuildSettings), not marked as ignorable (5 known properties: "base", "tag", "outputDir", "build", "customSettings"])
 at [Source: (FileInputStream); line: 10, column: 17] (through reference chain: io.jenkins.tools.warpackager.lib.config.Config["buildSettings"]->io.jenkins.tools.warpackager.lib.config.BuildSettings["docker"]->io.jenkins.tools.warpackager.lib.config.DockerBuildSettings["output"])
        at com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException.from(UnrecognizedPropertyException.java:61)
        at com.fasterxml.jackson.databind.DeserializationContext.handleUnknownProperty(DeserializationContext.java:855)
        at com.fasterxml.jackson.databind.deser.std.StdDeserializer.handleUnknownProperty(StdDeserializer.java:1212)
        at com.fasterxml.jackson.databind.deser.BeanDeserializerBase.handleUnknownProperty(BeanDeserializerBase.java:1604)
        at com.fasterxml.jackson.databind.deser.BeanDeserializerBase.handleUnknownVanilla(BeanDeserializerBase.java:1582)
        at com.fasterxml.jackson.databind.deser.BeanDeserializer.vanillaDeserialize(BeanDeserializer.java:299)
        at com.fasterxml.jackson.databind.deser.BeanDeserializer.deserialize(BeanDeserializer.java:156)
        at com.fasterxml.jackson.databind.deser.impl.FieldProperty.deserializeAndSet(FieldProperty.java:138)
        at com.fasterxml.jackson.databind.deser.BeanDeserializer.vanillaDeserialize(BeanDeserializer.java:293)
        at com.fasterxml.jackson.databind.deser.BeanDeserializer.deserialize(BeanDeserializer.java:156)
        at com.fasterxml.jackson.databind.deser.impl.FieldProperty.deserializeAndSet(FieldProperty.java:138)
        at com.fasterxml.jackson.databind.deser.BeanDeserializer.vanillaDeserialize(BeanDeserializer.java:293)
        at com.fasterxml.jackson.databind.deser.BeanDeserializer.deserialize(BeanDeserializer.java:156)
        at com.fasterxml.jackson.databind.ObjectMapper._readMapAndClose(ObjectMapper.java:4526)
        at com.fasterxml.jackson.databind.ObjectMapper.readValue(ObjectMapper.java:3505)
        at io.jenkins.tools.warpackager.lib.config.Config.load(Config.java:77)
        at io.jenkins.tools.warpackager.lib.config.Config.loadConfig(Config.java:106)
        at io.jenkins.tools.warpackager.cli.Main.main(Main.java:38)
make: *** [build] Error 1
```

- 解决方案

经过简单分析，判断应该是现有的 ks-jenkins 代码库已经好几个月没有更新，使用的底层 jcli 不断在更新，导致现有版本的 **cwp-cli.jar** 的输入参数与默认配置文件中使用的配置不匹配。解决方案有两种：

- 下载老版本的 cwp-cli 的 jar 包，具体方法只能靠各位自己研究了，我不熟悉也没深入探究。
- 根据当前版本的参数要求，修改配置文件 **formula.yaml**(比较简单，因此本文采用了该方案)。

```yaml
# 原配置文件内容
buildSettings:
  docker:
    base: jenkins/jenkins:2.319.1
    tag: {{.tag}}
    output: {{.output}}
    platform: {{.platform}}
    buildx: true
    build: true
    
# 修改后的配置文件
buildSettings:
  docker:
    base: jenkins/jenkins:2.375.3
    tag: {{.tag}}
    outputDir: {{.output}}
    build: true
```

### Jenkins 系统管理界面中插件管理显示很多红色警告信息

- 报错信息

不截图了，主要是在 Jenkins 的系统管理界面中插件管理的页面，会显示很多红色警告信息。有插件版本依赖关系、插件降级等红色或是黄色的提示。

- 解决方案

目前看来最简单的解决方案是在插件管理的页面根据提示解决。

如果想自动打包镜像的时候就处理好插件的依赖，我感觉还是需要在 **jcli** 这个工具入手。官方文档不够详细，资料也少，暂时没时间和精力去深入探究。所以先放弃了，后续有新的研究成果再分享。

但是 Jenkins 本身的问题解决后，与现有的 KubeSphere 是否兼容还需要充分验证。

## 结束语

本文以修复 Jenkins 存在的 Apache Log4j2 漏洞为背景，介绍了修复该漏洞的两种解决方案。并且，初步探究了在 KubeSphere 中集成的 Jenkins 如何自定义构建镜像以及如何升级更新。

探究过程并不是很完美，效果并没有达到预期。主要是由于插件依赖性的问题，导致自定义构建的镜像部署的 Jenkins 插件管理里存在很多告警。

由于能力和时间很有限，只能以一个不完美的结果结束本文了，非常抱歉！

因此，本文仅作为抛砖引玉之作，实战过程不适合在生产环境直接使用。动手能力超强的读者可将文中的思路和操作方法作为参考，继续改造。如果有更加完美的解决办法，请联系我分享给我，我将不胜感激！
