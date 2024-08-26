---
title: '59 张高清大图，带你实战入门 KubeSphere DevOps'
tag: 'KubeSphere, DevOps'
keywords: 'KubeSphere, DevOps'
description: '本文档旨在成为您的技术指南，逐步引导您开启 KubeSphere 的 DevOps 之旅。'
createTime: '2024-08-21'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-devops-java-cover.png'
---

KubeSphere 基于 [Jenkins](https://jenkins.io/) 的 DevOps 系统是专为 Kubernetes 中的 CI/CD 工作流设计的，它提供了一站式的解决方案，帮助开发和运维团队用非常简单的方式构建、测试和发布应用到 Kubernetes。它还具有插件管理、[Binary-to-Image (B2I)](https://kubesphere.com.cn/docs/v3.3/project-user-guide/image-builder/binary-to-image/)、[Source-to-Image (S2I)](https://kubesphere.com.cn/docs/v3.3/project-user-guide/image-builder/source-to-image/)、代码依赖缓存、代码质量分析、流水线日志等功能。

DevOps 系统为用户提供了一个自动化的环境，应用可以自动发布到同一个平台。它还兼容第三方私有镜像仓库（如 Harbor）和代码库（如 GitLab/GitHub/SVN/BitBucket）。它为用户提供了全面的、可视化的 CI/CD 流水线，打造了极佳的用户体验，而且这种兼容性强的流水线能力在离线环境中非常有用。

本文档旨在成为您的技术指南，逐步引导您开启 KubeSphere 的 DevOps 之旅。我们将深入探索如何开启 DevOps 插件，如何规划设计一个完整的 DevOps 流水线并编写 Jenkins 流水线配置文件。通过本文档的实战案例，您将能够掌握从理论到实践的全过程，为您的项目带来持续集成和持续部署的自动化体验。

- 您将学习如何在 KubeSphere 上开启 DevOps 插件。
- 通过实际案例，规划设计一个高效、自动化的 DevOps 流水线。
- 我们将一起编写 Jenkinsfile，定义代码拉取、测试、编译、构建和部署的流程。
- 最终，我们将完成一个实战项目，将理论知识转化为实际操作，让您对 KubeSphere DevOps 的应用有更深的理解。

随着 **59 张高清大图**的辅助，本文档将确保您在每一个步骤中都能获得清晰的指导和深刻的见解。无论您是 DevOps 的新手还是希望在 KubeSphere 上实现 DevOps 流程的老手，本文档都将为您提供宝贵的知识和实践技巧。

**实战服务器配置(架构 1:1 复刻小规模生产环境，配置略有不同)**

|      主机名      |      IP       | CPU  | 内存 | 系统盘 | 数据盘 |                    用途                    |
| :--------------: | :-----------: | :--: | :--: | :----: | :----: | :----------------------------------------: |
|   ksp-registry   | 192.168.9.90  |  4   |  8   |   40   |  200   |              Harbor 镜像仓库               |
|  ksp-control-1   | 192.168.9.91  |  4   |  8   |   40   |  100   |        KubeSphere/k8s-control-plane        |
|  ksp-control-2   | 192.168.9.92  |  4   |  8   |   40   |  100   |        KubeSphere/k8s-control-plane        |
|  ksp-control-3   | 192.168.9.93  |  4   |  8   |   40   |  100   |        KubeSphere/k8s-control-plane        |
|   ksp-worker-1   | 192.168.9.94  |  8   |  16  |   40   |  100   |               k8s-worker/CI                |
|   ksp-worker-2   | 192.168.9.95  |  8   |  16  |   40   |  100   |                 k8s-worker                 |
|   ksp-worker-3   | 192.168.9.96  |  8   |  16  |   40   |  100   |                 k8s-worker                 |
|  ksp-storage-1   | 192.168.9.97  |  4   |  8   |   40   |  400+  |      ElasticSearch/Longhorn/Ceph/NFS       |
|  ksp-storage-2   | 192.168.9.98  |  4   |  8   |   40   |  300+  |        ElasticSearch/Longhorn/Ceph         |
|  ksp-storage-3   | 192.168.9.99  |  4   |  8   |   40   |  300+  |        ElasticSearch/Longhorn/Ceph         |
| ksp-gpu-worker-1 | 192.168.9.101 |  4   |  16  |   40   |  100   |    k8s-worker(GPU NVIDIA Tesla M40 24G)    |
| ksp-gpu-worker-2 | 192.168.9.102 |  4   |  16  |   40   |  100   |   k8s-worker(GPU NVIDIA Tesla P100 16G)    |
|  ksp-gateway-1   | 192.168.9.103 |  2   |  4   |   40   |        |  自建应用服务代理网关/VIP：192.168.9.100   |
|  ksp-gateway-2   | 192.168.9.104 |  2   |  4   |   40   |        |  自建应用服务代理网关/VIP：192.168.9.100   |
|     ksp-mid      | 192.168.9.105 |  4   |  8   |   40   |  100   | 部署在 k8s 集群之外的服务节点（Gitlab 等） |
|       合计       |      15       |  68  | 152  |  600   | 2100+  |                                            |

**实战环境涉及软件版本信息**

- 操作系统：**openEuler 22.03 LTS SP3 x86_64**
- KubeSphere：**v3.4.1**
- Kubernetes：**v1.28.8**
- KubeKey:  **v3.1.1**
- ks-jenkins： **v3.4.0-2.319.3-1**

## 1. 开启 DevOps 组件

### 1.1 前提说明

现在，新部署的 KubeSphere v3.4.1 开启 DevOps 插件会有问题，具体描述见 [KubeSphere 镜像构建器（S2I）服务证书过期(x509)问题](https://ask.kubesphere.io/forum/d/23239-kubesphere-jing-xiang-gou-jian-qi-s2ifu-wu-zheng-shu-guo-qi-x509wen-ti)。

在开启之前我们先修复存在的问题。

- 清理开启失败的残留 release（适用于开启过 DevOps 且安装失败）

```bash
helm -n kubesphere-devops-system delete devops
```

- 执行下面命令，获取 ks-installer 镜像

```bash
$ kubectl -n kubesphere-system get deployments ks-installer --no-headers -o custom-columns=:.spec.template.spec.containers[0].image
kubesphere/ks-installer:v3.4.1
```

- 在获取的镜像最后加上 ‘-patch.0’ ，执行下面命令更新 ks-installer 镜像

```bash
$ kubectl -n kubesphere-system patch deployments ks-installer --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value": "kubesphere/ks-installer:v3.4.1-patch.0"}]'
```

更新镜像后 `ks-installer` 会**自动重启**并根据 `ClusterConfiguration` 里的配置安装各个开启的未安装的模块。

### 1.2 开启 DevOps 组件配置

- 以`admin`用户登录 KubeSphere 控制台，点击左上角的「平台管理」，选择「集群管理」。
    
- 点击 「定制资源定义」，在搜索栏中输入 `clusterconfiguration`，点击搜索结果查看其详细页面。
    
    > 定制资源定义（CRD）允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。

![ksp-v341-crd-clusterconfiguration](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-crd-clusterconfiguration.png)

- 在**自定义资源**中，点击 `ks-installer`右侧的三个竖点 ，选择**编辑 YAML**。

![ksp-v341-crd-ks-install](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-crd-ks-install.png)

- 在该 YAML 文件中，搜索 `devops`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**确定**，保存配置，保存之后 KubeSphere 会自动安装 devops 插件。

```yaml
devops:
  enabled: true
  jenkinsCpuLim: 1
  jenkinsCpuReq: 0.5
  jenkinsMemoryLim: 4Gi
  jenkinsMemoryReq: 4Gi
  jenkinsVolumeSize: 16Gi
```

> **注意**：上面的参数配置是默认值，**仅适用于测试环境**，生产环境建议根据规模调大参数值。

### 1.3 验证

- 在 kubectl 中执行以下命令检查安装过程。

```shell
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

**正确执行后，输出结果如下 :**

```yaml
PLAY RECAP *********************************************************************
localhost                  : ok=26   changed=14   unreachable=0    failed=0    skipped=21   rescued=0    ignored=0
Start installing monitoring
Start installing multicluster
Start installing openpitrix
Start installing network
Start installing devops
**************************************************
Waiting for all tasks to be completed ...
task network status is successful  (1/5)
task openpitrix status is successful  (2/5)
task multicluster status is successful  (3/5)
task monitoring status is successful  (4/5)
task devops status is successful  (5/5)
**************************************************
Collecting installation results ...
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
......
```

- 检查 Kubernetes 集群 `kubesphere-devops-system` 命名空间的资源运行状态。

```shell
$ kubectl get all -n kubesphere-devops-system
NAME                                    READY   STATUS      RESTARTS   AGE
pod/devops-28717020-l769w               0/1     Completed   0          14m
pod/devops-apiserver-858fdcc978-hwxbf   1/1     Running     0          15m
pod/devops-controller-989995d9f-wc6hs   1/1     Running     0          15m
pod/devops-jenkins-df4d7cd4b-pkmhn      1/1     Running     0          15m
pod/s2ioperator-0                       1/1     Running     0          14m

NAME                                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service/devops-apiserver              ClusterIP   10.233.42.51    <none>        9090/TCP       15m
service/devops-jenkins                NodePort    10.233.48.8     <none>        80:30180/TCP   15m
service/devops-jenkins-agent          ClusterIP   10.233.3.210    <none>        50000/TCP      15m
service/s2ioperator-metrics-service   ClusterIP   10.233.60.160   <none>        8080/TCP       15m
service/s2ioperator-trigger-service   ClusterIP   10.233.13.255   <none>        8081/TCP       15m
service/webhook-server-service        ClusterIP   10.233.1.199    <none>        443/TCP        15m

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/devops-apiserver    1/1     1            1           15m
deployment.apps/devops-controller   1/1     1            1           15m
deployment.apps/devops-jenkins      1/1     1            1           15m

NAME                                          DESIRED   CURRENT   READY   AGE
replicaset.apps/devops-apiserver-858fdcc978   1         1         1       15m
replicaset.apps/devops-controller-989995d9f   1         1         1       15m
replicaset.apps/devops-jenkins-df4d7cd4b      1         1         1       15m

NAME                           READY   AGE
statefulset.apps/s2ioperator   1/1     45m

NAME                   SCHEDULE       SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cronjob.batch/devops   0/30 * * * *   False     0        14m             15m

NAME                        COMPLETIONS   DURATION   AGE
job.batch/devops-28717020   1/1           15s        14m
```

> **注意**：实际部署中会增加 Minio 、OpenLDAP，还有一组 Argo CD 的服务组件。

- KubeSphere 管理控制台验证。

登录KubeSphere 管理控制台，依次点击「平台管理」->「集群管理」->「系统组件」，检查 **DevOps** 标签页中的所有组件是否都处于**健康**状态。如果是，组件安装成功。

![ksp-v341-components-devops](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-components-devops.png)

## 2. 创建和管理 DevOps 项目

本文仅演示，如何创建单管理员用户实现企业空间中创建项目和管理 DevOps 项目，更复杂、更贴近生产环境的多用户模式请参考官方文档 [创建企业空间、项目、用户和平台角色](https://kubesphere.io/zh/docs/v3.4/quick-start/create-workspace-and-project/)

### 2.1 创建用户

安装 KubeSphere 之后，您需要向平台添加具有不同角色的用户，以便他们可以针对自己授权的资源在不同的层级进行工作。一开始，系统默认只有一个用户 `admin`，具有 `platform-admin` 角色。在本步骤中，我将创建一个示例用户 `opsxlab`。

- 以 `admin` 身份使用默认帐户和密码 (`admin/P@88w0rd`) 登录 Web 控制台。
- 点击左上角的**平台管理**，然后选择**访问控制**。

![ksp-v341-dashboard-access-workspaces](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-dashboard-access-workspaces.png)

- 在**用户**中，点击**创建**。

![ksp-v341-access-accounts](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-access-accounts.png)

- 在弹出的对话框中，填写所有必要信息（带有*标记）。在**平台角色**下拉列表，选择**platform-self-provisioner**。点击**确定**。新创建的用户将显示在**用户**页面。

![ksp-v341-access-accounts-devops](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-access-accounts-devops.png)

- 在**用户**页面，查看创建的用户。

![ksp-v341-access-accounts-devops-complete](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-access-accounts-devops-complete.png)

### 2.2 创建企业空间

企业空间是 KubeSphere 多租户系统的基础，是管理项目、DevOps 项目和组织成员的基本逻辑单元。

- 在左侧导航栏，选择**企业空间**。企业空间列表中已列出默认企业空间 **system-workspace**，该企业空间包含所有系统项目。其中运行着与系统相关的组件和服务，您无法删除该企业空间。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-access-workspaces.png)

- 在企业空间列表页面，点击**创建**，输入企业空间的名称（例如 **opsxlab**），并将用户 `opsxlab` 设置为企业空间管理员。完成后，点击**创建**。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-access-workspaces-opsxlab.png)

- 点击「创建」返回。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-access-workspaces-opsxlab-complete.png)

- 登出控制台，然后以 `opsxlab` 身份重新登录，验证是否能成功登录。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-login-opsxlab.png)

- 成功登录后，显示「企业空间」页面。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-workspaces-opsxlab.png)

### 2.3 创建项目

在此步骤中，您需要使用在上一步骤中创建的帐户 `opsxlab` 来创建项目。KubeSphere 中的项目与 Kubernetes 中的命名空间相同，为资源提供了虚拟隔离。

- 以 `opsxlab` 身份登录 KubeSphere Web 控制台，点击企业空间 `opsxlab`，进入企业空间概览。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-workspaces-opsxlab-overview.png)

- 在**项目**中，点击**创建**。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-workspaces-opsxlab-projects.png)

- 输入项目名称（例如 `opsxlab`），点击**确定**。您还可以为项目添加别名和描述。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-workspaces-opsxlab-projects-create.png)

- 完成创建

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-workspaces-opsxlab-projects-complete.png)

- 在**项目**中，点击刚创建的项目查看其详情页面。

- 在项目的**概览**页面，默认情况下未设置项目配额。您可以点击**编辑配额**并根据需要指定**资源请求和限制**（例如：CPU 和内存的限制分别设为 1 Core 和 1000 Gi）。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-projects-opsxlab-overview.png)

### 2.4 创建 DevOps 项目

- 以 `opsxlab` 身份登录 KubeSphere 控制台，转到 **DevOps 项目**，然后点击**创建**。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-workspaces-opsxlab-projects-devops.png)

- 输入 DevOps 项目名称（例如 `opsxlab-devops`），然后点击**确定**，也可以为该项目添加别名和描述。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-workspaces-opsxlab-projects-devops-create.png)

- DevOps 项目创建后，会显示在下图所示的列表中。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-workspaces-opsxlab-projects-devops-complete.png)

- 点击刚创建的 DevOps 项目查看其详细页面。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops.png)

## 3. DevOps 流水线规划设计

KubeSphere 官方提供的示例项目中的  `Jenkinsfile-online` 流水线设计更贴近生产环境，流程比较复杂，小白理解起来可能会有困难。为了让小白快速上手 KubeSphere DevOps 的功能，我设计了一个简化版的流程。

本文我们基于 Jenkins 模拟生产环境应用发布的流程，实现如下的 DevOps 流水线任务：

- **阶段 1：Checkout SCM**：从 Git 仓库检出源代码，本文使用 Gitee 作为示例，GitHub 或是自建 GitLab 流程类似。
- **阶段 2：单元测试**：待该测试通过后才会进行下一阶段。
- **阶段 3：编译 Java 源码**：使用 Maven 构建 Jar 包。
- **阶段 4：构建并推送 tag 镜像**：根据运行流水线时输入的分支来构建镜像，并将标签为 `TAG_NAME` 的镜像推送至 Harbor 镜像仓库。
- **阶段 5：推送最新镜像**：将  `TAG_NAME` 标签的镜像标记为 `latest`，并推送至 Harbor 镜像仓库。
- **阶段 6：部署至生产环境**：将已发布的  `TAG_NAME` 标签镜像部署到生产环境，此阶段需要审核。


## 4. 实现流水线的准备工作

- 设置 CI 专用节点用于运行流水线
- 准备一个 Gitee 帐户（用于存放代码，也可以使用自己搭建的 GitLab 或是 GitHub）
- 准备一个 Harbor 镜像仓库，并创建账户（用于存放构建的镜像，也可以使用 DockerHub 或是其他镜像仓库）
- 创建 kubeconfig 凭证
- 创建一个 DevOps 项目（使用上文创建的 `opsxlab-devops`）

### 4.1 为依赖项缓存设置 CI 专用节点

通常情况下，构建应用程序的过程中需要拉取不同的依赖项。这可能会导致某些问题，例如拉取时间长和网络不稳定，这会进一步导致构建失败。

我们可以配置一个节点或一组节点，专门用于持续集成 (CI)。这些 CI 节点可以通过使用缓存来加快构建过程。为我们流水线提供更可靠和稳定的环境。

执行下面的命令，标记节点 `ksp-worker-1` 作为 CI 节点：

```bash
kubectl label nodes ksp-worker-1 node-role.kubernetes.io/worker=ci --overwrite
```

### 4.2 创建 Gitee 仓库访问凭证

**Step1：在 Gitee 上执行下面的任务。**

-  登录 Gitee 创建私人令牌，点击「生成新令牌」。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-gitee-personal-access-tokens.png)

- 填写描述信息，并设置最小权限。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-gitee-personal-access-tokens-new.png)

- 点击「提交」,弹出「私人令牌生成提示」，请妥善保存生成的令牌。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-gitee-personal-access-tokens-copy.png)

- 点击「确认并关闭」，返回私人令牌管理页面。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//opsxlab:ksp-v341-devops-gitee-personal-access-tokens-opsxlab-gitee.png)

**Step2：在 KubeSphere 控制台上执行下面的任务。**

- 以 `opsxlab` 身份登录 KubeSphere 控制台。
- 进入您的 DevOps 项目，在左侧导航栏，选择**DevOps 项目设置 > 凭证**。
- 在右侧的**凭证**区域，点击**创建**。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-credentials.png)

- 在弹出的**创建凭证**对话框，设置以下参数：
  - 名称：填写凭证名称 `opsxlab-gitee`
  - 类型：选择**用户名和密码**
  - 用户名：输入您的 Gitee 账户名称 `opsxlab`
  - 密码/令牌：输入您在 Gitee 中创建的私人令牌

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-credentials-opsxlab-gitee.png)

### 4.3 创建 Harbor 仓库访问凭证

**Step1：在 Harbor 上执行下面的任务。**

- 登录 Harbor，选择「系统管理」 -> 「机器人账户」，点击「添加机器人账户」

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-harbor-robot-accounts.png)

- 填写基本信息，名称输入 `devops`，系统会**自动增加 robot-** 的前缀，过期时间选择，永不过期。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-harbor-accounts-devops-base.png)

> **说明：**  您的机器人名称前缀可能是 `robot$`，请到「配置管理」-「系统设置」中修改。

- 设置系统权限，考虑**最小化原则**，**不选择**任何系统权限。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-harbor-accounts-devops-permission-null.png)

- 设置项目权限，为了顺利完成后面的演示。这里，我选择了「覆盖全部项目」，并「全选」所有权限（生产环境请考虑**最小化原则**，按需分配权限），点击「完成」按钮。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-harbor-accounts-devops-project-permission-all.png)

- 弹出创建成功页面，复制令牌内容，点击「导出到文件中」，页面会自动关闭。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-harbor-accounts-devops-%20complete.png)

**Step2：在 KubeSphere 控制台上执行下面的任务。**

- 以 `opsxlab` 身份登录 KubeSphere 控制台。
- 进入您的 DevOps 项目，在左侧导航栏，选择**DevOps 项目设置 > 凭证**。
- 在右侧的**凭证**区域，点击**创建**。
- 在弹出的**创建凭证**对话框，设置以下参数：
  - 名称：填写凭证名称 `opsxlab-harbor`
  - 类型：选择**用户名和密码**。
  - 用户名：输入您的 Harbor 机器人名称 `robot-devops`
  - 密码/令牌：输入您的 Harbor 机器人令牌

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-credentials-opsxlab-harbor.png)

### 4.4 创建 kubeconfig 凭证

接下来，我们创建 kubeconfig 凭证。

- 以 `opsxlab` 身份登录 KubeSphere 控制台。
- 进入您的 DevOps 项目，在左侧导航栏，选择**DevOps 项目设置 > 凭证**。
- 在右侧的**凭证**区域，点击**创建**。
- 在弹出的**创建凭证**对话框，设置以下参数：
  - 名称：设置凭证名称，例如 `opsxlab-kubeconfig`
  - 类型：选择**kubeconfig**
  - 内容：系统自动获取当前 Kubernetes 集群的 kubeconfig 文件内容，并自动填充该字段，您无须做任何更改。但是访问其他集群时，您可能需要更改 kubeconfig

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-credentials-opsxlab-kubeconfig.png)

### 4.5 凭证列表

创建完成的所有凭证列表如下所示：

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-credentials-opsxlab-complete.png)

## 5. DevOps 流水线实战

### 5.1 在 Gitee 仓库中 Fork 测试项目

- 登录 Gitee， Fork KubeSphere 官方提供的 GitHub 上的测试项目 **devops-maven-sample** 至您的 Gitee 个人帐户。

项目 URL 为 `https://github.com/kubesphere/devops-maven-sample` ，操作过程参考如下：

在 Gitee 个人主页，点击「右上角的加号」，选择「从 GitHub/GitLab 导入仓库」。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-gitee-import.png)

仓库类型选择**私有**，并填写其它信息，点击「导入」。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-import-devops-maven-sample.png)

