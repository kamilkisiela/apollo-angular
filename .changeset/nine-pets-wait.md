---
'apollo-angular': patch
---

Deprecate `graphql` alias for `gql` tag function

Because importing the same thing from two different import points will
increase the final bundle size. If you want a different name for the tag
function, then use `as` syntax, such as:

```ts
import {gql as graphql} from 'apollo-angular';
```
