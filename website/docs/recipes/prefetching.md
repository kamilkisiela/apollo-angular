---
title: Prefetching data
---

One of the easiest ways to make your application's UI feel a lot snappier with Apollo Client is to use prefetching. Prefetching simply means fetching data before it needs to be rendered on the screen, for example by loading all data required for a view as soon as you anticipate that a user will navigate to it.

In Apollo Client, prefetching is very simple and can be done by running a component's query before rendering.

GitHunt uses `Apollo` and calls `query` method as soon as the user hovers over a link to the comments  page.
With the data prefetched, the comments page renders immediately, and the user often experiences no delay at all:

```ts
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  template: `
    <a [routerLink]="['/', org, repoName]" (mouseover)="prefetchComments(fullName)">
      View comments ({{ commentCount }})
    </a>
  `
})
class RepoInfoComponent {
  org: string;
  fullName: string;
  repoName: string;
  entry: any;

  constructor(private apollo: Apollo) {}

  prefetchComments(repoFullName: string) {
    this.apollo.query({
      query: commentQuery,
      variables: { repoName: repoFullName },
    }).subscribe();
  }
}
```

There are a lot of different ways to anticipate that the user will end up needing some data in the UI. In addition to using the hover state, here are some other places you can preload data:

1. The next step of a multi-step wizard immediately
1. The route of a call-to-action button
1. All of the data for a sub-area of the application, to make navigating within that area instant

If you have some other ideas, please send a PR to this article, and maybe add some more code snippets. A special form of prefetching is [store hydration from the server](./server-side-rendering.md#store-rehydration), so you might also consider hydrating more data than is actually needed for the first page load to make other interactions faster.
