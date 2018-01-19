import {InjectionToken} from '@angular/core';

import {NgrxNormalizedCache} from './normalized-cache';

export const APOLLO_STATE_KEY = new InjectionToken<string>(
  '[apollo] State Key',
);

export const _APOLLO_NORMALIZED_CACHE = new InjectionToken<NgrxNormalizedCache>(
  '[apollo] Cache',
);
