---
title: '在 Kubernetes 中部署云原生开发工具 Nocalhost'
tag: 'Kubernetes,KubeSphere,Nocalhost'
keyword: 'Kubernetes, KubeSphere, Nocalhost '
description: '本文将介绍如何在 Kubernetes 中快速部署 Nocalhost Server，用于提供一个帮助研发团队统一管理 Nocalhost 应用部署的管理平台。'
createTime: '2021-11-11'
author: '张海立，玉易才'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-nocalhost-cover.png'
---


## KubeSphere 简介
KubeSphere 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。

KubeSphere 提供了运维友好的向导式操作界面，即便是 Kubernetes 经验并不丰富的用户，也能相对轻松的上手开始管理和使用。它提供了基于 Helm 的应用市场，可以在图形化界面下非常轻松地安装各种 Kubernetes 应用。


## Nocalhost 简介
[Nocalhost](https://nocalhost.dev/) 是一个允许开发者直接在 Kubernetes 集群内开发应用的工具。

Nocalhost 的核心功能是：提供 Nocalhost IDE 插件（包括 VSCode 和 Jetbrains 插件），将远端的工作负载更改为开发模式。在开发模式下，容器的镜像将被替换为包含开发工具（例如 JDK、Go、Python 环境等）的开发镜像。当开发者在本地编写代码时，任何修改都会实时被同步到远端开发容器中，应用程序会立即更新（取决于应用的热加载机制或重新运行应用），开发容器将继承原始工作负载所有的声明式配置（configmap、secret、volume、env 等）。

Nocalhost 还提供：

- VSCode 和 Jetbrains IDE 一键 Debug 和 HotReload
- 在 IDE 内直接提供开发容器的终端，获得和本地开发一致的体验
- 提供基于 Namespace 隔离的开发空间和 Mesh 开发空间

在使用 Nocalhost 开发 Kubernetes 的应用过程中，免去了镜像构建，更新镜像版本，等待集群调度 Pod 的过程，把编码/测试/调试反馈循环(code/test/debug cycle)从分钟级别降低到了秒级别，大幅提升开发效率

此外，Nocalhost 还提供了 Server 端帮助企业管理 Kubernetes 应用、开发者和开发空间，方便企业统一管理各类开发和测试环境。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-server.png)

本文将介绍如何在 KubeSphere 中快速部署 [Nocalhost Server](https://nocalhost.dev/docs/server/server-overview)，用于提供一个帮助研发团队统一管理 Nocalhost 应用部署的管理平台。

## 前提条件
### 安装 KubeSphere
安装 KubeSphere 有两种方法。一是在 Linux 上直接安装，可以参考文档：[在 Linux 安装 KubeSphere](https://kubesphere.com.cn/docs/quick-start/all-in-one-on-linux/)； 二是在已有 Kubernetes 中安装，可以参考文档：[在 Kubernetes 安装 KubeSphere](https://kubesphere.com.cn/docs/quick-start/minimal-kubesphere-on-k8s/)。

### 在 KubeSphere 中启用应用商店
在 KubeSphere 中启用应用商店可以参考文档：[KubeSphere 应用商店](https://kubesphere.com.cn/docs/pluggable-components/app-store/)。


## 安装 Nocalhost Server
### 在 KubeSphere 3.2 中从应用商店安装

Nocalhost Server 已经集成在了 KubeSphere 3.2 的应用商店中了，因此可以直接访问应用商店并按 [常规方式](https://kubesphere.com.cn/docs/project-user-guide/application/deploy-app-from-appstore/) 进行应用部署。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-helm-nocalhost.png)


### 在 KubeSphere 3.x 中通过应用仓库安装
在 KubeSphere 3.x 中，您可以 [通过应用仓库来部署应用](https://kubesphere.com.cn/docs/project-user-guide/application/deploy-app-from-appstore/)，下面分步介绍具体的操作过程。


#### 步骤 1：添加应用商店
首先，使用具备企业空间管理权限的账号登陆 KubeSphere 并进入您选定的一个企业空间，在您的企业空间中，进入「应用管理」下的「应用仓库」页面，并点击「添加仓库」。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-helm-nocalhost.png)


在弹出的对话框中，可将应用仓库名称设置为 `nocalhost`，将应用仓库的 URL 设置为 `https://nocalhost-helm.pkg.coding.net/nocalhost/nocalhost`，点击「验证」对 URL 进行验证，验证通过后再点击「确定」。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-helm-coding.png)

> ⚠️ 注意：URL 必须贴全链接，不能缺失 `https://` 这部分，否则会验证失败


应用仓库导入成功后会显示在如下图所示的列表中。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-kubesphere-helm-done.png)



> 有关添加私有仓库时的更多参数信息，请参见 [导入 Helm 仓库](https://kubesphere.com.cn/docs/workspace-administration/app-repository/import-helm-repository/)。


#### 步骤 2：从应用模版部署应用
进入您选定的用于部署 Nocalhost Server 的项目，如果还没有可用项目，可以直接打开企业空间页面中的「项目」栏目，「创建」一个新的项目。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-server-setup.png)


假设我们已经创建了一个名为 `nocalhost-server` 的项目，进入项目界面，进入「应用负载」下的「应用」页面，再点击「创建」新应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-server-setup-app.png)


在弹出的对话框中选择「从应用模板」创建。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-app-template.png)



