import {HttpHeaders} from '@angular/common/http';

export type HttpRequestOptions = {
  headers?: HttpHeaders;
  withCredentials?: boolean;
};

export type FetchOptions = {
  method?: string;
} & HttpRequestOptions;

export type Options = {
  uri?: string;
  includeExtensions?: boolean;
} & FetchOptions;

export type Body = {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
  context?: Record<string, any> | Context;
  extensions?: Record<string, any>;
};

export type Context = {} & FetchOptions;

export type Request = {
  method: string;
  url: string;
  body: Body;
  options: HttpRequestOptions;
};
