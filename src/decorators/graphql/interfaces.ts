import { Document } from 'graphql';

export interface Variables {
  [propName: string]: any;
}

export interface Options {
  variables?: Variables;
  query?: Document;
  mutation?: Document;
  [propName: string]: any;
}