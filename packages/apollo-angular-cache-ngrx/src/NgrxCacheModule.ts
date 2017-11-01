import {NgModule} from '@angular/core';

import {NgrxCache} from './NgrxCache';

export const PROVIDERS = [NgrxCache];

@NgModule({
  providers: PROVIDERS,
})
export class NgrxCacheModule {}
