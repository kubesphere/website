---
title: 'Kubernetes Operators You Need to Use'  
tag: 'Kubernetes, Operator'  
keywords: Kubernetes, Operator, kubernetes applications, custom resources     
description: What are Kubernetes Operators and How to Use Them? This article explains the concept of Kubernetes Operators and looks into some examples of using Operators in Kubernetes.   
createTime: '2022-02-27'  
author: 'Yitaek, Felix'  
snapshot: '/images/blogs/en/what-are-operators/k8s-operators.png'
---

One of Kubernetes’s key principles is the [control loop](https://kubernetes.io/docs/concepts/architecture/controller/), which aims to continuously match the current state of at least one Kubernetes resource type to its desired state. While this property unlocks Kubernetes’s self-healing capabilities, as more complex applications are onboarded onto Kubernetes, managing and operating those applications requires features beyond just what Kubernetes provides out of the box. Such operations may include complex consensus logic for highly available, distributed databases, cross-regional failover, or automated backup and restore for critical information. 

Back in 2016, the team at CoreOS introduced the Kubernetes Operator pattern to fill in that gap. The goal was to encapsulate operational logic into a format that is compatible with the Kubernetes API in the form of an application-specific controller. While the original focus of the operator pattern was to facilitate the management of stateful applications, Kubernetes Operators are now popular paradigms used in all types of Kubernetes applications. The Operator Pattern can be extended in any use cases where the operational knowledge needed to create, configure, and maintain complex applications can be automated with an abstraction layer. 


## What are Kubernetes Operators?

Kubernetes Operators extend the core Kubernetes API and act as controllers for a [Custom Resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/), which can represent a resource not captured by Kubernetes primitives such as Pods, Deployments, and Services. Just as the Kubernetes controller watches and compares the state of the resources it manages, Kubernetes Operator follows the same control loop pattern and matches the state of its custom resources to the desired state. Besides the additional operational knowledge that a Kubernetes Operator encapsulates, the behavior of a Kubernetes Controller and a Kubernetes Operator are identical. 

To be more precise, the Operator patterns consists of three parts:



1. The application 
2. Domain-specific knowledge and its desired state declared in a custom manner 
3. A controller that watches the state of the application as well as domain-specific behavior and acts accordingly to reconcile desired state. 

In practice, the domain-specific knowledge is encapsulated via a Custom Resource Definition (CRD) and deployed alongside its controller in the cluster. 


## CRDs in Kubernetes

As mentioned above, CRDs define the behaviors of a custom resource, such as its desired state as well as the topology of the object. Let’s take a look at an example taken from the [CNCF whitepaper](https://github.com/cncf/tag-app-delivery/blob/eece8f7307f2970f46f100f51932db106db46968/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md):


```
apiVersion: example-app.appdelivery.cncf.io/v1alpha1
kind: ExampleApp
metadata:
  name: appdelivery-example-app
spec:
  appVersion: 0.0.1
  features:
    exampleFeature1: true
    exampleFeature2: false
  backup:
    enabled: true
    storageType: "s3"
    host: "my-backup.example.com"
    bucketName: "example-backup"
status:
  currentVersion: 0.0.1
  url: https://myloadbalancer/exampleapp/
  authSecretName: appdelivery-example-app-auth
  backup:
    lastBackupTime: 12:00
```


The above CRD defines a custom resource called “appdelivery-example-app” of the kind “ExampleApp”. The desired state is captured under the spec section. This example app enables exampleFeature1, disables exampleFeature2, with backup enabled to s3 bucket, “example-backup”. 

The status section is the output given to the operator (i.e. user of the custom resource). This example CRD returns the current version, as well as URL and the last backup time. If you are familiar with the NOTES.txt section of a Helm chart, the status section often contains similar information (e.g. how to connect to the application). 


## How KubeSphere uses Kubernetes Operators

The Operator pattern is widely used underneath the hood at KubeSphere. In fact, the core [Logging System](https://kubesphere.io/docs/pluggable-components/logging/) used for log collection, querying, and management is implemented via the [FluentBit Operator](https://github.com/fluent/fluentbit-operator). The log collection is implemented through Fluent Bit, however, vanilla deployment of Fluent Bit can be difficult. To address this challenge, the KubeSphere observability team developed an open-source Fluent Bit management tool called [FluentBit Operator](https://github.com/fluent/fluentbit-operator), which has been donated to the upstream Fluent community. The FluentBit Operator creates and manages Fluent Bit pods through CRDs, and dynamically updates the Fluent Bit configurations and pods, which makes it easier to deploy, configure, and update Fluent Bit instances.


## How to Use an Operator in KubeSphere

Using other Operators in KubeSphere is also simple. Log onto the KubeSphere console as admin, and use kubectl from the toolbox in the lower-right hand corner (alternatively, have kube context pointed to the KubeSphere cluster if you have access). 

Next, locate the YAML file that holds all the Operator manifests. For example, for Prometheus Operator, it’s in a file called [bundle.yaml](https://github.com/prometheus-operator/prometheus-operator/blob/main/bundle.yaml):

Then simply apply the file:

`kubectl create -f bundle.yaml`

Similarly, for other Operators such as Strimzi (Kafka Operator), you can run:

`​​kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka`

For more examples, see:



* [Deploy ClickHouse Operator and a ClickHouse Cluster on KubeSphere](https://kubesphere.io/docs/application-store/external-apps/deploy-clickhouse/)
* [Deploy TiDB Operator and a TiDB Cluster on KubeSphere](https://kubesphere.io/docs/application-store/external-apps/deploy-tidb/)


## Writing Your Own Operator

If there isn’t a preexisting Operator for your use, you can create your own using some popular frameworks/libraries:



* [Charmed Operator Framework](https://juju.is/)
* [kubebuilder](https://book.kubebuilder.io/)
* [KubeOps](https://buehler.github.io/dotnet-operator-sdk/) (.NET operator SDK)
* [KUDO](https://kudo.dev/) (Kubernetes Universal Declarative Operator)
* [Metacontroller](https://metacontroller.github.io/metacontroller/intro.html) along with WebHooks that you implement yourself
* [Operator Framework](https://operatorframework.io/)
* [Shell-operator](https://github.com/flant/shell-operator)
* [CNCF Operator Framework](https://github.com/operator-framework)
* [Kopf](https://github.com/nolar/kopf) (Kubernetes Operator Pythonic Framework) 

If none of these frameworks work for your use case, you can also write an Operator with any language using a client library for the Kubernetes API. 


## FAQ

- What is a Kubernetes Operator?

> A Kubernetes Operator is an extension of Kubernetes that utilizes custom resources to capture operational knowledge for complex applications. 

- How do you use Operators in Kubernetes?

> To use an Operator, create Custom Resource Definitions and deploy it with its controller to the cluster. 

- How do you create a Kubernetes Operator? 

> To create a Kubernetes Operator, use an open-source Operator framework or libraries that can communicate with the core Kubernetes API. 

- How is a Kubernetes Operator different than a Helm chart?

> Helm is a package manager for Kubernetes resources. While Helm can also carry out some of the operational tasks that an Operator can (e.g. bundling together multiple components, firing hooks upon install), it is limited in its functionality. However, these tools are complementary. In fact, some Helm charts install CRDs prior to deploying the application and its Operator. 

- What are some popular Operators?

> Prometheus Operator and etcd Operators were the first two created by the CoreOS team. Strimzi Operator for Kafka is also popular to deploy a production-grade Kafka cluster on Kubernetes. 

- Are Operators only useful for StatefulSets?

> No, while StatefulSets present typical challenges that an Operator was meant to help with, any application with operational complexity can benefit from an Operator

- When should you not use an Operator?

> Operators present another layer of abstraction for the user. If Kubernetes can natively handle a lot of the operational burden, you might be better off investing time into CI/CD pipelines to automate some tasks rather than creating an entirely new Operator. 