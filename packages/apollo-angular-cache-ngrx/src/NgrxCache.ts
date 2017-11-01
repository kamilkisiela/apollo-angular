import {Injectable, Optional, Inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {InMemoryCache, ApolloReducerConfig} from 'apollo-cache-inmemory';

import {NgrxNormalizedCache} from './NgrxNormalizedCache';
import {State, NgrxCacheOptions, CacheSelector} from './types';
import {DEFAULT_SELECTOR} from './tokens';

@Injectable()
export class NgrxCache {
  constructor(
    private store: Store<State>,
    @Optional()
    @Inject(DEFAULT_SELECTOR)
    private defaultCacheSelector: CacheSelector,
  ) {}
  public create(options?: NgrxCacheOptions): InMemoryCache {
    // TODO: allow to define selector so folks can use cacheReducer in their own Store
    const cacheOptions: ApolloReducerConfig = {
      ...options,
      selector: undefined,
    } as ApolloReducerConfig;
    return new InMemoryCache({
      ...cacheOptions,
      storeFactory: () =>
        new NgrxNormalizedCache(this.store, {
          ...options,
          selector: this.defaultCacheSelector
            ? this.defaultCacheSelector
            : options.selector,
        }),
    });
  }
}
