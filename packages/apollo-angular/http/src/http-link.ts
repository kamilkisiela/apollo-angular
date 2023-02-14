import { print } from 'graphql';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApolloLink,
  FetchResult,
  Observable as LinkObservable,
  Operation,
} from '@apollo/client/core';
import { Body, Context, OperationPrinter, Options, Request } from './types';
import { createHeadersWithClientAwareness, fetch, mergeHeaders, prioritize } from './utils';

// XXX find a better name for it
export class HttpLinkHandler extends ApolloLink {
  public requester: (operation: Operation) => LinkObservable<FetchResult> | null;
  private print: OperationPrinter = print;

  constructor(private httpClient: HttpClient, private options: Options) {
    super();

    if (this.options.operationPrinter) {
      this.print = this.options.operationPrinter;
    }

    this.requester = (operation: Operation) =>
      new LinkObservable((observer: any) => {
        const context: Context = operation.getContext();

        // decides which value to pick, Context, Options or to just use the default
        const pick = <K extends keyof Context>(
          key: K,
          init?: Context[K] | Options[K],
        ): Context[K] | Options[K] => {
          return prioritize(context[key], this.options[key], init);
        };

        let method = pick('method', 'POST');
        const includeQuery = pick('includeQuery', true);
        const includeExtensions = pick('includeExtensions', false);
        const url = pick('uri', 'graphql');
        const withCredentials = pick('withCredentials');
        const useMultipart = pick('useMultipart');
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
          next: response => {
            operation.setContext({ response });
            observer.next(response.body);
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
}

@Injectable({
  providedIn: 'root',
})
export class HttpLink {
  constructor(private httpClient: HttpClient) {}

  public create(options: Options): HttpLinkHandler {
    return new HttpLinkHandler(this.httpClient, options);
  }
}
