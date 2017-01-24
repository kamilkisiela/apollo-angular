import { Provider } from '@angular/core';
import { ApolloClient } from 'apollo-client';

import { ApolloConfigWrapper, ApolloConfig, ClientWrapper } from './types';
import { APOLLO_CONFIG_WRAPPER, APOLLO_CONFIG } from './tokens';

export function getApolloConfig(configWrapper: ApolloConfigWrapper): ApolloConfig {
  const config = configWrapper();

  if (config instanceof ApolloClient) {
    return {default: config};
  }

  return config;
}

export function provideApolloConfig(configWrapper: ApolloConfigWrapper | ClientWrapper): Provider {
  return [{
    provide: APOLLO_CONFIG_WRAPPER,
    useValue: configWrapper,
  }, {
    provide: APOLLO_CONFIG,
    useFactory: getApolloConfig,
    deps: [APOLLO_CONFIG_WRAPPER],
  }];
}

