import {CacheState} from './types';
import {Actions, SET, DELETE, CLEAR, REPLACE} from './actions';

export const initialState: CacheState = {};

export function apolloReducer(
  state = initialState,
  action: Actions,
): CacheState {
  switch (action.type) {
    case SET: {
      return {
        ...state,
        [action.payload.id]: action.payload.value,
      };
    }

    case DELETE: {
      return {
        ...state,
        [action.payload.id]: undefined,
      };
    }

    case CLEAR: {
      return initialState;
    }

    case REPLACE: {
      return {
        ...action.payload,
      };
    }

    default: {
      return state;
    }
  }
}
