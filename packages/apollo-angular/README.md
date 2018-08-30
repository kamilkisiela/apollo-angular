# [Apollo Angular](https://www.apollographql.com/docs/angular/) [![npm version](https://badge.fury.io/js/apollo-angular.svg)](https://badge.fury.io/js/apollo-angular) [![Build status](https://travis-ci.org/apollographql/apollo-angular.svg?branch=master)](https://travis-ci.org/apollographql/apollo-angular) [![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](https://www.apollographql.com/slack)

Apollo Angular allows you to fetch data from your GraphQL server and use it in building complex and reactive UIs using the Angular framework. Apollo Angular may be used in any context that Angular may be used. In the browser, in NativeScript, or in Node.js when you want to do server-side rendering.

Apollo Angular requires _no_ complex build setup to get up and running. As long as you have a GraphQL server you can get started building out your application with Angular immediately. Apollo Angular works out of the box with both [Angular CLI](https://cli.angular.io/) (`ng add apollo-angular`) and [NativeScript](https://www.nativescript.org/) with a single install.

Apollo Angular is:

1. **Incrementally adoptable**, so that you can drop it into an existing JavaScript app and start using GraphQL for just part of your UI.
1. **Universally compatible**, so that Apollo works with any build setup, any GraphQL server, and any GraphQL schema.
1. **Simple to get started with**, so you can start loading data right away and learn about advanced features later.
1. **Inspectable and understandable**, so that you can have great developer tools to understand exactly what is happening in your app.
1. **Built for interactive apps**, so your users can make changes and see them reflected in the UI immediately.
1. **Small and flexible**, so you don't get stuff you don't need. The core is under 12kb compressed.
1. **Community driven**, because Apollo is driven by the community and serves a variety of use cases. Everything is planned and developed in the open.

Get started today on the app you’ve been dreaming of, and let Apollo Angular take you to the moon!

## Installation

It is simple to install Apollo Angular and related libraries

```bash
# installing Apollo Angular in Angular CLI
ng add apollo-angular

# installing each piece independently
yarn add apollo-client apollo-cache-inmemory apollo-angular-link-http apollo-angular graphql-tag graphql
```

That’s it! You may now use Apollo Angular in any of your Angular environments.

For an amazing developer experience you may also install the [Apollo Client Developer tools for Chrome](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm) which will give you inspectability into your Apollo Angular data.

## Usage

Now you may create components that are connected to your GraphQL API.

Finally, to demonstrate the power of Apollo Angular in building interactive UIs let us connect one of your components to your GraphQL server using the `Apollo` service:

```ts
import {Component, OnInit} from '@angular/core';
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

To learn more about querying with Apollo Angular be sure to start reading the [documentation article on queries](https://www.apollographql.com/docs/angular/basics/queries.html).

## Documentation

All of the documentation for Apollo Angular including usage articles and helpful recipes lives on: [https://www.apollographql.com/docs/angular/](https://www.apollographql.com/docs/angular/)

### Recipes

- [Authentication](https://www.apollographql.com/docs/angular/recipes/authentication.html)
- [Pagination](https://www.apollographql.com/docs/angular/recipes/pagination.html)
- [Optimistic UI](https://www.apollographql.com/docs/angular/features/optimistic-ui.html)
- [Server Side Rendering](https://www.apollographql.com/docs/angular/recipes/server-side-rendering.html)

## Contributing

[Read the Apollo Contributor Guidelines.](CONTRIBUTING.md)

This project uses Lerna.

Bootstraping:

```bash
yarn install
```

Running tests locally:

```bash
yarn test
```

Formatting code with prettier:

```bash
yarn prettier
```

This project uses TypeScript for static typing. You can get it built into your editor with no configuration by opening this project in [Visual Studio Code](https://code.visualstudio.com/), an open source IDE which is available for free on all platforms.