成功导入后的内容如下：

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-maven-sample.png)

### 5.2 新增 Jenkinsfile

根据流水线规划设计，直接在 `Master` 分支新建一个 `Jenkinsfile-sample`  实现简化版流水线。

**说明：** 实际使用中，本文示例的流水线不会直接到代码仓库拉取 `Jenkinsfile-sample`  文件。将该文件存入代码仓库的 `master` 分支，是为了实现版本管理和后续的实验。

- 在您自己的 Gitee 仓库 **devops-maven-sample** 中的 `master` 分支，点击右上角的**加号按钮**，点击「新建文件」。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-devops-maven-sample-create-file.png)

- 需要填写的信息如下图：

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-devops-maven-sample-Jenkinsfile-sample.png)

- 文本框内流水线核心内容如下：

```yaml
pipeline {
  agent {
    node {
      label 'maven'
    }
  }

  parameters {
    string(name:'BRANCH_NAME',defaultValue: 'master',description:'')
    string(name:'TAG_NAME',defaultValue: '',description:'')
  }

  environment {
    DOCKER_CREDENTIAL_ID = 'opsxlab-harbor'
    GITHUB_CREDENTIAL_ID = 'opsxlab-gitee'
    KUBECONFIG_CREDENTIAL_ID = 'opsxlab-kubeconfig'
    REGISTRY = 'registry.opsxlab.cn:8443'
    DOCKERHUB_NAMESPACE = 'opsxlab'
    GITHUB_ACCOUNT = 'opsxlab'
    APP_NAME = 'devops-maven-sample'
    GIT_REPOSITORY_URL = 'https://gitee.com'
  }
  stages {
    stage('拉取代码') {
      steps {
        git(url: "${GIT_REPOSITORY_URL}/${GITHUB_ACCOUNT}/${APP_NAME}.git", credentialsId: "${GITHUB_CREDENTIAL_ID}", branch: "$BRANCH_NAME", changelog: true, poll: false)
      }
    }

    stage ('编译测试') {
      steps {
        container ('maven') {
          sh 'mvn clean test'
        }
      }
    }

    stage ('编译构建') {
      steps {
        container ('maven') {
          sh 'mvn clean package -DskipTests'
        }
      }
    }

    stage ('制作并推送镜像') {
      steps {
        container ('maven') {
          withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD', usernameVariable : 'DOCKER_USERNAME', credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
            sh 'echo "$DOCKER_PASSWORD" | podman login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
            sh 'podman build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$TAG_NAME .'
            sh 'podman push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$TAG_NAME'
          }
        }
      }
    }
    
    stage('推送 latest 标签'){
      when{
        branch 'master'
      }
      steps{
        container ('maven') {
          sh 'podman tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$TAG_NAME $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
          sh 'podman push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
        }
      }
    }
    
    stage('部署到 k8s Prod 集群') {
      when{
        branch 'master'
      }
      steps {
        input(id: 'deploy-to-dev', message: 'deploy to K8s Prod?')
        container ('maven') {
          withCredentials([
            kubeconfigFile(credentialsId: env.KUBECONFIG_CREDENTIAL_ID, variable: 'KUBECONFIG')]) {
              sh 'envsubst < deploy/prod-all-in-one/devops-sample.yaml | kubectl apply -f -'
            }
        }
      }
    }
  }
}
```

