import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApolloLink, Observable, RequestHandler, Operation } from 'apollo-link';
import { print } from 'graphql/language/printer';
import { ExecutionResult } from 'graphql';

import { Options } from './types';
import { HttpLinkOptions } from './tokens';

@Injectable()
export class HttpLink extends ApolloLink {
  httpClient: HttpClient;
  public requester: RequestHandler;
  private options: Options;

  constructor(
    httpClient: HttpClient,
    @Optional() @Inject(HttpLinkOptions) options: Options
  ) {
    super();

    // set options that has been defined at NgModule level
    this.options = options;

    this.requester = new ApolloLink(
      (operation: Operation) =>
        new Observable((observer: any) => {
          const { operationName, variables, query } = operation;
          const body = {
            operationName,
            variables,
            query: print(query),
          };

          const obs = httpClient.post<Object>(this.options.uri, body, {
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
            }
          });

            return () => {
              if (!sub.closed) {
                sub.unsubscribe();
              }
            };
          })
      ).request;
  }

  public create(opts: Options): HttpLink {
    // XXX we have to allow for creating multiple HttpLinks
    if (this.options) {
      throw new Error('HttpLink has been alread created');
    }

    this.options = opts;

    return this;
  }

  public request(op: Operation): Observable<ExecutionResult> | null {
    return this.requester(op);
  }
}
