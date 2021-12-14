---
title: 'OpenELB Joins the CNCF Sandbox, Making Service Exposure in Private Environments Easier'  
tag: 'CNCF'  
keyword: 'OpenELB, Kubernetes, LoadBalancer, Bare metal server'  
description: 'CNCF accepted OpenELB, a load balancer plugin open sourced by KubeSphere, into the CNCF Sandbox'  
createTime: '2021-11-24'  
author: 'KubeSphere'  
snapshot: 'https://kubesphere-community.pek3b.qingstor.com/images/4761636694917_.pic_hd.jpg'
---

![Cover](https://kubesphere-community.pek3b.qingstor.com/images/4761636694917_.pic_hd.jpg)

On November 10, the Cloud Native Computing Foundation (CNCF) accepted OpenELB, a load balancer plugin open sourced by KubeSphere, into the CNCF Sandbox.

![Diagram](https://kubesphere-community.pek3b.qingstor.com/images/8471636692467_.pic_hd.jpg)

OpenELB, formerly known as "PorterLB", is a load balancer plugin designed for bare metal servers, edge devices, and private environments. It serves as an LB plugin for Kubernetes, K3s, and KubeSphere to expose LoadBalancer services to outside the cluster. OpenELB provides the following core functions:
- Load balancing in BGP mode and Layer 2 mode
- ECMP-based load balancing
- IP address pool management
- BGP configurations using CRDs

![Architecture](https://kubesphere-community.pek3b.qingstor.com/images/8441636691354_.pic_hd.jpg)

## Why Did We Initiate OpenELB
In the KubeSphere community, we surveyed over 5,000 users to find out environments that they use to deploy Kubernetes, and the result shows that nearly 36% of the users deploy Kubernetes on bare metal servers, and many users install and use Kubernetes or K3s on air-gapped data centers or edge devices. In private environments, exposing LoadBalancer services is difficult.
![User surveys](https://kubesphere-community.pek3b.qingstor.com/images/8401636689164_.pic.jpg)

In Kubernetes clusters, LoadBalancer services can be used to expose backend workloads to outside the cluster. Cloud vendors usually provide cloud-based LB plugins, which requires users to deploy their clusters on specific IaaS platforms. However, most enterprise users deploy Kubernetes clusters on bare metal servers, especially when these clusters are used in production. For private environments with bare metal servers and edge clusters, Kubernetes does not provide a LoadBalancer solution.

OpenELB is designed to expose LoadBalancer services in non-public-cloud Kubernetes clusters. It provides easy-to-use EIPs and makes IP address pool management easier for users in private environments.
## OpenELB Adopters and Contributors
Currently, OpenELB has been used in production environments by many enterprises, such as BENLAI, Suzhou TV, CVTE, Wisdom World, Jollychic, QingCloud, BAIWANG, Rocketbyte, and more. At the end of 2019, BENLAI has used an earlier version of OpenELB in production. Now, OpenELB has attracted 13 contributors and more than 100 community members.
![Enterprises using OpenELB](https://kubesphere-community.pek3b.qingstor.com/images/8411636689286_.pic_hd.jpg)

## Differences Between OpenELB and MetalLB
MetalLB is also a CNCF Sandbox project. It was launched at the end of 2017, and has been widely accepted by the community up to now. As a relatively young project, OpenELB is more Kubernetes-native. Thanks to contributions from the community, OpenELB has released eight versions and supported multiple routing methods. The following describes differences between OpenELB and MetalLB.
### Cloud-native architecture
In OpenELB, you can use CRDs to manage IP addresses and BGP settings. OpenELB is user-friendly for those who are familiar with kubectl. You can also directly use Kubernetes APIs to further customize OpenELB. In MetalLB, you can only manage IP addresses and BGP settings by using configmaps and obtain their status from logs.
### Flexible IP address management

OpenELB manages IP addresses by using the Eip CRD. It defines the status sub-resource to store the assignment status of IP addresses, which prevents conflicts among replicas and simplifies the programming logic.

### Advertise routes using GoBGP

MetalLB implements BGP by itself, while OpenELB implements BGP by using GoBGP, which has the following advantages:

- Low development cost and robust support from the GoBGP community
- Rich features of GoBGP
- Dynamic configuration of GoBGP by using the BgpConf and BgpPeer CRDs, and the latest configurations are automatically loaded without OpenELB restart
- When GoBGP is used as a library, the community provides Protocol Buffers (Protobuf) APIs.  OpenELB references these APIs when implementing the  BgpConf and BgpPeer CRD and remains compatible with GoBGP
- OpenELB also provides status to view configurations of the BGP neighbor, which provides rich status information

### Simple architecture and less resources occupied 

You can create an OpenELB deployment of multiple pod replicas to ensure high availability. Established connections still work well even though some replicas crash.

In BGP mode, all replicas advertise equal-cost routes to the router and usually two replicas are sufficient. In Layer 2 mode, a leader is elected among the replicas by using the leader election mechanism of Kubernetes to respond to ARP/NDP requests.

## Installation and Use of OpenELB

You can deploy OpenELB on any standard Kubernetes and K3s verions and their distributions by using a YAML file or Helm chart. Alternatively, you can deploy it from the App Store or an app repository on the KubeSphere web console. For more information, see [OpenELB Documentation](https://openelb.github.io/docs/getting-started/installation/).

## Future Plan

Backed by CNCF, OpenELB will maintain its commitment as an open-source project driven completely by the community. The following features are planned and you are always welcome to contribute and send feedbacks.

- VIP mode that supports Kubernetes high availability based on Keepalived
- Load balancing for kube-apiserver
- BGP policy configuration
- VIP Group
- Support for IPv6
- GUI for EIP and IP pool management
- Integration to the  KubeSphere web console and support for Prometheus metrics

To make service exposure and IP address management in private environments easier, we will continuously launch a variety of community activities to attract more developers and users.

## Commitment to Open Source

 The KubeSphere team has always been upholding the "Upstream first" principle. In July, 2021, the KubeSphere team donated Fluentbit Operator as a CNCF sub-project to the Fluent community. Now OpenELB, which was initiated by the KubeSphere team, also joins the CNCF sandbox. In the future, the KubeSphere team will serve as one of participants of the OpenELB project and maintain its commitment to open source. We will continue to work closely with all partners in the containerization field to build a vendor-neutral and open-source OpenELB community and ecosystem. Join the OpenELB community, tell us your experience when using OpenELB, and contribute to the OpenELB project!

- ✨ GitHub: [https://github.com/kubesphere/openelb/](https://github.com/kubesphere/openelb/)
- 💻 Official website: [https://openelb.github.io/](https://openelb.github.io/)
- 🙋 Slack channel: kubesphere.slack.com

