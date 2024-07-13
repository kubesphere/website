---
title: "Observability — Monitoring FAQ"
keywords: "Kubernetes, Prometheus, KubeSphere, Monitoring"
description: "Questions asked frequently about the monitoring functionality."
linkTitle: "Monitoring"
weight: 16320
version: "v3.4"
---

This page contains some of the frequently asked questions about monitoring.

- [How to access the Prometheus console in KubeSphere](#how-to-access-the-prometheus-console-in-kubesphere)
- [Host port 9100 conflict caused by the node exporter](#host-port-9100-conflict-caused-by-the-node-exporter)
- [Conflicts with the preexisting prometheus operator](#conflicts-with-the-preexisting-prometheus-operator)
- [How to change the monitoring data retention period](#how-to-change-the-monitoring-data-retention-period)
- [No monitoring data for kube-scheduler and kube-controller-manager](#no-monitoring-data-for-kube-scheduler-and-kube-controller-manager)
- [No monitoring data for the last few minutes](#no-monitoring-data-for-the-last-few-minutes)
- [No monitoring data for both nodes and the control plane](#no-monitoring-data-for-both-nodes-and-the-control-plane)
- [Prometheus produces an error log: opening storage failed, no such file or directory: opening storage failed, no such file or directory](#prometheus-produces-an-error-log-opening-storage-failed-no-such-file-or-directory)

## How to access the Prometheus console in KubeSphere

The KubeSphere monitoring engine is powered by Prometheus. For debugging purposes, you may want to access the built-in Prometheus service through a NodePort. Run the following command to change the service type to `NodePort`:

```bash
kubectl edit svc -n kubesphere-monitoring-system prometheus-k8s
```

{{< notice note >}}

To access the Prometheus console, you may need to open relevant ports and configure port forwarding rules depending on your environment.

{{</ notice >}} 

## Host port 9100 conflict caused by the node exporter

If you have processes occupying the host port 9100, the node exporter in `kubesphere-monitoring-system` will be crashing. To resolve the conflict, you need to either terminate the process or assign another available port to the node exporter.

To adopt another host port, such as `29100`, run the following command and replace all `9100` with `29100` (5 places need to be changed).

 ```bash
kubectl edit ds -n kubesphere-monitoring-system node-exporter
 ```

 ```yaml
 apiVersion: apps/v1
 kind: DaemonSet
 metadata:
   name: node-exporter
   namespace: kubesphere-monitoring-system
   ...
 spec:
   ...
   template:
     ...
     spec:
       containers:
       - name: node-exporter
         image: kubesphere/node-exporter:ks-v0.18.1
         args:
         - --web.listen-address=127.0.0.1:9100
         ...
       - name: kube-rbac-proxy
         image: kubesphere/kube-rbac-proxy:v0.4.1
         args:
         - --logtostderr
         - --secure-listen-address=[$(IP)]:9100
         - --upstream=http://127.0.0.1:9100/
         ...
         ports:
         - containerPort: 9100
           hostPort: 9100
  ...
 ```

## Conflicts with the preexisting prometheus operator

If you have deployed Prometheus Operator on your own, make sure it is removed before you install KubeSphere. Otherwise, there may be conflicts that the built-in Prometheus Operator of KubeSphere selects duplicate ServiceMonitor objects.

## How to change the monitoring data retention period

Run the following command to edit the maximum retention period. Navigate to the field `retention` and set a desired retention period (`7d` by default).

```bash
kubectl edit prometheuses -n kubesphere-monitoring-system k8s
```

## No monitoring data for kube-scheduler and kube-controller-manager

First, make sure the flag `--bind-address` is set to `0.0.0.0` (default) rather than `127.0.0.1`. Prometheus may need to access theses components from other hosts.

Second, check the presence of endpoint objects for `kube-scheduler` and `kube-controller-manager`. If they are missing, create them manually by creating services and selecting target Pods.

```bash
kubectl get ep -n kube-system | grep -E 'kube-scheduler|kube-controller-manager'
```

## No monitoring data for the last few minutes

Check if your computer browser's local clock is in sync with the Internet time and with your cluster. A time gap may cause this issue. This may occur especially if your computer resides on an Intranet.

## No monitoring data for both nodes and the control plane

Check your network plugin and make sure that there is no IP Pool overlap between your hosts and Pod network CIDR. It is strongly recommended that you install Kubernetes with [KubeKey](https://github.com/kubesphere/kubekey).

Chinese readers may refer to [the discussion](https://ask.kubesphere.io/forum/d/2027/16) in the KubeSphere China forum for more information.

## Prometheus produces an error log: opening storage failed, no such file or directory

If the Prometheus Pod in `kubesphere-monitoring-system` is crashing and produces the following error log, your Prometheus data may be corrupt and needs manual deletion to recover.

```shell
level=error ts=2020-10-14T17:43:30.485Z caller=main.go:764 err="opening storage failed: block dir: \"/prometheus/01EM0016F8FB33J63RNHFMHK3\": open /prometheus/01EM0016F8FB33J63RNHFMHK3/meta.json: no such file or directory"
```

Exec into the Prometheus Pod (if possible), and remove the block directory `/prometheus/01EM0016F8FB33J63RNHFMHK3`:

```bash
kubectl exec -it -n kubesphere-monitoring-system prometheus-k8s-0 -c prometheus sh

rm -rf 01EM0016F8FB33J63RNHFMHK3/
```

Alternatively, you can simply delete the directory from the persistent volume bound to the Prometheus PVC.
