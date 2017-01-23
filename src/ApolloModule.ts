import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { ApolloClient } from 'apollo-client';

import { Angular2Apollo } from './Angular2Apollo';
import { SelectPipe } from './SelectPipe';
import { APOLLO_CLIENT_WRAPPER, APOLLO_CLIENT_INSTANCE } from './tokens';

export const APOLLO_DIRECTIVES = [
  SelectPipe,
];
export const APOLLO_PROVIDERS: Provider[] = [
  provideAngular2Apollo(),
];

export type ClientWrapper = () => ApolloClient;

export function provideAngular2Apollo(): Provider {
  return {
    provide: Angular2Apollo,
    useFactory: createAngular2Apollo,
    deps: [APOLLO_CLIENT_INSTANCE],
  };
}

export function createAngular2Apollo(client: ApolloClient): Angular2Apollo {
  return new Angular2Apollo(client);
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
