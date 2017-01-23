import { Injectable, Provider } from '@angular/core';
import { rxify } from 'apollo-client-rxjs';
import { ApolloClient, ApolloQueryResult, WatchQueryOptions, MutationOptions, SubscriptionOptions } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { FragmentDefinitionNode } from 'graphql';

import { ApolloQueryObservable } from './ApolloQueryObservable';
import { ApolloClientMap } from './ApolloClientMap';

export interface DeprecatedWatchQueryOptions extends WatchQueryOptions {
  fragments?: FragmentDefinitionNode[];
}

@Injectable()
export class Apollo {
  constructor(
    private clientMap: ApolloClientMap,
  ) {}

  public watchQuery<T>(options: DeprecatedWatchQueryOptions): ApolloQueryObservable<ApolloQueryResult<T>> {
    return new ApolloQueryObservable(rxify(this.clientMap.default().watchQuery)(options));
  }

  public query<T>(options: DeprecatedWatchQueryOptions): Observable<ApolloQueryResult<T>> {
    return fromPromise(this.clientMap.default().query(options));
  }

  public mutate<T>(options: MutationOptions): Observable<ApolloQueryResult<T>> {
    return fromPromise(this.clientMap.default().mutate(options));
  }

  public subscribe(options: SubscriptionOptions): Observable<any> {
    return from(this.clientMap.default().subscribe(options));
  }

  public getClient(): ApolloClient {
    return this.clientMap.default();
  }
}

export const provideAngular2Apollo: Provider = {
  provide: Angular2Apollo,
  useFactory: createAngular2Apollo,
  deps: [ApolloClientMap],
};

export function createAngular2Apollo(clientMap: ApolloClientMap): Angular2Apollo {
  return new Angular2Apollo(clientMap);
}
