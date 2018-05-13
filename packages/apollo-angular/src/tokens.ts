import {InjectionToken} from '@angular/core';
import {ApolloClientOptions} from 'apollo-client';

export const APOLLO_OPTIONS = new InjectionToken<ApolloClientOptions<any>>(
  '[apollo-angular] options',
);
