import { createNetworkInterface } from 'apollo-client';

import ApolloClient from 'apollo-client';

export const client = new ApolloClient({
  networkInterface: createNetworkInterface('/graphql', {
    credentials: 'same-origin',
  }),
});
