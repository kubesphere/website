---
title: "Uninstall Pluggable Components"
keywords: "Installer, uninstall, KubeSphere, Kubernetes"
description: "Learn how to uninstall each pluggable component in KubeSphere."
linkTitle: "Uninstall Pluggable Components"
Weight: 6940
---

After you [enable the pluggable components of KubeSphere](../../pluggable-components/), you can also uninstall them by performing the following steps. Please back up any necessary data before you uninstall these components.

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

1. To uninstall DevOps:

   ```bash
   helm uninstall -n kubesphere-devops-system devops
   kubectl patch -n kubesphere-system cc ks-installer --type=json -p='[{"op": "remove", "path": "/status/devops"}]'
   kubectl patch -n kubesphere-system cc ks-installer --type=json -p='[{"op": "replace", "path": "/spec/devops/enabled", "value": false}]'
   ```
2. To delete DevOps resources:

   ```bash
   # Remove all resources related with DevOps
   for devops_crd in $(kubectl get crd -o=jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' | grep "devops.kubesphere.io"); do
       for ns in $(kubectl get ns -ojsonpath='{.items..metadata.name}'); do
           for devops_res in $(kubectl get $devops_crd -n $ns -oname); do
               kubectl patch $devops_res -n $ns -p '{"metadata":{"finalizers":[]}}' --type=merge
           done
       done
   done
   # Remove all DevOps CRDs
   kubectl get crd -o=jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' | grep "devops.kubesphere.io" | xargs -I crd_name kubectl delete crd crd_name
   # Remove DevOps namespace
   kubectl delete namespace kubesphere-devops-system
   ```


## Uninstall KubeSphere Logging

1. Change the value of `logging.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. To disable only log collection:

   ```bash
   kubectl delete inputs.logging.kubesphere.io -n kubesphere-logging-system tail
   ```

   {{< notice note >}}

   After running this command, you can still view the container's recent logs provided by Kubernetes by default. However, the container history logs will be cleared and you cannot browse them any more. 

   {{</ notice >}}

3. To uninstall the Logging system, including Elasticsearch:

   ```bash
   kubectl delete crd fluentbitconfigs.logging.kubesphere.io
   kubectl delete crd fluentbits.logging.kubesphere.io
   kubectl delete crd inputs.logging.kubesphere.io
   kubectl delete crd outputs.logging.kubesphere.io
   kubectl delete crd parsers.logging.kubesphere.io
   kubectl delete deployments.apps -n kubesphere-logging-system fluentbit-operator
   helm uninstall elasticsearch-logging --namespace kubesphere-logging-system
   ```

   {{< notice warning >}}

   This operation may cause anomalies in Auditing, Events, and Service Mesh.

   {{</ notice >}}
   
4. Run the following command:

   ```bash
   kubectl delete deployment logsidecar-injector-deploy -n kubesphere-logging-system
   kubectl delete ns kubesphere-logging-system
   ```

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

   Notification is installed in KubeSphere 3.3 by default, so you do not need to uninstall it.

   {{</ notice >}} 


## Uninstall KubeSphere Auditing

1. Change the value of `auditing.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. Run the following commands:

   ```bash
   helm uninstall kube-auditing -n kubesphere-logging-system
   kubectl delete crd rules.auditing.kubesphere.io
   kubectl delete crd webhooks.auditing.kubesphere.io
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

1. Change the value of `kubeedge.enabled` and `edgeruntime.enabled` from `true` to `false` in `ks-installer` of the CRD `ClusterConfiguration`.

2. Run the following commands:

   ```bash
   helm uninstall kubeedge -n kubeedge
   kubectl delete ns kubeedge
   ```

   {{< notice note >}}

   After uninstallation, you will not be able to add edge nodes to your cluster.

   {{</ notice >}}

