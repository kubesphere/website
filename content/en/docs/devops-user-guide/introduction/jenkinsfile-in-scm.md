---
title: "Jenkinsfile in scm"
keywords: "Kubernetes, docker, kubesphere, DevOps"
description: "The example of jenkinsfile DevOps"

linkTitle: "Jenkinsfile in scm"
weight: 400
---

Jenkinsfile in SCM means that the Jenkinsfile file itself is used as part of Source Control Management to quickly build CI/CD functional modules within a project, such as a Stage, based on the pipeline configuration information within the file. (Step) and tasks (Job). Therefore, the Jenkins file should be included in the code repository.

## Action Example

### Overview of the flow line

The following flowchart briefly illustrates the complete workflow of the pipeline.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190512155453.png)

> Process Description.
>
> - **Phase 1. Checkout SCM**: Pulling the GitHub Repository Code
> - **Phase 2. Unit test**: Unit test and continue with the following tasks only if the test passes.
> - **Phase 3. Build & push snapshot image**: Build the image based on the branch selected in the behavior policy and push the tag `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` to Harbor (where `$BUILD_NUMBER` is `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER`). pipeline activity list run sequence number).
> - **Stage 4. Push latest image**: Tag the master branch as latest and push it to DockerHub.
> - **Phase 5. Deploy to dev**: Deploy the master branch to the Dev environment, which needs to be audited.
> - **Phase 6. Push with tag**: Generate a tag, release it to GitHub, and push it to DockerHub.
> - **Phase 7. Deploy to production**: Deploy the published tag to the production environment.

## Create credentials

> Attention.
> - GitHub accounts or passwords with a special character like "@" that needs to be urlencoded before you can create credentials. to the corresponding Credential information.
> It is the Credential that needs to be created here, not the Secret.

In the Multi-tenant Management Quick Start the role of maintainer has been given to the project-regular, so log in to KubeSphere with project-regular and go to the created devops-demo project to start creating credentials.

