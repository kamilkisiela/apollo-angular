---
"apollo-angular": major
---

BREAKING use Typescript strict mode

This is breaking because:

- `ApolloBase.client` throws an error if no client has been created
  beforehand. The behavior now matches the typing that always declared a
  client existed. In most cases, you should pass either `apolloOptions`
  or `apolloNamedOptions` to `Apollo.constructor` to create the
  client immediately upon construction.
- `ApolloBase.query()`, `ApolloBase.mutate()` and
  `ApolloBase.subscribe()` all have a new constraint on `V`. If you
  inherit from this class, you might need to adjust your typing.
- Classes that inherit `Query`, `Mutation` and `Subscription` must
  declare the `document` member. This requirement always existed at
  runtime but was not enforced at compile time until now. If you generated
  code, you have nothing to do.
- `QueryRef.getLastResult()` and `QueryRef.getLastError()` might return
  `undefined`. This was always the case, but was typed incorrectly until
  now.
- `pickFlag()` was dropped without any replacement.
- `createPersistedQueryLink()` requires options. This was always the
  case but was typed incorrectly until now.
