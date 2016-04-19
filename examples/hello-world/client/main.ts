import {
  bootstrap,
} from "angular2/platform/browser";

import {
  Component,
  Injectable,
} from "angular2/core";

import {
  Observable,
} from 'rxjs/Rx';

import {
  ApolloQueryPipe,
  Apollo,
} from 'angular2-apollo';

import ApolloClient, {
  createNetworkInterface,
} from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface('/graphql'),
});

@Component({
  selector: 'app',
  templateUrl: 'client/main.html',
  pipes: [ApolloQueryPipe],
})
@Injectable()
@Apollo({
  client,
  queries(state: any) {
    return {
      users: {
        query: `
          query getUsers($name: String) {
            users(name: $name) {
              firstName
              lastName
              emails {
                address
                verified
              }
            }
          }
        `,
        variables: {
          name: state.name,
        },
      },
    };
  },
})
class Main {
  users: Observable<any[]>;
  name: string;
}

bootstrap(Main);
