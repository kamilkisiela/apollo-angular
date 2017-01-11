import { ApolloClient } from 'apollo-client';

import './_common';

import { ApolloModule, SelectPipe, Angular2Apollo } from '../src';
import { ApolloClientWrapper, ApolloClientInstance } from '../src/Angular2Apollo';

describe('ApolloModule', () => {
  const annotations: any[] = Reflect.getMetadata('annotations', ApolloModule);
  const metadata: any = annotations[0]; //ApolloModule['decorators'][0]['args'][0];

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
    const getClient = () => client;
    const result = ApolloModule.withClient(getClient);
    const providers = result.providers[1]; // skips APOLLO_PROVIDERS

    it('should contain ApolloModule as ngModule', () => {
      expect(result.ngModule === ApolloModule).toBe(true);
    });

    it('should provide a wrapper directly', () => {
      expect(providers[0]['provide']).toBe(ApolloClientWrapper);
      expect(providers[0]['useValue']).toBe(getClient);
    });

    it('should provide a value using factory', () => {
      const factoryResult = providers[1]['useFactory'](getClient);

      expect(providers[1]['provide']).toBe(ApolloClientInstance);
      expect(providers[1]['useFactory']).toBeDefined();
      expect(providers[1]['deps'][0]).toBe(ApolloClientWrapper);
      expect(factoryResult).toBe(client);
    });
  });
});

function include(source: any[], find: any): boolean {
  return source.some(i => i === find);
}
