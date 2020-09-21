---
title: "Services"
keywords: 'kubesphere, kubernetes, docker, jobs'
description: 'Create a Kubernetes Job'


weight: 2060
---

## What is the Service

An abstract way to expose an application running on a set of Pods as a network service.
With Kubernetes, you don't need to modify your application to use an unfamiliar service discovery mechanism. Kubernetes gives Pods their IP addresses and a single DNS name for a set of Pods, and can load-balance across them.

## How to create a Service

![create_service_type](/images/docs/project-user-guide/workloads/create_service_type.png)

Create a service that has these methods in the Kubesphere: Stateless Service, Stateful Service, and External Service. what's more you can custom creation through **Specify Workloads** and **Edit by YAML**.

*There are some information you should know:*

- The value of `annotations:kubesphere.io/serviceType` keywords is one of them **statelessservice** , **statefulservice** , **externalservice** and **None**.
- Different types of Service you created could create a different workload that it may be a **Deployment**, **StatefulSet**, or **DaemonSet** at moment.

if you want to get more information about the stateful, you should visit [StatefulSet](../statefulsets/)

## This is a demo to create a **Stateless Service**

### Step 1: click the **Create** button, choose Stateless Service

![services_lists](/images/docs/project-user-guide/workloads/services_lists.png)

![stateless_form](/images/docs/project-user-guide/workloads/stateless_form.png)

### Step 2: input base info

![stateless_form_1](/images/docs/project-user-guide/workloads/stateless_form_1.png)

These are the YAML config keywords which display in the form label

| Label       | Key                                    |
| ----------- | -------------------------------------- |
| Name        | metadata.name                          |
| Version     | apiVersion                             |
| Alias       | annotations.kubesphere.io\/alias-name  |
| Description | annotations.kubesphere.io\/description |

{{< notice tip >}}

**Name** have named two configs, `Deployment` and `Service`.

{{</ notice>}}

``` yaml
kind: Deployment
metadata:
  labels:
    version: v1
    app: xxx
  name: xxx-v1
spec:
  selector:
    matchLabels:
      version: v1
      app: xxx
  template:
    metadata:
      labels:
        version: v1
        app: xxx
---
kind: Service
metadata:
  labels:
    version: v1
    app: xxx
  name: xxx
spec:
    metadata:
      labels:
        version: v1
        app: xxx
```

### Step 3: Input Container Image

#### 3.1 Input data exclude Container

In this step, you can know some configs exclude the container config which has more configs.

![stateless_form_2.png](/images/docs/project-user-guide/workloads/stateless_form_2.png)

These are the YAML config keywords which display in the form label

| Label                                  | key                      |
| -------------------------------------- | ------------------------ |
| Pod Replicas                           | replicas                 |
| Update Strategy                        | strategy.type            |
| The number of Pods when updated        | rollingUpdate            |
| The maximum unavailable number of Pods | maxUnavailable           |
| The maximum surge number of Pods       | maxSurge                 |
| Pod Security Context                   | securityContext          |
| run as non root                        | runAsNonRoot             |
| User                                   | runAsUser                |
| Group                                  | runAsGroup               |
| seLinuxOptions                         | seLinuxOptions           |
| Level                                  | level                    |
| Role                                   | role                     |
| Type                                   | type                     |
| User                                   | user                     |
| Pod Aggregation Deployment             | affinity.podAntiAffinity |

#### 3.2 input Container info

In this step, you can know Container configs.

Click **Add Container Image**

![stateless_form_2_add_container](/images/docs/project-user-guide/workloads/stateless_form_2_container_1_add.png)
![stateless_form_2_container_1](/images/docs/project-user-guide/workloads/stateless_form_2_container_1_input.png)

these are the YAML config keywords which display in the form label

- Container

    | label          | key        |
    | -------------- | ---------- |
    | Image          | image      |
    | Container Name | name       |
    | Container Type | containers |

![stateless_form_2_container_2](/images/docs/project-user-guide/workloads/stateless_form_2_container_2.png)

- Resources

  | label             | key               |
  | ----------------- | ----------------- |
  | Resources Request | resources.request |
  | Resources limit   | resources.limits  |
  | Service Settings  | ports             |
  | PullImages        | imagePullPolicy   |

