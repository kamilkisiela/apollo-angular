---
title: Setup and options
---

<h2 id="installation">Installation</h2>

To get started with Apollo and Angular, you will need to install a few packages from npm.

```bash
npm install apollo-angular apollo-angular-link-http apollo-client apollo-cache-inmemory graphql-tag graphql --save
```

To get started using Apollo with Angular, we need to import two NgModules, `ApolloModule` and `HttpLinkModule`.

- `ApolloModule` is the center of using GraphQL in your app! It includes all needed services that allows to use ApolloClient's features.
- `HttpLinkModule` makes it easy to fetch data in Angular.

**Note** `HttpLinkModule` It's optional, you can replace it with any other Link.
Its biggest advantage of all is that it uses `HttpClient` internally so it's possible to use it in `NativeScript` or in combination with any other HttpClient provider. By using `HttpLinkModule` you get Server-Side Rendering for free, without any additional work.

```ts
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';

@NgModule({
  imports: [
    HttpClientModule, // provides HttpClient for HttpLink
    ApolloModule,
    HttpLinkModule
  ]
})
class AppModule {}
```

<h3 id="creating-client">Creating a client</h3>

To get started, inject `Apollo` and `HttpLink` services (if you decided to use it) and then create a client:

```ts
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      // By default, this client will send queries to the
      // `/graphql` endpoint on the same host
      link: httpLink.create(),
      cache: new InMemoryCache()
    });
  }
}
```

The client takes a variety of [options](#Apollo), but in particular, if you want to change the URL of the GraphQL server, you can customize your [`Apollo Link`](/docs/link):

```ts
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      link: httpLink.create({ uri: 'https://api.example.com/graphql' }),
      cache: new InMemoryCache()
    });
  }
}
```

`ApolloClient` has some other options which control the behavior of the client, and we'll see examples of their use throughout this guide.


<h3 id="gql">Creating Operations using `graphql-tag`</h3>

```js
import gql from 'graphql-tag';
```

The `gql` template tag is what you use to define GraphQL queries in your Apollo apps. It parses your GraphQL query into the [GraphQL.js AST format][] which may then be consumed by Apollo methods. Whenever Apollo is asking for a GraphQL query you will always want to wrap it in a `gql` template tag.

You can embed a GraphQL document containing only fragments inside of another GraphQL document using template string interpolation. This allows you to use fragments defined in one part of your codebase inside of a query define in a completely different file. See the example below for a demonstration of how this works.

[GraphQL.js AST format]: https://github.com/graphql/graphql-js/blob/d92dd9883b76e54babf2b0ffccdab838f04fc46c/src/language/ast.js
[`graphql-tag`]: https://www.npmjs.com/package/graphql-tag

**Example:**

Notice how in the `query` variable we not only include the `fragments` variable through template string interpolation (`${fragments}`), but we also include a spread for the `foo` fragment in our query.

```js
const fragments = gql`
  fragment foo on Foo {
    a
    b
    c
    ...bar
  }

  fragment bar on Bar {
    d
    e
    f
  }
`;

const query = gql`
  query {
    ...foo
  }

  ${fragments}
`;
```

For more information about using fragments, checkout the [guide](../features/fragments.html) and even some of the different ways to write GraphQL operations in your app using [webpack](../recipes/webpack.html).

<h2 id="connecting-data">Requesting data</h2>

Apollo makes it super easy to request data using GraphQL. You can [read](./queries.html), [update](./mutations.html), and even [subscribe](../features/subscriptions.html) to whatever information your app needs using the client directly, or integrating it with your components.

<h3 id="basic-operations">Basic Operations</h3>
If you want to see how easy it is to fetch data from a GraphQL server with Apollo, you can use the `query` method. It is as easy as this:

```js
import { Apollo } from 'apollo-angular';

@Component({ /*...*/ })
class AppComponent {
  constructor(apollo: Apollo) {
    apollo.query({query: gql`{ hello }`}).then(console.log);
  }
}
```

<h3 id="ready">Ready for more?</h3>
At this point you are ready to start building something with Apollo! Checkout the [queries](./queries.html) guide to start writing queries instead of a lot of code to get your data!

<h2 id="API" title="API Reference">API Reference</h2>

<h3 id="Apollo">`Apollo`</h3>
The Apollo.create method takes a small number of options, of which two are required. These arguments make it easy to customize how Apollo works based on your environment or application needs.

- `link`: Apollo requires an Apollo Link to serve as the network layer. For more infomation about creating links, read the [docs](/docs/link).
- `cache`: The second required argument for using Apollo is an instance of an Apollo Cache. The default cache is the `apollo-cache-inmemory` which exports an `{ InMemoryCache }`. For more infomation read the [cache docs](./caching.html).
- `ssrMode`: When using the client for [server side rendering](../recipes/server-side-rendernig.html), pass `ssrMode` as `true`
- `ssrForceFetchDelay`: determines the time interval before Apollo force fetchs queries after a server side render.
- `connectToDevTools`: This argument allows the [Apollo Client Devtools](../features/devtools.html) to connect to your application's Apollo Client. You can set this to be `true` to use the tools in production (they are on by default in dev mode).
- `queryDeduplication`: If set to false, this argument will force a query to still be sent to the server even if a query with identical parameters (query, variables, operationName) is already in flight.
- `defaultOptions`: If you want to set application wide defaults for the options supplied to `watchQuery`, `query`, or `mutate`, you can pass them as a `defaultOptions` object. An example object looks like this:

```js
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all'
  }
}
```

These options will be merged with options supplied with each request.


<h3 id="ApolloModule" title="ApolloModule">`ApolloModule`</h3>
ApolloModule is a NgModule for providing an Apollo service to an Angular Dependency Injection.

```js
import { ApolloAngular } from 'apollo-angular';
```

**Example:**

```ts
import { ApolloModule } from 'apollo-angular';

@NgModule({
  imports: [
    ApolloModule
  ]
})
class AppModule {}
```
