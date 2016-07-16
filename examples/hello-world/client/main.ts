import 'reflect-metadata';
import 'rxjs';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';

import {
  bootstrap,
} from '@angular/platform-browser-dynamic';

import {
  Component,
} from '@angular/core';

import {
  Apollo,
  ApolloQuery,
} from 'angular2-apollo';

import ApolloClient, {
  createNetworkInterface,
} from 'apollo-client';

import gql from 'graphql-tag';

import {
  ApolloQueryResult,
} from 'apollo-client';

import template from './main.html';

const client = new ApolloClient({
  networkInterface: createNetworkInterface('/graphql'),
});

@Component({
  selector: 'app',
  template,
})
@Apollo({
  client,
  queries(component: Main) {
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
          name: component.nameFilter,
        },
      },
    };
  },
  mutations(component: Main) {
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
          lastName: component.lastName,
        },
      }),
    };
  },
})
class Main {
  public data: ApolloQuery;
  public firstName: string;
  public lastName: string;
  public nameFilter: string;
  public addUser: (firstName: string) => Promise<ApolloQueryResult>;

  public newUser(firstName: string) {
    this.addUser(firstName)
      .then(({ data }: ApolloQueryResult) => {
        console.log('got data', data);

        // get new data
        this.data.refetch();
      })
      .catch((errors: any) => {
        console.log('there was an error sending the query', errors);
      });
  }
}

bootstrap(Main);
