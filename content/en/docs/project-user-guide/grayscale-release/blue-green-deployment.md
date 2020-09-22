---
title: "Blue-green Deployment"
keywords: 'KubeSphere, kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Blue-green Deployment'

linkTitle: "Blue-green Deployment"
weight: 2130
---


The blue-green release provides a zero downtime deployment, which means the new version can be deployed with the old one preserved. At any time, only one of the version is active serving all the traffic, while the other one remains idle. If there is a problem with running, you can quickly roll back to the old version

![](/images/service-mesh/blue-green-0.png)


## Before you begin

Firstly, you shoud enable the service-mesh plugin, to make the istio component available by following the document [Requirements](../../../pluggable-components/service-mesh/).

## Create Grayscale Release Job

Create blue-green deployment job:

![](/images/service-mesh/blue-green-1.jpg)

![](/images/service-mesh/blue-green-2.jpg)

![](/images/service-mesh/blue-green-3.jpg)

Then add 2 Deployments, one for each version (v1 and v2):

> Notice, the image now is `v2`.

![](/images/service-mesh/blue-green-4.jpg)


Now, you should choose one version to take over all the traffic:

![](/images/service-mesh/blue-green-5.jpg)

After a short time, we can see v2 take on all actual requests:
![](/images/service-mesh/blue-green-6.jpg)


Also, you can directly get the virtualservice to identify the weight:

```
# kubectl -n test get virtualservice -oyaml
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
          subset: v2
        weight: 100
        ...
```

## At The Last

After implementing the blue-green deployment, and the results meet your expectation, now you can take the task offline and the version v1 will be removed.

![](/images/service-mesh/blue-green-7.jpg)

