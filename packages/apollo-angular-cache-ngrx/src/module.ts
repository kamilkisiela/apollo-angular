import {NgModule, ModuleWithProviders} from '@angular/core';
import {Store} from '@ngrx/store';

import {NgrxCache} from './cache';
import {APOLLO_STATE_KEY, _APOLLO_NORMALIZED_CACHE} from './tokens';
import {NgrxNormalizedCache} from './normalized-cache';

export const defaultStateKey = 'apollo';

export function _createNormalizedCache(
  store: Store<any>,
  stateKey: string,
): NgrxNormalizedCache {
  return new NgrxNormalizedCache(store, stateKey);
}

@NgModule({
  providers: [
    NgrxCache,
    {
      provide: APOLLO_STATE_KEY,
      useValue: defaultStateKey,
    },
    {
      provide: _APOLLO_NORMALIZED_CACHE,
      useFactory: _createNormalizedCache,
      deps: [Store, APOLLO_STATE_KEY],
    },
  ],
})
export class NgrxCacheModule {
  public static forRoot(stateKey?: string): ModuleWithProviders {
    return {
      ngModule: NgrxCacheModule,
      providers: [
        {
          provide: APOLLO_STATE_KEY,
          useValue: stateKey || defaultStateKey,
        },
        {
          provide: _APOLLO_NORMALIZED_CACHE,
          useFactory: _createNormalizedCache,
          deps: [Store, APOLLO_STATE_KEY],
        },
      ],
    };
  }
}
