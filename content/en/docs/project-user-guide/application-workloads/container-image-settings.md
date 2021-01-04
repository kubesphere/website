---
title: "Container Image Settings"
keywords: 'KubeSphere, Kubernetes, image, workload, setting, container'
description: 'How to set container images in KubeSphere.'

weight: 10280
---

When you create Deployments, StatefulSets or DaemonSets, you need to specify a container image. At the same time, KubeSphere provides users with various options to customize workload configurations, such as health check probes, environment variables and start commands. This page illustrates detailed explanations of different properties in **Container Image**.

{{< notice tip >}}

You can enable **Edit Mode** in the top right corner to see corresponding values in the manifest file (YAML format) of properties on the dashboard.

{{</ notice >}}

## Container Image

### Pod Replicas

Set the number of replicated Pods by clicking the **plus** or **minus** icon, indicated by the `.spec.replicas` field in the manifest file. This option is not available for DaemonSets.

![pod-replicas](/images/docs/project-user-guide/workloads/pod-replicas.jpg)

### Add Container Image

After you click **Add Container Image**, you will see an image as below.

![add-container-explan](/images/docs/project-user-guide/workloads/add-container-explan.jpg)

#### Image Search Bar

You can click the cube icon on the right to select an image from the list or input an image name to search it. KubeSphere provides Docker Hub images and your private image repository. If you want to use your private image repository, you need to create an Image Registry Secret first in **Secrets** under **Configurations**.

{{< notice note >}} 

Remember to press **Enter** on your keyboard after you input an image name in the search bar.

{{</ notice >}} 

#### Image Tag

You can input a tag like `imagename:tag`. If you do not specify it, it will default to the latest version.

#### Container Name

The container name is automatically created by KubeSphere, which is indicated by `.spec.containers.name`.

#### Container Type

If you choose **Init Container**, it means the init container will be created for the workload. For more information about init containers, please visit [Init Containers](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/?spm=a2c4g.11186623.2.19.16704b3e9qHXPb).

#### Resource Request

The resource quota reserved by the container includes both CPU and memory resources. It means the container monopolizes the resource, preventing other services or processes from competing for resources due to insufficient resources, causing the application to become unavailable.

- The CPU request is indicated by `.spec.containers[].resources.requests.cpu` in the manifest file. The CPU request can be exceeded.
- The memory request is indicated by `.spec.containers[].resources.requests.memory` in the manifest file. The memory request can be exceeded but the container may clear up when node memory is insufficient.

![resource-request-limit](/images/docs/project-user-guide/workloads/resource-request-limit.jpg)

#### Resource Limit

You can specify the upper limit of the resources that the application can use, including CPU and memory, to prevent excessive resources from being occupied.

- The CPU limit is indicated by `.spec.containers[].resources.limits.cpu` in the manifest file. The CPU limit can be exceeded for a short time, and the container will not be stopped.
- The memory limit is indicated by `.spec.containers[].resources.limits.memory` in the manifest file. The memory limit cannot be exceeded. If it exceeds, the container may be stopped or scheduled to another machine with sufficient resources.

{{< notice note >}}

The CPU resource is measured in CPU units, or **Core** in KubeSphere. The memory resource is measured in bytes, or **Mi** in KubeSphere.

{{</ notice >}} 

#### **Port/Service Settings**

You need to set the access protocol for the container as well as port information. To use the default setting, click **Use Default Ports**.

#### **Image Pull Policy**

This value is indicated by the `imagePullPolicy` field. On the dashboard, you can choose one of the following three options from the drop-down list.

![image-pull-policy](/images/docs/project-user-guide/workloads/image-pull-policy.jpg)

- **Use Local Image First (ifNotPresent)**: It means that the image is pulled only if it does not exist locally.

- **Redownload Image (Always)**: It means that the image is pulled whenever the pod starts.

- **Only Use Local Image  (Never)**: It means that the image is not pulled no matter the image exists or not.

{{< notice tip>}}

- The default value is `IfNotPresent`, but the value of images tagged with `:latest` is `Always` by default.
- Docker will check it when pulling the image. If MD5 has not changed, it will not pull.
- The `:latest` should be avoided as much as possible in the production environment, and the latest image can be automatically pulled by the `:latest` in the development environment.

{{< /notice >}}

#### **Health Checker**

Support **Liveness**, **Readiness**, and **Startup**.

![container-health-check](/images/docs/project-user-guide/workloads/container-health-check.jpg)

- **Container Liveness Check**: Liveness probes are used to know whether a container is running, indicated by `livenessProbe`.

- **Container Readiness Check**: Readiness probes are used to know whether a container is ready to serve requests, indicated by `readinessProbe`.

- **Container Startup Check**: Startup probes are used to know whether a container application has started, indicated by `startupProbe`.

Liveness, Readiness and Startup Check have all included the configurations below:

