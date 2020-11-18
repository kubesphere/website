---
title: "Bring your own Prometheus"
keywords: "Monitoring, Prometheus, node-exporter, kube-state-metrics, KubeSphere, Kubernetes"
description: "Use your own Prometheus stack for KubeSphere monitoring"

Weight: 7100
---

KubeSphere comes with several pre-installed customized monitoring components including Prometheus Operator, Prometheus, Alertmanager, Grafana (Optional), various service monitors, node-exporter, kube-state-metrics. These components might already exist before you install KubeSphere, it's possible to use your own Prometheus stack setup in KubeSphere v3.0.0 .

## Steps to bring your own Prometheus

To use your own Prometheus stack setup, the steps are as below:

- Uninstall KubeSphere customized Prometheus stack

- Install your own Prometheus stack

- Install KubeSphere customized stuff to your Prometheus stack

- Change KubeSphere's `monitoring endpoint`

### 1. Uninstall KubeSphere customized Prometheus stack

You can uninstall KubeSphere customized Prometheus stack as below:

```bash
# Enter ks-installer pod
kubectl -n kubesphere-system exec -it `kubectl -n kubesphere-system get pod|grep ks-installer|awk '{print $1}'` -- /bin/sh
# Execute the following commands inside ks-installer pod to uninstall, pls ignore errors like below:
# Error from server (NotFound): error when deleting "/kubesphere/kubesphere/prometheus/xx/xxx.yaml": xxx "xxx" not found
kubectl delete -f /kubesphere/kubesphere/prometheus/alertmanager/
kubectl delete -f /kubesphere/kubesphere/prometheus/devops/
kubectl delete -f /kubesphere/kubesphere/prometheus/etcd/
kubectl delete -f /kubesphere/kubesphere/prometheus/grafana/
kubectl delete -f /kubesphere/kubesphere/prometheus/kube-state-metrics/
kubectl delete -f /kubesphere/kubesphere/prometheus/node-exporter/
kubectl delete -f /kubesphere/kubesphere/prometheus/upgrade/
kubectl delete -f /kubesphere/kubesphere/prometheus/prometheus-rules-v1.16\+.yaml
kubectl delete -f /kubesphere/kubesphere/prometheus/prometheus-rules.yaml
kubectl delete -f /kubesphere/kubesphere/prometheus/prometheus
kubectl delete -f /kubesphere/kubesphere/prometheus/init/
# Delete pvc Prometheus used
kubectl -n kubesphere-monitoring-system delete pvc `kubectl -n kubesphere-monitoring-system get pvc | grep -v VOLUME | awk '{print $1}' |  tr '\n' ' '`
```

### 2. Install your own Prometheus stack

{{< notice note >}}

KubeSphere 3.0 was certified to work well with Prometheus Operator **v0.38.3+**, Prometheus **v2.20.1+**, Alertmanager **v0.21.0+**,kube-state-metrics **v1.9.6**, node-exporter **v0.18.1**, so please be aware that your Prometheus stack components' version meets these version requirements especially node-exporter and kube-state-metrics.

If you've already had a Prometheus stack up and running, you can skip this step.

{{</ notice >}}

Promethes stack can be installed in many ways, the following steps show how to install using `kube-prometheus`. 

```bash
# Get kube-prometheus version v0.6.0 whose node-exporter's version v0.18.1 matches the one KubeSphere v3.0.0 used
cd ~ && git clone https://github.com/prometheus-operator/kube-prometheus.git && cd kube-prometheus && git checkout tags/v0.6.0 -b v0.6.0
# Setup monitoring namespace, install prometheus operator and corresponding roles
kubectl apply -f manifests/setup/
# Wait until the prometheus operator is up and running
kubectl -n monitoring get pod --watch
# Remove unnecessary components like prometheus adapter
rm -rf manifests/prometheus-adapter-*.yaml
# Change kube-state-metrics to the same version v1.9.6 as KubeSphere v3.0.0 used
sed -i 's/v1.9.5/v1.9.6/g' manifests/kube-state-metrics-deployment.yaml
# Install Prometheus, Alertmanager, Grafana, kube-state-metrics, node-exporter
kubectl apply -f manifests/
```

### 3. Install KubeSphere customized stuff to your Prometheus stack

{{< notice note >}}

KubeSphere 3.0 uses Prometheus Operator to manage Prometheus/Alertmanager config and lifecycle, ServiceMonitor (to manage scrape config), PrometheusRule (to manage Prometheus recording/alert rules).

There are a few items listed in [KubeSphere kustomization](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/kustomization.yaml), among which `prometheus-rules.yaml` and `prometheus-rulesEtcd.yaml` are required for KubeSphere v3.0.0 to work properly and the others are optional. You can remove `alertmanager-secret.yaml` if you don't want your existing Alertmanager's config to be overwritten. You can remove `xxx-serviceMonitor.yaml` if you don't want your own `ServiceMonitors` to be overwritten (KubeSphere customized ServiceMonitors discard many irrelevant metrics to make sure Promethues only store the most useful metrics).

If your Prometheus stack setup isn't managed by Prometheus Operator, you can skip this step. But you have to make sure that:

- You must copy the recording/alerting rules in [PrometheusRule](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/prometheus-rules.yaml) and [PrometheusRule for ETCD](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/prometheus-rulesEtcd.yaml) to your Prometheus config for KubeSphere v3.0.0 to work properly.

- Configure your Prometheus to scrape metrics from the same targets as the ServiceMonitors listed in [KubeSphere kustomization](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/kustomization.yaml)

{{</ notice >}}

```bash
# Get KubeSphere v3.0.0 customized kube-prometheus
cd ~ && mkdir kubesphere && cd kubesphere && git clone https://github.com/kubesphere/kube-prometheus.git && cd kube-prometheus/kustomize
# Change to your own namespace in which Prometheus stack is deployed
sed -i 's/my-namespace/<replace-me-with-new-ns>/g' kustomization.yaml
# Apply KubeSphere customized stuff including Promethues rules, Alertmanager config, various ServiceMonitors.  
kubectl apply -k .
# Setup service for kube-scheduler and kube-controller-manager metrics exposure
kubectl apply -f https://raw.githubusercontent.com/kubesphere/kube-prometheus/ks-v3.0/kustomize/prometheus-serviceKubeScheduler.yaml
kubectl apply -f https://raw.githubusercontent.com/kubesphere/kube-prometheus/ks-v3.0/kustomize/prometheus-serviceKubeControllerManager.yaml
# Find Prometheus CR which is usually k8s
kubectl -n monitoring get prometheus
# Set Prometheus rule evaluation interval to 1m to be consistent with KubeSphere v3.0.0 customized ServiceMonitor, rule evaluation interval should be greater or equal to scrape interval.
kubectl -n monitoring patch prometheus k8s --patch '{
  "spec": {
    "evaluationInterval": "1m"
  }
}' --type=merge
```

### 4. Change KubeSphere's `monitoring endpoint`

Now your own Prometheus stack is up and running, it's time to change KubeSphere's monitoring endpoint to use your own Prometheus.

Opening kubesphere-config by running `kubectl edit cm -n kubesphere-system kubesphere-config`, then find `monitoring endpoint` section like below:

```bash
    monitoring:
      endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
```

Change monitoring endpoint to your own Prometheus:

```bash
    monitoring:
      endpoint: http://prometheus-operated.monitoring.svc:9090
```

Restart KubeSphere APIServer by running `kubectl -n kubesphere-system rollout restart deployment/ks-apiserver`