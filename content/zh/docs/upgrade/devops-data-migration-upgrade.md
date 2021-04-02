---
title: "DevOps Data Migration during Upgrade"
keywords: "Kubernetes, Upgrade, KubeSphere, v2.1.0, v3.0.0, DevOps"
description: "Understand the DevOps data migration and its risks during upgrade."
linkTitle: "DevOps Data Migration during Upgrade"
weight: 7700
---

When upgrading KubeSphere from v2.1 to v3.0, the issues users may encounter in DevOps are mainly caused by the changes in the DevOps architecture. This document illustrates the changes in the DevOps architecture and explores the data migration plans and risks evaluation.

## DevOps Architecture Comparison

### DevOps in KubeSphere v2.1

![devops-2-1-architecture](/images/docs/upgrade/devops-data-migration-upgrade/devops-2-1-architecture.png)

In KubeSphere v2.1, the DevOps data are stored in Jenkins, while the MySQL in KubeSphere stores the authorization information and the corresponding relations among projects, pipelines, and personnel. Frontend users make calls to the Api Gateway to get authentication from the ks-apiserver and then connect to Jenkins.

Another special type is `/kapis/jenkins.kubesphere.io`, which directly passes to Jenkins through the Api Gateway and mainly used when downloading the archive files.

### DevOps in KubeSphere v3.0

![devops-3-0-architecture](/images/docs/upgrade/devops-data-migration-upgrade/devops-3-0-architecture.png)

In KubeSphere v3.0, the DevOps data are stored in CustomResourceDefinition (CRD). The data in the CRD are synchronized to Jenkins in an one-way direction, and any previous data with the same name will be overwritten. There are mainly two types of operation. One type is the operation of creation, and the other is the operation of triggering.

The operation of creation mainly involves three CRD types, including DevOps projects, pipelines and credentials. Users make calls to the interface of ks-apiserver through frontend to create resources and store them in the etcd, and then the ks-controller-manager keeps synchronizing those objects to Jenkins. The operation of triggering mainly involves instant actions, including running a pipeline and reviewing a pipeline. Users make calls to the ks-apiserver through frontend, and then, after data conversion, directly make calls to the Jenkins API.

## The Data Migration Logic

When upgrading KubeSphere from v2.1 to v3.0, the process of data migration follows the steps shown below:

1. Retrieve information about DevOps directories from MySQL
2. Retrieve information about pipelines and credentials from Jenkins
3. Serialize the above information into a YAML file
4. Back up the YAML resource object to the MinIO object storage
5. Use the `kubectl apply` command to apply those pipeline resources
6. Authorizations migration

Data comparison before and after the migration:

| Resource Affected |  v2.1   | v3.0 |
| :---------------: | :-----: | :--: |
|  DevOps projects  |  MySQL  | CRD  |
|     Pipelines     | Jenkins | CRD  |
|    Credentials    | Jenkins | CRD  |
|  Authorizations   |  MySQL  | CRD  |

{{< notice warning>}}

You must back up the data in advance because the data in Jenkins will be overwritten by the ks-controller-manager once the CRD is created during data migration. You can use Velero to make a PVC-level backup, or back up the `/var/jenkins_home` directory of the Jenkins Pod directly.

{{</ notice >}}

## Data Migration Plans and Risks Evaluation

For the pipelines created on the KubeSphere DevOps page, migration can be carried out as normal. However, the pipeline configurations directly made on the Jenkins dashboard might get lost during the migration.

### Migration through a Job

Follow the upgrade process as normal. This plan applys to the scenario where the DevOps operations are only made on the KubeSphere DevOps page. If there is no DevOps resources available after the upgrade, you can rerun the upgrade process.

### No migration for the previous data

KubeSphere DevOps is compatible with most Jenkins configurations, but not all of them. As shown in the below image, certain configurations on the Jenkins dashboard are not supported by KubeSphere DevOps.

![configurations-not-supported](/images/docs/upgrade/devops-data-migration-upgrade/configurations-not-supported.png)

Those configurations will be cleared after the data migration. Even if those configurations are added again after the data migration, they will still be cleared when the pipeline is edited next time.

{{< notice note >}}

Generally speaking, those configurations cannot be configured into the Jenkinsfile because they are not in the logic when running a pipeline.

{{</ notice >}}

If you have specific needs for those configurations, you can keep your previous data unmigrated and manage the new pipelines on the KubeSphere DevOps page. 

{{< notice warning >}}

Do not create pipelines with the same name under one DevOps project, or the data in Jenkins will be overwritten.

{{</ notice >}}

### Partial migration

If there is only a small amount of configurations made on the Jenkins dashboard, users can make a backup first and then carry out a partial data migration without those special configurations by using a Job. Pipelines with special configurations can be restored later on, but it is recommended to manage pipelines on the KubeSphere DevOps page.

If there is a high requirement for availability, users can reuse the previous DevOps project and manually create a new pipeline with a different name to run it for testing. If the new pipeline runs successfully, users can delete the previous pipeline.

{{< notice info >}}

You can use the command `kubectl get devopsprojects --all-namespaces` and `kubectl get pipelines --all-namespaces` to check the migration results.

You can also use the following command to rerun the Job for migration.

```
kubectl -n kubesphere-system get job ks-devops-migration -o json | jq 'del(.spec.selector)' | jq 'del(.spec.template.metadata.labels)' | kubectl replace --force -f -
```

{{</ notice >}}