**重要变量说明：**

| 条目                     |         值          | 描述信息                                                     |
| :----------------------- | :-----------------: | :----------------------------------------------------------- |
| DOCKER_CREDENTIAL_ID     |   opsxlab-harbor    | 您在 KubeSphere 中为 Harbor（DockerHub） 帐户设置的**名称**，用于访问 Harbor （DockerHub） 仓库。 |
| GITHUB_CREDENTIAL_ID     |    opsxlab-gitee    | 您在 KubeSphere 中为 Gitee （GitHub）帐户设置的**名称**，用于访问 Gitee  （GitHub）仓库。 |
| KUBECONFIG_CREDENTIAL_ID | opsxlab-kubeconfig  | 您在 KubeSphere 中为 kubeconfig 设置的**名称**，用于访问运行中的 Kubernetes 集群。 |
| REGISTRY                 |      docker.io      | 默认为 `docker.io`，用作推送镜像的地址。                     |
| DOCKERHUB_NAMESPACE      |       opsxlab       | 请替换为您的 Harbor（DockerHub） 的命名空间，一般为帐户名，也可以替换为该帐户下的项目名称。 |
| GITHUB_ACCOUNT           |       opsxlab       | 请替换为您的 Gitee （GitHub）帐户名。例如，如果您的 GitHub 地址是 `https://github.com/kubesphere/`，则您的 GitHub 帐户名为 `kubesphere`，也可以替换为该帐户下的 Organization 名称。 |
| APP_NAME                 | devops-maven-sample | 应用名称，对应 Gitee （GitHub）上的项目仓库名称。            |
| GIT_REPOSITORY_URL       |  https://gitee.com  | Git 仓库服务器地址，本文使用 https://gitee.com               |

