import {Injectable} from '@angular/core';
import {DocumentNode} from 'graphql';
import {Observable} from 'rxjs';
import {FetchResult} from 'apollo-link';

import {Apollo} from './Apollo';
import {MutationOptionsAlone, R} from './types';

@Injectable()
export class Mutation<T = {}, V = R> {
  public readonly document: DocumentNode;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public mutate(
    variables?: V,
    options?: MutationOptionsAlone<T, V>,
  ): Observable<FetchResult<T>> {
    return this.apollo.use(this.client).mutate<T, V>({
      ...options,
      variables,
      mutation: this.document,
    });
  }
}
