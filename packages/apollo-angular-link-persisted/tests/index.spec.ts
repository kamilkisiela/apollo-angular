import {ApolloLink, execute, Observable, Operation} from 'apollo-link';

import gql from 'graphql-tag';

import {createPersistedQueryLink} from '../src';

const query = gql`
  query heroes {
    heroes {
      name
      __typename
    }
  }
`;
const data = {heroes: [{name: 'Foo', __typename: 'Hero'}]};

class MockLink extends ApolloLink {
  public showNotFound: boolean = true;

  public requester(_: any): any {
    return this.showNotFound
      ? {
          errors: [{message: 'PersistedQueryNotFound'}],
        }
      : data;
  }

  // imitate apollo-angular-link-http
  public request(operation: Operation) {
    return new Observable(observer => {
      const request: any = {};

      if (operation.getContext().includeQuery) {
        request.query = operation.query;
      }

      if (operation.getContext().includeExtensions) {
        request.extensions = operation.extensions;
      }

      observer.next(this.requester(request));
    });
  }
}

describe('createPersistedQueryLink', () => {
  test('transform includeQuery and includeExtensions and has persistedQuery', (done: jest.DoneCallback) => {
    const execLink = new MockLink();
    const spyRequest = jest.spyOn(execLink, 'request').mock;
    const spyRequester = jest.spyOn(execLink, 'requester').mock;
    const link = createPersistedQueryLink().concat(execLink);

    execute(link, {
      query,
    }).subscribe(() => {
      const firstReq = spyRequester.calls[0][0] as any;
      const secondOp = spyRequest.calls[1][0] as Operation;
      const secondReq = spyRequester.calls[1][0] as any;
      const secondContext = secondOp.getContext();

      // should send a query only in the first request
      expect(firstReq.query).not.toBeDefined();
      expect(secondReq.query).toBeDefined();

      // should send hash in extension
      expect(secondOp.extensions.persistedQuery.sha256Hash).toBeDefined();

      // should be compatible with apollo-angular-link-http
      expect(secondContext.includeQuery).toEqual(
        secondContext.http.includeQuery,
      );
      expect(secondContext.includeExtensions).toEqual(
        secondContext.http.includeExtensions,
      );

      // end
      done();
    });
  });
});
