import {
  ApolloQueryPipe,
} from './apolloQueryPipe';

import {
  Apollo,
  ApolloQuery,
} from './apolloDecorator';

import {
  Angular2Apollo,
  defaultApolloClient,
} from './angular2Apollo';

import {
  ApolloQueryObservable,
} from './apolloQueryObservable';

export const APOLLO_PROVIDERS: any[] = [
  Angular2Apollo,
];

export {
  Apollo,
  ApolloQuery,
  ApolloQueryObservable,
  ApolloQueryPipe,
  Angular2Apollo,
  defaultApolloClient
};
