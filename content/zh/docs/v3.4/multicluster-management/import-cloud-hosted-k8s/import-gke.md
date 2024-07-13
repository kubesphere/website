---
title: "导入 Google GKE 集群"
keywords: 'Kubernetes, KubeSphere, 多集群, Google GKE'
description: '了解如何导入 Google Kubernetes Engine 集群。'
titleLink: "导入 Google GKE 集群"
weight: 5330
version: "v3.4"
---

本教程演示如何使用[直接连接](../../../multicluster-management/enable-multicluster/direct-connection/)方法导入 GKE 集群。如果您想使用代理连接方法，请参考[代理连接](../../../multicluster-management/enable-multicluster/agent-connection/)。

## 准备工作

- 您需要准备一个已安装 KubeSphere 的 Kubernetes 集群，并将该集群设置为主集群。有关如何准备主集群的更多信息，请参考[准备主集群](../../../multicluster-management/enable-multicluster/direct-connection/#准备-host-集群)。
- 您需要准备一个 GKE 集群，用作成员集群。

## 导入 GKE 集群

### 步骤 1：在 GKE 集群上部署 KubeSphere

您需要首先在 GKE 集群上部署 KubeSphere。有关如何在 GKE 上部署 KubeSphere 的更多信息，请参考[在 Google GKE 上部署 KubeSphere](../../../installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/)。

### 步骤 2：准备 GKE 成员集群

1. 为了通过主集群管理，您需要使它们之间的 `jwtSecret` 相同。首先，在主集群上执行以下命令获取 `jwtSecret`。

   ```bash
   kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
   ```

   输出类似如下：

   ```yaml
   jwtSecret: "QVguGh7qnURywHn2od9IiOX6X8f8wK8g"
   ```

2. 以 `admin` 身份登录 GKE 的 KubeSphere Web 控制台。点击左上角的**平台管理**，选择**集群管理**。

3. 访问**定制资源定义**，在搜索栏中输入 `ClusterConfiguration`，然后按下键盘上的**回车键**。点击 **ClusterConfiguration** 访问其详情页。

4. 点击右侧的 <img src="/images/docs/v3.x/zh-cn/multicluster-management/import-cloud-hosted-k8s/import-gke/three-dots.png" height="20px">，选择**编辑 YAML** 来编辑 `ks-installer`。

5. 在 `ks-installer` 的 YAML 文件中，将 `jwtSecret` 的值改为如上所示的相应值，将 `clusterRole` 的值改为 `member`。

   ```yaml
   authentication:
     jwtSecret: QVguGh7qnURywHn2od9IiOX6X8f8wK8g
   ```

   ```yaml
   multicluster:
     clusterRole: member
   ```

   {{< notice note >}}

   请确保使用自己的 `jwtSecret`。您需要等待一段时间使更改生效。

   {{</ notice >}}

### 步骤 3：创建新的 kubeconfig 文件

1. 在 GKE Cloud Shell 终端运行以下命令：

   ```bash
   TOKEN=$(kubectl -n kubesphere-system get secret $(kubectl -n kubesphere-system get sa kubesphere -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 -d)
   kubectl config set-credentials kubesphere --token=${TOKEN}
   kubectl config set-context --current --user=kubesphere
   ```

2. 运行以下命令获取新的 kubeconfig 文件：

   ```bash
   cat ~/.kube/config
   ```

   输出类似如下：

   ```yaml
   apiVersion: v1
   clusters:
   - cluster:
       certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURLekNDQWhPZ0F3SUJBZ0lSQUtPRUlDeFhyWEdSbjVQS0dlRXNkYzR3RFFZSktvWklodmNOQVFFTEJRQXcKTHpFdE1Dc0dBMVVFQXhNa1pqVTBNVFpoTlRVdFpEZzFZaTAwWkdZNUxXSTVNR1V0TkdNeE0yRTBPR1ZpWW1VMwpNQjRYRFRJeE1ETXhNVEl5TXpBMU0xb1hEVEkyTURNeE1ESXpNekExTTFvd0x6RXRNQ3NHQTFVRUF4TWtaalUwCk1UWmhOVFV0WkRnMVlpMDBaR1k1TFdJNU1HVXROR014TTJFME9HVmlZbVUzTUlJQklqQU5CZ2txaGtpRzl3MEIKQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdkVHVGtKRjZLVEl3QktlbXNYd3dPSnhtU3RrMDlKdXh4Z1grM0dTMwpoeThVQm5RWEo1d3VIZmFGNHNWcDFzdGZEV2JOZitESHNxaC9MV3RxQk5iSlNCU1ppTC96V3V5OUZNeFZMS2czCjVLdnNnM2drdUpVaFVuK0tMUUFPdTNUWHFaZ2tTejE1SzFOSU9qYm1HZGVWSm5KQTd6NTF2ZkJTTStzQWhGWTgKejJPUHo4aCtqTlJseDAvV0UzTHZEUUMvSkV4WnRCRGFuVFU0anpHMHR2NGk1OVVQN2lWbnlwRHk0dkFkWm5mbgowZncwVnplUXJqT2JuQjdYQTZuUFhseXZubzErclRqakFIMUdtU053c1IwcDRzcEViZ0lXQTNhMmJzeUN5dEJsCjVOdmJKZkVpSTFoTmFOZ3hoSDJNenlOUWVhYXZVa29MdDdPN0xqYzVFWlo4cFFJREFRQUJvMEl3UURBT0JnTlYKSFE4QkFmOEVCQU1DQWdRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVUVyVkJrc3MydGV0Qgp6ZWhoRi92bGdVMlJiM2N3RFFZSktvWklodmNOQVFFTEJRQURnZ0VCQUdEZVBVa3I1bDB2OTlyMHZsKy9WZjYrCitBanVNNFoyOURtVXFHVC80OHBaR1RoaDlsZDQxUGZKNjl4eXFvME1wUlIyYmJuTTRCL2NVT1VlTE5VMlV4VWUKSGRlYk1oQUp4Qy9Uaks2SHpmeExkTVdzbzVSeVAydWZEOFZob2ZaQnlBVWczajdrTFgyRGNPd1lzNXNrenZ0LwpuVUlhQURLaXhtcFlSSWJ6MUxjQmVHbWROZ21iZ0hTa3MrYUxUTE5NdDhDQTBnSExhMER6ODhYR1psSi80VmJzCjNaWVVXMVExY01IUHd5NnAwV2kwQkpQeXNaV3hZdFJyV3JFWUhZNVZIanZhUG90S3J4Y2NQMUlrNGJzVU1ZZ0wKaTdSaHlYdmJHc0pKK1lNc3hmalU5bm5XYVhLdXM5ZHl0WG1kRGw1R0hNU3VOeTdKYjIwcU5RQkxhWHFkVmY0PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
       server: https://130.211.231.87
     name: gke_grand-icon-307205_us-central1-c_cluster-3
   contexts:
   - context:
       cluster: gke_grand-icon-307205_us-central1-c_cluster-3
       user: gke_grand-icon-307205_us-central1-c_cluster-3
     name: gke_grand-icon-307205_us-central1-c_cluster-3
   current-context: gke_grand-icon-307205_us-central1-c_cluster-3
   kind: Config
   preferences: {}
   users:
   - name: gke_grand-icon-307205_us-central1-c_cluster-3
     user:
       auth-provider:
         config:
           cmd-args: config config-helper --format=json
           cmd-path: /usr/lib/google-cloud-sdk/bin/gcloud
           expiry-key: '{.credential.token_expiry}'
           token-key: '{.credential.access_token}'
         name: gcp
   - name: kubesphere
     user:
       token: eyJhbGciOiJSUzI1NiIsImtpZCI6InNjOFpIb3RrY3U3bGNRSV9NWV8tSlJzUHJ4Y2xnMDZpY3hhc1BoVy0xTGsifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlc3BoZXJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlc3BoZXJlLXRva2VuLXpocmJ3Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6Imt1YmVzcGhlcmUiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiIyMGFmZGI1Ny01MTBkLTRjZDgtYTAwYS1hNDQzYTViNGM0M2MiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXNwaGVyZS1zeXN0ZW06a3ViZXNwaGVyZSJ9.ic6LaS5rEQ4tXt_lwp7U_C8rioweP-ZdDjlIZq91GOw9d6s5htqSMQfTeVlwTl2Bv04w3M3_pCkvRzMD0lHg3mkhhhP_4VU0LIo4XeYWKvWRoPR2kymLyskAB2Khg29qIPh5ipsOmGL9VOzD52O2eLtt_c6tn-vUDmI_Zw985zH3DHwUYhppGM8uNovHawr8nwZoem27XtxqyBkqXGDD38WANizyvnPBI845YqfYPY5PINPYc9bQBFfgCovqMZajwwhcvPqS6IpG1Qv8TX2lpuJIK0LLjiKaHoATGvHLHdAZxe_zgAC2cT_9Ars3HIN4vzaSX0f-xP--AcRgKVSY9g
   ```

### 步骤 4：导入 GKE 成员集群

1. 以 `admin` 身份登录主集群的 KubeSphere Web 控制台。点击左上角的**平台管理**，选择**集群管理**。在**集群管理**页面，点击**添加集群**。

2. 按需输入基本信息，然后点击**下一步**。

3. **连接方式**选择**直接连接 Kubernetes 集群**。填写 GKE 的新 kubeconfig，然后点击**创建**。

4. 等待集群初始化完成。
