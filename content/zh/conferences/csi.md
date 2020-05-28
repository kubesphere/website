---
title: '基于 CSI Kubernetes 存储插件的开发实践'
author: '王欣'
createTime: '2019-12-04'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20190930112634.png'
---

现在很多用户都会将自己的应用迁移到 Kubernetes 容器平台中。在 Kubernetes 容器平台中，存储是支撑用户应用的基石。随着用户不断的将自己的应用深度部署在 K8S 容器平台中，但是我们现有的 Kubernetes 存储插件无论从多样性还是存储的功能来说，都无法满足用户日益增长的需求。我们急需开发新的存储插件，将我们的存储服务和 Kubernetes 容器平台相对接。

## Kubernetes 存储插件分类

今天的主题是基于 CSI Kubernetes 存储插件的开发实践，我们会通过以下四部分为大家详细讲解 CSI 插件有什么功能，如何部署一个 CSI 插件，以及 CSI 的实践原理。

首先，我们会介绍 Kubernetes 存储插件的分类情况；然后为大家介绍如何开发一款 QingCloud 云平台 CSI 插件；之后，会介绍如何将 QingCloud 云平台 CSI 插件部署到 Kubernetes 容器平台中；最后，介绍如何对开发的 CSI 插件进行质量管理。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001182756.png)

在 Kubernetes 容器平台中，Kubernetes 可以调用某类存储插件，对接后端存储服务，如调用 GCE 存储插件对接后端 GCE 存储服务。Kubernetes 里的存储插件可以分为 **In-tree 和 Out-of-tree** 这两大类。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001182807.png)

首先，In-tree 存储插件的代码是在 Kubernetes 核心代码库里，In-tree 存储插件运行在 Kubernetes 核心组件里。Kubernetes 容器平台要使用后端某类存储服务，需要调用相应的 In-tree 存储插件，比如 Kubernetes 容器平台要使用后端 AWS 存储服务，需要调用 In-tree AWS 存储插件才能对接后端 AWS 存储服务。

另一类存储插件是 Out-of-tree 的存储插件，其代码和 Kubernetes 核心代码相独立。它的部署与 Kubernetes 核心组件的部署相独立，Kubernetes 核心组件可以通过调用某类 Out-of-tree 存储插件对接我们后端的存储服务，比如 Kubernetes 可以通过调用 GCE Out-of-tree 存储插件对接后端 GCE 存储服务。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001182819.png)

**将 In-tree 存储插件和 Out-of-tree 存储插件进行比较：**

从功能性上来看，In-tree 存储插件支持的功能比较有限，比如存储管理基本功能：存储卷创建、删除、挂载、卸载等功能。
而 Out-of-tree 存储插件在功能性上比较丰富，除了有存储卷管理的基本功能外，现在也有快照管理功能。比如我们可以创建基于某个存储卷的快照，删除快照或者从快照恢复创建一个存储卷。

从支持存储类型的种类来说，In-tree 的存储插件种类比较有限，用户需要准备 Kubernetes 原生支持的若干存储系统，这样会限制用户的选择。如果用户要在 Kubernetes 里选 In-tree 存储插件，必须有官网上列出的存储服务端才能对接。

而 Out-of-tree 存储插件支持的存储类型比较多样，存储厂商或者存储系统商开发相应的 Out-of-tree 存储插件，即可以与 Kubernetes 容器平台对接。这样不会限制用户的选择。

从易维护性上来说，In-tree 存储插件的代码在 K8S 核心代码仓库内，跟随 Kubernetes 打包发布。从维护性上来说并不是很好维护，In-tree 存储插件运行在 Kubernetes 核心组件内，如果 In-tree 存储插件出现问题，也会影响 Kubernetes 核心组件的正常运行。
而 Out-of-tree 存储插件的代码独立于 Kubernetes，也可以独立构建发布，比较易于维护。今后的趋势是，尽量开发和使用 Out-of-tree 存储插件。

