/// <reference path="../typings/main.d.ts" />

import {
  Pipe,
} from '@angular/core';

import {
  values,
  isEmpty,
  isObject,
} from 'lodash';

@Pipe({
  name: 'apolloQuery',
})
export class ApolloQueryPipe {
  public transform(obj: any, name: string = '') {
    if (!isObject(obj)) {
      return;
    }

    // an empty object by default
    obj = (obj || {});

    if (isEmpty(name)) {
      return values(obj.data)[0];
    }

    if (obj.data) {
      return obj.data[name];
    }
  }
}
