import * as api from '../src';
import { Apollo } from '../src/apollo';
import { ApolloModule, provideApollo, provideNamedApollo } from '../src/apollo-module';
import { gql, graphql } from '../src/gql';
import { QueryRef } from '../src/query-ref';

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
  test('should export provideApollo', () => {
    expect(api.provideApollo).toBe(provideApollo);
  });
  test('should export provideNamedApollo', () => {
    expect(api.provideNamedApollo).toBe(provideNamedApollo);
  });
  test('should export gql', () => {
    expect(api.gql).toBe(gql);
  });
  test('should export graphql', () => {
    expect(api.graphql).toBe(graphql);
  });
});
