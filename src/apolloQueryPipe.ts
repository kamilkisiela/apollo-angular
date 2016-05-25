/// <reference path="../typings/main.d.ts" />

import {Pipe} from '@angular/core';

@Pipe({
  name: 'apolloQuery',
})
export class ApolloQueryPipe {
  public transform(obj, args) {
    const name = args[0] || '';

    if (obj && obj.data && name !== '' && obj.data[name]) {
      return obj.data[name];
    }
  }
}