- 编辑内容后，点击页面底部的 **提交**，更新 `master` 分支中的文件。

### 5.3 修改 Dockerfile-online

Dockerfile 中使用的基础镜像为 DockerHub 上的 `java:8u92-jre-alpine`，网络受限的用户可以提前拉取该镜像到本地镜像仓库，并修改 Dockerfile 文件。

- 在您自己的 Gitee 仓库 **devops-maven-sample** 中的 `master` 分支，点击根目录中的文件 `Dockerfile-online`。
- 点击右侧的编辑按钮，编辑自定义配置。
- 修改后的最终内容如下

```yaml
FROM registry.opsxlab.cn:8443/library/java:8u92-jre-alpine

WORKDIR /home

COPY target/*.jar /home

ENTRYPOINT java -jar *.jar
```

- 编辑内容后，点击页面底部的 **提交**，更新 `Master` 分支中的文件。

### 5.4 创建项目

接下来我们在 KubeSphere 上创建一个项目 `kubesphere-sample-prod`，代表生产环境。待流水线成功运行，将在这个项目中自动创建应用程序的相关部署 (Deployment) 和服务 (Service)。

- 以 `opsxlab` 身份登录 KubeSphere。在您创建 DevOps 项目的企业空间中创建项目 `kubesphere-sample-prod`。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-workspaces-opsxlab-projects-kubesphere-sample-prod.png)

