---
title: "Uninstall Pluggable Components from KubeSphere v3.1.x"
keywords: "Installer, uninstall, KubeSphere, Kubernetes"
description: "Learn how to uninstall each pluggable component in KubeSphere v3.1.x."
linkTitle: "Uninstall Pluggable Components from KubeSphere v3.1.x"
Weight: 16500
---

After you [enable the pluggable components of KubeSphere](../../../pluggable-components/), you can also uninstall them by performing the following steps. Please back up any necessary data before you uninstall these components.

{{< notice note >}}

The methods of uninstalling certain pluggable components on KubeSphere v3.1.x are different from the methods on KubeSphere v3.0.0. For more information about the uninstallation methods on KubeSphere v3.0.0, see [Uninstall Pluggable Components from KubeSphere](https://v3-0.docs.kubesphere.io/docs/faq/installation/uninstall-pluggable-components/).

{{</ notice >}}

## Prerequisites

You have to change the value of the field `enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration` before you uninstall any pluggable components except Service Topology and Pod IP Pools. 

Use either of the following methods to change the value of the field `enabled`:

- Run the following command to edit `ks-installer`:

  ```bash
  kubectl -n kubesphere-system edit clusterconfiguration ks-installer
  ```

- Log in to the KubeSphere web console as `admin`, click **Platform** in the upper-left corner and select **Cluster Management**, and then go to **CRDs** to search for `ClusterConfiguration`. For more information, see [Enable Pluggable Components](../../../pluggable-components/).

{{< notice note >}}

After the value is changed, you need to wait until the updating process is complete before you continue with any further operations.

{{</ notice >}}

## Uninstall KubeSphere App Store

Change the value of `openpitrix.store.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

## Uninstall KubeSphere DevOps

1. Change the value of `devops.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. Run the command mentioned in [Prerequisites](#prerequisites) and then delete the code under `status.devops` in `ks-installer` of the CRD `ClusterConfiguration`.

3. Run the following commands:

   ```bash
   helm -n kubesphere-devops-system delete ks-jenkins
   helm -n kubesphere-devops-system delete uc
   ```

   ```bash
   # Delete DevOps projects
   for devopsproject in `kubectl get devopsprojects -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch devopsprojects $devopsproject -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   for pip in `kubectl get pipeline -A -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch pipeline $pip -n `kubectl get pipeline -A | grep $pip | awk '{print $1}'` -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   for s2ibinaries in `kubectl get s2ibinaries -A -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch s2ibinaries $s2ibinaries -n `kubectl get s2ibinaries -A | grep $s2ibinaries | awk '{print $1}'` -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   for s2ibuilders in `kubectl get s2ibuilders -A -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch s2ibuilders $s2ibuilders -n `kubectl get s2ibuilders -A | grep $s2ibuilders | awk '{print $1}'` -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   for s2ibuildertemplates in `kubectl get s2ibuildertemplates -A -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch s2ibuildertemplates $s2ibuildertemplates -n `kubectl get s2ibuildertemplates -A | grep $s2ibuildertemplates | awk '{print $1}'` -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   for s2iruns in `kubectl get s2iruns -A -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch s2iruns $s2iruns -n `kubectl get s2iruns -A | grep $s2iruns | awk '{print $1}'` -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   kubectl delete devopsprojects --all 2>/dev/null
   ```

   ```bash
   kubectl delete ns kubesphere-devops-system
   ```

## Uninstall KubeSphere Logging

1. Change the value of `logging.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. To disable only log collection:

   ```bash
   delete inputs.logging.kubesphere.io -n kubesphere-logging-system tail
   ```

   {{< notice note >}}

   After running this command, you can still view the container recent logs provided by Kubernetes by default. However, the container history logs will be cleared and you cannot browse them any more. 

   {{</ notice >}}

3. To uninstall Logging system including Elasticsearch:

   ```bash
   kubectl delete crd fluentbitconfigs.logging.kubesphere.io
   kubectl delete crd fluentbits.logging.kubesphere.io
   kubectl delete crd inputs.logging.kubesphere.io
   kubectl delete crd outputs.logging.kubesphere.io
   kubectl delete crd parsers.logging.kubesphere.io
   kubectl delete deployments.apps -n kubesphere-logging-system fluentbit-operator
   helm uninstall elasticsearch-logging --namespace kubesphere-logging-system
   ```

   {{< notice note >}}

   This operation may cause anomalies in Auditing, Events, and Service Mesh.

   {{</ notice >}}

## Uninstall KubeSphere Events

1. Change the value of `events.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. Run the following command:

   ```bash
   helm delete ks-events -n kubesphere-logging-system
   ```

## Uninstall KubeSphere Alerting

1. Change the value of `alerting.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. Run the following command:

   ```bash
   kubectl -n kubesphere-monitoring-system delete thanosruler kubesphere
   ```

   {{< notice note >}}

   Notification is installed in KubeSphere v3.1.x by default, so you do not need to uninstall it.

   {{</ notice >}} 


## Uninstall KubeSphere Auditing

1. Change the value of `auditing.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. Run the following commands:

   ```bash
   helm uninstall kube-auditing -n kubesphere-logging-system
   kubectl delete crd awh
   kubectl delete crd ar
   ```

## Uninstall KubeSphere Service Mesh

1. Change the value of `servicemesh.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. Run the following commands:

   ```bash
   curl -L https://istio.io/downloadIstio | sh -
   istioctl x uninstall --purge
   
   kubectl -n istio-system delete kiali kiali
   helm -n istio-system delete kiali-operator
   
   kubectl -n istio-system delete jaeger jaeger
   helm -n istio-system delete jaeger-operator
   ```

## Uninstall Network Policies

For the component NetworkPolicy, disabling it does not require uninstalling the component as its controller is now inside `ks-controller-manager`. If you want to remove it from the KubeSphere console, change the value of `network.networkpolicy.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

## Uninstall Metrics Server

1. Change the value of `metrics_server.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. Run the following commands:

   ```bash
   kubectl delete apiservice v1beta1.metrics.k8s.io
   kubectl -n kube-system delete service metrics-server
   kubectl -n kube-system delete deployment metrics-server
   ```

## Uninstall Service Topology

1. Change the value of `network.topology.type` from `weave-scope` to `none` in `ks-installer` of the CRD `ClusterConfiguration`.

2. Run the following command:

   ```bash
   kubectl delete ns weave
   ```

## Uninstall Pod IP Pools

Change the value of `network.ippool.type` from `calico` to `none` in `ks-installer` of the CRD `ClusterConfiguration`.

## Uninstall KubeEdge

1. Change the value of `kubeedge.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. Run the following commands:

   ```bash
   helm uninstall kubeedge -n kubeedge
   kubectl delete ns kubeedge
   ```

   {{< notice note >}}

   After the uninstallation, you will not be able to add edge nodes to your cluster.

   {{</ notice >}}

