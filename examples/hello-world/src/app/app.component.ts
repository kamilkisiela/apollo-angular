import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';

// We need this to parse graphql string
import gql from 'graphql-tag';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {
  // Observable with GraphQL result
  public users: ApolloQueryObservable<any>;
  public firstName: string;
  public lastName: string;
  public nameControl = new FormControl();
  // Observable variable of the graphql query
  public nameFilter: Subject<string> = new Subject<string>();

  // Inject Angular2Apollo service
  constructor(private angular2Apollo: Angular2Apollo) {}

  public ngOnInit() {
    // Query users data with observable variables
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
    })
      // Return only users, not the whole ApolloQueryResult  
      .map(result => result.data.users) as ApolloQueryObservable<any>;

    // Add debounce time to wait 300 ms for a new change instead of keep hitting the server
    this.nameControl.valueChanges.debounceTime(300).subscribe(name => {
      this.nameFilter.next(name);
    });
  }

  public ngAfterViewInit() {
    // Set nameFilter to null after NgOnInit happend and the view has been initated
    this.nameFilter.next(null);
  }

  public newUser(firstName: string) {
    // Call the mutation called addUser
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
