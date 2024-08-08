import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
  WatchFragmentResult,
} from '@apollo/client';
import { Apollo } from './apollo';
import type { EmptyObject, WatchFragmentOptionsAlone } from './types';

@Injectable()
export abstract class Fragment<
  T extends OperationVariables = {},
  V extends OperationVariables = EmptyObject,
> {
  public abstract readonly fragment: DocumentNode | TypedDocumentNode<T, V>;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public watch(
    options: WatchFragmentOptionsAlone<T, V>,
    variables?: V,
  ): Observable<WatchFragmentResult<T>> {
    return this.apollo
      .use(this.client)
      .watchFragment<T, V>({ ...options, variables, fragment: this.fragment });
  }
}
