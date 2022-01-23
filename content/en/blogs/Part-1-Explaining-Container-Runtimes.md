---
  title: 'Part 1: Explaining Container Runtimes: Docker, containerd and CRI-O'
  tag: 'Kubernetes, containers, container runtimes, docker, containerd, cri-o'
  keywords: 'Kubernetes, fundamentals, beginners, guide'
  description: 'In this blog, we will introduce some of the upcoming updates in Kubernetes’s 1.24 and different container runtimes! Before getting into our main topic, we need to....'
  createTime: '2022-01-22'
  author: 'Pulkit Singh'
  snapshot: '/images/blogs/Part-1-Explaining-Container-Runtimes/1.png'
---

![main.png](/images/blogs/Part-1-Explaining-Container-Runtimes/1.png)

In this blog, we will introduce some of the upcoming updates in Kubernetes’s 1.24 and different container runtimes!

Before getting into our main topic, we need to understand what are containers?

## What are containers?

Containers virtualize the underlying infrastructure and address a major issue in application development. When we ess entially write code, the particular whole thing works properly in our development environment, but this is where issues develop when we are generally ready to move the code to production. In production, the code that worked properly on our machine does not work at all in a major way. This can happen pretty much due to different operating systems, dependencies, libraries, etc., basically contrary to popular belief. Containers solved this fundamental issue of portability by allowing you to segregate code from the infrastructure on which it runs. As long as the base image is consistent, you can deploy and run containers anywhere.

To dig deeper into containers, we need to understand some common container standards before comparing different container runtimes.

## What are CRI and OCI?

### Open Container Initiative
The Open Container Initiative (OCI) is a set of open standards and specifications around container technology. Implementations of the OCI Runtime Specification, sometimes referred to as "low-level" runtimes, are focused on managing the container lifecycle—abstracting the Linux primitives—and are not required to perform much else. Low-level runtimes are responsible for creating and running "the container."
The following are examples of native low-level runtimes:

- runC 
- railcar (deprecated)
- crun 
- rkt (deprecated)

### Container Runtime Interface
The Container Runtime Interface (CRI) is a plugin interface that enables the kubelet, a Kubernetes component, to use a wide variety of container runtimes. The Docker runtime was hard-coded into the source code of the kubelet before the introduction of the CRI. However, as Kubernetes grew in popularity, the community began to require further runtime support.

The "rktlet" was created by adapting the kubelet code for rkt. This per-runtime custom build process, however, would not scale, exposing the need for a Kubernetes abstract runtime model. To address this, Hyper, CoreOS, Google, and other Kubernetes sponsors collaborated on the Container Runtime Interface, a high-level specification that describes a container runtime from a container-orchestration perspective. The kubelet may support many container runtimes by integrating with the CRI rather than a specific runtime. This eliminates the need to generate a separate kubelet for each runtime.

*“The dockershim was the first CRI implementation, providing an agreed-upon layer of abstraction on top of the Docker engine. However, since containerd and runC were separated from Docker's core, it has become less significant. Currently, containerd provides a complete CRI implementation.”*

Cool! So now, let us talk about the difference between Docker, containerd, and CRI-O.

## Difference between Docker, containerd, and CRI-O? 
![5.png](/images/blogs/Part-1-Explaining-Container-Runtimes/5.png)

### Docker
It is a software framework for fast developing, testing, and deploying applications. Docker organizes software into containers, which include everything the software requires to operate, such as libraries, system tools, code, and runtime. Docker allows you to swiftly deploy and scale apps in any environment while ensuring that your code will run.

**Features:**
- Docker users ship software 7 times more often than non-Docker users.
- Docker allows you to ship isolated services as frequently as you need them.
- Small containerized applications make it simple to deploy, diagnose problems, and roll back to fix problems.
- Docker-based applications may be migrated from development servers to production deployments with ease.
- Docker containers make it possible to run more code on each server, increasing efficiency and lowering costs.

**How does Docker Work?**
Docker works as a container operating system by giving you a consistent mechanism to run your code, and uses resource isolation in the OS kernel to run multiple containers on the same OS.  Docker allows you to use a command-line interface to run simple commands for building, starting, and stopping containers.

**Architecture**

![arc1.png](/images/blogs/Part-1-Explaining-Container-Runtimes/6.png)

Docker is built on a client-server model. The Docker client communicates with the Docker daemon, which handles the construction, execution, and distribution of your Docker containers. You can execute the Docker client and daemon on the same machine, or you can link a Docker client to a Docker daemon that is located elsewhere. A REST API, UNIX sockets, or a network interface are used by the Docker client and daemon to communicate. Docker Compose is another Docker client that allows you to interact with applications made up of many containers.


