---
title: "How to integrate SonarQube in Pipeline"
keywords: 'kubernetes, docker, devops, jenkins, sonarqube'
description: ''
linkTitle: "Integrate SonarQube in Pipeline"
weight: 200
---

## Prerequisites

- You need to [enable KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).

## Install SonarQube Server(Optional, if you don't)

Execute the following command to install Sonarqube Server:

```bash
helm upgrade --install sonarqube sonarqube --repo https://charts.kubesphere.io/main -n kubesphere-devops-system  --create-namespace --set service.type=NodePort
```

You will get this prompt:

![](/images/devops/sonarqube-install.png)

## Get Address of Sonarqube Console

Execute the following command to get SonarQube NodePort. As you can see `31331` is returned in this example:

```bash
export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services sonarqube-sonarqube)
export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT
```

## Configuration of Sonarqube Server

### Access SonarQube Console

Now access SonarQube console `http://{$Node IP}:{$NodePort}` in your browser using the default account `admin / admin`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003216.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003240.png)

{{< notice note >}}
Make sure you have set up necessary port forwarding rules and open the port to access SonarQube in your security groups.
{{</ notice >}}

### Create SonarQube Admin Token

1. Click `My Account` go to the personal page.

![](/images/devops/sonarqube-config-1.png)

2. Click `Security` and input a token name, such as kubesphere.

![](/images/devops/sonarqube-config-2.png)

3. Click `Generate` and copy the token.

![](/images/devops/sonarqube-config-3.png)

### Create a Webhook Server

Execute the following command to get the address of Sonarqube Webhook

```bash
export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services ks-jenkins)
export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT/sonarqube-webhook/
```

Click in turn `Administration –> Configuration –> Webhooks` to create a webhook. 

![](/images/devops/sonarqube-webhook-1.png)

Input Name and Jenkins Console URL.

![](/images/devops/sonarqube-webhook-2.png)

## Configuration of KubeSphere

### Add Configuration of Sonarqube to ks-installer

```bash
kubectl edit cc -n kubesphere-system ks-installer
```

Add externalSonarUrl and externalSonarToken and save it.

![](/images/devops/sonarqube-token-1.png)

### Add Sonarqube Server to Jenkins

Execute the following command to get the address of Jenkins.

```bash
export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services ks-jenkins)
export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT
```

In the page of Jenkins UI, you also need to add Sonarqube Server.

![](/images/devops/sonarqube-config.png)

### Add SonarqubeUrl to Kubesphere Console

In order to be able to click directly from the UI page to jump to the Sonarqube page, you need to configure the following

```bash
kubectl edit  cm -n kubesphere-system  ks-console-config
```

Add the following:

```bash
client:
    devops:
        sonarqubeURL: http://192.168.6.11:31331
```

### Restart Services to Make All Effective

```bash
kubectl -n kubesphere-system rollout restart deploy ks-apiserver
```

```bash
kubectl -n kubesphere-system rollout restart deploy ks-console
```

## Create SonarQube Token For New Projetct

1. Click **Create new project** then a pop-up page **Analyze a project** shows up.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213225325.png)

2. Enter a project name like `java-sample`，then click **Generate**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213230427.png)

3. At this point, we've got token as follows. Click **Continue**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213231314.png)

4. Choose **Java** and select `Maven` by default, please be aware that you just need to copy the highlighted serial number.

![](/images/devops/sonarqube-example.png)

## View the results on KubeSpher Console

Please refer to [Create a Pipeline - using Graphical Editing Panel](../../how-to-use/create-a-pipeline-using-graphical-editing-panel) or [Create a pipeline using jenkinsfile](../../how-to-use/create-a-pipeline-using-jenkinsfile) for configuration in the project.

Then, after running successfully, you will get:

![](/images/devops/sonarqube-view.png)