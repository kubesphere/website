---
title: "Bring Your Own Prometheus"
keywords: "Monitoring, Prometheus, node-exporter, kube-state-metrics, KubeSphere, Kubernetes"
description: "Use your own Prometheus stack setup in KubeSphere."
linkTitle: "Bring Your Own Prometheus"
Weight: 16330
version: "v3.3"
---

KubeSphere comes with several pre-installed customized monitoring components, including Prometheus Operator, Prometheus, Alertmanager, Grafana (Optional), various ServiceMonitors, node-exporter, and kube-state-metrics. These components might already exist before you install KubeSphere. It is possible to use your own Prometheus stack setup in KubeSphere v3.3.

## Bring Your Own Prometheus

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

2. Delete the PVC that Prometheus uses.

   ```bash
   kubectl -n kubesphere-monitoring-system delete pvc `kubectl -n kubesphere-monitoring-system get pvc | grep -v VOLUME | awk '{print $1}' |  tr '\n' ' '`
   ```

### Step 2. Install your own Prometheus stack

{{< notice note >}}

KubeSphere 3.3 was certified to work well with the following Prometheus stack components:

- Prometheus Operator **v0.55.1+**
- Prometheus **v2.34.0+**
- Alertmanager **v0.23.0+**
- kube-state-metrics **v2.5.0**
- node-exporter **v1.3.1**

Make sure your Prometheus stack components' version meets these version requirements, especially **node-exporter** and **kube-state-metrics**.

Make sure you install **node-exporter** and **kube-state-metrics** if only **Prometheus Operator** and **Prometheus** are installed. **node-exporter** and **kube-state-metrics** are required for KubeSphere to work properly.

**If you've already had the entire Prometheus stack up and running, you can skip this step.**

{{</ notice >}}

