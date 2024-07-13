---
title: "在 Hostinger VPS 上安装使用 KubeSphere"
keywords: "KubeSphere, 安装, Hostinger, VPS"
description: "了解如何使用 KubeSphere VPS 模板。"
linkTitle: "在 Hostinger VPS 上安装使用 KubeSphere"
Weight: 3450
version: "v3.4"
---

## VPS 简介

VPS（Virtual Private Server）是指虚拟专用服务器，它是通过将物理服务器分割为多个虚拟服务器来实现的。每个 VPS 都运行在独立的操作系统实例上，具有自己的资源（例如处理器、内存和存储）和完全独立的环境。

VPS 提供了一种相对较为经济实惠和灵活的方式来托管和运行应用程序、网站和服务。它可以被视为共享主机和独立物理服务器之间的一种折中方案。

VPS 具有以下特点和优势：

- 资源隔离：每个 VPS 都有自己的资源，与其他 VPS 相互隔离，因此一个 VPS 的活动不会对其他 VPS 产生影响。这提供了更高的安全性和稳定性。
- 灵活性：VPS 允许用户根据自己的需求自定义配置和管理服务器，包括选择操作系统、安装所需的软件和调整资源分配。
- 可扩展性：VPS 的资源通常可以根据需求进行扩展或缩减，例如增加内存、存储空间或带宽。
- 独立性：每个 VPS 都有自己的独立 IP 地址和完全独立的网络连接，使得它可以直接访问互联网并提供服务。
- 管理简便：相对于独立服务器，VPS 的管理和维护工作通常较为简单，因为许多底层任务（如硬件维护和网络设置）由 VPS 提供商处理。

VPS 通常由虚拟化技术（如 KVM、VMware 或 OpenVZ）来实现，这些技术使得在单个物理服务器上同时运行多个 VPS 成为可能。用户可以通过远程访问来管理和操作他们的 VPS，就像他们拥有一台独立的物理服务器一样。

需要注意的是，VPS 并不同于云服务器（Cloud Server），尽管它们在某些方面相似。云服务器是基于云计算平台提供的资源，可以通过弹性伸缩、按需付费等特性来满足不同的需求。而 VPS 通常是在单个物理服务器上提供的虚拟化解决方案，资源相对固定。

## Hostinger VPS 简介

[Hostinger](https://www.hostinger.com/) 提供两种类型的 VPS：VPS 托管与 Minecraft 托管。具体详情请参考 [Hostinger VPS 相关文档](https://support.hostinger.com/en/articles/1583571-what-are-the-available-operating-systems-for-vps)。

目前 Hostinger 提供预安装的 KubeSphere 的 Ubuntu 22.04 VPS 模板。通过安装该模板，即可在 Hostinger VPS 上使用 KubeSphere。

## 如何使用 KubeSphere VPS 模板

现在，您可以在 Hostinger 平台上，一键部署包含了 KubeSphere 的 VPS，而无需额外在 VPS 手工部署了，极大的简化了您的运维工作，具体步骤请参考 [Hostinger KubeSphere VPS 相关文档](https://support.hostinger.com/en/articles/8687660-how-to-use-the-kubesphere-vps-template)。