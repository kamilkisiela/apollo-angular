import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  ApolloLink,
  LinkObservable,
  Operation,
  FetchResult,
} from 'apollo-angular';
import {print} from 'graphql';
import {extractFiles} from 'extract-files';
import {Options, Body, Request, Context} from './types';
import {fetch, mergeHeaders, prioritize} from './utils';

// XXX find a better name for it
export class HttpLinkHandler extends ApolloLink {
  public requester: (
    operation: Operation,
  ) => LinkObservable<FetchResult> | null;

  constructor(private httpClient: HttpClient, private options: Options) {
    super();

    this.requester = (operation: Operation) =>
      new LinkObservable((observer: any) => {
        const context: Context = operation.getContext();

        // decides which value to pick, Context, Options or to just use the default
        const pick = <K extends keyof Context | keyof Options>(
          key: K,
          init?: Context[K] | Options[K],
        ): Context[K] | Options[K] => {
          return prioritize(context[key], this.options[key], init);
        };

        const includeQuery = pick('includeQuery', true);
        const includeExtensions = pick('includeExtensions', false);
        const method = pick('method', 'POST');
        const url = pick('uri', 'graphql');
        const withCredentials = pick('withCredentials');
        const useMultipart = pick('useMultipart');

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
          (req.body as Body).query = print(operation.query);
        }

        if (context.headers) {
          req.options.headers = mergeHeaders(
            req.options.headers,
            context.headers,
          );
        }

        const sub = fetch(req, this.httpClient, extractFiles).subscribe({
          next: (response) => {
            operation.setContext({response});
            observer.next(response.body);
          },
          error: (err) => observer.error(err),
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
