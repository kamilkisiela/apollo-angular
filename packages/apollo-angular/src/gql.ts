import { gql as gqlTag, TypedDocumentNode } from '@apollo/client/core/index.js';

const typedGQLTag: <Result, Variables>(
  literals: ReadonlyArray<string> | Readonly<string>,
  ...placeholders: any[]
) => TypedDocumentNode<Result, Variables> = gqlTag;

export const gql = typedGQLTag;

/**
 * @deprecated Instead, use `import {gql as graphql} from 'apollo-angular';`. Because different exports for the same thing will increase the final bundle size.
 */
export const graphql = typedGQLTag;
