import {InjectionToken} from '@angular/core';
import type {ApolloClientOptions} from '@apollo/client/core';
import type {NamedOptions, Flags} from './types';

export const APOLLO_FLAGS = new InjectionToken<Flags>('APOLLO_FLAGS');

export const APOLLO_OPTIONS = new InjectionToken<ApolloClientOptions<any>>(
  'APOLLO_OPTIONS',
);

export const APOLLO_NAMED_OPTIONS = new InjectionToken<NamedOptions>(
  'APOLLO_NAMED_OPTIONS',
);
