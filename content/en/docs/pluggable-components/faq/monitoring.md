---
title: "Monitoring"
keywords: "Kubernetes, Prometheus, KubeSphere, Monitoring"
description: "FAQ"

linkTitle: "Monitoring"
weight: 3540
---

- [How to access KubeSphere Prometheus console](#how-to-access-kubesphere-prometheus-console)
- [Host port 9100 conflict caused by node exporter](#host-port-9100-conflict-caused-by-node-exporter)
- [Conflicts with preexisting prometheus operator](#conflicts-with-preexisting-prometheus-operator)
- [How to modify monitoring data retention days](#how-to-modify-monitoring-data-retention-days)
- [No monitoring data for kube-scheduler and kube-controller-manager](#no-monitoring-data-for-kube-scheduler-and-kube-controller-manager)
- [No monitoring data for the last few minutes](#no-monitoring-data-for-the-last-few-minutes)
- [No monitoring data for both nodes and the control plane](#no-monitoring-data-for-both-nodes-and-the-control-plane)
- [Prometheus produces error log: opening storage failed, no such file or directory](#prometheus-produces-error-log-opening-storage-failed-no-such-file-or-directory)

## How to access KubeSphere Prometheus console

KubeSphere monitoring engine is powered by Prometheus. For debugging purpose, you may want to access the built-in Prometheus service via NodePort. To do so, run the following command to edit the service type:

```bash
kubectl edit svc -n kubesphere-monitoring-system prometheus-k8s
```

## Host port 9100 conflict caused by node exporter

If you have processes occupying host port 9100, node exporter under `kubesphere-monitoring-system` will be crashing. To resolve the conflict, you need to either terminate the process or change node exporter to another available port.

 To adopt another host port, for example `29100`, run the following command and replace all `9100` to `29100` (5 places require change).

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

## Conflicts with preexisting prometheus operator

If you have deployed Prometheus Operator on your own, make sure the Prometheus Operator gets removed before you installing KubeSphere. Otherwise, there may be conflicts that KubeSphere built-in prometheus operator selects duplicate ServiceMonitor objects.

## How to modify monitoring data retention days

Run the following command to edit the max retention days. Find out the field `retention` and update it to the desired days (7 by default).

```bash
kubectl edit prometheuses -n kubesphere-monitoring-system k8s
```

## No monitoring data for kube-scheduler and kube-controller-manager

First, please make sure the flag `--bind-address` is set to `0.0.0.0` (default) rather than `127.0.0.1`. Prometheus may need reachability to theses components from other hosts.

Second, please check the presence of endpoint objects for kube-scheduler and kube-controller-manager. If they are missing, please create them manually by creating services selecting target pods.

```bash
kubectl get ep -n kube-system | grep -E 'kube-scheduler|kube-controller-manager'
```

## No monitoring data for the last few minutes

Please check if your computer browser local clock is in sync with the Internet time and your cluster. A time gap may cause this issue. This may occur especially you are residing in an Intranet.

## No monitoring data for both nodes and the control plane

Please check your network plugin and make sure no IPPool overlap between your hosts and pod network CIDR. KubeSphere strongly recommends you installing Kubernetes with [KubeKey](https://github.com/kubesphere/kubekey).

Chinese readers may refer to [the discussion](https://kubesphere.com.cn/forum/d/2027/16) in the KubeSphere China forum for more information.

## Prometheus produces error log: opening storage failed, no such file or directory

If the Prometheus pod under kubesphere-monitoring-system is crashing and produces the following error log, your Prometheus data may be corrupt and need manual deletion to recover.

```shell
level=error ts=2020-10-14T17:43:30.485Z caller=main.go:764 err="opening storage failed: block dir: \"/prometheus/01EM0016F8FB33J63RNHFMHK3\": open /prometheus/01EM0016F8FB33J63RNHFMHK3/meta.json: no such file or directory"
```

Exec into the Prometheus pod (if possible), and remove the block dir `/prometheus/01EM0016F8FB33J63RNHFMHK3`:

```bash
kubectl exec -it -n kubesphere-monitoring-system prometheus-k8s-0 -c prometheus sh

rm -rf 01EM0016F8FB33J63RNHFMHK3/
```

Or you can simply delete the dir from the persistent volume linked to the Prometheus PVC.