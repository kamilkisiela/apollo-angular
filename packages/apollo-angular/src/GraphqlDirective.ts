import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil, debounceTime} from 'rxjs/operators';
import {
  ApolloQueryResult,
  FetchPolicy,
  ErrorPolicy,
  NetworkStatus,
  ApolloError,
} from 'apollo-client';

import {Query} from './Query';
import {QueryRef} from './QueryRef';

export interface GraphqlContext<T, V = Record<string, any>> {
  query: QueryRef<T, V>;
  result: ApolloQueryResult<T>;
  loading: boolean;
  networkStatus: NetworkStatus;
  errors: ApolloError;
  data: T;
  load: () => void;
}

function compact(obj: any) {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (obj[key] !== undefined) {
        acc[key] = obj[key];
      }

      return acc;
    },
    {} as any,
  );
}

@Directive({
  selector: '[graphql]',
})
export class GraphqlDirective<T> implements OnInit, OnDestroy, OnChanges {
  @Input() public graphql: Query<T>;
  @Input() public variables?: Record<any, string>;
  @Input() public pollInterval?: number;
  @Input() public notifyOnNetworkStatusChange?: number;
  @Input() public fetchPolicy?: FetchPolicy;
  @Input() public errorPolicy?: ErrorPolicy;
  @Input() public displayName?: string;
  @Input() public context?: Record<string, any> = {};
  @Input() public debounce: number = 0;

  private ngDestroy: Subject<void>;
  private ref: QueryRef<T>;

  constructor(
    private tRef: TemplateRef<GraphqlContext<T>>,
    private vcRef: ViewContainerRef,
  ) {}

  public ngOnInit() {
    this.ngDestroy = new Subject<void>();
    this.initQuery();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if ('graphql' in changes) {
      const {graphql} = changes;

      if (
        graphql.isFirstChange() ||
        typeof graphql.previousValue !== 'function'
      ) {
        return;
      }

      this.ngDestroy.next();
      this.initQuery();
    }
  }

  private initQuery() {
    this.ref = this.graphql.query(this.variables, this.createOptions());

    this.createView({
      loading: true,
    } as any);

    this.ref.valueChanges
      .pipe(takeUntil(this.ngDestroy), debounceTime(this.debounce))
      .subscribe(result => this.handleResult(result));
  }

  private handleResult(result: ApolloQueryResult<T>) {
    this.updateView(result);
  }

  private createView(result: any) {
    this.vcRef.createEmbeddedView(this.tRef, {
      query: this.ref,
      loading: result.loading,
      errors:
        result.errors && result.errors.length > 0
          ? new ApolloError({graphQLErrors: result.errors})
          : null,
      data: result.data,
      networkStatus: result.networkStatus,
      result,
    });
  }

  private updateView(result: ApolloQueryResult<T>) {
    this.createView(result);
  }

  private createOptions() {
    return compact({
      pollInterval: this.pollInterval,
      fetchPolicy: this.fetchPolicy,
      errorPolicy: this.errorPolicy,
      notifyOnNetworkStatusChange: this.notifyOnNetworkStatusChange,
      metadata: {
        // TODO: make the structure of a component framework agnostic
        component: {
          displayName: this.displayName,
        },
        reactComponent: {
          displayName: this.displayName,
        },
      },
      context: this.context,
    });
  }

  public ngOnDestroy() {
    if (this.ngDestroy) {
      this.ngDestroy.next();
      this.ngDestroy.complete();
    }
  }
}
