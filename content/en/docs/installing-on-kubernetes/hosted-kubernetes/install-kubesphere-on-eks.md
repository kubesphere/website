---
title: "Deploy KubeSphere on EKS"
keywords: 'Kubernetes, KubeSphere, EKS, Installation'
description: 'How to install KubeSphere on EKS'

weight: 2265
---

This guide walks you through the steps of deploying KubeSphere on [AWS EKS](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html).
## Install the AWS CLI
Tht aws EKS does not have a web terminal like GKE, so we must install aws cli first. Take a example for macOS and other operating system can according [Getting Started EKS](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html)
```shell
pip3 install awscli --upgrade --user
```
Check it with `aws --version`
![check-aws-cli](/images/docs/eks/check-aws-cli.png)

## Prepare a EKS Cluster

- A standard Kubernetes cluster in AWS is a prerequisite of installing KubeSphere. Go to the navigation menu and refer to the image below to create a cluster.

![create-cluster-eks](/images/docs/eks/eks-launch-icon.png)

- On the Configure cluster page, fill in the following fields:
![config-cluster-page](/images/docs/eks/config-cluster-page.png)

  - Name – A unique name for your cluster.

  - Kubernetes version – The version of Kubernetes to use for your cluster.

  - Cluster service role – Select the IAM role that you created with [Create your Amazon EKS cluster IAM role](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#role-create).

  - Secrets encryption – (Optional) Choose to enable envelope encryption of Kubernetes secrets using the AWS Key Management Service (AWS KMS). If you enable envelope encryption, the Kubernetes secrets are encrypted using the customer master key (CMK) that you select. The CMK must be symmetric, created in the same region as the cluster, and if the CMK was created in a different account, the user must have access to the CMK. For more information, see [Allowing users in other accounts to use a CMK](https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html) in the AWS Key Management Service Developer Guide.

  - Kubernetes secrets encryption with an AWS KMS CMK requires Kubernetes version 1.13 or later. If no keys are listed, you must create one first. For more information, see [Creating keys](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html).

  - Tags – (Optional) Add any tags to your cluster. For more information, see [Tagging your Amazon EKS resources](https://docs.aws.amazon.com/eks/latest/userguide/eks-using-tags.html).

- Select Next.

  - On the Specify networking page, select values for the following fields:
  ![network](/images/docs/eks/networking.png)

  - VPC – The VPC that you created previously in [Create your Amazon EKS cluster VPC](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#vpc-create). You can find the name of your VPC in the drop-down list.

  - Subnets – By default, the available subnets in the VPC specified in the previous field are preselected. Select any subnet that you don't want to host cluster resources, such as worker nodes or load balancers.

  - Security groups – The SecurityGroups value from the AWS CloudFormation output that you generated with [Create your Amazon EKS cluster VPC](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#vpc-create). This security group has ControlPlaneSecurityGroup in the drop-down name.
- For Cluster endpoint access – Choose one of the following options:
![endpoints](/images/docs/eks/endpoints.png)
  - Public – Enables only public access to your cluster's Kubernetes API server endpoint. Kubernetes API requests that originate from outside of your cluster's VPC use the public endpoint. By default, access is allowed from any source IP address. You can optionally restrict access to one or more CIDR ranges such as 192.168.0.0/16, for example, by selecting Advanced settings and then selecting Add source.

  - Private – Enables only private access to your cluster's Kubernetes API server endpoint. Kubernetes API requests that originate from within your cluster's VPC use the private VPC endpoint.

  > Important
    If you created a VPC without outbound internet access, then you must enable private access.

  - Public and private – Enables public and private access.
- Select Next.
![logging](/images/docs/eks/logging.png)
  - On the Configure logging page, you can optionally choose which log types that you want to enable. By default, each log type is Disabled. For more information, see [Amazon EKS control plane logging](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html).

- Select Next.
![revies](/images/docs/eks/review.png)
  - On the Review and create page, review the information that you entered or selected on the previous pages. Select Edit if you need to make changes to any of your selections. Once you're satisfied with your settings, select Create. The Status field shows CREATING until the cluster provisioning process completes.
For more information about the previous options, see Modifying cluster endpoint access.
When your cluster provisioning is complete (usually between 10 and 15 minutes), note the API server endpoint and Certificate authority values. These are used in your kubectl configuration.
![creating](/images/docs/eks/creating.png)
- Create **Node Group**, define 2 nodes in this cluster.
  ![node-group](/images/docs/eks/node-group.png)
- Config node group
  ![config-node-group](/images/docs/eks/config-node-grop.png)

{{< notice note >}} 
    - Supported Kubernetes versions for KubeSphere 3.0.0: 1.15.x, 1.16.x, 1.17.x, 1.18.x.
    - Ubuntu is used for the operating system here as an example. For more information on supported systems, see Overview.
    - 3 nodes are included in this example. You can add more nodes based on your own needs especially in a production environment.
    - The machine type t3.medium (2 vCPU, 4GB memory) is for minimal installation. If you want to enable pluggable components or use the cluster for production, please select a machine type with more resources.
    - For other settings, you can change them as well based on your own needs or use the default value.

{{</ notice >}} 

- When the EKS cluster is ready, you can connect to the cluster with kubectl.
## configure kubectl
We will uses the kubectl command-line utility for communicating with the cluster API server. Firstly, we should get the kubeconfig of the eks cluster which created just now.
- Configure your AWS CLI credentials
```shell
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: region-code
Default output format [None]: json
```
- To create your kubeconfig file with the AWS CLI

```shell
aws eks --region us-west-2 update-kubeconfig --name cluster_name
```
  - By default, the resulting configuration file is created at the default kubeconfig path (.kube/config) in your home directory or merged with an existing kubeconfig at that location. You can specify another path with the --kubeconfig option.

  - You can specify an IAM role ARN with the --role-arn option to use for authentication when you issue kubectl commands. Otherwise, the IAM entity in your default AWS CLI or SDK credential chain is used. You can view your default AWS CLI or SDK identity by running the aws sts get-caller-identity command.

For more information, see the help page with the aws eks update-kubeconfig help command or see update-kubeconfig in the [AWS CLI Command Reference](https://docs.aws.amazon.com/eks/latest/userguide/security_iam_id-based-policy-examples.html).
- Test your configuration.
  ```shell
  kubectl get svc
  ```

## Install KubeSphere on EKS

- Install KubeSphere using kubectl. The following command is only for the default minimal installation.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml
```
![minimal-install](/images/docs/eks/minimal-install.png)

- Create a local cluster-configuration.yaml.
```shell
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml
```
![config-install](/images/docs/eks/config-install.png)

- Inspect the logs of installation:

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

- When the installation finishes, you can see the following message:

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Account: admin
Password: P@88w0rd
NOTES：
  1. After logging into the console, please check the
     monitoring status of service components in
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are ready.
  2. Please modify the default password after login.
#####################################################
https://kubesphere.io             2020-xx-xx xx:xx:xx
```

## Access KubeSphere Console

Now that KubeSphere is installed, you can access the web console of KubeSphere by following the step below.

- Select the service **ks-console**.
```shell
kubectl get svc -nkubesphere-system
```

-  `kubectl edit ks-console` and change the type from `NodePort` to `LoadBalancer`. Save the file when you finish.
![loadbalancer](/images/docs/eks/loadbalancer.png)

- `kubectl get svc -nkubesphere-system` and get your external ip
  ![external-ip](/images/docs/eks/external-ip.png)

- Access the web console of KubeSphere using the external-ip generated by EKS.

- Log in the console with the default account and password (`admin/P@88w0rd`). In the cluster overview page, you can see the dashboard as shown in the following image.

![eks-cluster](/images/docs/eks/esk-kubesphere-ok.png)

## Enable Pluggable Components (Optional)

The example above demonstrates the process of a default minimal installation. To enable other components in KubeSphere, see [Enable Pluggable Components](../../../pluggable-components/) for more details.