Out-of-tree 存储插件现在分为 FlexVolume 和 CSI 两大类。FlexVolume 插件是 Kubernetes1.2 开始支持的， QingCloud 云平台开发过相关的 FlexVolume 存储插件。FlexVolume 存储插件的部署相对 CSI 这种会复杂一些，FlexVolume 支持存储卷基本管理功能。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001182835.png)

另一种比较新的存储方案是 CSI 方案，CSI 方案全称是 Container Storage Interface，它是容器平台里的一种工业标准。CSI 不仅仅是针对 Kubernetes 容器平台开发的，它是一种容器平台的通用解决方案。存储服务商或者存储厂商只要开发支持 CSI 标准的存储插件，就可以供各种容器平台使用。Kubernetes 从 1.9 开始支持 CSI 规范。

CSI 插件方案部署起来比较简单，可以支持容器化部署，在 Kubernetes 容器平台中，我们可以用 Kubernetes 的资源对象直接部署 CSI 插件。CSI 插件方案功能比较强大，除了存储卷管理功能外，还有快照管理功能。CSI 的存储标准方案在持续快速发展中，功能也会不断扩展。今后我们会尽量开发和使用基于 CSI 的存储插件方案。

## 如何开发一款 CSI 插件

接下来跟大家分享我在 QingCloud 云平台开发 CSI 插件的经验，并且告诉大家 QingCloud 云平台是如何开发一款 CSI 插件，如何把 CSI 插件部署在 Kubernetes 容器平台中，为用户提供相应的存储支持。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001182857.png)

在谈到开发 CSI 插件之前，我们先了解一下 CSI 插件的基本原理：开发一款 CSI 插件要遵循 CSI 的标准实现相关的接口，在实现接口中，我们可以调用底层存储服务端的 API。在 QingCloud 云平台开发的 CSI 插件里，我们实现 CSI 接口是调用 QingCloud 云平台云平台 API 实现相关业务逻辑。

**CSI 插件在容器平台和存储资源体系结构中起到承上启下的作用。**

承上，容器平台可以通过 gRPC 调用 CSI 插件，对接 CSI 接口，支撑容器平台对于存储卷管理的功能，如创建、挂载、删除等操作。
启下，CSI 插件实现 CSI 接口，是通过调用存储服务端 API 实现相关业务逻辑，可以充分挖掘我们存储资源的能力。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001182912.png)

关于开发 CSI 插件，将会从以下三方面跟大家分享：

- 第一，CSI 接口规范。
- 第二，分享开发 CSI 插件的经验。
- 第三，开发 CSI 插件各个接口也要符合返回值规范。开发 CSI 插件的官方文档可以从 GitHub 上获取。

## CSI 接口规范

首先，开发一款 CSI 插件是要实现相关 CSI 的接口，作为开发者来说，CSI 规范将接口分为 Identity、Controller、Node 三大类。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001182936.png)

首先是 **Identity 接口**，其功能主要描述插件的基本信息，我们可以通过 GetPluginInfo 的接口获得插件版本号或者插件所支持的 CSI 规范版本，像 Get Plugin Capabilities，我们可以找到插件的功能点，插件是否支持存储卷创建、删除等功能，是否支持存储卷挂载的功能。得到插件元数据信息。此外 Identity 接口可以检查插件的健康状态，开发者可以通过实现 Probe 接口对我们插件健康状况进行检查。

第二类开发者要实现的接口是 **Controller 类接口**，它主要从存储服务端的角度对存储资源和存储卷进行相关管理的接口，如存储卷的创建和删除，开发者需要实现 Controller 接口的 Create Volume 接口和 Delete Volume 接口，对存储卷进行创建和删除的操作。

如果我们要从存储服务端进行操作，比如将存储卷挂载在某台主机上，或者将存储卷从某台主机上卸载，开发者要实现 ControllerPublishVolume 和 ControllerUnpublishVolume 这两个接口。

最后一类需要开发者实现的接口称为 **Node 类接口**，主要对主机上的存储卷进行操作。像存储卷的分区和格式化，将存储卷挂载到指定目录上，或者将存储卷从指定目录上卸载。

