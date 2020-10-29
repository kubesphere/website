# Website

This project uses [Hugo](https://gohugo.io/) to build the new website for KubeSphere.

## Contribute

### Fork and clone the repo

First, create your own fork of the repository.

Then, clone your fork and enter into it:

```
git clone https://github.com/<username>/website
cd website
```

### Building the website

You will need to build the website in order to **publish it as static content.**

#### Install Hugo extended

Go to the [Hugo releases place](https://github.com/gohugoio/hugo/releases) and download the `hugo_extended` version that better suits your OS (version 0.70+).

**EXTENDED version is MANDATORY to properly build the static content!**

Note: If you install Hugo on Windows, you need to add environment variables for the exe file of Hugo. For example, you place the exe file in the path `C:\Hugo\bin`. You have to add this path in environment variables. Execute `hugo version` to view if the installation is successful.

#### Config your domain

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

Click **Details** as shown in the image below, which will direct you to the website homepage. Navigate to the part you want to preview.

![](https://ap3.qingstor.com/kubesphere-website/docs/preview-pr-github.png)

If the button above does not appear, go to **Files changed** tab. Click the three dots of the md file you want to preview as shown below. Please note that this method can only give you a preview on the GitHub instead of on the website.

![view-file](https://ap3.qingstor.com/kubesphere-website/docs/view-file-github.png)

## Localizing

### Find your two-letter language code

First, find your localization’s two-letter country code. For example, the two-letter code for Turkey is tr. Then, open `config.toml` and change the menu of the language you want to translate.

```
[languages.tr]
weight = 3
contentDir = "content/tr" // there should be changed
languageCode = "tr-TR" // there should be changed
languageName = "Türk" // there should be changed

[[languages.tr.menu.main]]
weight = 1
name = "Why KubeSphere" // there should be translated
URL = "reason"

[[languages.tr.menu.main]]
weight = 2
name = "Scenario" // there should be translated
hasChildren = true

  [[languages.tr.menu.main]]
  parent = "Scenario"  // there should be translated
  name = "Multi-cluster" // there should be translated
  URL = "multi-cluster"
  weight = 1

```

### Add a new localization directory

Add a language-specific subdirectory to the content folder in the repository. For example, the two-letter code for German is de. It should be named as what you set in `contentDir` in the previous step

### Translating content

Localizations must be based on the English files in `content/en` . Some attributes which represent some resource paths do not need to be translated，like `icon`,`image` ,etc.

### Site strings in i18n

Localizations must include the contents of i18n/en.yaml in a new language-specific file.

### Translating data

Localizations must be based on the English files in `data/en` .
