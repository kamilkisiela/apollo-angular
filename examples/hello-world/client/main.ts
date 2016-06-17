import {
  bootstrap,
} from '@angular/platform-browser-dynamic';

import {
  Component,
  Injectable,
} from '@angular/core';

import {
  Apollo,
} from 'angular2-apollo';

import ApolloClient, {
  createNetworkInterface,
} from 'apollo-client';

import gql from 'apollo-client/gql';

import {
  GraphQLResult,
} from 'graphql';

const client = new ApolloClient({
  networkInterface: createNetworkInterface('/graphql'),
});

@Component({
  selector: 'app',
  templateUrl: 'client/main.html',
})
@Injectable()
@Apollo({
  client,
  queries(state: any) {
    return {
      data: {
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
          name: state.nameFilter,
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
  public data: any;
  public firstName: string;
  public lastName: string;
  public nameFilter: string;
  public addUser: (firstName: string) => Promise<GraphQLResult>;

  public newUser(firstName: string) {
    this.addUser(firstName)
      .then((graphQLResult: GraphQLResult) => {
        const { errors, data } = graphQLResult;

        if (data) {
          console.log('got data', data);
        }

        if (errors) {
          console.log('got some GraphQL execution errors', errors);
        }

        // get new data
        this.data.refetch();
      })
      .catch((error: any) => {
        console.log('there was an error sending the query', error);
      });
  }
}

bootstrap(Main);
