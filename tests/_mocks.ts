import { ApolloClient } from 'apollo-client';
import { mockNetworkInterface } from 'apollo-test-utils';
import { ReflectiveInjector } from '@angular/core';

import { Apollo, provideClientMap } from '../src/Apollo';
import { APOLLO_PROVIDERS } from '../src/ApolloModule';

export function mockClient(...args): ApolloClient {
  const networkInterface = mockNetworkInterface(...args);

  return new ApolloClient({
    networkInterface,
    addTypename: false,
    dataIdFromObject: o => o['id'],
  });
}

export function mockApollo(...args): Apollo {
  const client = mockClient(...args);

  const injector = ReflectiveInjector.resolveAndCreate([provideClientMap(() => ({
    default: client,
  })), APOLLO_PROVIDERS]);

  return injector.get(Apollo);
}
