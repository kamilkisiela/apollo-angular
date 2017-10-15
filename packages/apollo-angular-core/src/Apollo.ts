import {Injectable} from '@angular/core';
import {
  ApolloClient,
  WatchQueryOptions,
  MutationOptions,
  ApolloQueryResult,
  SubscriptionOptions,
} from 'apollo-client';
import {FetchResult} from 'apollo-link';
import {Observable} from 'rxjs/Observable';
import {from} from 'rxjs/observable/from';

import {QueryRef} from './QueryRef';
import {ApolloOptions} from './types';
import {fromPromise} from './utils';

export class ApolloBase<TCacheShape> {
  constructor(private _client?: ApolloClient<TCacheShape>) {}

  public watchQuery<T>(
    options: WatchQueryOptions
  ): QueryRef<T> {
    return new QueryRef<T>(this.client.watchQuery<T>({...options}));
  }

  public query<T>(
    options: WatchQueryOptions
  ): Observable<ApolloQueryResult<T>> {
    return fromPromise<ApolloQueryResult<T>>(() =>
      this.client.query<T>({...options})
    );
  }

  public mutate<T>(options: MutationOptions): Observable<FetchResult<T>> {
    return fromPromise<FetchResult<T>>(() => this.client.mutate<T>({...options}));
  }

  public subscribe(options: SubscriptionOptions): Observable<any> {
    return from(this.client.subscribe({...options}));
  }

  public getClient() {
    return this._client;
  }

  public setClient(client: ApolloClient<TCacheShape>) {
    if (this._client) {
      throw new Error('Client has been already defined');
    }

    this._client = client;
  }

  private get client(): ApolloClient<TCacheShape> {
    this.beforeEach();

    return this._client;
  }

  private beforeEach(): void {
    this.checkInstance();
  }

  private checkInstance(): void {
    if (!this._client) {
      throw new Error('Client has not been defined yet');
    }
  }
}

@Injectable()
export class Apollo extends ApolloBase<any> {
  private map: Map<string, ApolloBase<any>> = new Map<string, ApolloBase<any>>();

  constructor() {
    super();
  }

  public create<TCacheShape>(options: ApolloOptions, name?: string): void {
    if (name && name !== 'default') {
      this.createNamed<TCacheShape>(name, options);
    } else {
      this.createDefault<TCacheShape>(options);
    }
  }

  public default(): ApolloBase<any> {
    return this;
  }

  public use(name: string): ApolloBase<any> {
    if (name === 'default') {
      return this.default();
    }
    return this.map.get(name);
  }

  private createDefault<TCacheShape>(options: ApolloOptions): void {
    if (this.getClient()) {
      throw new Error('Apollo has been already created.');
    }

    return this.setClient(new ApolloClient<TCacheShape>(options as any));
  }

  private createNamed<TCacheShape>(name: string, options: ApolloOptions): void {
    if (this.map.has(name)) {
      throw new Error(`Client ${name} has been already created`);
    }
    this.map.set(name, new ApolloBase(new ApolloClient<TCacheShape>(options as any)));
  }
}
