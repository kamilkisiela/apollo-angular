---
title: Queries
---

On this page, you can learn how to use Apollo to attach GraphQL query results to
your Angular UI. This guide assumes some familiarity with GraphQL itself. You
can read about GraphQL queries themselves in detail at
[graphql.org](http://graphql.org/docs/queries/).

One of our core values is "it's just GraphQL." When using Apollo Client, you
don't have to learn anything special about the query syntax, since everything is
just standard GraphQL. Anything you can type into the GraphQL query IDE, you
can also put into your Apollo Client code.

<h2 id="basics">Basic Queries</h2>

When we are using a basic query, we can use the `Apollo.watchQuery` method in a
very simple way. We simply need to parse our query into a GraphQL document using
the `graphql-tag` library.

For instance, in GitHunt, we want to display the current user (if logged in) in
the `Profile` component:

```ts
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

// We use the gql tag to parse our query string into a query document
const CurrentUserForProfile = gql`
  query CurrentUserForProfile {
    currentUser {
      login
      avatar_url
    }
  }
`;

@Component({ ... })
class ProfileComponent implements OnInit, OnDestroy {
  loading: boolean;
  currentUser: any;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: CurrentUserForProfile
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.currentUser = data.currentUser;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
```

The `watchQuery` method returns a `QueryRef` object which has the `valueChanges`
property that is an `Observable`.

We can see that the result object contains `loading`, a Boolean indicating if
the query is "in-flight." The observable will only emit once when the query is
complete, and `loading` will be set to false unless you set the `watchQuery`
parameters `notifyOnNetworkStatusChange` or `returnPartialData` to true. Once
the query has completed, it will also contain a `data` object with
`currentUser`, the field we've picked out in `CurrentUserForProfile`.

We can expect the `data.currentUser` to change as the logged-in-ness of the
client and what it knows about the current user changes over time. That
information is stored in Apollo Client's global cache, so if some other query
fetches new information about the current user, this component will update to
remain consistent.

It's also possible to fetch data only once. The `query` method of `Apollo`
service returns an `Observable` that also resolves with the same result as
above.

<h3 id="queryref">What is QueryRef</h3>

As you know, `Apollo.query` method returns an Observable that emits a result,
just once. `Apollo.watchQuery` also does the same, except it can emit multiple
results. (The GraphQL query itself is still only sent once, but the `watchQuery`
observable can also update if, for example, another query causes the object to
be updated within Apollo Client's global cache.)

So why doesn't `Apollo.watchQuery` expose an Observable?

Apollo service and ApolloClient share pretty much the same API. It makes things
easy to understand and use. No reason to change it.

In `ApolloClient.watchQuery` returns an Observable, but not a standard one, it
contains many useful methods (like `refetch()`) to manipulate the watched query.
A normal Observable, has only one method, `subscribe()`.

To use that Apollo's Observable in RxJS, we would have to drop those methods.
Since they are necessary to use Apollo to its full potential, we had to come up
with a solution.

This is why we created `QueryRef`.

The API of `QueryRef` is very simple. It has the same methods as the Apollo
Observable we talked about. To subscribe to query results, you have to access its
`valueChanges` property which exposes a clean RxJS Observable.

It's worth mentioning that `QueryRef` accepts two generic types. More about that in
[Static Typing](../features/static-typing.html).

<h2 id="options">Providing `options`</h2>

`watchQuery` and `query` methods expect one argument, an object with options. If
you want to configure the query, you can provide any available option in the
same object where the `query` key lives.

If your query takes variables, this is the place to pass them in:

```ts
// Suppose our profile query took an avatar size
const CurrentUserForProfile = gql`
  query CurrentUserForProfile($avatarSize: Int!) {
    currentUser {
      login
      avatar_url(avatarSize: $avatarSize)
    }
  }
`;

@Component({
  template: `
    Login: {{currentUser?.profile}}
  `,
})
class ProfileComponent implements OnInit, OnDestroy {
  currentUser: any;
  private querySubscription: Subscription;
  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery({
        query: CurrentUserForProfile,
        variables: {
          avatarSize: 100,
        },
      })
      .valueChanges.subscribe(({data}) => {
        this.currentUser = data.currentUser;
      });
  }
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
```

<h2 id="select-pipe">Using with AsyncPipe</h2>

In Angular, the simplest way of displaying data that comes from Observable is to
put `AsyncPipe` on top of the property inside the UI. You can also achieve this
with Apollo.

> Note: Using async pipe more than once in your template will trigger the query
> for each pipe. To avoid this situation, subscribe to the data in the component,
> and display the data from the component's property.

An Observable returned by `watchQuery().valueChanges` holds the actual result
under the `data` field, so you can not directly access one of the properties of
that object.

This is why we created `SelectPipe`. The only argument it receives is the name
of the property you want to get from `data`.

```ts
import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import gql from 'graphql-tag';

const FeedQuery = gql`
  query Feed {
    currentUser {
      login
    }
    feed {
      createdAt
      score
    }
  }
`;

@Component({
  template: `
    <ul *ngFor="let entry of data | async | select: 'feed'">
      Score: {{entry.score}}
    </ul>
  `,
})
class FeedComponent implements OnInit {
  data: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.data = this.apollo.watchQuery({query: FeedQuery}).valueChanges;
  }
}
```

The result of the query has this structure:

```json
{
  "data": {
    "currentUser": { ... },
    "feed": [ ... ]
  }
}
```

Without using `SelectPipe`, you would get the whole object instead of only the
`data.feed`.

<h2 id="rxjs">Using with RxJS</h2>

`Apollo` is compatible with RxJS by using same Observable so it can be used with
operators.

What's really interesting is that, because of this, you can avoid using `SelectPipe`:

```ts
import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import gql from 'graphql-tag';

const FeedQuery = gql`
  query Feed {
    currentUser {
      login
    }
    feed {
      createdAt
      score
    }
  }
`;

@Component({
  template: `
    <ul *ngFor="let entry of data | async">
      Score: {{entry.score}}
    </ul>
  `,
})
class FeedComponent implements OnInit {
  data: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.data = this.apollo
      .watchQuery({query: FeedQuery})
      .valueChanges.pipe(map(({data}) => data.feed));
  }
}
```

The `map` operator we are using here is provided by the RxJS `Observable` which
serves as the basis for the `Observable`.

To be able to use the `map` operator (and most others like `switchMap`,
`filter`, `merge`, ...) these have to be explicitly imported as done in the
example: `import {map} from 'rxjs/operators'`.
