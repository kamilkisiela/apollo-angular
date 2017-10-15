import {NgModule, ModuleWithProviders, Provider} from '@angular/core';

import {provideApollo, provideClientMap} from './Apollo';
import {SelectPipe} from './SelectPipe';
import {ClientWrapper, ClientMapWrapper} from './types';

export const APOLLO_DIRECTIVES = [SelectPipe];
export const APOLLO_PROVIDERS: Provider[] = [provideApollo];

export function defaultApolloClient(clientFn: ClientWrapper): Provider {
  return provideClientMap(clientFn);
}

@NgModule({
  declarations: APOLLO_DIRECTIVES,
  exports: APOLLO_DIRECTIVES,
})
export class ApolloModule {
  // XXX: Keep it to avoid a breaking change
  public static withClient(clientFn: ClientWrapper): ModuleWithProviders {
    return {
      ngModule: ApolloModule,
      providers: [APOLLO_PROVIDERS, defaultApolloClient(clientFn)],
    };
  }

  /**
   * Defines a map of ApolloClients or a single instance
   */
  public static forRoot(
    clientMapFn: ClientMapWrapper | ClientWrapper
  ): ModuleWithProviders {
    return {
      ngModule: ApolloModule,
      providers: [APOLLO_PROVIDERS, provideClientMap(clientMapFn)],
    };
  }
}
