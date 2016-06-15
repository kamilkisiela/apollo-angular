/// <reference path="../typings/browser.d.ts" />

import {
  Pipe,
} from '@angular/core';

@Pipe({
  name: 'apolloQuery',
})
export class ApolloQueryPipe {
  public transform(obj: any, name: string = '') {
    if (obj && obj.data && name !== '' && obj.data[name]) {
      return obj.data[name];
    }
  }
}
