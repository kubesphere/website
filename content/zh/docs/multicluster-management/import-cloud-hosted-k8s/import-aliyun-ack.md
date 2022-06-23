---
title: "导入阿里云 ACK 集群"
keywords: 'Kubernetes, KubeSphere, 多集群, 阿里云 ACK'
description: '了解如何导入阿里云 Kubernetes 集群。'
titleLink: "导入阿里云 ACK 集群"
weight: 5310
---

本教程演示如何使用[直接连接](../../../multicluster-management/enable-multicluster/direct-connection/)方法导入阿里云 ACK 集群。如果您想使用代理连接方法，请参考[代理连接](../../../multicluster-management/enable-multicluster/agent-connection/)。

## 准备工作

- 您需要准备已安装 KubeSphere 的 Kubernetes 集群，并将该集群设置为主集群。有关如何准备主集群的更多信息，请参考[准备主集群](../../../multicluster-management/enable-multicluster/direct-connection/#准备-host-集群)。
- 您需要准备已安装 KubeSphere 的 ACK 集群，用作成员集群。

## 导入 ACK 集群

### 步骤 1：准备 ACK 成员集群

1. 为了通过主集群管理，您需要使它们之间的 `jwtSecret` 相同。因此，首先需要在主集群上执行以下命令获取 `jwtSecret`。

   ```bash
   kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
   ```

   输出类似如下：

   ```yaml
   jwtSecret: "QVguGh7qnURywHn2od9IiOX6X8f8wK8g"
   ```

2. 以 `admin` 身份登录 ACK 集群的 KubeSphere 控制台。点击左上角的**平台管理**，选择**集群管理**。

3. 访问**定制资源定义**，在搜索栏输入 `ClusterConfiguration`，然后按下键盘上的**回车键**。点击 **ClusterConfiguration** 访问其详情页。

4. 点击右侧的 <img src="/images/docs/zh-cn/multicluster-management/import-cloud-hosted-k8s/import-ack/three-dots.png" height="20px">，选择**编辑 YAML** 来编辑 `ks-installer`。

5. 在 `ks-installer` 的 YAML 文件中，将 `jwtSecret` 的值修改为如上所示的相应值，将 `clusterRole` 的值设置为 `member`。点击**更新**保存更改。

   ```yaml
   authentication:
     jwtSecret: QVguGh7qnURywHn2od9IiOX6X8f8wK8g
   ```

   ```yaml
   multicluster:
     clusterRole: member
   ```

   {{< notice note >}}

   请确保您使用自己的 `jwtSecret`。您需要等待一段时间使更改生效。

   {{</ notice >}}

### 步骤 2：获取 kubeconfig 文件

登录阿里云的控制台。访问**容器服务 - Kubernetes** 下的**集群**，点击您的集群访问其详情页，然后选择**连接信息**选项卡。您可以看到**公网访问**选项卡下的 kubeconfig 文件。复制 kubeconfig 文件的内容。

![kubeconfig](/images/docs/zh-cn/multicluster-management/import-cloud-hosted-k8s/import-ack/kubeconfig.png)

### 步骤 3：导入 ACK 成员集群

1. 以 `admin` 身份登录主集群的 KubeSphere Web 控制台。点击左上角的**平台管理**，选择**集群管理**。在**集群管理**页面，点击**添加集群**。

2. 按需填写基本信息，然后点击**下一步**。

3. **连接方式**选择**直接连接 Kubernetes 集群**。填写 ACK 的 kubeconfig，然后点击**创建**。

4. 等待集群初始化完成。
