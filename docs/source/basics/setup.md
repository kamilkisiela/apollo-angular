---
title: Setup and options
---

<h2 id="installation">Installation</h2>

The simplest way to get started with Apollo Client is by using Apollo Angular Boost, our starter kit that configures your client for you with our recommended settings. Apollo Angular Boost includes packages that we think are essential for building an Apollo app, like our in memory cache, local state management, and error handling. It's also flexible enough to handle features like authentication.

If you're an advanced user who would like to configure Apollo Client from scratch, head on over to our [Apollo Angular Boost migration guide](../advanced/boost-migration.html). For the majority of users, Apollo Angular Boost should meet your needs, so we don't recommend switching unless you absolutely need more customization.

<h2 id="installation">Installation</h2>

First, let's install some packages!

```bash
npm install apollo-angular-boost graphql --save
```

- `apollo-angular-boost`: Package containing everything you need to set up Apollo Client
- `graphql`: Also parses your GraphQL queries

<h2 id="schematics">Installation with Angular Schematics</h2>

We support `ng-add` command now.

To start using Apollo Angular simply run:

```bash
ng add apollo-angular
```

With that you can skip the next step.

<h2 id="creating-client">Create a client</h2>

Great, now that you have all the dependencies you need, let's create your Apollo Client. The only thing you need to get started is the endpoint for your [GraphQL server](https://launchpad.graphql.com/w5xlvm3vzz). If you don't pass in `uri` directly, it defaults to the `/graphql` endpoint on the same host your app is served from.

In our `app.module.ts` file, let's import `ApolloBoostModule` from `apollo-angular-boost`, then use `ApolloBoost` service to create Apollo Client and add the endpoint for our GraphQL server to the `uri` property of the client config object.

```ts
import { HttpClientModule } from "@angular/common/http";
import { ApolloBoostModule, ApolloBoost } from "apollo-angular-boost";

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloBoostModule],
  ...
})
export class AppModule {
  constructor(boost: ApolloBoost) {
    boost.create({
      uri: "https://w5xlvm3vzz.lp.gql.zone/graphql"
    })
  }
}
```

Apollo Boost requires `HttpClient` so that's why we also used `HttpClientModule` from `@angular/common/http`.

<h2 id="request">Request data</h2>

Once all is hooked up, you're ready to start requesting data with `Apollo` serivce! `Apollo` is an Angular service exported from `apollo-angular` (`apollo-angular-boost` reexports it) to share GraphQL data with your UI.

First, pass your GraphQL query wrapped in the `gql` function to the `query` property in the `Apollo.watchQuery` method, in your component.
The `Apollo` service is a regular angular service that you familiar with, data are being streamed through Observables. Same here.

The `watchQuery` method returns a `QueryRef` object which has the `valueChanges`
property that is an `Observable`.

An object passed through an Observable contains `loading`, `error`, and `data` properties. Apollo Client tracks error and loading state for you, which will be reflected in the `loading` and `error` properties. Once the result of your query comes back, it will be attached to the `data` property.

> It's also possible to fetch data only once. The `query` method of `Apollo` service returns an `Observable` that also resolves with the same result as
> above.

Let's create an `ExchangeRates` component to see the `Apollo` service in action!

<h3 id="basic-operations">Basic Operations</h3>
If you want to see how easy it is to fetch data from a GraphQL server with Apollo, you can use the `query` method. It is as easy as this:

```ts
import {Component, OnInit} from '@angular/core';
import {Apollo, gql} from 'apollo-angular-boost';

@Component({
  selector: 'exchange-rates',
  template: `
    <div *ngIf="loading">
      Loading...
    </div>
    <div *ngIf="error">
      Error :(
    </div>
    <div *ngIf="rates">
      <div *ngFor="let rate of rates">
        <p>{{rate.currency}}: {{rate.rate}}</p>
      </div>
    </div>
  `,
})
export class ExchangeRates implements OnInit {
  rates: any[];
  loading: boolean;
  error: any;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            rates(currency: "USD") {
              currency
              rate
            }
          }
        `,
      })
      .valueChanges.subscribe(result => {
        this.rates = result.data && result.data.rates;
        this.loading = result.loading;
        this.error = result.error;
      });
  }
}
```

Congrats, you just made your first query! 🎉 If you render your `ExchangeRates` component within your `App` component from the previous example, you'll first see a loading indicator and then data on the page once it's ready. Apollo Client automatically caches this data when it comes back from the server, so you won't see a loading indicator if you run the same query twice.

If you don't use Apollo Angular Boost, just regular Apollo Angular or you installed Apollo with Angular Schematics here's how it looks like:

```ts
import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

