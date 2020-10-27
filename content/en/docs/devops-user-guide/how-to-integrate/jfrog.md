---
title: "Integrate Jrog Artifactory in Pipeline"
keywords: 'kubernetes, docker, devops, jenkins, jfrog'
description: 'Integrate Jfrog in Pipeline'
linkTitle: "Integrate Jfrog in Pipeline"
weight: 2400
---

## Prerequisites

- You need to [enable KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).
- You need to [Install Jfrog Artifactory](https://jfrog.com/artifactory/install/).

## Install Jfrog Artifactory

Create a volume

```bash
docker volume create artifactory-data
```

Pull the latest Artifactory Docker image

```bash
docker pull docker.bintray.io/jfrog/artifactory-pro:latest
```

Run the Artifactory Docker container

```bash
docker run -d --name artifactory -p 8082:8082 -p 8081:8081 -v artifactory-data:/var/opt/jfrog/artifactory docker.bintray.io/jfrog/artifactory-pro:latest
```

Now you can open Jfrog Repo UI

![](/images/devops/jfrog-devops-1.jpg)

Add the repo to your docker daemon to enable insecure registry

```bash
# cat /etc/docker/daemon.json
{
  "insecure-registries" : ["139.198.113.60:8082"]
}
```

Reload your docker daemon

```bash
systemctl reload docker
```

Login on the k8s node

```bash
# docker login -u admin -p P@88w0rd 139.198.113.60:8082
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

Until now the jfrog artifactory has already been prepared, you can go on to create your pipeline.

## Create Project Pipeline

Take the [project](https://github.com/kubesphere/devops-java-sample) as an example.

Firstly, you should create a namespace `kubesphere-sample-dev` to deploy your workload.

```bash
kubectl create ns kubesphere-sample-dev
```

Then, you can create credentials to make the senstive information invisible.

![](/images/devops/jfrog-devops-2-1.jpg)

Create a devops project pipeline

![](/images/devops/jfrog-devops-2.jpg)

You can directly edit pipeline directly to create pipeline step by step.

![](/images/devops/jfrog-devops-3-1.jpg)

Checkout your code.

![](/images/devops/jfrog-devops-3-2.jpg)

Build your code to generate artifactory and push then to the jfrog repo.

Specify the container named maven, then add nesting steps to do some shell scripts.

![](/images/devops/jfrog-devops-3-3.jpg)

Notice above, you have a credentialsId, which is to make the user/password invisible.

Tag the image and push then to the repo

![](/images/devops/jfrog-devops-3-4.jpg)

Deploy to Kubernetes

![](/images/devops/jfrog-devops-3-5.jpg)

Alternatively, you can edit the jenkinsfile directly, and paste the code to create the pipeline.

![](/images/devops/jfrog-devops-3.jpg)

```yaml
pipeline {
  agent {
    node {
      label 'maven'
    }
  }

    parameters {
        string(name:'TAG_NAME',defaultValue: '',description:'')
    }

    environment {
        DOCKER_CREDENTIAL_ID = 'jfrog'
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig'
        REGISTRY = '139.198.113.60:8082'
        DOCKERHUB_NAMESPACE = 'my-repo'
        GITHUB_ACCOUNT = 'kubesphere'
        APP_NAME = 'devops-java-sample'
    }

    stages {
        stage ('checkout scm') {
            steps {
                git branch: 'master', url: "https://github.com/kubesphere/devops-java-sample.git"
            }
        }

        stage ('build & push') {
            steps {
                container ('maven') {
                    sh 'mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package'
                    sh 'docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER .'
                    withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
                        sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
                        sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER'
                    }
                }
            }
        }

        stage('push latest'){
           steps{
                container ('maven') {
                  sh 'docker tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
                  sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
                }
           }
        }

        stage('deploy to dev') {
          steps {
            input(id: 'deploy-to-dev', message: 'deploy to dev?')
            kubernetesDeploy(configs: 'deploy/dev-ol/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
          }
        }
    }
}

```

Then you will find the stage show as follows:

![](/images/devops/jfrog-devops-4.jpg)

## Run the devops pipeline

Now, you can directly run the pipeline to deploy your application:

![](/images/devops/jfrog-devops-5.jpg)

You can find your docker image in the repo.

![](/images/devops/jfrog-devops-6.jpg)

Also, you can find the Docker infos.

![](/images/devops/jfrog-devops-7.jpg)

Congratulations, you have succeed use KubeSphere to deploy your application integrated with Jfrog.
