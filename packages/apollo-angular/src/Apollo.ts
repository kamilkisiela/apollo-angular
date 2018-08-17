import {Injectable, Optional, Inject, NgZone} from '@angular/core';
import {
  ApolloClient,
  QueryOptions,
  WatchQueryOptions,
  MutationOptions,
  ApolloQueryResult,
  SubscriptionOptions,
  ApolloClientOptions,
} from 'apollo-client';
import {FetchResult} from 'apollo-link';
import {Observable, from} from 'rxjs';

import {QueryRef} from './QueryRef';
import {TypedVariables, ExtraSubscriptionOptions, R} from './types';
import {APOLLO_OPTIONS} from './tokens';
import {fromPromise, wrapWithZone, fixObservable} from './utils';

export class ApolloBase<TCacheShape = any> {
  constructor(
    private ngZone: NgZone,
    private _client?: ApolloClient<TCacheShape>,
  ) {}

  public watchQuery<T, V = R>(
    options: WatchQueryOptions & TypedVariables<V>,
  ): QueryRef<T, V> {
    return new QueryRef<T, V>(
      this.client.watchQuery<T>({...options}),
      this.ngZone,
    );
  }

  public query<T, V = R>(
    options: QueryOptions & TypedVariables<V>,
  ): Observable<ApolloQueryResult<T>> {
    return fromPromise<ApolloQueryResult<T>>(() =>
      this.client.query<T>({...options}),
    );
  }

  public mutate<T, V = R>(
    options: MutationOptions & TypedVariables<V>,
  ): Observable<FetchResult<T>> {
    return fromPromise<FetchResult<T>>(() =>
      this.client.mutate<T>({...options}),
    );
  }

  public subscribe(
    options: SubscriptionOptions,
    extra?: ExtraSubscriptionOptions,
  ): Observable<any> {
    const obs = from(fixObservable(this.client.subscribe({...options})));

    return extra && extra.useZone !== true
      ? obs
      : wrapWithZone(obs, this.ngZone);
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
  private map: Map<string, ApolloBase<any>> = new Map<
    string,
    ApolloBase<any>
  >();

  constructor(
    private _ngZone: NgZone,
    @Optional()
    @Inject(APOLLO_OPTIONS)
    apolloOptions?: ApolloClientOptions<any>,
  ) {
    super(_ngZone);

    if (apolloOptions) {
      this.createDefault(apolloOptions);
    }
  }

  public create<TCacheShape>(
    options: ApolloClientOptions<TCacheShape>,
    name?: string,
  ): void {
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

  public createDefault<TCacheShape>(
    options: ApolloClientOptions<TCacheShape>,
  ): void {
    if (this.getClient()) {
      throw new Error('Apollo has been already created.');
    }

    return this.setClient(new ApolloClient<TCacheShape>(options));
  }

  public createNamed<TCacheShape>(
    name: string,
    options: ApolloClientOptions<TCacheShape>,
  ): void {
    if (this.map.has(name)) {
      throw new Error(`Client ${name} has been already created`);
    }
    this.map.set(
      name,
      new ApolloBase(this._ngZone, new ApolloClient<TCacheShape>(options)),
    );
  }
}
