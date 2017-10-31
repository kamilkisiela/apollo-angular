import {EntityAdapter, createEntityAdapter} from '@ngrx/entity';

import {StoreRecord, CacheState} from './types';
import {Actions, SET, DELETE, CLEAR, REPLACE} from './actions';

export const adapter: EntityAdapter<StoreRecord> = createEntityAdapter<
  StoreRecord
>({
  selectId: (o: StoreRecord) => o.id,
  sortComparer: false,
});

export const initialState: CacheState = adapter.getInitialState({});

export function reducer(state = initialState, action: Actions): CacheState {
  switch (action.type) {
    case SET: {
      return adapter.addOne(action.payload, state);
    }

    case DELETE: {
      return adapter.removeOne(action.payload.id, state);
    }

    case CLEAR: {
      return adapter.removeAll(state);
    }

    case REPLACE: {
      return adapter.addAll(action.payload, state);
    }

    default: {
      return state;
    }
  }
}
