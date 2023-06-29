---
title: "Customize S2I Templates"
keywords: 'KubeSphere, Kubernetes, Docker, S2I, Source-to-Image'
description: 'Customize S2I templates and understand different template parameters.'
linkTitle: "Customize S2I Templates"
weight: 10640
---

Once you have understood the workflow and logic of Source-to-Image (S2I), you can customize Image Builder templates (i.e. S2I/B2I templates) based on your projects to extend S2I capabilities. KubeSphere provides several common Image Builder templates based on different languages, such as [Python](https://github.com/kubesphere/s2i-python-container/) and [Java](https://github.com/kubesphere/s2i-java-container/).

This tutorial demonstrates how to create an Image Builder that contains an NGINX service. If you need to use runtime images in your project, refer to [this document](https://github.com/kubesphere/s2irun/blob/master/docs/runtime_image.md) for more information about how to create a runtime image.

## Prerequisites

S2I template customization can be divided into two parts.

- Part 1: S2I Image Builder customization
  - assemble (required): the `assemble` script that builds application artifacts from source code.
  - run (required): the `run` script that executes an application.
  - save-artifacts (optional): the `save-artifacts` script that manages all dependencies in an incremental building process.
  - usage (optional): the script that provides instructions.
  - test (optional): the script for testing.
- Part 2: definition of S2I template

You need to have the required elements for S2I template customization ready in advance.

{{< notice note >}}

The Image Builder is compatible with that of OpenShift, and you can reuse it in KubeSphere. For more information about S2I Image Builders, refer to [S2IRun](https://github.com/kubesphere/s2irun/blob/master/docs/builder_image.md#s2i-builder-image-requirements).

{{</ notice >}}

## Create an Image Builder

### Step 1: Prepare an S2I directory

1. The [S2I command line tool](https://github.com/openshift/source-to-image/releases) provides an easy-to-use command to initialize a base directory structure required by the Builder. Run the following commands to install the S2I CLI.

   ```bash
   $ wget https://github.com/openshift/source-to-image/releases/download/v1.1.14/source-to-image-v1.1.14-874754de-linux-386.tar.gz
   $ tar -xvf source-to-image-v1.1.14-874754de-linux-386.tar.gz
   $ ls
   s2i source-to-image-v1.1.14-874754de-linux-386.tar.gz  sti
   $ cp s2i /usr/local/bin
   ```

2. This tutorial uses `nginx-centos7` as the name of the Image Builder. Run the `s2i create` command to initialize the base directory structure.

   ```bash
   s2i create nginx-centos7 s2i-builder-docs
   ```

3. The directory structure is initialized as follows.

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

### Step 2: Modify the Dockerfile

A Dockerfile installs all of the necessary tools and libraries that are needed to build and run an application. This file will also copy the S2I scripts into the output image.

Modify the Dockerfile as follows to define the Image Builder.

#### Dockerfile

```
# nginx-centos7
FROM kubespheredev/s2i-base-centos7:1

# Here you can specify the maintainer for the image that you're building
LABEL maintainer="maintainer name <email@xxx.com>"

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

S2I scripts will use the flags defined in the Dockerfile as parameters. If you need to use a base image different from those provided by KubeSphere, refer to [S2I Scripts](https://github.com/kubesphere/s2irun/blob/master/docs/builder_image.md#s2i-scripts).

{{</ notice >}}

### Step 3: Create S2I Scripts

1. Create an `assemble` script as follows to copy the configuration file and static contents to the target container.

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

   By default, `s2i build` places the application source code in `/tmp/src`. The above commands copy the application source code to the working directory `/opt/app-root/src` defined by `kubespheredev/s2i-base-centos7:1`.

   {{</ notice >}}

2. Create a `run` script as follows. In this tutorial, it only starts the `nginx` server.

   ```bash
   #!/bin/bash -e
   
   exec /usr/sbin/nginx -g "daemon off;"
   ```

   {{< notice note >}}

   This tutorial uses the `exec` command to execute the host process of `nginx` server to let all signals sent from `docker` be received by `nginx` while `nginx` can use the standard input and output streams of the container. Besides, the `save-artifacts` script allows a new build to reuse content from a previous version of application image. The `save-artifacts` script can be deleted because this tutorial does not implement incremental building. 

   {{</ notice >}}

3. Create a `usage` script as follows. It prints out instructions on how to use the image.

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

### Step 4: Build and run

1. Modify the image name in `Makefile`.

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

2. Run the `make build` command to build the Image Builder for NGINX.

   ```bash
   $ make build
   docker build -t kubespheredev/nginx-centos7-s2ibuilder-sample .
   Sending build context to Docker daemon  164.9kB
   Step 1/17 : FROM kubespheredev/s2i-base-centos7:1
    ---> 48f8574c05df
   Step 2/17 : LABEL maintainer="Runze Xia <runzexia@yunify.com>"
    ---> Using cache
    ---> d60ebf231518
   Step 3/17 : ENV NGINX_VERSION=1.6.3
    ---> Using cache
    ---> 5bd34674d1eb
   Step 4/17 : LABEL io.k8s.description="Nginx Webserver"       io.k8s.display-name="Nginx 1.6.3"       io.kubesphere.expose-services="8080:http"       io.kubesphere.tags="builder,nginx,html"
    ---> Using cache
    ---> c837ad649086
   Step 5/17 : RUN yum install -y epel-release &&     yum install -y --setopt=tsflags=nodocs nginx &&     yum clean all
    ---> Running in d2c8fe644415
   
   …………
   …………
   …………
   
   Step 17/17 : CMD ["/usr/libexec/s2i/usage"]
    ---> Running in c24819f6be27
   Removing intermediate container c24819f6be27
    ---> c147c86f2cb8
   Successfully built c147c86f2cb8
   Successfully tagged kubespheredev/nginx-centos7-s2ibuilder-sample:latest
   ```

3. With the Image Builder created, run the following command to create an application image.

   ```bash
   $ s2i build ./test/test-app kubespheredev/nginx-centos7-s2ibuilder-sample:latest sample-app
   ---> Building and installing application from source...
   Build completed successfully
   ```

   {{< notice note >}}

   Following the logic defined in the `assemble` script, S2I creates an application image using the Image Builder as a base and injecting the source code from the `test/test-app` directory.

   {{</ notice >}}

4. Run the following command to run the application image.

   ```bash
   docker run -p 8080:8080  sample-app
   ```

   You can access the Nginx application at `http://localhost:8080`.

### Step 5: Push the image and create an S2I template

Once you finish testing the S2I Image Builder locally, you can push the image to your custom image repository. You also need to create a YAML file as the S2I Builder template as follows.

#### s2ibuildertemplate.yaml

```yaml
apiVersion: devops.kubesphere.io/v1alpha1
kind: S2iBuilderTemplate
metadata:
  labels:
    controller-tools.k8s.io: "1.0"
    builder-type.kubesphere.io/s2i: "s2i"
  name: nginx-demo
spec:
  containerInfo:
    - builderImage: kubespheredev/nginx-centos7-s2ibuilder-sample
  codeFramework: nginx # type of code framework
  defaultBaseImage: kubespheredev/nginx-centos7-s2ibuilder-sample # default Image Builder (can be replaced by a customized image)
  version: 0.0.1 # Builder template version
  description: "This is an S2I builder template for NGINX builds whose result can be run directly without any further application server." # Builder template description
```

### Step 6: Use the S2I template on KubeSphere

1. Run the following command to submit the S2I template created above to KubeSphere.

   ```bash
   $ kubectl apply -f s2ibuildertemplate.yaml
   s2ibuildertemplate.devops.kubesphere.io/nginx created
   ```

2. You can find the customized S2I template available in **Build Environment** when you create an S2I build on KubeSphere.

## S2I Template Parameters Definition

Refer to the following detailed descriptions of S2I template labels passed as parameters for frontend classification.

| Label Name                            | Option                 | Definition                                                   |
| ------------------------------------- | ---------------------- | ------------------------------------------------------------ |
| builder-type.kubesphere.io/s2i: "s2i" | "s2i"                  | The type of this template is S2I, which builds images based on application source code. |
| builder-type.kubesphere.io/b2i        | "b2i"                  | The type of this template is B2I, which builds images based on binary files or other artifacts. |
| binary-type.kubesphere.io             | "jar", "war", "binary" | This type is complementary to the type of B2I and will be required when B2I is selected. For example, select the type of "jar" when a JAR package is provided. In KubeSphere v2.1.1 and later, it is also allowed to customize B2I templates. |

Refer to the following detailed descriptions of S2I template parameters. The required parameters are marked with an asterisk.

| Parameter                                  | Type     | Definition                                                   |
| ------------------------------------------ | -------- | ------------------------------------------------------------ |
| *containerInfo                             | []struct | The information about Image Builder.                         |
| *containerInfo.builderImage                | string   | S2I Image Builder, such as kubesphere/java-8-centos7:v2.1.0. |
| containerInfo.runtimeImage                 | string   | S2I Runtime Image, such as kubesphere/java-8-runtime:v2.1.0. |
| containerInfo.buildVolumes                 | []string | The information about mounted volumes. The format is "volume_name:mount_path", such as ["s2i_java_cache:/tmp/artifacts","test_cache:test_path"]. |
| containerInfo.runtimeArtifacts             | []struct | The list of original path and target path for the output artifact; only add it for phased building. |
| containerInfo.runtimeArtifacts.source      | string   | The original path of artifact in Image Builder.              |
| containerInfo.runtimeArtifacts.destination | string   | The target path of artifact in Runtime Image.                |
| containerInfo.runtimeArtifacts.keep        | bool     | Whether to keep the data in the output image.                |
| *defaultBaseImage                          | string   | The default Image Builder.                                   |
| *codeFramework                             | string   | The code framework type, such as Java and Ruby.              |
| environment                                | []struct | The list of environment variables in the building process.   |
| environment.key                            | string   | The name of environment variables.                           |
| environment.type                           | string   | The type of environment variable keys.                       |
| environment.description                    | string   | The description of environment variables.                    |
| environment.optValues                      | []string | The list of parameters for environment variables.            |
| environment.required                       | bool     | Whether the environment variable is required to be set.      |
| environment.defaultValue                   | string   | The default value of environment variables.                  |
| environment.value                          | string   | The value of environment variables.                          |
| iconPath                                   | string   | The application name.                                        |
| version                                    | string   | The version of S2I template.                                 |
| description                                | string   | The description of the template's functions and usage.       |

