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

export const APOLLO_PROVIDERS: any[] = [
  Angular2Apollo,
];

export {
  Apollo,
  ApolloQuery,
  ApolloQueryPipe,
  Angular2Apollo,
  defaultApolloClient
};
