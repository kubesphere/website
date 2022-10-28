---
title: "在控制台上编辑系统资源"
keywords: "系统, 资源, KubeSphere, Kubernetes"
description: "在控制台上启用对系统资源的编辑功能。"
linkTitle: '在控制台上编辑系统资源'
Weight: 16520
---

当您安装 KubeSphere 时，企业空间 `system-workspace` 将被创建，用于运行所有 KubeSphere 系统项目和 Kubernetes 系统项目。为了避免对这两个系统的误操作，您不能直接在控制台上编辑该企业空间中的资源。但是，您仍然可以使用 `kubectl` 来修改资源。

本教程演示如何启用 `system-workspace` 资源的编辑功能。

{{< notice warning >}}

编辑 `system-workspace` 中的资源可能会导致意外结果，例如 KubeSphere 系统和节点故障，并且可能对您的业务造成影响。执行此操作时请高度谨慎。

{{</ notice >}}

## 编辑控制台配置

1. 以 `admin` 用户登录 KubeSphere，点击右下角的 <img src="/images/docs/v3.3/common-icons/hammer.png" height="25" width="25" />，然后选择 **Kubectl**。

2. 执行如下命令：

   ```bash
   kubectl -n kubesphere-system edit cm ks-console-config
   ```

3. 在 `client` 下添加 `systemWorkspace` 字段并保存文件。

   ```yaml
   client:
     version:
       kubesphere: v3.3.1
       kubernetes: v1.21.5
       openpitrix: v3.3.1
     enableKubeConfig: true
     systemWorkspace: "$"  # 请手动添加此行。
   ```

4. 执行如下命令重新部署 `ks-console`，并等待容器组重建。

   ```bash
   kubectl -n kubesphere-system rollout restart deployment ks-console
   ```

5. 刷新 KubeSphere 控制台。`system-workspace` 中的项目将出现编辑按钮。

6. 如需关闭控制台的编辑功能，请采用相同方法删除 `systemWorkspace` 字段。