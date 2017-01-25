import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { ApolloClient } from 'apollo-client';

import { Apollo } from './Apollo';
import { SelectPipe } from './SelectPipe';
import { APOLLO_CLIENT_WRAPPER, APOLLO_CLIENT_INSTANCE } from './tokens';

export const APOLLO_DIRECTIVES = [
  SelectPipe,
];
export const APOLLO_PROVIDERS: Provider[] = [
  provideApollo(),
];

export type ClientWrapper = () => ApolloClient;

export function provideApollo(): Provider {
  return {
    provide: Apollo,
    useFactory: createApollo,
    deps: [APOLLO_CLIENT_INSTANCE],
  };
}

export function createApollo(client: ApolloClient): Apollo {
  return new Apollo(client);
}

export function getApolloClient(clientFn: ClientWrapper): ApolloClient {
  return clientFn();
}

export function defaultApolloClient(clientFn: ClientWrapper): Provider[] {
  return [{
    provide: APOLLO_CLIENT_WRAPPER,
    useValue: clientFn,
  }, {
    provide: APOLLO_CLIENT_INSTANCE,
    useFactory: getApolloClient,
    deps: [APOLLO_CLIENT_WRAPPER],
  }];
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
}