比如存储卷分区格式化，我们会调用 NodeStageVolume 和 NodeUnstageVolume 来实现。存储卷挂载至某个路径或者将存储卷从某个容器路径中卸载，开发者要实现 NodePublishVolume 和 NodeUnpublishVolume 这两个接口。

以上就是开发者要实现的三类接口，对于部署的用户或者对于容器平台来说，可以将 CSI 插件分为两类服务：Controller 类服务和 Node 类服务。
Controller 类服务主要调用 Controller 类接口，从存储服务端角度对存储卷进行管理和操作。Node类服务主要调用 Node 类接口，对主机上的存储卷进行相应的操作。

## CSI 插件开发经验

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001182946.png)

接下来以存储卷的生命周期为例为大家介绍 CSI 插件运行过程。在讲这个例子之前，我们想象一下个人在非容器化场景下如何使用存储卷。首先我们会打开云平台控制台，点击创建一个块存储卷，在控制台上把块存储卷挂载至某台主机，之后我们会登录主机，对主机里的存储卷进行分区格式化操作。再将已经分区格式化的存储卷挂载至某个路径下，才能让我们的应用使用这个存储卷。

在容器平台中流程也是相似的，接下来可以看到我们如何通过调用实现的各类 CSI 接口，完成我们对存储卷管理的过程。

当我们用户向容器平台发起创建存储卷的请求时，容器平台会调用 CSI 插件 Controller 服务的 CreateVolume 接口，发起创建存储卷的请求。
CSI 插件实现 CreateVolume 接口会调用底层云平台 API，云平台会创建好一个块存储卷。将块存储卷的信息通过 CSI 插件反馈给容器平台，此时状态称之为 Create 状态，表明存储卷已经创建好，从容器平台中进行管理。就像我们刚才所说的在 Controller 里完成创建存储卷的操作。

之后存储卷要被用户的应用所使用，用户会起一个容器化的应用挂载存储卷。容器平台会调度容器到某台主机上，相应的容器平台会调用 CSI 插件的 ControllerPublishVolume 接口，将存储卷挂载至某台主机上。

CSI 插件实现的 ControllerPublishVolume 接口会调用底层云平台 API 实现相关操作。完成操作后，存储卷挂载这台主机上，可以在这台主机上看到存储卷为某个块设备后，这个状态称之为 Node Ready 状态。相当于我们刚刚所说的，在云平台 Controller 界面，把存储卷挂载至某台主机上。这两个功能都是通过 Controller 服务来做的。Controller 服务是从存储服务端的角度对存储卷进行全局的控制。

达到 Node Ready 状态后，此时我们的存储卷可以在主机内可见，我们容器平台会调用 CSI 插件的 Node Stage Volume 接口对存储卷进行分区格式化操作。在 CSI 插件里，相关实现逻辑会对存储卷进行分区格式化，完成之后状态称之为 Volume Ready 状态，表明存储卷此时已完成了分区格式化的操作。

接下来容器平台，希望把存储卷挂载至容器指定目录下，可以调用 CSI 插件 Node 服务的 NodePublishVolume 接口实现相应的操作。完成相关操作后，存储卷此时已挂载到容器指定目录中，这个状态称之为 Published 状态，完成存储卷挂载至容器中的过程。
用户从非容器化情况下如何一步步挂载至主机目录，整个过程通过 CSI 插件和容器平台配合自动化完成。当用户应用运行结束后，需要卸载存储卷的过程和是刚才挂载存储卷的逆过程。

我们容器平台会依次调用 CSI 插件的 NodeUnpulishVolume、NodeUnstageVolume 这两个接口，将存储卷从主机内把指定的目录卸载。容器平台会调用 CSI 插件的 NodeUnpulishVolume，将存储卷从某台主机中卸载。此时状态回到 Created 状态，这时候 Created 状态存储卷在容器平台中来看是一个没有挂载到任何容器的存储卷资源。

