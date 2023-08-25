---
title: "Architecture"
keywords: "kubesphere, kubernetes, docker, helm, jenkins, istio, prometheus, devops, service mesh"
description: "KubeSphere architecture"

linkTitle: "Architecture"
weight: 1500
---

## Separation of frontend and backend

KubeSphere separates [frontend](https://github.com/kubesphere/console) from [backend](https://github.com/kubesphere/kubesphere), and it itself is a cloud native application and provides open standard REST APIs for external systems to use. Please see [API documentation](../../reference/api-docs/) for details. The following figure is the system architecture. KubeSphere can run anywhere from on-premise datacenter to any cloud to edge. In addition, it can be deployed on any Kubernetes distribution.

![Architecture](https://pek3b.qingstor.com/kubesphere-docs/png/20190810073322.png)

## Components List

| Back-end component | Function description |
|---|---|
| ks-apiserver | The KubeSphere API server validates and configures data for the API objects which include Kubernetes objects. The API Server services REST operations and provides the frontend to the cluster's shared state through which all other components interact. |
| ks-console | KubeSphere console offers KubeSphere console service |
| ks-controller-manager | KubeSphere controller takes care of business logic, for example, when create a workspace, the controller will automatically create corresponding permissions and configurations for it. |
| metrics-server | Kubernetes monitoring component collects metrics from Kubelet on each node. |
| Prometheus | provides monitoring metrics and services of clusters, nodes, workloads, API objects. |
| Elasticsearch | provides log indexing, querying and data management. Besides the built-in service, KubeSphere supports the integration of external Elasticsearch service. |
| Fluent Bit | collects logs and forwarding them to ElasticSearch or Kafka. |
| Jenkins | provides CI/CD pipeline service. |
| SonarQube | is an optional component that provides code static checking and quality analysis. |
| Source-to-Image | automatically compiles and packages source code into Docker image. |
| Istio | provides microservice governance and traffic control, such as grayscale release, canary release, circuit break, traffic mirroring and so on. |
| Jaeger | collects sidecar data and provides distributed tracing service. |
| OpenPitrix | provides application lifecycle management such as template management, deployment, app store management, etc. |
| Alert | provides configurable alert service for cluster, workload, Pod, and container etc. |
| Notification | is an integrated notification service; it currently supports mail delivery method. |
| Redis | caches the data of ks-console and ks-account. |
| MySQL | is the shared database for cluster back-end components including monitoring, alarm, DevOps, OpenPitrix etc. |
| PostgreSQL | SonarQube and Harbor's back-end database |
| OpenLDAP | is responsible for centralized storage and management of user account and integrates with external LDAP server. |
| Storage | built-in CSI plug-in collecting cloud platform storage services. It supports open source NFS/Ceph/Gluster client. |
| Network | supports Calico/Flannel and other open source network plug-ins to integrate with cloud platform SDN. |

## Service Components

Each component has many services. See [Overview](../../pluggable-components/overview/) for more details.
