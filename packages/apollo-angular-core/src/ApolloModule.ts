import { NgModule, ModuleWithProviders } from '@angular/core';

import { Apollo } from './Apollo';
import { ApolloOptionsToken } from './tokens';
import { ApolloOptions } from './types';

export const PROVIDERS = [Apollo];

@NgModule({
  providers: [
    ...PROVIDERS
  ]
})
export class ApolloModule {
  static forRoot(options: ApolloOptions): ModuleWithProviders {
    return {
      ngModule: ApolloModule,
      providers: [
        ...PROVIDERS,
        { provide: ApolloOptionsToken, useValue: options },
      ],
    }
  }
}
