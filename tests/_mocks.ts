import { ApolloClient } from 'apollo-client';
import { mockNetworkInterface } from 'apollo-test-utils';

export function mockClient(...args): ApolloClient {
  const networkInterface = mockNetworkInterface(...args);

  return new ApolloClient({
    networkInterface,
    addTypename: false,
    dataIdFromObject: o => o['id'],
  });
}
