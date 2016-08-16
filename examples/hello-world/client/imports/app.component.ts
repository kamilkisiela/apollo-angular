import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Angular2Apollo, ApolloQueryPipe, ApolloQueryObservable } from 'angular2-apollo';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';

import { User } from './user.interface';

import gql from 'graphql-tag';

import 'rxjs/add/operator/debounceTime';

import template from './app.component.html';

interface Data {
  users: User[];
}

@Component({
  selector: 'app',
  template,
  pipes: [ApolloQueryPipe],
})
export class AppComponent implements OnInit, AfterViewInit {
  public data: ApolloQueryObservable<Data>;
  public firstName: string;
  public lastName: string;
  public nameControl = new FormControl();
  public nameFilter: Subject<string> = new Subject<string>();

  constructor(private angular2Apollo: Angular2Apollo) {}

  public ngOnInit() {
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
        this.data.refetch();
      })
      .catch((errors: any) => {
        console.log('there was an error sending the query', errors);
      });
  }
}
