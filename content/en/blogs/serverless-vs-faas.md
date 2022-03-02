---
title: 'Serverless vs. Function-as-a-Service (FaaS): Which One to Choose?'  
tag: 'Serverless, FaaS'  
keywords: Serverless, FaaS  
description: This article explains the concepts of serverless and FaaS to discuss how to choose the right one for your business.   
createTime: '2022-03-02'  
author: 'Felix'  
snapshot: '/images/blogs/en/serverless-vs-faas/serverless-faas.png'
---

The constantly-expanding cloud computing landscape has encompassed many emerging technologies. You’ve probably heard of serverless and Function-as-a-Service (FaaS) if you are a practitioner in the cloud computing field. These two concepts are sometimes used interchangeably. However, we should also be aware of the differences between them so that we can choose the one that better suits our needs.

In this article, we will take a look at these two technology concepts to figure out how to pick the better one for yourself.

## What is Serverless

### Overview

Serverless is a cloud computing model where cloud providers manage the cloud computing infrastructure required for providing resources according to customer needs. In the context of serverless, servers still exist, but developers don’t have to spend their time and energy on managing these servers. Serverless allows developers to focus on developing serverless applications and implements autoscaling based on the resource consumption by serverless applications.

### Serverless use cases

According to [the CNCF serverless whitepaper](https://github.com/cncf/wg-serverless/blob/master/whitepapers/serverless-overview/cncf_serverless_whitepaper_v1.0.pdf), serverless should be considered in many use cases. To list a few:

- Data processing
- Stream processing at scale
- Parallel or scheduled jobs
- Web applications

### Advantages

To put it simply, Serverless has the following advantages:

- **Maintenance free**: As mentioned above, serverless allows developers to focus on writing code rather than managing infrastructure, which enables developers to optimize their business logic and achieve innovation.
- **Better scalability**: Serverless applications can be automatically scaled according to usage increase or decrease. Therefore, serverless applications can handle both the high and low number of requests with dynamic resources.
- **Cost-effective**: In a serverless context, customers pay for what has been consumed only, starting when a request is made and ending when the corresponding execution finishes.

### Disadvantages

Although serverless can be helpful for developers, it also brings some disadvantages. To name a few:

- **Lack of custom control**: As the infrastructure is managed by cloud providers, customers cannot access the underlying infrastructure for custom configuration. Besides, it is also difficult to do testing or debugging before releasing serverless applications because the serverless environment cannot be reproduced.
- **Performance issues**: Despite the fact that serverless can do autoscaling, some code may be running in a constant manner while certain code is not running because of zero request. The startup time for such idle code may affect the overall performance.
- **Tricky cost**: Serverless is not meant for long-running processes, which means it could cost more to run an application with long-running processes in a serverless infrastructure than in a conventional environment.

## What is FaaS

### Overview

Function-as-a-Service, or FaaS, is a serverless way to run functions in any cloud environment. With the help of FaaS, developers can focus on writing function code without the need to build and maintain the required infrastructure. You can consider building an application in this model as an implementation of the serverless concept. FaaS is mainly used in an event-driven computing context where functions are triggered by a specific event such as message queues, HTTP requests, etc.

### FaaS use cases

As the need for [transforming a conventional application into microservices](https://kubesphere.io/blogs/transform-traditional-applications-into-microservices/) is attractive to developers, FaaS suits quite well in such a process where developers divide their monolithic applications into small pieces of code. With FaaS, developers can focus on writing pieces of code that represent separate services to be run as FaaS functions, and a single microservice can be a combination of multiple functions. Therefore, FaaS is especially useful in microservice-based application development.

### Advantages

FaaS has its own advantages as follows:

- **Faster development**: With FaaS, developers can focus on improving business logics and writing function code. Moreover, developers can write only pieces of code for required functional components rather than writing complete applications.
- **Innate scalability**: Code written in the FaaS context is innately scalable. You don’t have to worry about preparing contingency plans for a high number of requests because functions can be easily scaled up or down to meet user demands.
- **Less cost**: With FaaS, you only have to pay when the function is triggered and executed, without the need to spend any money on unnecessary cloud resources.

### Disadvantages

The disadvantages of FaaS mainly lie in:

- **Limited functionality**: The functions in FaaS are small pieces of code used to accomplish simple tasks. If you want to write complex functions, FaaS may not be your best choice.
- **Difficulty in function management**: Since you will be developing small pieces of function code, it could be difficult to manage a large number of functions as your business continues to grow.
- **Data storage**: Functions in FaaS are mainly for running stateless workloads. How to find a way to store the data would be an issue if these functions have to call other stateful workloads.

## Which One to Choose

Serverless can be used in a wider range of functionalities, while FaaS focuses on providing an efficient way for the development of functions. As your business continues to grow, you may need to find yourself more tools to manage the functions, whereas this issue could be avoided if you choose other relatively complex serverless solutions with more components.

Serverless offers more comprehensive solutions, while FaaS brings more flexibility. How to make the choice is always related to your practical needs. Moreover, it is not necessary to draw a line between these two. We can still decide to use them both if that suits our needs.

### Serverless and FaaS providers

There are a lot of serverless and FaaS providers available nowadays. For example:

- AWS Lambda
- Google Cloud Functions
- Azure Functions

Although many cloud providers have their serverless or FaaS solutions ready for developers, it is possible to face the issue of vendor lock-in after you run your business functions on a single platform.

### Open-source serverless/FaaS alternatives

In recent years, many outstanding open-source projects (such as [KEDA](https://keda.sh/), [Dapr](https://dapr.io/), [Cloud Native Buildpacks (CNB)](https://buildpacks.io/), [Tekton](https://tekton.dev/), and [Shipwright](https://shipwright.io/)) have emerged in the cloud-native Serverless-related fields. It is not easy to select the appropriate tools and put them together to build your own serverless solution.

Thus, [OpenFunction](https://github.com/OpenFunction/OpenFunction/) comes as a cloud-native open-source [FaaS platform](https://openfunction.dev/) aiming to let you focus on your business logic without having to maintain the underlying runtime environment and infrastructure. It can be easily deployed to your Kubernetes cluster. You can generate event-driven and dynamically scaling serverless workloads by simply submitting business-related source code in the form of functions. To learn more, see [OpenFunction: a Modern Cloud-Native Serverless Computing Platform on Kubernetes](https://kubesphere.io/blogs/faas-openfunction/).

## Recap

Both serverless and FaaS solutions present high value to developers working in the current technology landscape, especially the cloud-native landscape. With all the available serverless/FaaS options, we just need to think about our real needs and find the most appropriate solution in practice.