- **从应用商店**：选择内置的应用和以 Helm Chart 形式单独上传的应用。
- **从应用模板**：从私有应用仓库和企业空间应用池选择应用。


从下拉列表中选择之前添加的私有应用仓库 `nocalhost`，可以看到仓库中的 Nocalhost Server Helm Chart 如下显示。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-kubesphere-helm-chart.png)

您可以查看「应用信息」和「Chart 文件」，在版本下拉列表中选择版本，然后点击「部署」。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-chart-deployment.png)


设置应用「名称」，确认应用「版本」和部署「位置」，点击「下一步」。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-version.png)


在「应用设置」标签页，您可以手动编辑清单文件或直接点击「安装」。建议把 `service.type` 设置为 `ClusterIP`，以确保安装不受 Kubernetes 网络环境影响。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-service-type.png)


最后等待 Nocalhost Server 创建完成并开始运行，可以在「应用」中看到如下应用状态（可能需要刷新一下页面）。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-sever-app-status.png)

### 步骤 3：暴露 Nocalhost Server 服务
进入「应用负载」下的「服务」页面，选择 `nocalhost-web` 服务，在最右侧的拉下菜单中选择「编辑外部访问」。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-web.png)


在弹出的对话框中选择合适当前云端网络环境的外网「访问方式」，然后点击「确定」即可应用服务配置。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-cloud-network.png)


本文假设我们仍然保持 `ClusterIP` 的访问方式，通过 `kubectl port-forward` 来进行后续的 Nocalhost Server 使用。

```bash
❯ kubectl -n nocalhost-server port-forward service/nocalhost-web 8080:80
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
```
> ⚠️ 注意：这里的 `nocalhost-server` 请替换为您实际使用的部署了 Nocalhost 应用的 Namespace

## 使用 Nocalhost Server
> 完成 Port Forward 后可使用 `http://localhost:8080` 来打开 Nocalhost Server Dashboard 页面；使用 `admin@admin.com` 及密码 `123456` 进行登陆。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost8080.png)

### 创建集群
> Nocalhost Server 多用于管理整个团队的 Nocalhost 研发环境，因此我们首先需要添加可进行管理的集群。

在 Nocalhost Server Dashboard 中选择左侧菜单列表中的「集群」，进入页面后选择「添加集群」。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-server-cluster.png)

在弹出的对话框中输入「集群名称」，并录入 kubectl 可用的、**具备 **`**cluster-admin**`** 权限**的 kubeconfig 文件后「确认」。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-kubeconfig.png)


> 目前可导入的 kubeconfig 文件内容还不支持 `exec` 类型的用户凭证，如果您使用的是这里凭证，建议您另外生成一个具有足够权限的 ServiceAccount 并使用其对应的 kubeconfig。



这里有多种方式获取目标集群的 kubeconfig，例如您可以返回 KubeSphere 并进入集群页面，获取当前集群的 kubeconfig 文件。注意，如果使用 kubeconfig 文件的应用部署在当前集群外，您需要将 `clusters:cluster:server` 参数的值修改为**对外暴露的 Kubernetes API 服务器地址**。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-kubeconfig-1.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-kubeconfig-2.png)

添加成功后，可以得到如下的集群信息页面。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-dashboard-cluster.png)


### 创建开发空间（DevSpace）
接下来，我们进入「开发空间」页面，选择「创建开发空间」，并在弹出的对话框中选择「创建隔离开发空间」。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-devspace-1.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-devspace-2.png)


> 关于「共享开发空间」，即 MeshSpace，可参考 [Manage MeshSpace](https://nocalhost.dev/docs/server/manage-devspace-mesh) 这篇官方介绍。


在弹出的对话框中，可以填写「开发空间名称」（这里设置为 `demo`），选择「集群」和其「所有者」，并按需进行「其它设置」。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-devspace-3.png)


