# Apollo Angular Boost

[![npm version](https://badge.fury.io/js/apollo-angular-boost.svg)](https://badge.fury.io/js/apollo-angular-boost)
[![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](http://www.apollodata.com/#slack)

## Purpose

## Installation

`npm install apollo-angular-boost --save`

## Usage

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
