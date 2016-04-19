import {
  bootstrap,
} from "angular2/platform/browser";

import {
  Component,
  Injectable,
  ChangeDetectionStrategy,
} from "angular2/core";

import {
  ApolloQueryPipe,
  APOLLO_PROVIDERS,
  Angular2Apollo,
  defaultApolloClient,
} from 'angular2-apollo';

import ApolloClient, {
  createNetworkInterface,
} from 'apollo-client';

import {
  Observable,
} from 'rxjs/Rx';

const client = new ApolloClient({
  networkInterface: createNetworkInterface('/graphql'),
});

@Component({
  selector: 'app',
  templateUrl: 'client/main.html',
  pipes: [ApolloQueryPipe],
})
@Injectable()
class Main {
  users: Observable<any[]>;

  constructor(private angularApollo: Angular2Apollo) {
    this.users = angularApollo.watchQuery({
      query: `
        query getUsers {
          users {
            firstName
            lastName
            emails {
              address
              verified
            }
          }
        }
      `,
    });
  }
}

bootstrap(Main, [
  APOLLO_PROVIDERS,
  defaultApolloClient(client),
]);
