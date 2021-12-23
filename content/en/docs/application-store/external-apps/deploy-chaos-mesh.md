---
title: 'Deploy Chaos Mesh on KubeSphere'
tag: 'KubeSphere, Kubernetes, Applications, Chaos Engineering, Chaos experiments, Chaos Mesh'
keywords: 'Chaos Mesh, Kubernetes, Helm, KubeSphere'
description: 'Learn how to deploy Chaos Mesh on KubeSphere and start running chaos experiments.'
linkTitle: "Deploy Chaos Mesh on KubeSphere"
---

[Chaos Mesh](https://github.com/chaos-mesh/chaos-mesh) is a cloud-native Chaos Engineering platform that orchestrates chaos in Kubernetes environments. With Chaos Mesh, you can test your system's resilience and robustness on Kubernetes by injecting various types of faults into Pods, network, file system, and even the kernel.

![Chaos Mesh architecture](/images/docs/appstore/external-apps/deploy-chaos-mesh/chaos-mesh-architecture-v2.png)

## Enable App Store on KubeSphere 

1. Make sure you have installed and enabled the [KubeSphere App Store](https://kubesphere.io/docs/pluggable-components/app-store/).

2. You need to create a workspace, a project, and a user account (project-regular) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the operator role. For more information, see [Create Workspaces, Projects, Users and Roles](https://kubesphere.io/docs/quick-start/create-workspace-and-project/).

## Chaos experiments with Chaos Mesh

### Step 1: Deploy Chaos Mesh 
  
1. Login KubeSphere as `project-regular`, search for **chaos-mesh** in the **App Store**, and click on the search result to enter the app. 
      
    ![Chaos Mesh app](/images/docs/appstore/external-apps/deploy-chaos-mesh/chaos-mesh-app.png)
        
2.  In the **App Information** page, click **Install** on the upper right corner.

    ![Install Chaos Mesh](/images/docs/appstore/external-apps/deploy-chaos-mesh/install-chaos-mesh.png)
        
3. In the **App Settings** page, set the application **Name,** **Location** (as your Namespace), and **App Version**, and then click **Next** on the upper right corner.

    ![Chaos Mesh basic information](/images/docs/appstore/external-apps/deploy-chaos-mesh/chaos-mesh-basic-info.png)

4. Configure the `values.yaml` file as needed, or click **Install** to use the default configuration.

    ![Chaos Mesh configurations](/images/docs/appstore/external-apps/deploy-chaos-mesh/chaos-mesh-config.png)

5. Wait for the deployment to be finished. Upon completion, Chaos Mesh will be shown as **Running** in KubeSphere. 

    ![Chaos Mesh deployed](/images/docs/appstore/external-apps/deploy-chaos-mesh/chaos-mesh-deployed.png)


### Step 2: Visit Chaos Dashboard

1. In the **Resource Status** page, copy the **NodePort **of `chaos-dashboard`.
       
    ![Chaos Mesh NodePort](/images/docs/appstore/external-apps/deploy-chaos-mesh/chaos-mesh-nodeport.png)

2. Access the Chaos Dashboard by entering `${NodeIP}:${NODEPORT}` in your browser. Refer to [Manage User Permissions](https://chaos-mesh.org/docs/manage-user-permissions/) to generate a Token and log into Chaos Dashboard. 

    ![Login to Chaos Dashboard](/images/docs/appstore/external-apps/deploy-chaos-mesh/login-to-dashboard.png)

### Step 3: Create a chaos experiment

Before creating a chaos experiment, you should identify and deploy your experiment target, for example, to test how an application works under network latency. Here, we use a demo application `web-show` as the target application to be tested, and the test goal is to observe the system network latency. You can deploy a demo application `web-show` with the following command: `web-show`.   

```bash
curl -sSL https://mirrors.chaos-mesh.org/latest/web-show/deploy.sh | bash
```  
    
> Note: The network latency of the Pod can be observed directly from the web-show application pad to the kube-system pod.
    
1. From your web browser, visit ${NodeIP}:8081 to access the **Web Show** application.

    ![Chaos Mesh web show app](/images/docs/appstore/external-apps/deploy-chaos-mesh/web-show-app.png)

2. Log in to Chaos Dashboard to create a chaos experiment. To observe the effect of network latency on the application, we set the **Target **as "Network Attack" to simulate a network delay scenario. 

    ![Chaos Dashboard](/images/docs/appstore/external-apps/deploy-chaos-mesh/chaos-dashboard-networkchaos.png)
        
    The **Scope** of the experiment is set to `app: web-show`.

    ![Chaos Experiment scope](/images/docs/appstore/external-apps/deploy-chaos-mesh/chaos-experiment-scope.png)
        
3. Start the chaos experiment by submitting it. 

    ![Submit Chaos Experiment](/images/docs/appstore/external-apps/deploy-chaos-mesh/start-chaos-experiment.png)

Now, you should be able to visit **Web Show** to observe experiment results:    

![Chaos Experiment result](/images/docs/appstore/external-apps/deploy-chaos-mesh/experiment-result.png)