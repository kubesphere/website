---
title: "Import an AWS EKS Cluster"
keywords: 'Kubernetes, KubeSphere, multicluster, Amazon EKS'
description: 'Learn how to import an Amazon Elastic Kubernetes Service cluster.'
titleLink: "Import an AWS EKS Cluster"
weight: 5320
---

This tutorial demonstrates how to import an AWS EKS cluster through the [direct connection](../../../multicluster-management/enable-multicluster/direct-connection/) method. If you want to use the agent connection method, refer to [Agent Connection](../../../multicluster-management/enable-multicluster/agent-connection/).

## Prerequisites

- You have a Kubernetes cluster with KubeSphere installed, and prepared this cluster as the Host Cluster. For more information about how to prepare a Host Cluster, refer to [Prepare a Host Cluster](../../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-host-cluster).
- You have an EKS cluster to be used as the Member Cluster.

## Import an EKS Cluster

### Step 1: Deploy KubeSphere on your EKS cluster

You need to deploy KubeSphere on your EKS cluster first. For more information about how to deploy KubeSphere on EKS, refer to [Deploy KubeSphere on AWS EKS](../../../installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/#install-kubesphere-on-eks).

### Step 2: Prepare the EKS member cluster

1. In order to manage the Member Cluster from the Host Cluster, you need to make `jwtSecret` the same between them. Therefore, get it first by executing the following command on your Host Cluster.

   ```bash
   kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
   ```

   The output is similar to the following:

   ```yaml
   jwtSecret: "QVguGh7qnURywHn2od9IiOX6X8f8wK8g"
   ```

2. Log in to the KubeSphere console of the EKS cluster as `admin`. Click **Platform** in the upper-left corner and then select **Cluster Management**.

3. Go to **CRDs**, enter `ClusterConfiguration` in the search bar, and then press **Enter** on your keyboard. Click **ClusterConfiguration** to go to its detail page.

4. Click <img src="/images/docs/multicluster-management/import-cloud-hosted-k8s/import-eks/three-dots.png" height="20px"> on the right and then select **Edit YAML** to edit `ks-installer`. 

5. In the YAML file of `ks-installer`, change the value of `jwtSecret` to the corresponding value shown above and set the value of `clusterRole` to `member`. Click **Update** to save your changes.

   ```yaml
   authentication:
     jwtSecret: QVguGh7qnURywHn2od9IiOX6X8f8wK8g
   ```

   ```yaml
   multicluster:
     clusterRole: member
   ```

   {{< notice note >}}

   Make sure you use the value of your own `jwtSecret`. You need to wait for a while so that the changes can take effect.

   {{</ notice >}}

### Step 3: Create a new kubeconfig file

1. [Amazon EKS](https://docs.aws.amazon.com/eks/index.html) doesn’t provide a built-in kubeconfig file as a standard kubeadm cluster does. Nevertheless, you can create a kubeconfig file by referring to this [document](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html). The generated kubeconfig file will be like the following:

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

   However, this automatically generated kubeconfig file requires the command `aws` (aws CLI tools) to be installed on every computer that wants to use this kubeconfig.

2. Run the following commands on your local computer to get the token of the ServiceAccount `kubesphere` created by KubeSphere. It has the cluster admin access to the cluster and will be used as the new kubeconfig token.

   ```bash
   TOKEN=$(kubectl -n kubesphere-system get secret $(kubectl -n kubesphere-system get sa kubesphere -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 -d)
   kubectl config set-credentials kubesphere --token=${TOKEN}
   kubectl config set-context --current --user=kubesphere
   ```

3. Retrieve the new kubeconfig file by running the following command:

   ```bash
   cat ~/.kube/config
   ```

   The output is similar to the following and you can see that a new user `kubesphere` is inserted and set as the current-context user:

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

   You can run the following command to check that the new kubeconfig does have access to the EKS cluster.

   ```shell
   kubectl get nodes
   ```

   The output is simialr to this:

   ```
   NAME                                        STATUS   ROLES    AGE   VERSION
   ip-10-0-47-38.cn-north-1.compute.internal   Ready    <none>   11h   v1.18.8-eks-7c9bda
   ip-10-0-8-148.cn-north-1.compute.internal   Ready    <none>   78m   v1.18.8-eks-7c9bda
   ```

### Step 4: Import the EKS member cluster

1. Log in to the KubeSphere console on your Host Cluster as `admin`. Click **Platform** in the upper-left corner and then select **Cluster Management**. On the **Cluster Management** page, click **Add Cluster**.

2. Enter the basic information based on your needs and click **Next**.

3. In **Connection Method**, select **Direct Connection**. Fill in the new kubeconfig file of the EKS Member Cluster and then click **Create**.

4. Wait for cluster initialization to finish.