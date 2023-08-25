---
title: "Helm 规范"
keywords: 'Kubernetes, KubeSphere, Helm, 规范'
description: '了解 Chart 结构和规范。'
linkTitle: "Helm 规范"
weight: 14420
---

Helm Chart 是一种打包格式。Chart 是一个描述一组 Kubernetes 相关资源的文件集合。有关更多信息，请参见 [Helm 文档](https://helm.sh/zh/docs/topics/charts/)。

## 结构

Chart 的所有相关文件都存储在一个目录中，该目录通常包含：

```text
chartname/
  Chart.yaml          # 包含 Chart 基本信息（例如版本和名称）的 YAML 文件。
  LICENSE             # （可选）包含 Chart 许可证的纯文本文件。
  README.md           # （可选）应用说明和使用指南。
  values.yaml         # 该 Chart 的默认配置值。
  values.schema.json  # （可选）向 values.yaml 文件添加结构的 JSON Schema。
  charts/             # 一个目录，包含该 Chart 所依赖的任意 Chart。
  crds/               # 定制资源定义。
  templates/          # 模板的目录，若提供相应值便可以生成有效的 Kubernetes 配置文件。
  templates/NOTES.txt # （可选）包含使用说明的纯文本文件。
```

## Chart.yaml 文件

您必须为 Chart 提供 `chart.yaml` 文件。下面是一个示例文件，每个字段都有说明。 

```yaml
apiVersion: （必需）Chart API 版本。 
name: （必需）Chart 名称。
version: （必需）版本，遵循 SemVer 2 标准。 
kubeVersion: （可选）兼容的 Kubernetes 版本，遵循 SemVer 2 标准。
description: （可选）对应用的一句话说明。
type: （可选）Chart 的类型。
keywords:
  - （可选）关于应用的关键字列表。
home: （可选）应用的 URL。
sources:
  - （可选）应用源代码的 URL 列表。
dependencies: （可选）Chart 必要条件的列表。
  - name: Chart 的名称，例如 nginx。
    version: Chart 的版本，例如 "1.2.3"。
    repository: 仓库 URL ("https://example.com/charts") 或别名 ("@repo-name")。
    condition: （可选）解析为布尔值的 YAML 路径，用于启用/禁用 Chart （例如 subchart1.enabled）。
    tags: （可选）
      - 用于将 Chart 分组，一同启用/禁用。
    import-values: （可选）
      - ImportValues 保存源值到待导入父键的映射。每一项可以是字符串或者一对子/父子列表项。
    alias: （可选）Chart 要使用的别名。当您要多次添加同一个 Chart 时，它会很有用。
maintainers: （可选）
  - name: （必需）维护者姓名。
    email: （可选）维护者电子邮件。
    url: （可选）维护者 URL。
icon: （可选）要用作图标的 SVG 或 PNG 图片的 URL。
appVersion: （可选）应用版本。不需要是 SemVer。
deprecated: （可选，布尔值）该 Chart 是否已被弃用。
annotations:
  example: （可选）按名称输入的注解列表。
```

{{< notice note >}}

- `dependencies` 字段用于定义 Chart 依赖项，`v1` Chart 的依赖项都位于单独文件 `requirements.yaml` 中。有关更多信息，请参见 [Chart 依赖项](https://helm.sh/zh/docs/topics/charts/#chart-dependency)。
- `type` 字段用于定义 Chart 的类型。允许的值有 `application` 和 `library`。有关更多信息，请参见 [Chart 类型](https://helm.sh/zh/docs/topics/charts/#chart-types)。

{{</ notice >}} 

## Values.yaml 和模板

Helm Chart 模板采用 [Go 模板语言](https://golang.org/pkg/text/template/)编写并存储在 Chart 的 `templates` 文件夹。有两种方式可以为模板提供值：

1. 在 Chart 中创建一个包含可供引用的默认值的 `values.yaml` 文件。
2. 创建一个包含必要值的 YAML 文件，通过在命令行使用 `helm install` 命令来使用该文件。

下面是 `templates` 文件夹中模板的示例。

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{.Values.imageRegistry}}/postgres:{{.Values.dockerTag}}
          imagePullPolicy: {{.Values.pullPolicy}}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{default "minio" .Values.storage}}
```

上述示例在 Kubernetes 中定义 ReplicationController 模板，其中引用的一些值已在 `values.yaml` 文件中进行定义。

- `imageRegistry`：Docker 镜像仓库。
- `dockerTag`：Docker 镜像标签 (tag)。
- `pullPolicy`：镜像拉取策略。
- `storage`：存储后端，默认为 `minio`。

下面是 `values.yaml` 文件的示例：

```text
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

## 参考

[Helm 文档](https://helm.sh/zh/docs/)

[Chart](https://helm.sh/zh/docs/topics/charts/)

