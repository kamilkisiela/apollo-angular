import {Injectable} from '@angular/core';
import {ApolloLink, Observable} from 'apollo-link';
import {Apollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular-link-http';
import {withClientState} from 'apollo-link-state';
import {onError} from 'apollo-link-error';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {PresetConfig} from './types';

@Injectable()
export class ApolloBoost {
  constructor(private apollo: Apollo, private httpLink: HttpLink) {}

  public create(config: PresetConfig) {
    const cache =
      config && config.cacheRedirects
        ? new InMemoryCache({cacheRedirects: config.cacheRedirects})
        : new InMemoryCache();

    const stateLink =
      config && config.clientState
        ? withClientState({...config.clientState, cache})
        : false;

    const errorLink =
      config && config.onError
        ? onError(config.onError)
        : onError(({graphQLErrors, networkError}) => {
            if (graphQLErrors) {
              graphQLErrors.map(({message, locations, path}) =>
                // tslint:disable-next-line
                console.log(
                  `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                ),
              );
            }
            if (networkError) {
              // tslint:disable-next-line
              console.log(`[Network error]: ${networkError}`);
            }
          });

    const requestHandler =
      config && config.request
        ? new ApolloLink(
            (operation, forward) =>
              new Observable(observer => {
                let handle: any;
                Promise.resolve(operation)
                  .then(oper => config.request(oper))
                  .then(() => {
                    handle = forward(operation).subscribe({
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    });
                  })
                  .catch(observer.error.bind(observer));

                return () => {
                  if (handle) {
                    handle.unsubscribe();
                  }
                };
              }),
          )
        : false;

    const httpLink = this.httpLink.create({
      ...((config && config.httpOptions) || {}),
      uri: (config && config.uri) || '/graphql',
    });

    const link = ApolloLink.from([
      errorLink,
      requestHandler,
      stateLink,
      httpLink,
    ].filter(x => !!x) as ApolloLink[]);

    this.apollo.create({
      link,
      cache,
    });
  }
}
