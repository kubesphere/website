---

title: 'MySQL on K8s: an Open-Source HA Container Orchestration Solution for MySQL'  
tag: 'KubeSphere, Kubernetes, RadonDB'  
keywords: 'KubeSphere, Kubernetes, MySQL, RadonDB'  
description: 'MySQL deployed on bare metal servers faces challenges of operations \& maintenance cost and resource scalability. However, with the help of cloud-native stateful applications, RandonDB makes full use of cloud and provides a cloud-native HA solution for MySQL clusters.'   
createTime: '2021-06-17'  
author: 'Gao Riyao, Bettygogo'  
snapshot: '/images/blogs/en/mysql-on-k8s/radondb-cover.png'
---

## Challenges of MySQL Operations \& Maintenance

![radondb-1](/images/blogs/en/mysql-on-k8s/radondb-1.png)

Traditionally, databases are deployed on bare metal servers, and the operations \& maintenance personnel face challenges in the proceeding figure.

### 1\. Cost

To build a MySQL cluster, hardware such as servers, switches, memory devices, CPU, and disks are necessary.

The hardware cost involves device selection, procurement, maintenance, upgrade, damage, data loss, and others.

### 2\. Traditional deployment

Every time the operations \& maintenance personnel add a cluster, they have to install an OS, configure the environment, install a MySQL database, commission the database, fine-tune parameters, upgrade the system and database, and more.

### 3\. Operations \& maintenance

The operations \& maintenance personnel need to write scripts for different scenarios, such as one-source-one-replica, one-source-two-replicas, and MGR.

The operations \& maintenance personnel can handle it when the cluster size is small with only a few of MySQL instances. However, when the number of clusters keeps increasing and thousands of MySQL instances are created, operations \& maintenance becomes burdensome and less efficient.

The larger the cluster, the higher the probability of mishandling. Accidentally deleting core data may result in great loss, but most companies are incapable of responding to this risk.

### 4\. Resource scalability

Traditional bare metal servers cannot automatically scale up and down MySQL&nbsp;workloads during business peaks and valleys. For example, you can scale up resources such as CPU and memory at business peaks and retrieve idle resources at business valleys to reduce cost.

## Mainstream Solutions

To respond to these challenges, the industry provides two mainstream solutions.

1. Bare metal servers + management platform
   
   The database management platform simultaneously manages all databases, which reduces the operations \& maintenance cost and improves the overall availability of databases.

2. Migration to the cloud
   
   Cloud providers of all sizes offer their own RDS service, that is, to deploy databases on the cloud.
   
   This solution features pay-as-you-go, on-demand scalability, and high availability (HA), and integrates storage resources. It simplifies large-scale deployment and operations \& maintenance cost of databases.

Database containerization is another option to address these challenges.

## Database Containerization

