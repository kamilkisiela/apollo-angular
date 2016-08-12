import {
  NgModule,
  ModuleWithProviders,
} from '@angular/core';

import ApolloClient from 'apollo-client';

import {
  angularApolloClient,
  Angular2Apollo,
} from './angular2Apollo';

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