// everything else is the same
```

If you'd like to play around with the app we just built, you can view it on [StackBlitz](https://stackblitz.com/edit/basic-apollo-angular-app). Don't stop there! Try building more components with `Apollo` service and experimenting with the concepts you just learned.

<h2 id="apollo-boost">Apollo Boost</h2>

In our example app, we used Apollo Boost in order to quickly set up Apollo Angular. While your GraphQL server endpoint is the only configuration option you need to get started, there are some other options we've included so you can quickly implement features like local state management, authentication, and error handling.

<h3 id="packages">What's included</h3>

Apollo Angular Boost includes some packages that we think are essential to developing with Apollo Angular. Here's what's included:

- `apollo-client`: Where all the magic happens
- `apollo-angular`: Bridge between Angular and Apollo Client
- `apollo-cache-inmemory`: Our recommended cache
- `apollo-angular-link-http`: An Apollo Link for remote data fetching
- `apollo-link-error`: An Apollo Link for error handling
- `apollo-link-state`: An Apollo Link for local state management

The awesome thing about Apollo Angular Boost is that you don't have to set any of this up yourself! Just specify a few options if you'd like to use these features and we'll take care of the rest.

<h3 id="configuration">Configuration options</h3>

Here are the options you can pass to the `ApolloBoost` exported from `apollo-angular-boost`. All of them are optional.

<dl>
  <dt>`uri`: string</dt>
  <dd>A string representing your GraphQL server endpoint. Defaults to `/graphql`</dd>
  <dt>`request`: (operation: Operation) => Promise<void></dt>
  <dd>This function is called on each request. It takes a GraphQL operation and can return a promise. To dynamically set `fetchOptions`, you can add them to the context of the operation with `operation.setContext({ headers })`. Any options set here will take precedence over `fetchOptions`. Useful for authentication.</dd>
  <dt>`onError`: (errorObj: { graphQLErrors: GraphQLError[], networkError: Error, response?: ExecutionResult, operation: Operation }) => void</dt>
  <dd>We include a default error handler to log out your errors to the console. If you would like to handle your errors differently, specify this function.</dd>
  <dt>`clientState`: { resolvers?: Object, defaults?: Object, typeDefs?: string | Array<string> }</dt>
  <dd>An object representing your configuration for `apollo-link-state`. This is useful if you would like to use the Apollo cache for local state management. Learn more in our [quick start](/docs/link/links/state.html#start).</dd>
  <dt>`cacheRedirects`: Object</dt>
  <dd>A map of functions to redirect a query to another entry in the cache before a request takes place. This is useful if you have a list of items and want to use the data from the list query on a detail page where you're querying an individual item. More on that [here](../features/performance.html#cache-redirects).</dd>
  <dt>`withCredentials`: boolean</dt>
  <dd></dd>
  <dt>`headers`: Object</dt>
  <dd>Header key/value pairs to pass along with the request.</dd>
  <dt>`fetch`: GlobalFetch['fetch']</dt>
  <dt>`cache`: ApolloCache</dt>
  <dd>A custom instance of `ApolloCache` to be used. The default value is `InMemoryCache` from `apollo-cache-inmemory`. This option is quite useful for using a custom cache with `apollo-cache-persist`.</dd>
</dl>

<h2 id="next-steps">Next steps</h2>

Now that you've learned how to fetch data with Apollo Angular, you're ready to dive deeper into creating more complex queries and mutations. After this section, we recommend moving onto:

- [Queries](./queries.html): Learn how to fetch queries with arguments and dive deeper into configuration options..
- [Mutations](./mutations.html): Learn how to update data with mutations and when you'll need to update the Apollo cache.
