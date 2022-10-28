---
title: "Bring Your Own Prometheus"
keywords: "Monitoring, Prometheus, node-exporter, kube-state-metrics, KubeSphere, Kubernetes"
description: "Use your own Prometheus stack setup in KubeSphere."
linkTitle: "Bring Your Own Prometheus"
Weight: 16330
---

KubeSphere comes with several pre-installed customized monitoring components including Prometheus Operator, Prometheus, Alertmanager, Grafana (Optional), various ServiceMonitors, node-exporter, and kube-state-metrics. These components might already exist before you install KubeSphere. It is possible to use your own Prometheus stack setup in KubeSphere 3.3.

## Steps to Bring Your Own Prometheus

To use your own Prometheus stack setup, perform the following steps:

1. Uninstall the customized Prometheus stack of KubeSphere

2. Install your own Prometheus stack

3. Install KubeSphere customized stuff to your Prometheus stack

4. Change KubeSphere's `monitoring endpoint`

### Step 1. Uninstall the customized Prometheus stack of KubeSphere

1. Execute the following commands to uninstall the stack:

   ```bash
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/alertmanager/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/devops/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/etcd/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/grafana/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/kube-state-metrics/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/node-exporter/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/upgrade/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/prometheus-rules-v1.16\+.yaml 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/prometheus-rules.yaml 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/prometheus 2>/dev/null
   # Uncomment this line if you don't have Prometheus managed by Prometheus Operator in other namespaces.
   # kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/init/ 2>/dev/null
   ```

2. Delete the PVC that Prometheus used.

   ```bash
   kubectl -n kubesphere-monitoring-system delete pvc `kubectl -n kubesphere-monitoring-system get pvc | grep -v VOLUME | awk '{print $1}' |  tr '\n' ' '`
   ```

### Step 2. Install your own Prometheus stack

{{< notice note >}}

KubeSphere 3.3 was certified to work well with the following Prometheus stack components:

- Prometheus Operator **v0.38.3+**
- Prometheus **v2.20.1+**
- Alertmanager **v0.21.0+**
- kube-state-metrics **v1.9.6**
- node-exporter **v0.18.1**

Make sure your Prometheus stack components' version meets these version requirements especially **node-exporter** and **kube-state-metrics**.

Make sure you install **node-exporter** and **kube-state-metrics** if only **Prometheus Operator** and **Prometheus** were installed. **node-exporter** and **kube-state-metrics** are required for KubeSphere to work properly.

**If you've already had the entire Prometheus stack up and running, you can skip this step.**

{{</ notice >}}

The Prometheus stack can be installed in many ways. The following steps show how to install it into the namespace `monitoring` using **upstream `kube-prometheus`**.

1. Get kube-prometheus version v0.6.0 whose node-exporter's version v0.18.1 matches the one KubeSphere 3.3 is using.

   ```bash
   cd ~ && git clone https://github.com/prometheus-operator/kube-prometheus.git && cd kube-prometheus && git checkout tags/v0.6.0 -b v0.6.0
   ```

2. Setup the `monitoring` namespace, and install Prometheus Operator and corresponding roles:

   ```bash
   kubectl apply -f manifests/setup/
   ```

3. Wait until Prometheus Operator is up and running.

   ```bash
   kubectl -n monitoring get pod --watch
   ```

4. Remove unnecessary components such as Prometheus Adapter.

   ```bash
   rm -rf manifests/prometheus-adapter-*.yaml
   ```

5. Change kube-state-metrics to the same version v1.9.6 as KubeSphere 3.3 is using.

   ```bash
   sed -i 's/v1.9.5/v1.9.6/g' manifests/kube-state-metrics-deployment.yaml
   ```

6. Install Prometheus, Alertmanager, Grafana, kube-state-metrics, and node-exporter. You can only install kube-state-metrics or node-exporter by only applying the yaml file `kube-state-metrics-*.yaml` or `node-exporter-*.yaml`.

   ```bash
   kubectl apply -f manifests/
   ```

