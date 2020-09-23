---
title: "StatefulSets"
keywords: 'kubesphere, kubernetes, StatefulSets, dashboard, service'
description: 'Kubernetes StatefulSets'


weight: 2240
---

## What is the Statefulset

StatefulSet is the workload API object used to manage stateful applications.

Manages the deployment and scaling of a set of Pods, and provides guarantees about the ordering and uniqueness of these Pods.

Like a Deployment, a StatefulSet manages Pods that are based on an identical container spec. Unlike a Deployment, a StatefulSet maintains a sticky identity for each of their Pods. These pods are created from the same spec, but are not interchangeable: each has a persistent identifier that it maintains across any rescheduling.

If you want to use storage volumes to provide persistence for your workload, you can use a StatefulSet as part of the solution. Although individual Pods in a StatefulSet are susceptible to failure, the persistent Pod identifiers make it easier to match existing volumes to the new Pods that replace any that have failed.

## Using StatefulSets

StatefulSets are valuable for applications that require one or more of the following.

- Stable, unique network identifiers.
- Stable, persistent storage.
- Ordered, graceful deployment, and scaling.
- Ordered, automated rolling updates.

## Create a StatefulSets

In the kubesphere, when creating a StatefulSets, a Handless service is also created. When you had created, you can go to services to find it.

### Step 1: Click Create

 Into **Workloads**, choose **StatefulSets** and Click **Create**

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets.png)

### Step 2: Input Base Data

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_1.png)

### Step 3: Input Container Data

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_2.png)

#### Step 3.1: Container Setting

Click the **Add Container Image** area.

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_2_container_btn.png)

you can input or select the image which in the public docker hub or private image repository you want to use.

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_2_container_1.png)

- **Image Name**

  you can click the icon or input the image name to search it. kubesphere provide the Dockerhub image and your private image repository. If you want to use your private image repository, you should create a docker hub secret first in **Configurations** **Secrets**

- **Image Tag**

  you can input tag like `imagename:tag`, If you do not specify, it will default to the latest version.

- **container type**

  choose Init Container，It means that to create the Init Container。 For more information about Init Container, please visit [Init Container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/?spm=a2c4g.11186623.2.19.16704b3e9qHXPb)

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_2_container_2.png)

- **Resource Request**

  The resource quota reserved by the container includes both CPU and memory resources. That is the container monopolizes the resource, preventing other services or processes from competing for resources due to insufficient resources, causing the application to become unavailable.

- **Resource Limit**

  You can specify the upper limit of the resources that the application can use, including CPU and memory, to prevent excessive resources from being occupied. Among them, the unit of CPU resource is Core, and the unit is Mi

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_2_container_3.png)

- **image pull policy**
  - Use local image first (**ifNotPresent**): If the image exists locally, the local image is used, and the image is pulled when the local does not exist.
  - Always pull the image (**Always**): It means that the image will be pulled from the container mirroring service every time it is deployed or expanded, instead of pulling the image locally.
  - Only use a local image (**Never**): Only use a local image.

