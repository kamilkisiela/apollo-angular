import {
  ApolloQueryPipe,
} from './apolloQueryPipe';

import {
  Angular2Apollo,
  defaultApolloClient,
} from './angular2Apollo';

export const APOLLO_PROVIDERS: any[] = [
  Angular2Apollo,
];

export {
  ApolloQueryPipe,
  Angular2Apollo,
  defaultApolloClient
};
