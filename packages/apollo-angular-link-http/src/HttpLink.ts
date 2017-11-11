import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpParams} from '@angular/common/http';
import {
  ApolloLink,
  Observable as LinkObservable,
  RequestHandler,
  Operation,
} from 'apollo-link';
import {print} from 'graphql/language/printer';
import {ExecutionResult} from 'graphql';
import {Observable} from 'rxjs/Observable';

import {Options, Request, Context} from './types';
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
        new LinkObservable((observer: any) => {
          const {
            headers,
            withCredentials,
            method,
            uri,
          }: Context = operation.getContext();

          const {operationName, variables, query, extensions} = operation;

          const req: Request = {
            method: method || this.options.method || 'POST',
            url: normalizeUrl(uri || this.options.uri) || 'graphql',
            body: {
              operationName,
              variables,
              query: print(query),
            },
            options: {
              withCredentials: this.options.withCredentials,
              headers: this.options.headers,
            },
          };

          // allow for sending extensions
          if (this.options.includeExtensions) {
            req.body.extensions = extensions;
          }

          // Apply settings from request's context

          // overwrite withCredentials
          if (typeof withCredentials !== 'undefined') {
            req.options.withCredentials = withCredentials;
          }
          // merge headers
          if (headers) {
            req.options.headers = mergeHeaders(req.options.headers, headers);
          }

          // `body` for some, `params` for others
          const useBody = ['POST', 'PUT', 'PATCH'].includes(
            req.method.toUpperCase(),
          );
          let bodyOrParams = {};

          if (useBody) {
            bodyOrParams = {
              body: req.body,
            };
          } else {
            const params = Object.keys(req.body).reduce((httpParams, param) => {
              let val = (req.body as any)[param];
              if (['variables', 'extensions'].includes(param)) {
                val = JSON.stringify(val);
              }
              return httpParams.set(param, val);
            }, new HttpParams());

            bodyOrParams = {params};
          }

          // create a request
          const obs: Observable<HttpResponse<Object>> = httpClient.request<
            Object
          >(req.method, req.url, {
            observe: 'response',
            responseType: 'json',
            reportProgress: false,
            ...bodyOrParams,
            ...req.options,
          });

          const sub = obs.subscribe({
            next: result => observer.next(result.body),
            error: err => observer.error(err),
            complete: () => observer.complete(),
          });

          return () => {
            if (!sub.closed) {
              sub.unsubscribe();
            }
          };
        }),
    ).request;
  }

  public request(op: Operation): LinkObservable<ExecutionResult> | null {
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
