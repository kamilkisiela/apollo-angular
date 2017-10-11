import { InjectionToken } from '@angular/core';
// import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';

import { ApolloOptions } from './types';

const token = (name: string) => `apollo-angular:${name}`;

// export const ApolloClientToken = new InjectionToken<ApolloClient<any>>(token('client'));
export const ApolloLinkToken = new InjectionToken<ApolloLink>(token('link'));
export const ApolloCacheToken = new InjectionToken<any>(token('cache'));
export const ApolloOptionsToken = new InjectionToken<ApolloOptions>(token('options'));
