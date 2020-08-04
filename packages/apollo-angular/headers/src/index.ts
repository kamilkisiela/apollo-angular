import {HttpHeaders} from '@angular/common/http';
import {ApolloLink, Operation, NextLink} from '@apollo/client/core';

export const httpHeaders = () => {
  return new ApolloLink((operation: Operation, forward: NextLink) => {
    const {getContext, setContext} = operation;
    const context = getContext();

    if (context.headers) {
      setContext({
        ...context,
        headers: new HttpHeaders(context.headers),
      });
    }

    return forward(operation);
  });
};
