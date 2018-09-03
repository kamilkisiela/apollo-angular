import {Injectable} from '@angular/core';
import {DocumentNode} from 'graphql';
import {Observable} from 'rxjs';

import {Apollo} from './Apollo';
import {
  SubscriptionOptions,
  ExtraSubscriptionOptions,
  SubscriptionResult,
  R,
} from './types';

@Injectable()
export class Subscription<T = any, V = R> {
  public readonly document: DocumentNode;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public subscribe(
    variables?: V,
    options?: SubscriptionOptions,
    extra?: ExtraSubscriptionOptions,
  ): Observable<SubscriptionResult<T>> {
    return this.apollo.use(this.client).subscribe(
      {
        ...options,
        variables,
        query: this.document,
      },
      extra,
    );
  }
}
