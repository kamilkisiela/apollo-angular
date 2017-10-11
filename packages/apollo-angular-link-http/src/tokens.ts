import { InjectionToken } from '@angular/core';

import { Options } from './types';

export const HttpLinkOptions = new InjectionToken<Options | null>('apollo-angular-link-http:options');
