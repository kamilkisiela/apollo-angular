import {Injectable} from '@angular/core';
import {DocumentNode} from 'graphql';
import {Observable} from 'rxjs';

import {Apollo} from './apollo';
import {
  SubscriptionOptionsAlone,
  ExtraSubscriptionOptions,
  SubscriptionResult,
  EmptyObject,
} from './types';

@Injectable()
export class Subscription<T = any, V = EmptyObject> {
  public readonly document: DocumentNode;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public subscribe(
    variables?: V,
    options?: SubscriptionOptionsAlone<V>,
    extra?: ExtraSubscriptionOptions,
  ): Observable<SubscriptionResult<T>> {
    return this.apollo.use(this.client).subscribe<T, V>(
      {
        ...options,
        variables,
        query: this.document,
      },
      extra,
    );
  }
}
