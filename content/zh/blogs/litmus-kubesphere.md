---
title: 'KubeSphere 部署 Litmus 至 Kubernetes 开启混沌实验'
tag: 'Litmus,KubeSphere'
keywords: 'Litmus,LitmusChaos,Kubernetes,Helm,KubeSphere'
description: 'Litmus 是一种开源的云原生混沌工程工具集，专注于 Kubernetes 集群进行模拟故障测试，以帮助开发者和 SRE 发现集群及程序中的缺陷，从而提高系统的健壮性。本文介绍了 Litmus 的架构以及在 KubeSphere 上的部署方法，通过一系列混沌实验来验证整个基础设施和服务抵抗故障的能力。'
createTime: '2021-06-09'
author: '杨传胜'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/20210609224203.png'
---

![](https://pek3b.qingstor.com/kubesphere-community/images/20210609224203.png)

对于云服务而言，如果系统出现异常，将会带来很大的损失。为了最大程度地降低损失，我们只能不断探寻系统何时会出现异常，甚至缩小到某些特定参数变化是否会造成系统异常。然而随着云原生的发展，不断推进着微服务的进一步解耦，海量的数据与用户规模也带来了基础设施的大规模分布式演进，系统中的故障变得越来越难以预料。**我们需要在系统中不断进行实验，主动找出系统的缺陷，这种方法被称作混沌工程**。毕竟实践是检验真理的唯一标准，所以混沌工程可以帮助我们更加透彻地掌握系统的运行规律，提高系统的弹性能力。

Litmus 是一种开源的云原生混沌工程工具集，专注于 Kubernetes 集群进行模拟故障测试，以帮助开发者和 SRE 发现集群及程序中的缺陷，从而提高系统的健壮性。

## Litmus 架构

Litmus 的架构如图所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/20210601004600.png)

Litmus 的组件可以划分为两部分：

1. Portal
2. Agents

**Portal** 是一组 Litmus 组件，作为跨云管理混沌实验的控制平面 (WebUI) ，用于协调和观察 Agent 上的混沌实验工作流。

**Agent** 也是一组 Litmus 组件，包括运行在 K8s 集群上的混沌实验工作流。

使用 **Portal**，用户可以在 **Agent** 上创建和调度新的混沌实验工作流，并从 **Portal** 上观察结果。用户还可以将更多的集群连接到 Portal，并将 Portal 作为跨云混沌工程管理的单个门户。

### Portal 组件

+ **Litmus WebUI**

  Litmus WebUI 提供了 Web 用户界面，用户可以在这里轻松构建和观察混沌实验工作流。Litmus WebUI 也充当了跨云混沌实验控制平面。

+ **Litmus Server**

  Litmus Server 作为中间件，用于处理来自用户界面的 API 请求，并将配置和处理结果详情信息存储到数据库中。它还充当各个请求之间的通信接口，并将工作流程调度到 **Agent**。

+ **Litmus DB** 

  Litmus DB 作为混沌实验工作流及其测试结果详情的存储系统。

### Agent 组件

+ **Chaos Operator**

  Chaos Operator 监视 `ChaosEngine` 并执行 `CR` 中提到的混沌实验。Chaos Operator 是命名空间范围的，默认情况下运行在 `litmus` 命名空间中。实验完成后，Chaos Operator 会调用 `chaos-exporter` 将混沌实验的指标导出到 Prometheus 数据库中。

+ **CRDs**

  Litmus 安装过程中会生成以下几个 CRD：

  ```bash
  chaosexperiments.litmuschaos.io
  chaosengines.litmuschaos.io
  chaosresults.litmuschaos.io
  ```

