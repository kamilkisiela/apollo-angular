import {Injectable, Optional, Inject, NgZone} from '@angular/core';
import {
  ApolloClient,
  QueryOptions,
  WatchQueryOptions,
  MutationOptions,
  ApolloQueryResult,
  SubscriptionOptions,
  ApolloClientOptions,
  ObservableQuery,
} from 'apollo-client';
import {FetchResult} from 'apollo-link';
import {Observable, from} from 'rxjs';

import {QueryRef} from './QueryRef';
import {ExtraSubscriptionOptions, R} from './types';
import {APOLLO_OPTIONS} from './tokens';
import {fromPromise, wrapWithZone, fixObservable} from './utils';

export class ApolloBase<TCacheShape = any> {
  constructor(
    private ngZone: NgZone,
    private _client?: ApolloClient<TCacheShape>,
  ) {}

  public watchQuery<T, V = R>(options: WatchQueryOptions<V>): QueryRef<T, V> {
    return new QueryRef<T, V>(
      this.client.watchQuery<T, V>({...options}) as ObservableQuery<T, V>,
      this.ngZone,
    );
  }

  public query<T, V = R>(
    options: QueryOptions<V>,
  ): Observable<ApolloQueryResult<T>> {
    return fromPromise<ApolloQueryResult<T>>(() =>
      this.client.query<T, V>({...options}),
    );
  }

  public mutate<T, V = R>(
    options: MutationOptions<T, V>,
  ): Observable<FetchResult<T>> {
    return fromPromise<FetchResult<T>>(() =>
      this.client.mutate<T, V>({...options}),
    );
  }

  public subscribe<T, V = R>(
    options: SubscriptionOptions<V>,
    extra?: ExtraSubscriptionOptions,
  ): Observable<any> {
    const obs = from(fixObservable(this.client.subscribe<T, V>({...options})));

    return extra && extra.useZone !== true
      ? obs
      : wrapWithZone(obs, this.ngZone);
  }

  /**
   * Get an access to an instance of ApolloClient
   */
  public getClient() {
    return this._client;
  }

  /**
   * Set a new instance of ApolloClient
   * Remember to clean up the store before setting a new client.
   *
   * @param client ApolloClient instance
   */
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

  /**
   * Create an instance of ApolloClient
   * @param options Options required to create ApolloClient
   * @param name client's name
   */
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

  /**
   * Use a default ApolloClient
   */
  public default(): ApolloBase<any> {
    return this;
  }

  /**
   * Use a named ApolloClient
   * @param name client's name
   */
  public use(name: string): ApolloBase<any> {
    if (name === 'default') {
      return this.default();
    }
    return this.map.get(name);
  }

  /**
   * Create a default ApolloClient, same as `apollo.create(options)`
   * @param options ApolloClient's options
   */
  public createDefault<TCacheShape>(
    options: ApolloClientOptions<TCacheShape>,
  ): void {
    if (this.getClient()) {
      throw new Error('Apollo has been already created.');
    }

    return this.setClient(new ApolloClient<TCacheShape>(options));
  }

  /**
   * Create a named ApolloClient, same as `apollo.create(options, name)`
   * @param name client's name
   * @param options ApolloClient's options
   */
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

  /**
   * Remember to clean up the store before removing a client
   * @param name client's name
   */
  public removeClient(name: string): boolean {
    return this.map.delete(name);
  }
}
