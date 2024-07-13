---
title: "导入 AWS EKS 集群"
keywords: 'Kubernetes, KubeSphere, 多集群, Amazon EKS'
description: '了解如何导入 Amazon Elastic Kubernetes 服务集群。'
titleLink: "导入 AWS EKS 集群"
weight: 5320
version: "v3.4"
---

本教程演示如何使用[直接连接](../../enable-multicluster/direct-connection)方法将 AWS EKS 集群导入 KubeSphere。如果您想使用代理连接方法，请参考[代理连接](../../../multicluster-management/enable-multicluster/agent-connection/)。

## 准备工作

- 您需要准备一个已安装 KubeSphere 的 Kubernetes 集群，并将其设置为主集群。有关如何准备主集群的更多信息，请参考[准备主集群](../../../multicluster-management/enable-multicluster/direct-connection/#准备-host-集群)。
- 您需要准备一个 EKS 集群，用作成员集群。

## 导入 EKS 集群

### 步骤 1：在 EKS 集群上部署 KubeSphere

您需要首先在 EKS 集群上部署 KubeSphere。有关如何在 EKS 上部署 KubeSphere 的更多信息，请参考[在 AWS EKS 上部署 KubeSphere](../../../installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/#在-eks-上安装-kubesphere)。

### 步骤 2：准备 EKS 成员集群

1. 为了通过主集群管理，您需要使它们之间的 `jwtSecret` 相同。首先，需要在主集群上执行以下命令获取 `jwtSecret`。

   ```bash
   kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
   ```

   输出类似如下：

   ```yaml
   jwtSecret: "QVguGh7qnURywHn2od9IiOX6X8f8wK8g"
   ```

2. 以 `admin` 身份登录 EKS 集群的 KubeSphere Web 控制台。点击左上角的**平台管理**，选择**集群管理**。

3. 访问**定制资源定义**，在搜索栏输入 `ClusterConfiguration`，然后按下键盘上的**回车键**。点击 **ClusterConfiguration** 访问其详情页。

4. 点击右侧的 <img src="/images/docs/v3.x/zh-cn/multicluster-management/import-cloud-hosted-k8s/import-eks/three-dots.png" height="20px">，选择**编辑 YAML** 来编辑 `ks-installer`。

5. 在 `ks-installer` 的 YAML 文件中，将 `jwtSecret` 的值改为如上所示的相应值，将 `clusterRole` 的值改为 `member`。点击**更新**保存更改。

   ```yaml
   authentication:
     jwtSecret: QVguGh7qnURywHn2od9IiOX6X8f8wK8g
   ```

   ```yaml
   multicluster:
     clusterRole: member
   ```

   {{< notice note >}}

   请确保使用您自己的 `jwtSecret`。您需要等待一段时间使更改生效。

   {{</ notice >}}

### 步骤 3：创建新的 kubeconfig 文件

1. [Amazon EKS](https://docs.aws.amazon.com/zh_cn/eks/index.html) 不像标准的 kubeadm 集群那样提供内置的 kubeconfig 文件。但您可以参考此[文档](https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/create-kubeconfig.html)创建 kubeconfig 文件。生成的 kubeconfig 文件类似如下：

   ```yaml
   apiVersion: v1
   clusters:
   - cluster:
       server: <endpoint-url>
       certificate-authority-data: <base64-encoded-ca-cert>
     name: kubernetes
   contexts:
   - context:
       cluster: kubernetes
       user: aws
     name: aws
   current-context: aws
   kind: Config
   preferences: {}
   users:
   - name: aws
     user:
       exec:
         apiVersion: client.authentication.k8s.io/v1alpha1
         command: aws
         args:
           - "eks"
           - "get-token"
           - "--cluster-name"
           - "<cluster-name>"
           # - "--role"
           # - "<role-arn>"
         # env:
           # - name: AWS_PROFILE
           #   value: "<aws-profile>"
   ```

   但是，自动生成的 kubeconfig 文件要求使用此 kubeconfig 的每台计算机均安装有 `aws` 命令（aws CLI 工具）。

2. 在本地计算机上运行以下命令，获得由 KubeSphere 创建的 ServiceAccount `kubesphere` 的令牌，该令牌对集群具有集群管理员访问权限，并将用作新的 kubeconfig 令牌。
* Kubernetes 1.23 及以前版本：
   ```bash
   TOKEN=$(kubectl -n kubesphere-system get secret $(kubectl -n kubesphere-system get sa kubesphere -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 -d)
   kubectl config set-credentials kubesphere --token=${TOKEN}
   kubectl config set-context --current --user=kubesphere
   ```
* Kubernetes 1.24 及以后版本，ServiceAccount 不再自动生成 Secert，参见[这里](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#urgent-upgrade-notes)。
   ```bash
   cat <<EOF >kubesphere-secret.yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: kubesphere
     namespace: kubesphere-system
     annotations:
       kubernetes.io/service-account.name: "kubesphere"
   type: kubernetes.io/service-account-token
   EOF
   ```
   ```bash
   kubectl apply -f kubesphere-secret.yaml
   TOKEN=`kubectl -n kubesphere-system get secret kubesphere  -o jsonpath='{.data.token}' | base64 -d`
   kubectl config set-credentials kubesphere --token=${TOKEN}
   kubectl config set-context --current --user=kubesphere
   ```

3. 运行以下命令获取新的 kubeconfig 文件：

   ```bash
   cat ~/.kube/config
   ```

   输出类似如下，可以看到已插入新用户 `kubesphere` 并已将其设置为当前集群环境上下文 (current-context) 用户：

   ```yaml
   apiVersion: v1
   clusters:
   - cluster:
       certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZ...S0tLQo=
       server: https://*.sk1.cn-north-1.eks.amazonaws.com.cn
     name: arn:aws-cn:eks:cn-north-1:660450875567:cluster/EKS-LUSLVMT6
   contexts:
   - context:
       cluster: arn:aws-cn:eks:cn-north-1:660450875567:cluster/EKS-LUSLVMT6
       user: kubesphere
     name: arn:aws-cn:eks:cn-north-1:660450875567:cluster/EKS-LUSLVMT6
   current-context: arn:aws-cn:eks:cn-north-1:660450875567:cluster/EKS-LUSLVMT6
   kind: Config
   preferences: {}
   users:
   - name: arn:aws-cn:eks:cn-north-1:660450875567:cluster/EKS-LUSLVMT6
     user:
       exec:
         apiVersion: client.authentication.k8s.io/v1alpha1
         args:
         - --region
         - cn-north-1
         - eks
         - get-token
         - --cluster-name
         - EKS-LUSLVMT6
         command: aws
         env: null
   - name: kubesphere
     user:
       token: eyJhbGciOiJSUzI1NiIsImtpZCI6ImlCRHF4SlE5a0JFNDlSM2xKWnY1Vkt5NTJrcDNqRS1Ta25IYkg1akhNRmsifQ.eyJpc3M................9KQtFULW544G-FBwURd6ArjgQ3Ay6NHYWZe3gWCHLmag9gF-hnzxequ7oN0LiJrA-al1qGeQv-8eiOFqX3RPCQgbybmix8qw5U6f-Rwvb47-xA
   ```

   您可以运行以下命令检查新的 kubeconfig 是否有权限访问 EKS 集群。

   ```shell
   kubectl get nodes
   ```

   输出类似如下：

   ```
   NAME                                        STATUS   ROLES    AGE   VERSION
   ip-10-0-47-38.cn-north-1.compute.internal   Ready    <none>   11h   v1.18.8-eks-7c9bda
   ip-10-0-8-148.cn-north-1.compute.internal   Ready    <none>   78m   v1.18.8-eks-7c9bda
   ```

### 步骤 4：导入 EKS 成员集群

1. 以 `admin` 身份登录主集群的 KubeSphere Web 控制台。点击左上角的**平台管理**，然后选择**集群管理**。在**集群管理**页面，点击**添加集群**。

2. 按需输入基本信息，然后点击**下一步**。

3. **连接方式**选择**直接连接 Kubernetes 集群**。填写 EKS 的新 kubeconfig，然后点击**创建**。

4. 等待集群初始化完成。
