---
title: 'Use Cases'
keywords: 'KubeSphere, Kubernetes, Multi-cluster, Observability, DevOps'
description: 'Applicable in a variety of scenarios, KubeSphere provides enterprises with containerized environments with a complete set of features for management and operation.'

weight: 1700
version: "v3.3"
---

KubeSphere is applicable in a variety of scenarios. For enterprises that deploy their business system on bare metal, their business modules are tightly coupled with each other. That means it is extremely difficult for resources to be horizontally scaled. In this connection, KubeSphere provides enterprises with containerized environments with a complete set of features for management and operation. It empowers enterprises to rise to the challenges in the middle of their digital transformation, including agile software development, automated operation and maintenance, microservices governance, traffic management, autoscaling, high availability, as well as DevOps and CI/CD.

At the same time, with the strong support for network and storage offered by QingCloud, KubeSphere is highly compatible with the existing monitoring and O&M system of enterprises. This is how they can upgrade their system for IT containerization.

## Multi-cluster Deployment

It is generally believed that using as few clusters as possible can reduce costs with less pressure for O&M. That said, both individuals and organizations tend to deploy multiple clusters for various reasons. For instance, the majority of enterprises may deploy their services across clusters as they need to be tested in non-production environments. Another typical example is that enterprises may separate their services based on regions, departments, and infrastructure providers by adopting multiple clusters.

The main reasons for employing this method fall into the following four categories:

### High Availability

Users can deploy workloads on multiple clusters by using a global VIP or DNS to send requests to corresponding backend clusters. When a cluster malfunctions or fails to handle requests, the VIP or DNS records can be transferred to a healthy cluster.

