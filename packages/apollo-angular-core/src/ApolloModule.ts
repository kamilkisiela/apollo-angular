import {NgModule} from '@angular/core';

import {Apollo} from './Apollo';
import {SelectPipe} from './SelectPipe';

export const PROVIDERS = [Apollo];
export const DECLARATIONS = [SelectPipe];

@NgModule({
  providers: PROVIDERS,
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
})
export class ApolloModule {}
