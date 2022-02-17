---
title: Migration Guide
description: Updating your app to Angular Apollo v3
---

- `ApolloModule` is back.
- File upload requires `extract-files` library.

## ApolloModule

The lazy-loading was broken in the previous major version but now it's fixed, all thanks to bringing back the `ApolloModule`.
Just like with any other `NgModule`, put it wherever makes sense for your app, usually it's `AppModule` or `GraphQLModule`.

```diff language="typescript"
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
-import {APOLLO_OPTIONS} from 'apollo-angular';
+import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';


@NgModule({
  imports: [
    // ... other modules
    HttpClientModule,
+   ApolloModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:3000',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
class AppModule {}
```


## File upload

New `apollo-angular` no longer depends on `extract-files` library. In order to use file uploads, you need to pass the `extractFiles` function (or create your own) to the `ApolloLink.create()`:

```diff language="typescript"
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';
+ import { extractFiles } from 'extract-files';

@NgModule({
  imports: [
    // ... other modules
    HttpClientModule,
    ApolloModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:3000',
+           extractFiles,
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
class AppModule {}
```
