---
title: "容器镜像设置"
keywords: 'KubeSphere, Kubernetes, 镜像, 工作负载, 设置, 容器'
description: '在为工作负载设置容器镜像时，详细了解仪表板上的不同属性。'

weight: 10280
---

创建部署、有状态副本集或者守护进程集时，您需要指定一个容器镜像。同时，KubeSphere 向用户提供多种选项，用于自定义工作负载配置，例如健康检查探针、环境变量和启动命令。本页内容详细说明了**容器镜像**中的不同属性。

{{< notice tip >}}

您可以在右上角启用**编辑模式**，查看仪表板上的属性对应到清单文件（YAML 格式）中的值。

{{</ notice >}}

## 容器镜像

### 容器组副本数量

点击**加号**或**减号**图标设置 Pod（即容器组）副本数量，该参数显示在清单文件中的 `.spec.replicas` 字段。该选项对守护进程集不可用。

![Pod 副本](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/pod-replicas.PNG)

### 添加容器镜像

点击**添加容器镜像**后，您会看到如下图所示的界面。

![添加容器镜像](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/add-container-explain.PNG)

#### 镜像搜索栏

您可以点击右边的立方形图标，从列表中选择一个镜像，或者输入镜像名称进行搜索。KubeSphere 提供 Docker Hub 的镜像以及您的私有镜像仓库的镜像。如果想使用私有镜像仓库，您需要先在**配置中心**下的**密钥**中创建镜像仓库密钥。

{{< notice note >}} 

在搜索栏输入镜像名称后，请记得按键盘上的**回车键**。

{{</ notice >}} 

#### 镜像标签

您可以输入一个标签，例如 `imagename:tag`。如果您不指定标签，则会默认为最新版本。

#### 容器名称

容器名称由 KubeSphere 自动创建，显示在 `.spec.containers.name` 中。

#### 容器类型

