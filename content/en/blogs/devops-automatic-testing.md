---
title: 'Use KubeSphere DevOps to Build an Automated Testing System'
tag: 'KubeSphere,Kubernetes'
createTime: '2021-04-13'
author: 'Shaowen Chen, Felix, Sherlock'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200428175258.png'
---

## Layers of Testing

The purpose of testing is to verify expected functionality and find potential defects. Testing enhances the confidence in delivering qualified products and also brings the possibility of agile iteration. It is safe to say that testing determines the product development progress.

As you may already know, in networking, there are 7 layers of OSI model and 4 layers of TCP model. In development, we also have different patterns such as MTV, MVC, MVP, and MVVM. These technologies have become more mature featuring high cohesion, low coupling, and division of responsibilities, modules, and layers. They have helped us build architectures and standards.

Likewise, we also have different types of testing - UI testing, API testing, and unit testing. Testing is a way to balance output and cost rather than a new type of technology.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200428175258.png)

You can see from the pyramid of testing shown in the above image that the higher layer of testing entails higher cost, stricter environment requirements, longer implementation period, and more careful maintenance. However, the higher the layer of testing gets, the closer it is to the end-user scenario. In the book *How Google Tests Software*, Google suggested a 70/20/10 split: 70% unit testing, 20% API testing, and 10% UI testing. 

This blog shares the idea on how to use the **KubeSphere DevOps System** to run automated tests on the KubeSphere platform.

## What Is KubeSphere DevOps

Based on Jenkins, KubeSphere provides a one-stop DevOps system for the use cases of Kubernetes and containers, including rich CI/CD pipeline building and plug-in management functions, Binary-to-Image (B2I), and Source-to-Image (S2I). Code dependency caching support is also provided for pipelines, S2I, and B2I, as well as other functions such as code quality management and pipeline logging. 

The built-in DevOps system of KubeSphere smoothly combines application development and automated release with the container platform. It also supports the integration of third-party private image registries and code repositories, which brings improved CI/CD functions under private scenarios and provides end-to-end user experiences.

Nevertheless, it is rarely known to users that [KubeSphere DevOps](https://kubesphere.io/devops/) can also be used to build automated testing systems, so that automated **unit testing, API testing, and UI testing** can have great convenience and the work of testers can be more efficient.

## Unit Testing

Unit testing has a high running frequency that it should be triggered with every code commit. Due to few dependenies, unit testing usually only requires one container runtime environment.

The following is an example of running a unit test in a pipeline using golang:latest.

```
pipeline {
  agent {
    node {
      label 'go'
    }
  }
  stages {
    stage('testing') {
      steps {
        container('go') {
          sh '''
          git clone https://github.com/etcd-io/etcd.git
          cd etcd
          make test
          '''
        }

      }
    }
  }
}
```

You can see the pipeline logs as below:

![golang-test](/images/blogs/en/devops-automatic-testing/golang-test.png)

As for other languages and frameworks, unit testing can also be easily run on Kubernetes by installing certain packages and Mock-related services. As such, we should focus more on how to write useful unit tests instead of being obsessed with runtimes or unit test plans.

## API Testing

If a team is just getting started with its automated testing, automated API testing would be a great starting point. 

A unit test is mainly written by R&D folks. In a rapid iteration process, the experienced R&D folks will not forget to write unit tests. Testing plays a much more important role in the faster process of refactoring and making changes. The unit testing is overlooked if no one cares to write any, and it is quite difficult to propel something that is neglected by the practitioners and has limited benefits to show to the managerial folks.

Besides, automated UI testing is usually replaced by manual testing. Meanwhile, the maintenance of automated UI testing brings high costs, which means the automated UI testing in the process of rapid iteration should be performed reasonably.

API tests are more preferable if team members are more familiar with APIs as they run tests with complete API documents and materials as reference, especially in an architecture with separate frontend and backend code. 

The following is an example of running an automated API test in a pipeline using Postman.

```
pipeline {
  agent {
    kubernetes {
      label 'apitest'
      yaml '''apiVersion: v1
kind: Pod
spec:
  containers:
  - name: newman
    image: postman/newman_alpine33
    command: [\'cat\']
    tty: true
    volumeMounts:
    - name: dockersock
      mountPath: /var/run/docker.sock
    - name: dockerbin
      mountPath: /usr/bin/docker
  volumes:
  - name: dockersock
    hostPath:
      path: /var/run/docker.sock
  - name: dockerbin
    hostPath:
      path: /usr/bin/docker
      '''
      defaultContainer 'newman'
    }
  }

  parameters {
    string(name: 'HOST', defaultValue: '10.10.10.10', description: '')
    string(name: 'PORT', defaultValue: '8000', description: '')
    string(name: 'USERNAME', defaultValue: 'admin', description: '')
    string(name: 'PASSWORD', defaultValue: 'password', description: '')

  }

  stages {
    stage('testing') {
      steps {
          sh '''
          apk add --no-cache bash git openssh
          git clone https://yourdomain.com/ns/ks-api-test.git

          cd ks-api-test

          sed -i "s/__HOST__/$HOST/g" postman_environment.json
          sed -i "s/__PORT__/$PORT/g" postman_environment.json
          sed -i "s/__USERNAME__/$USERNAME/g" postman_environment.json
          sed -i "s/__PASSWORD__/$PASSWORD/g" postman_environment.json

          npm install -g newman-reporter-htmlextra
          newman run iam/postman_collection.json -e postman_environment.json -r htmlextra
          '''
      }
    }
  }
  post {
    always {
        archiveArtifacts 'ks-api-test/newman/*'
    }
  }
}
```

The artifact will be archived after the running process:

![api-test](/images/blogs/en/devops-automatic-testing/api-test.png)

Download the archived artifact and decompress it to view the testing report:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200428175325.png)

