import { ApolloClient } from 'apollo-client';

export type ApolloConfig = {[name: string]: ApolloClient};
export type ClientWrapper = () => ApolloClient;
export type ApolloConfigWrapper = () => ApolloConfig;

