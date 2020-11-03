---
title: "Canary Release"
keywords: 'KubeSphere, kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Canary Release'

linkTitle: "Canary Release"
weight: 2130
---


One of the benefits of the Istio project is that it provides the control needed to deploy canary services. The idea behind canary deployment is to introduce a new version of a service by first testing it using a small percentage of user traffic, and then if all goes well, increase, possibly gradually in increments, the percentage while simultaneously phasing out the old version. If anything goes wrong along the way, we abort and rollback to the previous version. In its simplest form, the traffic sent to the canary version is a randomly selected percentage of requests, but in more sophisticated schemes it can be based on the region, user, or other properties of the request.

This method brings part of the actual traffic into a new version to test its performance and reliability. It can help detect potential problems in the actual environment while not affecting the overall system stability.

![](/images/service-mesh/canary-release-0.png)

## Before you begin

Firstly, you shoud enable the service-mesh plugin, to make the istio component available by following the document [Requirements](../../../pluggable-components/service-mesh/).

## Create Canary Release Job

Create canary release job:

![](/images/service-mesh/canary-release-1.jpg)

![](/images/service-mesh/canary-release-2.jpg)

![](/images/service-mesh/canary-release-3.jpg)

Then add 2 Deployments, one for each version (v1 and v2):

> Notice, the image now is `v2`.

![](/images/service-mesh/canary-release-4.jpg)

You can forward by traffic ratio, also, you can forward by request content, such as `Http Header` 、`Cookie`、`URI` and so on.

Now, we forward by traffic ratio, each version loads half of the total traffic:

![](/images/service-mesh/canary-release-5.jpg)

After a short time, we can see the actual requests almost approach the traffic ratio:

![](/images/service-mesh/canary-release-6.jpg)

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
        subset: v1
      weight: 50
    - destination:
        host: reviews
        port:
          number: 9080
        subset: v2
      weight: 50
      ...
```
## At The Last

After implementing the canary release deployment, if the new version has no problem, you can set the new version to take over all the traffic, or you can rollback to the old version. 

After choosing the correct version, now you can take the task offline and the other version will be removed.


![](/images/service-mesh/canary-release-7.jpg)
