import {InjectionToken} from '@angular/core';

import {CacheSelector} from './types';

export const DEFAULT_SELECTOR = new InjectionToken<CacheSelector>(
  'apollo-angular Default Selector',
);