- **Health checkers**

    Support liveness and Readiness. The survival check is used to detect when to restart the container. For more information about health checks, please visit [Configure Liveness, Readiness, and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/?spm=a2c4g.11186623.2.23.16704b3e9qHXPb)。

  - **HTTP** request is to send an HTTP get a request to the container. The supported parameters include:
    - **Scheme**：HTTP/HTTPS。
    - **Path**: The path to access the HTTP server.
    - **Port**: The access port or port name is exposed by the container. The port number must be between 1 and 65535.
    - **Initial Delays**: is `initialDelaySeconds`. The number of seconds after the container has started before liveness probes are initiated, the default is 0 seconds.
    - **Period Seconds**: is `periodSeconds`.
      Probe frequency (in seconds), which defaults to 10 seconds. The minimum value is 1.
    - **Timeouts**: is `timeoutSeconds`. Number of seconds after which the probe times out. It defaults to 1 second and the minimum value is 1.
    - **Success Threshold**: is `successThreshold`. Minimum consecutive successes for the probe to be considered successful after having failed. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
    - **Failure Threshold**: is `failureThreshold`. Minimum consecutive failures for the probe to be considered failed after having succeeded. It defaults to 3 and the minimum value is 1.

  - **TCP** uses a TCP socket. With this configuration, the kubelet will attempt to open a socket to your container on the specified port. If it can establish a connection, the container is considered healthy, if it can't it is considered a failure. The supported parameters include:
    - **Port**: The access port or port name is exposed by the container. The port number must be between 1 and 65535.
    - **Initial Delays**: is `initialDelaySeconds`. The number of seconds after the container has started before liveness probes are initiated, the default is 0 seconds.
    - **Period Seconds**: is `periodSeconds`.
      Probe frequency (in seconds), which defaults to 10 seconds. The minimum value is 1.
    - **Timeouts**: is `timeoutSeconds`. Number of seconds after which the probe times out. It defaults to 1 second and the minimum value is 1.
    - **Success Threshold**: is `successThreshold`. Minimum consecutive successes for the probe to be considered successful after having failed. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
    - **Failure Threshold**: is `failureThreshold`. Minimum consecutive failures for the probe to be considered failed after having succeeded. It defaults to 3 and the minimum value is 1.

  - **Commands** detects the health of the container by executing probe detection commands in the container. The supported parameters include:
    - **Command**：is `exec.command`. A detection command used to detect the health of the container.
    - **Initial Delays**: is `initialDelaySeconds`. The number of seconds after the container has started before liveness probes are initiated, the default is 0 seconds.
    - **Period Seconds**: is `periodSeconds`.
      Probe frequency (in seconds), which defaults to 10 seconds. The minimum value is 1.
    - **Timeouts**: is `timeoutSeconds`. Number of seconds after which the probe times out. It defaults to 1 second and the minimum value is 1.
    - **Success Threshold**: is `successThreshold`. Minimum consecutive successes for the probe to be considered successful after having failed. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
    - **Failure Threshold**: is `failureThreshold`. Minimum consecutive failures for the probe to be considered failed after having succeeded. It defaults to 3 and the minimum value is 1.

- **Start Command**

  By default, the container runs the default image command. For more information about the command, please visit [Container Command](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/).

  - Run Command is the `command` of containers.
  - Parameters are the `args` of containers.

- **Environment Variables**

  Supports configuring environment variables for Pod in the form of key-value pairs. For more information about the command, please visit [Pod variable](https://kubernetes.io/docs/tasks/inject-data-application/environment-variable-expose-pod-information/?spm=a2c4g.11186623.2.20.16704b3e9qHXPb)。

  - name：Set the name of the environment variable.
  - value：Set the value of the variable reference.
  - type：Set the type of environment variables, support customization, configuration items, keys, and variable/variable references.

- **Container Security Context**

  A security context defines privilege and access control settings for a Pod or Container. [Pod Security Policies](https://kubernetes.io/docs/concepts/policy/pod-security-policy/).

- **Sync Host Timezone**

  The time zone of the container will be consistent with that of the host after synchronization.

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_2_container_finish.png)

#### Step3.2: Other Setting

- **Update Strategy**

  The `.spec.updateStrategy` field of StatefulSet allows you to configure and disable automatic scrolling update Pod containers, tags, resource requests or restrictions, and annotations.For more information about update strategy, please visit [Statefulset Update-Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#update-strategies).

  - RollingUpdate (Recommended)
  - OnDelete

- **The number of Pods when updated**

  The Partitions is mean which pods you want to update through the rolling update. It specifying by `.spec.updateStrategy.rollingUpdate.partition`. The default is 0. For more information about Partitions, please visit [Partitions](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#partitions).

- **Pod Security Context**

  A security context defines privilege and access control settings for a Pod or Container. For more information about Pod Security Policies, please visit [Pod Security Policies](https://kubernetes.io/docs/concepts/policy/pod-security-policy/).

- **Deployment Mode**

  Select different deployment modes to change the affinity and anti-affinity of the inter-pod. In k8s, the affinity is used `podAffinity` and the anti-affinity is used `podAntiAffinity`. [Pod affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

  - Pod Decentralized Deployment is mean anti-affinity
  - Pod Aggregation Deployment is mean affinity

### Step 4: Input Volumes Data

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_3.png)

StatefulSets can use the volume template, but you should create it in **Storage** before. For more information about volume, please visit [Volumes](../../storage/volumes)

### Step 5: Input Advanced Data

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_form_4.png)

- **Set Node Scheduling Policy**

  You can allow Pod replicas to run on specified nodes. It is used `nodeSelector`.

- **Add Metadata**

  Additional metadata settings for resources such as **Labels** and **Annotations**.

## Operate Stateful

![statefulsets](/images/docs/project-user-guide/workloads/statefulsets_list.png)

You can click **More** to display what other operations about this Statefulset you can do.

- Edit：you can edit the base data.
- Edit Yaml：you can upload, download, or update the YAML file。
- Redeploy：you can redeploy this Statefulset.
- Delete: you can delete this Statefulset.

