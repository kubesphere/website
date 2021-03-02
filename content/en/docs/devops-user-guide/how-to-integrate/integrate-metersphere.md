---
title: "Integrate MeterSphere into Pipelines"
keywords: 'Kubernetes, Docker, DevOps, Jenkins, MeterSphere'
description: 'How to integrate MeterSphere into pipelines'
linkTitle: "Integrate MeterSphere into Pipelines"
weight: 11330
---

This tutorial demonstrates how to integrate MeterSphere into KubeSphere pipelines.

## Prerequisites

- You need to enable [the KubeSphere DevOps System](../../../pluggable-components/devops/).
- You need to [deploy MeterSphere on KubeSphere](../../../application-store/external-apps/deploy-metersphere/).
- You need to create a workspace, a DevOps project, and an account (`project-regular`). This account needs to be invited to the DevOps project with the `operator` role. If they are not ready, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Create API Keys on MeterSphere

1. Log in to MeterSphere console. Go to **API Keys** under **Personal Info** and click **Create** to create API Keys.

   ![create-api-keys](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/create-api-keys.PNG)

2. You can view the API Keys after it is created. Copy the **Access Key**.

   ![api-key-created](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/api-key-created.PNG)

3. Click **Show** under **Secret Key** to copy the Secret Key.

   ![click-show](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/click-show.PNG)

   ![copy-secret-key](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/copy-secret-key.PNG)

### Step 2: Install MeterSphere plugin on Jenkins

1. Log in to Jenkins console and click **Manage Jenkins**. For more information about how to log in to Jenkins console, refer to [Integrate SonarQube into Pipelines](../sonarqube/#step-5-add-the-sonarqube-server-to-jenkins).

   ![click-manage-jenkins](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/click-manage-jenkins.PNG)

2. On the Manage Jenkins page, scroll down to **Manage Plugins** and click it.

   ![click-manage-plugins](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/click-manage-plugins.PNG)

3. Go to the **Advanced** tab and scroll down to **Upload Plugin**. Click the button next to **Files** to upload [the HPI file of MeterSphere plugin](https://github.com/metersphere/jenkins-plugin/releases/download/v1.7.3/metersphere-jenkins-plugin-v1.7.3.hpi).

   ![choose-file](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/choose-file.PNG)

4. After you upload the HPI file, click **Upload** to continue.

   ![click-upload](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/click-upload.PNG)

5. You can see the installation status on the page and make sure you select **Restart Jenkins when installation is complete and no jobs are running**. After the installation succeeds, Jenkins will restart.

   ![installation-success](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/installation-success.PNG)

6. Wait until Jenkins finishes restarting, log in and go to **Manage Plugins** under **Manage Jenkins** again. On the **Installed** tab, you can find the MeterSphere plugin just installed.

   ![installed-tab](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/installed-tab.PNG)

   ![metersphere-in-list](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/metersphere-in-list.PNG)

### Step 3: Generate a pipeline snippet

1. Click **New Item** to create an item.

   ![click-new-item](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/click-new-item.PNG)

2. Set `metersphere-test` for the item name and select **Pipeline**. Click OK to continue.

   ![set-item-info](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/set-item-info.PNG)

3. In this tutorial, click **Save** directly to use the default settings.

   ![click-save](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/click-save.PNG)

4. On the **Pipeline metersphere-test** page, click **Pipeline Syntax**.

   ![click-pipeline-syntax](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/click-pipeline-syntax.PNG)

5. Select **metersphere:MeterSphere** from the drop-down list of **Sample Step** under **Steps**.

   ![select-metersphere](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/select-metersphere.PNG)

6. Input the MeterSphere API Keys created in the above step and the API Endpoint `http://NodeIP:NodePort`. You can set the rest values from the drop-down lists and then click **Generate Pipeline Script**.

   ![input-values](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/input-values.PNG)

   {{< notice note >}}

   This tutorial uses the workspace `demo-workspace` and the project `demo` for demonstration purposes. You can create workspaces and projects and configure test cases on MeterSphere based on you needs. For more information about how to use MeterSphere, refer to [MeterSphere GitHub website](https://github.com/metersphere/metersphere/blob/master/README-EN.md).

   {{</ notice >}}

7. You will see the following output:

   ![snippet-output](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/snippet-output.PNG)

### Step 4: Create a pipeline

1. Log in to the web console of KubeSphere as `project-regular`. In your DevOps project, go to **Pipelines** and then click **Create**.

   ![create-pipeline](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/create-pipeline.PNG)

2. Set `metersphere-pipeline` for **Name** and click **Create** on the **Advanced Settings** page to use the default configurations.

   ![set-pipeline-name](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/set-pipeline-name.PNG)

   ![click-create-pipeline](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/click-create-pipeline.PNG)

3. Click the pipeline in the list to go to its detail page and then click **Edit Jenkinsfile**.

   ![click-pilepine-item](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/click-pilepine-item.PNG)

   ![edit-jenkinsfile](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/edit-jenkinsfile.PNG)

4. In the dialog that appears, input the following pipeline script based on the snippet generated by Jenkins in the previous step, and then click **OK**.

   ```
   node('base') {
       stage('stage-zewwa') {
         meterSphere method: 'single',
         msAccessKey: 'O4baJHYpybhPizFS',
         msEndpoint: 'http://103.61.37.135:31397/',
         msSecretKey: 'tIKidlPrpZFJgGl9',
         projectId: 'e72714e2-dfc5-4370-a9bc-f17e596caf66',
         result: 'jenkins',
         testCaseId: '2fc3210b-6c99-4633-9701-1a8941640018',
         testPlanId: '',
         workspaceId: 'f9dbbadb-0d0c-4d2e-bf6d-0e996d92899d'
        }
   }
   ```

   ![pipeline-script](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/pipeline-script.PNG)

5. Click **Run** to run the pipeline.

   ![run-pipeline](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/run-pipeline.PNG)

6. Wait for a while and you can see the pipeline reaches the status of **Success** under the **Activity** tab. Click it to view its details.

   ![pipeline-success](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/pipeline-success.PNG)

7. On the detail page, you can click **Show Logs** in the upper right corner to view the logs.

   ![show-logs](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/show-logs.PNG)

   ![view-logs](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/view-logs.PNG)
   
8. You can view the test report on the console of MeterSphere and click it to view its details.

   ![test-report](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/test-report.PNG)

   ![test-report-detail](/images/docs/devops-user-guide/tool-integration/integrate-metersphere/test-report-detail.PNG)