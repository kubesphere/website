---
title: "Pod Settings"
keywords: 'KubeSphere, Kubernetes, image, workload, setting, container'
description: 'Learn different properties on the dashboard in detail as you set Pods for your workload.'
linkTitle: "Pod Settings"
weight: 10280
version: "v3.4"
---

When you create Deployments, StatefulSets or DaemonSets, you need to specify a Pod. At the same time, KubeSphere provides users with various options to customize workload configurations, such as health check probes, environment variables and start commands. This page illustrates detailed explanations of different properties in **Pod Settings**.

{{< notice tip >}}

You can enable **Edit YAML** in the upper-right corner to see corresponding values in the manifest file (YAML format) of properties on the dashboard.

{{</ notice >}}

## Pod Settings

### Pod Replicas

Set the number of replicated Pods by clicking <img src="/images/docs/v3.x/project-user-guide/application-workloads/container-image-settings/plus-icon.png" width="20px" alt="icon" /> or <img src="/images/docs/v3.x/project-user-guide/application-workloads/container-image-settings/minus-icon.png" width="20px" alt="icon" />, indicated by the `.spec.replicas` field in the manifest file. This option is not available for DaemonSets.

If you create Deployments in a multi-cluster project, select a replica scheduling mode under **Replica Scheduling Mode**:

- **Specify Replicas**: select clusters and set the number of Pod replicas in each cluster.
- **Specify Weights**: select clusters, set the total number of Pod replicas in **Total Replicas**, and specify a weight for each cluster. The Pod replicas will be proportionally scheduled to the clusters according to the weights. To change weights after a Deployment is created, click the name of the Deployment to go to its details page and change weights under **Weights** on the **Resource Status** tab.

If you create StatefulSets in a multi-cluster project, select clusters and set the number of Pod replicas in each cluster under **Pod Replicas**.

### Add Container

Click **Add Container** to add a container.

#### Image Search Box

You can click <img src="/images/docs/v3.x/project-user-guide/application-workloads/container-image-settings/cube-icon.png" width="20px" alt="icon" /> on the right to select an image from the list or enter an image name to search it. KubeSphere provides Docker Hub images and your private image repository. If you want to use your private image repository, you need to create an Image Registry Secret first in **Secrets** under **Configuration**.

{{< notice note >}} 

Remember to press **Enter** on your keyboard after you enter an image name in the search box.

{{</ notice >}} 

#### Image Tag

You can enter a tag like `imagename:tag`. If you do not specify it, it will default to the latest version.

#### Container Name

The container name is automatically created by KubeSphere, which is indicated by `.spec.containers.name`.

#### Container Type

If you choose **Init container**, it means the init container will be created for the workload. For more information about init containers, please visit [Init Containers](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/?spm=a2c4g.11186623.2.19.16704b3e9qHXPb).

#### Resource Request

The resource quota reserved by the container includes both CPU and memory resources. It means the container monopolizes the resource, preventing other services or processes from competing for resources due to insufficient resources, causing the application to become unavailable.

- The CPU request is indicated by `.spec.containers[].resources.requests.cpu` in the manifest file. The CPU request can be exceeded.
- The memory request is indicated by `.spec.containers[].resources.requests.memory` in the manifest file. The memory request can be exceeded but the container may clear up when node memory is insufficient.

#### Resource Limit

You can specify the upper limit of the resources that the application can use, including CPU, memory, and GPU, to prevent excessive resources from being occupied.

- The CPU limit is indicated by `.spec.containers[].resources.limits.cpu` in the manifest file. The CPU limit can be exceeded for a short time, and the container will not be stopped.
- The memory limit is indicated by `.spec.containers[].resources.limits.memory` in the manifest file. The memory limit cannot be exceeded. If it exceeds, the container may be stopped or scheduled to another machine with sufficient resources.

{{< notice note >}}

The CPU resource is measured in CPU units, or **Core** in KubeSphere. The memory resource is measured in bytes, or **MiB** in KubeSphere.

{{</ notice >}} 

To set **GPU Type**, select a GPU type from the drop-down list, which defaults to `nvidia.com/gpu`. **GPU Limit** defaults to no limit.

#### **Port Settings**

You need to set the access protocol for the container as well as port information. To use the default setting, click **Use Default Ports**.

#### **Image Pull Policy**

This value is indicated by the `imagePullPolicy` field. On the dashboard, you can choose one of the following three options from the drop-down list.

- **Use Local Image First**: It means that the image is pulled only if it does not exist locally.

- **Pull Image Always**: It means that the image is pulled whenever the pod starts.

- **Use Local Image Only**: It means that the image is not pulled no matter the image exists or not.

{{< notice tip>}}

- The default value is **Use Local Image First**, but the value of images tagged with `:latest` is **Pull Image Always** by default.
- Docker will check it when pulling the image. If MD5 has not changed, it will not pull.
- The `:latest` tag should be avoided as much as possible in the production environment, and the latest image can be automatically pulled by the `:latest` tag in the development environment.

