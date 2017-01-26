---
title: TypeScript
---

You can take an advantage of using TypeScript with `apollo-angular`.

<h2 id="generic-types">Generic types</h2>

Every result of a GraphQL query is a type of [`ApolloQueryResult`][ApolloQueryResult]. It means that the actual data lives under `data` property. The default type of that property is just a simple object, but you can easily change it.

To add an interface to the result, just specify a generic type when using methods like `watchQuery`, `mutate` and more.

For an example, let's take a look at one of them:

```ts
interface User {
  username: string;
  email: string;
}

interface QueryResponse {
  currentUser: User;
}

const UserQuery = gql`
  query currentUser {
    currentUser {
      username
      email
    }
  }
`;

class AppComponent {
  user: User;

  ngOnInit() {
    this.apollo.watchQuery<QueryResponse>({ query: UserQuery })
      .map(({data}) => data.currentUser);
  }
}
```



Now, the `data` property has a type of `QueryResponse`.
Thanks to this, you can prevent many bugs and keep the structure of your data predictable.

[ApolloQueryResult]: /core/apollo-client-api.html#ApolloQueryResult
