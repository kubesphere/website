---
title: "Jenkins System Settings"
keywords: 'Kubernetes, KubeSphere, Jenkins, CasC'
description: 'Learn how to customize your Jenkins settings.'
linkTitle: 'Jenkins System Settings'
Weight: 11216
---

Jenkins is powerful and flexible and it has become the de facto standard for CI/CD workflows. Nevertheless, many plugins require users to set system-level configurations before they can be put to use.

The KubeSphere DevOps System offers containerized CI/CD functions based on Jenkins. To provide users with a schedulable Jenkins environment, KubeSphere uses **Configuration as Code** for Jenkins system settings, which requires users to log in to the Jenkins dashboard and reload the configuration after it is modified. In the current release, Jenkins system settings are not available on the KubeSphere console, which will be supported in upcoming releases.

This tutorial demonstrates how to set up Jenkins and reload configurations on the Jenkins dashboard.

## Prerequisites

You have enabled [the KubeSphere DevOps System](../../../../pluggable-components/devops/).

## Jenkins Configuration as Code

KubeSphere has the Jenkins Configuration as Code plugin installed by default to allow you to define the desired state of your Jenkins configuration through YAML files and makes it easy to reproduce your Jenkins configurations including plugin configurations. You can find descriptions about specific Jenkins configurations and example YAML files [in this directory](https://github.com/jenkinsci/configuration-as-code-plugin/tree/master/demos).

Besides, you can find the `formula.yaml` file in the repository [ks-jenkins](https://github.com/kubesphere/ks-jenkins), where you can view plugin versions and customize these versions based on your needs.

![plugin-version](/images/docs/v3.3/devops-user-guide/using-devops/jenkins-system-settings/plugin-version.png)

## Modify the ConfigMap

It is recommended that you configure Jenkins in KubeSphere through Configuration as Code (CasC). The built-in Jenkins CasC file is stored as a [ConfigMap](../../../../project-user-guide/configuration/configmaps/).

1. Log in to KubeSphere as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. If you have enabled the [multi-cluster feature](../../../../multicluster-management/) with member clusters imported, you can select a specific cluster to edit the ConfigMap. If you have not enabled the feature, refer to the next step directly.

3. On the left navigation pane, select **ConfigMaps** under **Configuration**. On the **ConfigMaps** page, select `kubesphere-devops-system` from the drop-down list and click `jenkins-casc-config`.

4. On the details page, click **Edit YAML** from the **More** drop-down list.

5. The configuration template for `jenkins-casc-config` is a YAML file under the `data.jenkins_user.yaml:` section. You can modify the container image, label, resource requests and limits, etc. in the broker (Kubernetes Jenkins agent) in the ConfigMap or add a container in the podTemplate. When you finish, click **OK**.

6. Wait for at least 70 seconds until your changes are automatically reloaded.

7. For more information about how to set up Jenkins via CasC, see the [Jenkins documentation](https://github.com/jenkinsci/configuration-as-code-plugin).

   {{< notice note >}}

   In the current version, not all plugins support CasC settings. CasC will only overwrite plugin configurations that are set up through CasC.

   {{</ notice >}} 

