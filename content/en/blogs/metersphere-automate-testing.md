---
title: 'MeterSphere: Automate Your Testing in DevOps'
keywords: Kubernetes, KubeSphere, DevOps, MeterSphere
description: A quick introduction about how to use MeterSphere in KubeSphere Jenkins pipelines.
tag: 'Kubernetes, KubeSphere, DevOps, MeterSphere'
createTime: '2021-06-18'
author: 'Shaowen Chen, Felix'
snapshot: '/images/blogs/en/metersphere-automate-testing/metersphere-arch.png'
---

When it comes to DevOps, continuous integration (CI) or continuous delivery (CD) may be the most familiar solutions. In the software delivery process, testing also plays an important role. Is there a way to automate testing in DevOps? This blog will try to answer that question.

## What is MeterSphere

MeterSphere is a one-stop open source platform for continuous testing, offering features including testing tracking, interface testing, and performance testing. It also provides a management model for multi-tenancy and multiple roles to build a flexible tenancy system. With MeterSphere, development and testing teams can implement automated testing to accelerate the software delivery process.

Here is the architecture diagram of MeterSphere:

![metersphere-arch](/images/blogs/en/metersphere-automate-testing/metersphere-arch.png)

As **Docker Engine** and **Linux Host** appear on the architecture diagram, an idea occurs to me that it might be possible to use MeterSphere in KubeSphere DevOps pipelines. As a container platform built on top of Kubernetes, KubeSphere would be able to make full use of MeterSphere to boost DevOps workflows.

It's always better to put an idea into actions.

## Preparations

Now, let's make some preparations.