- **HTTPGetAction (HTTP Request Check)**: Perform an HTTP `Get` request on the specified port and path on the IP address of the container. If the response status code is greater than or equal to 200 and less than 400, the diagnosis is considered successful. The supported parameters include:

  ![http-request-check](/images/docs/project-user-guide/workloads/http-request-check.jpg)

  - **Scheme**: HTTP or HTTPS, specified by `scheme`.
  - **Path**: The path to access the HTTP server, specified by `path`.
  - **Port**: The access port or port name is exposed by the container. The port number must be between 1 and 65535. The value is specified by `port`.
  - **Initial Delays**: The number of seconds after the container has started before liveness probes are initiated, specified by `initialDelaySeconds`. It defaults to 0.
  - **Period Seconds**: The probe frequency (in seconds), specified by `periodSeconds`. It defaults to 10. The minimum value is 1.
  - **Timeouts**: The number of seconds after which the probe times out, specified by `timeoutSeconds`. It defaults to 1. The minimum value is 1.
  - **Success Threshold**: The minimum consecutive successes for the probe to be considered successful after having failed, specified by `successThreshold`. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
  - **Failure Threshold**: The minimum consecutive failures for the probe to be considered failed after having succeeded, specified by `failureThreshold`. It defaults to 3. The minimum value is 1.

- **TCPSocketAction (TCP Port Check)**: Perform a TCP check on the specified port on the IP address of the container. If the port is open, the diagnosis is considered successful. The supported parameters include:
  
  ![tcp-port-check](/images/docs/project-user-guide/workloads/tcp-port-check.jpg)
  
  - **Port**: The access port or port name is exposed by the container. The port number must be between 1 and 65535. The value is specified by `port`.
  - **Initial Delays**: The number of seconds after the container has started before liveness probes are initiated, specified by `initialDelaySeconds`. It defaults to 0.
  - **Period Seconds**: The probe frequency (in seconds), specified by `periodSeconds`. It defaults to 10. The minimum value is 1.
  - **Timeouts**: The number of seconds after which the probe times out, specified by `timeoutSeconds`. It defaults to 1. The minimum value is 1.
  - **Success Threshold**: The minimum consecutive successes for the probe to be considered successful after having failed, specified by `successThreshold`. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
  - **Failure Threshold**: The minimum consecutive failures for the probe to be considered failed after having succeeded, specified by `failureThreshold`. It defaults to 3. The minimum value is 1.
  