如果您选择**初始容器**，则会为该工作负载创建初始容器。有关初始容器的更多信息，请访问 [Init 容器](https://kubernetes.io/zh/docs/concepts/workloads/pods/init-containers/)。

#### 资源请求

容器预留的资源配额包括 CPU 和内存资源。这意味着容器独占这些资源，防止其他服务或进程因资源不足争夺资源而导致应用程序不可用。

- CPU 预留显示在清单文件中的 `.spec.containers[].resources.requests.cpu`，实际用量可以超过 CPU 预留。
- 内存预留显示在清单文件中的 `.spec.containers[].resources.requests.memory`。实际用量可以超过内存预留，但节点内存不足时可能会清理容器。

![资源预留和限制](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/resource-request-limit.PNG)

#### 资源限制

您可以指定应用程序能使用的资源上限，包括 CPU 和内存，防止占用过多资源。

- CPU 限制显示在清单文件中的 `.spec.containers[].resources.limits.cpu`。实际用量可以短时间超过 CPU 限制，容器不会被停止。
- 内存限制显示在清单文件中的 `.spec.containers[].resources.limits.memory`。实际用量不能超过内存限制，如果超过了，容器可能会被停止或者被调度到其他资源充足的机器上。

{{< notice note >}}

CPU 资源以 CPU 单位计量，即 KubeSphere 中的 **Core**。内存资源以字节计量，即 KubeSphere 中的 **Mi**。

{{</ notice >}} 

#### **端口/服务设置**

您需要为容器设置访问协议和端口信息。请点击**使用默认端口**以自动填充默认设置。

#### **镜像拉取策略**

该值显示在 `imagePullPolicy` 字段。在仪表板上，您可以从下拉列表的以下三个选项中选择一个。

![镜像拉取策略](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/image-pull-policy.PNG)

- **优先使用本地镜像 (ifNotPresent)**：只有本地不存在镜像时才会拉取镜像。

- **尝试重新下载镜像 (Always)**：只要启动 Pod 就会拉取镜像。

- **仅使用本地镜像 (Never)**：无论镜像是否存在都不会拉取镜像。

{{< notice tip>}}

- 默认值是 `IfNotPresent`，但标记为 `:latest` 的镜像的默认值是 `Always`。
- Docker 会在拉取镜像时进行检查，如果 MD5 值没有变，则不会拉取镜像。
- 在生产环境中应尽量避免使用 `:latest`，在开发环境中使用 `:latest` 会自动拉取最新的镜像。

{{< /notice >}}

#### **健康检查器**

支持**存活**、**就绪**和**启动**检查。

![容器健康检查](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/container-health-check.PNG)

- **容器存活检查**：使用存活探针检测容器是否在运行，该参数显示在 `livenessProbe` 字段。

- **容器就绪检查**：使用就绪探针检测容器是否准备好处理请求，该参数显示在 `readinessProbe` 字段。

- **容器启动检查**：使用启动探针检测容器应用程序是否已经启动，该参数显示在 `startupProbe` 字段。

存活、就绪和启动检查都包含以下配置：

- **HTTPGetAction（HTTP 请求检查）**：在容器 IP 地址的指定端口和路径上执行 HTTP `Get` 请求，如果响应状态码大于等于 200 且小于 400，则认为诊断成功。支持的参数包括：

  ![HTTP 请求检查](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/http-request-check.PNG)

  - **方案**：HTTP 或 HTTPS，由 `scheme` 指定。
  - **路径**：访问 HTTP 服务器的路径，由 `path` 指定。
  - **端口**：访问端口或端口名由容器暴露。端口号必须在 1 和 65535 之间。该值由 `port` 指定。
  - **初始延迟**：容器启动后，存活探针启动之前等待的秒数，由 `initialDelaySeconds` 指定。默认为 0。
  - **执行探测频率**：探测频率（以秒为单位），由 `periodSeconds` 指定。默认为 10，最小值为 1。
  - **超时时间**：探针超时的秒数，由 `timeoutSeconds` 指定。默认为 1，最小值为 1。
  - **健康阈值**：探测失败后，视为探测成功的最小连续成功次数，由 `successThreshold` 指定。默认为 1，存活探针和启动探针的该值必须为 1。最小值为 1。
  - **不健康阈值**：探测成功后，视为探测失败的最小连续失败次数，由 `failureThreshold` 指定。默认为 3，最小值为 1。

- **TCPSocketAction（TCP 端口检查）**：在容器 IP 地址的指定端口上执行 TCP 检查。如果该端口打开，则认为诊断成功。支持的参数包括：
  
  ![TCP 端口检查](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/tcp-port-check.PNG)
  
  - **端口**：访问端口或端口名由容器暴露。端口号必须在 1 和 65535 之间。该值由 `port` 指定。
  - **初始延迟**：容器启动后，存活探针启动之前等待的秒数，由 `initialDelaySeconds` 指定。默认为 0。
  - **执行探测频率**：探测频率（以秒为单位），由 `periodSeconds` 指定。默认为 10，最小值为 1。
  - **超时时间**：探针超时的秒数，由 `timeoutSeconds` 指定。默认为 1，最小值为 1。
  - **健康阈值**：探测失败后，视为探测成功的最小连续成功次数，由 `successThreshold` 指定。默认为 1，存活探针和启动探针的该值必须为 1。最小值为 1。
  - **不健康阈值**：探测成功后，视为探测失败的最小连续失败次数，由 `failureThreshold` 指定。默认为 3，最小值为 1。
  
- **ExecAction（执行命令检查）**：在容器中执行指定命令。如果命令退出时返回代码为 0，则认为诊断成功。支持的参数包括：
  
  ![执行命令检查](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/exec-command-check.PNG)
  
  - **命令**：用于检测容器健康状态的检测命令，由 `exec.command` 指定。
  - **初始延迟**：容器启动后，存活探针启动之前等待的秒数，由 `initialDelaySeconds` 指定。默认为 0。
  - **执行探测频率**：探测频率（以秒为单位），由 `periodSeconds` 指定。默认为 10，最小值为 1。
  - **超时时间**：探针超时的秒数，由 `timeoutSeconds` 指定。默认为 1，最小值为 1。
  - **健康阈值**：探测失败后，视为探测成功的最小连续成功次数，由 `successThreshold` 指定。默认为 1，存活探针和启动探针的该值必须为 1。最小值为 1。
  - **不健康阈值**：探测成功后，视为探测失败的最小连续失败次数，由 `failureThreshold` 指定。默认为 3，最小值为 1。

有关健康检查的更多信息，请访问[容器探针](https://kubernetes.io/zh/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

#### **启动命令**

默认情况下，容器会运行默认镜像命令。

![启动命令](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/start-command.PNG)

- **运行命令**对应清单文件中容器的 `command` 字段。
- **参数**对应清单文件中容器的 `args` 字段。

有关该命令的更多信息，请访问[为容器设置启动时要执行的命令和参数](https://kubernetes.io/zh/docs/tasks/inject-data-application/define-command-argument-container/)。

#### **环境变量**

以键值对形式为 Pod 配置环境变量。

![环境变量](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/envi-var.PNG)

- 名称：环境变量的名称，由 `env.name` 指定。
- 值：变量引用的值，由 `env.value` 指定。
- 类型：环境变量的类型，支持自定义、配置项、键以及变量或变量引用。

有关该命令的更多信息，请访问 [Pod 变量](https://kubernetes.io/zh/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)。

#### **容器组 Security Context**

Security Context 定义 Pod 或容器的特权和访问控制设置。有关 Security Context 的更多信息，请访问 [Pod 安全策略](https://kubernetes.io/zh/docs/concepts/policy/pod-security-policy/)。

![Security Context](/images/docs/zh-cn/project-user-guide/application-workloads/container-image-settings/security-context.PNG)

#### **同步主机时区**

同步后，容器的时区将和主机的时区一致。

## **更新策略**

### Pod 更新

不同工作负载使用不同的更新策略。

{{< tabs >}}

{{< tab "部署" >}}

`.spec.strategy` 字段指定用于用新 Pod 替换旧 Pod 的策略。`.spec.strategy.type` 可以是 `Recreate` 或 `RollingUpdate`。默认值是 `RollingUpdate`。

- **滚动更新（推荐）**

  滚动更新将逐步用新版本的实例替换旧版本的实例。升级过程中，流量会同时负载均衡分布到新老版本的实例上，因此服务不会中断。

- **替换升级**

  替换升级会先删除现有的 Pod，再创建新的 Pod。请注意，升级过程中服务会中断。

有关升级策略的更多信息，请访问[部署的策略部分](https://kubernetes.io/zh/docs/concepts/workloads/controllers/deployment/#strategy)。

{{</ tab >}}

{{< tab "有状态副本集" >}}

**更新策略**下的下拉菜单显示在清单文件中有状态副本集的 `.spec.updateStrategy` 字段。您可以处理 Pod 容器、标签、资源预留或限制以及注解的更新。有两种策略：

- **滚动更新（推荐）**

  如果 `.spec.template` 已更新，有状态副本集中的 Pod 将被自动删除，并创建新的 Pod 来替换。Pod 将按照反向顺序更新，依次删除和创建。前一个 Pod 更新完成并开始运行后，才会开始更新下一个新的 Pod。

- **删除容器组时更新**

  如果 `.spec.template` 已更新，有状态副本集中的 Pod 将不会自动更新。您需要手动删除旧的 Pod，控制器才会创建新的 Pod。

有关更新策略的更多信息，请访问[有状态副本集更新策略](https://kubernetes.io/zh/docs/concepts/workloads/controllers/statefulset/#update-strategies)。

{{</ tab >}}

{{< tab "守护进程集" >}}

**更新策略**下的下拉菜单显示在清单文件中守护进程集的 `.spec.updateStrategy` 字段。您可以处理 Pod 容器、标签、资源预留或限制以及注解的更新。有两种策略：

- **滚动更新（推荐）**

  如果 `.spec.template` 已更新，旧的守护进程集 Pod 将被终止，并以受控方式自动创建新的 Pod。整个更新过程中，每个节点上至多只有一个守护进程集的 Pod 运行。

- **删除容器组时更新**

  如果 `.spec.template` 已更新，只有当您手动删除旧的守护进程集 Pod 时才会创建新的守护进程集 Pod。这与 1.5 或之前版本 Kubernetes 中的守护进程集的操作行为相同。

有关更新策略的更多信息，请访问[守护进程集更新策略](https://kubernetes.io/zh/docs/tasks/manage-daemon/update-daemon-set/#daemonset-%E6%9B%B4%E6%96%B0%E7%AD%96%E7%95%A5)。

{{</ tab >}}

{{</ tabs >}}

### 更新时 Pod 数量

{{< tabs >}}

{{< tab "部署" >}}

部署中的**更新时容器组数量**与有状态副本集中的不同。

- **容器组最大不可用数量**：升级过程中允许不可用的 Pod 的最大数量，由 `maxUnavailable` 指定。默认值是 25%。
- **容器组最大超出数量**：可调度的超过期望数量的 Pod 的最大数量，由 `maxSurge` 指定。默认值是 25%。

{{</ tab >}}

{{< tab "有状态副本集" >}}

如果您对更新进行分区，当更新有状态副本集的 Pod 配置时，所有序号大于等于该分区序号值的 Pod 都会被更新。该字段由 `.spec.updateStrategy.rollingUpdate.partition` 指定，默认值是 0。有关分区的更多信息，请访问[分区](https://kubernetes.io/zh/docs/concepts/workloads/controllers/statefulset/#partitions)。

{{</ tab >}}

{{< tab "守护进程集" >}}

守护进程集中的**更新时容器组数量**与有状态副本集中的不同。

- **容器组最大不可用数量**：升级过程中允许不可用的 Pod 的最大数量，由 `maxUnavailable` 指定。默认值是 20%。
- **最小就绪时间**：新创建的守护进程集的 Pod 被视为可用之前的最少秒数，由 `minReadySeconds` 指定。默认值是 0。

{{</ tab >}}

{{</ tabs >}}

### 容器组 Security Context

Security Context 定义 Pod 或容器的特权和访问控制设置。有关 Pod Security Context 的更多信息，请访问 [Pod 安全策略](https://kubernetes.io/zh/docs/concepts/policy/pod-security-policy/)。

### 部署模式

您可以选择不同的部署模式，切换 Pod 间亲和与 Pod 间反亲和。在 Kubernetes 中，Pod 间亲和由 `affinity` 字段下的 `podAffinity` 字段指定，而 Pod 间反亲和由 `affinity` 字段下的 `podAntiAffinity` 字段指定。在 KubeSphere 中，`podAffinity` 和 `podAntiAffinity` 都设置为 `preferredDuringSchedulingIgnoredDuringExecution`。您可以在右上角启用**编辑模式**查看字段详情，

- **容器组分散部署**代表反亲和性。
- **容器组聚合部署**代表亲和性。

有关亲和性和反亲和性的更多信息，请访问 [Pod 亲和性](https://kubernetes.io/zh/docs/concepts/scheduling-eviction/assign-pod-node/#pod-%E9%97%B4%E4%BA%B2%E5%92%8C%E4%B8%8E%E5%8F%8D%E4%BA%B2%E5%92%8C)。
