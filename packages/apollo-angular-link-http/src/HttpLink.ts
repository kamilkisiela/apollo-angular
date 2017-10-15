import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ApolloLink, Observable, RequestHandler, Operation} from 'apollo-link';
import {print} from 'graphql/language/printer';
import {ExecutionResult} from 'graphql';

import {Options} from './types';
import {normalizeUrl} from './utils';

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
          const {operationName, variables, query} = operation;
          const body = {
            operationName,
            variables,
            query: print(query),
          };

          const endpointURI = normalizeUrl(this.options.uri);

          const obs = httpClient.post<Object>(endpointURI || 'graphql', body, {
            observe: 'response',
            responseType: 'json',
            reportProgress: false,
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
