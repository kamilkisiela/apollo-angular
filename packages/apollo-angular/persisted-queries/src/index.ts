import { setContext } from '@apollo/client/link/context';
import { ApolloLink } from '@apollo/client/link/core';
import { createPersistedQueryLink as _createPersistedQueryLink } from '@apollo/client/link/persisted-queries';

export type Options = Parameters<typeof _createPersistedQueryLink>[0];

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

export const createPersistedQueryLink = (options: Options) =>
  ApolloLink.from([_createPersistedQueryLink(options), transformLink as any]);
