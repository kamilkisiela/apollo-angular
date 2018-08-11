import {NgModule} from '@angular/core';
import {ApolloModule} from 'apollo-angular';
import {HttpLinkModule} from 'apollo-angular-link-http';

import {ApolloBoost} from './ApolloBoost';

@NgModule({
  imports: [ApolloModule, HttpLinkModule],
  providers: [ApolloBoost],
})
export class ApolloBoostModule {}
