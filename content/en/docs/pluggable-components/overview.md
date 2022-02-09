---
title: "Enable Pluggable Components — Overview"
keywords: "Kubernetes, KubeSphere, pluggable-components, overview"
description: "Develop a basic understanding of key components in KubeSphere, including features and resource consumption."
linkTitle: "Overview"
weight: 6100
---

KubeSphere has decoupled some core feature components since v2.1.0. These components are designed to be pluggable which means you can enable them either before or after installation. By default, KubeSphere will be deployed with a minimal installation if you do not enable them.

Different pluggable components are deployed in different namespaces. You can enable any of them based on your needs. It is highly recommended that you install these pluggable components to discover the full-stack features and capabilities provided by KubeSphere.

For more information about how to enable each component, see respective tutorials in this chapter.

## Resource Requirements

Before you enable pluggable components, make sure you have enough resources in your environment based on the tables below. Otherwise, components may crash due to a lack of resources.

{{< notice note >}}

The following request and limit of CPU and memory resources are required by a single replica.

{{</ notice >}}

### KubeSphere App Store

| Namespace      | openpitrix-system                                            |
| -------------- | ------------------------------------------------------------ |
| CPU Request    | 0.3 core                                                     |
| CPU Limit      | None                                                         |
| Memory Request | 300 MiB                                                      |
| Memory Limit   | None                                                         |
| Installation   | Optional                                                     |
| Notes          | Provide an App Store with application lifecycle management. The installation is recommended. |

### KubeSphere DevOps System

| Namespace      | kubesphere-devops-system                                     | kubesphere-devops-system                                |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| Pattern        | All-in-One installation                                      | Multi-node installation                                 |
| CPU Request    | 34 m                                                         | 0.47 core                                               |
| CPU Limit      | None                                                         | None                                                    |
| Memory Request | 2.69 G                                                       | 8.6 G                                                   |
| Memory Limit   | None                                                         | None                                                    |
| Installation   | Optional                                                     | Optional                                                |
| Notes          | Provide one-stop DevOps solutions with Jenkins pipelines and B2I & S2I. | The memory of one of the nodes must be larger than 8 G. |

### KubeSphere Monitoring System

| Namespace      | kubesphere-monitoring-system                                 | kubesphere-monitoring-system | kubesphere-monitoring-system |
| -------------- | ------------------------------------------------------------ | ---------------------------- | ---------------------------- |
| Sub-component  | 2 x Prometheus                                               | 3 x Alertmanager             | Notification Manager         |
| CPU Request    | 100 m                                                        | 10 m                         | 100 m                        |
| CPU Limit      | 4 cores                                                      | None                         | 500 m                        |
| Memory Request | 400 MiB                                                      | 30 MiB                       | 20 MiB                       |
| Memory Limit   | 8 GiB                                                        | None                         | 1 GiB                        |
| Installation   | Required                                                     | Required                     | Required                     |
| Notes          | The memory consumption of Prometheus depends on the cluster size. 8 GiB is sufficient for a cluster with 200 nodes/16,000 Pods. | -                            | -                            |

{{< notice note >}}

The KubeSphere monitoring system is not a pluggable component. It is installed by default. The resource request and limit of it are also listed on this page for your reference as it is closely related to other components such as logging.

{{</ notice >}} 

### KubeSphere Logging System

| Namespace      | kubesphere-logging-system                                    | kubesphere-logging-system                                    | kubesphere-logging-system                                    | kubesphere-logging-system                                    |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Sub-component  | 3 x Elasticsearch                                            | fluent bit                                                   | kube-events                                                  | kube-auditing                                                |
| CPU Request    | 50 m                                                         | 20 m                                                         | 90 m                                                         | 20 m                                                         |
| CPU Limit      | 1 core                                                       | 200 m                                                        | 900 m                                                        | 200 m                                                        |
| Memory Request | 2 G                                                          | 50 MiB                                                       | 120 MiB                                                      | 50 MiB                                                       |
| Memory Limit   | None                                                         | 100 MiB                                                      | 1200 MiB                                                     | 100 MiB                                                      |
| Installation   | Optional                                                     | Required                                                     | Optional                                                     | Optional                                                     |
| Notes          | An optional component for log data storage. The internal Elasticsearch is not recommended for the production environment. | The log collection agent. It is a required component after you enable logging. | Collecting, filtering, exporting and alerting of Kubernetes events. | Collecting, filtering and alerting of Kubernetes and KubeSphere auditing logs. |

### KubeSphere Alerting and Notification

| Namespace      | kubesphere-alerting-system                                   |
| -------------- | ------------------------------------------------------------ |
| CPU Request    | 0.08 core                                                    |
| CPU Limit      | None                                                         |
| Memory Request | 80 M                                                         |
| Memory Limit   | None                                                         |
| Installation   | Optional                                                     |
| Notes          | Alerting and Notification need to be enabled at the same time. |

### KubeSphere Service Mesh

| Namespace      | istio-system                                                 |
| -------------- | ------------------------------------------------------------ |
| CPU Request    | 1 core                                                       |
| CPU Limit      | None                                                         |
| Memory Request | 3.5 G                                                        |
| Memory Limit   | None                                                         |
| Installation   | Optional                                                     |
| Notes          | Support grayscale release strategies, traffic topology, traffic management and distributed tracing. |