+ **Chaos Experiment**

  Chaos Experiment（混沌实验）是 LitmusChaos 体系结构中的基本单元，用户可以从 [Chaos Hub](https://hub.litmuschaos.io/) 上选择现场的混沌实验或者自己创建新的混沌实验来构建所需的混沌实验工作流。简单来说就是定义一个该测试支持哪些操作、能传入哪些参数、可对哪些类型的对象进行测试等 CRD 资源清单，通常分为三种类别：通用的测试（比如内存，磁盘，CPU等操作），应用的测试（比如针对 Nginx 来进行测试），平台测试（针对于某个云平台的测试：AWS, Azure, GCP）。详情可参考 [Chaos Hub 的文档](https://litmusdocs-beta.netlify.app/docs/chaoshub)。

+ **Chaos Engine**

  ChaosEngine 将 Chaos Experiment 实现的功能具体实施到命名空间中的应用中。该 CR 由 Chaos Operator 监控。

+ **Chaos Results**

  ChaosResult 保存了混沌实验的结果，它会在实验运行时创建或更新，包含了各种信息，包括 Chaos Engine 的配置、实验状态等。`chaos-exporter` 将会读取结果并导出到 Prometheus 数据库中。

+ **Chaos Probes**

  Chaos Probes 是可插拔的指标探针，可以在任意混沌实验的 ChaosEngine 中定义，实验 Pod 会根据其定义的模式来执行相应的检测，并将其是否成功作为决定实验结果的必要条件（还包括了标准的“内置”检测）。

+ **Chaos Exporter**

  可以选择将指标导出到 Prometheus 数据库。Chaos Exporter 实现了  Prometheus metrics endpoint。

+ **Subscriber**

  Subscriber 用来和 Litmus Server 交互，获取混沌实验工作流的详细结果，并发送回 Agent 端。

## 准备 KubeSphere 应用模板

[KubeSphere](https://kubesphere.com.cn) 集成了 [OpenPitrix](https://github.com/openpitrix/openpitrix) 来提供应用程序全生命周期管理，OpenPitrix 是一个多云应用管理平台，KubeSphere 利用它实现了应用商店和应用模板，以可视化的方式部署并管理应用。对于应用商店中不存在的应用，用户可以将 Helm Chart 交付至 KubeSphere 的公共仓库，或者导入私有应用仓库来提供应用模板。

本教程将使用 KubeSphere 的应用模板来部署 Litmus。

要想从应用模板部署应用，需要创建一个企业空间、一个项目和两个用户用户（`ws-admin` 和 `project-regular`）。`ws-admin` 必须被授予企业空间中的 `workspace-admin` 角色， `project-regular` 必须被授予项目中的 `operator` 角色。在创建之前，我们先来回顾一下 KubeSphere 的多租户架构。

### 多租户架构

KubeSphere 的多租户系统分**三个**层级，即集群、企业空间和项目。KubeSphere 中的项目等同于 Kubernetes 的[命名空间](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/)。

您需要创建一个新的[企业空间](https://kubesphere.com.cn/docs/workspace-administration/what-is-workspace/)进行操作，而不是使用系统企业空间，系统企业空间中运行着系统资源，绝大部分仅供查看。出于安全考虑，强烈建议给不同的租户授予不同的权限在企业空间中进行协作。

您可以在一个 KubeSphere 集群中创建多个企业空间，每个企业空间下可以创建多个项目。KubeSphere  为每个级别默认设有多个内置角色。此外，您还可以创建拥有自定义权限的角色。KubeSphere  多层次结构适用于具有不同团队或组织以及每个团队中需要不同角色的企业用户。

### 创建帐户

安装 KubeSphere 之后，您需要向平台添加具有不同角色的用户，以便他们可以针对自己授权的资源在不同的层级进行工作。一开始，系统默认只有一个用户 `admin`，具有 `platform-admin` 角色。在本步骤中，您将创建一个用户 `user-manager`，然后使用 `user-manager` 创建新帐户。

1. 以 `admin` 身份使用默认帐户和密码 (`admin/P@88w0rd`) 登录 Web 控制台。

> 出于安全考虑，强烈建议您在首次登录控制台时更改密码。若要更改密码，在右上角的下拉菜单中选择**个人设置**，在**密码设置**中设置新密码，您也可以在**个人设置**中修改控制台语言。

2. 登录控制台后，点击左上角的**平台管理**，然后选择**访问控制**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602121105.png)

   在**帐户角色**中，有如下所示四个可用的内置角色。接下来要创建的第一个用户将被分配 `users-manager` 角色。

   | 内置角色             | 描述                                                         |
   | -------------------- | ------------------------------------------------------------ |
   | `workspaces-manager` | 企业空间管理员，管理平台所有企业空间。                       |
   | `users-manager`      | 用户管理员，管理平台所有用户。                               |
   | `platform-regular`   | 平台普通用户，在被邀请加入企业空间或集群之前没有任何资源操作权限。 |
   | `platform-admin`     | 平台管理员，可以管理平台内的所有资源。                       |

3. 在**帐户管理**中，点击**创建**。在弹出窗口中，提供所有必要信息（带有*标记），然后在**角色**字段选择 `users-manager`。请参考下图示例。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602121344.png)

   完成后，点击**确定**。新创建的帐户将显示在**帐户管理**中的帐户列表中。

4. 切换帐户使用 `user-manager` 重新登录，创建如下三个新账户。

   | 帐户              | 角色               | 描述                                                         |
   | ----------------- | ------------------ | ------------------------------------------------------------ |
   | `ws-manager`      | `workspaces-manager` | 创建和管理所有企业空间。 |
   | `ws-admin`        | `platform-regular` | 管理指定企业空间中的所有资源（此帐户用于邀请成员 project-regular 加入该企业空间）。 |
   | `project-regular` | `platform-regular` | 该帐户将用于在指定项目中创建工作负载、流水线和其他资源。     |
   
5. 查看创建的三个帐户。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602125533.png)

