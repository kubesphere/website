# KubeSphere Website

This repository contains two branches that we are working on: master and release-3.0.

The master branch contains KubeSphere Doc 3.1 which has been released together with KubeSphere 3.1. The frontend website currently displays content based on the master branch. If the pull request you submit applies to both the master branch and the release-3.0 branch, use the command `cherry-pick` to submit the same pull request.

This project uses [Hugo](https://gohugo.io/) to build the KubeSphere website.

## Contribute

Contributions of any kind are welcome! Thanks goes to these wonderful contributors, they made our community and product grow fast. 

<a href="https://github.com/kubesphere/website/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=kubesphere/website" />
</a>

### Fork and clone the repo

First, create your own fork of the repository.

Then, clone your fork and enter into it:

```
git clone https://github.com/<username>/website
cd website
```

### Compiling and preview the website

You will need to build the website in order to **publish it as static content.**

#### Install Hugo extended

Go to the [Hugo releases place](https://github.com/gohugoio/hugo/releases) and download the `hugo_extended` version that better suits your OS (version 0.70+).

**EXTENDED version is MANDATORY to properly build the static content!**

Note: If you install Hugo on Windows, you need to add environment variables for the exe file of Hugo. For example, you place the exe file in the path `C:\Hugo\bin`. You have to add this path in environment variables. Execute `hugo version` to view if the installation is successful.

### Running the website locally

hugo version: hugo_extended_0.70.0+, you can install Hugo from [hugo releases](https://github.com/gohugoio/hugo/releases)

When you have installed Hugo, then run:

```
hugo server -D
```

Now you can preview the website in your browser using `http://localhost:1313/`.

### Open a pull request

Open a [pull request (PR)](https://help.github.com/en/desktop/contributing-to-projects/creating-an-issue-or-pull-request#creating-a-new-pull-request) to add a localization to the repository. Please use DCO sign-off when you submit a pr. Refer to the command below (add `-s`):

```bash
git commit -s -m "xxx"
```

### Preview a pull request

Go to **Files changed** tab. Click the three dots of the md file you want to preview as shown below. Please note that this method can only give you a preview on the GitHub instead of on the website.

![view-file](https://ap3.qingstor.com/kubesphere-website/docs/view-file-github.png)

### Cherry Pick a Commit

The command `cherry-pick` allows you to pick a commit in a branch and integrate it into another branch. For example, we are working on both the master branch and the release-3.0 branch. If the pull request you submit to the master branch applies to the release-3.0 branch as well:

In the master branch, find and copy the commit ID of your pull request.

```
git log
```

Checkout to the release-3.0 branch:

```
git checkout release-3.0
```

Rebase first:

```bash
git pull --rebase upstream release-3.0
```

Use the branch release-3.0 to checkout a new branch:

```bash
git checkout -b test
```

Cherry pick:

```bash
git cherry-pick <CommitID>
```

Push it:

```bash
git push -u origin test
```

When you submit the pull request, make sure you submit it to the release-3.0 branch.

## Localizing 

You are welcome to help the KubeSphere community to support more languages, join us to contribute to the localization, see [Localizing the website](localize-website.md) for the instruction.

## Build and Publish the website (Optional)

### Config your domain

Edit the file `config\_default\config.toml` and modify the var `baseURL` (at the
first line) in order to set your own domain. It will be hardcoded in the static
files.

```
baseURL = "https://kubesphere.es"
```

#### Build the static content

Just run `hugo` without parameters.

```bash
hugo

                   | EN  | ZH  | TR
-------------------+-----+-----+------
  Pages            |  55 |  65 |  39
  Paginator pages  |   0 |   0 |   0
  Non-page files   |   0 |   0 |   0
  Static files     | 375 | 375 | 375
  Processed images |   0 |   0 |   0
  Aliases          |   1 |   0 |   0
  Sitemaps         |   2 |   1 |   1
  Cleaned          |   0 |   0 |   0

Total in 2396 ms
```

#### Get the already built static content

You will find the previously generated content in the `public` directory.
