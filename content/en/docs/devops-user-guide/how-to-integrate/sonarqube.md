---
title: "Integrate SonarQube into Pipelines"
keywords: 'Kubernetes, KubeSphere, devops, jenkins, sonarqube, pipeline'
description: 'This tutorial demonstrates how to integrate SonarQube into pipelines.'
linkTitle: "Integrate SonarQube into Pipelines"
weight: 11310
---

[SonarQube](https://www.sonarqube.org/) is a popular continuous inspection tool for code quality. You can use it for static and dynamic analysis of a codebase. After it is integrated into pipelines in KubeSphere, you can view common code issues such as bugs and vulnerabilities directly on the dashboard as SonarQube detects issues in a running pipeline.

This tutorial demonstrates how you can integrate SonarQube into pipelines. Refer to the following steps first before you [create a pipeline using a Jenkinsfile](../../../devops-user-guide/how-to-use/create-a-pipeline-using-jenkinsfile/).

## Prerequisites

You need to [enable the KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).

## Install the SonarQube Server

To integrate SonarQube into your pipeline, you must install SonarQube Server first.

1. Install Helm first so that you can install SonarQube using the tool. For example, run the following command to install Helm 3:

   ```bash
   curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
   ```

   View the Helm version.

   ```bash
   helm version
   
   version.BuildInfo{Version:"v3.4.1", GitCommit:"c4e74854886b2efe3321e185578e6db9be0a6e29", GitTreeState:"clean", GoVersion:"go1.14.11"}
   ```

   {{< notice note >}}

   For more information, see [the Helm documentation](https://helm.sh/docs/intro/install/).

   {{</ notice >}} 

2. Execute the following command to install SonarQube Server.

   ```bash
   helm upgrade --install sonarqube sonarqube --repo https://charts.kubesphere.io/main -n kubesphere-devops-system  --create-namespace --set service.type=NodePort
   ```

3. You will get this prompt:

   ![sonarqube-install](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/sonarqube-install.png)

## Get the SonarQube Console Address

1. Execute the following command to get SonarQube NodePort.

   ```bash
   export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services sonarqube-sonarqube)
   export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
   echo http://$NODE_IP:$NODE_PORT
   ```

2. You can get the output as below (`31434` is the port number in this example, which may be different from yours):

   ```bash
   http://192.168.0.4:31434
   ```

## Configure the SonarQube Server

### Step 1: Access the SonarQube console

1. Execute the following command to view the status of SonarQube. Note that the SonarQube console is not accessible until SonarQube is up and running.

   ```bash
   $ kubectl get pod -n kubesphere-devops-system
   NAME                                       READY   STATUS    RESTARTS   AGE
   ks-jenkins-68b8949bb-7zwg4                 1/1     Running   0          84m
   s2ioperator-0                              1/1     Running   1          84m
   sonarqube-postgresql-0                     1/1     Running   0          5m31s
   sonarqube-sonarqube-bb595d88b-97594        1/1     Running   2          5m31s
   uc-jenkins-update-center-8c898f44f-m8dz2   1/1     Running   0          85m
   ```

2. Access the SonarQube console `http://{$Node IP}:{$NodePort}` in your browser and you can see its homepage as below:

   ![access-sonarqube-console](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/access-sonarqube-console.jpg)

3. Click **Log in** in the top right corner and use the default account `admin/admin`.

   ![log-in-page](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/log-in-page.jpg)

   {{< notice note >}}

   You may need to set up necessary port forwarding rules and open the port to access SonarQube in your security groups depending on where your instances are deployed.

   {{</ notice >}}

### Step 2: Create a SonarQube admin token

1. Click the letter **A** and select **My Account** from the menu to go to the **Profile** page.

   ![sonarqube-config-1](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/sonarqube-config-1.jpg)

2. Click **Security** and input a token name, such as `kubesphere`.

   ![sonarqube-config-2](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/sonarqube-config-2.jpg)

3. Click **Generate** and copy the token.

   ![sonarqube-config-3](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/sonarqube-config-3.jpg)

   {{< notice warning >}} 

   Make sure you do copy the token because you won't be able to see it again as shown in the prompt.

   {{</ notice >}}

### Step 3: Create a webhook server

1. Execute the following command to get the address of SonarQube Webhook.

   ```bash
   export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services ks-jenkins)
   export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
   echo http://$NODE_IP:$NODE_PORT/sonarqube-webhook/
   ```

2. Expected output:

   ```bash
   http://192.168.0.4:30180/sonarqube-webhook/
   ```

3. Click **Administration**, **Configuration** and **Webhooks** in turn to create a webhook. 

   ![sonarqube-webhook-1](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/sonarqube-webhook-1.jpg)

4. Click **Create**.

   ![sonarqube-webhook-3](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/sonarqube-webhook-3.jpg)

5. Input **Name** and **Jenkins Console URL** (i.e. the SonarQube Webhook address) in the dialog that appears. Click **Create** to finish.

   ![webhook-page-info](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/webhook-page-info.jpg)

### Step 4: Add the SonarQube configuration to ks-installer

1. Execute the following command to edit `ks-installer`.

   ```bash
   kubectl edit cc -n kubesphere-system ks-installer
   ```

2. Navigate to `devops`. Add the field `sonarqube` and specify `externalSonarUrl` and `externalSonarToken` under it.

   ```yaml
   devops:
     enabled: true
     jenkinsJavaOpts_MaxRAM: 2g
     jenkinsJavaOpts_Xms: 512m
     jenkinsJavaOpts_Xmx: 512m
     jenkinsMemoryLim: 2Gi
     jenkinsMemoryReq: 1500Mi
     jenkinsVolumeSize: 8Gi
     sonarqube: # Add this field manually.
       externalSonarUrl: http://192.168.0.4:31434 # The SonarQube IP address.
       externalSonarToken: f75dc3be11fd3d58debfd4e445e3de844683ad93 # The SonarQube admin token created above.
   ```

3. Save the file after you finish.

### Step 5: Add the SonarQube server to Jenkins

1. Execute the following command to get the address of Jenkins.

   ```bash
   export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services ks-jenkins)
   export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
   echo http://$NODE_IP:$NODE_PORT
   ```

2. You can get the output as below, which tells you the port number of Jenkins.

   ```bash
   http://192.168.0.4:30180
   ```

3. Access Jenkins with the address `http://Public IP:30180`. When KubeSphere is installed, the Jenkins dashboard is also installed by default. Besides, Jenkins is configured with KubeSphere LDAP, which means you can log in to Jenkins with KubeSphere accounts (e.g. `admin/P@88w0rd`) directly. For more information about configuring Jenkins, see [Jenkins System Settings](../../../devops-user-guide/how-to-use/jenkins-setting/).

   ![jenkins-login-page](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/jenkins-login-page.jpg)

   {{< notice note >}}

   You may need to set up necessary port forwarding rules and open the port `30180` to access Jenkins in your security groups depending on where your instances are deployed.

   {{</ notice >}} 

4. Click **Manage Jenkins** on the left.

   ![manage-jenkins](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/manage-jenkins.jpg)

5. Scroll down to **Configure System** and click it.

   ![configure-system](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/configure-system.jpg)

6. Navigate to **SonarQube servers** and click **Add SonarQube**.

   ![add-sonarqube](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/add-sonarqube.jpg)

7. Input **Name**, **Server URL** (`http://Node IP:port`) and **Server authentication token** (the SonarQube admin token). Click **Apply** to finish.

   ![sonarqube-jenkins-settings](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/sonarqube-jenkins-settings.jpg)

### Step 6: Add sonarqubeUrl to the KubeSphere Console

You need to specify `sonarqubeURL` so that you can access SonarQube directly from the KubeSphere console.

1. Execute the following command:

   ```bash
   kubectl edit  cm -n kubesphere-system  ks-console-config
   ```

2. Navigate to `client` and add the field `devops` with `sonarqubeURL` specified.

   ```bash
   client:
     version:
       kubesphere: v3.0.0
       kubernetes: v1.17.9
       openpitrix: v0.3.5
     enableKubeConfig: true
     devops: # Add this field manually.
       sonarqubeURL: http://192.168.0.4:31434 # The SonarQube IP address.
   ```

3. Save the file.

### Step 7: Restart Services

Execute the following commands.

```bash
kubectl -n kubesphere-system rollout restart deploy ks-apiserver
```

```bash
kubectl -n kubesphere-system rollout restart deploy ks-console
```

## Create a SonarQube Token for a New Project

You need a SonarQube token so that your pipeline can communicate with SonarQube as it runs.

1. On the SonarQube console, click **Create new project**.

   ![sonarqube-create-project](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/sonarqube-create-project.jpg)

2. Enter a project key, such as `java-demo`, and click **Set Up**.

   ![jenkins-projet-key](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/jenkins-projet-key.jpg)

3. Enter a project name, such as `java-sample`, and click **Generate**.

   ![generate-a-token](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/generate-a-token.jpg)

4. After the token is created, click **Continue**.

   ![token-created](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/token-created.jpg)

5. Choose **Java** and **Maven** respectively. Copy the serial number within the green box in the image below, which needs to be added in the [Credentials](../../../devops-user-guide/how-to-use/credential-management/#create-credentials) section if it is to be used in pipelines.

   ![sonarqube-example](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/sonarqube-example.jpg)

## View Results on the KubeSphere Console

After you [create a pipeline using the graphical editing panel](../../how-to-use/create-a-pipeline-using-graphical-editing-panel) or [create a pipeline using a Jenkinsfile](../../how-to-use/create-a-pipeline-using-jenkinsfile), you can view the result of code quality analysis. For example, you may see an image as below if SonarQube runs successfully.

![sonarqube-view-result](/images/docs/devops-user-guide/tool-integration/integrate-sonarqube-into-pipeline/sonarqube-view-result.jpg)