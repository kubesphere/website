---
title: "Introduction to Custom Application Monitoring"
keywords: 'monitoring, prometheus, prometheus operator'
description: 'Introduce the KubeSphere custom monitoring feature and metric exposing, including exposing methods and ServiceMonitor CRD.'
linkTitle: "Introduction"
weight: 10810
---

Custom monitoring allows you to monitor and visualize custom application metrics in KubeSphere. The application can be either a third-party application, such as MySQL, Redis, and Elasticsearch, or your own application. This section introduces the workflow of this feature.

The KubeSphere monitoring engine is powered by Prometheus and Prometheus Operator. To integrate custom application metrics into KubeSphere, you need to go through the following steps in general.

- [Expose Prometheus-formatted metrics](#step-1-expose-prometheus-formatted-metrics) of your application.
- [Apply ServiceMonitor CRD](#step-2-apply-servicemonitor-crd) to hook up your application with the monitoring target.
- [Visualize metrics](#step-3-visualize-metrics) on the dashboard to view the trend of custom metrics.

### Step 1: Expose Prometheus-formatted metrics

First of all, your application must expose Prometheus-formatted metrics. The Prometheus exposition format is the de-facto format in the realm of cloud-native monitoring. Prometheus uses a [text-based exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/). Depending on your application and use case, there are two ways to expose metrics:

#### Direct exposing

Directly exposing Prometheus metrics from applications is a common way among cloud-native applications. It requires developers to import Prometheus client libraries in their codes and expose metrics at a specific endpoint. Many applications, such as etcd, CoreDNS, and Istio, adopt this method.

The Prometheus community offers client libraries for most programming languages. Find your language on the [Prometheus Client Libraries](https://prometheus.io/docs/instrumenting/clientlibs/) page. For Go developers, read [Instrumenting a Go application](https://prometheus.io/docs/guides/go-application/) to learn how to write a Prometheus-compliant application.

The [sample web application](../examples/monitor-sample-web/) is an example demonstrating how an application exposes Prometheus-formatted metrics directly.

#### Indirect exposing

If you don’t want to modify your code or you cannot do so because the application is provided by a third party, you can deploy an exporter which serves as an agent to scrape metric data and translate them into Prometheus format.

For most third-party applications, such as MySQL, the Prometheus community provides production-ready exporters. Refer to [Exporters and Integrations](https://prometheus.io/docs/instrumenting/exporters/) for available exporters. In KubeSphere, it is recommended to [enable OpenPitrix](../../../pluggable-components/app-store/) and deploy exporters from the App Store. Exporters for MySQL, Elasticsearch, and Redis are all built-in apps in the App Store.

Please read [Monitor MySQL](../examples/monitor-mysql/) to learn how to deploy a MySQL exporter and monitor MySQL metrics.

Writing an exporter is nothing short of instrumenting an application with Prometheus client libraries. The only difference is that exporters need to connect to applications and translate application metrics into Prometheus format.

### Step 2: Apply ServiceMonitor CRD

In the previous step, you expose metric endpoints in a Kubernetes Service object. Next, you need to inform the KubeSphere monitoring engine of your new changes.

The ServiceMonitor CRD is defined by [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator). A ServiceMonitor contains information about the metrics endpoints. With ServiceMonitor objects, the KubeSphere monitoring engine knows where and how to scape metrics. For each monitoring target, you apply a ServiceMonitor object to hook your application (or exporters) up to KubeSphere.

In KubeSphere 3.3, you need to pack a ServiceMonitor with your applications (or exporters) into a Helm chart for reuse. In future releases, KubeSphere will provide graphical interfaces for easy operation.

Please read [Monitor a Sample Web Application](../examples/monitor-sample-web/) to learn how to pack a ServiceMonitor with your application.

### Step 3: Visualize Metrics

Around two minutes, the KubeSphere monitoring engine starts to scape and store metrics. Then you can use PromQL to query metrics and design panels and dashboards.

Please read [Querying](../visualization/querying/) to learn how to write a PromQL expression. For dashboard features, please read [Visualization](../visualization/overview/).
