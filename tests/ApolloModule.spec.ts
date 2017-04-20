import './_common';

import { NgModule } from '@angular/core';
import { ApolloClient } from 'apollo-client';

import { ApolloModule, SelectPipe, Apollo } from '../src';
import { CLIENT_MAP, CLIENT_MAP_WRAPPER } from '../src/tokens';

describe('ApolloModule', () => {
  const metadata: NgModule = Reflect.getMetadata('annotations', ApolloModule)[0];

  test('should contain SelectPipe in declarations', () => {
    expect(include(metadata.declarations, SelectPipe)).toBe(true);
  });

  test('should export SelectPipe', () => {
    expect(include(metadata.exports, SelectPipe)).toBe(true);
  });

  test('should not export Apollo', () => {
    expect(include(metadata.exports, Apollo)).toBe(false);
  });

  test('should has withClient method', () => {
    expect(ApolloModule.withClient).toBeDefined();
  });

  describe('withClient', () => {
    const client = {} as ApolloClient;
    const getClient = () => client;
    const result = ApolloModule.withClient(getClient);
    const providers = result.providers[1]; // skips APOLLO_PROVIDERS

    test('should contain ApolloModule as ngModule', () => {
      expect(result.ngModule === ApolloModule).toBe(true);
    });

    test('should provide a wrapper directly', () => {
      expect(providers[0]['provide']).toBe(CLIENT_MAP_WRAPPER);
      expect(providers[0]['useValue']).toBe(getClient);
    });

    test('should provide a value using factory', () => {
      const factoryResult = providers[1]['useFactory'](getClient);

      expect(providers[1]['provide']).toBe(CLIENT_MAP);
      expect(providers[1]['useFactory']).toBeDefined();
      expect(providers[1]['deps'][0]).toBe(CLIENT_MAP_WRAPPER);
      expect(factoryResult).toBe(client);
    });
  });

  describe('forRoot', () => {
    const defaultClient = {} as ApolloClient;
    const extraClient = {} as ApolloClient;
    const getClients = () => ({
      default: defaultClient,
      extra: extraClient,
    });
    const result = ApolloModule.forRoot(getClients);
    const providers = result.providers[1]; // skips APOLLO_PROVIDERS

    test('should contain ApolloModule as ngModule', () => {
      expect(result.ngModule === ApolloModule).toBe(true);
    });

    test('should provide a wrapper directly', () => {
      expect(providers[0]['provide']).toBe(CLIENT_MAP_WRAPPER);
      expect(providers[0]['useValue']).toBe(getClients);
    });

    test('should provide a value using factory', () => {
      const factoryResult = providers[1]['useFactory'](getClients);

      expect(providers[1]['provide']).toBe(CLIENT_MAP);
      expect(providers[1]['useFactory']).toBeDefined();
      expect(providers[1]['deps'][0]).toBe(CLIENT_MAP_WRAPPER);
      expect(factoryResult).toEqual({
        default: defaultClient,
        extra: extraClient,
      });
    });
  });
});

function include(source: any[], find: any): boolean {
  return source.some(i => i === find);
}