- **ExecAction (Exec Command Check)**: Execute the specified command in the container. If the return code is 0 when the command exits, the diagnosis is considered successful. The supported parameters include:
  
  ![exec-command-check](/images/docs/project-user-guide/workloads/exec-command-check.jpg)
  
  - **Command**: A detection command used to detect the health of the container, specified by `exec.command`.
  - **Initial Delays**: The number of seconds after the container has started before liveness probes are initiated, specified by `initialDelaySeconds`. It defaults to 0.
  - **Period Seconds**: The probe frequency (in seconds), specified by `periodSeconds`. It defaults to 10. The minimum value is 1.
  - **Timeouts**: The number of seconds after which the probe times out, specified by `timeoutSeconds`. It defaults to 1. The minimum value is 1.
  - **Success Threshold**: The minimum consecutive successes for the probe to be considered successful after having failed, specified by `successThreshold`. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
  - **Failure Threshold**: The minimum consecutive failures for the probe to be considered failed after having succeeded, specified by `failureThreshold`. It defaults to 3. The minimum value is 1.

 For more information about health checks, please visit [Container Probes](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

#### **Start Command**

By default, the container runs the default image command.

![start-command](/images/docs/project-user-guide/workloads/start-command.jpg)

- **Run Command** refers to the `command` field of containers in the manifest file.
- **Parameters** refers to the `args` field of containers in the manifest file.

For more information about the command, please visit [Define a Command and Arguments for a Container](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/).

#### **Environment Variables**

Configure environment variables for Pods in the form of key-value pairs.

![envi-var](/images/docs/project-user-guide/workloads/envi-var.jpg)

- name: The name of the environment variable, specified by `env.name`.
- value: The value of the variable reference, specified by `env.value`.
- type: The type of environment variables. It supports customization, configuration items, keys, and variable/variable references.

For more information about the command, please visit [Pod variable](https://kubernetes.io/docs/tasks/inject-data-application/environment-variable-expose-pod-information/?spm=a2c4g.11186623.2.20.16704b3e9qHXPb).

#### **Container Security Context**

A security context defines privilege and access control settings for a Pod or Container. For more information about the security context, please visit [Pod Security Policies](https://kubernetes.io/docs/concepts/policy/pod-security-policy/).

![security-context](/images/docs/project-user-guide/workloads/security-context.jpg)

#### **Sync Host Timezone**

The time zone of the container will be consistent with that of the host after synchronization.

## **Update Strategy**

### Pod Update

Update strategies are different for different workloads.

{{< tabs >}}

{{< tab "Deployments" >}}

The `.spec.strategy` field specifies the strategy used to replace old Pods with new ones. `.spec.strategy.type` can be `Recreate` or `RollingUpdate`. `RollingUpdate` is the default value.

- **RollingUpdate (Recommended)**

  A rolling update means the instance of the old version will be gradually replaced with new ones. During the upgrade process, the traffic will be load balanced and distributed to the old and new instances simultaneously, so the service will not be interrupted.

- **Recreate**

  All existing Pods will be killed before new ones are created. Please note that the service will be interrupted during the update process.

For more information about update strategies, please visit [Strategy in Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy).

{{</ tab >}}

{{< tab "StatefulSets" >}}

The drop-down menu under **Update Strategy** is indicated by the `.spec.updateStrategy` field of a StatefulSet in the manifest file. It allows you to handle updates of Pod containers, tags, resource requests or limits, and annotations. There are two strategies:

- **RollingUpdate (Recommended)**

  If `.spec.template` is updated, the Pods in the StatefulSet will be automatically deleted with new pods created as replacements. Pods are updated in reverse ordinal order, sequentially deleted and created. A new Pod update will not begin until the previous Pod becomes up and running after it is updated.

- **OnDelete**

  If `.spec.template` is updated, the Pods in the StatefulSet will not be automatically updated. You need to manually delete old Pods so that the controller can create new Pods.

For more information about update strategies, please visit [StatefulSet Update Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#update-strategies).

{{</ tab >}}

{{< tab "DaemonSets" >}}

The drop-down menu under **Update Strategy** is indicated by the `.spec.updateStrategy` field of a DaemonSet in the manifest file. It allows you to handle updates of Pod containers, tags, resource requests or limits, and annotations. There are two strategies:

- **RollingUpdate (Recommended)**

  If `.spec.template` is updated, old DaemonSet pods will be killed with new pods created automatically in a controlled fashion. At most one pod of the DaemonSet will be running on each node during the whole update process.

- **OnDelete**

  If `.spec.template` is updated, new DaemonSet pods will only be created when you manually delete old DaemonSet pods. This is the same behavior of DaemonSets in Kubernetes version 1.5 or before.

For more information about update strategies, please visit [DaemonSet Update Strategy](https://kubernetes.io/docs/tasks/manage-daemon/update-daemon-set/#daemonset-update-strategy).

{{</ tab >}}

{{</ tabs >}}

### The Number of Pods When Updated

{{< tabs >}}

{{< tab "Deployments" >}}

**The number of Pods when updated** in a Deployment is different from that of a StatefulSet.

- **The maximum unavailable number of Pods**: The maximum number of Pods that can be unavailable during the update, specified by `maxUnavailable`. The default value is 25%.
- **The maximum surge number of Pods**: The maximum number of Pods that can be scheduled above the desired number of Pods, specified by `maxSurge`. The default value is 25%.

{{</ tab >}}

{{< tab "StatefulSets" >}}

When you partition an update, all Pods with an ordinal greater than or equal to the value you set in Partition are updated when you update the StatefulSet’s Pod specification. This field is specified by `.spec.updateStrategy.rollingUpdate.partition`, whose default value is 0. For more information about partitions, please visit [Partitions](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#partitions).

{{</ tab >}}

{{< tab "DaemonSets" >}}

**The number of Pods when updated** in a DaemonSet is different from that of a StatefulSet.

- **The maximum unavailable number of Pods**: The maximum number of pods that can be unavailable during the update, specified by `maxUnavailable`. The default value is 20%.
- **MinReadySeconds**: The minimum number of seconds before a newly created Pod of DaemonSet is treated as available, specified by `minReadySeconds`. The default value is 0.

{{</ tab >}}

{{</ tabs >}}

### Pod Security Context

A security context defines privilege and access control settings for a Pod or Container. For more information about Pod Security Policies, please visit [Pod Security Policies](https://kubernetes.io/docs/concepts/policy/pod-security-policy/).

### Deployment Mode

You can select different deployment modes to switch between inter-pod affinity and inter-pod anti-affinity. In Kubernetes, inter-pod affinity is specified as field `podAffinity` of field `affinity` while inter-pod anti-affinity is specified as field `podAntiAffinity` of field `affinity`. In KubeSphere, both `podAffinity` and `podAntiAffinity` are set to `preferredDuringSchedulingIgnoredDuringExecution`. You can enable **Edit Mode** in the top right corner to see field details.

- **Pod Decentralized Deployment** represents anti-affinity.
- **Pod Aggregation Deployment** represents affinity.

For more information about affinity and anti-affinity, please visit [Pod affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).
