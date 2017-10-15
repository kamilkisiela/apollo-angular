import {ApolloClient} from 'apollo-client';

export type ClientMap = {[name: string]: ApolloClient};
export type ClientWrapper = () => ApolloClient;
export type ClientMapWrapper = () => ClientMap;
