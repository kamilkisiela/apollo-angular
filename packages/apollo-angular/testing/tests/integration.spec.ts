import {setupAngular} from './_setup';
import {Apollo, InMemoryCache} from 'apollo-angular';
import {TestBed, inject} from '@angular/core/testing';
import {addTypenameToDocument} from '@apollo/client/utilities';
import {print} from 'graphql';

import gql from 'graphql-tag';

import {
  ApolloTestingModule,
  ApolloTestingController,
  APOLLO_TESTING_CACHE,
} from '../src';

describe('Integration', () => {
  let apollo: Apollo;
  let backend: ApolloTestingController;

  beforeAll(() => setupAngular());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });
  });

  beforeEach(inject(
    [Apollo, ApolloTestingController],
    (_apollo: Apollo, _backend: ApolloTestingController) => {
      apollo = _apollo;
      backend = _backend;
    },
  ));

  afterEach(() => {
    backend.verify();
  });

  test('should match operation based on DocumentNode', (done: jest.DoneCallback) => {
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      variables: {},
    };
    const data = {
      heroes: [
        {
          name: 'Superman',
        },
      ],
    };

    // query
    apollo.query<any>(op).subscribe({
      next: (result) => {
        expect(result.data).toMatchObject(data);
        done();
      },
      error: (e) => {
        done.fail(e);
      },
    });

    backend.expectOne(op.query).flush({data});
  });

  test('should match operation based on Operation', (done: jest.DoneCallback) => {
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
    };
    const data = {
      heroes: [
        {
          name: 'Superman',
        },
      ],
    };

    // query
    apollo.query<any>(op).subscribe({
      next: (result) => {
        expect(result.data).toMatchObject(data);
        done();
      },
      error: (e) => {
        done.fail(e);
      },
    });

    backend.expectOne(op as any).flush({data});
  });

  test('should match operation based on name', (done: jest.DoneCallback) => {
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
    };
    const data = {
      heroes: [
        {
          name: 'Superman',
        },
      ],
    };

    // query
    apollo.query<any>(op).subscribe({
      next: (result) => {
        expect(result.data).toMatchObject(data);
        done();
      },
      error: (e) => {
        done.fail(e);
      },
    });

    backend.expectOne(op.operationName).flush({data});
  });

  test('should match operation based on function', (done: jest.DoneCallback) => {
    const op = {
      query: gql`
        query heroes($first: Int!) {
          heroes(first: $first) {
            name
          }
        }
      `,
      variables: {
        first: 3,
      },
      operationName: 'heroes',
    };
    const data = {
      heroes: [
        {
          name: 'Superman',
        },
      ],
    };

    // query
    apollo.query<any>(op).subscribe({
      next: (result) => {
        expect(result.data).toMatchObject(data);
        done();
      },
      error: (e) => {
        done.fail(e);
      },
    });

    backend
      .expectOne((operation) => {
        expect(operation.operationName).toBe(op.operationName);
        expect(operation.variables).toEqual(op.variables);
        expect(print(operation.query)).toBe(print(op.query));

        return true;
      })
      .flush({data});
  });

  test('it should be able to test with fragments', (done) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({addTypename: true}),
        },
      ],
    });

    const apollo: Apollo = TestBed.get(Apollo);
    const backend: ApolloTestingController = TestBed.get(
      ApolloTestingController,
    );

    const query = gql`
      {
        heroes {
          ...fields
        }
      }
      fragment fields on Character {
        name
      }
    `;

    const op = {
      query,
    };

    const data = {
      heroes: [
        {
          name: 'Superman',
          __typename: 'Character',
        },
      ],
    };

    apollo.query<any>(op).subscribe({
      next: (result) => {
        expect(result.data).toMatchObject(data);
        done();
      },
    });

    backend.expectOne(addTypenameToDocument(query)).flush({data});
  });
});
