---
title: TypeScript
---

You can take an advantage of using TypeScript.

<h2 id="generic-types">Generic types</h2>

Every `ApolloQueryResult` has a generic type that you can specify when using methods to manipulate the data.

For example, let's take a look at `watchQuery` method:

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

The `data` object is a type of `QueryResponse`. 
Thanks to this, you can prevent many bugs and keep the structure of your data predictable.
