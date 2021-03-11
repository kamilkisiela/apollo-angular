import {DocumentNode} from 'graphql';
import {HttpHeaders} from '@angular/common/http';
import {Operation} from '@apollo/client/core';

export type HttpRequestOptions = {
  headers?: HttpHeaders;
  withCredentials?: boolean;
  useMultipart?: boolean;
};

export type URIFunction = (operation: Operation) => string;

export type FetchOptions = {
  method?: string;
  uri?: string | URIFunction;
  includeExtensions?: boolean;
  includeQuery?: boolean;
};

export type OperationPrinter = (operation: DocumentNode) => string;

export interface Options extends FetchOptions, HttpRequestOptions {
  operationPrinter?: OperationPrinter;
  useGETForQueries?: boolean;
}

export type Body = {
  query?: string;
  variables?: Record<string, any>;
  operationName?: string;
  extensions?: Record<string, any>;
};

export interface Context extends FetchOptions, HttpRequestOptions {}

export type Request = {
  method: string;
  url: string;
  body: Body | Body[];
  options: HttpRequestOptions;
};

export type ExtractFiles = (
  body: Body | Body[],
) => {
  clone: Body;
  files: Map<any, any>;
};

export type BatchOptions = {
  batchMax?: number;
  batchInterval?: number;
  batchKey?: (operation: Operation) => string;
} & Options;
