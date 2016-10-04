import { OpaqueToken, Injectable, Inject } from '@angular/core';
import { rxify } from 'apollo-client-rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';

import { ApolloQueryObservable } from './ApolloQueryObservable';

import ApolloClient from 'apollo-client';

import 'rxjs/add/observable/from';

export const angularApolloClient = new OpaqueToken('AngularApolloClient');
export const defaultApolloClient = (client: ApolloClient): any => {
  return {
    provide: angularApolloClient,
    useValue: client,
  };
};

@Injectable()
export class Angular2Apollo {
  constructor(
    @Inject(angularApolloClient) private client: any
  ) {}

  public watchQuery(options: any): ApolloQueryObservable<ApolloQueryResult> {
    return new ApolloQueryObservable(rxify(this.client.watchQuery)(options));
  }

  public query(options: any) {
    return this.client.query(options);
  }

  public mutate(options: any) {
    return this.client.mutate(options);
  }

  public subscribe(options: any): Observable<any> {
    if (typeof this.client.subscribe === 'undefined') {
      throw new Error(`Your version of ApolloClient doesn't support subscriptions`);
    }

    return Observable.from(this.client.subscribe(options));
  }
}
