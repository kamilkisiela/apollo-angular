import {Action} from '@ngrx/store';

import {StoreRecord} from './types';

export const SET = '[Apollo] Set';
export const DELETE = '[Apollo] Delete';
export const CLEAR = '[Apollo] Clear';
export const REPLACE = '[Apollo] Replace';

export class Set implements Action {
  public readonly type = SET;
  constructor(public payload: StoreRecord) {}
}

export class Delete implements Action {
  public readonly type = DELETE;
  constructor(public payload: {id: string}) {}
}

export class Clear implements Action {
  public readonly type = CLEAR;
}

export class Replace implements Action {
  public readonly type = REPLACE;
  constructor(public payload: StoreRecord[]) {}
}

export type Actions = Set | Delete | Clear | Replace;
