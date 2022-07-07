---
title: 'Deploy Litmus on KubeSphere'
tag: 'KubeSphere, Kubernetes, Applications, Chaos engineering, Chaos experiments, Litmus'
keywords: 'Litmus,LitmusChaos,Kubernetes,Helm,KubeSphere'
description: 'Learn how to deploy Litmus on KubeSphere and create chaos experiments.'
linkTitle: "Deploy Litmus on KubeSphere"
Weight: 14350
---

[Litmus](https://litmuschaos.io/) is an open-source, cloud-native chaos engineering toolkit that focuses on simulating failure tests on Kubernetes clusters. It helps developers and SREs find vulnerabilities in clusters and programs, therefore improving the robustness of the system.

The Litmus architecture is as follows. For details about the Litmus architecture, see [Litmus Docs](https://litmusdocs-beta.netlify.app/docs/architecture/).

![](https://pek3b.qingstor.com/kubesphere-community/images/20210601004600.png)

This tutorial demonstrates how to deploy Litmus on KubeSphere and create chaos experiments.

## Prerequisites
- You need to enable the [KubeSphere App Store (OpenPitrix)](https://v3-1.docs.kubesphere.io/docs/pluggable-components/app-store/).
- You need to create a workspace, a project, and two accounts (`ws-admin` and `project-regular`). For more information, see [Create Workspaces, Projects, Accounts, and Roles](https://v3-1.docs.kubesphere.io/docs/quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Add an app repository
1. In your workspace, go to **App Repositories** under **App Management**, and then click **Add**.

2. In the dialog that appears, set a name for the repository (for example, `litmus`) and enter the URL `https://litmuschaos.github.io/litmus-helm/`. Click **Validate** to verify the URL. Click **OK** to continue.

3. The app repository displays in the list after it is successfully imported.

### Step 2: Deploy the Litmus portal
1. Log out of the KubeSphere console and log back in as `project-regular`. In your project, go to **Apps** under **Application Workloads**, and then click **Create**.

2. In the dialog that appears, choose **From App Template**.

   - **From App Store**: Select apps from the official APP Store of Kubephere.

   - **From App Template**: Select apps from workspace app templates and the third-party Helm app templates of App Repository.

3. In the drop-down list, choose `litmus`, and then choose `litmus-2-0-0-beta`.

4. You can view the app information and chart files. Under **Versions**, select a specific version and click **Install**.

5. Under **Basic Information**, set a name for the app. Check the app version and the deployment location, and then click **Next**.
   
6. Under **App Settings**, you can edit the yaml file or directly click **Install**.
   
7. The app displays in the list after you create it successfully.
   
   {{< notice note>}}
   
   It may take a while before Litmus is running. Please wait for the deployment to finish.
   
   {{</ notice>}}

### Step 3: Access Litmus portal

1. Go to **Services** under **Application Workloads**, copy the `NodePort` of `litmusportal-frontend-service`.

2. You can access Litmus `Portal` through `${NodeIP}:${NODEPORT}` using the default username and password (`admin`/`litmus`).

   ![litmus-login-page](/images/docs/v3.3/appstore/external-apps/deploy-litmus/litmus-login-page.png)

   ![litmus-login-1](/images/docs/v3.3/appstore/external-apps/deploy-litmus/litmus-login-1.png)

   {{< notice note >}}
    You may need to open the port in your security groups and configure port forwarding rules depending on where your Kubernetes cluster is deployed. Make sure you use your own `NodeIP`.
    {{</ notice >}}

### Step 4: Deploy Agent (optional)

The Litmus `Agent` can be classified into `Self-Agent` and `External-Agent`. By default, the cluster where Litmus is installed is automatically registered as `Self-Agent`, and `Portal` defaults to run chaos experiments in `Self-Agent`.

![](https://pek3b.qingstor.com/kubesphere-community/images/20210604162858.png)

For details about how to deploy External Agent, see [Litmus Docs](https://litmusdocs-beta.netlify.app/docs/agent-install).

### Step 5: Create chaos experiments

- **Experiment 1**

1. You need to create a test application on your cluster. For example, you can deploy `nginx` using the following command:

   ```bash
   $ kubectl create deployment nginx --image=nginx --replicas=2 --namespace=default
   ```

2. Log in to Litmus `Portal`, and then click **Schedule workflow**.

3. Choose an `Agent` (for example, `Self-Agent`), and then click **Next**.

4. Choose **Create a new workflow using the experiments from MyHub**. In the drop-down list, select **Chaos Hub**, and then click **Next**.

5. Set a name for the workflow (for example, `pod-delete`). You can also add a description for the workflow. Click **Next**.

6. Click **Add a new experiment** to add a chaos experiment to the workflow. Click **Next**.

7. Select an experiment (for example, `generic/pod-delete`), and then click **Done**.

8. Select a point to adjust the weight of the experiment in the workflow. Click **Next**.

9. Choose **Schedule now**, and then click **Next**.

10. Verify the workflow, and then click **Finish**.

    On the KubeSphere console, you can see that a Pod is being deleted and recreated.

    On the Litmus `Portal`, you can see that the experiment is successful.

    ![litmus-successful](/images/docs/v3.3/appstore/external-apps/deploy-litmus/litmus-successful.png)

    You can click a specific workflow node to view its detailed logs.

    ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604165915.png)


- **Experiment 2**

1. Perform steps 1 to 10 in **Experiment 1** to create a new chaos experiment (`pod-cpu-hog`).
   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604171414.png)

2. On the KubeSphere console, you can see that the pod CPU usage is close to 1 core.

- **Experiment 3**

1. Set the `nginx` replica to `1`. You can see there is only one pod left and view the Pod IP address.

2. Perform steps 1 to 10 in **Experiment 1** to create a new chaos experiment (`pod-network-loss`).

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210604174057.png)

   You can ping the Pod IP address to test the packet loss rate.

   ![packet-loss-rate](/images/docs/v3.3/appstore/external-apps/deploy-litmus/packet-loss-rate.png)

   {{< notice note >}}

   The preceding experiments are conducted on Pods. You can also experiment on nodes and other Kubernetes components. For details about the chaos experiments, see [Litmus ChaosHub](https://hub.litmuschaos.io/).

   {{</ notice >}}