The framework of automated API testing is easy to establish with the implementation of the following functions:

- Interface Request
- Response Assertion
- Request Orchestration
- Report Generation

Keep in mind that you need to select the solution that best suits your team based on your API tests and delivery habits. For example, you can develop your own solution or just use the existing tools. The above solution chooses Postman and Newman for the reason that the team generally uses Postman for API testing.

What's left is how to organize the testing accross the team. The team can either separately submit files to the same repository, or use the charged version of Postman to share data for centralized testing.

## UI Testing

The high cost of automated UI testing can be attributed to the following:

- Testing cases are difficult to maintain as the front-end styles and product logics vary.
- The stable operating environment is difficult to provide, and various timeouts and dirty reads will lead to a high failure rate.

The automated UI testing here uses the Robotframework I'm familiar with, and keywords are used for the automated testing.

The following is an example of running an automated UI test in a pipeline using Robotframework.

```
pipeline {
  agent {
    kubernetes {
      label 'robotframework'
      yaml '''apiVersion: v1
kind: Pod
spec:
  containers:
  - name: robotframework
    image: shaowenchen/docker-robotframework:latest
    tty: true
    volumeMounts:
    - name: dockersock
      mountPath: /var/run/docker.sock
    - name: dockerbin
      mountPath: /usr/bin/docker
  volumes:
  - name: dockersock
    hostPath:
      path: /var/run/docker.sock
  - name: dockerbin
    hostPath:
      path: /usr/bin/docker
      '''
      defaultContainer 'robotframework'
    }
  }

  parameters {
    string(name: 'HOST', defaultValue: '10.10.10.10', description: '')
    string(name: 'PORT', defaultValue: '8080', description: '')
    string(name: 'USERNAME', defaultValue: 'admin', description: '')
    string(name: 'PASSWORD', defaultValue: 'password', description: '')
  }

  stages {
    stage('testing') {
      steps {
          sh '''
          curl -s -L https://raw.githubusercontent.com/shaowenchen/scripts/master/kubesphere/preinstall.sh | bash
          git clone https://yourdomain.com/ns/ks-ui-test.git

          cd ks-ui-test

          sed -i "s/__USERNAME__/$USERNAME/g" tests/common.robot
          sed -i "s/__PASSWORD__/$PASSWORD/g" tests/common.robot

          echo "\nTestEnv  http://$HOST:$PORT" >> tests/api.robot
          echo "\nTestEnv  http://$HOST:$PORT" >> tests/devops.robot
          ./start.sh'''
      }
    }
  }

  post {
    always {
        sh 'tar cvf report-$BUILD_NUMBER.tar ks-ui-test/tests/report'
        archiveArtifacts '*.tar'
    }
  }
}
```

You can see the pipeline logs as below:

![ui-test](/images/blogs/en/devops-automatic-testing/ui-test.png)

Download the archived artifact and decompress it to view the testing report:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200428175345.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200428175353.png)
