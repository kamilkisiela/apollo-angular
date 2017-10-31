import {NgModule} from '@angular/core';
import {StoreModule, StoreFeatureModule} from '@ngrx/store';

import {featureName} from './const';
import {NgrxCache} from './NgrxCache';
import {reducer} from './reducer';
import {State} from './types';

export const PROVIDERS = [NgrxCache];

@NgModule({
  imports: [
    StoreModule.forFeature<State>(featureName, {
      cache: reducer,
    }),
    StoreFeatureModule,
  ],
  providers: PROVIDERS,
})
export class NgrxCacheModule {}
