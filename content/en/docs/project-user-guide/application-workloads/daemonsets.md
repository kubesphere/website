---
title: "DaemonSets"
keywords: 'kubesphere, kubernetes, docker, devops, service mesh, openpitrix'
description: 'Kubernetes DaemonSets'


weight: 2250
---

A DaemonSet ensures that all (or some) Nodes run a copy of a Pod. As nodes are added to the cluster, Pods are added to them. There are some typical uses of a DaemonSet as following:

Running a logs collection daemon on every node, such as Fluentd or Logstash.
Running a node monitoring daemon on every node, such as Prometheus Node Exporter, collectd, AppDynamics Agent,
Running a cluster storage daemon and system program on every node, such as Glusterd, Ceph, kube-dns, kube-proxy, etc.

## Prerequisites

- You need to create a workspace, project and `project-regular` account. Please refer to the [Getting Started with Multi-tenant Management](../../../quick-start/create-workspace-and-project) if not yet.
- You need to sign in with `project-admin` account and invite `project-regular` to enter the corresponding project if not yet. Please refer to [Invite Member](../../../quick-start/create-workspace-and-project#task-3-create-a-project).

## Create a DaemonSet

### Step 1: Click Create

 Into **Workloads**, choose **DaemonSets** and click **Create**

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets.png)

### Step 2: Input Base Data

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_1.png)

### Step 3: Input Container Data

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_2.png)

#### Step 3.1: Container Setting

Click the **Add Container Image** area.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_2_container_btn.png)

You can input an image name to use the image from public Docker Hub or select an image from a private repository you want to use.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_2_container_1.png)

- **Image Name**

  You can click the cube icon or input the image name to search it. KubeSphere provides Docker Hub images and your private image repository. If you want to use your private image repository, you should create a Docker Hub secret first in **Secrets** under **Configurations**.

- **Image Tag**

  You can input tag like `imagename:tag`, If you do not specify, it will default to the latest version.

- **Container Type**

  Choose Init Container, which means the init container will be created for the workload. For more information about init containers, please visit [Init Container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/?spm=a2c4g.11186623.2.19.16704b3e9qHXPb)

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_2_container_2.png)

- **Resource Request**

  The resource quota reserved by the container includes both CPU and memory resources. It means the container monopolizes the resource, preventing other services or processes from competing for resources due to insufficient resources, causing the application to become unavailable.

  - CPU Request is `spec.containers[].resources.requests.cpu`. The CPU request can be exceeded.
  - Memory Request is `spec.containers[].resource.memory`. The Memory request can be exceeded but the container may clear up when Node memory is insufficient

- **Resource Limit**

  You can specify the upper limit of the resources that the application can use, including CPU and memory, to prevent excessive resources from being occupied. Among them, the unit of CPU resource is Core, and the unit is Mi

  - CPU Limit is `spec.containers[].resources.limits.cpu`. The CPU limit can be exceeded for a short time, and the container will not be stopped.
  - Memory Limit is `spec.containers[].resources.limits.memory`. The Memory Limit can not be exceeded. If it exceeds, the container may be stopped or scheduled to another machine with sufficient resources

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_2_container_3.png)

- **Image Pull Policy**
  - Use Local Image First (**ifNotPresent**): It means that pull the image only if it does not exist locally.
  - Redownload Image (**Always**): It means that pull the image whenever the pod is started.
  - Only Use Local Image  (**Never**): It means that whatever the image is exist or not, it doesn't pull.

  {{< notice tip>}}

  - Default is **IfNotPresent**, but the image tag with `:latest` is default **Always**.
  - Docker will check it when pulling the image, if MD5 has not changed, it will not pull.
  - The `:latest` should be avoided as much as possible in the production environment, and the latest image can be automatically pulled by the `:latest` in the development environment.

  {{< /notice >}}

