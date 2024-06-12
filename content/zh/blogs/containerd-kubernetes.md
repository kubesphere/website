---
title: '超越预期：containerd 如何成为 Kubernetes 的首选容器运行时'
tag: 'Kubernetes'
keywords: 'Kubernetes, KubeSphere, containerd'
description: '本篇文章将探讨低级和高级容器运行时的区别，并解释为什么 Kubernetes 选择 containerd 作为其默认的容器运行时。此外，我们还将介绍三种与 containerd 相关的 CLI 工具：ctr、crictl 和 nerdctl。'
createTime: '2024-06-11'
author: '尹珉'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/20240611-containerd-cover.png'
---

## 踏上 containerd 技术之旅

容器技术已经成为现代软件开发和部署的核心工具。通过容器，开发者可以创建轻量级、便携的运行环境，从而简化应用程序的开发、测试和部署流程。在容器技术的生态系统中，容器运行时扮演着至关重要的角色。本篇文章将探讨低级和高级容器运行时的区别，并解释为什么 Kubernetes 选择 containerd 作为其默认的容器运行时。此外，我们还将介绍三种与 containerd 相关的 CLI 工具：ctr、crictl 和 nerdctl。

## containerd 架构及说明

containerd 是一个高效、可靠的开源容器运行时，它被设计为从开发到生产环境的核心容器管理解决方案。containerd 的架构主要分为三个部分：生态系统（Ecosystem）、平台（Platform）和客户端（Client）。每个部分在整个系统中扮演着不同的角色，协同工作以提供全面的容器管理功能。 

