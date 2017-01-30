---
title: Prefetching data
order: 24
---

One of the easiest ways to make your application's UI feel a lot snappier with Apollo Client is to use prefetching. Prefetching simply means fetching data before it needs to be rendered on the screen, for example by loading all data required for a view as soon as you anticipate that a user will navigate to it.

In Apollo Client, prefetching is very simple and can be done by running a component's query before rendering.

GitHunt uses `Apollo` and calls `query` method as soon as the user hovers over a link to the comments page. 
With the data prefetched, the comments page renders immediately, and the user often experiences no delay at all:

```ts
import { Component } from '@angular/core';
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
