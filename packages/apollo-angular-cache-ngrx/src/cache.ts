import {Injectable, Optional, Inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {InMemoryCache, ApolloReducerConfig} from 'apollo-cache-inmemory';

import {NgrxNormalizedCache} from './normalizedCache';
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
    // clear NgrxCache specific options
    const cacheOptions = {
      ...options,
      selector: undefined,
    } as ApolloReducerConfig;

    // define options for NgrxNormalizedCache
    const ngrxCacheOptions: NgrxCacheOptions = {
      ...options,
      selector: this.defaultCacheSelector
        ? this.defaultCacheSelector
        : options.selector,
    };

    const storeFactory = () =>
      new NgrxNormalizedCache(this.store, ngrxCacheOptions);

    return new InMemoryCache({
      ...cacheOptions,
      storeFactory,
    });
  }
}