{{< /notice >}}

#### **Health Check**

Support liveness check, readiness check, and startup check.

- **Liveness Check**: Liveness probes are used to know whether a container is running, indicated by `livenessProbe`.

- **Readiness Check**: Readiness probes are used to know whether a container is ready to serve requests, indicated by `readinessProbe`.

- **Startup Check**: Startup probes are used to know whether a container application has started, indicated by `startupProbe`.

Liveness, Readiness and Startup Check include the configurations below:

- **HTTP Request**: Perform an HTTP `Get` request on the specified port and path on the IP address of the container. If the response status code is greater than or equal to 200 and less than 400, the diagnosis is considered successful. The supported parameters include:

  - **Path**: HTTP or HTTPS, specified by `scheme`, the path to access the HTTP server, specified by `path`, the access port or port name is exposed by the container. The port number must be between 1 and 65535. The value is specified by `port`.
  - **Initial Delay (s)**: The number of seconds after the container has started before liveness probes are initiated, specified by `initialDelaySeconds`. It defaults to 0.
  - **Check Interval (s)**: The probe frequency (in seconds), specified by `periodSeconds`. It defaults to 10. The minimum value is 1.
  - **Timeout (s)**: The number of seconds after which the probe times out, specified by `timeoutSeconds`. It defaults to 1. The minimum value is 1.
  - **Success Threshold**: The minimum consecutive successes for the probe to be considered successful after having failed, specified by `successThreshold`. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
  - **Failure Threshold**: The minimum consecutive failures for the probe to be considered failed after having succeeded, specified by `failureThreshold`. It defaults to 3. The minimum value is 1.

- **TCP Port**: Perform a TCP check on the specified port on the IP address of the container. If the port is open, the diagnosis is considered successful. The supported parameters include:
  
  - **Port**: The access port or port name is exposed by the container. The port number must be between 1 and 65535. The value is specified by `port`.
  - **Initial Delay (s)**: The number of seconds after the container has started before liveness probes are initiated, specified by `initialDelaySeconds`. It defaults to 0.
  - **Check Interval (s)**: The probe frequency (in seconds), specified by `periodSeconds`. It defaults to 10. The minimum value is 1.
  - **Timeouts**: The number of seconds after which the probe times out, specified by `timeoutSeconds`. It defaults to 1. The minimum value is 1.
  - **Success Threshold**: The minimum consecutive successes for the probe to be considered successful after having failed, specified by `successThreshold`. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
  - **Failure Threshold**: The minimum consecutive failures for the probe to be considered failed after having succeeded, specified by `failureThreshold`. It defaults to 3. The minimum value is 1.
  