- Deploy [a KubeSphere instance](https://kubesphere.io/docs/quick-start/all-in-one-on-linux/) with [the KubeSphere DevOps System enabled](https://kubesphere.io/docs/pluggable-components/devops/).
- [Deploy MeterSphere on KubeSphere](https://kubesphere.io/docs/application-store/external-apps/deploy-metersphere/).
- Prepare a workspace, a DevOps project, and an account (`project-regular`) in KubeSphere. This account needs to be invited to the DevOps project with the `operator` role. If you need more information, check out [Create Workspaces, Projects, Accounts and Roles](https://kubesphere.io/docs/quick-start/create-workspace-and-project/).

## Use MeterSphere in KubeSphere DevOps Pipelines

### Create API Keys on MeterSphere

1. Log in to the MeterSphere console. Go to **API Keys** under **Personal Info** and click **Create** to create API Keys.

   ![create-api-keys](/images/blogs/en/metersphere-automate-testing/create-api-keys.PNG)

2. You can view the API Keys after they are created. Copy the **Access Key**.

   ![api-key-created](/images/blogs/en/metersphere-automate-testing/api-key-created.PNG)

3. Click **Show** under **Secret Key** and you can copy the Secret Key.

   ![click-show](/images/blogs/en/metersphere-automate-testing/click-show.PNG)

   ![copy-secret-key](/images/blogs/en/metersphere-automate-testing/copy-secret-key.PNG)

### Configure Testing on MeterSphere

1. Go to **Manager** under the **Settings** page. Click **Create Project** to create a project.
2. Click <img src="/images/blogs/en/metersphere-automate-testing/env-config.png" height="15px"> to set the environment for the project.
3. Go to **Api Definition** under the **API** page. Add a submodule.
4. Click **Add** in the upper-right corner to create an API.
5. Click **Case** to create a testing case.
6. 

### Install MeterSphere plugin on Jenkins

1. KubeSphere DevOps is built on top of Jenkins. Log in to the Jenkins console and click **Manage Jenkins**. For more information about how to log in to the Jenkins console, check out [how to log in to Jenkins](https://kubesphere.io/docs/devops-user-guide/how-to-use/jenkins-setting/#log-in-to-jenkins-to-reload-configurations).

   ![click-manage-jenkins](/images/blogs/en/metersphere-automate-testing/click-manage-jenkins.PNG)

2. On the **Manage Jenkins** page, scroll down to **Manage Plugins** and click it.

   ![click-manage-plugins](/images/blogs/en/metersphere-automate-testing/click-manage-plugins.PNG)

3. Go to the **Advanced** tab and scroll down to **Upload Plugin**. Click the **Choose File** button to upload [the HPI file of MeterSphere plugin](https://github.com/metersphere/jenkins-plugin/releases/download/v1.7.3/metersphere-jenkins-plugin-v1.7.3.hpi). After you upload the HPI file, click **Upload** to continue.

   ![choose-file](/images/blogs/en/metersphere-automate-testing/choose-file.PNG)

5. You can see the installation status on the page. When the installation finishes, click **Go back to the top page**.


### Generate a pipeline snippet

1. Click **New Item** to create an item.

   ![click-new-item](/images/blogs/en/metersphere-automate-testing/click-new-item.PNG)

2. Set `metersphere-test` for the item name and select **Pipeline**. Click **OK** to continue.

   ![set-item-info](/images/blogs/en/metersphere-automate-testing/set-item-info.PNG)

3. Click **Save** directly to use the default settings.

   ![click-save](/images/blogs/en/metersphere-automate-testing/click-save.PNG)

4. On the **Pipeline metersphere-test** page, click **Pipeline Syntax**.

   ![click-pipeline-syntax](/images/blogs/en/metersphere-automate-testing/click-pipeline-syntax.PNG)

5. Select **metersphere:MeterSphere** from the drop-down list of **Sample Step** under **Steps**.

   ![select-metersphere](/images/blogs/en/metersphere-automate-testing/select-metersphere.PNG)

6. Input the MeterSphere API Keys created in the above step and the API Endpoint `http://<NodeIP>:<NodePort>`. You can set the rest values from the drop-down lists and then click **Generate Pipeline Script**.

   ![input-values](/images/blogs/en/metersphere-automate-testing/input_values.png)

   {{< notice note >}}

   This blog uses the workspace `demo-workspace` and the project `demo` from MeterSphere for demonstration purposes. You need to create workspaces and projects, and configure test cases on MeterSphere first, or there will not be available items from the drop-down lists shown in the above image.

   {{</ notice >}}

7. You will see the following output:

   ![snippet-output](/images/blogs/en/metersphere-automate-testing/snippet_output.png)

### Create a pipeline on KubeSphere

1. Log in to the web console of KubeSphere as `project-regular`. In your DevOps project, go to **Pipelines** and then click **Create**.

2. Set `metersphere-pipeline` for **Name** and click **Create** on the **Advanced Settings** page to use the default configurations.

   ![set-pipeline-name](/images/blogs/en/metersphere-automate-testing/set-pipeline-name.PNG)

   ![click-create-pipeline](/images/blogs/en/metersphere-automate-testing/click-create-pipeline.PNG)

3. Click the pipeline in the list to go to its detail page and then click **Edit Jenkinsfile**.

   ![edit-jenkinsfile](/images/blogs/en/metersphere-automate-testing/edit-jenkinsfile.PNG)

4. In the dialog that appears, input the following pipeline script based on the snippet generated by Jenkins in the previous step, and then click **OK**.

   ```
   node('base') {
       stage('stage-zewwa') {
         meterSphere method: 'single',
         msAccessKey: 'O4baJHYpybhPizFS',
         msEndpoint: 'http://192.168.0.3:31397/',
         msSecretKey: 'tIKidlPrpZFJgGl9',
         projectId: 'e72714e2-dfc5-4370-a9bc-f17e596caf66',
         result: 'jenkins',
         testCaseId: '2fc3210b-6c99-4633-9701-1a8941640018',
         testPlanId: '',
         workspaceId: 'f9dbbadb-0d0c-4d2e-bf6d-0e996d92899d'
        }
   }
   ```

   ![pipeline-script](/images/blogs/en/metersphere-automate-testing/pipeline_script.png)

   {{< notice note >}}

   Make sure you change the values of the following fields to the values generated on your Jenkins console: `msAccessKey`, `msSecretKey`, `msEndpoint`, `projectId`, `testCaseId` and `workspaceId`.

   {{</ notice >}}

5. Click **Run** to run the pipeline.

   ![run-pipeline](/images/blogs/en/metersphere-automate-testing/run-pipeline.PNG)

6. Wait for a while and you can see the pipeline reaches the status of **Success** under the **Activity** tab. Click it to view its details.

   ![pipeline-success](/images/blogs/en/metersphere-automate-testing/pipeline-success.PNG)

7. On the detail page, you can click **Show Logs** in the upper right corner to view the logs.

   ![show-logs](/images/blogs/en/metersphere-automate-testing/show-logs.PNG)

   ![view-logs](/images/blogs/en/metersphere-automate-testing/view-logs.PNG)
   
8. You can view the test report on the console of MeterSphere and click it to view its details.

   ![test-report](/images/blogs/en/metersphere-automate-testing/test-report.PNG)

   ![test-report-detail](/images/blogs/en/metersphere-automate-testing/test-report-detail.PNG)

## Recap

DevOps is all about improving efficiency in the software development and delivery process. MeterSphere makes continuous testing a reality throughout CI and CD workflows, which would facilitate the delivery of quality softwares. The integration of MeterSphere and DevOps pipelines running on container platforms (for example, KubeSphere) deserves more attention from us.

## See Also

[MeterSphere GitHub Repository](https://github.com/metersphere/metersphere)



