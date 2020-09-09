# KubeSphere Documentation Style Guide

This style guide provides a set of editorial guidelines for those who are writing documentation for KubeSphere.

## **Basic Rules**

- Write clearly, concisely and precisely.
- English is the preferred language to use when you write documentation. If you are not sure whether you are writing correctly, you can use grammar checkers (e.g. [grammarly](https://www.grammarly.com/)). Although they are not 100% accurate, they can help you get rid of most of the wording issues. That said, Chinese is also acceptable if you really don't know how to express your meaning in English.
- It is recommended that you use more images or diagrams to show UI functions and logical relations with tools such as [draw.io](https://draw.io).

## Paragraphs

- It is not recommended that you write a single sentence more than two lines (excluding enumeration).
- Do not leave any space at the beginning of each paragraph, which means the entire text is left aligned and single spaced.
- It is recommended that you use an ordered list to organize your paragraphs for a specific operation. This is to tell your readers what step they are in and they can have a clear view of the overall process. For example:

1. Go to **Application Workloads** and click **Workloads**.
2. Click **Create** on the right to create a deployment.
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
- Heading 2: The title of a major part in the tutorial. Make sure you capitalize each word in Heading 2, except prepositions, articles, conjunctions and words that are commonly written with a lower case letter at the beginning (e.g. macOS).
- Heading 3: A subtitle under Heading 2. You only need to capitalize the first word for Heading 3.
- Heading 4: This is rarely used as Heading 2 and Heading 3 will do in most cases. Make sure if Heading 4 is really needed before you use it.
- Do not add any periods after each heading.

## Images

When you submit your md files to GitHub, make sure you add related image files that appear in md files in the pull request as well. Please save your image files in ./images/docs. You can create a folder in the directory to save your images.

## Tone

- Do not use "we". Address the reader as "you" directly. Using “we” in a sentence can be confusing, because the reader might not know whether they are part of the “we” you are describing. You can also use words like users, developers, administrators and engineers, depending on the feature you are describing.
- Do not use words which can imply a specific gender, including he, him, his, himself, she, her, hers and herself.

| Do                                                           | Don't                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| The component has been installed. You can now use the feature. | The component has been installed. We can now use the feature. |

## Format

### Punctuations

Use a **period** or a **conjunction** between two **complete** sentences.

| Do                                                           | Don't                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| The component has been installed. You can now use the feature. | The component has been installed, you can now use the feature. |
| Check the status of the component. You can see it is running normally. | Check the status of the component, you can see it is running normally. |
| Check the status of the component, and you can see it is running normally. | Check the status of the component, you can see it is running normally. |

### **Bold**

Mark any UI text (e.g. a button) in bold.

| Do                                                           | Don't                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| In the top-right corner of this page, click **Save**.        | In the top-right corner of this page, click Save.            |
| In **Workspaces**, you can see all your workspaces listed.   | In Workspaces, you can see all your workspaces listed.       |
| On the **Create Project** Page, click **OK** in the bottom-right corner to continue. | On the Create Project Page, click OK in the bottom-right corner to continue. |

### **Code**

For short commands, you can just put them within ``.

| Do                                                | Don't                                           |
| ------------------------------------------------- | ----------------------------------------------- |
| You can use `kubectl get pods` to list your pods. | You can use kubectl get pods to list your pods. |

Alternatively, you can use code fences so that readers can copy them directly, especially for long commands. For example:

Execute the following command to edit the configuration of `ks-console`:

```bash
kubectl edit svc ks-console -o yaml -n kubesphere-system
```

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