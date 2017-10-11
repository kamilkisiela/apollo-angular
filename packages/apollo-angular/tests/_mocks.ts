import { ApolloClient } from 'apollo-client';
import {
  mockNetworkInterface,
  mockSubscriptionNetworkInterface,
  MockedSubscription,
  MockedResponse,
} from 'apollo-test-utils';

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

export function mockClientWithSub(mSubs: MockedSubscription[], mRes: MockedResponse[]): ApolloClient {
  const networkInterface = mockSubscriptionNetworkInterface(mSubs, ...mRes);

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

export function mockApolloWithSub(mSubs: MockedSubscription[], mRes: MockedResponse[]): Apollo {
  const client = mockClientWithSub(mSubs, mRes);

  return createApollo({default: client});
}
