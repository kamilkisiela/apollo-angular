# angular2-apollo

Use your GraphQL server data in your Angular 2.0 app, with the [Apollo Client](https://github.com/apollostack/apollo-client).


- [Example](#example-use)
- [Install](#install)
- [Boostrap](#bootstrap)
- [Inject](#inject-angular2apollo)
- [ApolloQueryPipe](#apolloquerypipe)

## Example use:

```ts
import {Component, Injectable} from "angular2/core";
import {ApolloQueryPipe, APOLLO_ANGULAR2_PROVIDERS, ApolloAngular2} from "angular2-apollo";
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'postsList',
  templateUrl: 'client/postsList.html',
  pipes: [ApolloQueryPipe]
})
@Injectable()
class postsList {
  posts: Observable<any[]>;

  constructor(private angularApollo : ApolloAngular2) {
    const client = angularApollo.createNetworkInterface('http://localhost:8080');

    this.posts = client.watchQuery({
      query: `
        query getPosts($tag: String) {
          posts(tag: $tag) {
            title
          }
        }
      `,
      variables: {
        tag: "1234"
      }
    });
  }
}
```

## Install

```bash
npm install angular2-apollo --save
```

## Bootstrap

```ts
import {bootstrap} from "angular2/platform/browser";
import {defaultApolloClient, APOLLO_PROVIDERS} from "angular2-apollo";
import {ApolloClient} from 'apollo-client';
import {MyAppClass} from './app/<my-app-class>';

const client = new ApolloClient();

bootstrap(<MyAppClass>, [
  APOLLO_PROVIDERS,
  defaultApolloClient(client)
  ]);
```

## Inject Angular2Apollo

```ts
import {Component, Injectable} from "angular2/core";
import {ApolloQueryPipe, ApolloAngular2} from "angular2-apollo";

@Component({
  selector: 'postsList',
  templateUrl: 'client/postsList.html',
  pipes: [ApolloQueryPipe]
})
@Injectable()
class postsList {
  constructor(private angularApollo : ApolloAngular2) {
  }
}
```

## Bind to query

```ts
import {Component, Injectable} from "angular2/core";
import {ApolloQueryPipe, ApolloAngular2} from "angular2-apollo";
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'postsList',
  templateUrl: 'client/postsList.html',
  pipes: [ApolloQueryPipe]
})
@Injectable()
class postsList {
  posts: Observable<any[]>;

  constructor(private angularApollo : ApolloAngular2) {
    this.posts = angularApollo.watchQuery({
      query: `
        query getPosts($tag: String) {
          posts(tag: $tag) {
            title
          }
        }
      `,
      variables: {
        tag: "1234"
      }
    });
  }
}
```

## ApolloQueryPipe

Apollo client exposes queries as observables, but each Apollo query can include few queries.

So inside an Apollo observable the data comes in the following form: `obs.data.queryName`

To handle that more easily we've created the `ApolloQueryPipe`. here is how it works:

template:
```html
<ul>
  <li *ngFor="#post of posts | async | apolloQuery:'posts'">
      {{ post.title }}
  </li>
</ul>
```

We are pondering about a solution that will return an observable per single query and then we won't need that pipe anymore.

## Query parameters

## Mutations

## Development

Running tests locally:

```
# nvm use node
npm install
npm test
```

This project uses TypeScript for static typing and TSLint for linting. You can get both of these built into your editor with no configuration by opening this project in [Visual Studio Code](https://code.visualstudio.com/), an open source IDE which is available for free on all platforms.