- **Health Checker**

  Support **liveness**, **Readiness**, and **Startup**. The survival check is used to detect when to restart the container.

  - `livenessProbe`：Indicates whether the container is running
  - `readinessProbe`：Indicates whether the container is ready to serve the request
  - `startupProbe`: Indicates whether the application in the container has been started

  Both of liveness, Readiness, and Startup have included these configs:

  - **HTTPGetAction**: Perform an HTTP Get request on the specified port and path on the IP address of the container. If the response status code is greater than or equal to 200 and less than 400, the diagnosis is considered successful. The supported parameters include:
    - **Scheme**：HTTP/HTTPS。
    - **Path**: The path to access the HTTP server.
    - **Port**: The access port or port name is exposed by the container. The port number must be between 1 and 65535.
    - **Initial Delays**: is `initialDelaySeconds`. The number of seconds after the container has started before liveness probes are initiated, the default is 0 seconds.
    - **Period Seconds**: is `periodSeconds`.
      Probe frequency (in seconds), which defaults to 10 seconds. The minimum value is 1.
    - **Timeouts**: is `timeoutSeconds`. Number of seconds after which the probe times out. It defaults to 1 second and the minimum value is 1.
    - **Success Threshold**: is `successThreshold`. Minimum consecutive successes for the probe to be considered successful after having failed. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
    - **Failure Threshold**: is `failureThreshold`. Minimum consecutive failures for the probe to be considered failed after having succeeded. It defaults to 3 and the minimum value is 1.

  - **TCPSocketAction**: Perform a TCP check on the specified port on the IP address of the container. If the port is open, the diagnosis is considered successful. The supported parameters include:
    - **Port**: The access port or port name is exposed by the container. The port number must be between 1 and 65535.
    - **Initial Delays**: is `initialDelaySeconds`. The number of seconds after the container has started before liveness probes are initiated, the default is 0 seconds.
    - **Period Seconds**: is `periodSeconds`.
      Probe frequency (in seconds), which defaults to 10 seconds. The minimum value is 1.
    - **Timeouts**: is `timeoutSeconds`. Number of seconds after which the probe times out. It defaults to 1 second and the minimum value is 1.
    - **Success Threshold**: is `successThreshold`. Minimum consecutive successes for the probe to be considered successful after having failed. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
    - **Failure Threshold**: is `failureThreshold`. Minimum consecutive failures for the probe to be considered failed after having succeeded. It defaults to 3 and the minimum value is 1.

  - **ExecAction**: Execute the specified command in the container. If the return code is 0 when the command exits, the diagnosis is considered successful. The supported parameters include:
    - **Command**: is `exec.command`. A detection command used to detect the health of the container.
    - **Initial Delays**: is `initialDelaySeconds`. The number of seconds after the container has started before liveness probes are initiated, the default is 0 seconds.
    - **Period Seconds**: is `periodSeconds`.
      Probe frequency (in seconds), which defaults to 10 seconds. The minimum value is 1.
    - **Timeouts**: is `timeoutSeconds`. Number of seconds after which the probe times out. It defaults to 1 second and the minimum value is 1.
    - **Success Threshold**: is `successThreshold`. Minimum consecutive successes for the probe to be considered successful after having failed. It defaults to 1 and must be 1 for liveness and startup. The minimum value is 1.
    - **Failure Threshold**: is `failureThreshold`. Minimum consecutive failures for the probe to be considered failed after having succeeded. It defaults to 3 and the minimum value is 1.

   For more information about health checks, please visit [Container Probes](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

- **Start Command**

  By default, the container runs the default image command.

  - Run Command is the `command` of containers.
  - Parameters are the `args` of containers.

  For more information about the command, please visit [Container Command](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/).

- **Environment Variables**

  Supports configuring environment variables for Pod in the form of key-value pairs.

  - name：Set the name of the environment variable.
  - value：Set the value of the variable reference.
  - type：Set the type of environment variables, support customization, configuration items, keys, and variable/variable references.

  For more information about the command, please visit [Pod variable](https://kubernetes.io/docs/tasks/inject-data-application/environment-variable-expose-pod-information/?spm=a2c4g.11186623.2.20.16704b3e9qHXPb).

- **Container Security Context**

  A security context defines privilege and access control settings for a Pod or Container. For more information about the security context, please visit [Pod Security Policies](https://kubernetes.io/docs/concepts/policy/pod-security-policy/).

- **Sync Host Timezone**

  The time zone of the container will be consistent with that of the host after synchronization.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_2_container_finish.png)

#### Step3.2: Other Setting

- **Update Strategy**

  The `.spec.updateStrategy` field of DaemonSet allows you to configure and disable automatic scrolling update Pod containers, tags, resource requests or restrictions, and annotations.

  - **RollingUpdate (Recommended)**

    If `.spec.template` is updated, old DaemonSet pods will be killed with new pods created automatically in a controlled fashion. At most one pod of the DaemonSet will be running on each node during the whole update process.

  - **OnDelete**

    If `.spec.template` is updated, new DaemonSet pods will only be created when you manually delete old DaemonSet pods. This is the same behavior of DaemonSet in Kubernetes version 1.5 or before.

  For more information about the update strategy, please visit [Update-Strategies](https://kubernetes.io/docs/tasks/manage-daemon/update-daemon-set/#daemonset-update-strategy).

- **The number of Pods when updated**

  - **The maximum unavailable number of Pods**: The maximum number of pods that can be unavailable during the update. The default value is 20%.
  - **MinReadySeconds**: Specifies the minimum number of seconds before a newly created Pod of DaemonSet is treated as available. The default value is 0.

{{<notice tip>}}
The number of Pods when updated in DaemonSets is different from StatefulSet.
{{</ notice>}}

- **Pod Security Context**

  A security context defines privilege and access control settings for a Pod or Container. For more information about Pod Security Policies, please visit [Pod Security Policies](https://kubernetes.io/docs/concepts/policy/pod-security-policy/).

- **Deployment Mode**

  You can select different deployment modes to switch between inter-pod affinity and inter-pod anti-affinity. In Kubernetes, inter-pod affinity is specified as field `podAffinity` of field `affinity` while inter-pod anti-affinity is specified as field `podAntiAffinity` of field `affinity`. In KubeSphere, both `podAffinity` and `podAntiAffinity` are set to `preferredDuringSchedulingIgnoredDuringExecution`. You can enable **Edit Mode** in the top right corner to see field details.

  - **Pod Decentralized Deployment** represents anti-affinity.
  - **Pod Aggregation Deployment** represents affinity.

  For more information about affinity and anti-affinity, please visit  [Pod affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

### Step 4: Input Volumes Data

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_3.png)

Mount Volume has 3 methods:

`volumeClaimTemplates`.

- **Add Volume**: Support EmptyDir and PersistentVolumeClaim.

  In **Add Volume** there are 3 kinds of volumes:

  - **Existing Volume**: Use *PVC* to mount.

    Persistent storage volumes can be used to save user's persist data, Add Existing Volume means you need to create volumes in advance

  - **Temporary Volume**: Use *emptyDir* to mount.

    The temporary storage volume represents [emptyDir](https://kubernetes.cn/docs/concepts/storage/volumes/#emptydir), which is first created when a Pod is assigned to a Node, and exists as long as that Pod is running on that node. When a Pod is removed from a node for any reason, the data in the emptyDir is deleted forever.

  - **HostPath**: Use *HostPath* to mount.

    A HostPath volume mounts a file or directory from the host node's filesystem into your Pod. This is not something that most Pods will need, but it offers a powerful escape hatch for some applications.

- **Mount ConfigMap or Secret**: Supports for configuring the key-value pairs ​​in ConfigMap or Secret via reference configuration center.

  A secret volume is used to pass sensitive information, such as passwords, to Pods. Secret volumes are backed by tmpfs (a RAM-backed filesystem) so they are never written to non-volatile storage.

  ConfigMap is used to store configuration data in the form of key-value pairs. The configMap resource provides a way to inject configuration data into Pods. The data stored in a ConfigMap object can be referenced in a volume of type configMap and then consumed by containerized applications running in a Pod.

  - Set the value of the environment variable
  - Set command parameters in the container
  - Create a config file in the volume

For more information about volume, please visit [Volumes](../../storage/volumes)

### Step 5: Input Advanced Data

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_form_4.png)

- **Add Metadata**

  Additional metadata settings for resources such as **Labels** and **Annotations**.

## Check DaemonSet Detail

You can check the DaemonSet detail by clicking the DaemonSet's name in the list.

### DaemonSet Operations

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_list.png)

Click the three dots on the right and select the operation from the menu to modify a DaemonSet.

- **Edit**：View and edit the base data.
- **Edit Yaml**：View, upload, download, or update the YAML file。
- **Redeploy**：Redeploy this DaemonSet.
- **Delete**: Delete the DaemonSet.

### DaemonSet Detail View

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_detail.png)


#### DaemonSet Detail Operations

You can click **More** to display what the operations about this DaemonSet you can do.

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_detail_operation_btn.png)

- **Revision Rollback**: Select the revision to rollback.
- **Edit Config Template**：Set some config about Update Strategy, Container and Volume.
- **Edit YAML**：View, upload, download, or update the YAML file。
- **Redeploy**: Redeploy this DaemonSet.
- **Delete**: Delete the DaemonSet, and return to the DaemonSet list page.

#### Resource Status

![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_detail_state.png)

- **Replica Status**: You cannot change the number of Pod replicas for a DaemonSet, which defaults to 2.
- **Pods detail**

  ![daemonsets](/images/docs/project-user-guide/workloads/daemonsets_detail_pod.png)

  - The pod list provides the pod’s detail information(conditions, phase, node, pod ip, monitoring).
  - You can view the container info by clicking the pod item.
  - Click the container log icon to view the output logs of the container.
  - You can view the pod detail page by clicking the pod name.

#### Revision Records

After the resource template of workload is changed, a new log will be generated and Pods will be rescheduled for a version update. The latest 10 versions will be saved by default. You can implement a redeployment based on the change log.
