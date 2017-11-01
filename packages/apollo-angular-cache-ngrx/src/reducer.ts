import {EntityAdapter, createEntityAdapter} from '@ngrx/entity';

import {StoreRecord, CacheState} from './types';
import {Actions, SET, DELETE, CLEAR, REPLACE} from './actions';

const selectId = (o: StoreRecord) => o.id;

export const adapter: EntityAdapter<StoreRecord> = createEntityAdapter<
  StoreRecord
>({
  selectId,
  sortComparer: false,
});

export const initialState: CacheState = adapter.getInitialState({});

export function cacheReducer(
  state = initialState,
  action: Actions,
): CacheState {
  switch (action.type) {
    case SET: {
      const id = selectId(action.payload);

      if (id in state.entities) {
        // XXX adapter.updateOne wouldn't work, it uses Object.assign({}, old, new)
        return adapter.addOne(action.payload, adapter.removeOne(id, state));
      }

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