![stateless_form_2_container_3](/images/docs/project-user-guide/workloads/stateless_form_2_container_3.png)

- Health Check

    | label                     | key            |
    | ------------------------- | -------------- |
    | Container Liveness Check  | livenessProbe  |
    | Container Readiness Check | readinessProbe |
    | Container Startup Check   | startupProbe   |

- Start Command

    | label       | key     |
    | ----------- | ------- |
    | Run Command | command |
    | Parameters  | args    |

- Environment Variables

    | label                 | key   |
    | --------------------- | ----- |
    | Environment Variables | env   |
    | Run Command           | name  |
    | Parameters            | value |

- Container Security Context

    | label                      | key                      |
    | -------------------------- | ------------------------ |
    | Container Security Context | securityContext          |
    | AllowPrivilegeEscalation   | allowPrivilegeEscalation |
    | ReadOnlyRootFilesystem     | readOnlyRootFilesystem   |
    | Privileged                 | privileged               |
    | run as non root            | runAsNonRoot             |
    | User                       | runAsUser                |
    | Group                      | runAsGroup               |
    | seLinuxOptions             | seLinuxOptions           |
    | Level                      | level                    |
    | Role                       | role                     |
    | Type                       | type                     |
    | User                       | user                     |
    | Capabilities (Beta)        | capabilities             |
    | add                        | add                      |
    | drop                       | drop                     |

when you click the **check** button, the container has added in the list

![stateless_form_2_container_item](/images/docs/project-user-guide/workloads/stateless_form_2_container_item.png)

and you can also click **delete icon** or **editor icon** to operate it,


### Step 4: input Volume

![stateless_form_3](/images/docs/project-user-guide/workloads/stateless_form_3.png)

#### 4.1 choose the Volume

![stateless_form_3_volume](/images/docs/project-user-guide/workloads/stateless_form_3_volume.png)

{{< notice tip >}}

you can get more information in [volumes](../../storage/volumes/)

{{</ notice >}}

#### 4.2 choose the Mount ConfigMap or Secret

![stateless_form_3_volume_configmap](/images/docs/project-user-guide/workloads/stateless_form_3_volume_configmap.png)

{{< notice tip >}}

you can get more information in [configmaps](../../configuration/configmaps)

{{</ notice >}}

### Step 5: input Advanced Settings

![stateless_form_4](/images/docs/project-user-guide/workloads/stateless_form_4.png)

these are the YAML config keywords which display in the form label

| Advanced Setting            |                                               |
| --------------------------- | --------------------------------------------- |
| Access Method               | type                                          |
| Maximum Session Sticky Time | sessionAffinityConfig.clientIP.timeoutSeconds |
| Set Node Scheduling Policy  | spec.nodeSelector                             |
| Add Metadata                | label is metadata.annotations                 |

### Step 6: finish

![stateless_finish](/images/docs/project-user-guide/workloads/services_lists_finish.png)

now the Stateless Service has created, you can click it to view more information about it.also you can click`more icon` to operate this service item include edit config and delete.

## Service Internet Access

- ClusterIP: Exposes the Service on a cluster-internal IP. Choosing this value makes the Service only reachable from within the cluster. This is the default ServiceType.

- NodePort: Exposes the Service on each Node's IP at a static port (the NodePort). A ClusterIP Service, to which the NodePort Service routes, is automatically created. You'll be able to contact the NodePort Service, from outside the cluster, by requesting `<NodeIP>:<NodePort>`.

- LoadBalancer: Exposes the Service externally using a cloud provider's load balancer. NodePort and ClusterIP Services, to which the external load balancer routes, are automatically created.

- ExternalName: Maps the Service to the contents of the `externalName` field (e.g. foo.bar.example.com), by returning a CNAME record

## Editor Internet Access

![stateless_Internet_Access](/images/docs/project-user-guide/workloads/stateless_form_internetAccess.png)

Now you know how to create a service in kubesphere，and you could custom your own service in more configs.
if you want to get more information about [Service](https://kubernetes.io/docs/concepts/services-networking/service/), you can click it, Thank you.
