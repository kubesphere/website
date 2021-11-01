---
title: "在 AWS 上创建 DevOps Kubeconfig"
keywords: "KubeSphere, Kubernetes, DevOps, Kubeconfig, AWS"
description: "如何在 AWS 上创建 DevOps Kubeconfig"
linkTitle: "在 AWS 上创建 DevOps Kubeconfig"
Weight: 16820
---

在已安装 KubeSphere 的 AWS 集群上运行流水线时，如果无法将应用部署到项目中，可能是因 DevOps kubeconfig 出问题所导致。本教程介绍如何在 AWS 上创建 DevOps kubeconfig。

## 准备工作

- 您需要准备一个已安装 KubeSphere 的 AWS 集群。有关如何在 AWS 上安装 KubeSphere 的更多信息，请参考[在 AWS EKS 上部署 KubeSphere](../../../installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/)。
- 您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要准备一个可以部署应用的项目。本教程以 `kubesphere-sample-dev` 项目为例。

## 创建 DevOps Kubeconfig

### 步骤 1：创建 ServiceAccount

1. 在您的 AWS 集群上创建 `devops-deploy.yaml` 文件并输入以下内容。

   ```yaml
   ---
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: devops-deploy
     namespace: kubesphere-sample-dev
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     name: devops-deploy-role
     namespace: kubesphere-sample-dev
   rules:
   - apiGroups:
     - "*"
     resources:
     - "*"
     verbs:
     - "*"
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: devops-deploy-rolebinding
     namespace: kubesphere-sample-dev
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: Role
     name: devops-deploy-role
   subjects:
   - kind: ServiceAccount
     name: devops-deploy
     namespace: kubesphere-sample-dev
   ```

2. 运行以下命令应用该 YAML 文件。

   ```bash
   kubectl apply -f devops-deploy.yaml
   ```

### 步骤 2：获取服务帐户令牌

1. 运行以下命令获取服务帐户的令牌。

   ```bash
   export TOKEN_NAME=$(kubectl -n kubesphere-sample-dev get sa devops-deploy -o jsonpath='{.secrets[0].name}')
   kubectl -n kubesphere-sample-dev get secret "${TOKEN_NAME}" -o jsonpath='{.data.token}' | base64 -d
   ```

2. 输出类似如下：

   ![get-token](/images/docs/zh-cn/faq/devops/create-devops-kubeconfig-on-aws/get-token.jpg)

### 步骤 3：创建 DevOps kubeconfig

1. 登录 AWS 集群的 KubeSphere 控制台，访问您的 DevOps 工程。转到 **DevOps 工程设置**下的**凭证**，然后点击**创建**。您可以按需输入该 kubeconfig 的**凭证 ID**。

2. 在 **Content** 文本框中，请注意以下内容：

   ```
   user:
       client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FUR...
       client-key-data: LS0tLS1CRUdJTiBQUk...
   ```

   您需要将其替换为在步骤 2 中获取的令牌，然后点击**确定**创建 kubeconfig。

   ```bash
   user:
     token:eyJhbGciOiJSUzI1NiIsImtpZCI6Ikl3UkhCay13dHpPY2Z6LW9VTlZKQVR6dVdmb2FHallJQ2E4VzJULUNjUzAifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlc3BoZXJlLXNhbXBsZS1kZXYiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlY3JldC5uYW1lIjoiZGV2b3BzLWRlcGxveS10b2tlbi1kcGY2ZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJkZXZvcHMtZGVwbG95Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMjM0ZTI4OTUtMjM3YS00M2Y5LTkwMTgtZDg4YjY2YTQyNzVmIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmVzcGhlcmUtc2FtcGxlLWRldjpkZXZvcHMtZGVwbG95In0.Ls6mkpgAU75zVw87FkcWx-MLEXGcJjlnb4rUVtT61Jmc_G6jkn4X45MK1V_HuLje3JZMFjL80QUl5ljHLiCUPQ7oE5AUZaUCdqZVdDYEhqeFuGQb_7Qlh8-UFVGGg8vrb0HeGiOlS0qq5hzwKc9C1OmsXHS92yhNwz9gIOujZRafnGKIsG6TL2hEVY2xI0vvmseDKmKg5o0TbeaTMVePHvECju9Qz3Z7TUYsr7HAOvCPtGutlPWLqGx5uOHenOdeLn71x5RoS98xguZoxYVollciPKCQwBlZ4zWK2hzsLSNNLb9cZpxtgUVyHE0AB0e86IHRngnnNrzpp1_pDxL5jw/
   ```

   {{< notice note >}}

   请确保使用您自己的令牌。

   {{</ notice >}}





