import './_common';

import { TestBed, async } from '@angular/core/testing';
import { NgModule, Component, destroyPlatform, getPlatform } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule, renderModule } from '@angular/platform-server';
import { ApolloClient } from 'apollo-client';

import gql from 'graphql-tag';

import 'rxjs/add/operator/take';

import { ApolloModule, Apollo } from '../src';
import { mockClient } from './_mocks';

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
const client = mockClient({
  request: { query },
  result: { data },
  delay: 500,
});
function provideClient(): ApolloClient {
  return client;
}

@Component({
  selector: 'app',
  template: 'Website: {{text}}',
})
class AsyncServerApp {
  public text = '';

  constructor(
    private apollo: Apollo,
  ) {}

  public ngOnInit() {
    this.apollo.query<any>({ query })
      .take(1)
      .subscribe(result => {
        this.text = result.data.website.status;
      });
  }
}

@NgModule({
  declarations: [AsyncServerApp],
  imports: [
    BrowserModule.withServerTransition({appId: 'async-server'}),
    ServerModule,
    ApolloModule.withClient(provideClient),
  ],
  bootstrap: [AsyncServerApp],
})
class AsyncServerModule {}

describe('integration', () => {
  beforeEach(() => {
    if (getPlatform()) {
      destroyPlatform();
    }

    TestBed.resetTestEnvironment();
  });

  describe('render', () => {
    let doc: string;
    let called: boolean;

    beforeEach(() => {
      doc = '<html><head></head><body><app></app></body></html>';
      called = false;
    });

    afterEach(() => { expect(called).toBe(true); });

    it('using renderModule should work', async(() => {
      renderModule(AsyncServerModule, { document: doc }).then(output => {
        expect(clearNgVersion(output)).toMatchSnapshot();
        called = true;
      });
    }));
  });
});

function clearNgVersion(html: string): string {
  return html.replace(/ng-version=\"[^"]+\"/, '');
}
