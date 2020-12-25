---
title: "Helm Developer Guide"
keywords: 'Kubernetes, KubeSphere, helm, development'
description: 'Helm developer guide'
linkTitle: "Helm Developer Guide"
weight: 14410
---

You can upload the Helm chart of an app to KubeSphere so that tenants with necessary permissions can deploy it. This tutorial demonstrates how prepare Helm charts using NGINX as an example.

## Install Helm

If you have already installed KubeSphere, then Helm is already deployed in your environment. Otherwise, refer to the [Helm documentation](https://helm.sh/docs/intro/install/) to install Helm first.

## Create a Local Repository

Execute the following commands to create a repository on your machine.

```bash
mkdir helm-repo
```

```bash
cd helm-repo
```

## Create an App

Use `helm create` to create a folder named `nginx`, which automatically creates YAML files templates and directories for your app. Generally, it is not recommended to change the name of files and directories in the top level directory.

```bash
$ helm create nginx
$ tree nginx/
nginx/
├── charts
├── Chart.yaml
├── templates
│   ├── deployment.yaml
│   ├── _helpers.tpl
│   ├── ingress.yaml
│   ├── NOTES.txt
│   └── service.yaml
└── values.yaml
```

Chart.yaml is used to define the basic information of the chart, including name, API, and app version. For more information, see [Chart.yaml File](../helm-specification/#chartyaml-file).

An example of the `Chart.yaml` file:

```yaml
apiVersion: v1
appVersion: "1.0"
description: A Helm chart for Kubernetes
name: nginx
version: 0.1.0
```

When you deploy Helm-based apps to Kubernetes, you can edit the `values.yaml` file on the KubeSphere console directly.

An example of the `values.yaml` file:

```yaml
# Default values for test.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

replicaCount: 1

image:
  repository: nginx
  tag: stable
  pullPolicy: IfNotPresent

nameOverride: ""
fullnameOverride: ""

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  path: /
  hosts:
    - chart-example.local
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #  cpu: 100m
  #  memory: 128Mi
  # requests:
  #  cpu: 100m
  #  memory: 128Mi

nodeSelector: {}

tolerations: []

affinity: {}
```

Refer to [Helm Specifications](../helm-specification/) to edit files in the `nginx` folder and save them when you finish editing.

## Package the App

Execute the following command to package your app.

```bash
helm package nginx
```

```bash
$ ls
nginx  nginx-0.1.0.tgz
```

## Upload the App

