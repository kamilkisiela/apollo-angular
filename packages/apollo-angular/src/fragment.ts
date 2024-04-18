import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { DocumentNode, TypedDocumentNode, WatchFragmentResult } from '@apollo/client';
import { Apollo } from './apollo';
import type { EmptyObject, WatchFragmentOptionsAlone } from './types';

@Injectable()
export class Fragment<T = {}, V = EmptyObject> {
  public readonly fragment: DocumentNode | TypedDocumentNode<T, V>;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public watch(
    variables?: V,
    options?: WatchFragmentOptionsAlone<T, V>,
  ): Observable<WatchFragmentResult<T>> {
    return this.apollo
      .use(this.client)
      .watchFragment<T, V>({ ...options, variables, fragment: this.fragment });
  }
}
