---
title: '基于 Kubernetes 的 CI/CD 利器 — Prow 入门指南'
tag: 'CI/CD,Kubernetes'
createTime: '2019-08-20'
author: 'Magic Song'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20190930122613.png'
---


**Prow**是k8s使用的CI/CD系统(<https://github.com/kubernetes/test-infra/tree/master/prow>)，用于管理k8s的issue和pr。如果你经常去k8s社区查看pr或者提交过一些Pr后，就会经常看到一个叫**k8s-ci-bot**的机器人在各个Pr中回复，并且还能合并pr。在k8s-ci-bot中背后工作的就是Prow。Prow是为了弥补github上一些功能上的缺陷，它也是Jenkins-X的一部分，它具备这些功能：

1. 执行各种Job，包括测试，批处理和制品发布等，能够基于github webhook配置job执行的时间和内容。
2. 一个可插拔的机器人功能（**Tide**），能够接受`/foo`这种样式的指令。
3. 自动合并Pr
4. 自带一个网页，能够查看当前任务的执行情况以及Pr的状况，也包括一些帮助信息
5. 基于OWNER文件在同一个repo里配置模块的负责人
6. 能够同时处理很多repo的很多pr
7. 能够导出Prometheus指标

Prow拥有自己的CI/CD系统，但是也能与我们常见的CI/CD一起协作，所以如果你已经习惯了Jenkins或者travis，都可以使用Prow。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190930122309.png)

## 安装指南

> 官方repo提供了一个基于GKE快速安装指南，本文将基于青云的Iaas搭建Prow环境。不用担心，其中大部分步骤都是平台无关的，整个安装过程能够很方便的在其他平台上使用。

### 一、 准备一个kubernetes集群

有以下多种方式准备一个集群

1. 利用kubeadm自建集群
2. 在青云控制台上点击左侧的容器平台，选择其中的QKE，简单设置一些参数之后，就可以很快创建一个kubernetes集群。
3. 将集群的kubeconfig复制到本地，请确保在本地运行`kubectl cluster-info`正确无误

### 二、 准备一个github机器人账号
> 如果没有机器人账号，用个人账号也可以。机器人账号便于区分哪些Prow的行为，所以正式使用时应该用机器人账号。

1. 在想要用prow管理的仓库中将机器人账号设置为管理员。
2. 在账号设置中添加一个[personal access token][1]，此token需要有以下权限：

   + **必须**：`public_repo` 和 `repo:status`
   + **可选**：`repo`假如需要用于一些私有repo
   + **可选**：`admin_org:hook` 如果想要用于一个组织
3. 将此Token保存在文件中，比如`${HOME}/secrets/oauth`
4. 用`openssl rand -hex 20`生成一个随机字符串用于验证webhook。将此字符串保存在本地，比如`${HOME}/secrets/h-mac`

*注意最后两步创建的token一定需要保存好，除了需要上传到k8s，后续配置也要用到，用于双向验证*

### 三、 配置k8s集群
> 这里使用的default命名空间配置prow，如果需要配置在其他命名空间，需要在相关`kubectl`的命令中配置`-n`参数，并且在部署的yaml中配置命名空间。
> 建议将[本repo](https://github.com/magicsong/prow-tutorial)克隆到本地，这个repo带有很多帮助配置Prow的小工具。


1. 将上一步中创建token和hmac保存在k8s集群中
```bash
# openssl rand -hex 20 > ${HOME}/secrets/h-mac
kubectl create secret generic hmac-token --from-file=hmac=${HOME}/secrets/h-mac
kubectl create secret generic oauth-token --from-file=oauth=${HOME}/secrets/oauth
```
2. 部署Prow。由于Prow官方yaml中使用了grc.io镜像，这个镜像在中国大陆无法访问，所以我们将相应的repo搬到了dockerhub上，并提供了一份替换相关镜像名称的[yaml](prow.yaml)，利用下面的命令即可部署Prow（使用的这个repo修改后的yaml）
```bash
kubectl apply -f https://raw.githubusercontent.com/magicsong/prow-tutorial/master/prow.yaml
```
3. 使用 `kubectl get pod`看到所有Pod都running表示安装已经完成。如下图：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190930123654.png)

