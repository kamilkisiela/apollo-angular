import {InjectionToken} from '@angular/core';

import {PresetConfig} from './types';

export const APOLLO_BOOST_CONFIG = new InjectionToken<PresetConfig>(
  '[apollo-angular-boost] config',
);
