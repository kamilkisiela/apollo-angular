import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';

import gql from 'graphql-tag';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import template from './app.component.html';

@Component({
  selector: 'app',
  template
})
export class AppComponent implements OnInit, AfterViewInit {
  public users: ApolloQueryObservable<any>;
  public firstName: string;
  public lastName: string;
  public nameControl = new FormControl();
  public nameFilter: Subject<string> = new Subject<string>();

  constructor(private angular2Apollo: Angular2Apollo) {}

  public ngOnInit() {
    this.users = this.angular2Apollo.watchQuery({
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
    }).map(result => result.data.users);

    this.nameControl.valueChanges.debounceTime(300).subscribe(name => {
      this.nameFilter.next(name);
    });
  }

  public ngAfterViewInit() {
    this.nameFilter.next(null);
  }

  public newUser(firstName: string) {
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
        this.users.refetch();
      })
      .catch((errors: any) => {
        console.log('there was an error sending the query', errors);
      });
  }
}
