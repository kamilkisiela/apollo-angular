import { ApolloClient } from 'apollo-client';
import { Injectable, Inject, Provider } from '@angular/core';

import { APOLLO_CONFIG } from './tokens';
import { ApolloConfig } from './types';

@Injectable()
export class ApolloClientMap {
  public static defaultName: string = '__default';
  private config: ApolloConfig = {};

  constructor(
    @Inject(APOLLO_CONFIG) config: ApolloConfig,
  ) {
    this.set(config);
  }

  public default(): ApolloClient {
    return this.get(ApolloClientMap.defaultName);
  }

  public get(name: string): ApolloClient {
    return this.config[name];
  }

  public add(name: string, client: ApolloClient): void {
    this.config[name] = client;
  }

  public set(config: ApolloConfig) {
    for (const name in config) {
      if (typeof name === 'string') {
        this.config[name] = config[name];
      }
    }
  }
}

export const provideApolloClientMap: Provider = {
  provide: ApolloClientMap,
  useClass: ApolloClientMap,
};
