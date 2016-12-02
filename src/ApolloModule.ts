import { NgModule } from '@angular/core';
import { ApolloClient } from 'apollo-client';

import { Angular2Apollo } from './Angular2Apollo';
import { SelectPipe } from './SelectPipe';

export function getDefaultClient() {
  return new ApolloClient();
}

const APOLLO_DIRECTIVES = [
  SelectPipe,
];
const APOLLO_PROVIDERS = [
  Angular2Apollo,
  {
    provide: ApolloClient,
    useFactory: getDefaultClient,
  },
];

@NgModule({
  providers: APOLLO_PROVIDERS,
  declarations: APOLLO_DIRECTIVES,
  exports: APOLLO_DIRECTIVES,
})
export class ApolloModule { }
