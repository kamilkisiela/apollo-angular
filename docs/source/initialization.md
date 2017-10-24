---
title: Initialization
order: 2
---
<h2 id="installation">Installation</h2>

To get started with Apollo and Angular, install the `apollo-client` npm package, the `apollo-angular` integration package, and the `graphql-tag` library for constructing query documents:

```bash
npm install apollo-client apollo-angular graphql-tag --save
```

If you are in an environment that does not have a global [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch) implementation, make sure to install a polyfill like [`whatwg-fetch`](https://www.npmjs.com/package/whatwg-fetch).

<h2 id="initialization">Initialization</h2>

To get started using Apollo, we need to create an `ApolloClient` and use `ApolloModule`. `ApolloClient` serves as a central store of query result data which caches and distributes the results of our queries. `ApolloModule` wires that client into your application.

<h3 id="creating-client">Creating a client</h3>

To get started, create an [`ApolloClient`](/core/apollo-client-api.html#constructor) instance and point it at your GraphQL server:

```ts
import { ApolloClient } from 'apollo-client';

// by default, this client will send queries to `/graphql` (relative to the URL of your app)
const client = new ApolloClient();
```

The client takes a variety of [options](/core/apollo-client-api.html#constructor), but in particular, if you want to change the URL of the GraphQL server, you can pass in a custom [`NetworkInterface`](/core/apollo-client-api.html#NetworkInterface):

```ts
import { ApolloClient, createNetworkInterface } from 'apollo-client';

// by default, this client will send queries to `/graphql` (relative to the URL of your app)
const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://my-api.grapql.com'
  }),
});
```

The other options control the behavior of the client, and we'll see examples of their use throughout this guide.

<h3 id="bootstrap">Bootstrap</h3>

**Angular Modules**, also known as **NgModules**, are the powerful new way to organize and bootstrap your Angular application.

<h3 id="providing-apollomodule">Providing ApolloModule</h3>

To connect your client instance to your app, use the `ApolloModule.forRoot`.

```ts
import { ApolloClient } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';

import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app.component';

// Create the client as outlined above
const client = new ApolloClient();

export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  imports: [
    BrowserModule,
    ApolloModule.forRoot(provideClient)
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
```

> There is still `ApolloModule.withClient` available but we recommend you to use `ApolloModule.forRoot` instead.

<!--  Add content here once it exists -->
<!-- ## Troubleshooting -->
