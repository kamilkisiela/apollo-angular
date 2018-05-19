import {NgModule} from '@angular/core';

import {Apollo} from './Apollo';
import {SelectPipe} from './SelectPipe';
import {GraphqlDirective} from './GraphqlDirective';

export const PROVIDERS = [Apollo];
export const DECLARATIONS = [SelectPipe, GraphqlDirective];

@NgModule({
  providers: PROVIDERS,
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
})
export class ApolloModule {}
