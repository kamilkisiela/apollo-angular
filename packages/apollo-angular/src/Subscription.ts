import {Injectable} from '@angular/core';
import {DocumentNode} from 'graphql';
import {Observable} from 'rxjs';

import {Apollo} from './Apollo';
import {SubscriptionOptions, ExtraSubscriptionOptions, R} from './types';

@Injectable()
export class Subscription {
  public readonly document: DocumentNode;

  constructor(protected apollo: Apollo) {}

  public subscribe(
    variables?: R,
    options?: SubscriptionOptions,
    extra?: ExtraSubscriptionOptions,
  ): Observable<any> {
    return this.apollo.subscribe(
      {
        ...options,
        variables,
        query: this.document,
      },
      extra,
    );
  }
}
