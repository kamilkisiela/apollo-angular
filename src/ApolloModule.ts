import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApolloClient } from 'apollo-client';

import { Angular2Apollo, defaultApolloClient } from './Angular2Apollo';
import { SelectPipe } from './SelectPipe';

const APOLLO_DIRECTIVES = [
  SelectPipe,
];
const APOLLO_PROVIDERS = [
  Angular2Apollo,
];

@NgModule({
  providers: APOLLO_PROVIDERS,
  declarations: APOLLO_DIRECTIVES,
  exports: APOLLO_DIRECTIVES,
})
export class ApolloModule {
  public static withClient(client: ApolloClient): ModuleWithProviders {
    return {
      ngModule: ApolloModule,
      providers: [
        defaultApolloClient(client),
      ],
    };
  }
}
