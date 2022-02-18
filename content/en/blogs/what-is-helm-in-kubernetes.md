---
title: 'What is Helm in Kubernetes?'  
tag: 'Kubernetes, Helm'  
keywords: Kubernetes, Helm  
description: This article explains the concept of Helm and looks into some examples of using Helm in Kubernetes.   
createTime: '2022-02-17'  
author: 'Yitaek, Feynman, Felix'  
snapshot: '/images/blogs/en/what-is-helm-in-kubernetes/k8s-and-helm.png'
---

Helm is one of the most popular ways to package and share applications built for Kubernetes. Since joining the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/) in 2016, Helm has become an important component in the Kubernetes ecosystem. In fact, in [CNCF Survey 2020](https://www.cncf.io/wp-content/uploads/2020/11/CNCF_Survey_Report_2020.pdf), over 60% of respondents reported Helm as the preferred method for packaging Kubernetes applications. This popularity is also backed by the fact that most cloud-native CI/CD tools as well as open-source Kubernetes tools all support Helm as one way to deploy and manage their applications. In this article, we’ll dive into the architecture, key concepts, and example usage of Helm.

## Helm Architecture

At a high-level, Helm is a tool for managing various Kubernetes manifests (e.g. Deployments, ConfigMaps, Services, etc) grouped into *charts*. It can be thought of as a package manager for Kubernetes application (similar to yum and apt for Linux software packages) with some added features for templating and lifecycle management.

With Helm, users can package Kubernetes applications into charts, package charts into tgz files for distribution, host versioned charts onto repositories, as well as un/install charts from local or remote repositories onto a Kubernetes cluster. Once a Helm chart is deployed, Helm keeps track of the running instance of a chart as a *release* and provides mechanisms to upgrade, rollback, and uninstall said charts.

Helm provides a powerful mechanism to group various Kubernetes components to a single deployable unit. This makes deploying Kubernetes applications more repeatable and consistent, which makes it easier to deploy complex applications such as PostgreSQL, Kafka, and Prometheus in a simple interface.

Underneath the hood, Helm is comprised of two components:

- **Helm Client**: command-line client to interface with the Helm library. The CLI can be used for local chart development (e.g. creating new charts, linting), managing repositories and releases.
- **Helm Library**: core engine that interfaces with the Kubernetes API server to install, upgrade, or rollback charts and its configurations.

At the time of writing, Helm is currently on its third rendition (Helm v3). Previous versions of Helm also had a component called Tiller, that ran inside the cluster to run Helm operations, but has since been ripped out due to security concerns as it had full admin rights to the cluster.

## Helm Chart Structure

Now that we understand the key components of Helm, we’ll dive into the structure of a Helm chart. To get started, use `helm create <name-of-chart>` command or inspect any open-source Helm charts (e.g. Bitnami, Prometheus, Grafana):

```
mychart
|-- .helmignore    # Contains patterns to ignore
|-- Chart.yaml     # Information about your chart
|-- values.yaml    # The default values for your templates
|-- NOTES.txt      # Notes for deployment
|-- charts/        # Charts that this chart depends on
|-- templates/     # The template files 
    |-- tests/     # The test files
```

Let's break down each component:

- **.helmignore**: Similar to .gitignore, this file contains patterns to ignore when packaging up the Helm chart (e.g. .vscode/ , .git , etc).
- **Chart.yaml**: Similar to package.json in Node, it contains metadata about the chart (e.g. version, author, etc) as well as other sub-components that this chart uses. For example, Kafka Helm Chart may combine Kafka and Zookeeper into a single deployment.
- **values.yaml**: Default values for all the templated parts of the Chart. These values can be overwritten via --values or --set flags.
- **NOTES.txt**: Optional plain text file containing usage notes (e.g. how to get the port for the service)
- **charts**: Holds dependent charts if specified in Chart.yaml
- **templates**: Contains all the Kubernetes manifests that define the behavior of your application (e.g. deployments, services, autoscaling, configmaps, etc) as well as other template helpers, notes, and test files.
- **tests**: optional files to test the Helm chart (e.g. testing if the port is reachable)

At a minimum, Helm expects the following files to be deployable:

- Chart.yaml
- Values.yaml
- Kubernetes manifest file under templates

When interacting with pre-existing Helm charts, users need to simply override configuration values of the YAML file to override the default behavior. Common tasks may include updating the Docker image, setting new environment variables, or adding secrets. Let’s use a concrete example to get started.

## Example Usage

To get started, install Helm either from the binary releases on Github or through package manager such as brew or chocolatey:

```bash
brew install helm
```

Next, explore some open-source Helm charts and add the repository to interact with it. We will use Bitnami’s PostgreSQL:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

Now we can list which Helm repository our Helm client knows about:

```bash
$ helm repo ls
NAME   	URL                               
bitnami	https://charts.bitnami.com/bitnami
```

Let’s install it with the release name `my-release`:

```bash
helm install my-release bitnami/postgresql
```

We can inspect all the deployed releases by namespace:

```bash
helm ls <-n namespace>
```

To inspect all the overridable configurations, look at the `values.yaml` file on Github or we can download the Helm chart and inspect manually.

```bash
helm pull bitnami/postgresql
```

```
tar -xvf postgresql-<PostgreSQL version>.tgz
cd postgresql && cat values.yaml
```

{{< notice note >}}

The version of PostgreSQL downloaded may be different. Make sure you use the version you downloaded.

{{</ notice >}}

Let’s enable the metrics container. Create a new file called `metrics.yaml` with the following content:

```yaml
metrics:
  enabled: true
```

Now we apply the change and upgrade:

```bash
helm upgrade my-release bitnami/postgresql -f metrics.yaml
```

Run `helm ls` again, which will show that our chart has been updated with release at 2. Use the Kubernetes dashboard or any dashboard tool like Lens or K9s to see that PostgreSQL pod now has two containers (Postgres and metrics).

If we want to deploy another instance of PostgreSQL, we can give it a different release name:

```bash
helm install new-release bitnami/postgresql
```

To clean up, we run the uninstall command:

```bash
helm uninstall new-release
```

## Managing Helm Charts on KubeSphere

As a distributed operating system for cloud-native application management, [KubeSphere](https://kubesphere.io/) realizes application lifecycle management through its pluggable component, App Store. After [enabling the App Store](https://kubesphere.io/docs/pluggable-components/app-store/), you can deploy the built-in applications on the web console. Moreover, you can [upload Helm-based applications](https://kubesphere.io/docs/workspace-administration/upload-helm-based-application/) or [import a Helm repository](https://kubesphere.io/docs/workspace-administration/app-repository/import-helm-repository/). With KubeSphere, you can manage your Kubernetes applications throughout their lifecycle, including submission, review, test, release, upgrade, and removal via the console.

![](/images/blogs/en/what-is-helm-in-kubernetes/ks-app-store.png)

## Next Steps

Helm documentation website maintains an extensive list of best practices for using and creating Helm charts. Since Helm uses Go templates underneath the hood for its templating engine, become familiar with Go templates and conventions as well as YAML to get comfortable with interacting with Helm charts.