### 创建企业空间

在本步骤中，您需要使用上一个步骤中创建的帐户 `ws-manager` 创建一个企业空间。作为管理项目、创建工作负载和组织成员的基本逻辑单元，企业空间是 KubeSphere 多租户系统的基础。

1. 以 `ws-manager` 身份登录 KubeSphere，它具有管理平台上所有企业空间的权限。点击左上角的**平台管理**，选择**访问控制**。在**企业空间**中，可以看到仅列出了一个默认企业空间 `system-workspace`，即系统企业空间，其中运行着与系统相关的组件和服务，您无法删除该企业空间。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602124954.png)

2. 点击右侧的**创建**，将新企业空间命名为 `demo-workspace`，并将用户 `ws-admin` 设置为企业空间管理员，如下图所示：

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602125154.png)

   完成后，点击**创建**。
   
3. 登出控制台，然后以 `ws-admin` 身份重新登录。在**企业空间设置**中，选择**企业成员**，然后点击**邀请成员**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602130213.png)

4. 邀请 `project-regular` 进入企业空间，授予其 `workspace-viewer` 角色。

   > 实际角色名称的格式：`<workspace name>-<role name>`。例如，在名为 `demo-workspace` 的企业空间中，角色 `viewer` 的实际角色名称为 `demo-workspace-viewer`。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602130602.png)

5. 将 `project-regular` 添加到企业空间后，点击**确定**。在**企业成员**中，您可以看到列出的两名成员。

   | 帐户              | 角色               | 描述                                                         |
   | ----------------- | ------------------ | ------------------------------------------------------------ |
   | `ws-admin`        | `workspace-admin`  | 管理指定企业空间中的所有资源（在此示例中，此帐户用于邀请新成员加入企业空间、创建项目）。 |
   | `project-regular` | `workspace-viewer` | 该帐户将用于在指定项目中创建工作负载和其他资源。             |

### 创建项目

在此步骤中，您需要使用在上一步骤中创建的帐户 `ws-admin` 来创建项目。KubeSphere 中的项目与 Kubernetes 中的命名空间相同，为资源提供了虚拟隔离。有关更多信息，请参见[命名空间](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/)。

1. 以 `ws-admin` 身份登录 KubeSphere，在**项目管理**中，点击**创建**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602133054.png)

2. 输入项目名称（例如 `litmus`），然后点击**确定**完成，您还可以为项目添加别名和描述。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602133203.png)

3. 在**项目管理**中，点击刚创建的项目查看其详细信息。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602133307.png)

4. 邀请 `project-regular` 至该项目，并授予该用户 `operator` 角色。请参考下图以了解具体步骤。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602134743.png)

   > 具有 `operator` 角色的用户是项目维护者，可以管理项目中除用户和角色以外的资源。

