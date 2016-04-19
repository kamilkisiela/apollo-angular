import {
  ApolloQueryPipe,
} from './apolloQueryPipe';

import {
  Apollo,
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
  ApolloQueryPipe,
  Angular2Apollo,
  defaultApolloClient
};
