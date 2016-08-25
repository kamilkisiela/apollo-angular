import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Angular2Apollo, ApolloQueryObservable, graphql, select } from 'angular2-apollo';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';

import gql from 'graphql-tag';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import template from './app.component.html';

const getUsersQuery = gql`
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
`;

const addUserMutation = gql`
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
`;

@Component({
  selector: 'app',
  template,
})
@graphql(getUsersQuery, addUserMutation)
export class AppComponent {
  @select('getUsers', ['users'], { forceFetch: true})
  public data: ApolloQueryObservable<any>;
  
  @select('addUser')
  private addUser: (options?: any) => Promise<any>;
  
  public firstName: string;
  public lastName: string;
  public nameControl = new FormControl();
  public nameFilter: Subject<string> = new Subject<string>();

  constructor(private angular2Apollo: Angular2Apollo) {
    console.log('data', this.data);
  }

  public newUser(firstName: string) {
    this.addUser({
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