- 项目创建后，会显示在项目列表中。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-workspaces-opsxlab-procects-list.png)

### 5.5 创建流水线

- 以 `opsxlab` 身份登录 KubeSphere。转到 DevOps 项目 `opsxlab-devops`，点击**创建**。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-create.png)

- 在弹出的对话框中，填入基本信息，将其命名为 `jenkinsfile-sample` 并在**流水线类别**下拉列表中选择**流水线**。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-pipelines-jenkinsfile-sample.png)

- 点击「下一步」，在**高级设置**中，所有配置项使用默认值。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-pipelines-jenkinsfile-sample-advanced.png)

- 点击「创建」，完成创建并返回流水线列表。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-list.png)

### 5.6 运行流水线

- 流水线创建后，点击该流水线名称进入其详情页面。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-jenkinsfile-sample-pipeline.png)

> **备注:** 流水线详情页显示**同步状态**，即 KubeSphere 和 Jenkins 的同步结果。若同步成功，您会看到**成功**图标中打上绿色的对号。

- 点击「编辑 Jenkinsfile」，输入 Gitee 仓库 **devops-maven-sample** 中`Jenkinsfile-sample` 文件的内容，点击「确定」。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-jenkinsfile-sample-pipeline-Jenkinsfile.png)

- 点击「运行记录」，再点击「流水线配置」，刷新流水线内容。图形化显示流水线配置。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-jenkinsfile-sample-pipeline-graph.png)

