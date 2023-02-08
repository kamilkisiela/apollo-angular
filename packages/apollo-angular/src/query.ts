import {Injectable} from '@angular/core';
import type {DocumentNode} from 'graphql';
import type { ApolloQueryResult, TypedDocumentNode, OperationVariables } from '@apollo/client/core';
import type {Observable} from 'rxjs';

import {Apollo} from './apollo';
import {QueryRef} from './query-ref';
import {WatchQueryOptionsAlone, QueryOptionsAlone, EmptyObject} from './types';

@Injectable()
export class Query<T = {}, V extends OperationVariables = EmptyObject> {
  public readonly document: DocumentNode | TypedDocumentNode<T, V>;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public watch(
    variables?: V,
    options?: WatchQueryOptionsAlone<V, T>,
  ): QueryRef<T, V> {
    return this.apollo.use(this.client).watchQuery<T, V>({
      ...options,
      variables,
      query: this.document,
    });
  }

  public fetch(
    variables?: V,
    options?: QueryOptionsAlone<V, T>,
  ): Observable<ApolloQueryResult<T>> {
    return this.apollo.use(this.client).query<T, V>({
      ...options,
      variables,
      query: this.document,
    });
  }
}
