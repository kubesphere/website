---
title: "Announcing KubeSphere 3.1.0 on AWS Quick Start!"
keywords: "AWS, Kubernetes, EKS, Amazon EKS, DevOps"
description: "KubeSphere Quick Start uses AWS CloudFormation templates to help users automatically provision an Amazon EKS cluster on the AWS Cloud. End users can manage Amazon EKS clusters through the KubeSphere console."
createTime: "2021-07-07"
author: "Feynman Zhou"
image: /images/news/aws-quick-start/quick-start-cover.png
tag: "Product News"
---

![kubecon-eu-banner](/images/news/aws-quick-start/kubesphere-aws.png)

## What is AWS Quick Start

[AWS Quick Starts](https://aws.amazon.com/quickstart/) are automated reference deployments that use AWS CloudFormation templates to deploy key technologies on Amazon Web Services (AWS) and follow AWS best practices. 

## Out of the box integration with Amazon EKS

In January 2021, KubeSphere Team and AWS have collaborated to make it easy to create the KubeSphere and Amazon EKS on AWS, and announced [their partnership to offer KubeSphere](https://kubesphere.io/news/kubesphere-available-on-aws-quickstart/), a distributed operating system born for managing cloud-native apps across clouds and data center, as an [AWS Quick Start](https://aws.amazon.com/quickstart/architecture/qingcloud-kubesphere/). KubeSphere Quick Start uses AWS CloudFormation templates to help customers automatically provision an Amazon EKS cluster on the AWS Cloud. Customers can easily manage Amazon EKS clusters through the KubeSphere console.

![qingcloud-kubesphere-architecture-on-aws](/images/news/aws-quick-start/qingcloud-kubesphere-architecture.png)

QingCloud is an [AWS Partner Network](https://aws.amazon.com/partners/) (APN) Technology Partner, and we are committed to provide constant updates with new feature releases and streamlined KubeSphere cluster creation for AWS customers. In July 2021, we introduced KubeSphere 3.1.0 on AWS Quick Start to extend Kubernetes from the cloud to the edge, enabling our customers to run applications where and when they want with ease and security.

## Notable updates in KubeSphere 3.1.0

KubeSphere 3.1.0 was announced to GA on April 29, 2021, it looks to provide an enabling environment for users as they deploy production workloads not just across clouds but also at the edge. 

### Simplifying the computing at the edge

KubeSphere works perfectly with KubeEdge as it boasts a wizard user interface that allows you to enable KubeEdge and add edge nodes without getting stuck in complex configurations. Furthermore, you can deploy workloads on your edge devices and view logging and monitoring data of them on the console directly.

![edge-node-added](/images/blogs/en/kubesphere-3.1.0-ga-announcement/edge-node-added.png)

### Support Metering and Billing to reduce the cost

Besides, the new [Metering and Billing](https://kubesphere.io/docs/toolbox/metering-and-billing/view-resource-consumption/) function helps you to track Kubernetes cluster and application resource consumption on a unified dashboard, which helps you make better-informed decisions on planning and reduce the cost.

You use KubeSphere Metering and Billing to:

- Specify a date range to view data within a specific billing cycle.
- Customize the prices of multiple resources, including CPU, memory, storage and network traffic.
- Identify opportunities for workload changes that can optimize your spending.
- Export metering and billing data for further analysis.

![metering-and-billing](/images/blogs/en/kubesphere-3.1.0-ga-announcement/metering-and-billing.png)

### Enhancing the ease of use for Kubernetes DevOps 

[KubeSphere DevOps](https://kubesphere.io/devops/) integrates popular CI/CD tools, provides CI/CD pipelines based on Jenkins, offers automation toolkits including Binary-to-Image (B2I) and Source-to-Image (S2I), and boosts continuous delivery across multiple Kubernetes clusters. It is one of the most used functions among KubeSphere users as it accelerates the time to market for products.

In the new version, you can:

- Clone a pipeline.
- Run pipelines in a batch.
- [Create a multi-branch pipeline with GitLab](https://kubesphere.io/docs/devops-user-guide/how-to-use/gitlab-multibranch-pipeline/).
- [Use built-in CI/CD templates](https://kubesphere.io/docs/devops-user-guide/how-to-use/use-pipeline-templates/).

The built-in CI/CD templates can be used in most cases directly while you can edit them as needed. As part of our effort to offer out-of-the-box features, these templates will help you build and deliver products more rapidly and reliably.

![pipeline-templates](/images/blogs/en/kubesphere-3.1.0-ga-announcement/pipeline-templates.png)

### More enhancements for existing features

Existing features of Kubernetes multi-cluster management, networking, multi-tenant management, observability, DevOps, application lifecycle management, and microservices governance have also been enhanced as we work to ensure better user experiences across clusters and clouds.

You can check out the [GA announcement for 3.1.0](https://kubesphere.io/news/kubesphere-3.1.0-ga-announcement/) for more demos and details.

## Conclusion

With the KubeSphere on AWS Quick Start, customers can deploy KubeSphere and Amazon EKS on AWS with ease by providing a few parameters to an AWS CloudFormation template, or deploy KubeSphere on an existing Amazon EKS cluster with a few clicks.

The [KubeSphere on AWS Quick Start](https://github.com/aws-quickstart/quickstart-qingcloud-kubesphere/) is an open source project. All components and features of KubeSphere Container Platform are [open source](https://github.com/kubesphere) as well. Any kind of contribution and feedback are welcome!

## Looking forward

KubeSphere team is very excited to be working with AWS to provide deeper and wider integration with the Amazon EKS family. We are working together on the development and verification of the KubeSphere on EKS Distro and EKS Anywhere. In order to boost the ecosystem of both, we also set up the [long-term roadmap](https://github.com/kubesphere/community/blob/master/sig-cloud-providers/aws/roadmap.md) to add support for AWS network, storage, image registry, security, and machine learning and provide consistent user experience for AWS customers.


