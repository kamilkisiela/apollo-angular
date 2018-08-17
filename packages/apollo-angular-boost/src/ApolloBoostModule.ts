import {NgModule, Optional, Inject} from '@angular/core';
import {ApolloModule} from 'apollo-angular';
import {HttpLinkModule} from 'apollo-angular-link-http';

import {ApolloBoost} from './ApolloBoost';
import {APOLLO_BOOST_CONFIG} from './tokens';
import {PresetConfig} from './types';

@NgModule({
  imports: [ApolloModule, HttpLinkModule],
  providers: [ApolloBoost],
})
export class ApolloBoostModule {
  constructor(
    boost: ApolloBoost,
    @Optional()
    @Inject(APOLLO_BOOST_CONFIG)
    config?: PresetConfig,
  ) {
    if (config) {
      boost.create(config);
    }
  }
}
