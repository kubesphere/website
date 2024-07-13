---
title: "Release Notes for 3.0.0"
keywords: "Kubernetes, KubeSphere, release-notes"
description: "KubeSphere release notes for 3.0.0."
linkTitle: "Release Notes - 3.0.0"
weight: 18400
version: "v3.4"
---

## How to get v3.0.0

- [Install KubeSphere v3.0.0 on Linux](../../installing-on-linux/)
- [Install KubeSphere v3.0.0 on existing Kubernetes](../../installing-on-kubernetes/)

## Release Notes

## **Installer**

### FEATURES

- A brand-new installer: [KubeKey](https://github.com/kubesphere/kubekey), v1.0.0, which is a turnkey solution to installing Kubernetes with KubeSphere on different platforms. It is more easy to use and reduces the dependency on OS environment

### UPGRADES & ENHANCEMENTS

- Be compatible with Kubernetes 1.15.x, 1.16.x, 1.17.x and 1.18.x for [ks-installer](https://github.com/kubesphere/ks-installer), v3.0.0
- [KubeKey](https://github.com/kubesphere/kubekey) officially supports Kubernetes 1.15.12, 1.16.13, 1.17.9 and 1.18.6 (Please avoid using KubeKey to install Kubernetes 1.15 to 1.15.5 and 1.16 to 1.16.2, because Kubernetes has an [API validation issue](https://github.com/kubernetes/kubernetes/issues/83778))
- Add support for EulerOS, UOS and KylinOS
- Add support for Kunpeng and Phytium CPU
- Use ClusterConfiguration CRD to store ks-installer's configuration instead of ConfigMap

## **Cluster Management**

### FEATURES

- Support management of multiple Kubernetes clusters
- Support Federated Deployment and Federated StatefulSet across multiple clusters

## **Observability**

### FEATURES

- Support custom monitoring for 3rd-party application metrics in KubeSphere console
- Add Kubernetes and KubeSphere auditing support, including audit event archiving, searching and alerting
- Add Kubernetes event management support, including Kubernetes event archiving, searching and alerting based by [kube-events](https://github.com/kubesphere/kube-events)
- Add tenant control to auditing and support Kubernetes event searching. A tenant user can only search his or her own auditing logs and Kubernetes events
- Support archiving auditing logs and Kubernetes events to Elasticsearch, Kafka or Fluentd
- Add multi-tenant notification support by [Notification Manager](https://github.com/kubesphere/notification-manager)
- Support Alertmanager v0.21.0

### UPGRADES & ENHANCEMENTS

- Upgrade Prometheus Operator to v0.38.3 (KubeSphere customized version )
- Upgrade Prometheus to v2.20.1
- Upgrade Node Exporter to v0.18.1
- Upgrade kube-state-metrics to v1.9.6
- Upgrade metrics server to v0.3.7
- metrics-server is enabled by default (Disabled if KubeSphere is installed on existing Kubernetes)
- Upgrade Fluent Bit Operator to v0.2.0
- Upgrade Fluent Bit to v1.4.6
- Significantly improve log searching performance
- Allow platform admins to view pod logs from deleted namespaces
- Adjust the display style of log searching results in Toolbox
- Optimize log collection configuration for log files on pod's volume

### BUG FIXES

- Fix time skew in metric graphs for newly created namespaces (#[2868](https://github.com/kubesphere/kubesphere/issues/2868))
- Fix workload-level alerting not working as expected (#[2834](https://github.com/kubesphere/kubesphere/issues/2834))
- Fix no metric data for NotReady nodes

## **DevOps**

### FEATURES

- Refactor DevOps framework, and use CRDs to manage DevOps resources

### UPGRADES & ENHANCEMENTS

- Remove Sonarqube from installer default packages, and support for external Sonarqube

### BUG FIXES

- Fix the issue that DevOps permission data is missing in a very limited number of cases 

- Fix the issue that the Button in the Stage page doesn't work (#[449](https://github.com/kubesphere/console/issues/449))
- Fix the issue that the parameterized pipeline failed to send the parameter's value (#[2699](https://github.com/kubesphere/kubesphere/issues/2699))

## **App Store**

### FEATURES

- Support Helm V3
- Support deploying application templates onto multiple clusters
- Support application template upgrade
- Users can view events that occur during repository synchronization

### UPGRADES & ENHANCEMENTS

- Users can use the same application repository name

- Support the application template which contains CRDs

- Merge all OpenPitrix services into one service

- Support HTTP basic authentication when adding an application repository

- Add and upgrade below apps in App Store:
  
  | App Name               | App Version | Chart Version |
  | ---------------------- | ----------- | :------------ |
  | AWS EBS CSI Driver     | 0.5.0       | 0.3.0         |
  | AWS EFS CSI Driver     | 0.3.0       | 0.1.0         |
  | AWS FSX CSI Driver     | 0.1.0       | 0.1.0         |
  | Elasticsearch Exporter | 1.1.0       | 3.3.0         |
  | etcd                   | 3.3.12      | 0.1.1         |
  | Harbor                 | 2.0.0       | 1.4.0         |
  | Memcached              | 1.5.20      | 3.2.3         |
  | Minio master           |             | 5.0.26        |
  | MongoDB                | 4.2.1       | 0.3.0         |
  | MySQL                  | 5.7.30      | 1.6.6         |
  | MySQL Exporter         | 0.11.0      | 0.5.3         |
  | Nginx                  | 1.18.0      | 1.3.2         |
  | PorterLB                 | 0.3-alpha   | 0.1.3         |
  | PostgreSQL             | 12.0        | 0.3.2         |
  | RabbitMQ               | 3.8.1       | 0.3.0         |
  | Redis                  | 5.0.5       | 0.3.2         |
  | Redis Exporter         | 1.3.4       | 3.4.1         |
  | Tomcat                 | 8.5.41      | 0.4.1+1       |

### BUG FIXES

- Fix the issue of insufficient length of attachment IDs

## **Network**

### FEATURES

- Support project network isolation by adding controllers to manage custom project network policies
- Support workspace network isolation
- Support adding, viewing, modifying and deleting native Kubernetes network policies

## **Service Mesh**

### FEATURES

- Support cleaning Jaeger ES Indexer

### UPGRADES & ENHANCEMENTS

- Upgrade Istio to v1.4.8

## **Storage**

### FEATURES

- Support volume snapshot management
- Support storage capacity management
- Support volume monitoring

## **Security**

### FEATURES

- Support LDAP and OAuth login
- Support custom workspace roles
- Support custom DevOps project roles
- Support access control across multiple clusters
- Support pod security context (#[1453](https://github.com/kubesphere/kubesphere/issues/1453))

### UPGRADES & ENHANCEMENTS

- Simplify the role definition
- Optimize built-in roles

### BUG FIXES

- Fix the issue of login failure due to node clock skew

## **Globalization**

### FEATURES

- Add support for new languages in the web console, including Spanish and Traditional Chinese

## **User Experience**

### FEATURES

- Add support for history record viewing in Toolbox. Users can re-visit the Clusters/Workspaces/Projects/DevOps Projects that they recently visited, which can also be launched through shortcut keys

### UPGRADES & ENHANCEMENTS

- Refactor global navigation
- Refactor breadcrumbs in detail pages
- Refactor data watching in the resources list
- Simplify project creation
- Refactor composing application creation, and support creating a composing application through YAML
- Support workload revision through YAML
- Optimize the display of log query results
- Refactor app store deployment form
- Support helm chart schema (#[schema-files](https://helm.sh/docs/topics/charts/#schema-files))

### BUG FIXES

- Fix the error when editing ingress annotations (#[1931](https://github.com/kubesphere/kubesphere/issues/1931))
- Fix container probes when editing in workload edit template modal
- Fix XSS security problems of the server-side templates