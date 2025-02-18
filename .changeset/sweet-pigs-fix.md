---
'apollo-angular': major
---

Drop deprecated things:

- Instead of `ApolloModule`, use either `provideApollo()` or `provideNamedApollo()`.
- Instead of `import {graphql} from 'apollo-angular';` use `import {gql as graphql} from 'apollo-angular';`
