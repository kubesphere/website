---
title: "Glossary"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''

weight: 2600
---

This document describes some frequently used glossaries in KubeSphere as shown below:

 
| Object | Concepts|
|------------|--------------|
| Project | It is Kubernetes Namespace which provides virtual isolation for the resources in KubeSphere, see [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/). |
| Pod | A Pod is the smallest deployable computing unit that can be created and managed in KubeSphere, see [Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/). |
| Deployment | Deployment is used to describe a desired state in a deployment object, and the deployment controller changes the actual state to the desired state at a controlled rate, see [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/). |
| StatefulSet | StatefulSet is the workload object used to manage stateful applications, such as MySQL, see [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/). |
| DaemonSet | A DaemonSet ensures that all (or some) Nodes run a copy of a Pod，such as fluentd or logstash, see [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/). |
| Job | A job creates one or more pods and ensures that a specified number of them successfully terminate, see [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/). |
| CronJob | CronJob creates Jobs on a time-based schedule. A CronJob object is like one line of a crontab (cron table) file. It runs a job periodically on a given schedule, see [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/). | 
| Service | A Kubernetes service is an abstraction object which defines a logical set of Pods and a policy by which to access them - sometimes called a micro-service. See [Service](https://kubernetes.io/docs/concepts/services-networking/service/). |
| Route | It is Kubernetes Ingress, an API object that manages external access to the services in a cluster, typically HTTP. Ingress can provide load balancing, SSL termination and name-based virtual hosting, see [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/). |
| Image Registry | Image registry is used to store and distribute Docker Images. It could be public or private, see [Image](https://kubernetes.io/docs/concepts/containers/images/). |
| Volume | It is Kubernetes Persistent Volume Claim (PVC). Volume is a request for storage by a user, allowing a user to consume abstract storage resources, see [PVC](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). | 
| Storage Classes | A storage class provides a way for administrators to describe the “classes” of storage they offer, see [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/). |
| Pipeline | Jenkins Pipeline is a suite of plugins which supports implementing and integrating continuous delivery pipelines into Jenkins, see [Pipeline](https://jenkins.io/doc/book/pipeline/). |
| WorkSpace | Workspace is a logical unit to organize your workload projects, DevOps projects, to manage resource access and share information within your team. It is an isolated working place for your team. |
| Node | A node is a worker machine that may be a virtual machine or physical machine, depending on the cluster setup. Each node contains the services necessary to run pods and is managed by the master components. see [Node](https://kubernetes.io/docs/concepts/architecture/nodes/). |