- **Command**: Execute the specified command in the container. If the return code is 0 when the command exits, the diagnosis is considered successful. The supported parameters include:
  
  - **Command**: A detection command used to detect the health of the container, specified by `exec.command`.
  - **Initial Delay (s)**: The number of seconds after the container has started before liveness probes are initiated, specified by `initialDelaySeconds`. It defaults to 0.
  - **Check Interval (s)**: The probe frequency (in seconds), specified by `periodSeconds`. It defaults to 10. The minimum value is 1.
  - **Timeouts**: The number of seconds after which the probe times out, specified by `timeoutSeconds`. It defaults to 1. The minimum value is 1.
  - **Success Threshold**: The minimum consecutive successes for the probe to be considered successful after having failed, specified by `successThreshold`. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
  - **Failure Threshold**: The minimum consecutive failures for the probe to be considered failed after having succeeded, specified by `failureThreshold`. It defaults to 3. The minimum value is 1.

 For more information about health checks, please visit [Container Probes](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

#### **Start Command**

By default, a container runs the default image command.

- **Command** refers to the `command` field of containers in the manifest file.
- **Parameters** refers to the `args` field of containers in the manifest file.

For more information about the command, please visit [Define a Command and Arguments for a Container](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/).

#### **Environment Variables**

Configure environment variables for Pods in the form of key-value pairs.

- name: The name of the environment variable, specified by `env.name`.
- value: The value of the variable referenced, specified by `env.value`.
- Click **From configmap** or **From secret** to use an existing ConfigMap or Secret.

For more information about the command, please visit [Pod variable](https://kubernetes.io/docs/tasks/inject-data-application/environment-variable-expose-pod-information/?spm=a2c4g.11186623.2.20.16704b3e9qHXPb).

#### **Container Security Context**

A security context defines privilege and access control settings for a Pod or Container. For more information about the security context, please visit [Pod Security Policies](https://kubernetes.io/docs/concepts/policy/pod-security-policy/).

#### **Synchronize Host Timezone**

The time zone of the container will be consistent with that of the host after synchronization.

## **Update Strategy**

### Pod Update

Update strategies are different for different workloads.

{{< tabs >}}

{{< tab "Deployments" >}}

The `.spec.strategy` field specifies the strategy used to replace old Pods with new ones. `.spec.strategy.type` can be `Recreate` or `Rolling Update`. `Rolling Update` is the default value.

- **Rolling Update (recommended)**

  A rolling update means the instance of the old version will be gradually replaced with new ones. During the upgrade process, the traffic will be load balanced and distributed to the old and new instances simultaneously, so the service will not be interrupted.

- **Simultaneous Update**

  All existing Pods will be killed before new ones are created. Please note that the service will be interrupted during the update process.

For more information about update strategies, please visit [Strategy in Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy).

{{</ tab >}}

{{< tab "StatefulSets" >}}

The drop-down menu under **Update Strategy** is indicated by the `.spec.updateStrategy` field of a StatefulSet in the manifest file. It allows you to handle updates of Pod containers, tags, resource requests or limits, and annotations. There are two strategies:

- **Rolling Update (recommended)**

  If `.spec.template` is updated, the Pods in the StatefulSet will be automatically deleted with new pods created as replacements. Pods are updated in reverse ordinal order, sequentially deleted and created. A new Pod update will not begin until the previous Pod becomes up and running after it is updated.

- **Update on Deletion**

  If `.spec.template` is updated, the Pods in the StatefulSet will not be automatically updated. You need to manually delete old Pods so that the controller can create new Pods.

For more information about update strategies, please visit [StatefulSet Update Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#update-strategies).

{{</ tab >}}

{{< tab "DaemonSets" >}}

The drop-down menu under **Update Strategy** is indicated by the `.spec.updateStrategy` field of a DaemonSet in the manifest file. It allows you to handle updates of Pod containers, tags, resource requests or limits, and annotations. There are two strategies:

- **Rolling Update (recommended)**

  If `.spec.template` is updated, old DaemonSet pods will be killed with new pods created automatically in a controlled fashion. At most one pod of the DaemonSet will be running on each node during the whole update process.

- **Update on Deletion**

  If `.spec.template` is updated, new DaemonSet pods will only be created when you manually delete old DaemonSet pods. This is the same behavior of DaemonSets in Kubernetes version 1.5 or before.

For more information about update strategies, please visit [DaemonSet Update Strategy](https://kubernetes.io/docs/tasks/manage-daemon/update-daemon-set/#daemonset-update-strategy).

{{</ tab >}}

{{</ tabs >}}

### Rolling Update Settings

{{< tabs >}}

{{< tab "Deployments" >}}

**Rolling Update Settings** in a Deployment is different from that of a StatefulSet.

- **Maximum Unavailable Pods**: The maximum number of Pods that can be unavailable during the update, specified by `maxUnavailable`. The default value is 25%.
- **Maximum Extra Pods**: The maximum number of Pods that can be scheduled above the desired number of Pods, specified by `maxSurge`. The default value is 25%.

{{</ tab >}}

{{< tab "StatefulSets" >}}

**Ordinal for Dividing Pod Replicas**: When you partition an update, all Pods with an ordinal greater than or equal to the value you set in Partition are updated when you update the StatefulSet’s Pod specification. This field is specified by `.spec.updateStrategy.rollingUpdate.partition`, whose default value is 0. For more information about partitions, please visit [Partitions](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#partitions).

{{</ tab >}}

{{< tab "DaemonSets" >}}

**Rolling Update Settings** in a DaemonSet is different from that of a StatefulSet.

- **Maximum Unavailable Pods**: The maximum number of pods that can be unavailable during the update, specified by `maxUnavailable`. The default value is 20%.
- **Minimum Running Time for Pod Readiness (s)**: The minimum number of seconds before a newly created Pod of DaemonSet is treated as available, specified by `minReadySeconds`. The default value is 0.

{{</ tab >}}

{{</ tabs >}}

### Pod Security Context

A security context defines privilege and access control settings for a Pod or Container. For more information about Pod Security Policies, please visit [Pod Security Policies](https://kubernetes.io/docs/concepts/policy/pod-security-policy/).

### Pod Scheduling Rules

You can select different deployment modes to switch between inter-pod affinity and inter-pod anti-affinity. In Kubernetes, inter-pod affinity is specified as field `podAffinity` of field `affinity` while inter-pod anti-affinity is specified as field `podAntiAffinity` of field `affinity`. In KubeSphere, both `podAffinity` and `podAntiAffinity` are set to `preferredDuringSchedulingIgnoredDuringExecution`. You can enable **Edit YAML** in the upper-right corner to see field details.

- **Decentralized Scheduling** represents anti-affinity.
- **Centralized Scheduling** represents affinity.
- **Custom Rules** is to add custom scheduling rules based on your needs.

For more information about affinity and anti-affinity, please visit [Pod affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).
