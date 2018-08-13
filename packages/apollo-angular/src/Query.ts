import {Injectable} from '@angular/core';
import {DocumentNode} from 'graphql';
import {ApolloQueryResult} from 'apollo-client';
import {Observable} from 'rxjs';

import {Apollo} from './Apollo';
import {QueryRef} from './QueryRef';
import {WatchQueryOptions, QueryOptions, R} from './types';

@Injectable()
export class Query<T = {}, V = R> {
  public readonly document: DocumentNode;

  constructor(protected apollo: Apollo) {}

  public watch(variables?: V, options?: WatchQueryOptions): QueryRef<T, V> {
    return this.apollo.watchQuery<T, V>({
      ...options,
      variables,
      query: this.document,
    });
  }

  public fetch(
    variables?: V,
    options?: QueryOptions,
  ): Observable<ApolloQueryResult<T>> {
    return this.apollo.query<T, V>({
      ...options,
      variables,
      query: this.document,
    });
  }
}
