---
title: "Jenkins System Settings"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Jenkins is powerful and flexible and it has become the de facto standard for CI/CD workflow. But flexibility comes at a price: because in addition to the Jenkins itself, many plugins require some system-level configuration to get the job done.

KubeSphere DevOps is based on Jenkins for containerized CI/CD workflow functionality. To provide users with a schedulable Jenkins environment, KubeSphere uses **Configuration-as-Code** for Jenkins system settings, which requires the user to log in to Jenkins Dashboard and reload after KubeSphere modifies the configuration file. In the current release, Jenkins system settings are not yet available in KubeSphere, it will be supported in upcoming release.

### Modify ConfigMap

If you are a cluster-admin of KubeSphere and assume you need to modify the Jenkins system configuration, it is recommended that you use Configuration-as-Code (CasC) in KubeSphere. 

Firstly, you need to modify `jenkins-casc-config` in KubeSphere, then log in to Jenkins Dashboard to perform **reload**. (Because system settings written directly through Jenkins Dashborad may be overwritten by CasC configuration after Jenkins rescheduling).

The built-in Jenkins CasC file is stored in `/system-workspace/kubesphere-devops-system/configmaps/jenkins-casc-config/` as **ConfigMap**.

1. Log in KubeSphere by using `admin` account, navigate to **Platform**.

![configmap setting](/images/devops/set-jenkins-email-1.png)

2. Then go to **Configurations → ConfigMaps**, choose namespace and drill into **kubesphere-devops-system**. Then choose **jenkins-casc-config** to **Edit Yaml**. 

![yaml template file](/images/devops/set-jenkins-casc.png)

The configuration template for jenkins-casc-config is a yaml type file as shown below. For example, you can modify the container image, label, etc. in the broker (Kubernetes Jenkins agent) in ConfigMap or add a container in the podTemplate.

![yaml template file](/images/devops/set-jenkins-casc-2.png)

After KubeSphere modifies **jenkins-casc-config**, you need to reload your updated system configuration on the **configuration-as-code** page under Jenkins Dashboard System Management.

### Login Jenkins to Reload

1. KubeSphere Installer will deploy Jenkins Dashboard for the first installation. Jenkins supports a form of KubeSphere's LDAP, so you can log in to Jenkins Dashboard with the username `admin` and its default password to access the Jenkins dashboard via `http://EIP:30180`.  After logging in, click `Manage Jenkins` in the left navigation bar.

> Note: Accessing the Jenkins Dashboard may require port forwarding and firewalls to be released on the public network for access.

![System Management](/images/devops/jenkins-setting-1-en.png)

2. Find `Configuration as Code` at the bottom of the console and click Enter.

![Configuration as Code](/images/devops/jenkins-setting-2-en.png)

3. Click `Reload` in the Configuration as Code panel to reload and update the system configuration which is modified in KubeSphere's ConfigMap.

![Configuration as Code](/images/devops/jenkins-setting-3-en.png)

For details on how to set up the configuration via CasC, see [Jenkins Documentation](https://github.com/jenkinsci/configuration-as-code-plugin).

> Note: In the current version, not all plugins support CasC settings. CasC will only override plugin configurations that are set up using CasC.