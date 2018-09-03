# NGRX Cache

[![npm version](https://badge.fury.io/js/apollo-angular-cache-ngrx.svg)](https://badge.fury.io/js/apollo-angular-cache-ngrx)
[![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](https://www.apollographql.com/slack)

## Purpose

Allows to use @ngrx/store as Apollo Cache

## Installation

`npm install apollo-angular-cache-ngrx --save`

## Usage

Put `apolloReducer` under `apollo` in your State and simply import
`NgrxCacheModule`.

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

Second method is about putting `apolloReducer` under any key you want to in your
State and because of that, use `NgrxCacheModule.forRoot(key: string)` in
imports, where `key` points to that key.

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
      myCustomApollo: apolloReducer,
    }),
    NgrxCacheModule.forRoot('myCustomApollo'),
  ],
})
class AppModule {
  constructor(ngrxCache: NgrxCache) {
    const cache = ngrxCache.create({});
  }
}
```

## Options

Same options as in `apollo-cache-inmemory`.
