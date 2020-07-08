import './_setup';

import * as api from '../src';

import {Apollo} from '../src/apollo';
import {SelectPipe} from '../src/select-pipe';
import {QueryRef} from '../src/query-ref';
import {ApolloModule} from '../src/apollo-module';

describe('public api', () => {
  test('should export Apollo', () => {
    expect(api.Apollo).toBe(Apollo);
  });

  test('should export ApolloModule', () => {
    expect(api.ApolloModule).toBe(ApolloModule);
  });

  test('should export SelectPipe', () => {
    expect(api.SelectPipe).toBe(SelectPipe);
  });

  test('should export QueryRef', () => {
    expect(api.QueryRef).toBe(QueryRef);
  });
});