### 添加应用仓库

1. 以 `ws-admin` 用户登录 KubeSphere 的 Web 控制台。在您的企业空间中，进入**应用管理**下的**应用仓库**页面，并点击**添加仓库**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602134919.png)

2. 在弹出的对话框中，将应用仓库名称设置为 `litmus`，将应用仓库的 URL 设置为 `https://litmuschaos.github.io/litmus-helm/`，点击**验证**对 URL 进行验证，再点击**确定**进入下一步。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602135311.png)

3. 应用仓库导入成功后会显示在如下图所示的列表中。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602135549.png)

## 部署 Litmus 控制平面

导入 Litmus 的应用仓库后，就可以通过应用模板来部署 Litmus 了。

1. 登出 KubeSphere 并以 `project-regular` 用户重新登录。在您的项目中，进入**应用负载**下的**应用**页面，再点击**部署新应用**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602140249.png)

2. 在弹出的对话框中选择**来自应用模板**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602140535.png)

3. 在弹出的对话框中选择**来自应用模板**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602140626.png)

   **来自应用商店**：选择内置的应用和以 Helm Chart 形式单独上传的应用。

   **来自应用模板**：从私有应用仓库和企业空间应用池选择应用。

4. 从下拉列表中选择之前添加的私有应用仓库 `litmus`。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602140742.png)

5. 选择 litmus-2-0-0-beta 进行部署。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602140905.png)

6. 您可以查看应用信息和配置文件，在**版本**下拉列表中选择版本，然后点击部署。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602141139.png)

7. 设置应用名称，确认应用版本和部署位置，点击下一步。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602141030.png)
   
8. 在应用配置页面，您可以手动编辑清单文件或直接点击部署。
   
   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602141412.png)
   
9. 等待 Litmus 创建完成并开始运行。
   
   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602143418.png)
## 访问 Portal 服务

Portal 的 Service 名称为 `litmusportal-frontend-service`。可以先到服务界面查看它的 NodePort：

![](https://pek3b.qingstor.com/kubesphere-community/images/20210602143755.png)

用 `${Node IP}:${NODEPORT}` 地址访问 Portal：

![](https://pek3b.qingstor.com/kubesphere-community/images/20210602144559.png)

默认的用户名密码：

```bash
Username: admin
Password: litmus
```

## 部署 Agent（可选）

Litmus 包含两种类型的 Agent：

+ Self Agent
+ External Agent

默认情况下，安装 `Litmus` 所在的集群会被自动注册为 Self Agent，`Portal` 默认会在 Self Agent 中执行混沌实验。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210604162858.png)

前面也说了，`Portal` 是一个跨云混沌实验控制平面，也就是说，用户可以将多个部署在外部 K8s 集群中的 External Agent 连接到当前 `Portal`，以便将混沌实验下发给 `Agent`，并在 `Portal` 中观察结果。

关于 External Agent 的部署方式，可以参考 [Litmus 的官方文档](https://litmusdocs-beta.netlify.app/docs/agent-install)。

## 创建混沌实验

Portal 安装完成后，可以通过 Portal 界面来创建混沌实验，需要先创建一个用来测试的应用：

```bash
$ kubectl create deployment nginx --image=nginx --replicas=2 --namespace=default
```

下面开始创建实验。

1. 登录 Portal

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602144559.png)

2. 进入 Workflows 页面点击【Schedule a workflow】

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604155639.png)

3. 选择 Agent，比如 Self-Agent：

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604162947.png)

4. 选择从 Chaos Hub 中添加混沌实验：

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604163108.png)
   
5. 设置 Workflow 的名称：
   
   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604164811.png)

6. 点击 **【Add a new experiment】**，向 Workflow 中添加混沌实验：

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604163227.png)

7. 选择实验 pod-delete：

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604164132.png)

8. 立即开始调度：

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604164642.png)
   
9. 在 KubeSphere 中可以看到 Pod 被删除重建了：

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604165246.png)

10. Portal 界面也可以看到实验成功了：   

    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604165727.png)

    点击具体的 Workflow 节点，可以看到详细的日志：   
    
    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604165915.png)

