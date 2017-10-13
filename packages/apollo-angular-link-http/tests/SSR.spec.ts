import './_common';

import {
  NgModule,
  Component,
  destroyPlatform,
  getPlatform,
  Inject,
  ApplicationRef,
  CompilerFactory,
  OnInit,
} from '@angular/core';
import {
  ServerModule,
  renderModule,
  renderModuleFactory,
  INITIAL_CONFIG,
  PlatformState,
  platformDynamicServer,
} from '@angular/platform-server';
import { async, TestBed, getTestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import {
  ServerTestingModule,
  platformServerTesting,
} from '@angular/platform-server/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BrowserModule, ɵgetDOM } from '@angular/platform-browser';
import { ApolloClient } from 'apollo-client';
import { execute } from 'apollo-link';
import { filter } from 'rxjs/operator/filter';
import { first } from 'rxjs/operator/first';
import { toPromise } from 'rxjs/operator/toPromise';

import gql from 'graphql-tag';

import { HttpLink } from '../src/HttpLink';

describe('integration', () => {
  beforeEach(() => {
    if (getPlatform()) {
      destroyPlatform();
    }
  });

  describe('render', () => {
    let doc: string;
    let called: boolean;

    // Mock GraphQL endpoint
    const query = gql`
      query websiteInfo {
        website {
          status
        }
      }
    `;
    const data = {
      website: {
        status: 'online',
      },
    };

    @Component({
      selector: 'app',
      template: 'Website: {{text}}',
    })
    class AsyncServerApp {
      public text = '';

      constructor(
        private httpLink: HttpLink,
        private httpBackend: HttpTestingController
      ) {}

      public ngOnInit() {
          execute(
            this.httpLink.create({uri: 'graphql'}),
            { query }
          ).subscribe(result => {
            this.text = result.data.website.status;
          });

          this.httpBackend.expectOne('graphql').flush({data});
      }
    }

    @NgModule({
      declarations: [AsyncServerApp],
      imports: [
        BrowserModule.withServerTransition({ appId: 'async-server' }),
        ServerModule,
        HttpClientTestingModule,
      ],
      providers: [HttpLink],
      bootstrap: [AsyncServerApp],
    })
    class AsyncServerModule {
    }

    beforeEach(() => {
      doc = '<html><head></head><body><app></app></body></html>';
      called = false;
    });

    afterEach(() => {
      expect(called).toBe(true);
    });

    // XXX: Skip till we fix SSR
    test('using long form should work', async(() => {
      const platform =
        platformDynamicServer([{
          provide: INITIAL_CONFIG,
          useValue: {
            document: doc,
          },
        }]);

      platform.bootstrapModule(AsyncServerModule)
        .then((moduleRef) => {
          const applicationRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
          return toPromise.call(first.call(
            filter.call(applicationRef.isStable, (isStable: boolean) => isStable)));
        })
        .then(() => {
          const str = platform.injector.get(PlatformState).renderToString();
          expect(clearNgVersion(str)).toMatchSnapshot();
          platform.destroy();
          called = true;
        });
    }));

    // XXX: Skip till we fix SSR
    test('using renderModule should work', async(() => {
      renderModule(AsyncServerModule, { document: doc }).then(output => {
        expect(clearNgVersion(output)).toMatchSnapshot();
        called = true;
      });
    }));

    // XXX: Skip till we fix SSR
    test('using renderModuleFactory should work', async(() => {
      const platform =
      platformDynamicServer([{
        provide: INITIAL_CONFIG,
        useValue: {
          document: doc,
        },
      }]);
      const compilerFactory: CompilerFactory = platform.injector.get(CompilerFactory, null);
      const moduleFactory = compilerFactory
        .createCompiler()
        .compileModuleSync(AsyncServerModule);

      renderModuleFactory(moduleFactory, { document: doc }).then(output => {
        expect(clearNgVersion(output)).toMatchSnapshot();
        called = true;
      });
    }));
  });
});

function clearNgVersion(html: string): string {
  return html.replace(/ng-version=\"[^"]+\"/, '');
}

function clearHTML(html: string): string {
  return html.replace(/\<\!--[^>]+--\>/, '');
}


