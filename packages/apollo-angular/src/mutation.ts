import {Injectable} from '@angular/core';
import {DocumentNode} from 'graphql';
import {TypedDocumentNode} from '@graphql-typed-document-node/core';

import {Apollo} from './apollo';
import {MutationOptionsAlone, EmptyObject} from './types';

@Injectable()
export class Mutation<T = {}, V = EmptyObject> {
  public readonly document: DocumentNode | TypedDocumentNode<T, V>;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public mutate(variables?: V, options?: MutationOptionsAlone<T, V>) {
    return this.apollo.use(this.client).mutate<T, V>({
      ...options,
      variables,
      mutation: this.document,
    });
  }
}
