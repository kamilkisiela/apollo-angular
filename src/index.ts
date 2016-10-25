import { ApolloQueryPipe } from './ApolloQueryPipe';
import { SelectPipe } from './SelectPipe';
import { Angular2Apollo, defaultApolloClient } from './Angular2Apollo';
import { ApolloQueryObservable } from './ApolloQueryObservable';
import { ApolloModule } from './ApolloModule';

export const APOLLO_PROVIDERS: any[] = [
  Angular2Apollo,
];

export {
  ApolloModule,
  ApolloQueryObservable,
  ApolloQueryPipe,
  SelectPipe,
  Angular2Apollo,
  defaultApolloClient
};
