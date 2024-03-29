# What is this?

Poor man's yet another Functional Programming utils for TypeScript.

# Example

```typescript
import { pipe } from "pipekit";
import { map } from "pipekit/dist/array";

pipe([1, 2, 3], map(x => x + 1), console.log)
// [2, 3, 4]
```

# Why pipe is good?

```typescript

const slackMessageString = ...

// without pipe 🤯
const result1 = stripHtmlTag(convertLinks(removeMentions(trimEmojis(slackMessageString))))

// with pipe 😇
const result2 = pipe(
    slackMessageString,
    trimEmojis,
    removeMentions,
    convertLinks,
    stripHtmlTags,
)

```

# Motivation

I used to use Array's built-in functions and `Lodash` when manipulating arrays, but I found it confusing with mixed methods to modify the original arrays, so I collected the immutable functions here.

I could use `lodash/fp`, but `lodash/fp` does not work with tree shaking and increases the bundle size, and `fp-ts` is overkill for me.

For me, a pipe function and a set of immutable functions is sufficient.