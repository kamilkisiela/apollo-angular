import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from './apollo';
import {
  EmptyObject,
  ExtraSubscriptionOptions,
  SubscriptionOptionsAlone,
  SubscriptionResult,
} from './types';

@Injectable()
export class Subscription<T = any, V = EmptyObject> {
  public readonly document: DocumentNode | TypedDocumentNode<T, V>;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public subscribe(
    variables?: V,
    options?: SubscriptionOptionsAlone<V, T>,
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
