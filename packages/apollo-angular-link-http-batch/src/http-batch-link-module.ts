import {NgModule} from '@angular/core';

import {HttpBatchLink} from './http-batch-link';

export const PROVIDERS = [HttpBatchLink];

@NgModule({
  providers: PROVIDERS,
})
export class HttpBatchLinkModule {}
