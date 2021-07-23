# ****Will Cloud Native WebAssembly Replace Docker?****

Holding a brand new form, WebAssembly excels in its portability, small size, fast loading and compatibility. Given its good security, compatibility, high efficiency and lightweight, WebAssembly is an ideal technology for applications based on sandbox schemes and has got noticed from communities of containers, function computing, IoT and edge computing. What is WebAssembly? Is it capable of replacing Docker?

This article is based on the share by Second State CEO Michael Yuan in 2020 KubeSphere Meetup.

## ***Background***

![Image text](https://raw.githubusercontent.com/VeraXIE1997/test/main/Will%20Cloud%20Native%20Replace%20Docker/image/image-20210721141953114%E7%9A%84%E5%89%AF%E6%9C%AC.png)

Solomon Hykes, the founder of Docker in March 2019, claimed on twitter that “If WASM+WASI existed in 2008, we would not have needed to create Docker”. From where he stood, WebAssembly reveals the future of computing. This twitter led to a great stir in communities, as many people got confused about why WebAssembly, a replacement of JavaScript in browser for game playing, turned out to be an alternative to Docker in server.

## *Where WebAssembly Lies in Server*

![Image text](https://raw.githubusercontent.com/VeraXIE1997/test/main/Will%20Cloud%20Native%20Replace%20Docker/image-20210721142129175%E7%9A%84%E5%89%AF%E6%9C%AC.png)

We tend to divide container, virtual machine or operation environment into three different levels in terms of server

1. The bottom lies Hypervisor VM of hardware, or AWS Firecrackers, which is known as micro VMs with direct connection with hardware.


2. **The middle lies Application containers VM, where application containers such as Docker can be created. Notice: application container is still within the level of operation system, so the whole operation system should be fully included.**

3. The upper lies high-level language VMs that starts from JVM. WebAssembly is abstracted from the level of operating system. This is where WebAssembly lies in server.

If WebAssembly manages to create a language VM similar to JVM, the dream proposed by Java over 20 years ago can be realized: to provide developers with a secure and highly abstracted operation environment across different operating systems, hardware and software platforms.

## *Comparison between WebAssembly and Docker*

![Image text](https://raw.githubusercontent.com/VeraXIE1997/test/main/Will%20Cloud%20Native%20Replace%20Docker/image-20210721142326218%E7%9A%84%E5%89%AF%E6%9C%AC.png)

What is the relationship between WebAssembly and Docker? Why is it believed that WebAssembly will replace Docker? Compared with Docker, WebAssembly performs better in the following aspects.

In terms of cold start, WebAssembly is 100 times faster than Docker.

Slow cold start is a long haunting problem confronted by serverless and container service. As AWS provides reserve instances, keep it hot will offset advantages brought by serverless. Reserve will lead to charge by day, which goes against charge by millisecond we expect. One prominent edge of WebAssembly is no need to start the whole operating system, making it 100 times faster than Docker’scold start.

In terms of execution duration, WebAssembly is 10% - 50% shorter than Docker.

As a simple virtual machine, WebAssembly is free from operating system, making its execution duration 10% - 50% shorter than that of Docker.

WebAssembly occupies smaller space.

The applications based on WebAssembly are generally within 1MB in size, while one Docker image can be 100 or 200 MB in size.

WebAssembly embraces a modern security policy.

WebAssembly enjoys its security strategy of “Capability-based Security”, a risk control strategy based on resources offered. Different operating system interface/resources permission provided for each independent module instance can be designated by callers when instantiating each module.

WebAssembly facilitates the combination of software.

JAMStack is one serverless application framework, and one JavaScript application may be supported by over 100 and even 1000 serverless functions. If we combine all those serverless functions through containerization, it will be too complex as we need to start from the network or operating system level. Through nanoprocess, the application of WebAssembly, however, helps to combine them under security control.

WebAssembly seamlessly supports server application frameworks, such as Node.js and Python.

These are where WebAssembly stands out.

## *WebAssembly and Rust*

![Image text](https://raw.githubusercontent.com/VeraXIE1997/test/main/Will%20Cloud%20Native%20Replace%20Docker/image-20210721142609064%E7%9A%84%E5%89%AF%E6%9C%AC.png)

When it comes to WebAssembly, Rust always comes together. Crowned as the most popular language among developers in Stack Overflow, Rust is likely to replace C language in the foreseeable future.

As WebAssembly is connected with LLVM, 20 languages are supported at front-end.  C++ and Rust are highly supported, while Python, Java and other languages with runtime are not supported. That’s why we believe WebAssembly and Rust are perfect for each other, just like Java and JVM.

Rust improves development efficiency and security in memory. WebAssembly is conducive for secure operation and cross-platform execution. Both of them are of good performance and lightweight.

## *WebAssembly System Interface(WASI)*

![Image text](https://raw.githubusercontent.com/VeraXIE1997/test/main/Will%20Cloud%20Native%20Replace%20Docker/image-20210721142657819%E7%9A%84%E5%89%AF%E6%9C%AC.png)

WASI is similar with JNI of Java. WebAssembly used to be applied in browser and will be applied in server this year. To access file system, thread, order, and standard library in server, WASI is an indispensable part.

Given one significant application scenario of serverless is AI reasoning, GPU, ASIC and Tensorflow are highly required during the runtime of WebAssembly, which are all added by WASI.

## *Combining WebAssembly with Kubernetes*

WebAssembly is frequently applied in browser, while seldom used in server, as it requires to manage processes and allocate resources on its own due to the shortage of scheduling capacity and DevOps solution scheme in server side. Hence, the combination of WebAssembly and Kubernetes makes an edge-cutting field.

One method is to make WebAssembly into OCI (open container interface) compliant, the other is to write shim API in containerd. 

![Image text](https://raw.githubusercontent.com/VeraXIE1997/test/main/Will%20Cloud%20Native%20Replace%20Docker/image-20210721142814156%E7%9A%84%E5%89%AF%E6%9C%AC.png)

As we mentioned above, the tweet of Docker’s founder caused huge impacts on community and led to some grudges. For ceasing these discontentments, another tweet was posted by him for explanation. One and half years later, we found the reality different, and the word “Docker” should change into “Kubernetes”.

## ***Will WebAssembly replace Docker***

Even if WebAssembly can replace Docker, it takes time, since Docker holds its own ecology and is in a different abstraction level with WebAssembly.

However, WebAsembly will see extensive applications in some fields requiring high performance and lightweight, including micro-service, JAMStack and edge computing.
