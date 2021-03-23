import {gql as gqlTag, TypedDocumentNode} from '@apollo/client/core';

function typedGQLTag<Result, Variables>(
  literals: ReadonlyArray<string> | Readonly<string>,
  ...placeholders: any[]
): TypedDocumentNode<Result, Variables> {
  return gqlTag(literals, ...placeholders);
}

export const gql = typedGQLTag;
export const graphql = typedGQLTag;
