import {ApolloModule, Apollo} from 'apollo-angular';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloCache} from 'apollo-cache';
import {NgModule, InjectionToken, Inject, Optional} from '@angular/core';

import {ApolloTestingController} from './controller';
import {ApolloTestingBackend} from './backend';

export type NamedCaches = Record<string, ApolloCache<any> | undefined | null>;

export const APOLLO_TESTING_CACHE = new InjectionToken<ApolloCache<any>>(
  'apollo-angular/testing cache',
);

export const APOLLO_TESTING_NAMED_CACHE = new InjectionToken<NamedCaches>(
  'apollo-angular/testing named cache',
);

@NgModule({
  imports: [ApolloModule],
  providers: [
    ApolloTestingBackend,
    {provide: ApolloTestingController, useExisting: ApolloTestingBackend},
  ],
})
export class ApolloTestingModule {
  constructor(
    apollo: Apollo,
    backend: ApolloTestingBackend,
    @Optional()
    @Inject(APOLLO_TESTING_CACHE)
    cache?: ApolloCache<any>,
    @Optional()
    @Inject(APOLLO_TESTING_NAMED_CACHE)
    namedCaches?: NamedCaches,
  ) {
    function createOptions(c?: ApolloCache<any> | null) {
      return {
        link: new ApolloLink(operation => backend.handle(operation)),
        cache:
          c ||
          new InMemoryCache({
            addTypename: false,
          }),
      };
    }

    apollo.create(createOptions(cache));

    if (namedCaches && typeof namedCaches === 'object') {
      for (const name in namedCaches) {
        if (namedCaches.hasOwnProperty(name)) {
          apollo.createNamed(name, createOptions(namedCaches[name]));
        }
      }
    }
  }
}
