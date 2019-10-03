import {ApolloModule, Apollo} from 'apollo-angular';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloCache} from 'apollo-cache';
import {NgModule, InjectionToken, Inject, Optional} from '@angular/core';

import {ApolloTestingController} from './controller';
import {ApolloTestingBackend} from './backend';

export const APOLLO_TESTING_CACHE = new InjectionToken<ApolloCache<any>>(
  'apollo-angular/testing cache',
);

export const APOLLO_TESTING_CLIENT_NAME = new InjectionToken<string>(
  'apollo-angular/testing client name',
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
    @Inject(APOLLO_TESTING_CLIENT_NAME)
    name?: string,
  ) {
    if (name) {
      apollo.create({
        link: new ApolloLink(operation => backend.handle(operation)),
        cache:
          cache ||
          new InMemoryCache({
            addTypename: false,
          }),
      }, name);
    } else {
      apollo.create({
        link: new ApolloLink(operation => backend.handle(operation)),
        cache:
          cache ||
          new InMemoryCache({
            addTypename: false,
          }),
      });
    }
  }
}
