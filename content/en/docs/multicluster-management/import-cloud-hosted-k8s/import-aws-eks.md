---
title: "Import AWS EKS Cluster"
keywords: 'Kubernetes, KubeSphere, multicluster, Amazon eks'
description: 'Import AWS EKS Cluster'


weight: 5320
---

In this section, we are going to show you how to import EKS to KubeSphere using [direct connection](../../enable-multicluster/direct-connection) method. 

{{< notice note >}}
If you are planning to import EKS using [agent connection](../../enable-multicluster/agent-connection), then you can skip this section and follow the [doc](../../enable-multicluster/agent-connection) step by step. 
{{</ notice >}}

[Amazon EKS](https://docs.aws.amazon.com/eks/index.html) doesn't provide a built-in kubeconfig file as a standard kubeadm cluster did. But you can create kubeconfig automatically by referring to this [doc](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html). The generated kubeconfig will be like the following,

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

Looks good, only there is one problem with automatically generated kubeconfig, it requires command `aws` (aws cli tools) to be installed on every computer that wants to use this kubeconfig. 

## Create a new kubeconfig without `aws` command
Let's say you have an EKS cluster which already has KubeSphere installed. And you've created a automatically generated kubeconfig following the above [documentation](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html). So now we can access EKS from your local computer.

```shell
~:# kubectl get node
```

The output is similar to this:
```
NAME                                        STATUS   ROLES    AGE   VERSION
ip-10-0-47-38.cn-north-1.compute.internal   Ready    <none>   11h   v1.18.8-eks-7c9bda
ip-10-0-8-148.cn-north-1.compute.internal   Ready    <none>   78m   v1.18.8-eks-7c9bda
```
The above command will show you your EKS cluster nodes. 

The following section will get token of serviceaccount `kubesphere` created by KubeSphere. It has cluster admin access to the cluster, we are going to use it as our new kubeconfig token.

```bash
TOKEN=$(kubectl -n kubesphere-system get secret $(kubectl -n kubesphere-system get sa kubesphere -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 -d)
kubectl config set-credentials kubesphere --token=${TOKEN}
kubectl config set-context --current --user=kubesphere
```

Check the new kubeconfig.
```
~:# cat ~/.kube/config
```

If everything works perfectly, you'll see the new kubeconfig looks like the following. Pay attention to the user section, you can find we insert a new user `KubeSphere` and set it our current-context user.

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

Double check our new kubeconfig do has the access to EKS.
```shell
~:# kubectl get nodes
```

The output is similar to this:
```
NAME                                        STATUS   ROLES    AGE   VERSION
ip-10-0-47-38.cn-north-1.compute.internal   Ready    <none>   11h   v1.18.8-eks-7c9bda
ip-10-0-8-148.cn-north-1.compute.internal   Ready    <none>   78m   v1.18.8-eks-7c9bda
```

After new kubeconfig is created, we can use it to directly import EKS to KubeSphere. Don't forget to [sync](https://github.com/kubesphere/community/blob/master/sig-multicluster/how-to-setup-multicluster-on-kubesphere/README.md#MemberCluster) `jwtSecret` with host cluster

![eks import](/images/docs/eks-kubeconfig.png)

And wola!

![eks overview](/images/docs/eks-overview.png)
