import {
  Provider, ReflectiveInjector,
} from '@angular/core';

import {
  mockClient,
} from './_mocks';

import {
  APOLLO_PROVIDERS,
} from '../src/index';

import {
  Angular2Apollo,
  defaultApolloClient,
  angularApolloClient,
} from '../src/angular2Apollo';

import {
  ApolloQueryObservable,
} from '../src/apolloQueryObservable';

import ApolloClient from 'apollo-client';

import gql from 'graphql-tag';

const query = gql`
  query heroes {
    allHeroes {
      heroes {
        name
      }
    }
  }
`;

const data = {
  allHeroes: {
    heroes: [{ name: 'Mr Foo' }, { name: 'Mr Bar' }],
  },
};

const client = mockClient({
  request: { query },
  result: { data },
});

describe('angular2Apollo', () => {
  describe('Angular2Apollo', () => {
    let angular2Apollo;

    beforeEach(() => {
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(client), APOLLO_PROVIDERS]);
      angular2Apollo = injector.get(Angular2Apollo);
    });

    describe('watchQuery()', () => {
      it('should be called with the same options', () => {
        const options = { query };

        spyOn(client, 'watchQuery').and.callThrough();

        angular2Apollo.watchQuery(options);

        expect(client.watchQuery).toHaveBeenCalledWith(options);
      });

      describe('result', () => {
        let obs;

        beforeEach(() => {
          obs = angular2Apollo.watchQuery({ query });
        });

        it('should return the ApolloQueryObserable', () => {
          expect(obs instanceof ApolloQueryObservable).toEqual(true);
        });
      });
    });

    describe('mutate()', () => {
      it('should be called with the same options', () => {
        const options = {mutation: '', variables: {}};

        spyOn(client, 'mutate').and.returnValue('return');

        angular2Apollo.mutate(options);

        expect(client.mutate).toHaveBeenCalledWith(options);
      });
    });
  });

  describe('defaultApolloClient', () => {
    it('should create a provider', () => {
      const provider = defaultApolloClient(client);
      expect(provider instanceof Provider).toBe(true);
    });

    it('should set a AngularApolloClient', () => {
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(client)]);
      expect(injector.get(angularApolloClient)).toBe(client);
    });
  });
});
