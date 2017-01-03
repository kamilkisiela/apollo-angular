import { Component, OnInit } from '@angular/core';

import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';

// We need this to parse graphql string
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  version;

  constructor(private apollo: Angular2Apollo) {

  }

  ngOnInit() {
    this.loadVersion();
  }

  loadVersion() {
    const query = gql`
      {
        version
      }
    `;

    this.apollo.watchQuery({ query }).subscribe(res => this.version = res.data.version);

  }
}
