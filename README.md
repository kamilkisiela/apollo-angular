# angular2-apollo

[![npm version](https://badge.fury.io/js/angular2-apollo.svg)](https://badge.fury.io/js/angular2-apollo)
[![Get on Slack](http://slack.apollostack.com/badge.svg)](http://slack.apollostack.com/)
[![Build status](https://travis-ci.org/apollostack/angular2-apollo.svg?branch=master)](https://travis-ci.org/apollostack/angular2-apollo)
[![Coverage Status](https://coveralls.io/repos/github/apollostack/angular2-apollo/badge.svg?branch=master)](https://coveralls.io/github/apollostack/angular2-apollo?branch=master)

Use your GraphQL server data in your Angular 2.0 app, with the [Apollo Client](https://github.com/apollostack/apollo-client).

- [Example](#example-use)
- [Install](#install)
- [Docs](http://docs.apollostack.com/apollo-client/angular2.html)
- [Development](#development)

## Example use:

```ts
import {
  Component,
  Injectable
} from 'angular2/core';

import {
  Angular2Apollo
} from 'angular2-apollo';

import {
  Observable
} from 'rxjs/Observable';

@Component({
  selector: 'postsList',
  templateUrl: 'client/postsList.html'
})
@Injectable()
class postsList {
  posts: Observable<any[]>;

  constructor(private angularApollo : Angular2Apollo) {
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

## Install

```bash
npm install angular2-apollo --save
```

## Development

Running tests locally:

```
# nvm use node
npm install
npm test
```

This project uses TypeScript for static typing and TSLint for linting. You can get both of these built into your editor with no configuration by opening this project in [Visual Studio Code](https://code.visualstudio.com/), an open source IDE which is available for free on all platforms.
