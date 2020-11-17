---
title: "导入 AWS EKS 集群"
keywords: 'Kubernetes, KubeSphere, 多集群, Amazon eks'
description: '导入 AWS EKS 集群'


weight: 2340
---

在本节中，我们将向您展示如何使用[直接连接](../../enable-multicluster/direct-connection)方法将 EKS 导入 KubeSphere。

{{< notice note >}}
如果您打算使用[代理连接](../../enable-multicluster/agent-connection)导入 EKS，则可以跳过本章节并按照[代理连接](../../enable-multicluster/agent-connection)的文档逐步进行。
{{</ notice >}}

[Amazon EKS](https://docs.aws.amazon.com/eks/index.html)不像标准 kubeadm 集群那样提供内置的 kubeconfig 文件。但是您可以通过参考此[文档](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html)自动创建 kubeconfig。生成的 kubeconfig 将如下所示，

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

看起来不错，自动生成的 kubeconfig 只有一个问题，它要求在想要使用此 kubeconfig 的每台计算机上安装命令 `aws`（aws 命令行工具）。

## 不使用 `aws` 命令创建新的 kubeconfig
假设您有一个 EKS 集群，它已经安装了 KubeSphere，并且您已经按照上面的[文档](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html)创建了一个自动生成的 kubeconfig。所以，现在我们可以从您的本地计算机访问 EKS。

```shell
~:# kubectl get node
NAME                                        STATUS   ROLES    AGE   VERSION
ip-10-0-47-38.cn-north-1.compute.internal   Ready    <none>   11h   v1.18.8-eks-7c9bda
ip-10-0-8-148.cn-north-1.compute.internal   Ready    <none>   78m   v1.18.8-eks-7c9bda
```
上面的命令将显示您的 EKS 集群节点。

以下部分将获取由 KubeSphere 创建的 serviceaccount `kubesphere` 的令牌。它具有对集群的集群管理员访问权限，我们将其用作新的 kubeconfig 令牌。

```bash
TOKEN=$(kubectl -n kubesphere-system get secret $(kubectl -n kubesphere-system get sa kubesphere -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 -d)
kubectl config set-credentials kubesphere --token=${TOKEN}
kubectl config set-credentials --current --user=kubesphere
```

检查新的 kubeconfig。
```
~:# cat ~/.kube/config
```

如果一切正常，您将看到如下所示的新的 kubeconfig。注意用户部分，您会发现我们插入了一个新用户 `KubeSphere` 并将其设置为当前上下文用户。

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

再次检查我们的新 kubeconfig 是否可以访问 EKS。
```
~:# kubectl get nodes
NAME                                        STATUS   ROLES    AGE   VERSION
ip-10-0-47-38.cn-north-1.compute.internal   Ready    <none>   11h   v1.18.8-eks-7c9bda
ip-10-0-8-148.cn-north-1.compute.internal   Ready    <none>   78m   v1.18.8-eks-7c9bda
```

创建新的 kubeconfig 后，我们可以使用它直接将 EKS 导入 KubeSphere。不要忘记与主集群[同步](https://github.com/kubesphere/community/blob/master/sig-multicluster/how-to-setup-multicluster-on-kubesphere/README.md#MemberCluster) `jwtSecret`

![eks 导入](/images/docs/eks-kubeconfig.png)

And wola!

![eks 概述](/images/docs/eks-overview.png)
