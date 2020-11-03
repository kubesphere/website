---
title: "Traffic Mirroring"
keywords: 'KubeSphere, kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Traffic Mirroring'

linkTitle: "Traffic Mirroring"
weight: 2130
---

Traffic mirroring, also called shadowing, is a powerful concept that allows feature teams to bring changes to production with as little risk as possible. Mirroring sends a copy of live traffic to a mirrored service. The mirrored traffic happens out of band of the critical request path for the primary service.

It provides a more accurate way to test new versions as problems can be detected in advance while not affecting the production environment. Therefore, it serves as a more secure and reliable method for version releases.


## Before you begin

Firstly, you shoud enable the service-mesh plugin, to make the istio component available by following the document [Requirements](../../../pluggable-components/service-mesh/).

## Create Traffic Mirroring Job

Create traffic mirroring job:

![](/images/service-mesh/traffic-mirroring-1.jpg)

![](/images/service-mesh/traffic-mirroring-2.jpg)

![](/images/service-mesh/traffic-mirroring-3.jpg)

Then add 2 Deployments, one for each version (v1 and v2):

> Notice, the image now is `v2`.

![](/images/service-mesh/traffic-mirroring-4.jpg)

![](/images/service-mesh/traffic-mirroring-6.jpg)

Also, you can directly get the virtualservice to identify the mirror and weight:

```
# kubectl -n test get virtualservice reviews -oyaml

...
spec:
  hosts:
  - reviews
  http:
  - route:
    - destination:
        host: reviews
        port:
          number: 9080
        subset: v1
      weight: 100
    mirror:
      host: reviews
      port:
        number: 9080
      subset: v2
      ...
```

This route rule sends 100% of the traffic to v1. The last stanza specifies that you want to mirror to the reviews:v2 service. When traffic gets mirrored, the requests are sent to the mirrored service with their Host/Authority headers appended with -shadow. For example, cluster-1 becomes cluster-1-shadow.

Also, it is important to note that these requests are mirrored as “fire and forget”, which means that the responses are discarded.

You can use the weight field to mirror a fraction of the traffic, instead of mirroring all requests. If this field is absent, for compatibility with older versions, all traffic will be mirrored.

![](/images/service-mesh/traffic-mirroring-7.jpg)