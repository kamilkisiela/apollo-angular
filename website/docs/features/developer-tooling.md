---
title: Developer tools
description: How to use extensions and developer tools to get insight into what your app is doing.
---

## Apollo Client Devtools

The [Apollo Client Devtools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm) is a Chrome extension.

### Features

The devtools appear as an "Apollo" tab in your Chrome inspector, along side the "Elements" and "Console" tabs. There are currently 3 main features of the devtools:

* GraphiQL: Send queries to your server through the Apollo network interface, or query the Apollo cache to see what data is loaded.
* Normalized store inspector: Visualize your GraphQL store the way Apollo Client sees it, and search byfield names or values.
* Watched query inspector: View active queries and variables, and locate the associated UI components.

 ![GraphiQL Console](/img/devtools/apollo-client-devtools/apollo-devtools-graphiql.png)

Make requests against either your app’s GraphQL server or the Apollo Client cache through the Chrome developer console. This version of GraphiQL leverages your app’s network interface, so there’s no configuration necessary — it automatically passes along the proper HTTP headers, etc. the same way your Apollo Client app does.

![Store Inspector](/img/devtools/apollo-client-devtools/apollo-devtools-store.png)

View the state of your client-side cache as a tree and inspect every object inside. Visualize the [mental model](https://blog.apollographql.com/the-concepts-of-graphql-bc68bd819be3) of the Apollo cache. Search for specific keys and values in the store and see the path to those keys highlighted.

![Watched Query Inspector](/img/devtools/apollo-client-devtools/apollo-devtools-queries.png)

View the queries being actively watched on any given page. See when they're loading, what variables they're using, and, if in the future if you’re using Angular, which Angular component they’re attached to.

### Installation

You can install the extension via the [Chrome Webstore](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm).
If you want to install a local version of the extension instead, skip ahead to the __Developing__ section.

### Configuration

While your app is in dev mode, the devtools will appear as an "Apollo" tab in your chrome inspector. To enable the devtools in your app even in production, pass `connectToDevTools: true` to the ApolloClient constructor in your app.  Pass `connectToDevTools: false` if want to manually disable this functionality.

The "Apollo" tab will appear in the Chrome console if a global `window.__APOLLO_CLIENT__` object exists in your app. Apollo Client adds this hook to the window automatically unless `process.env.NODE_ENV === 'production'`. If you would like to use the devtools in production, just manually attach your Apollo Client instance to `window.__APOLLO_CLIENT__` or pass `connectToDevTools: true` to the constructor.

Find more information about contributing and debugging on the [Apollo Client DevTools GitHub page](https://github.com/apollographql/apollo-client-devtools).


## GraphQL Codegen

GraphQL Codegen is a tool to generate API code or type annotations based on a GraphQL schema and query documents.

It currently generates TypeScript annotations, Flow annotations, Scala and Java code and much much more.

### Usage

If you want to use `@graphql-codegen/cli`, you can install it command globally:

```bash
npm install @graphql-codegen/cli
```

And run:

```bash
graphql-codegen init
```

Visit [graphql-code-generator.com](https://graphql-code-generator.com/docs/plugins/typescript-apollo-angular) to read more.
