import {NgModule} from '@angular/core';

import {HttpLink} from './http-link';

export const PROVIDERS = [HttpLink];

@NgModule({
  providers: PROVIDERS,
})
export class HttpLinkModule {}
