---
title: "Logging"
keywords: 'Kubernetes, KubeSphere, API, Logging'
description: 'Logging'


weight: 17310
---

The API changes of logging component in KubeSphere v3.0.0.

## Time format

The time format for query parameters must be in Unix timestamp, which is the number of seconds that has elapsed since the Unix epoch. Millisecond is no longer allowed. The change affects the parameters `start_time` and `end_time`.

## Deprecated APIs

The following APIs are removed:

- GET  /workspaces/{workspace}
- GET  /namespaces/{namespace}
- GET  /namespaces/{namespace}/workloads/{workload}
- GET  /namespaces/{namespace}/pods/{pod}
- The whole log setting API group

## Fluent Bit Operator

In KubeSphere 3.0.0, the whole log setting APIs are removed from the KubeSphere core since the project Fluent Bit Operator is refactored in an incompatible way. Please refer to [Fluent Bit Operator docs](https://github.com/kubesphere/fluentbit-operator) for how to configure log collection in KubeSphere 3.0.0.