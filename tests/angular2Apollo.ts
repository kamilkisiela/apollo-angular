import {
  it, describe, expect
} from 'angular2/testing';

import {
  Provider, Injector,
} from 'angular2/core';

import ApolloClient from 'apollo-client';

import {
  APOLLO_PROVIDERS,
} from '../src';

import {
  Angular2Apollo,
  defaultApolloClient,
  angularApolloClient,
} from '../src/angular2Apollo';

describe('angular2Apollo', () => {
  const client = new ApolloClient();

  describe('Angular2Apollo', () => {
    describe('watchQuery()', () => {
      it('should call same method on client with same args and return it', () => {
        const result = 'result';
        const query = 'query';

        spyOn(client, 'watchQuery').and.returnValue(result);

        const injector = Injector.resolveAndCreate([defaultApolloClient(client), APOLLO_PROVIDERS]);
        const service = injector.get(Angular2Apollo);

        expect(service.watchQuery(query)).toBe(result);
        expect(client.watchQuery).toHaveBeenCalledWith(query);
      });
    });
  });
  describe('defaultApolloClient', () => {
    it('should create a provider', () => {
      const provider = defaultApolloClient(client);
      expect(provider).toBeAnInstanceOf(Provider);
    });

    it('should set a AngularApolloClient', () => {
      const injector = Injector.resolveAndCreate([defaultApolloClient(client)]);
      expect(injector.get(angularApolloClient)).toBe(client);
    });
  });
});
