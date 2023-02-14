import { NgModule } from '@angular/core';

import { Apollo } from './apollo';

export const PROVIDERS = [Apollo];

@NgModule({
  providers: PROVIDERS,
})
export class ApolloModule {}
