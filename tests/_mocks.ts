import { ApolloClient } from 'apollo-client';
import { mockNetworkInterface } from 'apollo-test-utils';

import { Apollo } from '../src/Apollo';
import { createApollo } from './_utils';

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

  return createApollo({default: client});
}
