import {DocumentNode} from 'graphql';
import {getOperationName} from 'apollo-utilities';

export const buildOperationForLink = (
  document: DocumentNode,
  variables: any,
) => {
  return {
    query: document,
    variables,
    operationName: getOperationName(document) || undefined,
    context: {},
  };
};
