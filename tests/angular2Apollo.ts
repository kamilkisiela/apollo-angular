import {
  it, describe, expect
} from 'angular2/testing';

import {
  Provider, Injector,
} from 'angular2/core';

import ApolloClient from 'apollo-client';

import {
  APOLLO_PROVIDERS,
} from '../src/index';

import {
  Angular2Apollo,
  defaultApolloClient,
  angularApolloClient,
} from '../src/angular2Apollo';

describe('angular2Apollo', () => {
  const client = new ApolloClient();

  describe('Angular2Apollo', () => {
    /**
     * Gets Angular2Apollo service and calls a method
     *
     * Checks if method with the same name has been called
     * with the same same options
     *
     * It also checks if service method returns result of ApolloClient method
     *
     * @param  {string} method  Name of method you want to test
     * @param  {any} options    Used options
     * @param  {any} result     Mock result
     */
    function rawApiCall(method: string, options = 'options', result = 'result') {
      spyOn(client, method).and.returnValue(result);

      const injector = Injector.resolveAndCreate([defaultApolloClient(client), APOLLO_PROVIDERS]);
      const service = injector.get(Angular2Apollo);

      expect(service[method](options)).toBe(result);
      expect(client[method]).toHaveBeenCalledWith(options);
    }

    describe('watchQuery()', () => {
      it('should call same method on client with same args and return it', () => {
        rawApiCall('watchQuery');
      });
    });

    describe('mutate()', () => {
      it('should call same method on client with same args and return it', () => {
        rawApiCall('mutate');
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
