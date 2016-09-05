import { createNetworkInterface } from 'apollo-client';

import ApolloClient from 'apollo-client';

export const client = new ApolloClient({
  networkInterface: createNetworkInterface('http://localhost:4300/graphql', {
    credentials: 'same-origin',
  }),
});
