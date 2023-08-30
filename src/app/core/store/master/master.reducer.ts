import { createReducer, on, Action } from '@ngrx/store';
import { addToMaster } from './master.action';
import { MasterState } from './master.state';

export const initialState: MasterState = {
  master: []
};

const __masterReducer = createReducer(
  initialState,
  on(addToMaster, (state, { data }) => {
    return {
      ...state,
      master: state.master.concat(data)
    };
  })
);

export function masterReducer(state: MasterState | undefined, action: Action): MasterState {
  return __masterReducer(state, action);
}
