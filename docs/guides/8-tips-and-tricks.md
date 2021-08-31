# Tips & Tricks

## Rulesets

If you are in need of significant ruleset customization, you may want to opt out of YAML/JSON format, and use the JS one instead.
Below you can find a curated list of potential use cases, together with a solution.

If you're unhappy with existing messages, or you perhaps have your own documentation which you'd like to point to,
this documentation may particularly interest you.

## Custom documentationUrl field

```js
import { oas } from "https://cdn.skypack.dev/@stoplight/spectral-rulesets";

const oasRuleset = {
  ...oas,
  documentationUrl: `https://my-custom-documentation/openapi`,
};

export default {
  extends: [oasRuleset],
};
```

### Overriding messages

```js
import { oas } from "https://cdn.skypack.dev/@stoplight/spectral-rulesets";

const customMessages = {
  "oas3-valid-media-example": "@E231: Examples must be valid against their defined schema.",
  "oas2-oneOf": '@E232: "oneOf" keyword must not be used in OpenAPI v2 document.',
  "operation-description": "@E233: Must have description.",
  // you can add more pairs if needed
};

const oasRulesetWithOverriddenFormats = {
  ...oas,
  rules: Object.entries(oas.rules).reduce((rules, [name, rule]) => {
    rules[name] =
      name in customMessages
        ? {
            ...rule,
            message: customMessages[name],
          }
        : rule;

    return rules;
  }, {}),
};

export default {
  extends: [oasRulesetWithOverriddenFormats],
};
```

### Overriding formats

A custom format might be useful if you intend to apply some existing ruleset to a different, similar spec.

```js
import { oas } from "https://cdn.skypack.dev/@stoplight/spectral-rulesets";

const myFormat = document => typeof document === "object" && document !== null && "x-lint" in document;

const oasRulesetWithOverriddenFormats = {
  ...oas,
  formats: [myFormat],
  rules: Object.entries(oas.rules).reduce((rules, [name, rule]) => {
    rules[name] =
      "formats" in rule
        ? {
            ...rule,
            formats: [myFormat],
          }
        : rule;

    return rules;
  }, {}),
};

export default {
  extends: [oasRulesetWithOverriddenFormats],
};
```

## $ref resolving

### Symlinked files

```js
// my-resolver.js
"use strict";
const fs = require("fs");
const path = require("@stoplight/path");
const { Resolver } = require("@stoplight/spectral-ref-resolver");

module.exports = new Resolver({
  resolvers: {
    file: {
      async resolve(uri) {
        let ref = uri.href();
        try {
          ref = path.join(path.dirname(ref), await fs.promises.readlink(ref, "utf8"));
        } catch (e) {
          if (e.code === "EINVAL") {
            // not a symlink
          } else {
            throw e;
          }
        }

        return fs.promises.readFile(ref, "utf8");
      },
    },
  },
});
```

then, if you're a CLI user you can refer to that resolver in the following manner:

```bash
spectral lint --resolver my-resolver.js my-document
```

For JS API consumers, this would look like this:

```js
"use strict";
const { Spectral } = require("@stoplight/spectral-core");
const MyResolver = require("./my-resolver.js");

const spectral = new Spectral({
  resolver: MyResolver,
});
```
