import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MasterState } from './master.state';

const getMasterState = createFeatureSelector<MasterState>('master');


export const getMaster = createSelector(getMasterState, state => {return state.master});
