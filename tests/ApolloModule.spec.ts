import { ApolloClient } from 'apollo-client';

import './_common';

import { ApolloModule, SelectPipe, Angular2Apollo } from '../src';
import { AngularApolloClient } from '../src/Angular2Apollo';

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

  it('should has withClient method', () => {
    expect(ApolloModule.withClient).toBeDefined();
  });

  describe('withClient', () => {
    const client = {} as ApolloClient;
    const result = ApolloModule.withClient(client);

    it('should contain ApolloModule as ngModule', () => {
      expect(result.ngModule).toBe(ApolloModule);
    });

    it('should contain provider with useValue', () => {
      expect(result.providers[1]['useValue']).toBe(client);
    });

    it('should contain provider that provide AngularApolloClient', () => {
      expect(result.providers[1]['provide']).toBe(AngularApolloClient);
    });
  });
});

function include(source: any[], find: any): boolean {
  return source.some(i => i === find);
}
