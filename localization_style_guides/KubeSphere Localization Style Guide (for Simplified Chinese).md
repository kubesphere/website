# KubeSphere Localization Style Guide (for Simplified Chinese)

This style guide provides a set of editorial guidelines for those who are translating documentation for KubeSphere from English to Simplified Chinese. The general rules are basically the same as [KubeSphere Documentation Style Guide](https://github.com/kubesphere/website/blob/master/KubeSphere%20Documentation%20Style%20Guide.md), while you need to pay special attention to the following content due to language differences.

## Basic Rules

- You don't need to be a professional translator for the localization, but make sure you are familiar with the content you are going to translate.
- Avoid word-for-word translation; be concise, precise and idiomatic.
- Use correct terminology and be consistent in your translation.

## Tone

Use “您” to address readers to show respect. Namely, translate “you” into “您” instead of “你”.

## UI Consistency

Make sure the term you use is the correct one in UI, or it may confuse readers what buttons or functions you are talking about. 

| Source Text                                              | Correct Target Text                  | Wrong Target Text                |
| -------------------------------------------------------- | ------------------------------------ | -------------------------------- |
| Click **System Components** on the **Cluster Management** page. | 在**集群管理**页面点击**系统组件**。 | 在**集群管理**页面点击**系统组件**。 |

## Format

### Punctuations

The punctuation in Chinese localization does not need to be exactly the same as the original English text. You may change the punctuation if you think it is appropriate for the Chinese text.

Do not use the English period in a Chinese sentence.

| Do                     | Don't                 |
| ---------------------- | --------------------- |
| 所有组件已经安装完成。 | 所有组件已经安装完成. |

### Spaces

- Add a space between Chinese and English.
- Add a space between numbers and Chinese characters.

| Do                                         | Don't                                    |
| ------------------------------------------ | ---------------------------------------- |
| 这 3 个组件现已正常运行。                  | 这3个组件现已正常运行。                  |
| 您现在可以使用 admin 账号登录 KubeSphere。 | 您现在可以使用admin 账号登录KubeSphere。 |

### Brackets

- For brackets between Chinese, use the fullwidth form.
- For brackets between Chinese and English, use the halfwidth form and add a space both before and after the bracket.
- If the content in brackets contains both Chinese and English, use the fullwidth form.

| Do                                                           | Don't                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 您可以将 KubeSphere 快速部署在不同的环境中（例如腾讯云、阿里云、AWS 以及 GCP 等）。 | 您可以将 KubeSphere 快速部署在不同的环境中 (例如腾讯云、阿里云、AWS 以及 GCP 等)。 |
| 您需要在防火墙中开启端口 30880（即 KubeSphere Web 控制台的 NodePort）。 | 您需要在防火墙中开启端口 30880 (即 KubeSphere Web 控制台的 NodePort)。 |
| KubeSphere 帮助您快速创建高可用 (HA) 集群。                  | KubeSphere 帮助您快速创建高可用（HA）集群。                  |
| 您可以使用 Web 控制台内置的命令行工具（kubectl，从页面右下角进入）以操作资源。 | 您可以使用 Web 控制台内置的命令行工具 (kubectl，从页面右下角进入) 以操作资源。 |

### Capitalization and Spelling

Use the correct form of words and phrases.

| Do         | Don't      |
| ---------- | ---------- |
| KubeSphere | kubesphere |
| Kubernetes | kubernetes |
| MySQL      | Mysql      |

## Links

You can refer to [Links in KubeSphere Documentation Style Guide](https://github.com/kubesphere/website/blob/master/KubeSphere%20Documentation%20Style%20Guide.md#Links) for how to set internal and external links respectively. For external links in the target text, change the link to its Simplified Chinese version if it is available.