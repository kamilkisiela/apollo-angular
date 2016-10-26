import { ApolloClient, createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface('/graphql'/*, {
    credentials: 'same-origin',
  }*/),
});

export function getClient(): ApolloClient {
  return client;
}
