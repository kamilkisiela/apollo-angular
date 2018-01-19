import {Injectable, Inject} from '@angular/core';
import {InMemoryCache, ApolloReducerConfig} from 'apollo-cache-inmemory';

import {NgrxNormalizedCache} from './normalized-cache';
import {_APOLLO_NORMALIZED_CACHE} from './tokens';

@Injectable()
export class NgrxCache {
  constructor(
    @Inject(_APOLLO_NORMALIZED_CACHE)
    private normalizedCache: NgrxNormalizedCache,
  ) {}
  public create(options?: ApolloReducerConfig): InMemoryCache {
    const storeFactory = () => this.normalizedCache;

    return new InMemoryCache({
      ...options,
      storeFactory,
    });
  }
}
