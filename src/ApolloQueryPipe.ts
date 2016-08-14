import { Pipe } from '@angular/core';

@Pipe({
  name: 'apolloQuery',
})
export class ApolloQueryPipe {
  public transform(obj: any, name: string = '') {
    if (obj && name !== '') {
      // for Apollo decorator
      if (obj[name]) {
        return obj[name];
      }

      // for Angular2Apollo.watchQuery
      if (obj.data && obj.data[name]) {
        return obj.data[name];
      }
    }
  }
}
