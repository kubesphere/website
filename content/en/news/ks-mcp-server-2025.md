---
title: 'KubeSphere MCP Server: Enhancing AI Integration with KubeSphere'
tag: 'Product News'
keyword: 'open source, KubeSphere, K8s, MCP'
description: 'KubeSphere MCP Server enables seamless integration of AI assistants with KubeSphere, allowing users to manage cloud-native resources through natural language interactions.'
createTime: '2025-5-6'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/KSMCPSERVER2025.png'
---


As cloud-native and AI technologies rapidly converge, the open-source community has been searching for efficient ways to seamlessly integrate AI capabilities into cloud platforms. We are excited to announce that KubeSphere now supports the Model Context Protocol (MCP). With the new KubeSphere MCP Server, users can interact with the KubeSphere API via AI assistants, enabling a smarter cloud management experience.

## What is KubeSphere MCP Server?

KubeSphere MCP Server is a service implemented based on the Model Context Protocol (MCP) specification. It enables seamless integration with the KubeSphere API, allowing AI assistants to access and operate on KubeSphere resources. The server consists of four main functional modules:

- **Workspace Management** -  Create, query, and manage KubeSphere workspaces
- **Cluster Management** - Monitor and manage Kubernetes cluster resources
- **User and Role Management** - Manage user permissions and role assignments
- **Extension Center** - Extend the functionality of KubeSphere

With these modules, users can perform actions originally done via the KubeSphere console or command line by simply conversing with an AI assistant, significantly improving operational efficiency.

## Why Use KubeSphere MCP Server?

- **Natural Language Interaction**：With MCP-supported AI assistants such as Claude or Cursor, users can interact with KubeSphere using natural language
- **Lower Learning Curve**：Easily manage resources even without familiarity with KubeSphere APIs or CLI
- **Efficient Troubleshooting**：AI assistants can analyze cluster health and suggest solutions
- **Workflow Automation**：Automate multi-step operations via conversational interfaces

## Quick Start Guide

### Prerequisites

- A deployed KubeSphere cluster
- Access credentials including address, username, and password

### Setup Steps

#### Step 1: Generate KubeSphere Configuration File

The configuration file is similar to a kubeconfig and includes HTTP connection details. The default context name is `kubesphere`, which can be modified using the environment variable `KUBESPHERE_CONTEXT`.

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <CA file>
    server: <Server Address>
  name: kubesphere
contexts:
- context:
    cluster: kubesphere
    user: admin
  name: kubesphere
current-context: kubesphere
kind: Config
preferences: {}
users:
- name: admin
  user:
    username: <KubeSphere Username>
    password: <KubeSphere Password>
```

**Note:**

- `<CA file>`: Optional. Provide the base64-encoded CA cert if using HTTPS
- `<Server Address>`: Required. Must be an HTTPS address (can be overwritten using --ks-apiserver for HTTP)
- `<KubeSphere Username>` and `<KubeSphere Password>`: Required for authentication

#### Step 2: Obtain the `ks-mcp-server` Binary

You can obtain the binary by:

- Building from source: `go build -o ks-mcp-server cmd/main.go`
- Downloading from [GitHub Releases](https://github.com/kubesphere/ks-mcp-server/releases)

Ensure the binary is added to your system's `$PATH`.

#### Step 3: Configure MCP Server in AI Clients

**Claude Desktop Configuration**


```json
{
  "mcpServers": {
    "KubeSphere": {
      "args": [
        "stdio",
        "--ksconfig", "<ksconfig file absolute path>",
        "--ks-apiserver", "<KubeSphere Address>"
      ],
      "command": "ks-mcp-server"
    }
  }
}
```


**Cursor Configuration**


```json
{
  "mcpServers": {
    "KubeSphere": {
      "command": "ks-mcp-server",
      "args": [
        "stdio",
        "--ksconfig","<ksconfig file absolute path>",
        "--ks-apiserver","<KubeSphere Address>"
      ]
    }
  }
}
```
`<ksconfig file absolute path>`: Required. Absolute path to the config file created in Step 1
`<KubeSphere Address>`: Optional unless using HTTP; specify `ks-console` or `ks-apiserver` address like `http://172.10.0.1:30880`
    
### Usage Examples

Once setup is complete, you can interact with KubeSphere through AI assistants like Claude Desktop or Cursor. Example interactions include:

- "List all workspaces in KubeSphere"
![](https://pek3b.qingstor.com/kubesphere-community/images/list%20all%20workspaces%20mcp.png)

- "Show  my cluster in KubeSphere"
![](https://pek3b.qingstor.com/kubesphere-community/images/cluster%20in%20kubesphere%20mcp.png)

The AI assistant will retrieve the information via KubeSphere MCP Server and present it in human-readable format.

## Community Participation

KubeSphere MCP Server is open source, and contributions or feedback from the community are welcome. You can reach out via:

- GitHub：[https://github.com/kubesphere/ks-mcp-server](https://github.com/kubesphere/ks-mcp-server)
- Slack Channel: [https://kubesphere.slack.com](https://kubesphere.slack.com)

## Conclusion

KubeSphere MCP Server represents a forward-looking fusion of cloud-native management and AI interaction. By integrating powerful language model capabilities with the rich functionality of KubeSphere, we aim to deliver a more intelligent and efficient cloud management experience. Whether you are a seasoned DevOps engineer or new to cloud-native technologies, the MCP Server can help you manage and operate the KubeSphere platform with ease.

**Start using KubeSphere MCP Server now and experience the AI-powered future of cloud-native operations!**



