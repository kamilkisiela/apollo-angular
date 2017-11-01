import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';

import {NgrxCacheModule} from './NgrxCacheModule';
import {cacheReducer} from './reducer';
import {State} from './types';
import {DEFAULT_SELECTOR} from './tokens';

const defaultCacheSelector = (state: State) => state.cache;

@NgModule({
  imports: [
    NgrxCacheModule,
    StoreModule.forRoot<State>({
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
export class NgrxCacheRootModule {}
