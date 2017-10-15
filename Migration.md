# Migration

## Initialization

### Cache and Links

ApolloClient 2.0 introduced two new features, Links and Cache.
Links are for fetching and manipulating data using custom logic.
Thanks to Cache API it's now possible to store and handle data in any way we want to.

**Before**

```ts
import { createNetworkInterface } from 'apollo-client';

function provideClient() {
  return new ApolloClient({
    networkInterface: createNetworkInterface({uri: '/graphql'})
  });
}

@NgModule({
  imports: [
    ApolloModule.forRoot(provideClient)
  ]
})
class AppModule {}
```

**After**

```ts
import InMemoryCache from 'apollo-cache-inmemory';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';

@NgModule({
  imports: [
    ApolloModule,
    HttpLinkModule
  ]
})
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      link: httpLink.create({uri: '/graphql'}),
      cache: new InMemoryCache()
    });
  }
}
```

Important thing to notice, `HttpLink` service.

It's the same as Apollo's `HttpLink` from `apollo-link-http` package but with one difference. It uses Angular's `HttpClient`.

With this approach, you can use things like Http Interceptors, you can even mock your Http Backend for GraphQL requests in testing.

It's even possible to use it in **NativeScript** applications without changing anything.

Since `HttpLink` uses Angular's Http client it gives Server-Side Rendering for free!

We highly recommand to use it.

About Cache. We used Apollo's InMemoryCache but you can use anything here, even **ngrx**. It's totally up to you.

### Providing a single client

**Before**

```ts
import { ApolloModule } from 'apollo-angular';

function provideClient() {
  return client;
}

@NgModule({
  imports: [
    ApolloModule.forRoot(provideClient)
  ]
})
class AppModule {}
```

**After**

Apollo Angular no longer supports providing instances of ApolloClient to `ApolloModule`.

```ts
import { ApolloModule, Apollo } from 'apollo-angular';

@NgModule({
  imports: [
    ApolloModule
  ]
})
class AppModule {
  constructor(apollo: Apollo) {
    apollo.create({/* ApolloClientOptions */});
  }
}
```

### Multiple clients

**Before**

```ts
import { ApolloModule } from 'apollo-angular';

function provideClients() {
  return {
    default: client,
    extra: extraClient
  };
}

@NgModule({
  imports: [
    ApolloModule.forRoot(provideClients)
  ]
})
class AppModule {}
```

**After**

```ts
import { ApolloModule, Apollo } from 'apollo-angular';

@NgModule({
  imports: [
    ApolloModule
  ]
})
class AppModule {
  constructor(apollo: Apollo) {
    apollo.createDefault({/* ApolloClientOptions */});
    apollo.createNamed('extra', /* ApolloClientOptions */);

    // or

    apollo.create({/* ApolloClientOptions */});
    apollo.create(/* ApolloClientOptions */, 'extra');
  }
}
```

## Watching Query

**Before**

```ts
import { Apollo, ApolloQueryObservable } from 'apollo-angular';

@Component({})
class AppComponent {
  items$: ApolloQueryObservable<any>;

  constructor(apollo: Apollo) {
    this.items$ = apollo.watchQuery({/* options */});
  }
}
```

**After**

```ts
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';

@Component({})
class AppComponent {
  items$: Observable<any>;

  constructor(apollo: Apollo) {
    const query = apollo.watchQuery({/* options */});

    this.items$ = query.valueChanges;
  }
}
```

As you can see, there is a new property, `valueChanges`. It's a part of new API called `QueryRef`.

**QueryRef**

The `QueryRef` object has the same interface as previous solution. Only difference is you can not subscribe to it because it's not an Observable.

To watch results you have to subscribe to `valueChanges` property.

Since it is an `Observable` of RxJS it's possible to use operators and every feature of RxJS, TypeScript won't throw any errors as it was before.

## Query and Mutation methods

Nothing change.

Keep on mind that as in every other Angular Service you have to subscribe to `mutation()` to make it do an action.

## Accesing multiple clients

The API stays the same.

```ts
// named client
apollo.use(name: string).query(/* options */)

// default client
apollo.query(/* options */)
// or
apollo.default().query(/* options */)
```

## Observable variables in watchQuery

In prior 1.0 version it was possible to use a variable in the `watchQuery()` method that was an `Observable`.

**Before**

```ts
class AppComponent {
  constructor(apollo: Apollo) {
    const name = new Subject();

    apollo.watchQuery({
      query: someQuery,
      variables: {
        name
      }
    }).subscribe(() => {
      console.log('New result');
    });

    name.next('Foo');
    // ...
    name.next('Bar');

    // New result
    // New result
  }
}
```

**After**

It's no longer available.

Instead you can do something like similar:

```ts
const variables = {
  title: 'Baz'
};
const name = new Subject();

Observable
  .of(variables)
  .combineLatest(name, (vars, name) => ({
    ...vars,
    name
  }))
  .switchMap((variables) => {
    return apollo.watchQuery({
      query: someQuery,
      variables
    });
  })
  .subscribe(() => {
    console.log('New result');
  });

  name.next('Foo');
  // ...
  name.next('Bar');

  // New result
  // New result
```


