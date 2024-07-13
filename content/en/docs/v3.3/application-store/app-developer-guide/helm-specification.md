---
title: "Helm Specifications"
keywords: 'Kubernetes, KubeSphere, Helm, specifications'
description: 'Understand the chart structure and specifications.'
linkTitle: "Helm Specifications"
weight: 14420
version: "v3.3"
---

Helm charts serve as a packaging format. A chart is a collection of files that describe a related set of Kubernetes resources. For more information, see the [Helm documentation](https://helm.sh/docs/topics/charts/).

## Structure

All related files of a chart is stored in a directory which generally contains:

```text
chartname/
  Chart.yaml          # A YAML file containing basic information about the chart, such as version and name.
  LICENSE             # (Optional) A plain text file containing the license for the chart.
  README.md           # (Optional) The description of the app and how-to guide.
  values.yaml         # The default configuration values for this chart.
  values.schema.json  # (Optional) A JSON Schema for imposing a structure on the values.yaml file.
  charts/             # A directory containing any charts upon which this chart depends.
  crds/               # Custom Resource Definitions.
  templates/          # A directory of templates that will generate valid Kubernetes configuration files with corresponding values provided.
  templates/NOTES.txt # (Optional) A plain text file with usage notes.
```

## Chart.yaml File

You must provide the `chart.yaml` file for a chart. Here is an example of the file with explanations for each field.

```yaml
apiVersion: (Required) The chart API version. 
name: (Required) The name of the chart.
version: (Required) The version, following the SemVer 2 standard. 
kubeVersion: (Optional) The compatible Kubernetes version, following the SemVer 2 standard.
description: (Optional) A single-sentence description of the app.
type: (Optional) The type of the chart.
keywords:
  - (Optional) A list of keywords about the app.
home: (Optional) The URL of the app.
sources:
  - (Optional) A list of URLs to source code for this app.
dependencies: (Optional) A list of the chart requirements.
  - name: The name of the chart, such as nginx.
    version: The version of the chart, such as "1.2.3".
    repository: The repository URL ("https://example.com/charts") or alias ("@repo-name").
    condition: (Optional) A yaml path that resolves to a boolean, used for enabling/disabling charts (for example, subchart1.enabled ).
    tags: (Optional)
      - Tags can be used to group charts for enabling/disabling together.
    import-values: (Optional)
      - ImportValues holds the mapping of source values to parent key to be imported. Each item can be a string or pair of child/parent sublist items.
    alias: (Optional) Alias to be used for the chart. It is useful when you have to add the same chart multiple times.
maintainers: (Optional)
  - name: (Required) The maintainer name.
    email: (Optional) The maintainer email.
    url: (Optional) A URL for the maintainer.
icon: (Optional) A URL to an SVG or PNG image to be used as an icon.
appVersion: (Optional) The app version. This needn't be SemVer.
deprecated: (Optional, boolean) Whether this chart is deprecated.
annotations:
  example: (Optional) A list of annotations keyed by name.
```

{{< notice note >}}

- The field `dependencies` is used to define chart dependencies which were located in a separate file `requirements.yaml` for `v1` charts. For more information, see [Chart Dependencies](https://helm.sh/docs/topics/charts/#chart-dependencies).
- The field `type` is used to define the type of chart. Allowed values are `application` and `library`. For more information, see [Chart Types](https://helm.sh/docs/topics/charts/#chart-types).

{{</ notice >}} 

## Values.yaml and Templates

Written in the [Go template language](https://golang.org/pkg/text/template/), Helm chart templates are stored in the `templates` folder of a chart. There are two ways to provide values for the templates:

1. Make a `values.yaml` file inside of a chart with default values that can be referenced.
2. Make a YAML file that contains necessary values and use the file through the command line with `helm install`. 

Here is an example of the template in the `templates` folder.

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

The above example defines a ReplicationController template in Kubernetes. There  are some values referenced in it which are defined in `values.yaml`.

- `imageRegistry`: The Docker image registry.
- `dockerTag`: The Docker image tag.
- `pullPolicy`: The image pulling policy.
- `storage`: The storage backend. It defaults to `minio`.

An example `values.yaml` file:

```text
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

## Reference

[Helm Documentation](https://helm.sh/docs/)

[Charts](https://helm.sh/docs/topics/charts/)