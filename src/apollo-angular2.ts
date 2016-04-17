import ApolloClient, {createNetworkInterface} from "apollo-client/lib/src/index";
import {Provider} from 'angular2/core';

export class ApolloAngular2 {
  constructor() {

  }

  createNetworkInterface(graphQlEndpoint:string, options?:any):ApolloClient {
    const networkInterface = createNetworkInterface(graphQlEndpoint, options);

    return new ApolloClient({
      networkInterface
    });
  }
}

export let APOLLO_ANGULAR2_PROVIDERS:any[] = [
  new Provider(ApolloAngular2, {useClass: ApolloAngular2})
];