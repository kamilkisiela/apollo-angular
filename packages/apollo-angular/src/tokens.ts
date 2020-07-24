import {InjectionToken} from '@angular/core';
import {ApolloClientOptions} from '@apollo/client/core';
import {NamedOptions, Flags} from './types';

export const APOLLO_FLAGS = new InjectionToken<Flags>('APOLLO_FLAGS');

export const APOLLO_OPTIONS = new InjectionToken<ApolloClientOptions<any>>(
  'APOLLO_OPTIONS',
);

export const APOLLO_NAMED_OPTIONS = new InjectionToken<NamedOptions>(
  'APOLLO_NAMED_OPTIONS',
);
