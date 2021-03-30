import {execute, ApolloLink, gql} from '@apollo/client/core';

import {buildOperationForLink} from './utils';
import {ApolloTestingBackend} from '../src/backend';

const testQuery = gql`
  query allHeroes {
    heroes {
      name
    }
  }
`;

describe('TestOperation', () => {
  let mock: ApolloTestingBackend;
  let link: ApolloLink;

  beforeEach(() => {
    mock = new ApolloTestingBackend();
    link = new ApolloLink((op) =>
      mock.handle({
        ...op,
        clientName: 'default',
      }),
    );
  });

  test('accepts a null body', (done) => {
    const operation = buildOperationForLink(testQuery, {});

    execute(link, operation as any).subscribe((result: any) => {
      expect(result).toBeNull();
      done();
    });

    mock.expectOne(testQuery).flush(null);
  });

  test('should accepts data for flush operation', (done) => {
    const operation = buildOperationForLink(testQuery, {});

    execute(link, operation as any).subscribe((result: any) => {
      expect(result).toEqual({
        data: {
          heroes: [],
        },
      });

      done();
    });

    mock.expectOne(testQuery).flushData({
      heroes: [],
    });
  });
});
