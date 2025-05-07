---
title: 'KubeSphere MCP Server: 增强AI与KubeSphere的集成能力'
tag: '产品动态'
keyword: '社区, 开源, MCP, KubeSphere'
description: 'KubeSphere MCP Server 实现了 AI 助手与 KubeSphere 的无缝集成，使用户能够通过自然语言交互管理云原生资源。'
createTime: '2025-5-6'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/KSMCPSERVER2025.png'
---


在云原生和AI技术快速融合的今天，开源社区一直在寻找将 AI 能力无缝集成到云平台的高效方式。我们很高兴地宣布，KubeSphere 现已支持Model Context Protocol (MCP)，通过全新的 KubeSphere MCP Server，用户可以使用 AI 助手直接与 KubeSphere API 交互，实现更智能化的云平台管理体验。


## 什么是KubeSphere MCP Server？

KubeSphere MCP Server是基于 **[Model Context Protocol (MCP)]** 规范实现的服务，它提供了与KubeSphere API的无缝集成，使AI助手能够直接获取和操作KubeSphere资源。该服务主要分为四个功能模块：

- **工作空间管理** - 创建、查询和管理 KubeSphere 工作空间
- **集群管理** - 监控和管理 K8s 集群资源
- **用户和角色** - 管理用户权限和角色分配
- **扩展中心** - 扩展 KubeSphere 的功能

通过这些模块，用户可以简单地通过与 AI 助手的对话来完成原本需要在 KubeSphere 控制台或命令行中进行的操作，大大提高管理效率。


## 为什么使用KubeSphere MCP Server？

- **自然语言交互**：通过 Claude、Cursor 等支持 MCP 的 AI 助手，用户可以使用自然语言与 KubeSphere 平台交互
- **降低学习门槛**：即使不熟悉 KubeSphere API或命令行操作，也能轻松管理资源
- **高效问题诊断**：AI 助手可以帮助分析集群状态，提供问题解决建议
- **流程自动化**：通过对话式界面自动执行多步骤操作

## 快速上手指南

### 前提条件

已部署的 KubeSphere 集群（包含访问地址、用户名和密码）


### 配置步骤

#### 1. 生成KubeSphere配置文件

配置文件格式类似于 kubeconfig，包含 HTTP 连接信息。默认的 KubeSphere context名称为`kubesphere`，可以通过环境变量`KUBESPHERE_CONTEXT`修改。

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
`<CA file>`: 非必填，当KubeSphere使用HTTPS访问时，填写base64编码格式的CA证书    
`<Server Address>`: 必填，必须填写HTTPS的地址。（如果使用HTTP，此处填写任意HTTPS的地址，然后通过参数`--ks-apiserver http://xxx`进行修改）    
`<KubeSphere Username>`: 必填，KubeSphere集群的用户    
`<KubeSphere Password>`: 必填，KubeSphere集群的用户的密码   

#### 2. 获取ks-mcp-server二进制文件

您可以通过以下方式获取 ks-mcp-server 二进制文件：

- 从源码构建：`go build -o ks-mcp-server cmd/main.go`
- 从[GitHub Releases](https://github.com/kubesphere/ks-mcp-server/releases)下载

获取后，请确保将其添加到系统的`$PATH`环境变量中。

#### 3. 在AI客户端中配置MCP服务器

**Claude Desktop配置**

按照 [Claude Desktop文档](https://modelcontextprotocol.io/quickstart/user) 修改MCP配置：

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
`<ksconfig file absolute path>`: 必填，通过步骤 **1-生成 KubeSphere 配置文件** 的绝对路径。
`<KubeSphere Address>`: 非必填，但HTTP访问时必填，KubeSphere集群的访问地址，支持ks-console或ks-apiserver的服务地址，例如：`http://172.10.0.1:30880`

**Cursor配置**

按照 [Cursor文档](https://docs.cursor.com/context/model-context-protocol) 修改MCP配置：

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
`<ksconfig file absolute path>`: 必填，通过步骤 **1-生成 KubeSphere 配置文件** 的绝对路径。
`<KubeSphere Address>`: 非必填，但HTTP访问时必填，KubeSphere集群的访问地址，支持ks-console或ks-apiserver的服务地址，例如：`http://172.10.0.1:30880`
    
### 使用示例

配置完成后，您可以通过 Claude Desktop 或 Cursor 等AI助手与 KubeSphere 交互。示例对话：

- "列出 KubeSphere 中所有的工作空间"
![](https://pek3b.qingstor.com/kubesphere-community/images/ksmcpclusterchatu1.png)

- "显示我的集群状态"
![](https://pek3b.qingstor.com/kubesphere-community/images/ksmcpclusterchatu2.png)

AI助手将通过 KubeSphere MCP Server 获取相关信息并以人类可读的方式呈现。

## 社区参与

KubeSphere MCP Server 是一个开源项目，我们欢迎社区成员的贡献和反馈。如果您有任何问题或建议，请通过以下方式联系我们：

- GitHub仓库：[https://github.com/kubesphere/ks-mcp-server](https://github.com/kubesphere/ks-mcp-server)
- KubeSphere论坛：[https://kubesphere.com.cn/forum/](https://kubesphere.com.cn/forum/)
- Slack频道：[https://kubesphere.slack.com](https://kubesphere.slack.com)

## 结语

KubeSphere MCP Server 代表了云原生管理与AI交互的未来方向。通过将强大的语言模型能力与 KubeSphere 的丰富功能相结合，我们致力于为用户提供更智能、更高效的云平台管理体验。无论您是资深 DevOps 工程师还是刚接触云原生的新手，KubeSphere MCP Server 都能帮助您更轻松地管理和使用KubeSphere平台。

现在就开始尝试 KubeSphere MCP Server，体验AI赋能的云原生管理新方式！