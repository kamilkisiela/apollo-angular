import {setupAngular} from './_setup';
import {ApolloModule, Apollo} from 'apollo-angular';
import {TestBed, inject, async} from '@angular/core/testing';

import gql from 'graphql-tag';

import {ApolloTestingModule, ApolloTestingController} from '../src';

describe('Integration', () => {
  beforeAll(() => setupAngular());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloModule, ApolloTestingModule],
    });
  });

  afterEach(
    inject([ApolloTestingController], (backend: ApolloTestingController) => {
      backend.verify();
    }),
  );

  test('should with in Apollo', (done: jest.DoneCallback) => {
    inject(
      [Apollo, ApolloTestingController],
      (apollo: Apollo, backend: ApolloTestingController) => {
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
          next: result => {
            expect(result.data).toMatchObject(data);
            done();
          },
          error: e => {
            done.fail(e);
          },
        });

        backend.expectOne(op.query).flush({data});
      },
    );
  });
});
