---
title: "移除 KubeSphere 中的内置应用"
keywords: "KubeSphere, OpenPitrix, 应用程序, 应用"
description: "了解如何下架 KubeSphere 中的内置应用。"
linkTitle: "移除 KubeSphere 中的内置应用"
Weight: 16910
version: "v3.4"
---

作为一个以应用为中心的开源容器平台，KubeSphere 在基于 [OpenPitrix](https://github.com/openpitrix/openpitrix) 的应用商店中集成了应用。这些应用可供企业空间内的所有租户使用，但您也可以将这些应用从应用商店中移除。本教程为您演示怎样从应用商店中移除内置应用。

## 准备工作

- 您需要在本教程中使用具有 `platform-admin` 角色的用户（例如：`admin`）。
- 您需要[启用应用商店](../../../pluggable-components/app-store/)。

## 移除内置应用

1. 以 `admin` 身份登录 Web 控制台，点击左上角**平台管理**，然后选择**应用商店管理**。

2. 在**应用**页面，您可以看到列表中展示的应用。选择您想要从应用商店中移除的应用，例如，点击 **Tomcat** 跳转到其详情页面。

3. 在 Tomcat 的详情页面，点击**下架应用**以移除应用。

4. 在出现的对话框中，点击**确定**以确认您的操作。

5. 若要让该应用在应用商店中再次可用，请点击**上架应用**，然后点击**确定**以确认您的操作。

   {{< notice note >}}

   您也可以根据自己的需要，来创建包含必须角色的新用户。有关更多在 KubeSphere 中管理应用的信息，请参考[应用程序生命周期管理](../../../application-store/app-lifecycle-management/)。

   {{</ notice >}}