According to the [CNCF Cloud Native Survery China 2020](https://www.cncf.io/blog/2021/04/28/cncf-cloud-native-survey-china-2020/), 68% of organizations use containers in production, among which 43% of them use containers for their core businesses.

### Container technology

![randondb2png](/images/blogs/en/mysql-on-k8s/randondb2png.png)

### Docker

- Lightweight and standard image production
  
  Installation, deployment, and delivery are efficient. Moreover, it simplifies PaaS package and addresses the environment inconsistency issue.

- Lightweight virtualization (rootfs/cgroup/namespace)
  
  This facilitates resource sharing and minimizes performance loss.

### Kubernetes

Owing to large-scale cluster management experience of Google Borg, Kubernetes provides a set of base dependencies for building a container-based distributed system. Now, Kubernetes has become the de-facto standard for container orchestration.

- Operations \& maintenance capabilities
  
  It supports Ingress, horizontal scaling, monitoring, backup, disaster recovery, and other capabilities.

- Declarative APIs
  
  The APIs describe the relationship between containerized business and containers.

- Container orchestration
  
  Kubernetes automatically manages the relationship among containers according to users' needs and rules of the whole system.

In the [Kubernetes community](https://kubesphere.io/), users call for high availability MySQL databases. This is where MySQL containerization comes in.

## Exploring MySQL Containerization

**RadonDB MySQL** is an open-source, highly available, and cloud-native cluster solution based on MySQL. It supports the architecture of one leader and multiple followers and has a full set of management features such as security, automatic backup, monitoring and alerting, and automatic scaling. RadonDB MySQL has been widely used by **banks**, **insurance companies**, and **traditional large enterprises** in production.

[RadonDB MySQL Kubernetes](https://github.com/radondb/radondb-mysql-kubernetes) can be deployed and managed on both Kubernetes and KubeSphere. It automatically runs tasks relevant to RadonDB MySQL clusters. The open-source tool **Xenon** is used to achieve high availability of MySQL clusters.

### Architecture

Each pod has a Xenon, which manages MySQL databases in the pod, obtains and stores the current state, and obtains information about running replicas.

![](https://pek3b.qingstor.com/kubesphere-community/images/radondb-3.jpg)

### Helm version

It is a generic package management tool that has Kubernetes resource templates, making it much easier to share packages. Helm provides the following functions:

* Deploys application resources and allows separation of configurations.
* Manages application lifecycle.
* Upgrades and updates MySQL databases.
* Deletes resources.

Key Features:

* MySQL high availability
  * Decentralized automatic leader election
  * Switchover between the leader and followers in seconds
  * Strong data consistency
* Cluster management
* Monitoring and alerting
* Cluster log management
* Account management

### KubeSphere Application Management

![radondb-4](/images/blogs/en/mysql-on-k8s/radondb-4.png)

You can run the following commands in the terminal to configure the output information.

```plain
$ xenoncli cluster status
+------------------------------------------------------+-------------------------------+--------+---------+--------------------------+---------------------+----------------+------------------------------------------------------+
|                          ID                          |             Raft              | Mysqld | Monitor |          Backup          |        Mysql        | IO/SQL_RUNNING |                       MyLeader                       |
+------------------------------------------------------+-------------------------------+--------+---------+--------------------------+---------------------+----------------+------------------------------------------------------+
| demo-radondb-mysql-0.demo-radondb-mysql.default:8801 | [ViewID:1 EpochID:2]@LEADER   | UNKNOW | OFF     | state:[NONE]
            | [ALIVE] [READWRITE] | [true/true]    | demo-radondb-mysql-0.demo-radondb-mysql.default:8801 |
|                                                      |                               |        |         | LastError:               |                     |                |                                                      |
+------------------------------------------------------+-------------------------------+--------+---------+--------------------------+---------------------+----------------+------------------------------------------------------+
| demo-radondb-mysql-1.demo-radondb-mysql.default:8801 | [ViewID:1 EpochID:2]@FOLLOWER | UNKNOW | OFF     | state:[NONE]
            | [ALIVE] [READONLY]  | [true/true]    | demo-radondb-mysql-0.demo-radondb-mysql.default:8801 |
|                                                      |                               |        |         | LastError:               |                     |                |                                                      |
+------------------------------------------------------+-------------------------------+--------+---------+--------------------------+---------------------+----------------+------------------------------------------------------+
| demo-radondb-mysql-2.demo-radondb-mysql.default:8801 | [ViewID:1 EpochID:2]@FOLLOWER | UNKNOW | OFF     | state:[NONE]
            | [ALIVE] [READONLY]  | [true/true]    | demo-radondb-mysql-0.demo-radondb-mysql.default:8801 |
|                                                      |                               |        |         | LastError:               |                     |                |                                                      |
+------------------------------------------------------+-------------------------------+--------+---------+--------------------------+---------------------+----------------+------------------------------------------------------+
$ xenoncli cluster gtid
+------------------------------------------------------+----------+-------+-------------------+--------------------+
|                          ID                          |   Raft   | Mysql | Executed_GTID_Set | Retrieved_GTID_Set |
+------------------------------------------------------+----------+-------+-------------------+--------------------+
| demo-radondb-mysql-1.demo-radondb-mysql.default:8801 | FOLLOWER | ALIVE |                   |                    |
+------------------------------------------------------+----------+-------+-------------------+--------------------+
| demo-radondb-mysql-2.demo-radondb-mysql.default:8801 | FOLLOWER | ALIVE |                   |                    |
+------------------------------------------------------+----------+-------+-------------------+--------------------+
| demo-radondb-mysql-0.demo-radondb-mysql.default:8801 | LEADER   | ALIVE |                   |                    |
+------------------------------------------------------+----------+-------+-------------------+--------------------+
```

## RoadMap

### Operator version

Operator is designed for scenario-specific stateful services and automatic management of complex applications. Apart from features of Helm, Operator also provides the following functions:

* Listens to Kubernetes APIs and takes measures to ensure data continuity of stateful applications during instance creation, scaling, and death.
* Designates nodes for cross-DC/remote disaster recovery and provides static IP addresses.
* Automatically locates and rectifies the problem when the primary replica or secondary replicas are faulty or latency of replicas exceeds the normal range.

To help users manage applications in a more fine-grained way with Operator, we plan to support the following features:

* Node addition and deletion
* Automatic scaling
* Cluster upgrade
* Backup and recovery
* Automatic failover
* Automatic node rebuilding
* Automatic restart of services
* Account management (APIs provided)
* Online migration
* Automated operations \& maintenance
* Multi-node roles
* Disaster recovery clusters
* SSL transport encryption