- 点击「运行」，在弹出的「设置参数」窗口，输入**TAG_NAME** 的值 **v0.0.1**，**BRANCH_NAME** 参数使用默认值 `master`，点击「确定」。

![ksp-v341-devops-opsxlab-devops-pipelines-jenkinsfile-sample-pipeline-run](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-jenkinsfile-sample-pipeline-run.png)

> **说明：**  第一次运行时，可能不会弹出**设置参数**窗口，请立即点击「运行记录」，停止对应的任务后。再次点击「运行」。

- 稍等片刻，没有异常时，会以图形化展示完整的流水线流程及任务执行进度。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-jenkinsfile-sample-pipeline-run-activity.png)

- 流水线在 `部署到 K8s Prod 集群` 阶段暂停，您需要手动点击绿色的 **Proceed** 按钮，**继续**流水线任务。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-jenkinsfile-sample-pipeline-run-complete.png)

**特殊说明：**

- 在开发或生产环境中，可能需要具有更高权限的人员（例如版本管理员）来审核流水线、镜像以及代码分析结果。他们有权决定流水线是否能进入下一阶段。
- 在 Jenkinsfile 中，您可以使用 `input` 来指定由谁审核流水线。如果您想指定一个用户（例如 `project-admin`）来审核，您可以在 Jenkinsfile 中添加一个字段。
- 在 KubeSphere 3.4 中，如果不指定审核员，那么能够运行流水线的帐户也能够继续或终止该流水线。如果指定审核员，流水线创建者或者您指定的审核员账户均有权限继续或终止流水线。
- 本文示例没有增加额外的审核员，直接使用创建流水线的账户继续执行流水线任务。

