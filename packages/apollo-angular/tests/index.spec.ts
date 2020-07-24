import './_setup';

import * as api from '../src';

import {Apollo} from '../src/apollo';
import {QueryRef} from '../src/query-ref';

describe('public api', () => {
  test('should export Apollo', () => {
    expect(api.Apollo).toBe(Apollo);
  });
  test('should export QueryRef', () => {
    expect(api.QueryRef).toBe(QueryRef);
  });
});