11. 重复上面的步骤，创建混沌实验 pod-cpu-hog：

    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604171414.png)

    在 KubeSphere 中可以看到 Pod 的 CPU 使用率已经接近 1C：

    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604171300.png)

12. 下面这个实验用来模拟 Pod 网络丢包，开始实验前先把 Nginx 的副本数设为 1：

    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604172152.png)
    
    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604172227.png)
    
    现在只有一个 Pod，IP 为 `10.233.71.170`：
    
    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604172312.png)
    
    下面重复上面的步骤，创建混沌实验 pod-network-loss，并修改丢包率为 `50%`：
    
    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604174057.png)
    
    在进入 KubeSphere 界面，在右下角的**工具箱**图标上悬停，然后在弹出菜单中选择 **Kubectl**。
    
    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604172630.png)
    
    通过 ping Pod 的 IP 来测试丢包率，可以看到丢包率接近 `50%`，实验成功：
    
    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604173731.png)

以上所有实验都是针对 Pod 进行的，除了 Pod 之外，还可以对 Node、K8s 组件等各种服务进行实验，感兴趣的读者可以自行测试。

## Workflow 详解

所谓的 Workflow，实际上就是一个混沌实验的工作流，虽然上一节的演示中每一个 Workflow 只有一个实验，但实际上每个 Workflow 都可以设置多个实验，并按照顺序执行。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210604180449.png)

Workflow 是由 CRD 来实现的，可以在 KubeSphere Console 界面中查看该 CRD，这里可以看到之前创建的所有 Workflow：

![](https://pek3b.qingstor.com/kubesphere-community/images/20210604175505.png)

以 pod-network-loss 为例，来看看有哪些参数：

![](https://pek3b.qingstor.com/kubesphere-community/images/20210604175705.png)

Workflow 中的每一个实验也是一个 CRD，CRD 名称为 `ChaosEngine`。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210604175950.png)

解释一下这里面各个环境变量的含义：

+ **appns**: 要执行对象所在的命名空间。
+ **experiments**：要执行测试的名称(例如网络延迟测试，Pod 删除测试等),可用 `kubectl get chaosexperiments -n test` 进行查看支持的 experiments。
+ **chaosServiceAccount**：要使用的 sa。
+ **jobCleanUpPolicy**: 是否保留执行该次测试的 Job,字段可选为 delete/retain。
+ **annotationCheck**: 是否进行注释检查,如果不进行检查,则所有的 Pod 都被进行测试,字段可选为 true/false。
+ **engineState**: 该次测试的状态,可被设置为 active/stop。
+ **TOTAL_CHAOS_DURATION**：混沌测试持续时间,默认 15s。
+ **CHAOS_INTERVAL**：混沌测试时间间隔,默认 5s。
+ **FORCE**：删除pod是否使用 --force 选项。
+ **TARGET_CONTAINER**: 删除 Pod 里面的某个容器(默认删除第一个)。
+ **PODS_AFFECTED_PERC**：测试 Pod 占总数的百分比,默认是 0(相当于1个副本)。
+ **RAMP_TIME**：在进行混沌测试前后需要等待的时间。
+ **SEQUENCE**：测试执行策略,默认是并行 (parallel) 执行,可被设置为 serial/parallel。

其他各个实验的详细参数这里就不赘述了，感兴趣的读者可以自己查阅相关文档。

## 总结

本文向大家介绍了混沌工程框架 Litmus 的架构以及在 KubeSphere 上的部署方法，通过一系列混沌实验来验证整个基础设施和服务抵抗故障的能力。Litmus 是一个特别优秀的混沌工程框架，背后有强大的社区支持，它的实验商店（即 Chaos Hub）中内置的实验将会越来越多，你可以将这些混沌实验一键部署到集群中制造混乱，通过可视化界面来直观展示实验结果，验证集群的弹性能力。有了 Litmus 之后，我们不但可以直面故障，还可以主动出击制造故障来找出系统的缺陷，避免黑天鹅事件的产生。

## 参考资料

+ [Getting Started with Litmus](https://litmusdocs-beta.netlify.app/docs/getstarted)
