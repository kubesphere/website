---
title: '让容器通信变得简单：深度解析 Containerd 中的 CNI 插件'
tag: 'Kubernetes'
keywords: 'Kubernetes, KubeSphere, containerd, CNI'
description: '作为容器网络的关键组成部分，CNI 插件在实现容器之间的网络通信中扮演了重要角色。了解 CNI 插件不仅可以帮助我们更好地管理 Kubernetes 集群，还能提升我们的整体运维效率。'
createTime: '2024-07-17'
author: '尹珉'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/containerd-cni-20240717-cover.png'
---

## 引言

在[上一篇文章](https://kubesphere.io/zh/blogs/containerd-kubernetes/)中，我们详细讨论了 Kubernetes 中 containerd 的使用方法和一些核心概念。今天，我们将继续深入，探索 containerd 中的 CNI 插件。作为容器网络的关键组成部分，CNI 插件在实现容器之间的网络通信中扮演了重要角色。了解 CNI 插件不仅可以帮助我们更好地管理 Kubernetes 集群，还能提升我们的整体运维效率。

## 探索 CNI 插件的奥秘

### 1. 什么是 CNI 插件？

CNI（Container Network Interface）插件是独立的可执行文件，遵循 CNI 规范。Kubernetes 通过 kubelet 调用这些插件来创建和管理容器的网络接口。CNI 插件的主要职责包括网络接口的创建和删除、IP 地址的分配和回收、以及相关网络资源的配置和清理。

![](https://pek3b.qingstor.com/kubesphere-community/images/3e21950f-e076-42b4-8f3b-8605e79aee3b.jpg)

### 2. CNI 插件的工作流程简述

#### 2.1 Pod 创建

当一个新的 Pod 被创建时，kubelet 会调用 CNI 插件的 ADD 命令。CNI 插件会为 Pod 分配一个网络接口，并设置相关的网络配置，如 IP 地址和路由。这包括配置 Pod 的网络命名空间，使其能够与其他 Pod 进行通信。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240717-2.png)

#### 2.2 Pod 删除

当 Pod 被删除时，kubelet 会调用 CNI 插件的 DEL 命令。CNI 插件会清理之前为该 Pod 分配的网络资源，如回收 IP 地址和删除网络接口。这一过程确保资源不会被浪费，并且系统能够持续高效地运行。

### 3. CNI 插件的功能

#### 3.1 自动网络配置

CNI 插件的一个主要功能是自动为新创建的容器分配 IP 地址并配置网络。这包括以下步骤：
- IP 地址分配：CNI 插件借助 IPAM（IP Address Management）模块为每个容器分配唯一的 IP 地址。
- 网络配置：设置路由和防火墙规则，确保容器能够与外部网络及其他容器进行通信。

#### 3.2 保证网络连接

CNI 插件确保容器能够与同一 Pod 内的其他容器、同一 Node 上的其他 Pod 以及不同 Node 上的 Pod 进行通信。这包括以下方面：
- Pod 内通信：在同一个 Pod 内，CNI 插件通过创建共享网络命名空间，使得同一 Pod 内的所有容器可以直接进行通信。
- 节点间通信：通过 Overlay 网络或直接路由，确保不同节点上的 Pod 可以无缝通信。
- 网络策略：实现安全性和隔离，通过网络策略控制不同 Pod 之间的访问权限。

#### 3.3 灵活的网络管理

CNI 插件提供了灵活的网络管理功能，使网络管理员可以灵活地选择和更换网络实现，而不需要对容器进行任何改动。这包括：
- 插件可插拔性：管理员可以根据需求选择不同的 CNI 插件（如 Flannel、Calico 等）来实现不同的网络功能。
- 动态配置：无需重启容器即可应用新的网络配置，支持动态扩展和调整网络结构。

通过这些功能，CNI 插件不仅简化了容器网络的配置和管理，还提供了灵活性和可扩展性，使 Kubernetes 集群的网络架构更加高效和安全。

CNI 的主要功能是在容器启动时，为其分配网络资源，并在容器停止时释放这些资源。通过标准化接口，CNI 可以与不同的网络插件配合使用，实现灵活的网络配置

### 4. 常见 CNI 插件的介绍

![](https://pek3b.qingstor.com/kubesphere-community/images/cni-plugins-20240717.png)

#### 4.1 Calico 插件

Calico 是一种高性能的 CNI 插件，提供安全的 L3 网络，并支持丰富的网络策略。它使用 BGP 协议在集群中分发路由信息，实现高效的网络连接。
- 高性能：由于直接在 L3 层进行路由，Calico 性能优异。
- 网络安全：Calico 支持网络策略，可以精细控制 Pod 之间的通信。

详见：[https://www.tigera.io/project-calico/](https://www.tigera.io/project-calico/)。

![](https://pek3b.qingstor.com/kubesphere-community/images/d58485e7-48d5-4229-83ed-286d85721fe7.jpg)

#### 4.2 Bridge 插件

Bridge 插件是 CNI 中最基本的插件之一，通常用于本地主机网络。它通过创建 Linux 桥接（bridge）设备来连接容器和宿主机网络。
- 简单可靠：适合小型集群或单节点部署。
- 配置灵活：可以根据需要配置桥接设备的各种参数。

**详见：**[https://www.bookstack.cn/read/feiskyer-kubernetes-handbook-202005/network-cni-cni.md](https://www.bookstack.cn/read/feiskyer-kubernetes-handbook-202005/network-cni-cni.md)。

![](https://pek3b.qingstor.com/kubesphere-community/images/cni-bridge-20240717.png)

#### 4.3 IPVlan 插件

IPVlan 插件是一种高性能的网络解决方案，允许容器直接使用主机的网络接口。它有两种模式：L2 模式和 L3 模式。
- 性能优越：由于直接使用主机网络接口，性能非常高。
- 简化网络管理：不需要复杂的网络配置，适合高性能场景

**详见：**[https://www.bookstack.cn/read/feiskyer-kubernetes-handbook-202005/network-cni-cni.md](https://www.bookstack.cn/read/feiskyer-kubernetes-handbook-202005/network-cni-cni.md)。

#### 5. 如何选择适合的 CNI 插件？

选择 CNI 插件时，需要考虑以下几个因素：

- 集群规模
  对于小型集群，Flannel 是一个简单易用的选择；对于大型集群，Calico 提供了强大的网络策略和隔离功能。
- 网络需求
  如果需要复杂的网络功能和安全策略，Calico 和 Cilium 是不错的选择；如果注重简单和快速部署，Weave 和 Flannel 可能更适合。
- 性能要求
  对于高性能需求的场景，IPVlan 和 MACVlan 提供了更高效的网络通信方式。

### 6. CNI 网络插件实现模式

容器网络接口（CNI）插件是容器网络架构的核心组件之一。它们的主要作用是管理容器的网络接口，为容器分配 IP 地址，并配置网络。CNI 插件有多种实现模式，每种模式都适用于不同的场景和需求。主要的实现模式包括 Overlay 模式和 Underlay 模式。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240717-5.png)

#### 6.1 Overlay 模式

Overlay 模式是一种虚拟化网络的实现方式，通过在现有的物理网络上构建逻辑网络隧道来实现容器之间的通信。以下是 Overlay 模式的核心特点：
- 逻辑隔离：Overlay 网络在物理网络之上创建逻辑网络，使不同的容器能够在同一物理网络上运行而不会相互干扰。这种逻辑隔离有助于提高网络的安全性和管理性。
- 灵活性：Overlay 网络可以在不改变物理网络架构的情况下轻松扩展和缩减。这使得在需要动态调整网络拓扑的场景中，Overlay 模式非常适用。
- 常见实现：常见的 Overlay 网络实现包括 VXLAN 和 GRE。这些技术通过封装原始数据包，并在物理网络上传输封装后的数据包，来实现跨节点的容器通信。

#### 6.2 Underlay 模式

与 Overlay 模式不同，Underlay 模式直接利用底层物理网络来实现容器之间的通信。这种模式通常用于对网络性能要求较高的场景。以下是 Underlay 模式的核心特点：
- 高性能：由于 Underlay 模式直接利用物理网络，因此减少了封装和解封装的开销，能够提供更高的网络性能。
- 直接互通：在 Underlay 模式下，容器的网络接口可以直接与物理网络设备通信，实现容器与物理网络资源的无缝互通。这对于需要与外部系统进行大量数据交换的应用非常重要。
- 常见实现：常见的 Underlay 网络实现包括 MAC VLAN、IP VLAN 和直接路由等。这些技术利用物理网络的能力，直接配置容器的网络接口，使其能够与底层网络进行通信。

#### 6.3 路由模式

除了 Overlay 和 Underlay 模式外，CNI 网络插件的实现模式还包括一种路由模式。路由模式的主要特点是利用现有的物理网络设备和路由协议来实现容器之间的通信。
- 高性能：减少了封装和解封装的开销，提供更高的网络性能。
- 可扩展性：利用现有的路由协议和网络设备，容易扩展到大型集群。
- 简单性：网络拓扑较为简单，无需额外的 Overlay 网络配置。

#### 6.4 选择合适的 CNI 插件模式

在选择 CNI 插件模式时，需要根据具体的应用场景和需求进行权衡：
- Overlay 模式适合：需要灵活调整网络拓扑、对网络隔离要求高的场景，如多租户环境或开发测试环境。
- Underlay 模式适合：对网络性能要求高、需要与外部系统进行大量数据交换的生产环境。
- 路由模式适合：追求高性能网络通信、需要精细的网络策略控制和可扩展性的大型企业级生产环境，特别是在多集群间需要一致的网络策略和高级路由功能的场景。

## 实战练习

### 1. 配置 containerd 使用 CNI 插件

#### 1.1 选用 Calico 插件作为演示

下载 Calico 安装清单。

```yaml
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

```yaml
kubectl get pod -A
```

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240717-6.png)

#### 1.2 验证集群是否正确配置 Caclico

```yaml
cat /etc/cni/net.d/0-calico.conflist
```

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240717-7.png)

完成上述步骤后，Kubernetes 集群应该已经安装并配置好 Calico 网络插件，以实现高效的网络管理。

### 2. 开发自定义 CNI 插件

然而，不同企业的网络需求各不相同，有时标准的 CNI 插件，如 Calico、Flannel 等，可能无法满足特定的网络策略或性能要求。因此，开发自定义 CNI 插件成为了扩展和定制 Kubernetes 网络能力的重要途径。

开发自定义 CNI 插件需要以下步骤：
- 编写插件代码：使用 Go 语言编写插件代码，定义插件的初始化、配置和删除逻辑。
- 实现 CNI 接口：实现 CNI 规范定义的接口，包括`ADD`、`DEL`等操作。
- 编译插件**：将插件代码编译成可执行文件。
- 配置 CNI 插件：在 CNI 配置文件中添加自定义插件的配置，指定插件路径和参数。
- 测试和调试：通过创建和删除容器来测试插件功能，使用日志和调试工具排查问题。

例如，以下是一个简单的 CNI 插件示例：

```go
package main

import (
    "fmt"
    "os"
    "github.com/containernetworking/cni/pkg/skel"
    "github.com/containernetworking/cni/pkg/types/current"
    "github.com/containernetworking/cni/pkg/types"
)

func main() {
    skel.PluginMain(cmdAdd, cmdCheck, cmdDel, version.All, bv.BuildString("example"))
}

func cmdAdd(args *skel.CmdArgs) error {
    // 实现ADD逻辑
    result := &current.Result{}
    return types.PrintResult(result, "0.3.1")
}

func cmdCheck(args *skel.CmdArgs) error {
    // 实现CHECK逻辑
    return nil
}

func cmdDel(args *skel.CmdArgs) error {
    // 实现DEL逻辑
    return nil
}
```

## 简化容器通信，让 Kubernetes 网络更高效

通过本文，我们深入了解了 CNI 插件在 containerd 中的重要作用，并通过实际案例展示了如何在 Kubernetes 中配置和使用 CNI 插件。CNI 插件不仅简化了容器的网络配置，还提供了灵活的网络管理和安全隔离功能。