import { DocumentNode } from 'graphql';
import { HttpContext, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FetchResult, Operation } from '@apollo/client/core';

export type HttpRequestOptions = {
  headers?: HttpHeaders;
  context?: HttpContext;
  withCredentials?: boolean;
  useMultipart?: boolean;
  observe?: 'body' | 'events' | 'response';
  reportProgress?: boolean;
  responseType?: 'json' | 'arraybuffer' | 'blob' | 'text';
  params?: any;
  body?: any;
};

export type HttpClientReturn =
  | Object
  | ArrayBuffer
  | Blob
  | string
  | HttpResponse<Object | ArrayBuffer | Blob | string>
  | HttpEvent<Object | ArrayBuffer | Blob | string>;

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
  extractFiles?: ExtractFiles;
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

export type ExtractedFiles = {
  clone: unknown;
  files: Map<any, any>;
};

export type ExtractFiles = (body: Body | Body[]) => ExtractedFiles;

export type BatchOptions = {
  batchMax?: number;
  batchInterval?: number;
  batchKey?: (operation: Operation) => string;
} & Options;
