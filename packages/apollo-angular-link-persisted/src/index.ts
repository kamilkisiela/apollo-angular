import {DocumentNode} from 'graphql';
import {ApolloLink} from 'apollo-link';
import {setContext} from 'apollo-link-context';
import {
  createPersistedQueryLink as _createPersistedQueryLink,
  ErrorResponse,
} from 'apollo-link-persisted-queries';

export interface Options {
  generateHash?: ((document: DocumentNode) => string);
  disable?: ((error: ErrorResponse) => boolean);
  useGETForHashedQueries?: boolean;
}

const transformLink = setContext((_, context) => {
  const ctx: any = {};

  if (context.http) {
    ctx.includeQuery = context.http.includeQuery;
    ctx.includeExtensions = context.http.includeExtensions;
  }

  if (context.fetchOptions && context.fetchOptions.method) {
    ctx.method = context.fetchOptions.method;
  }

  return ctx;
});

export const createPersistedQueryLink = (options?: Options) =>
  // XXX: `as any` because the original package has different version of ApolloLink
  ApolloLink.from([_createPersistedQueryLink(options), transformLink as any]);
