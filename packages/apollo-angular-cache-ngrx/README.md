# NGRX Cache

[![npm version](https://badge.fury.io/js/apollo-angular-cache-ngrx.svg)](https://badge.fury.io/js/apollo-angular-ccche-ngrx)
[![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](http://www.apollodata.com/#slack)

## Purpose

Allows to use @ngrx/store as Apollo Cache

## Installation

`npm install apollo-angular-cache-ngrx --save`

## Usage

```ts
import {StoreModule} from '@ngrx/store';
import {
  NgrxCacheModule,
  NgrxCache,
  apolloReducer,
} from 'apollo-angular-cache-ngrx';

@NgModule({
  imports: [
    StoreModule.forRoot({
      apollo: apolloReducer,
    }),
    NgrxCacheModule,
  ],
})
class AppModule {
  constructor(ngrxCache: NgrxCache) {
    const cache = ngrxCache.create({});
  }
}
```

## Options

Same options as `apollo-cache-inmemory`.
