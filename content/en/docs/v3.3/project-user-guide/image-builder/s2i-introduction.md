---
title: "S2I Workflow and Logic"
keywords: 'KubeSphere, Kubernetes, Docker, S2I, Source-to-Image'
description: 'Understand how S2I works and why it works in the expected way.'
linkTitle: "S2I Workflow and Logic"
weight: 10630
---

Source-to-Image (S2I) is an automation tool for building images from source code. S2I injects source code into an Image Builder for compiling and then automatically packages the compiled code into a Docker image.

For more information about how to use S2I in KubeSphere, refer to [Source to Image: Publish an App without a Dockerfile](../source-to-image/). Besides, you can refer to the code repositories [S2IOperator](https://github.com/kubesphere/s2ioperator#source-to-image-operator) and [S2IRun](https://github.com/kubesphere/s2irun#s2irun) for more details.

## S2I Workflow and Logic

### Image Builder

For interpreted languages like Python and Ruby, the build-time and runtime environments for an application are typically the same. For example, a Ruby-based Image Builder usually contains Bundler, Rake, Apache, GCC, and other packages needed to set up a runtime environment. The following diagram describes the build workflow.

![s2i-builder](/images/docs/v3.3/project-user-guide/image-builder/s2i-intro/s2i-builder.png)

### How S2I works

S2I performs the following steps:

1. Start a container from the Image Builder with the application source code injected into a specified directory.
2. Execute the `assemble` script from the Image Builder to build that source code into a ready-to-run application by installing dependencies and moving the source code into a working directory.
3. Set the `run` script provided by the Image Builder as the image entrypoint for starting the container, and then commit a new image as the application image to meet user needs.

See the S2I workflow chart as below.

![s2i-flow](/images/docs/v3.3/project-user-guide/image-builder/s2i-intro/s2i-flow.png)

### Runtime Image

For compiled languages like Go, C, C++, or Java, the dependencies necessary for compiling will increase the size of resulting images. To build slimmer images, S2I uses a phased build workflow with unnecessary files removed from images. An artifact, which is an executable like a Jar file or binary file, will be extracted when building finishes in the Image Builder, and then injected into a Runtime Image for execution.

See the building workflow as below.

![s2i-runtime-build](/images/docs/v3.3/project-user-guide/image-builder/s2i-intro/s2i-runtime-build.png)