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

### Running the website locally

hugo version: hugo_extended_0.70.0+, you can install Hugo from [hugo releases](https://help.github.com/en/desktop/contributing-to-projects/creating-an-issue-or-pull-request#creating-a-new-pull-request)

When you have installed Hugo, then run:

```
hugo server -D
```

Now you can preview the website in your browser using `http://localhost:1313/`.

### Open a pull request

Open a [pull request (PR)](https://help.github.com/en/desktop/contributing-to-projects/creating-an-issue-or-pull-request#creating-a-new-pull-request) to add a localization to the repository.

## Localizing

### Find your two-letter language code

First, find your localization’s two-letter country code. For example, the two-letter code for Turkey is tr. then, open `config.toml`, change the menu which language you want to translate。

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
