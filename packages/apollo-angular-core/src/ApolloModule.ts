import {NgModule} from '@angular/core';

import {Apollo} from './Apollo';

export const PROVIDERS = [Apollo];

@NgModule({
  providers: PROVIDERS,
})
export class ApolloModule {}
