import {HttpHeaders} from '@angular/common/http';

export type Options = {
  uri?: string;
  includeExtensions?: boolean;
  withCredentials?: boolean;
  headers?: HttpHeaders;
};

export type Body = {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
  context?: Record<string, any>;
  extensions?: Record<string, any>;
};
