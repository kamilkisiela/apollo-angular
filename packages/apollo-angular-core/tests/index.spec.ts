import './_setup';

import * as api from '../src';

import {Apollo} from '../src/Apollo';
import {SelectPipe} from '../src/SelectPipe';
import {QueryRef} from '../src/QueryRef';
import {ApolloModule} from '../src/ApolloModule';

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