此时在 Created 状态的存储卷，我们可以对其再进行一次挂载到容器中的操作，也可以对它进行删除操作。用户向容器平台发起删除存储卷请求后，容器平台会调用 CSI 插件的 DeleteVolume 接口，将存储卷删除。存储卷生命周期包括存储卷创建、挂载、卸载、删除等操作。

我们实现 CSI 插件仅仅简单的实现CSI接口所规定的字面意义是绝对不行的。例如：我们实现 CSI CreateVolume 接口直接调用底层云平台的创建存储卷 API 是远远不够的。其中需要开发者解决一个问题是，存储卷泄漏状况的发生。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001183004.png)

当容器平台发起一个创建存储卷请求时，CSI 插件会调用底层云平台 API 创建存储卷。此时在云平台这边创建一个存储卷 A，存储卷 A 的信息通过 CSI 插件反馈到容器平台。当你将存储卷 A 的信息反馈到容器平台时，一些意外情况没有及时反馈容器平台或者没有成功的反馈到容器平台时，容器平台会重新以相同的请求参数，再次发起一个创建存储卷的请求。

这个请求又会通过 CSI 插件调用底层云平台创建存储卷 API，在底层云平台中又会创建一个新的存储卷。新创建的存储卷称之为存储卷 B，底层云平台将存储卷 B 的信息通过 CSI 插件反馈到容器平台中，这样才能完成一次存储卷创建。

此时在存储服务端中会有 A、B 这两个存储卷，都是由容器平台创建的。而实际上在容器平台这边，管理并发现存储卷 B，对于存储卷 A 来说，对于容器平台来说是不可知的。此时，存储卷 A 是无人管理的存储卷，造成存储卷泄漏的问题。存储卷泄漏问题十分严重，不仅会造成资源的浪费，还会造成其他影响。比如当我们配额或者资源不足时，会影响我们正常创建存储卷的请求，不能正常创建存储卷。我们要避免存储卷泄漏情况的发生。CSI 插件通过实现 CSI 插件接口的幂等性，避免存储卷泄漏情况的发生。所谓幂等性指的是以相同参数对某个接口调用一次和多次的结果是相同的。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001183013.png)

就刚才的例子所说，我们要实现 CreateVolume 接口，创建一个存储卷时，不能简单的调用底层 API 创建存储卷。在创建存储卷之前，CSI 插件需要先到存储服务端查询是否有符合我们创建存储卷参数的存储卷存在，如果有，直接反馈存储卷信息。如果没有相应存储卷的存在，CSI 插件调用底层云平台 API 新建一个存储卷。

对于刚才的流程来说，首先看到容器平台发起创建存储卷的请求，插件成功调用底层云平台 API，成功创建存储卷 A 的信息。此时，存储卷 A 的信息并没有成功反馈到容器平台中，容器平台以相同的参数调用 CSI 的 CreateVolume API创建一个存储卷。我们有幂等性的插件会先到存储服务端检查是否有存储卷的存在，如果有符合参数存储卷的存在，直接将存储卷A的信息反馈到容器平台，避免存储卷泄漏问题的发生。

## CSI 返回值规范

我们开发 CSI 插件时也要符合 CSI 返回值的规范，CSI 对于存储插件的开发者来说，对 CSI 返回值有相关的规范。同时对于容器平台来说，要对不同返回值做相关的特殊处理。那么，我们在实际 Create Volume CSI 接口有怎样的返回值规范？

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001183027.png)

对于输入请求的参数，如果缺少必要的字段，实现 CSI 的接口需要立即返回，告诉容器平台你的请求缺少必要的字段。如果有的字段不支持也会返回给容器平台。

前面我们谈到如何开发 CSI 插件，我们开发 CSI 插件最重要的是实现 CSI 所规定的相关接口。我们 QingCloud 云平台开发了基于 QingCloud 云平台云平台的块存储 CSI 插件，也开发了基于 QingCloud 云平台 NeonSAN 的 CSI 插件。

