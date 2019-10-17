# Apollo Angular Boost

[![npm version](https://badge.fury.io/js/apollo-angular-boost.svg)](https://badge.fury.io/js/apollo-angular-boost)
[![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](https://www.apollographql.com/slack)

## Purpose

Easiest way to get started with Apollo Client!

Apollo Angular Boost is a zero-config way to start using Apollo. It includes some sensible defaults, such as our recommended `InMemoryCache` and `HttpLink`, which come configured for you with our recommended settings.

## Installation

`npm install apollo-angular-boost --save`

or

`yarn add apollo-angular-boost`

## What's in Apollo Boost

Apollo Boost includes some packages that we think are essential to developing with Apollo Client. Here's what's in the box:

- `apollo-client`: Where all the magic happens
- `apollo-angular`: Integrates Apollo Client with Angular
- `apollo-cache-inmemory`: Our recommended cache
- `apollo-angular-link-http`: An Apollo Link for remote data fetching (based on Angular's `HttpClient`)
- `apollo-link-error`: An Apollo Link for error handling
- `apollo-link-state`: An Apollo Link for local state management
- `graphql-tag`: Exports the `gql` function for your queries & mutations

The awesome thing about Apollo Boost is that you don't have to set any of this up yourself! Just specify a few options if you'd like to use these features and we'll take care of the rest.

## Usage

How to set it up?

```ts
import {HttpClientModule} from '@angular/common/http';
import {ApolloBoostModule, ApolloBoost} from 'apollo-angular-boost';

@NgModule({
  imports: [HttpClientModule, ApolloBoostModule],
})
export class AppModule {
  constructor(apolloBoost: ApolloBoost) {
    apolloBoost.create({
      uri,
    });
  }
}
```

or via `APOLLO_BOOST_CONFIG` token:

```ts
import {HttpClientModule} from '@angular/common/http';
import {ApolloBoostModule, APOLLO_BOOST_CONFIG} from 'apollo-angular-boost';

@NgModule({
  imports: [HttpClientModule, ApolloBoostModule],
  providers: [{
    provide: APOLLO_BOOST_CONFIG,
    useFactory() {
      return {
        uri
      };
    }
  }]
})
export class AppModule {}
```

How to use it in a component or a service?

```ts
import {Apollo, gql} from 'apollo-angular-boost';

export class AppComponent {
  constructor(apollo: Apollo) {
    const allPosts = apollo.watchQuery({
      query: gql`
        query allPosts {
          posts {
            id
            title
            text
          }
        }
      `,
    });

    // ...
  }
}
```

To read more about the API and its usage, please visit [Apollo Angular documentation](https://www.apollographql.com/docs/angular/).

Because `Apollo` service of `apollo-angular-boost` is the same service that `apollo-angular` exports the documentation works for both.

### Apollo Boost options

Here are the options you can pass to the `ApolloBoost` exported from `apollo-angular-boost`. None of them are required.

- uri: A string representing your GraphQL server endpoint. Defaults to `/graphql`
- httpOptions: An object representing any options you would like to pass to HttpLink (withCredentials, headers, etc). These options are static, so they don't change on each request.
- request?: (operation: Operation) => Promise<void>;
  - This function is called on each request. It takes an operation and can return a promise. To dynamically set `httpOptions`, you can add them to the context of the operation with `operation.setContext({ headers })`. Any options set here will take precedence over `httpOptions`.
  - Use this function for authentication
- onError: (errorObj: { graphQLErrors: GraphQLError[], networkError: Error, response?: ExecutionResult, operation: Operation }) => void
  - We include a default error handler to log out your errors for you. If you would like to handle your errors differently, specify this function
- clientState: An object representing your configuration for `apollo-link-state`. This is useful if you would like to use the Apollo cache for local state management. Learn more in our [quick start](https://www.apollographql.com/docs/link/links/state.html#start).
- cacheRedirects: An map of functions to redirect a query to another entry in the cache before a request takes place. This is useful if you have a list of items and want to use the data from the list query on a detail page where you're querying an individual item. More on that [here](https://www.apollographql.com/docs/angular/features/cache-updates.html#cacheRedirect).

That's it! Here's an example of all those options in action:

```js
import { ApolloBoost } from 'apollo-boost';

@NgModule({...})
export class GraphQLModule {
  constructor(apollo: ApolloBoost) {
    apollo.create({
      uri: 'https://5vxky4z9pl.sse.codesandbox.io/graphql',
      httpOptions: {
        withCredentials: true
      },
      request: async (operation) => {
        const token = await AsyncStorage.getItem('token');
        operation.setContext({
          headers: {
            authorization: token
          }
        });
      },
      onError: ({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          sendToLoggingService(graphQLErrors);
        }
        if (networkError) {
          logoutUser();
        }
      },
      clientState: {
        defaults: {
          isConnected: true
        },
        resolvers: {
          Mutation: {
            updateNetworkStatus: (_, { isConnected }, { cache }) => {
              cache.writeData({ data: { isConnected }});
              return null;
            }
          }
        }
      },
      cacheRedirects: {
        Query: {
          movie: (_, { id }, { getCacheKey }) =>
            getCacheKey({ __typename: 'Movie', id });
        }
      }
    })
  }
}
```