![high-availability](https://ap3.qingstor.com/kubesphere-website/docs/ha.png)

### Low Latency

When clusters are deployed in various regions, user requests can be forwarded to the nearest cluster, greatly reducing network latency. For example, we have three Kubernetes clusters deployed in New York, Houston and Los Angeles respectively. For users in California, their requests can be forwarded to Los Angeles. This will reduce the network latency due to geographical distance, providing the best user experience possible for users in different areas.

### Isolation

**Failure Isolation**. Generally, it is much easier for multiple small clusters to isolate failures than a large cluster. In case of outages, network failures, insufficient resources or other possible resulting issues, the failure can be isolated within a certain cluster without spreading to others.

**Business Isolation**. Although Kubernetes provides namespaces as a solution to app isolation, this method only represents the isolation in logic. This is because different namespaces are connected through the network, which means the issue of resource preemption still exists. To achieve further isolation, users need to create additional network isolation policies or set resource quotas. Using multiple clusters users can achieve complete physical isolation that is more secure and reliable than the isolation through namespaces. For example, this is extremely effective when different departments within an enterprise use multiple clusters for the deployment of development, testing or production environments.

![pipeline](https://ap3.qingstor.com/kubesphere-website/docs/pipeline.png)

### Avoid Vendor Lock-in

Kubernetes has become the de facto standard in container orchestration. Against this backdrop, many enterprises avoid putting all eggs in one basket as they deploy clusters by using services of different cloud providers. That means they can transfer and scale their business anytime between clusters. However, it is not that easy for them to transfer their business in terms of costs, as different cloud providers feature varied Kubernetes services, including storage and network interface.

KubeSphere provides its unique feature as a solution to the above four cases. Based on the Federation pattern of KubeSphere's multi-cluster feature, multiple heterogeneous Kubernetes clusters can be aggregated within a unified Kubernetes resource pool. When users deploy applications, they can decide to which Kubernetes cluster they want app replicas to be scheduled in the pool. The whole process is managed and maintained through KubeSphere. This is how KubeSphere helps users achieve multi-site high availability (across zones and clusters).

For more information, see [Multi-cluster Management](../../multicluster-management/).

## Full-stack Observability with Streamlined O&M

Observability represents an important part in the work of Ops teams. In this regard, enterprises see increasing pressure on their Ops teams as they deploy their business on Kubernetes directly or on the platform of other cloud providers. This poses considerable challenges to Ops teams since they need to cope with extensive data.

### Multi-dimensional Cluster Monitoring

Again, the adoption of multi-cluster deployment across clouds is on the rise both among individuals and enterprises. However, because they run different services, users need to learn, deploy and especially, monitor across different cloud environments. After all, the tool provided by one cloud vendor for observability may not be applicable to another. In short, Ops teams are in desperate need of a unified view across different clouds for cluster monitoring covering metrics across the board.

### Log Query

A comprehensive monitoring feature is meaningless without a flexible log query system. This is because users need to be able to track all the information related to their resources, such as alerting messages, node scheduling status, app deployment success, or network policy modification. All these records play an important role in making sure users can keep up with the latest development, which will inform policy decisions of their business.

### Customization

Even for resource monitoring on the same platform, the tool provided by the cloud vendor may not be a panacea. In some cases, users need to create their own standard of observability, such as the specific monitoring metrics and display form. Moreover, they need to integrate common tools to the cloud for special use, such as Prometheus, which is the de facto standard for Kubernetes monitoring. In other words, customization has become a necessity in the industry as cloud-powered applications drive business on the one hand while requiring fine-grained monitoring on the other just in case of any failure.

KubeSphere features a unified platform for the management of clusters deployed across cloud providers. Apps can be deployed automatically, streamlining the process of operation and maintenance. At the same time, KubeSphere boasts powerful observability features (alerting, events, auditing, logging and notifications) with a comprehensive customized monitoring system for a wide range of resources. Users themselves can decide what resources they want to monitor in what kind of forms.

With KubeSphere, enterprises can focus more on business innovation as they are freed from complicated process of data collection and analysis.

## Implement DevOps Practices

DevOps represents an important set of practices or methods that engage both development and Ops teams for more coordinated and efficient cooperation between them. Therefore, development, test and release can be faster, more efficient and more reliable. CI/CD pipelines in KubeSphere provide enterprises with agile development and automated O&M. Besides, the microservices feature (service mesh) in KubeSphere enables enterprises to develop, test and release services in a fine-grained way, creating an enabling environment for their implementation of DevOps. With KubeSphere, enterprises can make full use of DevOps by:

- Testing service robustness through fault injection without code hacking.
- Decoupling Kubernetes services with credential management and access control.
- Visualizing end-to-end monitoring process.

## Service Mesh and Cloud-native Architecture

Enterprises are now under increasing pressure to accelerate innovation amid their digital transformation. Specifically, they need to speed up in terms of development cycle, delivery time and deployment frequency. As application architectures evolve from monolithic to microservices, enterprises are faced with a multitude of resulting challenges. For example, microservices communicate with each other frequently, which entails smooth and stable network connectivity. Among others, latency represents a key factor that affects the entire architecture and user experience. In case of any failure, a troubleshooting and identifying system also needs to be in place to respond in time. Besides, deploying distributed applications is never an easy job without highly-functional tools and infrastructure.

KubeSphere service mesh addresses a series of microservices use cases.

### Multi-cloud App Distribution

As mentioned above, it is not uncommon for individuals or organizations to deploy apps across Kubernetes clusters, whether on premises, public or hybrid. This may bring out significant challenges in unified traffic management, application and service scalability, DevOps pipeline automation, monitoring and so on.

### Visualization

As users deploy microservices which will communicate among themselves considerably, it will help users gain a better understanding of topological relations between microservices if the connection is highly visualized. Besides, distributed tracing is also essential for each service, providing operators with a detailed understanding of call flows and service dependencies within a mesh.

### Rolling Updates

When enterprises introduce a new version of a service, they may adopt a canary upgrade or blue-green deployment. The new one runs side by side with the old one and a set percentage of traffic is moved to the new service for error detection and latency monitoring. If everything works fine, the traffic to the new one will gradually increase until 100% of customers are using the new version. For this type of update, KubeSphere provides three kinds of categories of grayscale release:

**Blue-green Deployment**. The blue-green release provides a zero downtime deployment, which means the new version can be deployed with the old one preserved. It enables both versions to run at the same time. If there is a problem with running, you can quickly roll back to the old version.

**Canary Release**. This method brings part of the actual traffic into a new version to test its performance and reliability. It can help detect potential problems in the actual environment while not affecting the overall system stability.

**Traffic Mirroring**. Traffic mirroring provides a more accurate way to test new versions as problems can be detected in advance while not affecting the production environment.

With a lightweight, highly scalable microservices architecture offered by KubeSphere, enterprises are well-positioned to build their own cloud-native applications for the above scenarios. Based on Istio, a major solution to microservices, KubeSphere provides a platform for microservices governance without any hacking into code. Spring Cloud is also integrated for enterprises to build Java apps. KubeSphere also offers microservices upgrade consultations and technical support services, helping enterprises implement microservices architectures for their cloud-native transformation.

## Bare Metal Deployment

Sometimes, the cloud is not necessarily the ideal place for the deployment of resources. For example, physical, dedicated servers tend to function better when it comes to the cases that require considerable compute resources and high disk I/O. Besides, for some specialized workloads that are difficult to migrate to a cloud environment, certified hardware and complicated licensing and support agreements may be required.

KubeSphere can help enterprises deploy a containerized architecture on bare metal, load balancing traffic with a physical switch. In this connection, [OpenELB](https://github.com/kubesphere/openelb), a CNCF-certified cloud-native tool is born for this end. At the same time, KubeSphere, together with QingCloud VPC and QingStor NeonSAN, provides users with a complete set of features ranging from load balancing, container platform building, network management, and storage. This means virtually all aspects of the containerized architecture can be fully controlled and uniformly managed, without sacrificing the performance in virtualization.

For detailed information about how KubeSphere drives the development of numerous industries, please see [Case Studies](/case/).
