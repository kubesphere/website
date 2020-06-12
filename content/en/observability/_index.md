---
title: "observability"
layout: "scenario"

css: "scss/scenario.scss"

section1:
  title: KubeSphere allows you to build visualizations simply and intuitively
  content: KubeSphere provides rich observability from infrastructure to applications. It integrates your favorite tools for multi-dimensional monitoring metrics, multi-tenant log query and collection, alerting and notification.
  image: /images/service-mesh/banner.jpg

image: /images/observability/observability.jpg

section2:
  title: Discoverability, Observability, Security, Everything You Need in One Platform
  list:
    - title: Multi-dimensional Monitoring
      image: /images/observability/multi-dimensional-monitoring.png
      contentList:
        - content: <span>Infrastructure monitoring</span> provides K8s control plane and cluster node metrics
        - content: <span>Application resources monitoring</span> includes CPU, memory, network and storage metrics
        - content: <span>Resource usage ranking</span> by node, workspace and project.
        - content: <span>Service component monitoring</span> for user to quickly locate component failures
        - content: <span>Custom metrics support</span> including application custom metrics dashboard (in v3.0.0)
    
    - title: Log Query and Collection
      image: /images/observability/log-query-and-collection.png
      contentList:
        - content: <span>Multi-tenant log management</span>, different tenants can only see their own log information.
        - content: <span>Multi-level log queries</span>, including project, workload, Pod, container and keywords, supports drilling into each level to locate the issues.
        - content: <span>Support multiple log collection platforms</span>, such as Elasticsearch, Kafka, Fluentd
        - content: <span>Service component monitoring</span> for user to quickly locate component failures
    
    - title: Flexible Alerting and Notification
      image: /images/observability/flexible-alerting-and-notification.png
      contentList:
        - content: <span>Rich alerting rules</span> based on multi-tenancy and multi-dimensional monitoring metrics
        - content: <span>Flexible alerting policy</span> allows you to customize an alerting policy that contains multiple alerting rules
        - content: Multi-level monitoring metrics for alerting, including from infrastructure to workloads.
        - content: <span>Flexible alerting rules</span> allows you to customize the detection period, duration and alerting priority of monitoring metrics
        - content: <span>Integration with AlertManager</span>, support multiple notification channels (in v3.0.0)

section3:
  title: See Cloud Native Observability in KubeSphere
  image: /images/service-mesh/15.jpg
  content: Want to get started in action by following with the hands-on lab?
  btnContent: Start Hands-on Lab
  link:
  bgLeft: /images/service-mesh/3-2.svg
  bgRight: /images/service-mesh/3.svg
---