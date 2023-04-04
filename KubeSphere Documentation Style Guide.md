# KubeSphere Documentation Style Guide

This style guide provides a set of editorial guidelines for those who are writing documentation for KubeSphere.

## Basic Rules

- Write clearly, concisely and precisely.
- English is the preferred language to use when you write documentation. If you are not sure whether you are writing correctly, you can use grammar checkers (for example, [grammarly](https://www.grammarly.com/)). Although they are not 100% accurate, they can help you get rid of most of the wording issues. That said, Chinese is also acceptable if you really don't know how to express your meaning in English.
- Recommended image or diagram tools: [draw.io](https://draw.io) and [Visio](https://www.microsoft.com/en-ww/microsoft-365/visio/flowchart-software/).

## Preparation Notice

Before you start writing the specific steps for a feature, state clearly what should be ready in advance, such as necessary components, accounts or roles (do not tell readers to use `admin` for all the operations, which is unreasonable in reality for different tenants), or a specific environment. You can add this part at the beginning of a tutorial or put it in a separate part (for example, **Prerequisites**).

## Paragraphs

- It is not recommended that you write a single sentence more than two lines (excluding enumeration).
- Do not leave any space at the beginning of each paragraph, which means the entire text is left aligned and single spaced.
- It is recommended that you use an ordered list to organize your paragraphs for a specific operation. This is to tell your readers what step they are in and they can have a clear view of the overall process. For example:

1. Go to **Application Workloads** and click **Workloads**.
2. Click **Create** on the right to create a Deployment.
3. Enter the basic information and click **Next**.

## Titles

Give a title first before you write a paragraph. It can be grouped into different levels.

```bash
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

- Heading 1: The title of a tutorial. You do not need to add this type of title in the main body as it is already defined at the beginning in the value `title`.
- Heading 2: The title of a major part in the tutorial. Make sure you capitalize each word in Heading 2, except prepositions, articles, conjunctions and words that are commonly written with a lowercase letter at the beginning (for example, macOS).
- Heading 3: A subtitle under Heading 2. You only need to capitalize the first word for Heading 3.
- Heading 4: This is rarely used as Heading 2 and Heading 3 will do in most cases. Make sure if Heading 4 is really needed before you use it.
- Do not add any periods after each heading.

## Images

- When you submit your md files to GitHub, make sure you add related image files that appear in md files in the pull request as well. Please save your image files in static/images/docs. You can create a folder in the directory to save your images.
- If you want to add remarks (for example, put a box on a UI button), use the color **green**. As some screenshot apps does not support the color picking function for a specific color code, as long as the color is **similar** to #09F709, #00FF00, #09F709 or #09F738, it is acceptable.
- Image format: PNG.
- Make sure images in your guide match the content. For example, you mention that users need to log in to KubeSphere using a user of a role; this means the account that displays in your image is expected to be the one you are talking about. It confuses your readers if the content you are describing is not consistent with the image used.
- Recommended: [Xnip](https://xnipapp.com/) for Mac and [Sniptool](https://www.reasyze.com/sniptool/) for Windows.


## Tone

- Do not use “we”. Address the reader as “you” directly. Using “we” in a sentence can be confusing, because the reader might not know whether they are part of the “we” you are describing. You can also use words like users, developers, administrators and engineers, depending on the feature you are describing.

  | Do                                                           | Don't                                                        |
  | ------------------------------------------------------------ | ------------------------------------------------------------ |
  | The component has been installed. You can now use the feature. | The component has been installed. We can now use the feature. |

- Do not use words which can imply a specific gender, including he, him, his, himself, she, her, hers and herself.

## Format

### Punctuations

Use a **period** or a **conjunction** between two **complete** sentences.

| Do                                                           | Don't                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| The component has been installed. You can now use the feature. | The component has been installed, you can now use the feature. |
| Check the status of the component. You can see it is running normally. | Check the status of the component, you can see it is running normally. |
| Check the status of the component, and you can see it is running normally. | Check the status of the component, you can see it is running normally. |

### Bold

- Mark any UI text (for example, a button) in bold.

  | Do                                                           | Don't                                                        |
  | ------------------------------------------------------------ | ------------------------------------------------------------ |
  | In the top-right corner of this page, click **Save**.        | In the top-right corner of this page, click Save.            |
  | In **Workspaces**, you can see all your workspaces listed.   | In Workspaces, you can see all your workspaces listed.       |
  | On the **Create Project** Page, click **OK** in the bottom-right corner to continue. | On the Create Project Page, click OK in the bottom-right corner to continue. |

- Mark the content of great importance or deserving special attention to readers in bold. For example:

KubeSphere is a **distributed operating system managing cloud-native applications** with Kubernetes as its kernel.

### Prepositions

When describing the UI, you can use the following prepositions.

<table>
  <thead>
    <tr>
      <th width="15%">Preposition</th>
      <th width="15%">UI element</th>
      <th width="70%">Recommended</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="6">in</td>
      <td>dialogs</td>
      <td>In the <b>Delete User</b> dialog, enter the name and click <b>OK</b>.</td>
    </tr>
    <tr>
      <td>fields</td>
      <td>In the <b>Name</b> field, enter <code>demo-name</code>.</td>
    </tr>
    <tr>
      <td>lists</td>
      <td>In the <b>Language</b> drop-down list, select a desired language.</td>
    </tr>
    <tr>
      <td>menus</td>
      <td>In the <b>More</b> menu, click <b>Delete</b>.</td>
    </tr>
    <tr>
      <td>sidebars</td>
      <td>Click <b>Volumes</b> under <b>Storage</b> in the sidebar.</td>
    </tr>
    <tr>
      <td>windows</td>
      <td>In the <b>Metering and Billing</b> window, click <b>View Consumption</b>.</td>
    </tr>
    <tr>
      <td rowspan="2">on</td>
      <td>pages</td>
      <td>On the <b>Volumes</b> page, click <b>Create</b>.</td>
    </tr>
     <tr>
      <td>tabs</td>
      <td>On the <b>Deployments</b> tab, click <b>Create</b>.</td>
    </tr>
  </tbody>
</table>  

### Code

- For short commands, you can just put them within ``. This is often used when you only need to tell readers about a short command or it is sufficient to express your meaning just with the command in a sentence.

  | Do                                                | Don't                                           |
  | ------------------------------------------------- | ----------------------------------------------- |
  | You can use `kubectl get pods` to list your Pods. | You can use kubectl get pods to list your Pods. |

- Alternatively, you can use code fences so that readers can copy them directly, especially for long commands. For example:

  Run the following command to edit the configuration of `ks-console`:

  ```bash
  kubectl edit svc ks-console -o yaml -n kubesphere-system
  ```

- For values, strings, fields or parameters in yaml files, put them within ``.

  | Do                                                           | Don't                                                        |
  | ------------------------------------------------------------ | ------------------------------------------------------------ |
  | Change the value of `auditing.enabled` to `false` to stop receiving auditing logs from KubeSphere. | Change the value of auditing.enabled to false to stop receiving auditing logs from KubeSphere. |

- Put all path and file names within ``.

  However, if the file name itself contains a link, do not put it within ``.
  
  | Do                         | Don't                    |
  | -------------------------- | ------------------------ |
  | `/root/csi-qingcloud.yaml` | /root/csi-qingcloud.yaml |
  | `config-sample.yaml`       | config-sample.yaml       |
  | `/var/lib/docker`          | /var/lib/docker          |

- Put workspace names, project names, account names, and role names within ``.

  | Do                                                     | Don't                                                |
  | ------------------------------------------------------ | ---------------------------------------------------- |
  | Log in to the console as `admin`.                      | Log in to the console as admin.                      |
  | The account will be assigned the role `users-manager`. | The account will be assigned the role users-manager. |

### Code Comments

- If the comment is used only for a specific value, put the comment on the same line of the code. However, if the code is too long and putting the comment on the same line is not appropriate in terms of reading experience, you can put the code comment above the code. For example:

  ```yaml
  registry:
    registryMirrors: []   # For users who need to speed up downloads.
  ```

  ```bash
  # Assume your original Kubernetes cluster is v1.20.4
  ./kk create config --with-kubesphere --with-kubernetes v1.20.4
  ```

- If the comment is used for all the code (for example, serving as a header for explanations), put the comment at the beginning above the code. For example:

  ```yaml
  # Internal LB config example
    controlPlaneEndpoint:
      domain: lb.kubesphere.local
      address: "192.168.0.253"
      port: "6443"
  ```

### Variables

Put variables within angle brackets `<>`. For example: 

Access your app at `<NodeIP>:<NodePort>`.

## Links

**Internal Links**

For links that direct readers to an internal website of KubeSphere, use relative links. For example, you want to add the link https://kubesphere.io/docs/introduction/what-is-kubesphere/ to "What is KubeSphere" in an internal guide in KubeSphere Documentation, the relative link can be:

../../../introduction/what-is-kubesphere/

../../introduction/what-is-kubesphere/

../what-is-kubesphere/

../../what-is-kubesphere/

The above are just four possible options and you may need to change the number of "../" and path name depending on the file directory. You can preview the link locally to see if the link works.

**External Links**

For links that direct readers to an external website, use absolute links directly (the complete URL address).

## Reference

If you cite some expressions from an external website (i.e. the content is exactly the same), add an extra part called **Reference** at the end of the tutorial listing all the referred materials. This is to give credit to its original author and avoid possible plagiarism issues.