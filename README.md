# [Apollo Angular](https://www.apollographql.com/docs/angular/) [![npm version](https://badge.fury.io/js/apollo-angular.svg)](https://badge.fury.io/js/apollo-angular) [![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](http://www.apollostack.com/#slack)

Apollo Angular allows you to fetch data from your GraphQL server and use it in building complex and reactive UIs using the Angular framework. Apollo Angular may be used in any context that Angular may be used. In the browser, in NativeScript, or in Node.js when you want to do server-side rendering.

As long as you have a GraphQL server you can get started building out your application with Angular immediately. Apollo Angular works out of the box with both [`Angular CLI`][] and [NativeScript][nativescript] with a single install and with no extra hassle configuring Babel or other JavaScript tools.

[`angular cli`]: https://cli.angular.io/
[nativescript]: https://www.nativescript.org/

Apollo Angular is:

1.  **Incrementally adoptable**, so that you can drop it into an existing JavaScript app and start using GraphQL for just part of your UI.
2.  **Universally compatible**, so that Apollo works with any build setup, any GraphQL server, and any GraphQL schema.
3.  **Simple to get started with**, you can start loading data right away and learn about advanced features later.
4.  **Inspectable and understandable**, so that you can have great developer tools to understand exactly what is happening in your app.
5.  **Built for interactive apps**, so your users can make changes and see them reflected in the UI immediately.
6.  **Small and flexible**, so you don't get stuff you don't need. The core is under 25kb compressed.
7.  **Community driven**, Apollo is driven by the community and serves a variety of use cases. Everything is planned and developed in the open.

Get started today on the app you’ve been dreaming of, and let Apollo Angular take you to the moon!

## Installation

It is simple to install Apollo Angular and related libraries

```bash
# installing the preset package (apollo-angular-boost)
npm install apollo-angular-boost graphql --save

# installing each piece independently
npm install apollo-client apollo-cache-inmemory apollo-angular-link-http apollo-angular graphql-tag graphql --save
```

[apollo-angular-boost](https://github.com/apollographql/apollo-angular/tree/master/packages/apollo-angular-boost) is a minimal config way to start using Apollo Angular. It includes some sensible defaults, such as `InMemoryCache` and `HttpLink`.

That’s it! You may now use Apollo Angular in any of your Angular environments.

For an amazing developer experience you may also install the [Apollo Client Developer tools for Chrome][] which will give you inspectability into your React Apollo data.

[apollo client developer tools for chrome]: https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm

## Usage

To get started you will first want to import the NgModule and then you will want to provide configuration. Finally, we will show you a basic example of connecting your GraphQL data to your Angular components with the [`Apollo`][] service.

```ts
import {ApolloBoostModule, ApolloBoost} from 'apollo-angular-boost';
import {HttpLink} from 'apollo-angular-link-http';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [..., HttpClientModule, ApolloBoostModule]
  // ...
})
export class AppModule {
  constructor(apollo: ApolloBoost) {
    apollo.create({});
    // By default, this client will send queries to the
    // `/graphql` endpoint on the same host
    // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `ApolloBoost.create()` to connect
    // to a different host
  }
}
```

If you're not using [apollo-angular-boost](https://github.com/apollographql/apollo-angular/tree/master/packages/apollo-angular-boost), you can initialize Apollo like this:

```ts
import {ApolloModule, Apollo} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [..., HttpClientModule, ApolloModule, HttpLinkModule],
  // ...
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      cache: new InMemoryCache(),
      link: httpLink.create({})
    });
    // By default, this client will send queries to the
    // `/graphql` endpoint on the same host
    // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink.create()` to connect
    // to a different host
  }
}
```

> Migrating from ApolloClient 1.x? See the [migration guide](https://www.apollographql.com/docs/angular/migration.html).

Now you may create components in this Angular.

Finally, to demonstrate the power of Apollo Angular in building interactive UIs let us connect one of your components to your GraphQL server using the [`Apollo`][] service:

You'll need install `graphql-tag` to use `gql` module:

```bash
npm install graphql-tag --save
```

```ts
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

const GET_DOGS = gql`
  {
    dogs {
      id
      breed
    }
  }
`;

@Component({
  selector: 'dogs',
  template: `
    <ul>
      <li *ngFor="let dog of dogs | async">
        {{dog.breed}}
      </li>
    </ul>
  `,
})
export class DogsComponent implements OnInit {
  dogs: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.dogs = this.apollo
      .watchQuery({
        query: GET_DOGS,
      })
      .valueChanges.pipe(map(result => result.data && result.data.dogs));
  }
}
```

To learn more about querying with Apollo Angular be sure to start reading the [documentation article on queries][].

[`apolloclient`]: https://www.apollographql.com/docs/react/api/apollo-client.html#apollo-client
[`apollo`]: https://www.apollographql.com/docs/angular/basics/queries.html
[documentation article on queries]: https://www.apollographql.com/docs/angular/basics/queries.html

## Documentation

All of the documentation for Apollo Angular including usage articles and helpful recipes lives on: [https://www.apollographql.com/docs/angular/](https://www.apollographql.com/docs/angular/)

### Recipes

- [Authentication](https://www.apollographql.com/docs/angular/recipes/authentication.html)
- [Pagination](https://www.apollographql.com/docs/angular/recipes/pagination.html)
- [Optimistic UI](https://www.apollographql.com/docs/angular/features/optimistic-ui.html)
- [Server Side Rendering](https://www.apollographql.com/docs/angular/recipes/server-side-rendering.html)
