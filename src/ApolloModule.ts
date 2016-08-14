import { NgModule, ModuleWithProviders } from '@angular/core';

import { angularApolloClient, Angular2Apollo } from './Angular2Apollo';

import ApolloClient from 'apollo-client';

@NgModule({
  providers: [Angular2Apollo],
})
export class ApolloModule {
  public static withClient(client: ApolloClient): ModuleWithProviders {
    return {
      ngModule: ApolloModule,
      providers: [
        { provide: angularApolloClient, useValue: client },
      ],
    };
  }
}
