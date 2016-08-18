import { ObservableQuery } from 'apollo-client/ObservableQuery';

export class ObservableQueryRef {
  private ref: ObservableQuery;

  constructor(ref?: ObservableQuery) {
    if (ref) {
      this.setRef(ref);
    }
  }

  public setRef(ref: ObservableQuery) {
    this.ref = ref;
  }

  public getRef(): ObservableQuery {
    return this.ref;
  }
}
