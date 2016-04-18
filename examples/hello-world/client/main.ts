import {
  bootstrap,
} from "angular2/platform/browser";

import {
  Component,
  Injectable,
} from "angular2/core";

import {
  ApolloQueryPipe,
  APOLLO_PROVIDERS,
  Angular2Apollo,
  defaultApolloClient,
} from 'angular2-apollo';

import ApolloClient, {
  createNetworkInterface
} from 'apollo-client';

const client = new ApolloClient(
  networkInterface: createNetworkInterface('http://localhost:8080')
);

@Component({
  selector: 'app',
  templateUrl: 'client/main.html',
  pipes: [ApolloQueryPipe]
})
@Injectable()
class Main {
  obs: any;

  constructor(private angularApollo: Angular2Apollo) {
    this.obs = angularApollo.watchQuery({
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

bootstrap(Main, [
  APOLLO_PROVIDERS,
  defaultApolloClient(client),
]);
