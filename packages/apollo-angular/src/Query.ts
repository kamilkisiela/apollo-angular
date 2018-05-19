import {Injectable} from '@angular/core';
import {DocumentNode} from 'graphql';

import {Apollo} from './Apollo';
import {QueryRef} from './QueryRef';
import {QueryOptions} from './types';

@Injectable()
export class Query<T = {}, V = Record<string, any>> {
  public readonly document: DocumentNode;

  constructor(protected apollo: Apollo) {}

  public query(variables?: V, options?: QueryOptions): QueryRef<T, V> {
    return this.apollo.watchQuery<T, V>({
      ...options,
      variables,
      query: this.document,
    });
  }
}
