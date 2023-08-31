---
title: "S2I 工作流程和逻辑"
keywords: 'KubeSphere, Kubernetes, Docker, S2I, Source-to-Image'
description: '了解 S2I 的工作原理及其为何按照预期工作。'
linkTitle: "S2I 工作流程和逻辑"
weight: 10630
---

Source-to-Image (S2I) 是一个将源代码构建成镜像的自动化工具。S2I 将源代码注入负责编译的镜像构建器 (Image Builder) 中，然后自动将编译后的代码打包成 Docker 镜像。

有关如何在 KubeSphere 中使用 S2I 的更多信息，请参考 [Source to Image：无需 Dockerfile 发布应用](../source-to-image/)。此外，您还可以参考代码仓库 [S2IOperator](https://github.com/kubesphere/s2ioperator#source-to-image-operator) 和 [S2IRun](https://github.com/kubesphere/s2irun#s2irun) 查看更多详细信息。

## S2I 工作流程和逻辑

### 镜像构建器

对于 Python 和 Ruby 等解释型语言，程序的构建环境和运行时环境通常是相同的。例如，基于 Ruby 的镜像构建器通常包含 Bundler、Rake、Apache、GCC 以及其他构建运行时环境所需的安装包。构建的工作流程如下图所示：

![s2i-builder](/images/docs/v3.x/zh-cn/project-user-guide/image-builder/s2i-intro/s2i-builder.png)

### S2I 工作原理

S2I 执行以下步骤：

1. 根据镜像构建器运行容器，并将应用程序的源代码注入到指定目录中。
2. 执行镜像构建器中的 `assemble` 脚本，通过安装依赖项以及将源代码转移到工作目录下，将源代码构建成可直接运行的应用程序。
3. 将镜像构建器中提供的 `run` 脚本设置为启动容器的镜像入口点，然后提交新的镜像作为供用户使用的应用程序镜像。

S2I 流程图如下：

![s2i-flow](/images/docs/v3.x/zh-cn/project-user-guide/image-builder/s2i-intro/s2i-flow.png)

### 运行时镜像

对于 Go、C、C++、Java 等编译型语言，编译时所需的依赖项会增加最终镜像的大小。为构建更轻量的镜像，S2I 实行分阶段构建，并从镜像中移除非必要的文件。镜像构建器完成构建后会导出制品，制品可能是 Jar 文件或二进制文件等可执行文件，然后会将制品注入运行时镜像 (Runtime Image) 用于执行。

构建的工作流程如下：

![s2i-runtime-build](/images/docs/v3.x/zh-cn/project-user-guide/image-builder/s2i-intro/s2i-runtime-build.png)