The Prometheus stack can be installed in many ways. The following steps show how to install it into the namespace `monitoring` using [Prometheus stack manifests in ks-installer](https://github.com/kubesphere/ks-installer/tree/release-3.3/roles/ks-monitor/files/prometheus) (generated from a KubeSphere custom version of [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus.git)).

1. Obtain `ks-installer` that KubeSphere v3.3.0 uses.

   ```bash
   cd ~ && git clone -b release-3.3 https://github.com/kubesphere/ks-installer.git && cd ks-installer/roles/ks-monitor/files/prometheus
   ```

2. Create `kustomization.yaml`:  
   ```bash
   # create 
   cat <<EOF > kustomization.yaml
   apiVersion: kustomize.config.k8s.io/v1beta1
   kind: Kustomization
   namespace: monitoring
   resources:
   EOF

   # append yaml paths
   find . -mindepth 2 -name "*.yaml" -type f -print | sed 's/^/- /' >> kustomization.yaml
   ```

3. Remove unnecessary components. For example, if Grafana is not enabled in KubeSphere, you can run the following command to delete the Grafana section in `kustomization.yaml`.

   ```bash
   sed -i '/grafana\//d' kustomization.yaml
   ```

4. Install the stack.

   ```bash
   kubectl apply -k .
   ```

### Step 3. Install KubeSphere customized stuff to your Prometheus stack

{{< notice note >}}

If your Prometheus stack is installed using [Prometheus stack manifests in ks-installer](https://github.com/kubesphere/ks-installer/tree/release-3.3/roles/ks-monitor/files/prometheus), skip this step.

KubeSphere 3.3.0 uses Prometheus Operator to manage Prometheus/Alertmanager config and lifecycle, ServiceMonitor (to manage scrape config), and PrometheusRule (to manage Prometheus recording/alert rules).

If your Prometheus stack setup isn't managed by Prometheus Operator, you can skip this step. But you have to make sure that:

- You must copy the recording/alerting rules in [PrometheusRule](https://github.com/kubesphere/ks-installer/tree/release-3.3/roles/ks-monitor/files/prometheus/kubernetes/kubernetes-prometheusRule.yaml) and [PrometheusRule for etcd](https://github.com/kubesphere/ks-installer/tree/release-3.3/roles/ks-monitor/files/prometheus/etcd/prometheus-rulesEtcd.yaml) to your Prometheus config for KubeSphere v3.3.0 to work properly.

- Configure your Prometheus to scrape metrics from the same targets as that in [serviceMonitor](https://github.com/kubesphere/ks-installer/tree/release-3.3/roles/ks-monitor/files/prometheus/) of each component.

{{</ notice >}}

1. Obtain `ks-installer` that KubeSphere v3.3.0 uses.

   ```bash
   cd ~ && git clone -b release-3.3 https://github.com/kubesphere/ks-installer.git && cd ks-installer/roles/ks-monitor/files/prometheus
   ```

2. Create `kustomization.yaml`, fill the following content.

   ```yaml
   apiVersion: kustomize.config.k8s.io/v1beta1
   kind: Kustomization
   namespace: <your own namespace>
   resources:
   - ./alertmanager/alertmanager-secret.yaml
   - ./etcd/prometheus-rulesEtcd.yaml
   - ./kube-state-metrics/kube-state-metrics-serviceMonitor.yaml
   - ./kubernetes/kubernetes-prometheusRule.yaml
   - ./kubernetes/kubernetes-serviceKubeControllerManager.yaml
   - ./kubernetes/kubernetes-serviceKubeScheduler.yaml
   - ./kubernetes/kubernetes-serviceMonitorApiserver.yaml
   - ./kubernetes/kubernetes-serviceMonitorCoreDNS.yaml
   - ./kubernetes/kubernetes-serviceMonitorKubeControllerManager.yaml
   - ./kubernetes/kubernetes-serviceMonitorKubeScheduler.yaml
   - ./kubernetes/kubernetes-serviceMonitorKubelet.yaml
   - ./node-exporter/node-exporter-serviceMonitor.yaml
   - ./prometheus/prometheus-clusterRole.yaml
   ```

   {{< notice note >}}

   - Set the value of `namespace` to your own namespace in which the Prometheus stack is deployed. For example, it is `monitoring` if you install Prometheus in the `monitoring` namespace in Step 2.
   - If you have enabled the alerting component for KubeSphere, supplement yaml paths of `thanos-ruler` into `kustomization.yaml`.

   {{</ notice >}}

3. Install the required components of KubeSphere.

   ```bash
   kubectl apply -k .
   ```

4. Find the Prometheus CR which is usually `k8s` in your own namespace.

   ```bash
   kubectl -n <your own namespace> get prometheus
   ```

5. Set the Prometheus rule evaluation interval to 1m to be consistent with the KubeSphere v3.3.0 customized ServiceMonitor. The Rule evaluation interval should be greater than or equal to the scrape interval.

   ```bash
   kubectl -n <your own namespace> patch prometheus k8s --patch '{
     "spec": {
       "evaluationInterval": "1m"
     }
   }' --type=merge
   ```

### Step 4. Change KubeSphere's `monitoring endpoint`

Now that your own Prometheus stack is up and running, you can change KubeSphere's monitoring endpoint to use your own Prometheus.

1. Run the following command to edit `kubesphere-config`.

   ```bash
   kubectl edit cm -n kubesphere-system kubesphere-config
   ```

2. Navigate to the `monitoring endpoint` section, as shown in the following:

   ```bash
       monitoring:
         endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
   ```

3. Change `monitoring endpoint` to your own Prometheus:

   ```bash
       monitoring:
         endpoint: http://prometheus-operated.monitoring.svc:9090
   ```

4. If you have enabled the alerting component of KubeSphere, navigate to `prometheusEndpoint` and `thanosRulerEndpoint` of `alerting`, and change the values according to the following sample. KubeSphere APIServer will restart automatically to make your configurations take effect.

   ```yaml
   ...
      alerting:
        ...
        prometheusEndpoint: http://prometheus-operated.monitoring.svc:9090
        thanosRulerEndpoint: http://thanos-ruler-operated.monitoring.svc:10902
        ...
   ...
   ```

{{< notice warning >}}

If you enable/disable KubeSphere pluggable components following [this guide](../../../pluggable-components/overview/) , the `monitoring endpoint` will be reset to the original value. In this case, you need to change it to the new one.

{{</ notice >}}