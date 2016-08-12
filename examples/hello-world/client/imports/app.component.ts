import { Component, OnInit } from '@angular/core';
import { Angular2Apollo, ApolloQueryPipe, ApolloQueryObservable } from 'angular2-apollo';
import { ApolloQueryResult } from 'apollo-client';

import { User } from './user.interface';

import gql from 'graphql-tag';

import template from './app.component.html';

interface Data {
  users: User[];
}

@Component({
  selector: 'app',
  template,
  pipes: [ApolloQueryPipe],
})
export class AppComponent implements OnInit {
  data: ApolloQueryObservable<Data>;
  firstName: string;
  lastName: string;
  nameFilter: string;

  constructor(private angular2Apollo: Angular2Apollo) {}

  ngOnInit() {
    this.data = this.angular2Apollo.watchQuery({
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
        name: this.nameFilter,
      },
    });
  }

  newUser(firstName: string) {
    this.angular2Apollo.mutate({
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
        lastName: this.lastName,
      },
    })
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
