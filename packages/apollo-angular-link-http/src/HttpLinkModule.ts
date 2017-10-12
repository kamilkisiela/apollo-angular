import {NgModule} from '@angular/core';

import {HttpLink} from './HttpLink';

export const PROVIDERS = [HttpLink];

@NgModule({
  providers: PROVIDERS,
})
export class HttpLinkModule {}
