import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {InMemoryCache, ApolloReducerConfig} from 'apollo-cache-inmemory';

import {NgrxNormalizedCache} from './NgrxNormalizedCache';
import {State} from './types';

@Injectable()
export class NgrxCache {
  constructor(private store: Store<State>) {}
  public create(options?: ApolloReducerConfig): InMemoryCache {
    return new InMemoryCache({
      ...options,
      storeFactory: () => new NgrxNormalizedCache(this.store),
    });
  }
}
