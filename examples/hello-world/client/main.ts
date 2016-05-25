import {
  bootstrap,
} from "@angular/platform-browser-dynamic";

import {
  Component,
  Injectable,
} from "@angular/core";

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

import gql from 'apollo-client/gql';

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
        query: gql`
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
        mutation: gql`
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
