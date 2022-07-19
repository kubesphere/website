---
title: 使用 KubeKey 进行闪电交付
description: 本次分享将主要介绍和演示如何通过 KubeKey 自定义自己的离线包制品，且使用该制品进行离线部署，最终实现自定义集群的闪电交付。
keywords: KubeSphere, Kubernetes, KubeKey
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=212770737&bvid=BV14a41147v5&cid=566741358&page=1&high_quality=1
  type: iframe
  time: 2022-03-31 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

如何正确，便捷地在离线环境中交付 Kubernetes 集群一直是用户的难点和痛点。KubeKey v2.0.0 版本中新增了清单（manifest）和制品（artifact）的概念，为用户提供了一种全新的，可自定义的，离线部署 Kubernertes 集群的解决方案。本次分享将主要介绍和演示如何通过 KubeKey 自定义自己的离线包制品，且使用该制品进行离线部署，最终实现自定义集群的闪电交付。

## 讲师简介

李耀宗，目前就职于青云科技公司容器研发部，开源爱好者，KubeKey Maintainer，Installtion SIG 成员。目前主要负责 KubeKey v2.0.0 相关开发工作。

Tanguofu，KubeSphere Member，KubeKey Maintainer。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/kubekey0331-live.png)

## 直播时间

2022 年 03 月 31 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220331` 即可下载 PPT。

## Q & A 

### Q1：使用 KubeKey 进行升级集群的时候，KubeKey 升级的逻辑是什么样的？会先驱逐业务到其他节点逐个升级 node 节点么？会影响业务吗？多 master 的情况是逐个 master 进行升级后在逐个升级 node 节点么？

A：升级逻辑是升级 master 节点 -> 升级 worker 节点 -> 升级 KubeSphere。
升级节点的时候不会驱逐当前节点的容器。
升级时并不会影响业务，因为升级仅和集群本身的组件有关。
按照先升级 master 再升级 worker 的顺序，逐个升级所有节点。

### Q2：使用 KubeKey 添加节点的时候，看到日志显示会同样把 ISO 依赖 scp 到现有的 node 节点，这个是有什么特殊考虑么？应该只需要把文件传到新添加的 node 节点上吧？

A：是为了支持在添加节点时，也可以对集群已存在的节点进行安装依赖的操作。

### Q3：使用 KubeKey 安装的集群有自动更新证书的功能，请问这个自动更新是在什么时候更新？是每天都会检查更新，还是距离到期一定时间之后进行更新？这个功能是否可以手动进行关闭或者开启？或者有没有配置的地方进行配置？
 
A：这个功能是通过 systemd 管理的一个 timer。每天都会检查证书到期时间，并且在到期前一个月自动更新证书。KubeKey 2.0.0 中，该功能默认打开且没有选项可以控制该功能的开关，若需要关闭可停止掉该 systemd 的服务。之后的版本中会增加控制该功能开关的选项。

### Q4：如何实现从云端集群添加 node 节点？

A：和正常添加节点同样的操作。

### Q5：KubeKey 制作离线包的时候，拉取镜像时太慢，官方能否提供离线包，KubeKey 制作离线包出现中断后，重新执行打包还会从头拉取，这样太耗时了。

A：KubeKey 的愿景就是能够给用户提供方便制作离线包的方法，用户可根据自己的实际情况自由的制作离线包。如果当前网络环境不佳，拉取镜像很慢，可能是因为 manifest 文件中的 images 列表里面的镜像仓库地址都是 `docker.io/xxx/xxx:tag`。有两种方法可以解决这个问题：
- 手动修改这个列表，比如可以修改成 `registry.cn-beijing.aliyuncs.com/kubesphereio/xxx.tag`，这个是 KubeSphere 社区提供的国内镜像仓库。也可以修改成自己的私有镜像仓库。这样kk会通过列表中的镜像仓库地址拉取镜像。
- 在一台联网空闲环境中执行 `export kkzone=cn`，然后部署一套 K8s 环境。再使用 `kk create manifest`，会生成一份镜像仓库地址均为 `registry.cn-beijing.aliyuncs.com/kubesphereio/xxx.tag` 的 manifest 文件。

### Q6：现有的集群生成制品，会包含集群开启的组件、用户数据吗？

A：首先生成的是 manifest 清单文件，然后再是通过 manifest 文件导出制品。若集群中存在用户自己的业务服务，生成的 manifest 文件中会自动添加所有业务服务容器的镜像，但是不会包含数据。

### Q7：KubeKey 只支持官方指定的 K8s 版本，无法自选 K8s 版本？

A：当前版本的 KubeKey 只支持特定的 K8s 版本，是因为在 KubeKey 的代码中只保存了这些 K8s 版本的 `sha256` 校验码，KubeKey 在下载 K8s 的二进制文件后会计算下载文件的 `sha256` 并与 KubeKey 保存的 `sha256` 进行比较看是否一致，这是为了保证下载文件的正确性，完整性。若需要使用 KubeKey 支持更多其他版本的 K8s，可在 KubeKey 的 GitHub 主页提交 issue 反馈。也可以参与贡献提交 PR，添加其他版本 `sha256` 即可使 KubeKey 支持其他版本的 K8s。

### Q8：是否可以根据自己创建的环境导出包含的 images 的 manifest,例如我安装了所有组件,我想一次打包出一个所有 images 的 manifest.

A：可以，生成 manifest 的方式有两种：
- 官网复制 manifest 的 sample 文件，然后再自行手动修改内容。
- `kk create manifest` 命令有-- kubeconfig 参数可指定一个集群的 kube config 文件（默认值为 `~/.kube/config`）。KubeKey 通过该文件可连接 K8s 集群，并扫描出集群中已存在的所有镜像。若这个集群安装了所有组件，自然可以将这些组件所使用的镜像全部添加到 manifest 文件。

### Q9：是否支持 ARM？是否支持 CentOS8？

A：支持 arm，目前不支持 centos。

### Q10：addons 的 chart 支持本地 tgz 文件么？如果支持写法是什么样的？

A：支持，`.sources.chart.path` 字段配置本地文件。具体可参考： https://github.com/kubesphere/kubekey/blob/master/docs/addons.md

### Q11：KubeKey 安装过程中拉去的镜像的名称是默认写死的么？如果不按照官方的名称命名镜像，是不是就拉取不下来？这个镜像名称规范有没有详细的说明？

A：是默认写死的，这些特定的安装镜像都是直接从该组件的官方仓库中拉取下来的，所以名称规范取决于不同组件官方的命名规则。但是 KubeKey 可以通过 `privateRegistry` 和 `namespaceOverride` 字段分别配置的私有镜像仓库和 namespace，比如配置之后拉取镜像的名字就为 `myregistry/mynamespace/xxx:tag`。

### Q12：如何使用 Containerd 作为容器运行时？

A：配置 kk config 文件中 `.kubernetes.containerManager` 的值为 containerd。

### Q13：使用 KubeKey 部署的 etcd 是二进制部署的，如果多个 master 都部署 etcd，那么每个节点的 etcd 数据是一致的么？

A：etcd 组件会自行保持数据一致性。

### Q14：使用 KubeKey 安装集群的时候，Docker 是二进制安装的，安装的数据目录是存放在 /var/lib/docker 下，这个目录有没有配置挂载的地方的，如果不挂载出去会随着使用占尽系统盘空间。如果系统上已经自带安装了 Docker，那么使用 KubeKey 的时候还会再安装二进制的 Docker 么？

A：可配置软链接。若系统已经有 Docker 则不会再安装。

### Q15：是否支持运行部署脚本，比如更改配置，初始化数据库这些对于应用的初始化设置。

A：这个也是我们在考虑的，以后会支持运行自定义脚本。


### Q16：只能 push 到镜像仓库吗，可以把镜像打包成压缩包吗？

A：制品中的镜像就是压缩包的形式。

### Q17：可以解释一下使用二进制部署 etcd 而不是使用容器的原因么？

A：历史原因，内部生产环境要求二进制部署。
KubeKey 2.1.0 版本会支持三种方式部署 etcd：二进制部署，kubeadm 部署（容器部署），直接连接外置 etcd。

### Q18：下个版本是否可以支持自定义 docker/containerd 数据目录，kubelet 目录、etcd 数据目录等？

A：下个版本暂时不会支持，如果有兴趣的话可以参与贡献。

### Q19：多主机批量部署要一个个地址填配置文件？有其他骚操作一键完成么？

A：貌似没有其他骚操作。
