import { ApolloQueryPipe } from './ApolloQueryPipe';
import { SelectPipe } from './SelectPipe';
import { Apollo, ApolloQuery } from './ApolloDecorator';
import { Angular2Apollo, defaultApolloClient } from './Angular2Apollo';
import { ApolloQueryObservable } from './ApolloQueryObservable';
import { ApolloModule } from './ApolloModule';
import { graphql } from './decorators/graphql';

export const APOLLO_PROVIDERS: any[] = [
  Angular2Apollo,
];

export {
  graphql,
  Apollo,
  ApolloModule,
  ApolloQuery,
  ApolloQueryObservable,
  ApolloQueryPipe,
  SelectPipe,
  Angular2Apollo,
  defaultApolloClient,
};
