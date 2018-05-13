import {ApolloModule, Apollo} from 'apollo-angular';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {NgModule} from '@angular/core';

import {ApolloTestingController} from './controller';
import {ApolloTestingBackend} from './backend';

@NgModule({
  imports: [ApolloModule],
  providers: [
    ApolloTestingBackend,
    {provide: ApolloTestingController, useExisting: ApolloTestingBackend},
  ],
})
export class ApolloTestingModule {
  constructor(apollo: Apollo, backend: ApolloTestingBackend) {
    const link = new ApolloLink(operation => backend.handle(operation));
    const cache = new InMemoryCache({
      addTypename: false,
    });

    apollo.create({link, cache});
  }
}
