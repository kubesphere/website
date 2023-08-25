---
title: "上传基于 Helm 的应用程序"
keywords: "Kubernetes, Helm, KubeSphere, OpenPitrix, 应用程序"
description: "了解如何向您的企业空间上传基于 Helm 的应用程序用作应用模板。"
linkTitle: "上传基于 Helm 的应用程序"
weight: 9200
---

KubeSphere 提供应用程序的全生命周期管理。例如，企业空间管理员可以上传或创建新的应用模板，并进行快速测试。此外，管理员会将经过充分测试的应用发布到[应用商店](../../application-store/)，这样其他用户能一键部署这些应用。为了开发应用模板，企业空间管理员首先需要将打包的 [Helm chart](https://helm.sh/) 上传到 KubeSphere。

本教程演示了如何通过上传打包的 Helm chart 来开发应用模板。

## 准备工作

- 您需要启用 [KubeSphere 应用商店 (OpenPitrix)](../../pluggable-components/app-store/)。
- 您需要创建一个企业空间和一个用户 (`project-admin`)。该用户必须被邀请至企业空间中，并被授予 `workspace-self-provisioner` 角色。有关更多信息，请参考[创建企业空间、项目、用户和角色](../../quick-start/create-workspace-and-project/)。

## 动手实验

1. 用 `project-admin` 帐户登录 KubeSphere。在企业空间页面，转到**应用管理**下的**应用模板**，点击**创建**。

2. 在弹出的对话框中，点击**上传**。您可以上传自己的 Helm chart，或者下载 [Nginx chart](/files/application-templates/nginx-0.1.0.tgz) 用它作为示例来完成接下来的步骤。

3. 文件包上传完毕后，点击**确定**继续。

4. 您可以在**应用信息**下查看应用的基本信息。点击**上传图标**来上传应用的图标。您也可以跳过上传图标，直接点击**确定**。

    {{< notice note >}}

应用图标支持的最大分辨率为 96 × 96 像素。

{{</ notice >}}

5. 成功上传后，模板列表中会列出应用，状态为**开发中**，意味着该应用正在开发中。上传的应用对同一企业空间下的所有成员均可见。

6. 点击应用，随后打开的页面默认选中**版本**标签。点击待提交版本以展开菜单，您可以在菜单上看到**删除**、**测试**、**提交发布**的选项。

7. 有关如何将应用发布到应用商店的更多信息，请参考[应用程序生命周期管理](../../application-store/app-lifecycle-management/)。