## 如何部署 CSI 插件

我们将从通信、部署架构等多个方面，介绍我们如何将开发的 CSI 插件部署到 Kubernetes 容器平台中。我们使用的是 Kubernetes CSI 推荐的方式，可以从 GitHub 上获取。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001183038.png)

首先，我们来看通信方面的用途，前面谈到 Kubernetes CSI 对接组件和CSI存储插件共同构成存储插件层，在 Kubernetes 和存储服务之间。对于 CSI Controller 服务，可以看到 K8S 和 CSI 对接组件是通过调用 K8S API，通过 HTTP 协议与 K8S API Server 进行相关的交互。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001183052.png)

Kubernetes CSI 对接组件对于下层与 CSI 存储插件相通信，是通过 UDS 进行通信交互。CSI 存储插件收到调用 CSI 请求，调用底层云平台 API 也是通过 HTTP 协议实现的。

对于 Node 来说，K8S 核心组件是 Kubelet，通过 UDS 调用 CSI 存储插件所开发的 CSI 接口，CSI 存储插件实现了 CSI 接口，通过调用底层云平台 API，通过 HTTP 协议实现相关业务逻辑。这是我们 CSI 插件的通信流程。

那么如何部署CSI插件到K8S容器平台中呢，这是我们的部署架构图。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001183100.png)

在部署架构图里可以看到 K8S Master 节点，下面划出了三个 K8S 的 Node 节点。灰色组件表明 K8S 核心组件。在 Master 节点上，我们划出 K8S API Server。在 Node 节点上，我们只划出了 K8S 核心组件的 Kubelet。深蓝色部分指的是 K8S 与 CSI 的对接组件，这是由  Kubernetes 团队维护的。绿色部分表明 QingCloud 云平台开发的 CSI 存储插件。

首先可以从 Controller 服务来看，CSI 插件在部署时分为 Controller 类服务和 Node 类服务，Controller 类服务是从存储服务端的角度对存储资源进行相应的操作。

Controller 服务相当于 CSI 插件大脑，只需要部署 Controller 服务的一个副本即可，所以我们使用 K8S StatefulSet Workload 部署 Controller 服务。在 Controller 服务里，我们封装了 K8S 和 CSI 的对接组件，包括 External Provisioner、External Attacher 和 QingCloud 云平台开发的 CSI 存储插件也封装在这个服务里。主要流程是通过 External Provisioner 和 External Attacher，他们会主动获取 K8S API Server 存储的相关资源信息，再调用 Controller 里的 CSI 存储插件所使实现的 CSI 接口，对存储服务端的存储资源进行相关操作。

在 Node 服务中，前面谈到 Node 服务是从主机的角度对主机上的存储卷进行相关的操作。Node 服务使用 K8S DaemonSet 进行创建，在 Node 服务里，我们会封装一个 Driver Registrar 这么一个 K8S 和 CSI 的对接组件。这个组件的主要功能是将 Node 服务注册到我们节点上。
在 Node 服务中，也有个 CSI 存储插件的容器，在这个容器中，我们接收到本 Node 上 Kubelet 的调用，Kubelet 可以直接通过 UDS 调用 CSI 插件，Node 服务 CSI 存储插件的容器实现的相关 CSI 接口对主机上的存储卷进行操作，比如对主机上的存储卷进行分区格式化或者将存储卷挂载至某个容器的指定路径下，或者从某个容器的指定路径中进行卸载操作。

前面谈到 CSI 存储插件可以通过 Kubernetes 的资源对象进行部署，其优势是可支持容器化部署，并且部署简便。在部署 QingCloud 云平台 CSI 插件到 Kubernetes 平台中遵循了相关规范，我们使用了 Kubernetes 的 YAML 文件部署我们的 CSI 插件。可以看到我们部署的 CSI 插件会使用到 Config.yaml、RBAC 权限控制，Controller 使用 StatefulSet 部署，Node 服务通过 DaemonSet 部署。

