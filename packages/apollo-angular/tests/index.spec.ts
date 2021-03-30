import * as api from '../src';

import {ApolloModule} from '../src/apollo-module';
import {Apollo} from '../src/apollo';
import {QueryRef} from '../src/query-ref';
import {gql, graphql} from '../src/gql';

describe('public api', () => {
  test('should export Apollo', () => {
    expect(api.Apollo).toBe(Apollo);
  });
  test('should export QueryRef', () => {
    expect(api.QueryRef).toBe(QueryRef);
  });
  test('should export ApolloModule', () => {
    expect(api.ApolloModule).toBe(ApolloModule);
  });
  test('should export gql', () => {
    expect(api.gql).toBe(gql);
  });
  test('should export graphql', () => {
    expect(api.graphql).toBe(graphql);
  });
});
