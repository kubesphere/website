---
title: "Deploy KubeSphere on AWS EKS"
keywords: 'Kubernetes, KubeSphere, EKS, Installation'
description: 'Learn how to deploy KubeSphere on Amazon Elastic Kubernetes Service.'

weight: 4220
---

This guide walks you through the steps of deploying KubeSphere on [AWS EKS](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html). You also can visit [KubeSphere on AWS Quick Start](https://aws.amazon.com/quickstart/architecture/qingcloud-kubesphere/) which uses Amazon Web Services (AWS) CloudFormation templates to help end users automatically provision an Amazon Elastic Kubernetes Service (Amazon EKS) and KubeSphere environment on the AWS Cloud.

## Install the AWS CLI

First we need to install the AWS CLI. Below is an example for macOS and please refer to [Getting Started EKS](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html) for other operating systems.

```shell
pip3 install awscli --upgrade --user
```

Check the installation with `aws --version`.
![check-aws-cli](/images/docs/v3.3/eks/check-aws-cli.png)

## Prepare an EKS Cluster

1. A standard Kubernetes cluster in AWS is a prerequisite of installing KubeSphere. Go to the navigation menu and refer to the image below to create a cluster.
   ![create-cluster-eks](/images/docs/v3.3/eks/eks-launch-icon.png)

2. On the **Configure cluster** page, fill in the following fields:
   ![config-cluster-page](/images/docs/v3.3/eks/config-cluster-page.png)

   - Name: A unique name for your cluster.

   - Kubernetes version: The version of Kubernetes to use for your cluster.

   - Cluster service role: Select the IAM role that you created with [Create your Amazon EKS cluster IAM role](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#role-create).

   - Secrets encryption (Optional): Choose to enable envelope encryption of Kubernetes secrets using the AWS Key Management Service (AWS KMS). If you enable envelope encryption, the Kubernetes secrets are encrypted using the customer master key (CMK) that you select. The CMK must be symmetric, created in the same region as the cluster. If the CMK was created in a different account, the user must have access to the CMK. For more information, see [Allowing users in other accounts to use a CMK](https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html) in the *AWS Key Management Service Developer Guide*.

   - Kubernetes secrets encryption with an AWS KMS CMK requires Kubernetes version 1.13 or later. If no keys are listed, you must create one first. For more information, see [Creating keys](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html).

   - Tags (Optional): Add any tags to your cluster. For more information, see [Tagging your Amazon EKS resources](https://docs.aws.amazon.com/eks/latest/userguide/eks-using-tags.html).

3. Select **Next**. On the **Specify networking** page, select values for the following fields:
   ![network](/images/docs/v3.3/eks/networking.png)

   - VPC: The VPC that you created previously in [Create your Amazon EKS cluster VPC](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#vpc-create). You can find the name of your VPC in the drop-down list.

   - Subnets: By default, the available subnets in the VPC specified in the previous field are preselected. Select any subnet that you don't want to host cluster resources, such as worker nodes or load balancers.

   - Security groups: The SecurityGroups value from the AWS CloudFormation output that you generated with [Create your Amazon EKS cluster VPC](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#vpc-create). This security group has ControlPlaneSecurityGroup in the drop-down name.

   - For **Cluster endpoint access**, choose one of the following options:
      ![endpoints](/images/docs/v3.3/eks/endpoints.png)

      - Public: Enables only public access to your cluster's Kubernetes API server endpoint. Kubernetes API requests that originate from outside of your cluster's VPC use the public endpoint. By default, access is allowed from any source IP address. You can optionally restrict access to one or more CIDR ranges such as 192.168.0.0/16, for example, by selecting **Advanced settings** and then selecting **Add source**.

      - Private: Enables only private access to your cluster's Kubernetes API server endpoint. Kubernetes API requests that originate from within your cluster's VPC use the private VPC endpoint.

         {{< notice note >}}
   If you created a VPC without outbound internet access, then you must enable private access.
         {{</ notice >}}

      - Public and private: Enables public and private access.

4. Select **Next**. On the **Configure logging** page, you can optionally choose which log types that you want to enable. By default, each log type is **Disabled**. For more information, see [Amazon EKS control plane logging](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html).
   ![logging](/images/docs/v3.3/eks/logging.png)

5. Select **Next**. On the **Review and create page**, review the information that you entered or selected on the previous pages. Select **Edit** if you need to make changes to any of your selections. Once you're satisfied with your settings, select **Create**. The **Status** field shows **CREATING** until the cluster provisioning process completes.
   ![revies](/images/docs/v3.3/eks/review.png)

   - For more information about the previous options, see [Modifying cluster endpoint access](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html#modify-endpoint-access).
   When your cluster provisioning is complete (usually between 10 and 15 minutes), save the API server endpoint and Certificate authority values. These are used in your kubectl configuration.
   ![creating](/images/docs/v3.3/eks/creating.png)

6. Create **Node Group** and define 3 nodes in this cluster.
   ![node-group](/images/docs/v3.3/eks/node-group.png)

7. Configure the node group.
   ![config-node-group](/images/docs/v3.3/eks/config-node-grop.png)

   {{< notice note >}}

- To install KubeSphere 3.3 on Kubernetes, your Kubernetes version must be v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support).
- 3 nodes are included in this example. You can add more nodes based on your own needs especially in a production environment.
- The machine type t3.medium (2 vCPU, 4GB memory) is for minimal installation. If you want to enable pluggable components or use the cluster for production, please select a machine type with more resources.
- For other settings, you can change them as well based on your own needs or use the default value.

   {{</ notice >}}

8. When the EKS cluster is ready, you can connect to the cluster with kubectl.

## Configure kubectl

We will use the kubectl command-line utility for communicating with the cluster API server. First, get the kubeconfig of the EKS cluster created just now.

1. Configure your AWS CLI credentials.

   ```shell
   $ aws configure
   AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
   AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   Default region name [None]: region-code
   Default output format [None]: json
   ```

2. Create your kubeconfig file with the AWS CLI.

   ```shell
   aws eks --region us-west-2 update-kubeconfig --name cluster_name
   ```

   - By default, the resulting configuration file is created at the default kubeconfig path (`.kube/config`) in your home directory or merged with an existing kubeconfig at that location. You can specify another path with the `--kubeconfig` option.

   - You can specify an IAM role ARN with the `--role-arn` option to use for authentication when you issue kubectl commands. Otherwise, the IAM entity in your default AWS CLI or SDK credential chain is used. You can view your default AWS CLI or SDK identity by running the `aws sts get-caller-identity` command.

   For more information, see the help page with the `aws eks update-kubeconfig help` command or see [update-kubeconfig](https://docs.aws.amazon.com/cli/latest/reference/eks/update-kubeconfig.html) in the *AWS CLI Command Reference*.

3. Test your configuration.

   ```bash
   kubectl get svc
   ```

## Install KubeSphere on EKS

- Install KubeSphere using kubectl. The following commands are only for the default minimal installation.

   ```bash
   kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml

   kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml
   ```

- Inspect the logs of installation:

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
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

- Check the service of KubeSphere console through the following command.

   ```shell
   kubectl get svc -n kubesphere-system
   ```

- Edit the configuration of the service **ks-console** by executing `kubectl edit ks-console` and change `type` from `NodePort` to `LoadBalancer`. Save the file when you finish.
![loadbalancer](/images/docs/v3.3/eks/loadbalancer.png)

- Run `kubectl get svc -n kubesphere-system` and get your external IP.
  ![external-ip](/images/docs/v3.3/eks/external-ip.png)

- Access the web console of KubeSphere using the external IP generated by EKS.

- Log in to the console with the default account and password (`admin/P@88w0rd`). In the cluster overview page, you can see the dashboard.

## Enable Pluggable Components (Optional)

The example above demonstrates the process of a default minimal installation. To enable other components in KubeSphere, see [Enable Pluggable Components](../../../pluggable-components/) for more details.

## Reference

[Getting started with the AWS Management Console](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html)
