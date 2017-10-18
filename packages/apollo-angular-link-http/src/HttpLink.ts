import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {ApolloLink, Observable, RequestHandler, Operation} from 'apollo-link';
import {print} from 'graphql/language/printer';
import {ExecutionResult} from 'graphql';

import {Options, Body} from './types';
import {normalizeUrl, mergeHeaders} from './utils';

// XXX find a better name for it
export class HttpLinkHandler extends ApolloLink {
  public requester: RequestHandler;
  private options: Options;

  constructor(httpClient: HttpClient, options: Options) {
    super();

    this.options = options;

    this.requester = new ApolloLink(
      (operation: Operation) =>
        new Observable((observer: any) => {
          const {
            headers,
            withCredentials,
          }: {
            headers?: HttpHeaders;
            withCredentials?: boolean;
          } = operation.getContext();

          const {operationName, variables, query, extensions} = operation;

          const body: Body = {
            operationName,
            variables,
            query: print(query),
          };

          const postOptions = {
            withCredentials: this.options.withCredentials,
            headers: this.options.headers,
          };

          if (this.options.includeExtensions) {
            body.extensions = extensions;
          }

          if (typeof withCredentials !== 'undefined') {
            postOptions.withCredentials = withCredentials;
          }

          // merge headers
          if (headers) {
            postOptions.headers = mergeHeaders(postOptions.headers, headers);
          }

          const endpointURI = normalizeUrl(this.options.uri);
          const defaultURI = 'graphql';

          const obs = httpClient.post<Object>(endpointURI || defaultURI, body, {
            observe: 'response',
            responseType: 'json',
            reportProgress: false,
            ...postOptions,
          });

          const sub = obs.subscribe({
            next: (result: HttpResponse<any>) => {
              observer.next(result.body);
            },
            error: (err: Error) => {
              observer.error(err);
            },
            complete: () => {
              observer.complete();
            },
          });

          return () => {
            if (!sub.closed) {
              sub.unsubscribe();
            }
          };
        }),
    ).request;
  }

  public request(op: Operation): Observable<ExecutionResult> | null {
    return this.requester(op);
  }
}

@Injectable()
export class HttpLink {
  constructor(private httpClient: HttpClient) {}

  public create(options: Options): HttpLinkHandler {
    return new HttpLinkHandler(this.httpClient, options);
  }
}
