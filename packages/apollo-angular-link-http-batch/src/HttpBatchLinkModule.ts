import {NgModule} from '@angular/core';

import {HttpBatchLink} from './HttpBatchLink';

export const PROVIDERS = [HttpBatchLink];

@NgModule({
  providers: PROVIDERS,
})
export class HttpBatchLinkModule {}
