---
title: "service mesh"
layout: "scenario"

css: "scss/scenario.scss"

section1:
  title: KubeSphere Service Mesh provides a simpler distribution of Istio with consolidated UX.
  content: If you’re running and scaling microservices on Kubernetes, it’s time to adopt the istio-based service mesh for your distributed system. We design a unified UI to integrate and manage tools including Istio, Envoy and Jaeger.
  image: /images/service-mesh/banner.jpg

image: /images/service-mesh/service-mesh.jpg
bg: /images/service-mesh/28.svg

section2:
  title: What Makes KubeSphere Service Mesh Special
  list:
    - title: Traffic Management
      image: /images/service-mesh/traffic-management.png
      summary:
      contentList:
        - content: <span>Canary release</span> provides canary rollouts and staged rollouts with percentage-based traffic splits
        - content: <span>Blue-green deployment</span> allows the new version of the application to be deployed in the green environment and tested for functionality and performance
        - content: <span>Traffic mirroring</span> enables teams to bring changes to production with as few risks as possible
        - content: <span>Circuit breakers</span> allow users to set limits for calls to individual hosts within a service

    - title: Visualization
      image: /images/service-mesh/visualization.png
      summary: Observability is extremely useful in understanding cloud-native microservice interconnections. KubeSphere has the ability to visualize the connections between microservices and the topology of how they interconnect.
      contentList:

    - title: Distributed Tracing
      image: /images/service-mesh/distributed-tracing.png
      summary: Based on Jaeger, KubeSphere enables users to track how each service interacts with other services. It brings a deeper understanding about request latency, bottlenecks, serialization and parallelism via visualization.
      contentList:

section3:
  title: See KubeSphere Service Mesh In Action
  videoLink: https://www.youtube.com/embed/EkGWtwcsdE4
  content: Want to get started in action by following the hands-on lab?
  btnContent: Start Hands-on Lab
  link: https://kubesphere.io/docs/pluggable-components/service-mesh/
  bgLeft: /images/service-mesh/3-2.svg
  bgRight: /images/service-mesh/3.svg
---
