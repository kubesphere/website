---
title: "自定义 S2I 模板"
keywords: 'KubeSphere, Kubernetes, Docker, S2I, Source-to-Image'
description: '学习如何自定义 S2I 模板，并理解不同的模板参数。'
linkTitle: "自定义 S2I 模板"
weight: 10640

---

当您了解了 Source-to-Image (S2I) 的工作流和逻辑，就可以根据您的项目自定义映像生成器模板（即 S2I / B2I 模板），以扩展 S2I 功能。KubeSphere 提供了几种常见的镜像构建器模板，如 [Python ](https://github.com/kubesphere/s2i-python-container/)和  [Java](https://github.com/kubesphere/s2i-java-container/)。 

本教程演示如何创建包含 Nginx 服务的镜像构建器。如果需要在项目中使用运行时映像，请参阅[本文档](https://github.com/kubesphere/s2irun/blob/master/docs/runtime_image.md)以了解有关如何创建运行时映像的更多信息。

## 准备工作

S2I 模板自定义分成两部分。

- 第一部分：S2I 自定义镜像构建
  - assemble (required)：从源代码构建应用程序制品的脚本 `assemble`。
  - run (required)：执行一个程序。
  - save-artifacts (optional)：管理增量构建过程中的所有依赖。
  - usage (optional)：提供说明的脚本。
  - test (optional)：用于测试的脚本。
- 第二部分：S2I 模板定义

您需要提前准备好 S2I 模板定制所需的元素。

{{< notice note >}}

镜像构建器与 OpenShift 兼容，您可以在 KubeSphere 中重用它。有关 S2I 镜像构建器的更多信息，请参见 [S2IRun](https://github.com/kubesphere/s2irun/blob/master/docs/builder_image.md#s2i-builder-image-requirements)。

{{</ notice >}}

## 创建镜像构建器

### 步骤 1：准备 S2I 目录

1. [S2I 命令行工具](https://github.com/openshift/source-to-image/releases)提供了一个易于使用的命令来初始化生成器所需的基本目录结构。运行以下命令以安装S2I CLI。

   ```bash
   $ wget https://github.com/openshift/source-to-image/releases/download/v1.1.14/source-to-image-v1.1.14-874754de-linux-386.tar.gz
   $ tar -xvf source-to-image-v1.1.14-874754de-linux-386.tar.gz
   $ ls
   s2i source-to-image-v1.1.14-874754de-linux-386.tar.gz  sti
   $ cp s2i /usr/local/bin
   ```

2. 本教程使用 `nginx-centos7` 作为镜像构建器的名称。运行 `s2i create` 命令初始化基本目录结构。

   ```bash
   s2i create nginx-centos7 s2i-builder-docs
   ```

3. 目录结构初始化如下。

   ```
   s2i-builder-docs/
      Dockerfile - a standard Dockerfile to define the Image Builder
      Makefile - a script for testing and building the Image Builder
      test/
         run - a script that runs the application to test whether the Image Builder is working properly
         test-app/ - directory of the test application
      s2i/bin
         assemble - a script that builds the application
         run - a script that runs the application
         usage - a script that prints the usage of the Image Builder
   ```

### 步骤 2：修改 Dockerfile

Dockerfile 安装构建和运行应用程序所需的所有必要工具和库。Dockerfile 还将 S2I 脚本复制到输出镜像中。

按如下所示修改 Dockerfile 以定义镜像构建器。

#### Dockerfile

```
# nginx-centos7
FROM kubespheredev/s2i-base-centos7:1

# Here you can specify the maintainer for the image that you're building
LABEL maintainer="Runze Xia <runzexia@yunify.com>"

# Define the current version of the application
ENV NGINX_VERSION=1.6.3

# Set the labels that are used for KubeSphere to describe the Image Builder.
LABEL io.k8s.description="Nginx Webserver" \
      io.k8s.display-name="Nginx 1.6.3" \
      io.kubesphere.expose-services="8080:http" \
      io.kubesphere.tags="builder,nginx,html"

# Install the nginx web server package and clean the yum cache
RUN yum install -y epel-release && \
    yum install -y --setopt=tsflags=nodocs nginx && \
    yum clean all

# Change the default port for nginx
RUN sed -i 's/80/8080/' /etc/nginx/nginx.conf
RUN sed -i 's/user nginx;//' /etc/nginx/nginx.conf

# Copy the S2I scripts to /usr/libexec/s2i in the Image Builder
COPY ./s2i/bin/ /usr/libexec/s2i

RUN chown -R 1001:1001 /usr/share/nginx
RUN chown -R 1001:1001 /var/log/nginx
RUN chown -R 1001:1001 /var/lib/nginx
RUN touch /run/nginx.pid
RUN chown -R 1001:1001 /run/nginx.pid
RUN chown -R 1001:1001 /etc/nginx

USER 1001

# Set the default port for applications built using this image
EXPOSE 8080

# Modify the usage script in your application dir to inform the user how to run this image.
CMD ["/usr/libexec/s2i/usage"]
```

{{< notice note >}}

S2I 脚本将使用 Dockerfile 中定义的标志作为参数。如果您需要使用与 KubeSphere 提供的基础映像不同的基础映像，请参见 [S2I Scripts](https://github.com/kubesphere/s2irun/blob/master/docs/builder_image.md#s2i-scripts)。

{{</ notice >}}

### 步骤 3：创建 S2I 脚本

1. 创建一个 `assemble` 脚本，如下所示，将配置文件和静态内容复制到目标容器中。

   ```bash
   #!/bin/bash -e
   
   if [[ "$1" == "-h" ]]; then
   	exec /usr/libexec/s2i/usage
   fi
   
   echo "---> Building and installing application from source..."
   if [ -f /tmp/src/nginx.conf ]; then
     mv /tmp/src/nginx.conf /etc/nginx/nginx.conf
   fi
   
   if [ "$(ls -A /tmp/src)" ]; then
     mv /tmp/src/* /usr/share/nginx/html/
   fi
   ```

   {{< notice note >}}

   默认情况下，`s2i build` 将应用程序源代码放在 `/tmp/src`。上述命令将应用程序源代码复制到由 `kubespheredev/s2i-base-centos7:1` 定义的工作目录 `/opt/app root/src`。

   {{</ notice >}}

2. 创建一个 `run` 脚本，如下所示。在本教程中，它只启动 `nginx` 服务器。

   ```bash
   #!/bin/bash -e
   
   exec /usr/sbin/nginx -g "daemon off;"
   ```

   {{< notice note >}}

   This tutorial uses the `exec` command to execute the host process of `nginx` server to let all signals sent from `docker` be received by `nginx` while `nginx` can use the standard input and output streams of the container. Besides, the `save-artifacts` script allows a new build to reuse content from a previous version of application image. The `save-artifacts` script can be deleted because this tutorial does not implement incremental building.

   

   本教程使用 `exec` 命令执行 `nginx` 服务器主机进程，让 `nginx` 接收从 `docker` 发送的所有信号，而 `nginx` 可以使用容器的标准输入和输出流。此外，`save artifacts` 脚本允许新的构建重用应用程序早期版本镜像内容。`save-artifacts` 脚本可以删除，因为本教程不实现增量构建。 

   {{</ notice >}}

3. 创建一个 `usage` 脚本，如下所示，它会打印出镜像使用说明。

   ```bash
   #!/bin/bash -e
   cat <<EOF
   This is the nginx-centos7 S2I image:
   To use it, install S2I: https://github.com/kubesphere/s2i-operator
   Sample invocation:
   s2i build test/test-app kubespheredev/nginx-centos7 nginx-centos7-app
   You can then run the resulting image via:
   docker run -d -p 8080:8080 nginx-centos7-app
   and see the test via http://localhost:8080
   EOF
   ```

### 步骤 4：构建与运行

1. 修改在 `Makefile` 的镜像名称。

   ```bash
   IMAGE_NAME = kubespheredev/nginx-centos7-s2ibuilder-sample
   
   # Create an Image Builder named above based on the Dockerfile that was created previously.
   .PHONY: build
   build:
   	docker build -t $(IMAGE_NAME) .
   
   # The Image Builder can be tested using the following commands:
   .PHONY: test
   test:
   	docker build -t $(IMAGE_NAME)-candidate .
   	IMAGE_NAME=$(IMAGE_NAME)-candidate test/run
   ```

2. 运行 `make build` 命令为 NGINX 构建镜像构建器。

   ```bash
   $ make builddocker build -t kubespheredev/nginx-centos7-s2ibuilder-sample .Sending build context to Docker daemon  164.9kBStep 1/17 : FROM kubespheredev/s2i-base-centos7:1 ---> 48f8574c05dfStep 2/17 : LABEL maintainer="Runze Xia <runzexia@yunify.com>" ---> Using cache ---> d60ebf231518Step 3/17 : ENV NGINX_VERSION=1.6.3 ---> Using cache ---> 5bd34674d1ebStep 4/17 : LABEL io.k8s.description="Nginx Webserver"       io.k8s.display-name="Nginx 1.6.3"       io.kubesphere.expose-services="8080:http"       io.kubesphere.tags="builder,nginx,html" ---> Using cache ---> c837ad649086Step 5/17 : RUN yum install -y epel-release &&     yum install -y --setopt=tsflags=nodocs nginx &&     yum clean all ---> Running in d2c8fe644415………………………………Step 17/17 : CMD ["/usr/libexec/s2i/usage"] ---> Running in c24819f6be27Removing intermediate container c24819f6be27 ---> c147c86f2cb8Successfully built c147c86f2cb8Successfully tagged kubespheredev/nginx-centos7-s2ibuilder-sample:latest
   ```

3. 在创建镜像构建器后，运行以下命令创建应用程序镜像。

   ```bash
   $ s2i build ./test/test-app kubespheredev/nginx-centos7-s2ibuilder-sample:latest sample-app---> Building and installing application from source...Build completed successfully
   ```

   {{< notice note >}}

   Following the logic defined in the `assemble` script, S2I creates an application image using the Image Builder as a base and injecting the source code from the `test/test-app` directory.

   按照 `assemble` 脚本中定义的逻辑，S2I 使用镜像构建器作为基础创建应用程序镜像，并从 `test/test app` 目录注入源代码。

   {{</ notice >}}

4. 运行以下命令以运行应用程序镜像。

   ```bash
   docker run -p 8080:8080  sample-app
   ```

   您可以在此位置访问 Nginx 应用程序：`http://localhost:8080`。

   ![access-nginx](/images/docs/project-user-guide/image-builder/s2i-templates/access-nginx.png)

### 步骤 5：推送镜像与创建 S2I 模板

在本地完成 S2I 镜像构建器测试后，可以将镜像推送到自定义镜像仓库。您还需要创建一个 YAML 文件作为 S2I 构建器模板，如下所示。

#### s2ibuildertemplate.yaml

```yaml
apiVersion: devops.kubesphere.io/v1alpha1kind: S2iBuilderTemplatemetadata:  labels:    controller-tools.k8s.io: "1.0"    builder-type.kubesphere.io/s2i: "s2i"  name: nginx-demospec:  containerInfo:    - builderImage: kubespheredev/nginx-centos7-s2ibuilder-sample  codeFramework: nginx # type of code framework  defaultBaseImage: kubespheredev/nginx-centos7-s2ibuilder-sample # default Image Builder (can be replaced by customized image)  version: 0.0.1 # Builder template version  description: "This is a S2I builder template for Nginx builds whose result can be run directly without any further application server.." # Builder template description
```

### 步骤 6：在 KubeSphere 使用 S2I 模板

1. 运行以下命令将上面创建的 S2I 模板提交至 KubeSphere。

   ```bash
   $ kubectl apply -f s2ibuildertemplate.yamls2ibuildertemplate.devops.kubesphere.io/nginx created
   ```

2. 在 KubeSphere 上创建 S2I build 时，可以找到可用的自定义 S2I 模板。

   ![template-available](/images/docs/project-user-guide/image-builder/s2i-templates/template-available.png)

## S2I 模板参数定义

请参阅以下 S2I 模板标签作为参数传递给前端分类的详细说明。

| 标签名称                              | 选项                 | 定义                                                         |
| ------------------------------------- | -------------------- | ------------------------------------------------------------ |
| builder-type.kubesphere.io/s2i: "s2i" | "s2i"                | 模板类型为 S2I，基于应用程序源代码构建镜像。                 |
| builder-type.kubesphere.io/b2i        | "b2i"                | 模板类型为 B2I，基于二进制文件或其他制品构建镜像。           |
| binary-type.kubesphere.io             | "jar","war","binary" | 该类型为 B2I 类型的补充，在选择 B2I 类型时需要。例如，当提供 Jar 包时，选择 "jar" 类型。在 KubeSphere v2.1.1 及更高版本，允许自定义B2I模板。 |

参见以下 S2I 模板参数的详细说明。所需参数用星号标记。

| 参数                                       | 类型     | 定义                                                         |
| ------------------------------------------ | -------- | ------------------------------------------------------------ |
| *containerInfo                             | []struct | 关于镜像构建器的信息。                                       |
| *containerInfo.builderImage                | string   | 镜像构建器，如：kubesphere/java-8-centos7:v2.1.0. S2I。      |
| containerInfo.runtimeImage                 | string   | 运行时镜像，如：kubesphere/java-8-runtime:v2.1.0. S2I。      |
| containerInfo.buildVolumes                 | []string | 关于安装卷的信息。格式为 "volume_name:mount_path", 如："s2i_java_cache:/tmp/artifacts","test_cache:test_path"]。 |
| containerInfo.runtimeArtifacts             | []struct | 输出制品的原始路径和目标路径；仅在分阶段构建中添加。         |
| 制品facts.source                           | string   | 制品在镜像构建器的原始路径。                                 |
| containerInfo.runtimeArtifacts.destination | string   | 运行时镜像中制品的目标路径。                                 |
| containerInfo.runtimeArtifacts.keep        | bool     | 是否将数据保留在输出镜像中。                                 |
| *defaultBaseImage                          | string   | 默认镜像构建器。                                             |
| *codeFramework                             | string   | 代码框架类型，如：Java，Ruby。                               |
| environment                                | []struct | 构建过程中的环境变量列表。                                   |
| environment.key                            | string   | 环境变量的名称。                                             |
| environment.type                           | string   | 环境变量键的类型。                                           |
| environment.description                    | string   | 环境变量的描述。                                             |
| environment.optValues                      | []string | 环境变量的参数列表。                                         |
| environment.required                       | bool     | 是否需要设置环境变量。                                       |
| environment.defaultValue                   | string   | 环境变量的默认值。                                           |
| environment.value                          | string   | 环境变量的值。                                               |
| iconPath                                   | string   | 应用名字。                                                   |
| version                                    | string   | S2I 模板版本。                                               |
| description                                | string   | 模板功能和用法的说明。                                       |

