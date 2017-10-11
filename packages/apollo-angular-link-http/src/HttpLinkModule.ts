import { NgModule, ModuleWithProviders } from '@angular/core';

import { HttpLink } from './HttpLink';
import { Options } from './types';
import { HttpLinkOptions } from './tokens';

export const PROVIDERS = [HttpLink];

@NgModule({
  providers: PROVIDERS
})
export class HttpLinkModule {
  public static forRoot(options: Options): ModuleWithProviders {
    return {
      ngModule: HttpLinkModule,
      providers: [
        ...PROVIDERS,
        {
          provide: HttpLinkOptions,
          useValue: options,
        },
      ],
    };
  }
}