### 5.7 检查流水线状态

- 在**运行日志**中，您可以查看流水线的运行状态。请注意，流水线在刚创建后将继续初始化几分钟。示例流水线有六个阶段，它们已在 `Jenkinsfile-sample`中单独定义。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-jenkinsfile-sample-pipeline-task-status.png)

- 点击每一个阶段名称，比如**编译构建**。可以查看该阶段的详细运行日志。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-jenkinsfile-sample-pipeline-task-status-stage.png)

- 点击右上角的**查看完整日志**来查看流水线完整的运行日志。您可以看到流水线的动态日志输出，包括可能导致流水线无法运行的错误。对于每个阶段，您都可以点击该阶段来查看其日志，而且可以将日志下载到本地计算机进行进一步分析（图略）。
- 流水线的每一次运行，在「运行记录」中都会有完整的记录，如下所示。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-devops-pipelines-jenkinsfile-sample-pipeline-run-logs.png)

### 5.8 验证结果

- 流水线成功运行后，会自动推送 Docker 镜像并在 K8s 集群中部署服务。
- 按照 Jenkinsfile 中的定义，通过流水线构建的 Docker 镜像已成功推送到 Harbor 镜像仓库。在 Harbor 镜像仓库中，您会看到带有标签 `v0.0.1和 latest` 的镜像。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-harbor-devops-maven-sample-artifacts-v001.png)

