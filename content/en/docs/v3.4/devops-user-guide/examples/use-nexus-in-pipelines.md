---
title: "Use Nexus in Pipelines"
keywords: 'KubeSphere, Kubernetes, Pipeline, Nexus, Jenkins'
description: 'Learn how to use Nexus in pipelines on KubeSphere.'
linkTitle: "Use Nexus in Pipelines"
weight: 11450
version: "v3.4"
---

[Nexus](https://www.sonatype.com/products/repository-oss) is a repository manager that stores, organizes, and distributes artifacts. With Nexus, developers can have better control over the artifacts needed in a development process.

This tutorial demonstrates how to use Nexus in pipelines on KubeSphere.

## Prerequisites

- You need to [enable the KubeSphere DevOps System](../../../pluggable-components/devops/).
- You need to [prepare a Nexus instance](https://help.sonatype.com/repomanager3/installation).
- You need to have a [GitHub](https://github.com/) account.
- You need to create a workspace, a DevOps project (for example, `demo-devops`), and a user (for example, `project-regular`). This account needs to be invited into the DevOps project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Get a Repository URL on Nexus

1. Log in to the Nexus console as `admin` and click <img src="/images/docs/v3.x/devops-user-guide/examples/use-nexus-in-pipeline/gear.png" height="18px" alt="icon" /> on the top navigation bar.

2. Go to the **Repositories** page and you can see that Nexus provides three types of repository.

   - `proxy`: the proxy for a remote repository to download and store resources on Nexus as cache.
   - `hosted`: the repository storing artifacts on Nexus.
   - `group`: a group of configured Nexus repositories.

3. You can click a repository to view its details. For example, click **maven-public** to go to its details page, and you can see its **URL**.

### Step 2: Modify `pom.xml` in your GitHub repository

1. Log in to GitHub. Fork [the example repository](https://github.com/devops-ws/learn-pipeline-java) to your own GitHub account.

2. In your own GitHub repository of **learn-pipeline-java**, click the file `pom.xml` in the root directory.

3. Click <img src="/images/docs/v3.x/devops-user-guide/examples/use-nexus-in-pipeline/github-edit-icon.png" height="18px" alt="icon"  /> to modify the code segment of `<distributionManagement>` in the file. Set the `<id>` and use the URLs of your own Nexus repositories. 

   ![modify-pom](/images/docs/v3.x/devops-user-guide/examples/use-nexus-in-pipeline/modify-pom.png)

4. When you finish, click **Commit changes** at the bottom of the page.

### Step 3: Modify the ConfigMap

1. Log in to the KubeSphere web console as `admin`, click **Platform** in the upper-left corner, and select **Cluster Management**.

2. Select **ConfigMaps** under **Configuration**. On the **ConfigMaps** page, select `kubesphere-devops-worker` from the drop-down list and click `ks-devops-agent`.

3. On the details page, click **Edit YAML** from the **More** drop-down menu.

4. In the displayed dialog box, scroll down, find the code segment of `<servers>`, and enter the following code:

   ```yaml
   <servers>
     <server>
       <id>nexus</id>
       <username>admin</username>
       <password>admin</password>
     </server>
   </servers>
   ```

   ![enter-server-code](/images/docs/v3.x/devops-user-guide/examples/use-nexus-in-pipeline/enter-server-code.png)

   {{< notice note >}}

   `<id>` is the unique identifier you set for your Nexus in step 2. `<username>` is your Nexus username. `<password>` is your Nexus password. You can also configure a `NuGet API Key` on Nexus and use it here for better security.

   {{</ notice >}}

5. Continue to find the code segment of `<mirrors>` and enter the following code:

   ```yaml
   <mirrors>
     <mirror>
       <id>nexus</id>
       <name>maven-public</name>
       <url>http://135.68.37.85:8081/repository/maven-public/</url>
       <mirrorOf>*</mirrorOf>
     </mirror>
   </mirrors>
   ```

   ![enter-mirror-code](/images/docs/v3.x/devops-user-guide/examples/use-nexus-in-pipeline/enter-mirror-code.png)

   {{< notice note >}}

   `<id>` is the unique identifier you set for your Nexus in step 2. `<name>` is the Nexus repository name. `<url>` is the URL of your Nexus repository. `<mirrorOf>` is the Maven repository to be mirrored. In this tutorial, enter `*` to mirror all Maven repositories. For more information, refer to [Using Mirrors for Repositories](https://maven.apache.org/guides/mini/guide-mirror-settings.html).

   {{</ notice >}}

6. When you finish, click **OK**.

### Step 4: Create a pipeline

1. Log out of the KubeSphere web console and log back in as `project-regular`. Go to your DevOps project and click **Create** on the **Pipelines** page.

2. On the **Basic Information** tab, set a name for the pipeline (for example, `nexus-pipeline`) and click **Next**.

3. On the **Advanced Settings** tab, click **Create** to use the default settings.

4. Click the pipeline name to go to its details page and click **Edit Jenkinsfile**.

5. In the displayed dialog box, enter the Jenkinsfile as follows. When you finish, click **OK**.

   ```groovy
   pipeline {
       agent {
         node {
           label 'maven'
         }
       }
       stages {
           stage ('clone') {
               steps {
                   git 'https://github.com/Felixnoo/learn-pipeline-java.git'
               }
           }
           
           stage ('build') {
               steps {
                   container ('maven') {
                       sh 'mvn clean package'
                   }
               }  
           }
           
           stage ('deploy to Nexus') {
               steps {
                   container ('maven') {
                       sh 'mvn deploy -DaltDeploymentRepository=nexus::default::http://135.68.37.85:8081/repository/maven-snapshots/'
                   }   
               }
           }
           stage ('upload') {
               steps {
                   archiveArtifacts artifacts: 'target/*.jar', followSymlinks: false
               }
           }
       }
   }
   ```

   {{< notice note >}}

   You need to replace the GitHub repository address with your own. In the command from the step in the stage `deploy to Nexus`, `nexus` is the name you set in `<id>` in the ConfigMap and `http://135.68.37.85:8081/repository/maven-snapshots/` is the URL of your Nexus repository. 
   
   {{</ notice >}}

### Step 5: Run the pipeline and check results

1. You can see all the stages and steps shown on the graphical editing panels. Click **Run** to run the pipeline.

2. After a while, you can see the pipeline status shown as **Successful**. Click the **Successful** record to see its details.

3. You can click **View Logs** to view the detailed logs.

4. Log in to Nexus and click **Browse**. Click **maven-public** and you can see all the dependencies have been downloaded.

   ![maven-public](/images/docs/v3.x/devops-user-guide/examples/use-nexus-in-pipeline/maven-public.png)

5. Go back to the **Browse** page and click **maven-snapshots**. You can see the JAR package has been uploaded to the repository.

   ![maven-snapshots](/images/docs/v3.x/devops-user-guide/examples/use-nexus-in-pipeline/maven-snapshots.png)