### Step 3. Install KubeSphere customized stuff to your Prometheus stack

{{< notice note >}}

KubeSphere 3.3 uses Prometheus Operator to manage Prometheus/Alertmanager config and lifecycle, ServiceMonitor (to manage scrape config), and PrometheusRule (to manage Prometheus recording/alert rules).

There are a few items listed in [KubeSphere kustomization](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/kustomization.yaml), among which `prometheus-rules.yaml` and `prometheus-rulesEtcd.yaml` are required for KubeSphere 3.3 to work properly and others are optional. You can remove `alertmanager-secret.yaml` if you don't want your existing Alertmanager's config to be overwritten. You can remove `xxx-serviceMonitor.yaml` if you don't want your own ServiceMonitors to be overwritten (KubeSphere customized ServiceMonitors discard many irrelevant metrics to make sure Prometheus only stores the most useful metrics).

If your Prometheus stack setup isn't managed by Prometheus Operator, you can skip this step. But you have to make sure that:

- You must copy the recording/alerting rules in [PrometheusRule](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/prometheus-rules.yaml) and [PrometheusRule for etcd](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/prometheus-rulesEtcd.yaml) to your Prometheus config for KubeSphere 3.3 to work properly.

- Configure your Prometheus to scrape metrics from the same targets as the ServiceMonitors listed in [KubeSphere kustomization](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/kustomization.yaml).

{{</ notice >}}

1. Get KubeSphere 3.3 customized kube-prometheus.

   ```bash
   cd ~ && mkdir kubesphere && cd kubesphere && git clone https://github.com/kubesphere/kube-prometheus.git && cd kube-prometheus/kustomize
   ```

2. Change the namespace to your own in which the Prometheus stack is deployed. For example, it is `monitoring` if you install Prometheus in the `monitoring` namespace following Step 2.

   ```bash
   sed -i 's/my-namespace/<your own namespace>/g' kustomization.yaml
   ```

3. Apply KubeSphere customized stuff including Prometheus rules, Alertmanager config, and various ServiceMonitors.

   ```bash
   kubectl apply -k .
   ```

4. Setup Services for kube-scheduler and kube-controller-manager metrics exposure.

   ```bash
   kubectl apply -f ./prometheus-serviceKubeScheduler.yaml
   kubectl apply -f ./prometheus-serviceKubeControllerManager.yaml
   ```

5. Find the Prometheus CR which is usually Kubernetes in your own namespace.

   ```bash
   kubectl -n <your own namespace> get prometheus
   ```

6. Set the Prometheus rule evaluation interval to 1m to be consistent with the KubeSphere 3.3 customized ServiceMonitor. The Rule evaluation interval should be greater or equal to the scrape interval.

   ```bash
   kubectl -n <your own namespace> patch prometheus k8s --patch '{
     "spec": {
       "evaluationInterval": "1m"
     }
   }' --type=merge
   ```

### Step 4. Change KubeSphere's `monitoring endpoint`

Now that your own Prometheus stack is up and running, you can change KubeSphere's monitoring endpoint to use your own Prometheus.

1. Edit `kubesphere-config` by running the following command:

   ```bash
   kubectl edit cm -n kubesphere-system kubesphere-config
   ```

2. Navigate to the `monitoring endpoint` section as below:

   ```bash
       monitoring:
         endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
   ```

3. Change `monitoring endpoint` to your own Prometheus:

   ```bash
       monitoring:
         endpoint: http://prometheus-operated.monitoring.svc:9090
   ```

4. Run the following command to restart the KubeSphere APIServer.

   ```bash
   kubectl -n kubesphere-system rollout restart deployment/ks-apiserver
   ```

{{< notice warning >}}

If you enable/disable KubeSphere pluggable components following [this guide](../../../pluggable-components/overview/) , the `monitoring endpoint` will be reset to the original one. In this case, you have to change it to the new one and then restart the KubeSphere APIServer again.

{{</ notice >}}
