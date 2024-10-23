import { HttpHeaders } from '@angular/common/http';
import {
  ApolloLink,
  execute,
  gql,
  Observable as LinkObservable,
} from '@apollo/client/core/index.js';
import { httpHeaders } from '../src';

const query = gql`
  query heroes {
    heroes {
      name
      __typename
    }
  }
`;
const data = { heroes: [{ name: 'Foo', __typename: 'Hero' }] };

describe('httpHeaders', () => {
  test('should turn object into HttpHeaders', (done: jest.DoneCallback) => {
    const headersLink = httpHeaders();

    const mockLink = new ApolloLink(operation => {
      const { headers } = operation.getContext();

      expect(headers instanceof HttpHeaders).toBe(true);
      expect(headers.get('Authorization')).toBe('Bearer Foo');

      return LinkObservable.of({ data });
    });

    const link = headersLink.concat(mockLink);

    execute(link, {
      query,
      context: {
        headers: {
          Authorization: 'Bearer Foo',
        },
      },
    }).subscribe(result => {
      expect(result.data).toEqual(data);
      done();
    });
  });

  test('should not set headers when not defined', (done: jest.DoneCallback) => {
    const headersLink = httpHeaders();

    const mockLink = new ApolloLink(operation => {
      const { headers } = operation.getContext();

      expect(headers).toBeUndefined();

      return LinkObservable.of({ data });
    });

    const link = headersLink.concat(mockLink);

    execute(link, {
      query,
    }).subscribe(result => {
      expect(result.data).toEqual(data);
      done();
    });
  });
});
