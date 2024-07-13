---
title: "Install Plugins to Jenkins in KubeSphere"
keywords: "KubeSphere, Kubernetes, DevOps, Jenkins, Plugin"
description: "How to install plugins to Jenkins in KubeSphere"
linkTitle: "Install Plugins to Jenkins in KubeSphere"
Weight: 16810
version: "v3.4"
---

The KubeSphere DevOps System offers containerized CI/CD functions based on Jenkins. The primary means of enhancing the functionality of Jenkins is to install plugins. This tutorial demonstrates how to install plugins on the Jenkins dashboard.

{{< notice warning >}}

Not all Jenkins plugins have good maintaining support. Some plugins may lead to issues in Jenkins or even cause serious problems in KubeSphere. It is highly recommended that you make a backup before installing any plugin and run testing in another environment if you can.

{{</ notice >}}

## Prerequisites

You need to enable [the KubeSphere DevOps system](../../../pluggable-components/devops/).

## Install Plugins

### Step 1: Get the address of Jenkins

1. Run the following command to get the address of Jenkins.

   ```bash
   export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services devops-jenkins)
   export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
   echo http://$NODE_IP:$NODE_PORT
   ```

2. You can get the output similar to the following. You can access the Jenkins dashboard through the address with your own KubeSphere account and password (for example, `admin/P@88w0rd`).

   ```
   http://192.168.0.4:30180
   ```

   {{< notice note >}}

   Make sure you use your own address of Jenkins. You may also need to open the port in your security groups and configure related port forwarding rules depending on where your KubeSphere cluster is deployed.

   {{</ notice >}}

### Step 2: Install plugins on the Jenkins dashboard

1. Log in to the Jenkins dashboard and click **Manage Jenkins**.

2. On the **Manage Jenkins** page, scroll down to **Manage Plugins** and click it.

3. Select the **Available** tab and you have to use the search field to search for the plugins you need. For example, you can enter `git` in the search field, check the checkbox next to the plugin you need, and then click **Install without restart** or **Download now and install after restart** based on your needs.

   {{< notice note >}}

   Jenkins plugins are inter-dependent. You may also need to install dependencies when you install a plugin.

   {{</ notice >}}

4. If you downloaded an HPI file in advance, you can also select the **Advanced** tab and upload the HPI file to install it as a plugin.

5. On the **Installed** tab, you can view all the plugins installed, and the plugins that are safe to uninstall will have the **Uninstall** button shown on the right.

6. On the **Updates** tab, you can install the updates for plugins by checking the checkbox of a plugin and then click the **Download now and install after restart** button. You can also click the **Check now** button to check for updates.

## See Also

[Managing Plugins](https://www.jenkins.io/doc/book/managing/plugins/)