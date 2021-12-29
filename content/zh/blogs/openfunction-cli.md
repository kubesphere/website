---
title: 'OpenFunction CLI: 5 分钟安装与上手云原生函数计算平台'
tag: 'Serverless, FaaS, OpenFunction'
keywords: 'Serverless, FaaS, OpenFunction, 函数计算'
description: 'OpenFunction CLI 相比原来的方式，功能更加全面，支持一键部署、一键卸载以及 Demo 演示的功能。'
createTime: '2021-12-28'
author: '程德昊'
snapshot: 'http://pek3b.qingstor.com/kubesphere-community/images/openfunction-cli-banner.png'
---

## OpenFunction

[OpenFunction](https://github.com/OpenFunction/OpenFunction.git) 是一个云原生、开源的 FaaS（函数即服务）框架，旨在让开发人员专注于他们的开发意图，而不必关心底层运行环境和基础设施。用户只需提交一段代码，就可以生成事件驱动的、动态伸缩的 Serverless 工作负载。

## 部署 OpenFunction

在实现的过程中，OpenFunction 便引入了像 Knative、Tekton、Shipwright、Dapr、KEDA 这样的开源技术栈。为了不让众多的依赖组件成为部署 OpenFunction 的瓶颈，OpenFunction 社区很快发布了[一键化脚本](https://github.com/OpenFunction/OpenFunction/tree/release-0.4#prerequisites)，用于简化依赖组件的安装、卸载过程。但随着 OpenFunction 社区用户的增长，我们发现这种安装方式功能较为单一，且未解耦 OpenFunction 与 Kubernetes 集群版本以及依赖组件版本之间的关联关系，导致 OpenFunction 无法部署到某些版本的 Kubernetes 中。基于对新的安装方式的迫切需求，将安装卸载功能加入 OpenFunction 命令行工具 `ofn` 也就顺理成章了。
                                                        
表一 OpenFunction 使用的第三方组件依赖的 Kubernetes 版本

| Components             | Kubernetes 1.17 | Kubernetes 1.18 | Kubernetes 1.19 | Kubernetes 1.20+ |
| ---------------------- | --------------- | --------------- | --------------- | ---------------- |
| Knative Serving        | 0.21.1          | 0.23.3          | 0.25.2          | 1.0.1            |
| Kourier                | 0.21.0          | 0.23.0          | 0.25.0          | 1.0.1            |
| Serving Default Domain | 0.21.0          | 0.23.0          | 0.25.0          | 1.0.1            |
| Dapr                   | 1.5.1           | 1.5.1           | 1.5.1           | 1.5.1            |
| Keda                   | 2.4.0           | 2.4.0           | 2.4.0           | 2.4.0            |
| Shipwright             | 0.6.1           | 0.6.1           | 0.6.1           | 0.6.1            |
| Tekton Pipelines       | 0.23.0          | 0.26.0          | 0.29.0          | 0.30.0           |
| Cert Manager           | 1.5.4           | 1.5.4           | 1.5.4           | 1.5.4            |
| Ingress Nginx          | na              | na              | 1.1.0           | 1.1.0            |

## OpenFunction CLI

OpenFunction CLI 相比原来的方式，功能更加全面，支持一键部署、一键卸载以及 Demo 演示的功能。用户可以通过设置相应的参数自定义地选择安装各个组件，同时可以选择特定的版本，使安装更为灵活，安装进程也提供了实时展示，使得界面更为美观。现在，你可以访问 [ofn release](https://github.com/OpenFunction/cli/releases/) 选择 `ofn CLI` 的最新版本部署 OpenFunction 到你的集群。以 amd64 版本的 Linux 为例，仅需两步就能完成 OpenFunction CLI 的安装：
- 获取 OpenFunction CLI。
```yaml=
wget -c  https://github.com/OpenFunction/cli/releases/download/v0.5.1/ofn_linux_amd64.tar.gz -O - | tar -xz
```
- 为 OpenFunction CLI 赋予权限并移动到 `/usr/local/bin/` 文件夹下。
```yaml=
chmod +x ofn && mv ofn /usr/local/bin/
```

至此，OpenFunction CLI 安装完毕。OpenFunction CLI 支持三个子命令：install、uninstall 以及 demo ，下面我们将依次进行介绍。

### [install](https://github.com/OpenFunction/cli/blob/main/docs/install.md)

`ofn install` 解决了 OpenFunction 和 Kubernetes 的兼容问题，会自动根据 Kubernetes 版本选择兼容组件进行安装，同时提供多种参数以供用户选择。OpenFunction CLI 支持使用环境变量来定制依赖组件的版本，详细可以参考 [CLI 环境变量设置](https://github.com/OpenFunction/cli/blob/main/docs/install.md#customize-components-installation)。

表二 install 命令参数列表

| 参数           | 功能                                                  |
| -------------- | ----------------------------------------------------- |
| --all          | 用于安装 OpenFunction 及其所有依赖。                    |
| --async        | 用于安装 OpenFunction 的异步运行时（Dapr & Keda）。     |
| --cert-manager * | 用于安装 Cert Manager。                                |
| --dapr *         | 用于安装 Dapr。                                        |
| --dry-run      | 用于提示当前命令所要安装的组件及其版本。              |
| --ingress  *    | 用于安装 Ingress Nginx。                               |
| --keda  *       | 用于安装 Keda。                                        |
| --knative      | 用于安装 Knative Serving（以Kourier为默认网关）        |
| --region-cn    | 针对访问 gcr.io 或 github.com 受限的用户。                |
| --shipwright *  | 用于安装 ShipWright。                                  |
| --sync         | 用于安装 OpenFunction Sync Runtime（待支持）。         |
| --upgrade      | 在安装时将组件升级到目标版本。                        |
| --verbose      | 显示粗略信息。                                        |
| --version      | 用于指定要安装的 OpenFunction 的版本。（默认为 "v0.4.0"） |
| --timeout      | 设置超时时间。默认为5分钟。                           |

注：为了避免过多的选项造成用户的误解，我们已经在帮助命令中隐藏了带*的参数，但你仍可以使用它。

#### install 示例

 我们假设你已经按照上面的步骤下载了 `ofn cli` 并将其放在 `PATH` 中的适当路径下。你可以使用 `ofn install --all` 来完成一个简单的部署。默认情况下，该命令将为你安装 OpenFunction 的 v0.4.0 版本，而对于已经存在的组件，它将跳过安装过程（你可以使用 --upgrade 命令来覆盖这些组件）。

```shell
# ofn install --all --upgrade
Start installing OpenFunction and its dependencies.
Here are the components and corresponding versions to be installed:
+------------------+---------+
| COMPONENT        | VERSION |
+------------------+---------+
| Kourier          | 1.0.1   |
| Keda             | 2.4.0   |
| Tekton Pipelines | 0.30.0  |
| OpenFunction     | 0.4.0   |
| Dapr             | 1.5.1   |
| CertManager      | 1.1.0   |
| Shipwright       | 0.6.1   |
| Knative Serving  | 1.0.1   |
| DefaultDomain    | 1.0.1   |
+------------------+---------+
You have used the `--upgrade` parameter, which means that the installation process will overwrite the components that already exist.
Make sure you know what happens when you do this.
Enter 'y' to continue and 'n' to abort:
-> y
🔄  -> INGRESS <- Installing Ingress...
🔄  -> KNATIVE <- Installing Knative Serving...
🔄  -> DAPR <- Installing Dapr...
🔄  -> DAPR <- Downloading Dapr Cli binary...
🔄  -> KEDA <- Installing Keda...
🔄  -> CERTMANAGER <- Installing Cert Manager...
🔄  -> SHIPWRIGHT <- Installing Shipwright...
🔄  -> INGRESS <- Checking if Ingress is ready...
🔄  -> KEDA <- Checking if Keda is ready...
🔄  -> CERTMANAGER <- Checking if Cert Manager is ready...
🔄  -> SHIPWRIGHT <- Checking if Shipwright is ready...
🔄  -> KNATIVE <- Installing Kourier as Knative's gateway...
🔄  -> KNATIVE <- Configuring Knative Serving's DNS...
🔄  -> KNATIVE <- Checking if Knative Serving is ready...
✅  -> CERTMANAGER <- Done!
🔄  -> DAPR <- Initializing Dapr with Kubernetes mode...
✅  -> SHIPWRIGHT <- Done!
✅  -> KNATIVE <- Done!
✅  -> INGRESS <- Done!
✅  -> DAPR <- Done!
✅  -> KEDA <- Done!
🔄  -> OPENFUNCTION <- Installing OpenFunction...
🔄  -> OPENFUNCTION <- Checking if OpenFunction is ready...
✅  -> OPENFUNCTION <- Done!
🚀 Completed in 2m3.638035129s.
```

### [uninstall](https://github.com/OpenFunction/cli/blob/main/docs/uninstall.md)

`ofn uninstall` 将帮助你卸载 OpenFunction 及其依赖，同时你可以根据相应的参数选择卸载指定的组件。在安装过程中，OpenFunction CLI 会在 `$home/.ofn/inventory.yaml` 中保留已安装的组件细节。所以在卸载过程中，OpenFunction CLI 会根据`$home/.ofn/inventory.yaml` 的内容删除相关组件。

表三 uninstall 命令参数列表

| 参数           | 功能                                                  |
| -------------- | ----------------------------------------------------- |
| --all          | 用于卸载 OpenFunction 及其所有依赖。                    |
| --async        | 用于卸载 OpenFunction 的异步运行时（Dapr & Keda）。     |
| --cert-manager * | 用于卸载 Cert Manager。                                |
| --dapr *         | 用于卸载 Dapr。                                        |
| --ingress *      | 用于卸载 Ingress Nginx。                               |
| --keda *        | 用于卸载 KEDA。                                        |
| --knative      |    用于卸载 Knative Serving（以 Kourier 为默认网关）。     |
| --region-cn    | 针对访问 gcr.io 或 github.com 受限的用户。                |
| --shipwright *   | 用于安卸载 shipWright。                                 |
| --sync         | 用于卸载 penFunction 同步运行时（待支持）。            |
| --verbose      | 显示粗略信息。                                        |
| --version      | 用于指定要卸载的 OpenFunction 的版本。(默认为 "v0.4.0") |
| --timeout      | 设置超时时间。默认为5分钟。                           |


#### uninstall 示例
你可以使用 `ofn uninstall --all` 来轻松卸载 OpenFunction 及其依赖项（如果不加参数则表示只卸载 OpenFunction，不卸载其他组件）。

```shell
~# ofn uninstall --all
Start uninstalling OpenFunction and its dependencies.
The following components already exist:
+------------------+---------+
| COMPONENT        | VERSION |
+------------------+---------+
| Cert Manager     | v1.5.4  |
| Ingress Nginx    | 1.1.0   |
| Tekton Pipelines | v0.28.1 |
| Shipwright       | 0.6.0   |
| OpenFunction     | v0.4.0  |
| Dapr             | 1.4.3   |
| Keda             | 2.4.0   |
| Knative Serving  | 0.26.0  |
+------------------+---------+
You can see the list of components to be uninstalled and the list of components already exist in the cluster.
Make sure you know what happens when you do this.
Enter 'y' to continue and 'n' to abort:
-> y
🔄  -> OPENFUNCTION <- Uninstalling OpenFunction...
🔄  -> KNATIVE <- Uninstalling Knative Serving...
🔄  -> DAPR <- Uninstalling Dapr with Kubernetes mode...
🔄  -> KEDA <- Uninstalling Keda...
🔄  -> SHIPWRIGHT <- Uninstalling Tekton Pipeline & Shipwright...
🔄  -> INGRESS <- Uninstalling Ingress...
🔄  -> CERTMANAGER <- Uninstalling Cert Manager...
✅  -> OPENFUNCTION <- Done!
✅  -> DAPR <- Done!
🔄  -> KNATIVE <- Uninstalling Kourier...
✅  -> KEDA <- Done!
✅  -> CERTMANAGER <- Done!
✅  -> KNATIVE <- Done!
✅  -> INGRESS <- Done!
✅  -> SHIPWRIGHT <- Done!
🚀 Completed in 1m21.683329262s.
```

### [demo](https://github.com/OpenFunction/cli/blob/main/docs/demo.md)

`ofn demo`  将帮助你创建一个 kind 集群，安装 OpenFunction 及其所有依赖并运行一个 sample 函数。

表四 demo 命令参数列表

| 参数         | 功能                                                         |
| ------------ | ------------------------------------------------------------ |
| --region-cn  | 针对访问 gcr.io 或 github.com 受限的用户。                       |
| --auto-prune | 自动清理当前的 kind 集群。该参数默认是 `true`，如果设置为 `false` ，将保留当前的 kind 集群。 |
| --verbose    | 显示粗略信息。                                               |
| --timeout    | 设置超时时间。默认为10分钟。                                 |

#### demo 示例
你可以使用 `ofn demo` 命令来创建一个 OpenFunction 的函数实例，该命令会创建一个 kind 集群并安装最新版本的 OpenFunction 来运行一个示例函数，该 kind 集群将在运行结束后自动删除。

```shell
# ofn demo
Launching OpenFunction demo...
The following components will be installed for this demo:
+--------------+---------+
| COMPONENT    | VERSION |
+--------------+---------+
| OpenFunction | v0.4.0  |
+--------------+---------+
A Kind cluster will be created and the OpenFunction Demo will be launched in it...
Enter 'y' to continue and 'n' to abort:
-> y
🔄  -> KIND <- Installing Kind...
🔄  -> KIND <- Downloading Kind binary...
🔄  -> KIND <- Creating cluster...
✅  -> KIND <- Done!
Start installing OpenFunction and its dependencies.
Here are the components and corresponding versions to be installed:
+------------------+---------+
| COMPONENT        | VERSION |
+------------------+---------+
| DefaultDomain    | 1.0.1   |
| Tekton Pipelines | 0.30.0  |
| OpenFunction     | 0.4.0   |
| Kourier          | 1.0.1   |
| Keda             | 2.4.0   |
| Knative Serving  | 1.0.1   |
| Dapr             | 1.5.1   |
| Shipwright       | 0.6.1   |
| CertManager      | 1.5.4   |
+------------------+---------+
🔄  -> CERTMANAGER <- Installing Cert Manager...
🔄  -> KEDA <- Installing Keda...
🔄  -> DAPR <- Installing Dapr...
🔄  -> DAPR <- Downloading Dapr Cli binary...
🔄  -> SHIPWRIGHT <- Installing Tekton Pipelines...
🔄  -> KNATIVE <- Installing Knative Serving...
🔄  -> SHIPWRIGHT <- Checking if Tekton Pipelines is ready...
🔄  -> KEDA <- Checking if Keda is ready...
🔄  -> DAPR <- Initializing Dapr with Kubernetes mode...
🔄  -> CERTMANAGER <- Checking if Cert Manager is ready...
🔄  -> KNATIVE <- Checking if Knative Serving is ready...
✅  -> DAPR <- Done!
✅  -> CERTMANAGER <- Done!
🔄  -> KNATIVE <- Configuring Knative Serving's DNS...
🔄  -> KNATIVE <- Installing Kourier as Knative's gateway...
🔄  -> KNATIVE <- Checking if Kourier is ready...
✅  -> KEDA <- Done!
🔄  -> SHIPWRIGHT <- Installing Shipwright...
🔄  -> SHIPWRIGHT <- Checking if Shipwright is ready...
✅  -> KNATIVE <- Done!
✅  -> SHIPWRIGHT <- Done!
🔄  -> OPENFUNCTION <- Installing OpenFunction...
🔄  -> OPENFUNCTION <- Checking if OpenFunction is ready...
✅  -> OPENFUNCTION <- Done!
🔄  -> DEMO <- Run OpenFunctionDemo...
Now we have configured the appropriate parameters for you, You can use this address to access related functions :
 http://serving-smwbh-ksvc-dn2vx.default.172.18.0.2.sslip.io

We now use the curl command to access the address. The following information was returned:
Hello, World!

✅  -> DEMO <- Done!
 Completed in 7m56.980904754s.
```

OpenFunction 带来了我们所期望的对业务场景快速拆解重构的能力，开发人员可以专注于他们的开发意图，而不必关心底层运行环境和基础设施。但随着版本的迭代升级，原有的安装方式稍显笨重，于是我们改进了 OpenFunction CLI ，整个安装部署过程变得更为平滑、更为灵活，也更为简便。用户仅需一行命令，就可以根据自身需要进行安装、卸载与演示。同时，我们也在不断演进 OpenFunction ，将在之后版本中引入可视化界面，支持更多的  EventSource ,通过 WebAssembly 作为更加轻量的运行时等。