1. this example code repository in the Jenkinsfile need to use **DockerHub, GitHub** and **kubeconfig** (kubeconfig for access to the running Kubernetes cluster) and so on a total of three credentials (credentials). with reference to [Create Credentials] (... /... /devops/credential/# create credentials) to create these three credentials in order.

3. Finally, enter the `devops-demo` DevOps project in KubeSphere, similar to the above steps, click **Create** under **Vouchers** to create a credential of type `secret text`, the credential ID is named **sonar-token**, and the key is the token information copied in the previous step, click **OK** when you are done.

After that, click **OK**. ![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-id.png)

At this point, the four credentials have been created, and the next step is to change the corresponding four credential IDs in the sample repository's jenkinsfile to the user-created credential IDs.

![](https://kubesphere-docs.pek3b.qingstor.com/png/credential-list-demo.png)

## Modify Jenkinsfile

### Step 1: Fork Project

Log in to GitHub and fork the GitHub repository [devops-java-sample](https://github.com/kubesphere/devops-java-sample) used in this example to your personal GitHub.

![](https://pek3b.qingstor.com/kubesphere-docs/png/fork-repo.png)

### Step 2: Modify Jenkinsfile

1. Fork to your personal GitHub and go to **Jenkinsfile-online** in the **root directory**.

![jenkins-online](https://kubesphere-docs.pek3b.qingstor.com/png/jenkinsonline.png)

2. If you click on the edit icon in the GitHub UI, you will need to change the value of the following environment variable.

You need to change the value of the environment variable (environment) in the following way: ![image-20190409121802459](https://kubesphere-docs.pek3b.qingstor.com/png/env.png)

| Modify | Value | Meaning |
| --- | --- | --- |
| DOCKER_CREDENTIAL_ID | dockerhub-id | Fill in the DockerHub credential ID from the credentials creation step to log in to your DockerHub | dockerhub-id
| GITHUB\_CREDENTIAL\_ID | github-id | Fill in the GitHub credential ID from the credential creation step to push the tag to the GitHub repository.
KUBECONFIG\_CREDENTIAL\_ID | demo-kubeconfig | kubeconfig credential ID for access to a running Kubernetes cluster | KUBECONFIG\_CREDENTIAL\_ID | demo-kubeconfig | kubeconfig credential ID for access to a running Kubernetes cluster
| REGISTRY | docker.io | Default docker.io domain name for image pushing.
|DOCKERHUB_NAMESPACE|your-dockerhub-account| replace it with your DockerHub account name <br> (which can also be the Organization name under the account) |
|GITHUB_ACCOUNT|your-github-account | replace it with your GitHub account name, e.g. `https://github.com/kubesphere/` with `kubesphere` (which can also be the name of the account's Organization Name)
| APP_NAME | devops-java-sample | application name | app_name

Note: The `-mvn` command in the `master` branch Jenkinsfile takes the parameter `-o`, which means offline mode is on. In this example, offline mode is enabled by default to adapt to network interference in some environments, and to avoid taking too long to download dependencies. ` -o`, which means offline mode is enabled by default.

3) After modifying the above environment variables, click **Commit changes** to commit the updates to the current master branch.

![Submitting Updates](https://kubesphere-docs.pek3b.qingstor.com/png/commit-jenkinsfile.png)

4. If you need to test the cache, you need to switch to the `dependency` branch and make similar changes to the Jenkinsfile-online under the `dependency` branch, otherwise the pipeline for that branch will fail to build.

## Create the project

The CI/CD pipeline will eventually deploy the examples to `kubesphere-sample` based on the [yaml template file](<https://github.com/kubesphere/devops-java-sample/tree/master/deploy>) of the example project. The two projects (Namespace) in the -dev` and `kubesphere-sample-prod` environments need to be created sequentially from the console in advance.

### Step 1: Create the first project

> Hint: Project administrator `project-admin` account is already in [Multi-tenant Management Quick Start](...) /quick-start/admin-quick-start). /quick-start/admin-quick-start).

1, use the `project-admin` account of the project administrator to log into KubeSphere, in the previously created enterprise space (demo-workspace), click **Project → Create** to create a **resource-based project**, as the development environment for this example, fill in the basic information of the project, after completion, click **Next**.


- Name: Fixed to `kubesphere-sample-dev`, if you want to change the project name, you can do so in the [yaml template file](<https://github.com/kubesphere/devops-java-sample/tree/master/deploy>). Modify namespace
- Aliases: customizable, e.g., **Development Environment**.
- Description Information: A brief description of the project is available for further user understanding.


2, this example has no resource requests and restrictions, so there is no need to modify the default value in the advanced settings, click **Create**, the project can be created successfully.

### Step 2: Inviting members

After the first project is created, you need `project-admin` to invite `project-regular` to the `kubesphere-sample-dev` project, go to `project settings` → `project members`, click on `Invite members` and select `invite`. project-regular` and assign the role of `operator` to it. For more information, see [Quickstart Multitenant Management - Inviting Members] (... /quick-start/admin-quick-start/... /quick-start/admin-quick-start/#invite members).

### Step 3: Create a second project

Similarly, refer to the above two steps to create a project named `kubesphere-sample-prod` as a production environment and invite the regular user `project-regular` into the `kubesphere-sample-prod` project and grant the role of `operator`.

> Description: The pipeline-created deployments and services will be visible in the `kubesphere-sample-dev` and `kubesphere-sample-prod` projects when subsequent executions of the CI/CD pipeline are successful.

![project](https://kubesphere-docs.pek3b.qingstor.com/png/project.png)

## Create a pipeline

### Step 1: Fill out basic information

1, enter the created DevOps project, select **Pipeline** on the left menu bar, and click **Create**.

![create-pipeline](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_create.png)

2, in the pop-up window, enter the basic information of the pipeline.

- Name: to create a simple and clear name for the pipeline, easy to understand and search
- DESCRIPTION INFORMATION: A brief introduction to the main features of the assembly line, to help further understand the role of the line
- Code repository: Click to select the code repository, the code repository must already exist in Jenkinsfile.

![basic_info](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_info.png)

### Step 2: Add Warehouse

1.Click on the code repository to add a Github repository as an example.

2. Click [Get Token](https://github.com/settings/tokens/new?scopes=repo,read:user,user:email,write:repo_hook) in the pop-up window.

![git_input](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_git_token.png).

3. Fill in the Token description on the GitHub access token page, and simply describe the token, such as the DevOps demo, without changing anything in the select scopes.

GitHub will generate a token of letters and numbers to access the GitHub repo for your current account. [access-token](https://kubesphere-docs.pek3b.qingstor.com/png/access-token-screenshot.png)

Copy the generated token, enter it in the KubeSphere Token box and click Save. 5.

5. After the validation, all the code repositories associated with the user will be listed on the right side of the Token, select one of them with Jenkinsfile. For example, select the ready sample repository [devops-java-sample](https://github.com/kubesphere/devops-java-sample), click ** to select this repository**, and then click **Next**.

![image-20190409122653070](https://kubesphere-docs.pek3b.qingstor.com/png/image-20190409122653070.png)

### Step 3: Advanced Settings

After completing the repository settings, you can enter the advanced settings page. Advanced settings support customization of pipeline build records, behavior policy, periodic scan and other settings.

1. In branch settings, check `Discard old branch`, the default is -1 for **keep branch days** and **keep branch max number**.

The default here is -1. [](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat6b0ca0cf57ea9c1eaf44dbac633bb459.png)

> Description.
>
> The options for the number of days to keep a branch and the maximum number of days to keep a branch can both be applied to a branch, and the branch will be discarded if the number of days to keep and the number of branches do not meet the conditions for either setting. If you set the hold days and number of days to 2 and 3, the branch will be discarded if it exceeds 2 or if it exceeds 3. The default value is -1, which means that branches that have been deleted will be discarded.
>
> Discarding Old Branches will determine when the branch record for the project should be discarded. Branch records include console output, archive artifacts, and other metadata associated with a particular branch. Keeping fewer branches saves disk space used by Jenkins, and we provide two options for determining when old branches should be discarded.
>
> - Number of days to keep a branch: if a branch has been around for a certain number of days, discards the branch.
> - Keep number of branches: if a certain number of branches already exist, discard the oldest branch.

KubeSphere adds three policies by default. Since this example has not used the policy PR** found in the **Fork repository, you can delete the policy here by clicking the delete button on the right.

Click the delete button on the right. [advice](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_advance-1.png)

> Description.
>
> supports adding three types of discovery policies. It is important to note that the PR (Pull Request) submitted by the developer is also treated as a separate branch when the Jenkins streamline is triggered.
>
> Discovery Branch.
>
> - Exclude branches that are also committed as PR: Selecting this means that CI will not scan source branches (such as Origin's master branch), i.e. branches that need to be merged.
> - Only branches that are committed as PR: Scan only PR branches
> - All branches: all branches in the pulled repository (origin)
>
> found in the original warehouse PR.
>
> Source version of the merged PR and target branch: one discovery operation to create and run a pipeline based on the source version of the merged PR and target branch.
> PR's own source code version: one discovery operation to create and run a pipeline based on PR's own source code version
> When PR is discovered, two pipelines are created, one using the source version of PR itself and one using the merged source version of PR and the target branch: two pipelines are created, the first using the source version of PR itself and the second using the merged source version of PR and the target branch.

3. The default **script path** is **Jenkinsfile**, please change it to [**Jenkinsfile-online**](https://github.com/kubesphere/devops-java-sample/blob/master/). Jenkinsfile-online).

> Note: The path is the path of the Jenkinsfile in the code repository, indicating that it is in the root directory of the sample repository, or the script path if the file location is changed.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190505212550.png)

4: In ** Scan Repo Trigger**, check ``If no scan trigger, then scan periodically``, the scan interval can be set according to the team's custom, this example is set to `5 minutes`.

> Description: Periodic scan is to set a period for the pipeline to periodically scan the remote repositories, according to the **behavior policy** to see if the repository has any code updates or new PRs.
>
> Webhook Push.
>
> Webhook is an efficient way for a pipeline to discover changes in remote repositories and trigger new runs automatically, and GitHub and Git (such as Gitlab) should use Webhook as the primary way to trigger automatic Jenkins scans, with the above step in KubeSphere setting up regular scans. In this example, you can run the pipeline manually, but if you want to set up a remote branch to automatically scan and trigger a run.

When you're done with the advanced settings, click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190505212814.png)

### Step 4: Run the line

When you click the **Refresh** button in your browser after the streamline is created, you will see the build logs of the `master` and `dependency` branches.
The two build logs for the `master` and `dependency` branches are visible. ![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatb68b13f091b9e9ec52ee3ff12dd5dd8e.png)

1) Click **Run** on the right side of the repository, it will automatically scan the branches in the repository according to the **behavior policy** in the previous step.

2) Since `TAG_NAME: defaultValue` in the Jenkinsfile-online does not have a default value, you can enter a tag number for `TAG_NAME` here, such as v0.0.1. 3) Click **OK**.

3. Click **OK**, a new pipeline activity will be generated to start running.

> Note: tag is used to generate a release and image with tag in Github and DockerHub respectively. Note: When actively running a pipeline for release, `TAG_NAME` should not duplicate the name of the `tag` existing in the repository, as duplication will cause the pipeline to fail.

If so, the pipeline will fail. [Run the pipeline](https://kubesphere-docs.pek3b.qingstor.com/png/run-pipeline-demo1.png)

At this point, the pipeline is created and running.

> Note: Click **Branch** to switch to the list of branches and see exactly which branches the pipeline is running on, in this case depending on the discovery branch policy from the previous step **Behavior Policy**.

![View Pipeline](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_scan.png)

### Step 5: Audit the pipeline

For demonstration purposes, the current account is used for auditing by default, and when the pipeline reaches the `input` step, the state will pause and you will need to manually click **Continue** for the pipeline to continue. Note that there are three stages defined in Jenkinsfile-online for deploying to the Dev and Production environments and for pushing tags, so the pipeline needs to `deploy to dev`, push with tag, deploy If you do not audit or click **Terminate**, the line will not continue to run.

![Audit Pipeline](https://kubesphere-docs.pek3b.qingstor.com/png/devops_input.png)

> The `input` step in the Jenkinsfile allows you to specify a user to audit the pipeline, for example, a user named project. -admin user to audit, you can append a field to the Jenkinsfile's input function, separated by commas if there are multiple users, as follows.

```groovy
-------
input(id: 'release-image-with-tag', message: 'release-image with tag?', submitter: 'project-admin,project-admin1')
-------
```

## See the assembly line

1. click on the pipeline in the `Activity` list under the currently running pipeline serial number, the page shows the running state of each step in the pipeline, note that the pipeline has just been created in the initialization phase, may only display the log window, after the completion of the initialization (about a minute) to see the pipeline. The black boxes label the pipeline steps. In the example, there are 8 stages in the pipeline, which are listed in [Jenkinsfile-online](https://github.com/kubesphere/devops-java-sample/blob/master/Jenkinsfile). is defined in the -online).

![stage](https://kubesphere-docs.pek3b.qingstor.com/png/stage.png)

2. Click `View Log` on the upper right of the current page to view the pipeline operation log. The page shows the specific logs of each step, running status and time and other information, click on a specific stage on the left side can expand to see its specific logs. The logs can be downloaded locally. If there is an error, it is easier to analyze and locate the problem by downloading locally.

If there is an error, it will be easier to analyze and locate the problem. [log](https://kubesphere-docs.pek3b.qingstor.com/png/log.png)

## Verify the results

1. If the pipeline is successful, click `Code Quality` under the pipeline to see the results of the code quality check by sonarQube, as shown below (for reference only).

The following figure is for reference only. [](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-result.png)

The final Docker image in the pipeline will also be successfully pushed to DockerHub, where we have configured DockerHub in Jenkinsfile-online, logged into DockerHub to view the push result of the image, and we can see the tag The images of snapshot, TAG_NAME(master-1), and latest have been pushed to DockerHub, and a new tag and release have been generated on GitHub. To the `kubesphere-sample-dev` and `kubesphere-sample-prod` project environments of KubeSphere.

| Environment | access address| Project (Namespace)|Deployment |Service|
| :--------- | :------------------------------------- | :------------------- | :---------------- | :------------- |
| Dev | `http://{$Virtual IP}:{$8080}` <br> or `http://{$Intranet/Public IP}:{$30861}` | kubesphere-sample-dev | ks-sample-dev | ks-sample- dev
| Production | `http://{$Virtual IP}:{$8080}` <br> or `http://{$Intranet/Public IP}:{$30961}` | kubesphere-sample-prod | ks-sample | ks- sample

You can use KubeSphere to go back to the project list and view the status of deployments and services in each of the two previously created projects in turn. For example, here is a list of deployments under the `kubesphere-sample-prod` project.

Go to that project and click **Workload → Deployment** in the left menu bar and you can see that ks-sample has been created successfully. Normally, the status of the deployment should show **Running**.

![sample](https://pek3b.qingstor.com/kubesphere-docs/png/20190426084733.png)

4, in the menu bar, select **Network and Services → Services** to view the corresponding created services, you can see that the service's Virtual IP is `10.233.42.3`, and the exposed NodePort is `30961`.

**View Service**

![service](https://kubesphere-docs.pek3b.qingstor.com/png/service.png)

5: Looking at the image pushed to your personal DockerHub, you can see that `devops-java-sample` is the value of APP_NAME, and the tag is also the tag defined in jenkinsfile-online.

The tag is also defined in the jenkinsfile-online. [View DockerHub](https://kubesphere-docs.pek3b.qingstor.com/png/deveops-dockerhub.png)

6. Click `release` and look at the `v0.0.1` tag and release that Fork has added to your personal GitHub repo, which is generated by the `push with tag` in the jenkinsfile.

## Accessing the sample service

To access the deployed demo service in an intranet environment, either log in to the cluster node via SSH or use the cluster administrator to log in to KubeSphere Verify access by entering the following command in the web kubectl, where Virtual IP and NodePort can be viewed in the service under the corresponding project.

**Example service to validate a Dev environment**.

```shell
# curl {$Virtual IP}:{$Port} or curl {$Internal IP}:{$NodePort}
curl 10.233.40.5:8080
Really appreaciate your star, that's the power of our life.
```

Virtual IP in

**Example service to validate the Prodcution environment**

```shell
# curl {$Virtual IP}:{$Port} or curl {$Internal IP}:{$NodePort}
curl 10.233.42.3:8080
Really appreaciate your star, that's the power of our life.
```

If both services can be accessed successfully, the results of the pipeline run are also as expected.

> Tip: If you need to access the service from an external network, you may need to bind the public network EIP and configure port forwarding and firewall rules. In the port forwarding rule, forward **internet port** such as 30861 to **source port** 30861, and then open this **source port** in the firewall to ensure that external traffic can pass through this port before external access. 

At this point, you have a Jenkinsfile in SCM type pipeline based on GitHub and DockerHub. 

## devops cache test

If you want to test how well this example uses the cache, after the first automatically triggered `dependency` branch is built, you can manually trigger `dependency` branch again to build.

1. Click **Run** on the right side, it will automatically scan the branches in the repository according to the **behavior policy** you set earlier. The system will load the Jenkinsfile-online based on the branch you entered (the default is Jenkinsfile in the root directory).
![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatbdd81b896658a6958a1b315592db2306.png)

2, The pipeline starts running and waits for its build to finish.
![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatfcb5ea2d1f042a12f9120f234148ced6.png)

It can be found that the second build utilizes the dependencies cached in the first build, eliminating the need for another dependency download.
