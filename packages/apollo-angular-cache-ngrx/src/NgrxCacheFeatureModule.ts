import {NgModule} from '@angular/core';
import {StoreModule, createFeatureSelector} from '@ngrx/store';

import {NgrxCacheModule} from './NgrxCacheModule';
import {cacheReducer} from './reducer';
import {State} from './types';
import {DEFAULT_SELECTOR} from './tokens';

const defaultCacheSelector = (state: State) =>
  createFeatureSelector<State>('apollo')(state).cache;

@NgModule({
  imports: [
    NgrxCacheModule,
    StoreModule.forFeature<State>('apollo', {
      cache: cacheReducer,
    }),
  ],
  exports: [NgrxCacheModule],
  providers: [
    {
      provide: DEFAULT_SELECTOR,
      useValue: defaultCacheSelector,
    },
  ],
})
export class NgrxCacheFeatureModule {}
