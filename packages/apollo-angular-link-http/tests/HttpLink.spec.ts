import './_common';

import gql from 'graphql-tag';

import { TestBed, inject, async } from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import { HttpClientModule, HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { execute } from 'apollo-link';
import { of } from 'rxjs/observable/of';

import { HttpLink } from '../src/HttpLink';
import { HttpLinkOptions } from '../src/tokens';

describe('HttpLink', () => {
  beforeEach(() => {
    TestBed.initTestEnvironment( BrowserDynamicTestingModule, platformBrowserDynamicTesting() );
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        HttpLink,
      ],
    });
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should use HttpClient', async(inject([HttpLink, HttpTestingController], (httpLink: HttpLink, httpBackend: HttpTestingController) => {
      const link = httpLink.create({uri: 'graphql'});
      const op = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        operationName: 'heroes',
        variables: {},
      };
      const data = {
        heroes: [{name: 'Superman'}],
      };

      execute(httpLink, op).subscribe({
        next: result => expect(result).toEqual({data}),
        error: error => {
          throw new Error('Should not be here');
        },
      });

      httpBackend.expectOne('graphql').flush({ data });
    })));
});