Secret 密钥是为了拉取 CSI 插件的镜像所使用的资源对象。可以看到部署 CSI 插件到 Kubernetes 容器平台中，是使用 Kubernetes 已有的资源对象，完成部署过程。通过 Kubernetes 资源定义文件，我们可以很方便的让用户在不同的集群里快速部署标准化 CSI 插件。在 CSI 插件中需要对 Kubernetes 资源对象进行读写的操作。存储插件需要读写的权限，我们在读写权限使用 RBAC 进行权限控制。如图所示，我们在 attacher 这个功能点上赋予了 CSI 插件一些有限的权限，完成相关工作。

这里只让 CSI 插件有读写必要资源对象的权限，只能读取 Node 资源对象的权限或是读写 PersistentVolume, VolumeAttachement 等资源对象的权限。通过 RBAC 的权限控制可以维护集群安全，限制存储插件对于 Kubernetes 资源对象读写的权限，维护我们集群的安全。

## 如何对 CSI 插件进行质量管理

前面讲完我们如何开发一个 CSI 插件，以及如何将 CSI 插件部署到 Kubernetes 容器平台中。接下来我们看看在开发时，如何对 CSI 插件进行质量管控。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001183112.png)

我们在开发 CSI 插件时引入了持续集成的概念，我们在开发相关 CSI 插件代码时会写相关单元测试，对 CSI 插件进行相关测试。我们开发完代码，每次提交会先运行单元测试，通过一键式 Makefile 构建程序，再通过 Dockerfile 和 Makefile 一键式制作我们的 CSI 插件镜像。构建镜像成功后，我们通过前面所说的 K8S Yaml 资源定义文件，持续部署我们 CSI 插件到 Kubernetes 容器平台中。当部署成功后，我们会进行 Kubernetes CSI Test 的过程，Kubernetes CSI Test 是 K8S CSI 官方开发的一个测试 CSI 插件的项目，我们需要通过这个测试。
下一步是集成测试的阶段，在集成测试里我们会模拟用户使用情况创建资源对象，对我们 CSI 插件进行最后的测试。当集成测试成功后，才能顺利的完成提交过程。

从单元测试到持续集成过程中出现错误或过不去的情况，我们会返回开发代码阶段修复问题。引入持续集成开发 CSI 插件时，我们感觉到开发初期，有些问题快速暴露出来。我们快速定位问题并且解决，在开发 CSI 插件的后期可以顺利的进行 CSI 插件的版本发布等工作。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001183131.png)

关于 Kubernetes CSI Test 项目，它是 K8S CSI 官方开发的开源项目，主要测试 CSI 插件是否符合 CSI 标准规范。左图是相关 CSI Test 的截图，右图是我们开发 CSI 插件运行 CSI Test 后的结果。可以看到 QingCloud 云平台开发的 CSI 插件要通过 CSI Test。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001183141.png)

前面谈到 CSI 插件如何开发部署，并且谈到 CSI 的质量管理。接下来我们对 CSI 的发展进行简单的展望。我们知道 CSI 规范在不断快速发展中，昨天发布了 1.0 版本。下一步我们 CSI 规范会对快照功能进行完善，如快照保护等功能， QingCloud 云平台会持续跟进并且开发新 CSI 插件，支持最新的功能。

在 CSI 插件使用中，需要增加存储卷监控功能。用户使用存储卷挂载至容器中，我们需要知道存储卷已使用容量，存储卷监控是不可缺少的。当用户存储卷容量已经满或者将要满的时候，我们需要存储卷扩容的功能。Kubernetes CSI 官方逐渐将 K8S In-tree 的存储插件向 CSI 存储插件迁移，可以看到无论在开发和使用上，CSI 存储插件的确是大的趋势。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001183157.png)

以上列出了相关资源，最上面是 CSI 的定义规范，下面是 QingCloud 云平台开发的基于 QingCloud 云平台云平台的 CSI 存储插件，还有基于 NeonSAN 的 CSI 存储插件，都可以在 GitHub 上获取。

