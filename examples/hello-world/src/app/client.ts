import { createNetworkInterface } from 'apollo-client';

import ApolloClient from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface('/graphql', {
    credentials: 'same-origin',
  }),
});


export function getClient(): ApolloClient {
  return client;
}