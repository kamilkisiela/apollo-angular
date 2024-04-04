import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { WatchFragmentOptions, WatchFragmentResult } from '@apollo/client';
import { Apollo } from './apollo';
import type { EmptyObject } from './types';

@Injectable()
export class Fragment<T = {}, V = EmptyObject> {
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public watchFragment(options?: WatchFragmentOptions<T, V>): Observable<WatchFragmentResult<T>> {
    return this.apollo.use(this.client).watchFragment<T, V>(options);
  }
}
