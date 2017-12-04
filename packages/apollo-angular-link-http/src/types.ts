import {HttpHeaders} from '@angular/common/http';

export type HttpRequestOptions = {
  headers?: HttpHeaders;
  withCredentials?: boolean;
};

export type FetchOptions = {
  method?: string;
  uri?: string;
  includeExtensions?: boolean;
  includeQuery?: boolean;
};

export type Options = {} & FetchOptions & HttpRequestOptions;

export type Body = {
  query?: string;
  variables?: Record<string, any>;
  operationName?: string;
  extensions?: Record<string, any>;
};

export type Context = {} & FetchOptions & HttpRequestOptions;

export type Request = {
  method: string;
  url: string;
  body: Body;
  options: HttpRequestOptions;
};