- 示例应用程序将部署到 `kubesphere-sample-prod`项目，并创建相应的部署和服务。转到这个项目，预期结果如下所示：

| 环境       | URL                         | 命名空间               | 部署      | 服务      |
| :--------- | :-------------------------- | :--------------------- | :-------- | :-------- |
| Production | `http://{$NodeIP}:{$30961}` | kubesphere-sample-prod | ks-sample | ks-sample |

- 查看部署（Deployment）

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-kubesphere-sample-prod-deployments-ks-sample.png)

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-kubesphere-sample-prod-deployments-ks-sample-resource-status.png)

- 查看服务（ Service）

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-devops-opsxlab-kubesphere-sample-prod-services-ks-sample-resource-status.png)

### 5.9 访问示例服务

- 在 K8s 控制节点，使用 **kubectl** 执行以下命令，获取 ks-sample 服务的 NodePort

```bash
$ kubectl get svc -n kubesphere-sample-prod
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
ks-sample   NodePort   10.233.10.213   <none>        8080:30961/TCP   1h
```

- 使用 `curl` 访问 {$NodeIP}:{$NodePort}。

```bash
$ curl 192.168.9.91:30961
Really appreciate your star, that's the power of our life.
```

**免责声明：**

- 笔者水平有限，尽管经过多次验证和检查，尽力确保内容的准确性，**但仍可能存在疏漏之处**。敬请业界专家大佬不吝指教。
- 本文所述内容仅通过实战环境验证测试，读者可学习、借鉴，但**严禁直接用于生产环境**。**由此引发的任何问题，作者概不负责**！