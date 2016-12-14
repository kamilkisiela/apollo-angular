import './_common';

import { ApolloModule, SelectPipe, Angular2Apollo } from '../src';

describe('ApolloModule', () => {
  let metadata: any = ApolloModule['decorators'][0]['args'][0];

  it('should contain SelectPipe in declarations', () => {
    expect(include(metadata.declarations, SelectPipe)).toBe(true);
  });

  it('should export SelectPipe', () => {
    expect(include(metadata.exports, SelectPipe)).toBe(true);
  });

  it('should not export Angular2Apollo', () => {
    expect(include(metadata.exports, SelectPipe)).toBe(true);
  });

  it('should contain Angular2Apollo in providers', () => {
    expect(include(metadata.exports, Angular2Apollo)).toBe(false);
  });
});

function include(source: any[], find: any): boolean {
  return source.some(i => i === find);
}
