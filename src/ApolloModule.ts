import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApolloClient } from 'apollo-client';

import { Angular2Apollo, AngularApolloClient } from './Angular2Apollo';
import { SelectPipe } from './SelectPipe';

export const APOLLO_DIRECTIVES = [
  SelectPipe,
];
export const APOLLO_PROVIDERS = [
  Angular2Apollo,
];

export function defaultApolloClient(client: ApolloClient): any {
  return {
    provide: AngularApolloClient,
    useValue: client,
  };
}

@NgModule({
  declarations: APOLLO_DIRECTIVES,
  exports: APOLLO_DIRECTIVES,
})
export class ApolloModule {
  public static withClient(client: ApolloClient): ModuleWithProviders {
    return {
      ngModule: ApolloModule,
      providers: [
        APOLLO_PROVIDERS,
        defaultApolloClient(client),
      ],
    };
  }
}
