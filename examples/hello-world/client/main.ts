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

import {
  graphQLResult
} from 'graphql';

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
  mutations(state: any) {
    return {
      addUser: (firstName: string) => ({
        mutation: `
          mutation addUser(
            $firstName: String!
            $lastName: String!
          ) {
            addUser(
              firstName: $firstName
              lastName: $lastName
            ) {
              firstName
              lastName,
              emails {
                address
                verified
              }
            }
          }
        `,
        variables: {
          firstName,
          lastName: state.lastName,
        },
      }),
    };
  },
})
class Main {
  users: Observable<any[]>;
  firstName: string;
  lastName: string;

  public newUser() {
    this.addUser(this.firstName)
      .then((graphQLResult) => {
        const { errors, data } = graphQLResult;

        if (data) {
          console.log('got data', data);
        }

        if (errors) {
          console.log('got some GraphQL execution errors', errors);
        }
      })
      .catch((error: any) => {
        console.log('there was an error sending the query', error);
      });
  }
}

bootstrap(Main);