- The Docker daemon (dockerd) handles Docker objects such as images, containers, networks, and volumes by listening for Docker API requests. To manage Docker services, a daemon can communicate with other daemons.
- Many Docker users interact with Docker primarily through the Docker client (docker). When you run commands like `docker run`, the client transmits them to dockerd, which executes them. The Docker API is used by the docker command. The Docker client can communicate with many daemons.
- Docker Desktop is a simple-to-use tool that lets you create and distribute containerized apps and microservices on your Mac or Windows computer. Docker Desktop contains Dockerd, Docker, Docker Compose, Docker Content Trust, Kubernetes, and Credential Helper. Visit Docker Desktop for additional details.
- Docker images are stored on a Docker registry. Docker Hub is a public registry that anybody may access, and Docker is set up by default to seek images on it. It's even possible to establish your own private register.
- You create and utilize images, containers, networks, volumes, plugins, and other things when you use Docker.
- An image is a read-only template with Docker container creation instructions.
- A container is an image that can be executed. Using the Docker API or CLI, you may create, start, stop, move, or destroy a container.

### containerd
It is a daemon process that handles container management and execution. It pulls and pushes images, controls storage and networking, and oversees container execution.

**Features**
- Support for the OCI Image Spec 
- Image push and pull 
- Network primitives for creating, modifying, and deleting interfaces
- Support for multi-tenancy with CAS storage for global images
- Support for the OCI Runtime Spec (aka runs)
- Management of network namespaces containers to join existing namespaces 
- Container runtime and lifecycle support

**How does containerd work?**
It is a daemon that runs on Linux and Windows. From image transfer and storage to container execution and supervision, low-level storage, network attachments, and beyond, it manages the entire container lifecycle of its host system. 

**Architecture**

![arc2.png](/images/blogs/Part-1-Explaining-Container-Runtimes/7.png)

External users engage with services provided by the GRPC API.
- Bundle: A user can extract and pack bundles from disk images using the bundle service.
- Runtime: The runtime service allows bundles to be executed, as well as the development of runtime containers.

We have various components that may cross subsystem borders in addition to the subsystems, which are referred to as components. The following are the elements we have:

- The executor is responsible for implementing the container runtime.
- Supervisor: The supervisor keeps an eye on the container's condition and reports on it.
- Metadata is a type of data that is stored in a graph database. Any persistent references to pictures and bundles should be stored here. Schemas will be coordinated amongst components to provide access to arbitrary data placed into the database. Hooks for trash collection of on-disk resources are amongst other features.
- Content provides access to content addressable storage. This is where all immutable material will be saved, using the content hash as the key.
- Snapshot manages filesystem snapshots for container images. This is similar to Docker's graphdriver today. Snapshots are used to extract layers.
- Events: Allows you to collect and consume events to provide consistent, event-driven behaviour and auditing. Events can be replayed in other modules.




### CRI-O
CRI-O may pull from any container registry and supports OCI container images. It's a lightweight alternative to Docker, Moby, or rkt as a Kubernetes runtime.

**Features**
- OCI compatible runtime
- containers/storage
- containers/image
- networking (CNI)
- container monitoring
- Several essential Linux functions support security

**How does CRI-O work?**
It is a Kubernetes CRI implementation that allows OCI-compatible runtimes to be used. It's a lighter alternative to using Docker as the runtime for Kubernetes. It enables Kubernetes to use any OCI-compliant container runtime for pod execution. It now supports runc and Kata Containers as container runtimes, and any OCI-compliant runtime can theoretically be plugged in.

**Architecture**

![arc3.png](/images/blogs/Part-1-Explaining-Container-Runtimes/8.png)

The following are the architectural elements:
- To deploy a pod, Kubernetes communicates with the kubelet.
- Pods are a Kubernetes notion that consists of one or more containers in the same cgroup that share the same IPC, NET, and PID namespaces.
- To launch a new pod, the kubelet sends a request to the CRI-O daemon using the Kubernetes CRI .
- CRI-O pulls the image from a container registry using the containers/image library.
- Using the containers/storage library, the downloaded image is unpacked into the container's root filesystems and stored in COW file systems.
- After the container's rootfs have been constructed, CRI-O creates an OCI runtime specification JSON file that describes how to use the OCI Generate tools to run the container.
- The specification is then used by CRI-O to launch an OCI Compatible Runtime, which runs the container processes. The OCI Runtime by default is runc.
- A separate conmon process monitors each container. The pty of the container process's PID1 is held by the conmon process. It manages the container's logging and keeps track of the container's exit code.
- CNI is used to set up the pod's networking, therefore any CNI plugin can be used with CRI-O.


So with that, we have got one update officially from Kubernetes, that dockershim will be deprecated from Kubernetes!! ([check it out here!](https://kubernetes.io/blog/2021/11/12/are-you-ready-for-dockershim-removal/)). Well, we’ll make it more in-depth in our next part of the article.

## Summary
While concluding, I would like to include that it’s all depending on your demands when choosing a specific container runtime as each of them has their own benefits. Stay tuned for our part 2 of this series!

**References and additional resources**

- https://kubernetes.io/blog/2021/11/12/are-you-ready-for-dockershim-removal/
