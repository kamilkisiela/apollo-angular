import {NgModule, ModuleWithProviders} from '@angular/core';
import {
  StoreModule,
  StoreRootModule,
  StoreFeatureModule,
  createFeatureSelector,
} from '@ngrx/store';

import {NgrxCache} from './cache';
import {cacheReducer} from './reducer';
import {State, CacheState} from './types';
import {DEFAULT_SELECTOR} from './tokens';

export function _cacheSelectorFactory(name: string) {
  return function _featureCacheSelector(state: State) {
    return createFeatureSelector<State>(name)(state).cache;
  };
}

export function _rootCacheSelector(state: State): CacheState {
  return state.cache;
}

export const PROVIDERS = [NgrxCache];

@NgModule({
  imports: [StoreFeatureModule],
})
export class NgrxCacheFeatureModule {}

@NgModule({
  imports: [StoreRootModule],
})
export class NgrxCacheRootModule {}

@NgModule({
  providers: PROVIDERS,
})
export class NgrxCacheModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgrxCacheRootModule,
      providers: [
        StoreModule.forRoot<State>({
          cache: cacheReducer,
        }).providers,
        {
          provide: DEFAULT_SELECTOR,
          useValue: _rootCacheSelector,
        },
        PROVIDERS,
      ],
    };
  }

  public static forFeature(name?: string): ModuleWithProviders {
    const featureName = name || 'apollo';

    return {
      ngModule: NgrxCacheFeatureModule,
      providers: [
        StoreModule.forFeature<State>(featureName, {
          cache: cacheReducer,
        }).providers,
        {
          provide: DEFAULT_SELECTOR,
          useValue: _cacheSelectorFactory(featureName),
        },
        PROVIDERS,
      ],
    };
  }
}
