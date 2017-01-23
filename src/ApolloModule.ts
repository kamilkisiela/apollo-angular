import { NgModule, ModuleWithProviders, Provider } from '@angular/core';

import { provideApollo } from './Angular2Apollo';
import { provideApolloClientMap } from './ApolloClientMap';
import { SelectPipe } from './SelectPipe';
import { provideApolloConfig } from './config';
import { ClientWrapper, ApolloConfigWrapper } from './types';

export const APOLLO_DIRECTIVES = [
  SelectPipe,
];
export const APOLLO_PROVIDERS: Provider[] = [
  provideApollo,
  provideApolloClientMap,
];

export function defaultApolloClient(clientFn: ClientWrapper): Provider {
  return provideApolloConfig(clientFn);
}

@NgModule({
  declarations: APOLLO_DIRECTIVES,
  exports: APOLLO_DIRECTIVES,
})
export class ApolloModule {
  public static withClient(clientFn: ClientWrapper): ModuleWithProviders {
    return {
      ngModule: ApolloModule,
      providers: [
        APOLLO_PROVIDERS,
        defaultApolloClient(clientFn),
      ],
    };
  }

  public static withClients(apolloConfigFn: ApolloConfigWrapper): ModuleWithProviders {
    return {
      ngModule: ApolloModule,
      providers: [
        APOLLO_PROVIDERS,
        provideApolloConfig(apolloConfigFn),
      ],
    };
  }
}
