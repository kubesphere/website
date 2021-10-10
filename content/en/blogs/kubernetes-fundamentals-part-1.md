# Kubernetes Fundamentals Part one: A Visual Quick Start


![68747470733a2f2f7170682e66732e71756f726163646e2e6e65742f6d61696e2d71696d672d3637363130313064303137363262633930353438363038616564353966313133](https://cdn.discordapp.com/attachments/854369708812140564/892077349087084614/unknown.png)


Hi! Today we'll discuss something that everyone is familiar with if they've heard the term "Containers." Yes, It's "Kubernetes"!!

“Kubernetes was born out of the necessity to make our sophisticated software more available, scalable, transportable, and deployable in small, independent modules.”

Kubernetes is gaining popularity as the future cloud software deployment and management standard. However, Kubernetes has a steep learning curve that comes with all of its capabilities. As a rookie, it can be tough to comprehend the concepts and core principles. There are a lot of pieces that make up the system, and determining which ones are vital for your scenario might be tough.

So, what’s the need for it??


## Do we need Kubernetes?

![68747470733a2f2f7170682e66732e71756f726163646e2e6e65742f6d61696e2d71696d672d3637363130313064303137363262633930353438363038616564353966313133](https://media.discordapp.net/attachments/854369708812140564/892086717404823642/9.png?width=1191&height=670)

Kubernetes is a platform for container-based application orchestration control resource allocation, and traffic management for applications and microservices in the Kubernetes ecosystem.

As a result, many aspects of maintaining a service-oriented application infrastructure have been made easier. Kubernetes, when combined with modern continuous integration and continuous deployment (CI/CD) systems, provides the foundation for scaling these apps with minimal technical work.

So now it's time to talk about Kubernetes' fundamental notions!

Some concepts to understand:

## Containers
![68747470733a2f2f7170682e66732e71756f726163646e2e6e65742f6d61696e2d71696d672d3637363130313064303137363262633930353438363038616564353966313133](https://cdn.discordapp.com/attachments/854369708812140564/892086738518933504/4.png)

Containers solve a significant issue in application development. Programmers work in a development environment when they write code. When they're ready to put the code into production, this is where problems arise. The code that worked on their machine does not work in production. Differences in operating systems, dependencies, and libraries are only a few of the reasons for this.
Containers solved this fundamental problem of portability by separating code from the infrastructure it operates on. Developers may choose to package their application into a small container image that contains all of the binaries and libraries it needs to run.
Any computer with a containerization platform such as Docker or containerd can run that container in production.

## Pods
![68747470733a2f2f7170682e66732e71756f726163646e2e6e65742f6d61696e2d71696d672d3637363130313064303137363262633930353438363038616564353966313133](https://cdn.discordapp.com/attachments/854369708812140564/892086736564396092/6.png)

A Pod (as in a pod of whales or a pod of peas) is a group of one or more containers that share storage and network resources and operate according to a set of rules. A Pod's content is always co-located, scheduled, and executed in the same environment. A Pod is a "logical host" for an application that incorporates one or more tightly coupled application containers.
In a non-cloud context, applications running on the same physical or virtual computer are analogous to cloud applications running on the same logical host.

## Nodes
![68747470733a2f2f7170682e66732e71756f726163646e2e6e65742f6d61696e2d71696d672d3637363130313064303137363262633930353438363038616564353966313133](https://cdn.discordapp.com/attachments/854369708812140564/892079816478711828/unknown-removebg-preview.png)

A node is the smallest unit of computer hardware in Kubernetes. It's a representation of one of the computers in your cluster. Most production systems will have a node that is either a physical machine in a data center or a virtual machine housed on a cloud provider like Google Cloud Platform. Don't let traditions limit you; in theory, you can make a node out of almost anything.
Thinking of a machine as a "node" adds another degree of abstraction. Instead of worrying about each machine's characteristics, we can now just see it as a collection of CPU and RAM resources that can be utilized. Any machine in a Kubernetes cluster can be used to replace any other machine in this approach
In this, we have two terms known as:
![68747470733a2f2f7170682e66732e71756f726163646e2e6e65742f6d61696e2d71696d672d3637363130313064303137363262633930353438363038616564353966313133](https://cdn.discordapp.com/attachments/854369708812140564/892086727366299698/10.png)


- Nodes ( Master )
The master node controls the state of the cluster; for example, which applications are running and their corresponding container images.

- Nodes ( Worker )
Workloads execute in a container on physical or virtual servers.

## Cluster
![68747470733a2f2f7170682e66732e71756f726163646e2e6e65742f6d61696e2d71696d672d3637363130313064303137363262633930353438363038616564353966313133](https://cdn.discordapp.com/attachments/854369708812140564/892086731032109096/1.png)

A cluster is a collection of machines on which containerized applications are run. Containerizing apps encapsulates an app's dependencies as well as some essential services. They are lighter and more adaptable than virtual machines. In this approach, clusters make it easier to design, move, and maintain applications.
Containers may run on numerous computers and environments, including virtual, physical, cloud-based, and on-premises, thanks to clusters. Unlike virtual machines, containers are not limited to a single operating system. Instead, they can share operating systems and execute from any location.
clusters are comprised of one master node and several worker nodes.

## Persistent Volumes
![68747470733a2f2f7170682e66732e71756f726163646e2e6e65742f6d61696e2d71696d672d3637363130313064303137363262633930353438363038616564353966313133](https://cdn.discordapp.com/attachments/854369708812140564/892086734970581033/3.png)

Data can't be stored to any arbitrary location in the file system since programs operating on your cluster aren't guaranteed to run on a certain node. If a program attempts to store data to a file for later use but is then moved to a different node, the file will no longer be where the program expects it to be. As a result, each node's typical local storage is viewed as a temporary cache for holding programs, but any data saved locally cannot be expected to last.
Persistent Volumes are used by Kubernetes to store data indefinitely. While the cluster successfully pools and manages the CPU and RAM resources of all nodes, persistent file storage is not. As a Persistent Volume, local or cloud disks can be linked to the cluster. This is similar to connecting an external hard disk to the cluster. Persistent Volumes are a file system that can be mounted on the cluster without being tied to a specific node. A user's request for storage is called a PersistentVolumeClaim (PVC). It looks like a Pod. Node resources are consumed by pods, and PV resources are consumed by PVCs. Pods can request specified resource levels (CPU and Memory). The specific size and access modes might be requested in claims.

## Deployments
![68747470733a2f2f7170682e66732e71756f726163646e2e6e65742f6d61696e2d71696d672d3637363130313064303137363262633930353438363038616564353966313133](https://cdn.discordapp.com/attachments/854369708812140564/892086741752754216/7.png)

The basic function of a deployment is to specify how many clones of a pod should be running at any given time. When you add deployment to the cluster, it will automatically start up the necessary number of Pods and monitor them. If a pod dies, the deployment will recreate it automatically.
You don't have to deal with pods manually if you use a deployment. Simply describe the system's desired state, and it will be managed for you automatically.

## Ingress
![68747470733a2f2f7170682e66732e71756f726163646e2e6e65742f6d61696e2d71696d672d3637363130313064303137363262633930353438363038616564353966313133](https://media.discordapp.net/attachments/854369708812140564/892086746785923072/8.png?width=1191&height=670)

Ingress offers HTTP and HTTPS routes to services within the cluster from outside the cluster. Rules established on the Ingress resource control traffic routing. An Ingress can be set up to provide Services with externally accessible URLs, load balance traffic, terminate SSL/TLS, and provide name-based virtual hosting. An Ingress controller is in charge of completing the Ingress, usually with a load balancer, but it may also configure your edge router or additional front ends to assist in traffic handling. An Ingress does not disclose any ports or protocols to the public. A service of type Service is often used to expose services other than HTTP and HTTPS to the internet.

## Interactive hands-on tutorials
So we have talked a lot about basic concepts, so now if you want to learn Kubernetes from scratch do take a look at these interactive tutorials, you can run Kubernetes and practice it in your browser.

- [Learn Kubernetes using Interactive Browser-Based Scenarios](https://www.katacoda.com/courses/kubernetes)

- [Install KubeSphere on Kubernetes cluster](https://www.katacoda.com/kubesphere/scenarios/install-kubesphere-on-kubernetes)



## Conclusion
So at last, we have discussed all the basic concepts you need to get started to work with Kubernetes. If you want to start experimenting with it, then do take a look at [Kubernetes getting started docs.](https://kubernetes.io/docs/setup/)

so get started with it and stay tuned for more such content!