4. 配置外网访问

+  如果使用的QKE，那么集群默认带有[`LoadBalancer Controller`](https://github.com/yunify/qingcloud-cloud-controller-manager)。如果只是一个单独集群，那么只需要按照<https://github.com/yunify/qingcloud-cloud-controller-manager)>中的安装即可，安装非常方便。
+  Prow官方采用的是ingress配置外网访问，所以我们需要配置`ingress-controller`。QKE默认带有一个`ingress-controller`，在`kubesphere-control-system`中。如果集群中还没有`ingress-controller`，需要安装一个。[官方文档](https://kubernetes.github.io/ingress-nginx/deploy/)中还没有青云的配置指南，需要安装下面的指令安装`ingress-controller`：

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/mandatory.yaml
kubectl apply -f https://raw.githubusercontent.com/magicsong/prow-tutorial/master/manifest/ingress-service.yaml #这个命令QKE需要执行
```
执行上述两条命令之后，敲`kubectl get svc -n ingress-nginx`，等待获取公网IP即可，如下图（如果需要手动指定公网IP，参考LB的[配置文档](https://github.com/yunify/qingcloud-cloud-controller-manager/blob/master/docs/configure.md)配置`ingress-nginx`这个service）：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190930123738.png)

**注意**如果使用的QKE，需要执行上面两个命令中的第二个命令。第二个命令对应的yaml就是[ingrsss](manifest/ingress-service.yaml)，在apply之前需要将其中的namespace修改为`kubesphere-control-system`。

5. 访问Prow地址，默认应该为刚才的ingress的公网ip+端口8080，应该能在页面中看到一个`Echo Test`的任务。访问效果如下：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190930123817.png)

**恭喜你！你已经拥有了一个prow集群，这个集群已经准备工作了，下一步就是要做一些配置工作，以使得Prow能按照我们的意图工作。**

## 配置指南
> Prow配置较为复杂，这里只演示最小配置，能让我们的Pr机器人工作起来

### 工具准备
1. 安装[bazel](https://docs.bazel.build/versions/master/install.html)。Bazel是google公司用来构建k8s代码的一个工具，同样prow也是用bazel构建的。后续的配置都是用bazel动态生成的工具来配置的（类似于`go run  ./pkg/tool -a -b`）。如果你身处非大陆地区，也可以不用Bazel，直接时候用`go get`来获取静态binay执行命令。
2. 如果要使用`bazel`，安装完成之后需要将整个仓库<https://github.com/kubernetes/test-infra> 整个仓库clone下来，用于Bazel运行命令的仓库。clone完成之后cd 进入这个repo的根目录

### 配置webhook
> Prow是基于webhook工作的，github上的活动会发送给处理


1. 选择一个github仓库配置webhook。执行下面的命令添加一个repo，需要替换掉其中的`hmac-path`和`github-token-path`，hook的地址是上面的prow地址加一个”/hook“：
```bash
# Ideally use https://bazel.build, alternatively try:
#   go get -u k8s.io/test-infra/experiment/add-hook && add-hook
bazel run //experiment/add-hook -- \
  --hmac-path=/path/to/hook/secret \
  --github-token-path=/path/to/oauth/secret \
  --hook-url http://an.ip.addr.ess/hook \
  --repo my-org/my-repo \
  --repo my-whole-org \
  --confirm=false  # Remove =false to actually add hook
```
2. 如果运行没问题，那么需要将最后一行改为`--confirm=true`。运行成功后，在repo的webhooks配置中，应该能看到一个新的webhook：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190930123838.png)

### 配置集群使用的插件
> Prow是以插件机制运行的，类似CoreDNS那种，没有插件就什么都不做，但是依然能正常运行。我们需要配置我们的repo需要哪些插件

1. 官方提供了不少插件，在上面的Prow页面中就能看到一些，现在演示如何使用内置的一些插件。首先创建一个`plugins.yaml`的文件，如下：
```yaml
plugins:
  github.com/kubesphere-test/prow-tutorial:
  - size
  - cat
  - dog
  - pony
  - yuks
  - label
  - trigger
  - approve
  - lgtm
```
2. 创建一个空白的`config.yaml`，这个文件将会在后续配置任务中使用，插件配置部分留空即可。
3. 如果安装了bazel，那么进入`test-infra`这个目录，执行下面的命令(记得替换其中的相关文件的路径)，这个命令会检查`config.yaml`和`plugins.yaml`的配置是否正确：
```bash
bazel run //prow/cmd/checkconfig -- --plugin-config=path/to/plugins.yaml --config-path=path/to/config.yaml
```
4. 检查无误之后就可以将plugins.yaml上传到集群中（替换其中的路径）：
```bash
kubectl create configmap plugins \
  --from-file=plugins.yaml=${PWD}/samples/plugins.yaml --dry-run -o yaml \
  | kubectl replace configmap plugins -f -
```
5. 这样`size`插件就完成了。可以提一个Pr，效果应该如下图：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190930123848.png)

6. 上述演示中还安装了很多好玩的插件，可以参考prow页面中帮助页面，学习如何使用这些命令。

### 配置Tide机器人
> tide机器人最主要的功能就是自动合并Pr，当设定的目标达成时，tide机器人就会自动将代码Merge进主分支。Tide的完整的配置较为复杂，这里演示一个基本的配置，无需修改很多就能运行。

1. 在上述config.yaml中加入下列字段(请修改相应的repo和相应的tide页面)：
```yaml
tide:
  merge_method:
    kubesphere-test/prow-tutorial: squash

  target_url: http://139.198.121.161:8080/tide
  queries:
  - repos:
    - kubesphere-test/prow-tutorial
    labels:
    - lgtm
    - approved
    missingLabels:
    - do-not-merge
    - do-not-merge/hold
    - do-not-merge/work-in-progress
    - needs-ok-to-test
    - needs-rebase

  context_options:
    # Use branch protection options to define required and optional contexts
    from-branch-protection: true
    # Treat unknown contexts as optional
    skip-unknown-contexts: true
    orgs:
      org:
        required-contexts:
        - "check-required-for-all-repos"
        repos:
          repo:
            required-contexts:
             - "check-required-for-all-branches"
            branches:
              branch:
                from-branch-protection: false
                required-contexts:
                - "required_test"
                optional-contexts:
                - "optional_test"
```

2. 执行下面的命令将config.yaml推送到k8s集群中(替换相应的config.yaml文件位置)：
```bash
kubectl create configmap config --from-file=config.yaml=${PWD}/samples/config.yaml --dry-run -o yaml | kubectl replace configmap config -f -
```
3. 去刚才的 pr 上看，应该可以看到下面的 check：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190930123905.png)

4. 由于这是我提的Pr，所以自动会带上`approved`标签，现在只要添加一个`lgtm`的标签就可以。需要找代码Review的人看过代码，然后让他们输入`/lgtm`的评论即可，Prow会自动打上`lgtm`的标签。（由于这次演示没有其他人打/lgtm，并且自己无法给自己评论`/lgtm`,所以本次演示需要手动给这个pr在lables中选择lgtm的标签）。效果如下图：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190930123927.png)

## 高级配置

Prow是一个高效的CI/CD系统，也是一个复杂的系统，本文无法阐述所有的高级配置，更深入的配置可以参考官方文档。本Repo整理了一些常用的脚本，方便后续使用Prow的时候进行配置。使用这些脚本时，请注意替换一些数据。更多的高级配置请参考 [OWNERS](https://github.com/magicsong/prow-tutorial/blob/master/owner.md)。
