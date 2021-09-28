# Sharing Rulesets

A [ruleset](../getting-started/3-rulesets.md) becomes infinitely more useful when other developers are using it. By itself, it's just a way of enforcing some rules on a single project, but when distributed a ruleset can become a "style guide" for enforcing consistency across a whole bunch of projects!

To help you out distribute your rulesets among the others, Spectral provides a few ways to load rulesets from a variety of resources:

- via [Git](#via-Git)
- via [URL](#via-URL)
- via [NPM](#via-NPM)

Or mix and match!

```yaml
extends:
  - ./config/spectral.json
  - https://example.org/api/style.yaml
  - some-npm-module
```

There are various pros and cons to each approach, so see what is right for you.

## via Git 

The most simple use-case is one document, in one Git repo. If this is the case, you could commit the Spectral ruleset containing your ruleset to that Git repo, and everything from [Stoplight Studio](https://stoplight.io/studio/), [VS Code Spectral](https://github.com/stoplightio/vscode-spectral/), etc. will all notice the Spectral ruleset and automatically lint it for all users.

To start this off, plop your `.spectral.yaml` into the root of your project. Then, if you are using [Continuous Integration](8-continuous-integration.md), the config file might have a command which looks something like this:

```yaml
npx @stoplight/spectral-cli lint reference/Some-API.yaml
```

Are there multiple documents in a single repository? In API-world this might be a monorepo containing multiple OpenAPI documents in various folders. 

```
projects/
- some-api/
-- reference/
--- openapi.yaml
-- src/
--- app.js
- another-api/
-- reference/
--- openapi.yaml
-- src/
--- app.ts
```

If the name of that folder is consistent, then you could use wildcard (glob) syntax to find multiple OpenAPI documents:

```
npx @stoplight/spectral-cli lint **/reference/openapi.yaml
```

This will run Spectral on _all_ of the APIs using the same ruleset. This might feel a little heavy handed, but if you need to avoid some rules for some APIs, you can use a Spectral feature called [Overrides](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets#overrides) to turn them off, change the severity, etc.

## via URL

Seeing as most Spectral rulesets are a YAML or JSON file, we can pop that up online anywhere and people can point to it. This could be hosted in Amazon S3, your own website, wherever you like, or you can point to a public GitHub repo.

Then each project that wants to enable Spectral linting can make their own one-line custom ruleset to extend and enable the shared ruleset. 

```yaml
# .spectral.yaml
extends: "https://example.com/company-ruleset.yaml"
```

These rulesets could live anywhere that YAML or JSON is able to be loaded through a HTTP server, like Github:

```yaml
# why not give this one a try! 🥳
extends:
  - https://raw.githubusercontent.com/openapi-contrib/style-guides/master/apisyouwonthate.yml
```

As with any ruleset, you can pass these directly to the [Spectral CLI](./2-cli.md):

```shell
spectral lint -r https://raw.githubusercontent.com/openapi-contrib/style-guides/master/apisyouwonthate.yml
```

## via NPM

As Spectral is a [NPM](https://www.npmjs.com/) package, we support loading rulesets from NPM packages. This allows power-users to leverage [Custom Functions](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTkw-custom-functions). These are JavaScript functions, which let ruleset maintainers write rules which cannot be written with the provided DSL.

As with all technical choices there are pros and cons. Distributing via a URL is relatively simple to do, but when it's just YAML/JSON there is no way to also share your custom functions. If a ruleset becomes advanced enough it starts using custom functions, distributing via NPM might be a more appropriate option. 

[Creating a NodeJS module](https://docs.npmjs.com/creating-node-js-modules) and [publishing to NPM](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages) are not easy tasks for those new to NodeJS/NPM, but if you can [get a hello world package published](https://dev.to/therealdanvega/creating-your-first-npm-package-2ehf) you should be able to publish a Spectral ruleset using the following file structure.

**package.json**

```json
{
  "name": "@acme/spectral-ruleset",
  "version": "0.1.0",
  "description": "API Style Guide for Acme.com implemented as a Spectral ruleset",
  "main": "ruleset.json",
  "scripts": {},
  "license": "ISC"
}
```

**ruleset.json**

```json
{
  "functions": ["min"],
  "rules": {
    "valid-foo-value": {
      "given": "$",
      "then": {
        "field": "foo",
        "function": "min",
        "functionOptions": {
          "value": 1
        }
      }
    }
  }
}
```

**functions/min.js**

```js
"use strict";

module.exports = function (targetVal, { min }) {
  if (typeof targetVal !== "number") {
    return [
      {
        message: "Value is not a number.",
      },
    ];
  }

  if (targetVal < min) {
    return [
      {
        message: `Value is lower than ${min}`,
      },
    ];
  }
};
```

That's that! Get it published up to a NPM registry and anyone can pull it in with the following `extends`:

```yaml
extends:
  - example-spectral-ruleset
```

Another benefit of using NPM for rulesets is getting versioning out-of-the box through NPM's versioning system:

```yaml
extends:
  - "example-spectral-ruleset@0.2.0"
```

If you'd like to talk to other Spectral users to get some help with distrbuting rulesets, swing by the [Stoplight Discord](https://discord.com/invite/stoplight) and head over to the #spectral channel. 
