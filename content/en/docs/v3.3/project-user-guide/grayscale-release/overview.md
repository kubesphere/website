---
title: "Grayscale Release — Overview"
keywords: 'Kubernetes, KubeSphere, grayscale release, overview, service mesh'
description: 'Understand the basic concept of grayscale release.'
linkTitle: "Overview"
weight: 10510
version: "v3.3"
---

Modern, cloud-native applications are often composed of a group of independently deployable components, also known as microservices. In a microservices architecture, developers are able to make adjustments to their apps with great flexibility as they do not affect the network of services each performing a specific function. This kind of network of microservices making up an application is also called **service mesh**.

A KubeSphere service mesh, built on the open-source project of [Istio](https://istio.io/), controls how different parts of an app interact with one another. Among others, grayscale release strategies represent an important part for users to test and release new app versions without affecting the communication among microservices.

## Grayscale Release Strategies

A grayscale release in KubeSphere ensures smooth transition as you upgrade your apps to a new version. The specific strategy adopted may be different but the ultimate goal is the same - identify potential problems in advance without affecting your apps running in the production environment. This not only minimizes risks of a version upgrade but also tests the performance of new app builds.

KubeSphere provides users with three grayscale release strategies.

### [Blue-green Deployment](../blue-green-deployment/)

A blue-green deployment provides an efficient method of releasing new versions with zero downtime and outages as it creates an identical standby environment where the new app version runs. With this approach, KubeSphere routes all the traffic to either version. Namely, only one environment is live at any given time. In the case of any issues with the new build, it allows you to immediately roll back to the previous version.

### [Canary Release](../canary-release/)

A canary deployment reduces the risk of version upgrades to a minimum as it slowly rolls out changes to a small subset of users. More specifically, you have the option to expose a new app version to a portion of production traffic, which is defined by yourself on the highly responsive dashboard. Besides, KubeSphere gives you a visualized view of real-time traffic as it monitors requests after you implement a canary deployment. During the process, you can analyze the behavior of the new app version and choose to gradually increase the percentage of traffic sent to it. Once you are confident of the build, you can route all the traffic to it.

### [Traffic Mirroring](../traffic-mirroring/)

Traffic mirroring copies live production traffic and sends it to a mirrored service. By default, KubeSphere mirrors all the traffic while you can also manually define the percentage of traffic to be mirrored by specifying a value. Common use cases include:

- Test new app versions. You can compare the real-time output of mirrored traffic and production traffic.
- Test clusters. You can use production traffic of instances for cluster testing.
- Test databases. You can use an empty database to store and load data.

{{< notice note >}}

The current KubeSphere version does not support grayscale release strategies for multi-cluster apps.

{{</ notice >}} 
