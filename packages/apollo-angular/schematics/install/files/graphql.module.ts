import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS, ApolloClientOptions, InMemoryCache} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';

const uri = '<%= endpoint %>'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
