import { print } from 'graphql';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApolloLink,
  FetchResult,
  Observable as LinkObservable,
  Operation,
} from '@apollo/client/core';
import { pick } from './http-batch-link';
import { Body, Context, HttpClientReturn, OperationPrinter, Options, Request } from './types';
import { createHeadersWithClientAwareness, fetch, mergeHeaders } from './utils';

// XXX find a better name for it
export class HttpLinkHandler extends ApolloLink {
  public requester: (operation: Operation) => LinkObservable<FetchResult> | null;
  private print: OperationPrinter = print;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly options: Options,
  ) {
    super();

    if (this.options.operationPrinter) {
      this.print = this.options.operationPrinter;
    }

    this.requester = (operation: Operation) =>
      new LinkObservable((observer: any) => {
        const context: Context = operation.getContext();

        let method = pick(context, this.options, 'method');
        const includeQuery = pick(context, this.options, 'includeQuery');
        const includeExtensions = pick(context, this.options, 'includeExtensions');
        const url = pick(context, this.options, 'uri');
        const withCredentials = pick(context, this.options, 'withCredentials');
        const useMultipart = pick(context, this.options, 'useMultipart');
        const useGETForQueries = this.options.useGETForQueries === true;

        const isQuery = operation.query.definitions.some(
          def => def.kind === 'OperationDefinition' && def.operation === 'query',
        );

        if (useGETForQueries && isQuery) {
          method = 'GET';
        }

        const req: Request = {
          method,
          url: typeof url === 'function' ? url(operation) : url,
          body: {
            operationName: operation.operationName,
            variables: operation.variables,
          },
          options: {
            withCredentials,
            useMultipart,
            headers: this.options.headers,
            observe: context.observe,
            reportProgress: context.reportProgress,
            responseType: context.responseType,
          },
        };

        if (includeExtensions) {
          (req.body as Body).extensions = operation.extensions;
        }

        if (includeQuery) {
          (req.body as Body).query = this.print(operation.query);
        }

        const headers = createHeadersWithClientAwareness(context);

        req.options.headers = mergeHeaders(req.options.headers, headers);

        const sub = fetch(req, this.httpClient, this.options.extractFiles).subscribe({
          next: (response: HttpClientReturn) => {
            operation.setContext({ response });

            if (
              context.responseType === 'blob' ||
              context.responseType === 'arraybuffer' ||
              context.responseType === 'text'
            ) {
              observer.next(response);
              return;
            }

            if (response instanceof HttpResponse) {
              observer.next(response.body);
            } else if (this.isHttpEvent(response)) {
              this.handleHttpEvent(response, observer);
            } else {
              observer.next(response);
            }
          },
          error: err => observer.error(err),
          complete: () => observer.complete(),
        });

        return () => {
          if (!sub.closed) {
            sub.unsubscribe();
          }
        };
      });
  }

  public request(op: Operation): LinkObservable<FetchResult> | null {
    return this.requester(op);
  }

  private isHttpEvent(response: HttpClientReturn): response is HttpEvent<any> {
    return typeof response === 'object' && response !== null && 'type' in response;
  }

  private handleHttpEvent(event: HttpEvent<any>, observer: any) {
    switch (event.type) {
      case HttpEventType.Response:
        if (event instanceof HttpResponse) {
          observer.next(event.body);
        }
        break;
      case HttpEventType.DownloadProgress:
      case HttpEventType.UploadProgress:
        observer.next({
          data: null,
          extensions: {
            httpEvent: {
              type: event.type,
              loaded: 'loaded' in event ? event.loaded : undefined,
              total: 'total' in event ? event.total : undefined,
            },
          },
        });
        break;
      default:
        observer.next({
          data: null,
          extensions: {
            httpEvent: {
              type: event.type,
            },
          },
        });
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class HttpLink {
  constructor(private readonly httpClient: HttpClient) {}

  public create(options: Options): HttpLinkHandler {
    return new HttpLinkHandler(this.httpClient, options);
  }
}
