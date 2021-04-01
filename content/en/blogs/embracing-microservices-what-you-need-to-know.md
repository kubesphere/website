---
title: 'Embracing Microservices: What You Need to Know before Creating a Microservices Architecture'
keywords: service mesh, Istio, microservices
description: Transform your monolithic application and run your business as microservices.
tag: 'Istio, service mesh, microservices'
createTime: '2021-03-23'
author: 'Ray Zhou, Calvin, Sherlock'
snapshot: '/images/blogs/en/embracing-microservices-what-you-need-to-know/microservices-banner.png'
---

Traditionally, software developers use a monolithic architecture to build the entire system of a single application where all functions of the application are managed in one place. On the contrary, a microservices architecture allows an application to be separated into parts which work together. Some new design patterns have also taken shape (for example, sidecars) as developers adopt microservices architectures.

Against this backdrop, creating a microservices-based application represents a grave challenge. Among other things, people are talking about how to categorize microservices or to what extent can they be considered as "fine-grained". For beginners to the microservices world, they are eager to embark on the right path to microservices and are seeking for best practices for building a microservices-based application.

## Understand Your Needs or Follow Suit

Nobody wants to be left behind as we have ushered in a world of applications built on microservices. As developers or software engineers, however, you need to think twice before you dance to others' tune. An application can be seen as a house which requires no reconstruction as long as it is strong, secure and comfortable. Before you migrate your monolithic application to microservices, think about the following two points.

### Monolithic and Microservices Architecture

Take a look at the table below about both architectures.

|                     | Monolithic                                                   | Microservices                                                |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Code                | - Excessive and beginner-unfriendly </br>- Code black holes which are difficult to change </br>- Tightly coupled components with strong dependency </br>- Single language stack | - Distributed codebases with smaller individual repositories </br>- Developers need to write code comments and documents to explain code of separate microservices </br>- A complete chain of calls may run across multiple service modules and language stacks |
| Test and deployment | Relatively easy                                              | As the number of microservices increases, developers need to make adjustments to service-to-service dependency, which requires high operation costs |
| Deployment tool     | Mature, easy to get started                                  | Diversified                                                  |
| Start               | Slow                                                         | Rapid                                                        |
| Iteration           | Slow                                                         | Rapid and flexible                                           |
| Scalability         | Weak, no explicit boundaries between components              | Strong                                                       |
| Operation costs     | Mature operation platforms with low costs                    | Complicated operation platforms with high costs              |
| Teamwork            | Ineffective and difficult for large-scale development        | Small teams with flexible internal communications            |
| Reliability         | - Components are tightly coupled and dependent </br>- The entire application may crash due to a single point of failure | - Services are loosely coupled which can be deployed separately </br>- Support rapid upgrades, rollbacks and scaling |

Although a microservices architecture seems to stand out as a preferable solution in many aspects, monolithic applications also have their own advantages. 

### Review Your Business

Before you make your final decision, think about the following questions.

- Have the above problems of monolithic applications gravely affected your business?
- Does the new system need to meet the requirements for rapid iteration and autoscaling?
- Is there a DevOps environment or culture in you team?
- Does your enterprise have sufficient drive and technology resources to learn and leverage new technologies?

Admittedly, you do not want to be lagging behind during the race but it is vital to know what suits you the best. If you are determined to create a microservices architecture, keep in mind that it can never be built overnight.


## Step by Step: Find Your Rhythm and Rock It

### Step 1: Develop a New Application

For newcomers to the microservices world, we recommend you to start with new applications. You can try web-scale applications and stateless applications such as websites and documentation created through NGINX. This kind of applications is easy to get started and implement as you can try various functions of microservices on container platforms.

As you become more experienced, you can build a stateful application, the biggest challenge of which is data management. Unlike monolithic applications which share databases, microservices-based applications have exclusive databases for each microservice. These services talk to each other by using APIs, events and messages instead of accessing their database directly.

Ideally, the data of a microservice is packed and exposed through an API to avoid data coupling. This means data calls of other microservices will not be affected if the data format of the microservice is changed. On the other hand, for large enterprise monolithic applications, if you change the database schema, the entire application may malfunction, greatly reducing the development efficiency of your team.

**A microservices architecture is not a panacea. You need to figure out what works best for you and your team.**

In microservices tasks, developers are seeking for eventual consistency rather than strong consistency. As you can imagine, to accomplish a major, complicated mission, it is more reasonable to let multiple people work separately on specific tasks. In this way, the entire mission will not be blocked if a single task fails. Actually, a microservices architecture also works in the same way as each microservice can run in parallel. Eventually, all of the microservices work towards the ultimate goal of completion, or eventual consistency. 

At the same time, eventual consistency also poses a great challenge to data partitioning. For example, join methods are longer applicable to accessing data tables of different services. Without an effective database or framework for data management of microservices, it is very difficult for you to achieve eventual consistency. Besides, some applications do need strong consistency.

**That said, we cannot reject the possibility of running applications of this kind as microservices. At least, or to some extent, we can "compromise" by using miniservices.**

Miniservices and microservices have much in common, including the independency and agility of development and deployment, while the former features fewer restrictions. Generally, a miniservice provides multiple functions which can share data. As you adopt miniservices, you do not need to worry about the hybrid architecture you are using or wonder whether your microservices-based application is "authentic" or not. The correct way to look at the philosophy behind your architecture is:

**Think Big, Start Small, Move Fast.**

It is completely acceptable that an enterprise application contains microservices, miniservices, or even monolithic components (macroservices).

For example, on an e-commerce platform, developers need to cope with frequent promotional activities (discounts, special prices, gifts, etc.), which entails rapid frontend business upgrades. As the number of ultimate transaction requests is way below the number of product information requests, you can create stateless services for your frontend business with decoupled microservices serving requests in a reflexible and rapid manner.

You may be wondering whether it is a good idea to use microservices for your entire platform. Well, there is no fixed answer. As the number of your microservices increases, especially to a certain level, the resulting pressure on management and operation will rise exponentially. For some of your business (2B), they do not need to run as microservices as there is less iteration pressure on them, which is in stark contrast to 2C business. In other words, you can deliver them either as macroservices or miniservices.

No matter what architecture you will be using, you (or your developers) need to have a clear mind of what can run as microservices and what must run as microservices in your application.

![ecommerce-platform](/images/blogs/en/embracing-microservices-what-you-need-to-know/ecommerce-platform.png)


## Let Your Results Speak

We recommend using stateless services in the above example as they can be quickly scaled to respond to traffic bursts. At the same time, you can also efficiently harness your compute resources.

Some may argue that we need to choose stateless services over stateful services if possible. For instance, we managed user sessions in business logic models, which could not be scaled flexibly in a stateless method. To solve this, we extracted user sessions and managed them in a highly-available or distributed cache. In this way, different business modules (stateless) can access sessions by calling APIs.

However, this does not mean that all services should be stateless. Developers should never pursue statelessness for its own sake as there will always be stateful services in your application.


### Step 2: Transform Your Legacy Application

If you want to transform your legacy application by adopting microservices in it (for example, add new features and upgrade existing functions), we advise you to follow some best practices. Keep in mind:

- New features should not be developed on the basis of the original monolithic application. You need to build them as microservices. As these microservices represent part of the existing functions, in most cases, they need to access data in the monolithic application. More importantly, they should do this by using APIs so that they are not tightly coupled. For the monolithic part, no matter you use Facade, Adpater or Translator patten to provide APIs, a loose coupling access method is what the new microservices-based module really needs.
- For the existing monolithic part, you can also consider building microservices for it, especially the part requiring frequent upgrades to meet customers' needs. Ultimately, you can completely replace your legacy application or keep a stable monolithic part of it (also known as a hybrid microservices architecture). 

### Step 3: Service Mesh

A service mesh represents an important part of a microservices architecture. Essentially, it is a kind of middleware of distributed computing, which manages and improves service-to-service communications. It provides a variety of functions such as authentication, authorization, encryption, service discovery, request routing, loading balancing and failure recovery. As such, a service mesh makes services more robust and secure.

A service mesh is essential to deploying a microservices-based application. This is because for a distributed application, developers are faced with greater challenges in terms of stability and manageability. In this regard, a service mesh is the best solution to the robustness and security of your services.

Therefore, it is very important to select the correct tool of service mesh. Many people are reluctant to select between Istio and Spring Cloud. We think that Istio is the service mesh architecture that our industry is embracing. As an Istio service mesh is logically split into a data plane and a control plane, developers can focus on the business logic of an application with the service mesh handling complicated communications between services. 

In architecture design, Spring Cloud seems to come in the shadow of Istio. Imagine that developers need to think about how to achieve circuit breaking, grayscale release, and load balancing as they write code, and you can understand why they are overburdened. Besides, a Spring Cloud service mesh only supports Java, which goes against the important idea of **building microservices using any languages**. Some may also argue that it leads to vendor lock-in.

By contrast, Istio provides a language-agnostic way to connect, manage and monitor microservices, which works perfectly with Kubernetes without any code hacking. That being said, there are still some problems in Istio.

- High performance penalties. The microservices architecture built on the back of Istio still has high performance penalties due to virtualization and traffic forwarding. In this connection, the community is making some encouraging progress, including using Cilium as a service mesh proxy for better performance.

- A steep learning curve. Istio boasts an excellent control plane while it has a steep learning curve. Although many enterprises work to implement containerization, they have stumbled to integrate Istio into their IT architecture.

Despite the above issues, we need to know that the Istio community is growing and growing fast. As what we witnessed between Kubernetes, Docker Swarm and Mesos several years ago, a thriving Kubernetes ecosystem laid a solid foundation for its final success. We think that Istio is the "Kubernetes" in the area of service mesh with an exciting opportunity to be the standard setter going forward.

As your application contains more microservices, the service mesh function echoes the very trend of our times, especially when it comes to FaaS. Enterprises will become more dependent on the convenient and flexible development approach that the service mesh can offer. This means that the development mode focused on services will see increasing popularity, which undoubtedly emphasizes the importance of the service mesh architecture.

Istio comes with a relatively steep learning curve for microservices governance. For Ops teams, in particular, they are actually focused more on functions, such as circuit breaking, traffic management, and grayscale strategies. However, Istio requires them to edit YAML files, understand different abstract parameters, and deploy components. This can be a little troublesome as you cannot expect all audience to make their own 3D glasses before watching a 3D movie.

## Summary

Enterprises are in desperate need of a platform-level container product which enables them to visually manage microservices with low learning and operation costs. The container platform can help enterprises develop core competencies in this digital world as they work to increase their business value.