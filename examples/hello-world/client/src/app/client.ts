import { ApolloClient, createNetworkInterface } from 'apollo-client';

export default new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: '/graphql',
    opts: {
      credentials: 'same-origin',
    },
  }),
});