![](https://pek3b.qingstor.com/kubesphere-community/images/3db600ce38aa46a6cbb4e09b681c95d4.png)

### 生态系统（Ecosystem）

containerd 的生态系统包括一系列与其集成的工具和组件，这些工具和组件扩展了 containerd 的功能并增强了其适用性。

- **CRI 插件**：与 Kubernetes 紧密集成，通过实现 Container Runtime Interface (CRI)，使 Kubernetes 能够管理容器。
- **CNI 插件**：使用 Container Network Interface (CNI)插件进行网络管理，提供容器的网络连接。
- **CSI 插件**：Container Storage Interface (CSI)插件用于存储管理，允许容器挂载和管理存储卷。
- **镜像管理**：支持 Docker 镜像和 OCI 镜像规范，提供从镜像仓库拉取、存储和管理容器镜像的能力。
- **插件机制**：允许通过插件扩展 containerd 的功能，满足特定的需求。

### 平台（Platform）

containerd 的平台层是整个系统的核心，负责管理和调度容器运行时的所有基本操作。这个层次的主要组件包括：

- **守护进程**：containerd 守护进程负责处理所有的容器管理请求，并维护容器的生命周期。
- **gRPC API**：通过 gRPC API 与外部客户端通信，提供标准化的接口以执行容器操作。
- **任务管理**：管理容器的创建、启动、停止和删除任务，确保容器按照预期运行。
- **快照管理**：使用快照（Snapshot）机制管理容器文件系统，实现高效的存储操作。
- **事件监控**：实时监控容器事件，提供日志记录和事件通知功能，便于运维人员进行故障排查和系统监控。

### 客户端（Client）

containerd 的客户端提供用户与 containerd 平台交互的方式。主要的客户端工具包括：

- **ctr**：containerd 自带的命令行工具，用于直接与 containerd 进行交互。虽然功能强大，但主要用于开发和调试场景。
- **crictl**：专为 Kubernetes 设计的命令行工具，通过 CRI 接口与 containerd 进行交互，适用于 Kubernetes 集群的运维和管理。
- **nerdctl**：一个 Docker 兼容的 CLI 工具，提供类似 Docker 的用户体验，使用户无需重新学习即可使用 containerd 管理容器。

## 了解 OCI 标准的影响

### OCI 规范的由来

开放容器倡议（Open Container Initiative，OCI）是一个旨在制定开放标准的行业组织。它由 Docker 公司于 2015 年 6 月提出，并在 Linux 基金会的支持下成立。OCI 的主要目标是通过定义标准化的容器格式和运行时，促进容器技术的互操作性和一致性。
在容器技术快速发展的过程中，不同的容器运行时和格式逐渐涌现，导致了兼容性和互操作性问题。为了应对这些挑战，OCI 提出了一套统一的标准，确保不同容器工具和平台之间的兼容性和互操作性。

### OCI 规范三个核心部分

#### 镜像规范（Image Specification）

镜像规范定义了容器镜像的格式和内容，确保镜像可以在不同的容器运行时和平台上兼容使用。镜像规范的主要内容包括：

- **镜像配置**：定义镜像的元数据，如镜像的创建时间、作者、版本等。
- **文件系统层**：描述镜像的文件系统层次结构，包括基础层和增量层。
- **分发格式**：定义镜像的打包和传输格式，确保镜像可以在不同的镜像仓库和运行时之间传输。

#### 运行时规范（Runtime Specification）

运行时规范定义了容器的运行环境和行为，确保容器可以在不同的容器运行时上以一致的方式执行。运行时规范的主要内容包括：

- **配置文件**：定义容器的配置文件，包括容器的命名空间、cgroups、挂载点、环境变量等。
- **生命周期管理**：描述容器的生命周期管理，包括容器的创建、启动、停止和删除等操作。
- **进程管理**：定义容器内进程的管理和隔离，包括进程的启动参数、资源限制和隔离机制。

#### 分发规范（Distribution Specification）

分发规范定义了容器镜像的分发方法和协议，确保镜像可以高效、安全地在不同的注册表和客户端之间传输。分发规范的主要内容包括：

- **内容地址**：使用内容寻址机制确保镜像和其他内容的完整性和一致性。
- **分层结构**：定义分层镜像格式，以便高效存储和传输镜像。
- **API 定义**：提供标准的 API 接口，用于上传、下载、查询和管理镜像。

### 什么是低级和高级容器运行时

了解了 OCI 规范后，我们再来看看什么是低级和高级容器运行时的区别。了解这些区别有助于我们更好地理解容器运行时的选择和优化，确保在不同的应用场景中能够选择最合适的工具，从而提高系统性能和管理效率。

#### 低级容器运行时

低级容器运行时（low-level container runtime）是指那些直接与操作系统内核交互，负责创建和管理容器进程的运行时。它们通常提供最基本的容器管理功能，例如启动、停止和删除容器。低级运行时的一个典型例子是 runc。

低级容器运行时的主要特点包括：

- **轻量级**：仅包含最核心的功能，减少了系统资源的消耗。
- **高性能**：由于其简洁的设计，低级运行时通常具有更高的运行效率。
- **稳定性和安全性**：直接与内核交互，减少了中间层的复杂性，提高了系统的稳定性和安全性。

#### 高级容器运行时

高级容器运行时（high-level container runtime）在低级运行时之上构建，提供更丰富的功能和更高层次的抽象。例如，它们可以管理容器镜像、网络、存储等方面。containerd 是一个典型的高级容器运行时。

高级容器运行时的主要特点包括：

- **功能丰富**：除了基本的容器管理功能外，还提供镜像构建、网络配置、存储管理等高级功能。
- **易用性**：高级运行时通常附带友好的 CLI 和 API 接口，方便开发者和运维人员使用。
- **集成性**：与各类开发工具和平台紧密集成，提供端到端的容器管理解决方案。

#### 低级和高级运行时的区别及应用场景

低级和高级容器运行时的主要区别在于其功能的广度和抽象层次。低级运行时更贴近系统底层，提供基本的容器管理功能，适合需要精细控制和优化的场景。高级运行时则提供更丰富的功能，简化了容器管理和操作，适合开发和运维人员使用，帮助他们专注于应用程序本身，而不必关注底层的实现细节。

## Kubernetes 选用 containerd 的背后考量

### Kubernetes 与 containerd 的关系

Kubernetes 是一个用于自动化部署、扩展和管理容器化应用程序的开源平台。在其早期版本中，Kubernetes 主要使用 Docker 作为容器运行时。然而，随着容器生态系统的发展，Kubernetes 社区决定采用更为专用和轻量级的 containerd 作为默认的容器运行时。

### containerd 的优点及其在 Kubernetes 中的应用

containerd 是一个工业级的容器运行时，专为性能和稳定性设计。它提供了核心的容器管理功能，如镜像管理、容器执行和存储管理。containerd 的设计目标是简单、高效和与 Kubernetes 的深度集成。其主要优点包括：

- **轻量级**：containerd 是一个专注于核心功能的轻量级运行时，避免了不必要的复杂性。
- **性能高**：containerd 在启动速度和资源使用方面表现出色，非常适合在高并发和大规模环境中使用。
- **稳定性**：containerd 经过了广泛的测试和验证，具有很高的可靠性和稳定性。

### Kubernetes 选择 containerd 的原因分析

Kubernetes 选择 containerd 作为默认的容器运行时有几个主要原因：

1. **专注于核心功能**：containerd 专注于容器管理的核心功能，避免了过多的功能堆积，保持了运行时的轻量和高效。
2. **深度集成**：containerd 与 Kubernetes 的深度集成，使得 Kubernetes 可以更加高效地管理容器和镜像。
3. **社区支持**：containerd 由 CNCF（Cloud Native Computing Foundation）托管，得到了广泛的社区支持和贡献，确保了其长期的维护和发展。
4. **独立性**：与 Docker 相比，containerd 更加独立，不依赖于其他工具或平台，减少了系统复杂性。

## containerd 安装指南

### containerd 官网

[https://containerd.io/](https://containerd.io/)

### 下载 containerd release 包

```shell
[root@anolis89 containerd]# wget https://github.com/containerd/containerd/releases/download/v1.7.14/containerd-1.7.14-linux-amd64.tar.gz
```

### 解压 release 包

```shell
[root@anolis89 containerd]# tar -zxvf cri-containerd-1.7.14-linux-amd64.tar.gz -C /
```

### 生成 containerd 默认配置文件

```shell
[root@anolis89 containerd]# mkdir /etc/containerd/
[root@anolis89 containerd]# containerd congfig default > /etc/containerd/config.toml
```

### 启动 containerd 服务

```shell
[root@anolis89 containerd]# systemctl start containerd && systemctl enable containerd
```

### 验证 containerd 服务

```shell
[root@anolis89 containerd]# ctr version
```

![](https://pek3b.qingstor.com/kubesphere-community/images/20240611-yinmin-2.png)

## containerd CLI 工具推荐

![](https://pek3b.qingstor.com/kubesphere-community/images/20240611-yinmin-3.png)

### ctr

- **定义和功能：** ctr 是一个用于测试和调试 containerd 的轻量级 CLI 工具。它提供了一些基本的命令，可以用于快速验证 containerd 的功能。
- **使用场景及实例：** ctr 主要用于开发和测试环境，例如开发者需要验证 containerd 是否正确安装和配置时，可以使用 ctr 运行一些基本的测试命令。

```shell
ctr version
ctr images pull docker.io/library/busybox:latest
ctr run -t --rm docker.io/library/busybox:latest busybox sh
```

### crictl

- **定义和功能：** crictl 是一个用于与 Kubernetes CRI（Container Runtime Interface）交互的 CLI 工具。它提供了一组命令，可以用于检查和管理通过 CRI 运行的容器和镜像。
- **使用场景及实例：** crictl 主要用于 Kubernetes 环境下的容器管理。例如，管理员可以使用 crictl 查看当前运行的容器、检查容器日志或执行容器操作。

```shell
crictl ps
crictl logs <container_id>
crictl exec <container_id> <command>
```

### nerdctl（推荐）

- **定义和功能：** nerdctl 是专为 Containerd 设计的轻量级命令行工具，它的诞生旨在为那些从 Docker 转向 Containerd 的用户提供一个熟悉的操作界面。
- **使用场景及实例：** nerdctl 适合那些熟悉 Docker CLI 但希望使用 containerd 的用户。例如，开发者可以使用 nerdctl 来构建和运行容器，而不需要学习全新的命令集合。

**nerdctl 与 Docker 的区别：**

- **底层与上层之别：** 最本质的区别在于，Docker 是一个包含了完整容器生命周期管理的平台，包含了 Docker daemon 等多个组件。而 nerdctl 是一个纯粹的命令行工具，专注于与 Containerd 交互，后者作为低层级运行时，处理容器和镜像的实际操作。
- **兼容与创新：** nerdctl 虽然兼容 Docker 的 CLI 习惯，但并不意味着它是 Docker 的简单复制品。它在兼容基础上引入了新功能，如延迟拉取镜像（lazy-pulling）和镜像加密等，这些是 Docker 本身不具备的。
- **性能与效率：** 由于直接操作 Containerd，避免了 Docker daemon 这一层的额外开销，nerdctl 在某些场景下能提供更好的性能和资源利用率。
- **定位差异：** Docker 适合需要一站式解决方案的用户，而 nerdctl+Containerd 组合更适合那些追求轻量、高性能及与 Kubernetes 紧密集成的环境。

```shell
nerdctl run -d --name nginx -p 80:80 nginx
nerdctl build -t myimage .
nerdctl network create mynetwork
```

## 结语与展望

containerd 作为一个轻量级、高性能和稳定的容器运行时，已经成为 Kubernetes 的首选。通过专注于核心功能和深度集成，containerd 为容器管理提供了高效的解决方案。ctr、crictl 和 nerdctl 等 CLI 工具进一步丰富了 containerd 的功能，帮助开发者和运维人员更好地管理和调试容器。

展望未来，containerd 有望继续在容器技术领域发挥重要作用，推动容器生态系统的发展和创新。
