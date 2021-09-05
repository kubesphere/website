---
title: 'Kubernetes Multi-cluster Deployment: Kubernetes Cluster Federation and KubeSphere'
keywords: Kubernetes, KubeSphere, Multi-cluster, Container
description: KubeSphere v3.0 supports the management of multiple clusters, isolated management of resources, and federated deployments.
tag: 'KubeSphere, Multi-cluster'
createTime: '2020-07-20'
author: 'Jeff, Feynman, Sherlock'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/kubesphere-architecture.png'
---

## Scenarios for Multi-cluster Deployment

As the container technology and Kubernetes see a surge in popularity among their users, it is not uncommon for enterprises to run multiple clusters for their business. In general, here are the main scenarios where multiple Kubernetes clusters can be adopted.

### High Availability

You can deploy workloads on multiple clusters by using a global VIP or DNS to send requests to corresponding backend clusters. When a cluster malfunctions or fails to handle requests, the VIP or DNS records can be transferred to a health cluster.

![high-availability](https://ap3.qingstor.com/kubesphere-website/docs/ha.png)

### Low Latency

When clusters are deployed in various regions, user requests can be forwarded to the nearest cluster, greatly reducing network latency. For example, we have three Kubernetes clusters deployed in New York, Houston and Los Angeles respectively. For users in California, their requests can be forwarded to Los Angeles. This will reduce the network latency due to geographical distance, providing the most consistent user experience possible for users in different areas.

### Failure Isolation

Generally, it is much easier for multiple small clusters to isolate failures than a large cluster. In case of outages, network failures, insufficient resources or other possible resulting issues, the failure can be isolated within a certain cluster without spreading to others.

### Business Isolation

Although Kubernetes provides namespaces as a solution to app isolation, this method only represents the isolation in logic. This is because different namespaces are connected through the network, which means the issue of resource preemption still exists. To achieve further isolation, you need to create additional network isolation policies or set resource quotas. Using multiple Kubernetes clusters can achieve complete physical isolation that is more secure and reliable than the isolation through namespaces. For example, this is extremely effective when different departments within an enterprise use multiple clusters for the deployment of development, testing or production environments.

![pipeline](https://ap3.qingstor.com/kubesphere-website/docs/pipeline.png)

### Avoid Vendor Lock-in

Kubernetes has become the de facto standard in container orchestration. Against this backdrop, many enterprises avoid putting all eggs in one basket as they deploy clusters by using services of different cloud providers. That means they can transfer and scale their business anytime between clusters. However, it is not that easy for them to transfer their business in terms of costs, as different cloud providers feature varied Kubernetes services, including storage and network interface.

## Multi-cluster Deployment

The application of multi-cluster deployment offers solutions to a variety of problems as we can see from the scenarios above. Nevertheless, it brings more complexity for operation and maintenance. For a single cluster, app deployment and upgrade are quite straightforward as you can directly update yaml of the cluster. For multiple clusters, you can update them one by one, but how can you guarantee the application load status is the same across different clusters? How to implement service discovery among different clusters? How to achieve load balancing across clusters? The answer given by the community is Kubernetes Cluster Federation.

### Kubernetes Federation v1

![federation-v1](https://ap3.qingstor.com/kubesphere-website/docs/federation-v1.png)

There are two versions of Kubernetes Federation with the original v1 already deprecated. In v1, the general architecture is very similar to that of Kubernetes. As shown above, Federation API Server is used for the management of different clusters. It receives the request to create the deployment of multiple clusters as Federation Controller Manager deploys workloads on each cluster.

![annotations](https://ap3.qingstor.com/kubesphere-website/docs/annotations.png)

In terms of API, federated resources are scheduled through annotations, ensuring great compatibility with the original Kubernetes API. As such, the original code can be reused and existing deployment files of users can be easily transferred without any major change. However, this also prevents users from taking further advantage of Federation for API evolution. At the same time, a corresponding controller is needed for each federated resource so that they can be scheduled to different clusters. Originally, Kubernetes Cluster Federation only supported a limited number of resource type.

### Kubernetes Federation v2

![federation-v2](https://ap3.qingstor.com/kubesphere-website/docs/federation-v2.png)

The community developed Kubernetes Federation v2 (KubeFed) on the basis of v1. KubeFed has defined its own API standards through CRDs while deprecating the annotation method used before. The architecture has changed significantly as well, discarding Federated API Server and etcd that need to be deployed independently. The control plane of KubeFed adopts the popular implementation of CRD + Controller, which can be directly installed on existing Kubernetes clusters without any additional deployment.

KubeFed mainly defines four resource types:

- **Cluster Configuration** defines the register information needed for the control plane to add member clusters, including cluster name, APIServer address and the credential to create deployments.

- **Type Configuration** defines the resource type that KubeFed should handle. Each Type Configuration is a CRD object that contains three configuration items:

  - **Template.** Templates define the representation of a common resource to be handled. If the object does not have a corresponding definition on the cluster where it will be deployed, the deployment will fail. In the following example of FederatedDeployment, the template contains all the information needed to create the deployment.
  - **Placement**. Placements define the name of the cluster that a resource object will appear in, with two methods available (`clusters` and `clusterSelector`).
  - **Override**. Overrides define per-cluster, field-level variation that apply to the template, allowing you to customize configurations. In the example below, the number of replicas defined in `template` is 1, while `overrides` shows the replica number of cluster gondor will be 4 when it is deployed instead of 1 in `template`. A subset of the syntax of [Jsonpatch](http://jsonpatch.com/) is achieved in `overrides`, which means, theoretically, all the content in `template` can be overridden.

  ![FederatedDeployment](https://ap3.qingstor.com/kubesphere-website/docs/example.png)

- **Schedule** defines how apps are deployed across clusters, mainly related to ReplicaSets and Deployments. The maximum and minimum number of replicas of the load on a cluster can be defined through Schedule, which is similar to the annotation method in v1.
- **MultiClusterDNS** makes it possible for service discovery across clusters. Service discovery across multiple clusters is much more complicated than in a single cluster. ServiceDNSRecord, IngressDNSRecord and DNSEndpoint objects are used in KubeFed to implement service discovery across multiple clusters (DNS needed as well).

In general, KubeFed has provided solutions to many problems in v1. With CRDs, federated resources can be scaled to a large extent. Basically, all Kubernetes resources can be deployed across multiple clusters, including the CRD resources defined by users themselves.

However, KubeFed also has some issues to be resolved:

- **Single point of failure**. The control plane of KubeFed is achieved through CRD + Controller. High availability can be implemented for the controller itself, but the whole control plane will malfunction if Kubernetes it runs on fails. This was also [discussed in the community](https://github.com/kubernetes-sigs/kubefed/issues/636) before. Currently, KubeFed uses the push/reconcile method. When federated resources are created, the controller of the control plane will send the resource object to clusters accordingly. After that, the control plane is not responsible for how the member cluster handles resources. Therefore, existing application workloads will not be affected when KubeFed control plane fails.
- **Maturity**. The KubeFed community is not as active as the Kubernetes community. Its iteration cycle is too slow and many features are still in the beta stage.
- **Abstraction**. KubeFed defines resources to be managed through Type Configurations. Different Type Configurations only vary in their templates. The advantage is that the logic can be unified so that they can be quickly achieved. In KubeFed, the corresponding Controllers of Type Configuration resources are all created through [templates](https://github.com/kubernetes-sigs/kubefed/blob/master/pkg/controller/federatedtypeconfig/controller.go). That said, the shortcoming is quite obvious as customized features are not supported for special Types. For instance, for a FederatedDeployment object, KubeFed only needs to create a deployment object accordingly based on template and override, which will be deployed on the cluster specified in placement. As for whether the corresponding Pod is created based on the deployment and how the Pod runs, you can only check the information in the related cluster. The community has realized this issue and is working on it. A [proposal](https://github.com/kubernetes-sigs/kubefed/pull/1237) has already been raised.

## Multi-cluster Feature in KubeSphere

Resource federation is what the community has proposed to solve the issue of deployments across multiple Kubernetes clusters. For many enterprise users, the deployment of multiple clusters is not necessary. What is more important is that they need to be able to manage the resources across multiple clusters at the same time and in the same place.

[KubeSphere](https://github.com/kubesphere) supports the management of multiple Kubernetes clusters, isolated management of resources, and federated deployments. In addition, it also features multi-dimensional queries (monitoring, logging, events and auditing) of resources such as clusters and apps, as well as alerts and notifications through various channels. Apps can be deployed on multiple clusters with CI/CD pipelines.

![kubesphere-workflow](https://ap3.qingstor.com/kubesphere-website/docs/workflow.png)

KubeSphere 3.0 supports unified management of user access for the multi-cluster feature based on KubeFed, RBAC and Open Policy Agent. With the multi-tenant architecture, it is very convenient for business departments, development teams and Ops teams to manage resources isolatedly in a unified console according to their needs.

![business](https://ap3.qingstor.com/kubesphere-website/docs/business.png)

### Architecture

![kubesphere-architecture](https://ap3.qingstor.com/kubesphere-website/docs/kubesphere-architecture.png)

The overall multi-cluster architecture of KubeSphere [Container Platform](https://kubesphere.io/) is shown above. The cluster where the control plane is located is called Host cluster. The cluster managed by the Host cluster is called Member cluster, which is essentially a Kubernetes cluster with KubeSphere installed. The Host cluster needs to be able to access the kube-apiserver of Member clusters. Besides, there is no requirement for the network connectivity between Member clusters. The Host cluster is independent of the member clusters managed by it, which do not know the existence of the Host cluster. The advantage of the logic is that when the Host cluster malfunctions, Member clusters will not be affected and deployed workloads can continue to run as well.

In addition, the Host cluster also serves as an entry for API requests. It will forward all resource requests for member clusters to them. In this way, not only can requests be aggregated, but also authentication and authorization can be implemented in a unified fashion.

### Authorization and Authentication

It can be seen from the architecture that the Host cluster is responsible for the synchronization of identity and access information of clusters, which is achieved by federated resources of KubeFed. When FederatedUser, FederatedRole, or FederatedRoleBinding is created on the Host cluster, KubeFed will push User, Role, or Rolebinding to Member clusters. Any access change will only be applied to the Host cluster, which will then be synchronized to Member clusters. This is to ensure the integrity of each Member cluster. In this regard, the identity and access data stored in Member clusters enable them to implement authentication and authorization independently without any reliance on the Host cluster. In the multi-cluster architecture of KubeSphere, the Host cluster acts as a resource coordinator instead of a dictator, since it delegates power to Member clusters as much as possible.

### Cluster Connectivity

The multi-cluster feature of KubeSphere only entails the access of the Host cluster to the Kubernetes APIServer of Member clusters. There is no requirement for network connectivity at the cluster level. KubeSphere provides two methods for the connection of Host and Member clusters:

- **Direct connection**. If the kube-apiserver address of Member clusters is accessible on any node of the Host cluster, you can adopt this method. Member clusters only need to provide the cluster kubeconfig. This method applies to most public cloud Kubernetes services or the scenario where the Host cluster and Member clusters are in the same network.

- **Agent connection**. In case Member clusters are in a private network with the kube-apiserver address unable to be exposed, KubeSphere provides [Tower](https://github.com/kubesphere/tower) for agent connection. Specifically, the Host cluster will run a proxy service. When a new cluster joins, the Host cluster will generate all credential information. Besides, the agent running on Member clusters will connect to the proxy service running on the Host cluster. A reverse proxy will be created after the handshake succeeds. As the kube-apiserver address of Member clusters will change in agent connection, the Host cluster needs to create a new kubeconfig for Member clusters. This is very convenient as the underlying details can be hidden. In either direct connection or agent connection, the control plane is provided with a kubeconfig that can be used directly.

  ![cluster-tunnel](https://ap3.qingstor.com/kubesphere-website/docs/cluster-tunnel.jpg)

### API Forwarding

In the multi-cluster architecture of KubeSphere, the Host cluster serves as a cluster entry. All API requests are directly sent to the Host cluster first, which will decide where these requests go next. To provide the best compatibility possible with the original API in the multi-cluster environment, the API request whose path begins with `/apis/clusters/{cluster}` will be forwarded to the cluster `{cluster}`, with `/clusters/{cluster}` removed. The advantage is that there is no difference between the request the cluster receives this way with other requests, with no additional configuration or operation needed.

![api-forwarding](https://ap3.qingstor.com/kubesphere-website/docs/api-forwarding.png)

For example:

![api-fowarding1](https://ap3.qingstor.com/kubesphere-website/docs/api-fowarding1.png)

The request above will be forwarded to a cluster named rohan and be handled as:

![api-forwarding2](https://ap3.qingstor.com/kubesphere-website/docs/api-forwarding2.png)

## Summary

The topic of multi-cluster deployment is far more complicated than we think. The fact that the Federation solution provided by the community has not been officially released after two versions is a typical example. As we often put it, there is no Silver Bullet in software engineering. It is impossible for multi-cluster tools such as KubeFed and KubeSphere to solve all the issues. We need to find the solution that best suits us based on the specific business scenario. It is believed that these tools will become more mature over time, which can be applied in more scenarios.

## References

1. KubeFed: https://github.com/kubernetes-sigs/kubefed
2. KubeSphere Website: https://kubesphere.io/
3. Kubernetes Federation Evolution: https://kubernetes.io/blog/2018/12/12/kubernetes-federation-evolution/
4. KubeSphere GitHub: https://github.com/kubesphere
