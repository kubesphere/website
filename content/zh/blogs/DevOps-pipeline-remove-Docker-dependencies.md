---
title: 'DevOps 流水线如何去除 Docker 依赖'
tag: 'Kubernetes,KubeSphere,Docker,DevOps'
keywords: 'Kubernetes, KubeSphere, Docker,DevOps '
description: '在 1.20 版本之后, Kubernetes 社区放弃了对 Docker 的支持, 但并不是说未来 Docker 将无法使用。本文主要是针对非 Docker 驱动的 Kubernetes 集群下，给出一个可行的 CI/CD 方案。'
createTime: '2021-04-02'
author: ' 陈少文'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/DevOps.png'
---

## 前言

在 1.20 版本之后, Kubernetes 社区放弃了对 Docker 的支持, 但并不是说未来 Docker 将无法使用。本文主要是针对非 Docker 驱动的 Kubernetes 集群下，给出一个可行的 CI/CD 方案。如果你对非 Docker 环境下进行 CI/CD 也有需求，欢迎一起讨论方案。

阅读本文需要一些基础，这些包括:

- 熟悉 KubeSphere Devops，能独立阅读文档进行自定义配置
- 熟练使用流水线功能

不建议刚接触 DevOps 的人阅读本文。由于这种变更对用户影响较大，后面的版本中，希望能达成统一的实践，再集成到产品中，预期会支持 Containerd、cri-o、Kind 等。

## 测试环境描述

安装非 Docker 集群可以参考[文档](https://ask.kubesphere.io/forum/d/3054-dockerkubernetes) ，执行如下命令, 查看 Kubernetes 版本:

```bash
kubectl version

Client Version: version.Info{Major:"1", Minor:"17", GitVersion:"v1.17.9", GitCommit:"4fb7ed12476d57b8437ada90b4f93b17ffaeed99", GitTreeState:"clean", BuildDate:"2020-07-15T16:18:16Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"17", GitVersion:"v1.17.9", GitCommit:"4fb7ed12476d57b8437ada90b4f93b17ffaeed99", GitTreeState:"clean", BuildDate:"2020-07-15T16:10:45Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}
```

执行如下命令, 查看 containerd 版本:

```bash
containerd --version

containerd github.com/containerd/containerd v1.4.3 269548fa27e0089a8b8278fc4
```

## 去除 KubeSphere DevOps 对 Docker 的依赖

主要有两点:

- Docker Volumes
- docker.sock

下面主要针对这两个依赖进行配置。请参考[文档](https://kubesphere.com.cn/docs/devops-user-guide/how-to-use/jenkins-setting/#%E4%BF%AE%E6%94%B9-configmap)对 CasC 进行修改。

![](https://pek3b.qingstor.com/kubesphere-community/images/1614235951-198104-image.png)

如上图，以 Maven 为例，主要有三点需要修改:

- 添加特权模式启动
- 将 docker.sock 挂载，改为 /var/lib/containers 
- 将缓存路径改为主机绝对路径

最后别忘了重启 Jenkins 或重新加载配置。

## 流水线改造

这里主要用于测试，因此没有将 Podman 安装到基础镜像中，而是在流水线中实时安装。生产环境，应该提前安装，以加快执行速度。

以 [devops-maven-sample](https://github.com/kubesphere/devops-maven-sample) 为例，流水线中主要需要增加如下部分：

```groovy
        stage ('install podman') {
            steps {
                container ('maven') {
                    sh '''
                    curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable.repo https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/CentOS_7/devel:kubic:libcontainers:stable.repo
                    yum -y install podman
                    mv  /usr/bin/docker /usr/bin/docker_ce
                    ln -s /usr/bin/podman /usr/bin/docker
                    '''
                }
            }
        }
```

相关脚本，已经更新到 [Podman](https://github.com/kubesphere/devops-maven-sample/tree/podman) 分支中。

## 测试 devops-maven-sample 项目

使用 devops-maven-sample 创建 SCM 流水线，Jenkinsfile 路径设置为 Jenkinsfile-online，并配置好相关的秘钥值。

最后执行时，在 Podman 分支上可以看到如下日志：

![](https://pek3b.qingstor.com/kubesphere-community/images/1614237295-982966-image.png)

在 DockerHub 上可以查看到推送的镜像：

![](https://pek3b.qingstor.com/kubesphere-community/images/1614237330-638516-image.png)

在 KubeSphere 中可以看到项目部署成功：

![](https://pek3b.qingstor.com/kubesphere-community/images/1614237379-95947-image.png)

## 总结

本文主要提供了一种在非 Docker 驱动的 Kubernetes 集群中，进行 CI/CD 镜像构建的思路，使用 Podman 替换 Docker。选择 Podman 的原因是, 其使用方式更贴近 Docker，而 Buildah 需要用户修改镜像编译指令，因为 Buildah 使用的是 buildah bud。

[扩展阅读](https://www.chenshaowen.com/blog/using-podman-to-build-images-under-kubernetes-and-jenkins.html)