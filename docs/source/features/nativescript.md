---
title: Integrating with NativeScript
---

You can use Apollo with NativeScript exactly as you would with normal Angular application.

To introduce Apollo to your app, install `apollo-angular` and `apollo-angular-link-http` from npm and use them in your app as outlined in the [setup](../basics/setup.html) article:

```bash
npm install apollo-angular apollo-angular-link-http --save
```

> *Note* There are more packages to be installed, so check out the "initialization" article.

```ts
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptHttpClientModule, // this provides HttpClient
    ApolloModule,
    HttpLinkModule
  ]
})
export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    // create Apollo
    apollo.create({
      link: httpLink.create({ uri }),
      // other options like cache
    });
  }
}
```

If you are new to using Apollo with Angular, you should probably read the [Angular guide](../index.html).

## Examples

There are some Apollo examples written in NativeScript that you may wish to refer to:

1. The ["Posts and Authors" example](https://github.com/kamilkisiela/apollo-angular-nativescript).

> If you've got an example to post here, please hit the "Edit on GitHub" button above and let us know!
