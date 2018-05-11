import {DocumentNode} from 'graphql';
import {ApolloLink} from 'apollo-link';
import {setContext} from 'apollo-link-context';
import {
  createPersistedQueryLink as _createPersistedQueryLink,
  ErrorResponse,
} from 'apollo-link-persisted-queries';

export interface Options {
  generateHash?: ((document: DocumentNode) => string) | undefined;
  disable?: ((error: ErrorResponse) => boolean) | undefined;
}

const transformLink = setContext((_, context) => {
  if (context.http) {
    return {
      includeQuery: context.http.includeQuery,
      includeExtensions: context.http.includeExtensions,
    };
  }
});

export const createPersistedQueryLink = (options?: Options) =>
  // XXX: `as any` because the original package has different version of ApolloLink
  ApolloLink.from([_createPersistedQueryLink(options), transformLink as any]);
