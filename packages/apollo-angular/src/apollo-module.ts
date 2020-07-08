import {NgModule} from '@angular/core';

import {Apollo} from './apollo';
import {SelectPipe} from './select-pipe';

export const PROVIDERS = [Apollo];
export const DECLARATIONS = [SelectPipe];

@NgModule({
  providers: PROVIDERS,
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
})
export class ApolloModule {}