创建完成后，可以在「开发空间」页面看到已创建的隔离开发空间，如下图所示。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-devspace-4.png)

### 创建 bookinfo 样例应用
下一步我们开始为团队创建一些可部署的应用，先进入「应用」页面，选择「添加应用」。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-bookinfo.png)


在弹出的对话框中填写「应用名称」，同时我们继续填写其它信息：

- 选择 `Git` 作为「安装来源」
- 输入 `https://github.com/nocalhost/bookinfo.git` 作为「Git 仓库地址」
- 选择 `Manifest` 作为「Manifest 类型」
- 「应用配置文件」留空，即使用 `config.yaml` 
- 「Git 仓库的相对路径」填入 `manifest/templates`

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-bookinfo-2.png)



> 可访问 GitHub 查看完整的 [bookinfo](https://github.com/nocalhost/bookinfo/) 样例应用仓库，了解详细的配置文件细节。


### 创建用户并共享开发空间
最后，我们创建一个样例用户来演示如果共享开发空间。进入到「用户」页面后，点击「添加用户」，在弹出的对话框中填入必须的用户信息后「完成」添加。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-test-user.png)


然后我们回到开发空间，选择我们之前创建的 `demo` 空间，点击画笔图标进入「编辑开发空间」的「共享用户」标签页，开始「添加共享」。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-test-user-2.png)

选择需要添加的用户，并注意选择默认的 `Cooperator` 协作者权限，另一个 `Viewer` 观察者权限的用户只能浏览开发空间。

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-test-user-3.png)


至此，我们在 Nocalhost Server Dashboard 中的配置就告一段落，下面将进入 IDE 利用 Nocalhost 插件执行应用的部署。

### 执行 bookinfo 应用部署
> 这里我们将使用 VS Code 执行应用的部署，首先需要 [在 VS Code 中安装 Nocalhost 插件](https://nocalhost.dev/docs/installation#install-vs-code-plugin)。 您也可以使用 [JetBrains 及其 Nocalhost 插件](https://nocalhost.dev/docs/installation#install-jetbrains-plugin)。


在 VS Code 中打开 Nocalhost 插件面板，点击 `+` 号创建集群连接，填入 Nocalhost Server 地址，并使用前面创建的普通用户 `test` 的用户名及密码进行登录。
![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-vscode-test.png)


创建成功可以看到之前在 Nocalhost Server Dashboard 中创建的开发空间 `demo(nh1btih)`。 
![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-dashboard-demo.png)


点击 `demo` 空间右侧的火箭图标，会在 VS Code 编辑器顶部加载应用列表，如下图所示可以看到之前添加的 `bookinfo` 应用。
![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-vscode-bookinfo.png)

选择该应用即会启动在 `demo` 空间中的 Nocalhost 应用部署过程（选择应用源的默认分支进行安装即可），安装完成后，会出现如下日志和弹窗提示：
![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-access.png)


同时在 Nocalhost 插件面板中也可以展开 `Workload` 看到具体的部署内容。
![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-workload.png)


再往后就可以依照 Nocalhost 常规方式 [进入开发模式](https://nocalhost.dev/zh-CN/docs/quick-start#3-%E8%BF%9B%E5%85%A5%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F)，体验更便捷的云原生微服务开发过程！

## 开发体验
- 点击绿色图标即可进入开发模式，选择从 git 仓库克隆源码。（第一次进入开发模式，Nocalhost 会提示你选择源码目录，可以直接选择本地的源码目录，也可以选择从 git 仓库克隆到本地，后续 Nocalhost 会记住源码目录，再次进入开发模式时，会直接打开这个源码目录）
![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-git-1.png)
- 进入开发模式后 Nocalhost 会自动将工作负载的镜像替换为开发镜像，并且将源码同步到远程容器中。
- 进入开发模式后会自动打开一个远程容器的终端，开发者可以在这个终端里面执行命令，运行开发程序。
- 右键工作负载 authors，点击 Remote run，即可在远端容器里面运行在开发配置里面预设好的应用运行命令。
![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-kubesphere-remoterun.png)
- 更改代码并保存后，Nocalhost 自动将更改后的代码文件同步到远程容器中。（若在开发配置里面配置了该 hotReload: true 参数, nocalhost 将会自动在远程容器中再次运行预设好的应用运行命令，更改代码后无需要再次点击 Remote run 或者手动运行应用运行命令）

### 远程调试
- 右键工作负载 authors，点击Remote debug，即可进入远程 debug 模式。
- 打上断点，在浏览器访问 http://127.0.0.1:39080/productpage，即可进行远程 debug

![](https://pek3b.qingstor.com/kubesphere-community/images/nocalhost-git-3.png)
