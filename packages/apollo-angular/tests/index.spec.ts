import { describe, expect, test } from 'vitest';
import * as api from '../src';
import { Apollo } from '../src/apollo';
import { provideApollo, provideNamedApollo } from '../src/apollo-module';
import { gql } from '../src/gql';
import { QueryRef } from '../src/query-ref';

describe('public api', () => {
  test('should export Apollo', () => {
    expect(api.Apollo).toBe(Apollo);
  });
  test('should export QueryRef', () => {
    expect(api.QueryRef).toBe(QueryRef);
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
});
